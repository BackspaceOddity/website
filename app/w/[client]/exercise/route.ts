/**
 * One-way workshop — exercise response save endpoint.
 *
 * POST /w/<client>/exercise  { exercise: string, payload: object }
 *
 * Auth: requires the same gate cookie as the page (the client is already past
 * the password screen). Writes to Supabase `exercise_responses` when
 * configured; falls back to a gitignored local JSONL file for dev so the
 * round-trip is verifiable without Supabase.
 *
 * Append-only — every submit is a new row/line. BSO-583 / one-way workshop.
 */
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getClient } from '@/lib/proposal-workspace/clients';
import { token, getCookie, cookieName } from '@/lib/proposal-workspace/chrome';
import { getWorkspacePassword } from '@/lib/proposal-workspace/auth';
import { supabase } from '@/lib/supabase';

const KNOWN_EXERCISES = new Set([
  'jtbd-matrix',
  'problem-rank',
  'current-solutions',
  'entry-points',
  'client-questions',
]);

export async function POST(req: Request, ctx: { params: Promise<{ client: string }> }) {
  const { client } = await ctx.params;
  const entry = getClient(client);
  if (!entry) return NextResponse.json({ error: 'not found' }, { status: 404 });

  // Auth: the gate cookie must match (skip only when the page itself is ungated).
  const accessKey = await getWorkspacePassword(client);
  if (accessKey && getCookie(req, cookieName(client)) !== token(accessKey, client)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { exercise?: string; payload?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const exercise = String(body.exercise ?? '');
  if (!KNOWN_EXERCISES.has(exercise)) {
    return NextResponse.json({ error: 'unknown exercise' }, { status: 400 });
  }
  if (body.payload == null || typeof body.payload !== 'object') {
    return NextResponse.json({ error: 'missing payload' }, { status: 400 });
  }

  // Primary: Supabase.
  if (supabase) {
    const { error } = await supabase
      .from('exercise_responses')
      .insert({ slug: client, exercise, payload: body.payload });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, stored: 'supabase' });
  }

  // Dev fallback: gitignored local JSONL so the round-trip is verifiable.
  try {
    const dir = path.join(process.cwd(), '.workspace-data');
    fs.mkdirSync(dir, { recursive: true });
    const line = JSON.stringify({
      slug: client,
      exercise,
      payload: body.payload,
      created_at: new Date().toISOString(),
    });
    fs.appendFileSync(path.join(dir, `${client}-exercises.jsonl`), line + '\n');
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: 'local-dev-file' });
}
