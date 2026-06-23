/**
 * Landing Builder saved-template library (BSO-658).
 * Shared library — every authed builder user reads/writes the same rows.
 * GET    — list all templates, newest first.
 * POST   — save a section as a reusable template.
 * DELETE — remove a template by ?id=.
 * Auth-gated like /api/builder/pages.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readSession } from '@/lib/builder-auth';

export const runtime = 'nodejs';

export async function GET() {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ templates: [] });
  try {
    const { data, error } = await supabase
      .from('builder_templates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ templates: [], error: error.message }, { status: 500 });
    return NextResponse.json({ templates: data ?? [] });
  } catch (e: unknown) {
    return NextResponse.json({ templates: [], error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ ok: false, error: 'no-db' }, { status: 503 });
  let body: { name?: string; type?: string; props?: unknown; bg?: string } = {};
  try { body = await req.json(); } catch {}
  if (!body.type) return NextResponse.json({ ok: false, error: 'type required' }, { status: 400 });
  const row = {
    id: 'tpl_' + crypto.randomUUID(),
    name: (body.name && String(body.name).trim()) || 'Untitled section',
    type: body.type,
    props: body.props ?? {},
    bg: body.bg ?? null,
    created_by: email,
    created_at: new Date().toISOString(),
  };
  try {
    const { data, error } = await supabase.from('builder_templates').insert(row).select().single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ template: data });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ ok: false, error: 'no-db' }, { status: 503 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  try {
    const { error } = await supabase.from('builder_templates').delete().eq('id', id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
