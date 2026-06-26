#!/usr/bin/env node
/**
 * Seed + publish the Puma "Runbook" cascade page (BSO-689).
 *
 * One bt:cascade block (the cascade engine carries its own Selfies seed), ds 'puma'
 * + css_key 'puma' (self-contained dark KOS stylesheet at /builder-css/puma.css).
 * Upserts a builder_pages row that is BOTH the draft and the published snapshot,
 * with slug 'puma', plus a pinned builder_page_versions row (canonical model,
 * BSO-684) so the published route renders from the pinned version.
 *
 * Public URL (until the deploy-target / subdomain model lands): /published/puma
 *
 * Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local (gitignored).
 *
 *   node scripts/seed-puma.mjs
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

const sb = createClient(url, key, { auth: { persistSession: false } });

const id = 'puma-runbook';
const slug = 'puma';
const title = 'Puma — Runbook (cascade)';
const cssKey = 'puma';
const BY = 'seed-bso-689';

// The whole base screen is one stateful block; props are content overrides with
// in-component defaults, so an empty props object renders the approved Selfies screen.
const blocks = [{ id: 'puma-cascade', type: 'bt:cascade', props: {}, real: true }];

// 1) canonical page row (draft)
const { error: insErr } = await sb.from('builder_pages').upsert({
  id, title, tab: 'bso', ds: 'puma', css_key: cssKey, real_page: null,
  blocks, styles: {}, archived: false, updated_by: BY, updated_at: new Date().toISOString(),
}, { onConflict: 'id' });
if (insErr) { console.error('upsert page failed:', insErr.message); process.exit(1); }

// 2) pinned published version (publish-as-version model, BSO-684)
const { data: ver, error: verErr } = await sb.from('builder_page_versions').insert({
  page_id: id, label: 'Seed — Puma Runbook base screen (BSO-689)',
  blocks, styles: {}, css_key: cssKey, real_page: null, title, created_by: BY,
}).select('id').single();
if (verErr) { console.error('insert version failed:', verErr.message); process.exit(1); }

// 3) point the page's published_* at the pinned version
const { error: pubErr } = await sb.from('builder_pages').update({
  slug, published: true, published_version_id: ver.id, published_css_key: cssKey,
  published_blocks: blocks, published_styles: {}, published_real_page: null,
  published_title: title, published_by: BY, published_at: new Date().toISOString(),
}).eq('id', id);
if (pubErr) { console.error('set published_* failed:', pubErr.message); process.exit(1); }

const { data: check, error: cErr } = await sb.from('builder_pages')
  .select('id,slug,title,ds,css_key,published,published_version_id,archived').eq('id', id).maybeSingle();
if (cErr) { console.error('verify failed:', cErr.message); process.exit(1); }
console.log('seeded + published:', JSON.stringify(check), '· blocks:', blocks.length, '· version:', ver.id);
process.exit(0);
