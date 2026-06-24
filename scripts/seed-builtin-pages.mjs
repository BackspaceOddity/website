/**
 * One-time seed: materialize the two code built-in pages (p8fig, pbt) as canonical
 * builder_pages rows + a pinned published version (BSO-684, step 2).
 *
 * PURELY ADDITIVE. The builder keeps rendering p8fig/pbt from BT_PAGES (code) and
 * merely overlays this row (which is byte-identical to the code), so nothing changes
 * yet. The live public page (app/8figures + content.ts) does NOT read the DB, so
 * AC#0 (live 8figures untouched) is unaffected by this seed.
 *
 * Idempotent: if a row already exists for an id, it is left alone (no clobber).
 *
 * Plain-JS entry (.mjs, not typechecked by the Next build) that imports the .ts
 * source modules; --experimental-strip-types strips their types at load time.
 *
 * Run:
 *   node --experimental-strip-types --env-file=.env.local scripts/seed-builtin-pages.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { content } from '../app/8figures/content.ts';
import { buildBuiltinPages } from '../app/8figures/builtin-pages.ts';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (use --env-file=.env.local).'); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });
const BY = 'seed-bso-684';

const TITLES = {
  p8fig: '8FIGURES — Brand Sprint',
  pbt: 'Brand transformation',
};

const pages = buildBuiltinPages(content);

for (const id of Object.keys(pages)) {
  const def = pages[id];
  const title = TITLES[id] || id;
  const blocks = def.blocks;
  const cssKey = def.css;

  const { data: existing, error: selErr } = await sb.from('builder_pages').select('id, blocks').eq('id', id).maybeSingle();
  if (selErr) { console.error(`[${id}] select failed:`, selErr.message); process.exit(1); }
  if (existing) {
    const n = Array.isArray(existing.blocks) ? existing.blocks.length : 0;
    console.log(`[${id}] row already exists (${n} blocks) — leaving untouched (idempotent).`);
    continue;
  }

  // 1) canonical page row (draft = published = the same seeded blocks)
  const { error: insErr } = await sb.from('builder_pages').insert({
    id, title, tab: 'bso', ds: 'bso', css_key: cssKey, real_page: id,
    blocks, styles: null, archived: false, updated_by: BY,
  });
  if (insErr) { console.error(`[${id}] insert page failed:`, insErr.message); process.exit(1); }

  // 2) pinned published version (the publish-as-version model, BSO-684 increment 2)
  const { data: ver, error: verErr } = await sb.from('builder_page_versions').insert({
    page_id: id, label: 'Seed — built-in canon (BSO-684)',
    blocks, styles: null, css_key: cssKey, real_page: id, title, created_by: BY,
  }).select('id').single();
  if (verErr) { console.error(`[${id}] insert version failed:`, verErr.message); process.exit(1); }

  // 3) point the page's published_* at the pinned version
  const { error: pubErr } = await sb.from('builder_pages').update({
    published: true, published_version_id: ver.id, published_css_key: cssKey,
    published_blocks: blocks, published_styles: null, published_real_page: id,
    published_title: title, published_by: BY, published_at: new Date().toISOString(),
  }).eq('id', id);
  if (pubErr) { console.error(`[${id}] set published_* failed:`, pubErr.message); process.exit(1); }

  console.log(`[${id}] seeded: ${blocks.length} blocks, css_key=${cssKey}, version=${ver.id}`);
}

console.log('Seed complete.');
process.exit(0);
