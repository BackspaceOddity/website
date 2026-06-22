#!/usr/bin/env node
/**
 * Seed the real "Urembo Hub — Initial Assessment" page (BSO-658).
 *
 * Reuses the EXACT UREMBO_PAGE block-list from app/builder/blocks/urembo.tsx —
 * the array is pure data (only the `b()` helper + object/array/string literals,
 * no JSX), so we slice the literal out of the source and eval it with a local
 * `b` definition matching the source helper. This guarantees the seeded blocks
 * match the ported component props 1:1 (no hand-authored drift).
 *
 * Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local (gitignored).
 * The service key is never printed.
 *
 *   node scripts/seed-urembo-hub.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

// --- env (.env.local), same parser as create-builder-users.mjs ---
for (const line of fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1); }

// --- extract UREMBO_PAGE array literal from the .tsx source ---
const src = fs.readFileSync(new URL('../app/builder/blocks/urembo.tsx', import.meta.url), 'utf8');
const start = src.indexOf('export const UREMBO_PAGE = [');
if (start === -1) { console.error('UREMBO_PAGE not found in urembo.tsx'); process.exit(1); }
const arrStart = src.indexOf('[', start);
// match brackets to find the closing ] of the array literal
let depth = 0, end = -1;
for (let i = arrStart; i < src.length; i++) {
  const c = src[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
}
if (end === -1) { console.error('Could not match UREMBO_PAGE array brackets'); process.exit(1); }
const arrayLiteral = src.slice(arrStart, end + 1);

// `b` helper — copied verbatim from urembo.tsx line 231
const b = (id, type, props) => ({ id, type, props, real: true });
// eslint-disable-next-line no-eval
const UREMBO_PAGE = eval('(' + arrayLiteral + ')');
if (!Array.isArray(UREMBO_PAGE) || UREMBO_PAGE.length < 10) {
  console.error('Extracted UREMBO_PAGE looks wrong:', UREMBO_PAGE && UREMBO_PAGE.length);
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const id = 'urembo-hub';
const { data: existing } = await sb.from('builder_pages').select('id').eq('id', id).maybeSingle();
if (existing) console.log(`note: row '${id}' already exists — will upsert (overwrite).`);

const row = {
  id,
  title: 'Urembo Hub — Initial Assessment',
  tab: 'community',
  blocks: UREMBO_PAGE,
  styles: {},
  real_page: null,
  ds: 'urembo',
  archived: false,
  updated_at: new Date().toISOString(),
  updated_by: 'seed@backspaceoddity.com',
};

const { error } = await sb.from('builder_pages').upsert(row, { onConflict: 'id' });
if (error) { console.error('upsert failed:', error.message); process.exit(1); }

// verify
const { data: check, error: cErr } = await sb.from('builder_pages')
  .select('id,title,tab,ds,archived').eq('id', id).maybeSingle();
if (cErr) { console.error('verify failed:', cErr.message); process.exit(1); }
console.log('seeded:', JSON.stringify(check), '· blocks:', UREMBO_PAGE.length);
