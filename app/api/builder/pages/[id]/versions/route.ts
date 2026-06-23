/**
 * Landing Builder page version history (BSO-682 canonical model #2).
 * GET  — list a page's saved versions (newest first), blocks included so a restore is
 *        a single round-trip (pages are small). Auth-gated like the parent page route.
 * POST — snapshot the current draft as a new version (manual "save as version").
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readSession } from '@/lib/builder-auth';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ versions: [] });
  const { id } = await ctx.params;
  const { data, error } = await supabase
    .from('builder_page_versions')
    .select('id,label,blocks,styles,css_key,title,created_at,created_by')
    .eq('page_id', id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ versions: [], error: error.message }, { status: 500 });
  return NextResponse.json({ versions: data ?? [] });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ ok: false, error: 'no-db' }, { status: 503 });
  const { id } = await ctx.params;
  let body: any = {};
  try { body = await req.json(); } catch {}
  const { data, error } = await supabase.from('builder_page_versions').insert({
    page_id: id,
    label: body.label || 'Manual save',
    blocks: body.blocks ?? [],
    styles: body.styles ?? null,
    css_key: body.css_key ?? null,
    real_page: body.realPage ?? null,
    title: body.title ?? null,
    created_by: email,
  }).select('id').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id });
}
