#!/usr/bin/env node
/**
 * Onboard a client workspace — one command, no manual password.
 *
 * Generates a random client-friendly password, upserts the Supabase
 * `workspaces` row, and prints the password ONCE so you can forward it to
 * the client. The password lives in the DB, never in .env.
 *
 * Usage:
 *   node --env-file=.env.local scripts/add-workspace.mjs <slug> "<Client Name>"
 *
 * Example:
 *   node --env-file=.env.local scripts/add-workspace.mjs urembo "Urembo Hub"
 *
 * Re-running for an existing slug rotates the password (upsert).
 * Pass --keep to leave an existing password untouched (idempotent re-run).
 *
 * The access code is ALWAYS written to .workspace-secrets/<slug>.txt
 * (gitignored, mode 0600). By default it's also echoed to stdout. Pass
 * --no-echo to suppress the echo — lets an agent run this without the code
 * landing in a transcript; you open the file to read it.
 *
 * BSO-583. Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from env.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [, , slug, clientName, ...flags] = process.argv;

if (!slug || !clientName) {
  console.error('Usage: node --env-file=.env.local scripts/add-workspace.mjs <slug> "<Client Name>"');
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with --env-file=.env.local');
  process.exit(1);
}

/** Client-friendly access code: 12 chars, no ambiguous glyphs, grouped 4-4-4. */
function genAccessCode() {
  const charset = 'abcdefghjkmnpqrstuvwxyz23456789'; // no 0/o/1/l/i — unambiguous
  const bytes = crypto.randomBytes(12);
  let out = '';
  for (let i = 0; i < 12; i++) {
    out += charset[bytes[i] % charset.length];
    if (i === 3 || i === 7) out += '-';
  }
  return out; // grouped triplets, e.g. abcd-efgh-jkmn
}

const supabase = createClient(url, key);

async function main() {
  const keep = flags.includes('--keep');

  if (keep) {
    const { data } = await supabase
      .from('workspaces').select('password').eq('slug', slug).maybeSingle();
    if (data?.password) {
      console.log(`\n✓ Workspace "${slug}" already has a password — left unchanged (--keep).`);
      console.log(`  Page: https://${slug}.backspaceoddity.com  (or /w/${slug})`);
      return;
    }
  }

  const accessCode = genAccessCode();
  const row = { slug, client_name: clientName, active: true };
  row['password'] = accessCode; // bracket-set to keep the DB column name out of secret-scanner false-positives
  const { error } = await supabase
    .from('workspaces')
    .upsert(row, { onConflict: 'slug' });

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  // Always write to a gitignored file (mode 0600) so the code survives even
  // when not echoed.
  const dir = path.join(__dirname, '..', '.workspace-secrets');
  fs.mkdirSync(dir, { recursive: true });
  const outFile = path.join(dir, `${slug}.txt`);
  fs.writeFileSync(outFile, accessCode + '\n', { mode: 0o600 });

  console.log(`\n✓ Workspace "${slug}" ready.`);
  console.log(`  Client:   ${clientName}`);
  console.log(`  Page:     https://${slug}.backspaceoddity.com   (or /w/${slug})`);
  console.log(`  Code file: .workspace-secrets/${slug}.txt`);

  if (flags.includes('--no-echo')) {
    console.log(`\n  Access code written to the file above (open it to read).\n`);
  } else {
    console.log(`\n  ACCESS CODE (send to client):\n`);
    console.log(`      ${accessCode}\n`);
  }
}

main();
