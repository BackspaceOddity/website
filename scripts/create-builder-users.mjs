#!/usr/bin/env node
/**
 * Create/refresh builder team accounts in Supabase Auth (BSO-659).
 * Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + BUILDER_SEED_PW from
 * .env.local (gitignored). The password never travels through chat — you set
 * BUILDER_SEED_PW yourself. Idempotent: updates the password if the user exists.
 *
 *   node scripts/create-builder-users.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

for (const line of fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pw = process.env.BUILDER_SEED_PW;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1); }
if (!pw) { console.error('Set BUILDER_SEED_PW=<your temp password> in .env.local first (never committed).'); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });
const team = ['yegor', 'anna', 'lieke', 'marnix'].map((n) => `${n}@backspaceoddity.com`);

const { data: list, error: listErr } = await sb.auth.admin.listUsers({ perPage: 200 });
if (listErr) { console.error('listUsers failed:', listErr.message); process.exit(1); }

for (const email of team) {
  const existing = list.users.find((u) => u.email === email);
  if (existing) {
    const { error } = await sb.auth.admin.updateUserById(existing.id, { password: pw, email_confirm: true });
    console.log(error ? `ERR update ${email}: ${error.message}` : `updated  ${email}`);
  } else {
    const { error } = await sb.auth.admin.createUser({ email, password: pw, email_confirm: true });
    console.log(error ? `ERR create ${email}: ${error.message}` : `created  ${email}`);
  }
}
console.log('done — sign in with email + BUILDER_SEED_PW');
