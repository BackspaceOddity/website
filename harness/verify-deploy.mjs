/**
 * BSO-658 Landing Builder — publish/deploy end-to-end verification harness.
 *
 * Verifies the just-shipped publish feature on BOTH surfaces:
 *   LIVE  (kern.backspaceoddity.com): public /published/<slug> serve, 404 isolation,
 *         publish route deployed + auth-gated.
 *   LOCAL (dev server): auth-gated publish write -> snapshot -> public serve roundtrip,
 *         slug-collision 409.
 *
 * Secret handling: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are read from .env.local
 * (loaded via `node --env-file=.env.local`). The key value is NEVER printed/logged.
 *
 * Run:  node --env-file=.env.local harness/verify-deploy.mjs
 *       (the script re-execs itself with --env-file if not already loaded)
 */
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const LIVE = 'https://kern.backspaceoddity.com';
const TS = Date.now();
const MARKER = `HVERIFY-MARKER-${TS}`;
const LIVE_ID = `hverify-${TS}`;
const LIVE_SLUG = `hverify-${TS}`;
const LOCAL_SLUG = `hverify-local-${TS}`;
const NONEXISTENT_SLUG = `hverify-nonexistent-${TS}`;
// The collision test publishes a SECOND page to an already-taken slug. The DB
// has only the `p8fig` seed row (no `pbt`), so we seed our own throwaway page
// rather than depend on a second seed page that doesn't exist here.
const COLLIDE_ID = `hverify-collide-${TS}`;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('FATAL: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not in env. Run with: node --env-file=.env.local harness/verify-deploy.mjs');
  process.exit(2);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const results = [];
const add = (name, surface, expected, actual, pass) => results.push({ name, surface, expected, actual, pass });

// A minimal but valid bt:hero block carrying the unique marker in a visible text prop.
const liveBlocks = [
  { id: 'h1', type: 'bt:hero', props: { eyebrow: MARKER, title: 'HVerify live test', subtitle: 'throwaway' }, real: true },
];

let restoreP8 = null; // original published flag for p8fig
let restorePbt = null; // original published flag for pbt
let ownDevServer = null; // child process if we spawn one
let DEV_PORT = 3456;
const DEV_LOGIN = 'harness@bso.dev';

// next.config.ts sets `trailingSlash: true` — every route 308-redirects the
// no-slash form to the slash form. We hit the canonical slash form directly so
// we observe the real status (not a 308) without following redirects.
function slashUrl(base, path) {
  const u = new URL(path, base);
  if (!u.pathname.endsWith('/')) u.pathname += '/';
  return u.toString();
}
async function httpGet(u) {
  const r = await fetch(u, { redirect: 'manual' });
  const body = await r.text();
  return { status: r.status, body };
}
async function httpPostJson(u, obj, headers = {}) {
  const r = await fetch(u, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(obj),
    redirect: 'manual',
  });
  let body = await r.text();
  let json = null;
  try { json = JSON.parse(body); } catch {}
  return { status: r.status, body, json };
}

async function waitForServer(port, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(slashUrl(`http://localhost:${port}`, '/api/builder/pages/p8fig/publish'), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}', redirect: 'manual',
      });
      // A non-308 HTTP response on the slash form means the route is compiled.
      if (r.status && r.status !== 308) return true;
    } catch {}
    await sleep(2000);
  }
  return false;
}

/** Probe whether a localhost dev server (a) has the publish route compiled and
 *  (b) auths via BUILDER_DEV_LOGIN. POST the slash form with an empty slug:
 *   - 400  -> route present AND dev-login active (got past auth, failed on empty slug)
 *   - 401  -> route present but dev-login NOT active
 *   - 404/308 -> route not compiled on this server / not the canonical form
 *  Only 400 means "usable for the write tests". */
async function devLoginActive(port) {
  try {
    const r = await httpPostJson(slashUrl(`http://localhost:${port}`, '/api/builder/pages/p8fig/publish'), { slug: '' });
    return r.status === 400;
  } catch { return false; }
}

async function main() {
  // --- record original published state of the two seed pages, for restore ---
  const { data: seeds } = await sb.from('builder_pages').select('id, published').in('id', ['p8fig', 'pbt']);
  for (const row of seeds || []) {
    if (row.id === 'p8fig') restoreP8 = row.published;
    if (row.id === 'pbt') restorePbt = row.published;
  }

  // ============ LIVE TESTS ============

  // Test 1: live-serve-published — seed throwaway published row, GET it on kern.
  try {
    await sb.from('builder_pages').delete().eq('id', LIVE_ID); // idempotent
    const { error: insErr } = await sb.from('builder_pages').insert({
      id: LIVE_ID,
      slug: LIVE_SLUG,
      published: true,
      published_real_page: 'p8fig',
      published_blocks: liveBlocks,
      published_title: 'HVerify live',
    });
    if (insErr) throw new Error('seed insert failed: ' + insErr.message);
    // Give the force-dynamic route a beat; it reads DB fresh each request.
    const r = await httpGet(slashUrl(LIVE, `/published/${LIVE_SLUG}`));
    const hasMarker = r.body.includes(MARKER);
    const hasCss = r.body.includes('/builder-css/p8fig.css');
    add('live-serve-published', 'LIVE kern', 'HTTP 200 + body contains marker',
      `HTTP ${r.status}; marker=${hasMarker}; p8fig-css-link=${hasCss}` + (hasMarker ? ` ["${MARKER}"]` : ''),
      r.status === 200 && hasMarker);
  } catch (e) {
    add('live-serve-published', 'LIVE kern', 'HTTP 200 + marker', 'ERROR: ' + e.message, false);
  }

  // Test 2: live-isolation-unpublished — unknown slug must 404.
  try {
    const r = await httpGet(slashUrl(LIVE, `/published/${NONEXISTENT_SLUG}`));
    add('live-isolation-unpublished', 'LIVE kern', 'HTTP 404', `HTTP ${r.status}`, r.status === 404);
  } catch (e) {
    add('live-isolation-unpublished', 'LIVE kern', 'HTTP 404', 'ERROR: ' + e.message, false);
  }

  // Test 3: live-route-deployed-and-authgated — POST publish, no cookie -> 401 (not 404).
  try {
    const r = await httpPostJson(slashUrl(LIVE, '/api/builder/pages/p8fig/publish'), { slug: 'x' });
    add('live-route-deployed-and-authgated', 'LIVE kern', 'HTTP 401 (route deployed + auth gate)',
      `HTTP ${r.status}` + (r.json?.error ? ` {error:"${r.json.error}"}` : ''), r.status === 401);
  } catch (e) {
    add('live-route-deployed-and-authgated', 'LIVE kern', 'HTTP 401', 'ERROR: ' + e.message, false);
  }

  // ============ LOCAL TESTS ============

  // Find a dev server that has the publish route compiled AND dev-login active.
  // (A pre-existing dev server may be stale / lack BUILDER_DEV_LOGIN — devLoginActive
  //  returns true ONLY on a 400, i.e. route present + auth passed.)
  let usablePort = null;
  for (const p of [3463, 3456, 3460, 3461]) {
    if (await devLoginActive(p)) { usablePort = p; break; }
  }
  if (!usablePort) {
    // Spawn a fresh dev server with the env set. Use the `next` binary directly:
    // the package.json `dev` script hardcodes `-p 3456`, so `npm run dev -- -p N`
    // would NOT change the port. Invoke next directly to control the port.
    DEV_PORT = 3464;
    const nextBin = './node_modules/.bin/next';
    ownDevServer = spawn(nextBin, ['dev', '-p', String(DEV_PORT)], {
      cwd: process.cwd(),
      env: { ...process.env, BUILDER_DEV_LOGIN: DEV_LOGIN, NODE_ENV: 'development' },
      stdio: 'ignore',
      detached: false,
    });
    const up = await waitForServer(DEV_PORT);
    if (up && await devLoginActive(DEV_PORT)) usablePort = DEV_PORT;
  }

  if (!usablePort) {
    add('local-publish-roundtrip', 'LOCAL dev', 'HTTP 200 + serve p8fig content',
      'COULD NOT RUN: no dev server with BUILDER_DEV_LOGIN reachable on 3456/3460/3461 and spawn failed', false);
    add('local-slug-collision', 'LOCAL dev', 'HTTP 409', 'COULD NOT RUN: no usable dev server', false);
  } else {
    const base = `http://localhost:${usablePort}`;

    // Test 4: local-publish-roundtrip — publish p8fig via dev auth, then serve it.
    try {
      const pub = await httpPostJson(slashUrl(base, '/api/builder/pages/p8fig/publish'), { slug: LOCAL_SLUG });
      const pubOk = pub.status === 200 && pub.json && typeof pub.json.url === 'string';
      let serveStatus = null, hasContent = false, snippet = '';
      if (pubOk) {
        const r = await httpGet(slashUrl(base, `/published/${LOCAL_SLUG}`));
        serveStatus = r.status;
        hasContent = r.body.includes('Growth foundations sprint');
        if (hasContent) snippet = 'Growth foundations sprint';
      }
      add('local-publish-roundtrip', `LOCAL dev :${usablePort}`,
        'publish 200 {url} + serve 200 w/ p8fig content',
        `publish HTTP ${pub.status}` + (pub.json?.url ? ` url="${pub.json.url}"` : '') +
          (pubOk ? `; serve HTTP ${serveStatus}; content=${hasContent}` + (snippet ? ` ["${snippet}"]` : '') : ''),
        pubOk && serveStatus === 200 && hasContent);
    } catch (e) {
      add('local-publish-roundtrip', `LOCAL dev :${usablePort}`, 'publish 200 + serve 200', 'ERROR: ' + e.message, false);
    }

    // Test 5: local-slug-collision — a DIFFERENT page tries to publish to the slug
    // p8fig now owns (test 4 left p8fig published=true, slug=LOCAL_SLUG) -> 409.
    // Seed a throwaway second page first (the DB has no `pbt` row in this env).
    try {
      await sb.from('builder_pages').delete().eq('id', COLLIDE_ID); // idempotent
      const { error: seedErr } = await sb.from('builder_pages').insert({
        id: COLLIDE_ID, real_page: 'p8fig', blocks: [], published: false,
      });
      if (seedErr) throw new Error('collide-seed insert failed: ' + seedErr.message);
      const r = await httpPostJson(slashUrl(base, `/api/builder/pages/${COLLIDE_ID}/publish`), { slug: LOCAL_SLUG });
      add('local-slug-collision', `LOCAL dev :${usablePort}`, 'HTTP 409 (slug owned by another published page)',
        `HTTP ${r.status}` + (r.json?.error ? ` {error:"${r.json.error}"}` : ''), r.status === 409);
    } catch (e) {
      add('local-slug-collision', `LOCAL dev :${usablePort}`, 'HTTP 409', 'ERROR: ' + e.message, false);
    }
  }
}

async function cleanup() {
  const log = [];
  try {
    // Delete throwaway rows (live serve row + collision-test row).
    for (const tid of [LIVE_ID, COLLIDE_ID]) {
      const { error: delErr } = await sb.from('builder_pages').delete().eq('id', tid);
      log.push(delErr ? `delete ${tid}: ERR ${delErr.message}` : `deleted throwaway row ${tid}`);
    }

    // Unpublish + clear snapshot/slug on the two seed pages, restoring original published flag.
    for (const [id, orig] of [['p8fig', restoreP8], ['pbt', restorePbt]]) {
      const { error } = await sb.from('builder_pages').update({
        published: orig === null || orig === undefined ? false : orig,
        slug: null,
        published_blocks: null,
        published_styles: null,
        published_real_page: null,
        published_title: null,
        published_at: null,
        published_by: null,
      }).eq('id', id);
      log.push(error ? `restore ${id}: ERR ${error.message}` : `restored ${id} published=${orig}`);
    }

    // Verify restored state.
    const { data: after } = await sb.from('builder_pages').select('id, published, slug').in('id', ['p8fig', 'pbt', LIVE_ID, COLLIDE_ID]);
    const throwawayGone = !(after || []).some((r) => r.id === LIVE_ID || r.id === COLLIDE_ID);
    log.push(`verify: ${after?.map((r) => `${r.id}(pub=${r.published},slug=${r.slug ?? 'null'})`).join(' ')}; throwaway-gone=${throwawayGone}`);
  } catch (e) {
    log.push('CLEANUP ERROR: ' + e.message);
  }
  if (ownDevServer) { try { ownDevServer.kill('SIGTERM'); log.push('stopped spawned dev server'); } catch {} }
  return log;
}

(async () => {
  let cleanupLog = [];
  try {
    await main();
  } catch (e) {
    console.error('HARNESS FATAL (pre-cleanup):', e.message);
  } finally {
    cleanupLog = await cleanup();
  }

  const allPass = results.length === 5 && results.every((r) => r.pass);
  console.log('\n================ BSO-658 PUBLISH/DEPLOY VERIFICATION ================\n');
  for (const r of results) {
    console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.name}  (${r.surface})`);
    console.log(`        expected: ${r.expected}`);
    console.log(`        actual:   ${r.actual}\n`);
  }
  console.log('---- CLEANUP ----');
  for (const l of cleanupLog) console.log('  ' + l);
  console.log(`\nOVERALL: ${allPass ? 'PASS (all 5)' : 'FAIL'}  [${results.filter((r) => r.pass).length}/5 passed]`);
  console.log(JSON.stringify({ results, cleanup: cleanupLog, allPass }, null, 0));
  process.exit(allPass ? 0 : 1);
})();
