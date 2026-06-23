/**
 * Public exercise-response save endpoint for PUBLISHED Landing Builder pages.
 *
 * POST /api/builder/exercise  { slug: string, exercise: string, payload: object }
 *
 * No login: the client filling in an exercise on a published page is anonymous.
 * Guard instead by requiring `slug` to be an actually-published builder page —
 * responses can only be attached to a live page, not to arbitrary slugs.
 *
 * Append-only. Writes through the service-role key (RLS bypassed). Mirrors the
 * /w `exercise_responses` model (BSO-583); builder counterpart is BSO-658.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getBuilderResponses, bSavedQuestions } from '@/lib/builder-responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Read-back for live polling — the "Your notes" block picks up new submissions
// without a page reload. Returns the client's saved questions for a slug.
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug')?.trim() || '';
  if (!supabase || !slug) {
    return NextResponse.json({ questions: [] }, { headers: { 'cache-control': 'no-store' } });
  }
  const responses = await getBuilderResponses(slug);
  return NextResponse.json(
    { questions: bSavedQuestions(responses) },
    { headers: { 'cache-control': 'no-store' } },
  );
}

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'storage not configured' }, { status: 503 });
  }

  let body: { slug?: string; exercise?: string; payload?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const slug = String(body.slug ?? '').trim();
  const exercise = String(body.exercise ?? '').trim();
  if (!slug) return NextResponse.json({ error: 'missing slug' }, { status: 400 });
  if (!exercise) return NextResponse.json({ error: 'missing exercise' }, { status: 400 });
  if (body.payload == null || typeof body.payload !== 'object') {
    return NextResponse.json({ error: 'missing payload' }, { status: 400 });
  }
  // BSO-668: bound the stored payload so a public POST can't bloat the table.
  // 512KB is generous for matrix placements / rankings / chips / text answers
  // (audio is no longer carried — see BSO-669). True per-slug rate-limiting needs
  // a shared counter store and is tracked separately on the issue.
  if (JSON.stringify(body.payload).length > 512 * 1024) {
    return NextResponse.json({ error: 'payload too large' }, { status: 413 });
  }

  // Guard: only accept responses for a slug that is an actually-published page.
  const { data: page, error: pErr } = await supabase
    .from('builder_pages')
    .select('slug')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
  if (!page) return NextResponse.json({ error: 'page not published' }, { status: 404 });

  const { error } = await supabase
    .from('builder_exercise_responses')
    .insert({ page_slug: slug, exercise, payload: body.payload });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
