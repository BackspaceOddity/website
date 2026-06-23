#!/usr/bin/env node
/**
 * Seed + publish the Merz fake-door landing (BSO-677).
 *
 * Extracts the MERZ_PAGE block-list literal from app/builder/blocks/merz.tsx
 * (pure data — only the `b()` helper + literals) and upserts a builder_pages
 * row that is BOTH the draft and the published snapshot, with slug 'merz' and
 * ds 'bso' (so the published route injects pbt.css). Publishing directly here
 * (instead of via the publish API) guarantees slug === 'merz' to match the
 * page's hardcoded tracking slug + the public URL /published/merz.
 *
 * Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local (gitignored).
 *
 *   node scripts/seed-merz.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

for (const line of fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1); }

// --- extract MERZ_PAGE array literal from the .tsx source ---
const src = fs.readFileSync(new URL('../app/builder/blocks/merz.tsx', import.meta.url), 'utf8');
const start = src.indexOf('export const MERZ_PAGE = [');
if (start === -1) { console.error('MERZ_PAGE not found in merz.tsx'); process.exit(1); }
const arrStart = src.indexOf('[', start);
let depth = 0, end = -1;
for (let i = arrStart; i < src.length; i++) {
  const c = src[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
}
if (end === -1) { console.error('Could not match MERZ_PAGE array brackets'); process.exit(1); }
const arrayLiteral = src.slice(arrStart, end + 1);

const b = (id, type, props) => ({ id, type, props, real: true });
// eslint-disable-next-line no-eval
const MERZ_PAGE = eval('(' + arrayLiteral + ')');
if (!Array.isArray(MERZ_PAGE) || MERZ_PAGE.length < 4) {
  console.error('Extracted MERZ_PAGE looks wrong:', MERZ_PAGE && MERZ_PAGE.length); process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const id = 'merz';
const title = 'Merz — demo';
const row = {
  id, title, tab: 'product', blocks: MERZ_PAGE, styles: {}, real_page: null, ds: 'kos', archived: false,
  // published snapshot (live immediately)
  slug: 'merz', published: true,
  published_blocks: MERZ_PAGE, published_real_page: null, published_title: title, published_styles: {},
  updated_at: new Date().toISOString(), updated_by: 'seed@backspaceoddity.com',
};

const { error } = await sb.from('builder_pages').upsert(row, { onConflict: 'id' });
if (error) { console.error('upsert failed:', error.message); process.exit(1); }

const { data: check, error: cErr } = await sb.from('builder_pages')
  .select('id,slug,title,ds,published,archived').eq('id', id).maybeSingle();
if (cErr) { console.error('verify failed:', cErr.message); process.exit(1); }
console.log('seeded + published:', JSON.stringify(check), '· blocks:', MERZ_PAGE.length);
