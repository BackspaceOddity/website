#!/usr/bin/env node
/**
 * BSO-658 Landing Builder — end-to-end QA harness.
 *
 * Exercises the REAL published-page client loop against a live dev server
 * (http://localhost:3456) and ASSERTS each step with the Supabase DB as the
 * source of truth (the same service-role path the app uses, read from
 * .env.local). Seeds a throwaway published page (slug `_qa-e2e-<rand>`),
 * runs the loop, and DELETES every test row it created at the end —
 * including on failure (finally block).
 *
 * READ-ONLY w.r.t. app source. It only inserts/deletes its own `_qa-e2e-*`
 * rows in builder_pages + builder_exercise_responses. Never touches /w tables,
 * real pages, or anything else.
 *
 * Run:  node harness/qa-e2e.mjs
 * Exit: 0 if every assertion passes, 1 otherwise.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
const BASE = process.env.QA_BASE || 'http://localhost:3456';

/* ---------- env (mirror lib/supabase.ts: SUPABASE_URL + SERVICE_ROLE_KEY) ---------- */
function loadEnvLocal() {
  const txt = readFileSync(join(REPO, '.env.local'), 'utf8');
  const env = {};
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}
const env = loadEnvLocal();
const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('FATAL: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

/* ---------- assertion bookkeeping ---------- */
const results = [];
function assert(name, pass, detail) {
  results.push({ name, pass: !!pass, detail: detail || '' });
  const tag = pass ? 'PASS' : 'FAIL';
  console.log(`[${tag}] ${name}${detail ? '  — ' + detail : ''}`);
}

/* ---------- fixtures ---------- */
const RAND = Math.random().toString(36).slice(2, 8);
const SLUG = `_qa-e2e-${RAND}`;
const PAGE_ID = `_qa-e2e-page-${RAND}`;
const MATRIX_EX = 'jtbd-matrix';
// A bare token only this run could have placed, used to prove the matrix seed
// round-trips into the rendered HTML (server JSON-serializes it into __seed__).
const MARKER = `qaMarker${RAND}`;

const publishedBlocks = [
  {
    id: 'blk-matrix',
    type: 'ub:exMatrix',
    props: {
      sectionNum: '06 — QA matrix',
      heading: 'QA matrix',
      intro: 'qa',
      exerciseId: MATRIX_EX,
      editable: true,
      jobs: [
        { id: 'approve', label: 'Approving a new merchant' },
        { id: 'verify', label: 'Verifying business documents' },
      ],
    },
  },
  {
    id: 'blk-lock',
    type: 'ub:discussionLock',
    props: {
      sectionNum: '10 — QA decision',
      heading: 'QA decision',
      intro: 'qa',
      questions: [{ q: 'Which job do we solve first?' }],
    },
  },
];

/* ---------- helpers ---------- */
async function post(payload) {
  const r = await fetch(`${BASE}/api/builder/exercise`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let json = null;
  try { json = await r.json(); } catch { /* non-json */ }
  return { status: r.status, json };
}

async function getPublishedHtml(slug) {
  // force-dynamic route; trailing slash + -L to follow the 308.
  const r = await fetch(`${BASE}/published/${slug}/`, { redirect: 'follow' });
  return { status: r.status, html: await r.text() };
}

async function countResponses(slug, exercise) {
  const q = db.from('builder_exercise_responses').select('id', { count: 'exact', head: true }).eq('page_slug', slug);
  const { count, error } = exercise ? await q.eq('exercise', exercise) : await q;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/* ---------- cleanup ---------- */
async function cleanup() {
  await db.from('builder_exercise_responses').delete().eq('page_slug', SLUG);
  await db.from('builder_pages').delete().eq('id', PAGE_ID);
  // belt-and-braces: any stray row that used our slug as a different id
  await db.from('builder_pages').delete().eq('slug', SLUG);
}

/* ---------- main ---------- */
async function main() {
  console.log(`\n=== BSO-658 Landing Builder E2E harness ===`);
  console.log(`base=${BASE}  slug=${SLUG}  page_id=${PAGE_ID}\n`);

  // Pre-clean in case a prior aborted run left rows with this (improbable) slug.
  await cleanup();

  /* (1) create a builder_pages row + publish snapshot (DB = source of truth) */
  {
    const { error } = await db.from('builder_pages').insert({
      id: PAGE_ID,
      title: 'QA E2E',
      slug: SLUG,
      ds: 'urembo',
      published: true,
      published_blocks: publishedBlocks,
      published_styles: {},
      published_title: 'QA E2E',
      published_at: new Date().toISOString(),
      published_by: 'qa-e2e',
    });
    assert('1. create+publish builder_pages row', !error, error ? error.message : `id=${PAGE_ID}`);

    const { data, error: selErr } = await db
      .from('builder_pages')
      .select('slug, published, ds, published_blocks')
      .eq('id', PAGE_ID)
      .maybeSingle();
    assert(
      '1b. row is published in DB with our blocks',
      !selErr && data && data.published === true && data.ds === 'urembo' && Array.isArray(data.published_blocks) && data.published_blocks.length === 2,
      selErr ? selErr.message : `published=${data?.published} ds=${data?.ds} blocks=${data?.published_blocks?.length}`,
    );
  }

  /* (2) GET /published/<slug> -> 200 + DS CSS link present */
  {
    const { status, html } = await getPublishedHtml(SLUG);
    const cssLink = html.includes('/builder-css/urembo.css');
    assert('2. GET /published/<slug> -> 200', status === 200, `status=${status}`);
    assert('2b. published HTML has DS CSS <link> (urembo.css)', cssLink, cssLink ? '/builder-css/urembo.css present' : 'css link missing');
  }

  /* (3) POST /api/builder/exercise valid -> {ok} + row in builder_exercise_responses */
  {
    const before = await countResponses(SLUG, MATRIX_EX);
    const { status, json } = await post({
      slug: SLUG,
      exercise: MATRIX_EX,
      payload: {
        placements: [
          { id: 'approve', importance: 9, satisfaction: 2, label: MARKER },
        ],
      },
    });
    assert('3. POST valid exercise -> 200 {ok:true}', status === 200 && json?.ok === true, `status=${status} body=${JSON.stringify(json)}`);
    const after = await countResponses(SLUG, MATRIX_EX);
    assert('3b. DB row inserted in builder_exercise_responses', after === before + 1, `before=${before} after=${after}`);

    // confirm the stored payload is verbatim (DB source of truth)
    const { data, error } = await db
      .from('builder_exercise_responses')
      .select('payload')
      .eq('page_slug', SLUG)
      .eq('exercise', MATRIX_EX)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const stored = data?.payload?.placements?.[0];
    assert(
      '3c. stored payload matches submission (importance/satisfaction/label)',
      !error && stored && stored.importance === 9 && stored.satisfaction === 2 && stored.label === MARKER,
      error ? error.message : JSON.stringify(stored),
    );
  }

  /* (4) POST to an unpublished/nonexistent slug -> 404 page not published */
  {
    const { status, json } = await post({
      slug: `${SLUG}-does-not-exist`,
      exercise: MATRIX_EX,
      payload: { placements: [] },
    });
    assert('4. POST unpublished slug -> 404', status === 404, `status=${status} body=${JSON.stringify(json)}`);
    // and it must NOT have written a row
    const leaked = await countResponses(`${SLUG}-does-not-exist`, null);
    assert('4b. no row written for unpublished slug', leaked === 0, `rows=${leaked}`);
  }

  /* (5) POST missing payload -> 400 */
  {
    const { status, json } = await post({ slug: SLUG, exercise: MATRIX_EX });
    assert('5. POST missing payload -> 400', status === 400, `status=${status} body=${JSON.stringify(json)}`);
    // also non-object payload must be 400
    const bad = await post({ slug: SLUG, exercise: MATRIX_EX, payload: 'not-an-object' });
    assert('5b. POST non-object payload -> 400', bad.status === 400, `status=${bad.status} body=${JSON.stringify(bad.json)}`);
  }

  /* (6) GET /api/builder/exercise?slug= read-back returns saved questions */
  {
    const questions = [`qa question ${RAND} alpha`, `qa question ${RAND} beta`];
    const w = await post({ slug: SLUG, exercise: 'client-questions', payload: { questions } });
    assert('6-setup. POST client-questions -> 200', w.status === 200 && w.json?.ok === true, `status=${w.status}`);

    const r = await fetch(`${BASE}/api/builder/exercise?slug=${encodeURIComponent(SLUG)}`, { headers: { accept: 'application/json' } });
    let body = null; try { body = await r.json(); } catch { /* */ }
    const got = Array.isArray(body?.questions) ? body.questions : [];
    const ok = r.status === 200 && questions.every((q) => got.includes(q));
    assert('6. GET read-back returns saved questions', ok, `status=${r.status} questions=${JSON.stringify(got)}`);
  }

  /* (7) seed restore: after a matrix POST, the published HTML contains the
   *     placement. RSC escapes quotes, so we grep the bare key `importance`
   *     AND our unescaped marker label, both of which the server serializes
   *     into the inline __seed__ JSON. */
  {
    const { status, html } = await getPublishedHtml(SLUG);
    const hasImportance = html.includes('importance');
    const hasMarker = html.includes(MARKER);
    assert('7. published HTML re-fetch -> 200', status === 200, `status=${status}`);
    assert('7b. matrix seed restored into HTML (bare "importance" present)', hasImportance, hasImportance ? 'found' : 'missing');
    assert('7c. our specific placement label is in the seed', hasMarker, hasMarker ? `found ${MARKER}` : `missing ${MARKER}`);
  }

  /* (8) discussion-lock POST -> locked answer present on re-fetch.
   *
   *     NOTE on mechanism (verified against running server, not assumed):
   *     the exercise widgets (matrix + discussion-lock alike) render their
   *     final markup CLIENT-SIDE — `UremboDiscussionLock` calls useWidget(),
   *     which injects discussion()'s HTML via innerHTML in a useEffect that
   *     only runs in the browser. So the SERVER HTML never contains the
   *     `dl-aa` / `dl-locked` cards; instead it ships the answer inside the
   *     serialized RSC `_seed.lock` prop, which the client widget reads on
   *     hydration to render the locked card. This mirrors exactly how the
   *     matrix seed round-trips (assertion 7). The honest server-side
   *     guarantee is therefore: (a) the answer is persisted in the DB, and
   *     (b) the lock seed (answer text) is delivered into the page payload
   *     under a "lock" key so the client renders it. We assert both. */
  {
    const lockAnswer = `qa locked answer ${RAND}`;
    const w = await post({
      slug: SLUG,
      exercise: 'discussion-lock',
      payload: { answers: [{ q: 'Which job do we solve first?', a: lockAnswer }] },
    });
    assert('8-setup. POST discussion-lock -> 200', w.status === 200 && w.json?.ok === true, `status=${w.status}`);

    // verify it persisted in the DB (source of truth)
    const { data } = await db
      .from('builder_exercise_responses')
      .select('payload')
      .eq('page_slug', SLUG)
      .eq('exercise', 'discussion-lock')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const storedA = data?.payload?.answers?.[0]?.a;
    assert('8b. discussion-lock persisted in DB', storedA === lockAnswer, `stored=${JSON.stringify(storedA)}`);

    const { status, html } = await getPublishedHtml(SLUG);
    // The answer must be present in the served HTML AND carried under the
    // "lock" seed key (the prop the client widget reads to render dl-aa).
    const answerInHtml = html.includes(lockAnswer);
    // The RSC stream escapes quotes (\" ) at varying nesting depths, so match
    // the `lock` seed key tolerant of 0..n backslashes before each quote.
    const lockSeedPresent = /\\*"lock\\*":\s*\[/.test(html);
    assert(
      '8. locked answer delivered into published page seed on re-fetch',
      status === 200 && answerInHtml && lockSeedPresent,
      `status=${status} answerInHtml=${answerInHtml} lockSeedKeyPresent=${lockSeedPresent}`,
    );
  }
}

/* ---------- run ---------- */
let exitCode = 0;
try {
  await main();
} catch (e) {
  assert('UNCAUGHT', false, e?.stack || String(e));
} finally {
  try {
    await cleanup();
    // verify cleanup left nothing behind
    const pages = await db.from('builder_pages').select('id', { count: 'exact', head: true }).eq('slug', SLUG);
    const resp = await db.from('builder_exercise_responses').select('id', { count: 'exact', head: true }).eq('page_slug', SLUG);
    const clean = (pages.count ?? 0) === 0 && (resp.count ?? 0) === 0;
    console.log(`\n[cleanup] removed all _qa-e2e rows — pages=${pages.count ?? 0} responses=${resp.count ?? 0} -> ${clean ? 'CLEAN' : 'RESIDUE!'}`);
    if (!clean) exitCode = 1;
  } catch (e) {
    console.log(`[cleanup] ERROR: ${e?.message || e}`);
    exitCode = 1;
  }
}

const passCount = results.filter((r) => r.pass).length;
const failCount = results.filter((r) => !r.pass).length;
console.log(`\n=== SUMMARY: ${passCount} pass / ${failCount} fail (${results.length} assertions) ===`);
if (failCount > 0) {
  console.log('FAILURES:');
  for (const r of results.filter((x) => !x.pass)) console.log(`  - ${r.name}: ${r.detail}`);
  exitCode = 1;
}
process.exit(exitCode);
