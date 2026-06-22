/**
 * Landing Builder page persistence (BSO-658).
 * GET  — load a saved page's blocks/styles (falls back to {saved:false}).
 * PUT  — upsert the page's blocks/styles. Auth-gated like /api/builder/me.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

async function getEmail(): Promise<string | null> {
  const token = (await cookies()).get('bso_b_sess')?.value;
  if (!token && process.env.NODE_ENV !== 'production' && process.env.BUILDER_DEV_LOGIN) return process.env.BUILDER_DEV_LOGIN;
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error || !data.user ? null : (data.user.email || 'unknown');
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ saved: false });
  const { id } = await ctx.params;
  const { data, error } = await supabase.from('builder_pages').select('*').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ saved: false, error: error.message }, { status: 500 });
  return data ? NextResponse.json({ saved: true, page: data }) : NextResponse.json({ saved: false });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ ok: false, error: 'no-db' }, { status: 503 });
  const { id } = await ctx.params;
  let body: any = {};
  try { body = await req.json(); } catch {}
  const row = {
    id,
    title: body.title ?? null,
    tab: body.tab ?? null,
    blocks: body.blocks ?? [],
    styles: body.styles ?? null,
    real_page: body.realPage ?? null,
    archived: !!body.archived,
    updated_at: new Date().toISOString(),
    updated_by: email,
  };
  const { error } = await supabase.from('builder_pages').upsert(row, { onConflict: 'id' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, updated_at: row.updated_at, updated_by: email });
}

// PATCH — partial update (currently used to archive a page) without rewriting blocks.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ ok: false, error: 'no-db' }, { status: 503 });
  const { id } = await ctx.params;
  let body: any = {};
  try { body = await req.json(); } catch {}
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: email };
  if (typeof body.archived === 'boolean') patch.archived = body.archived;
  if (typeof body.title === 'string') patch.title = body.title;
  const { error } = await supabase.from('builder_pages').update(patch).eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
