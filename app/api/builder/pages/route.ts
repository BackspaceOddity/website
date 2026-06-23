/**
 * Landing Builder pages collection (BSO-658).
 * GET — list all saved pages (newest first) so the dashboard reflects the DB,
 *       including pages created from a template. Auth-gated like /api/builder/me.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readSession } from '@/lib/builder-auth';

export const runtime = 'nodejs';

export async function GET() {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ pages: [] });
  try {
    const { data, error } = await supabase
      .from('builder_pages')
      .select('id,title,tab,real_page,ds,archived,updated_at,updated_by')
      .order('updated_at', { ascending: false });
    if (error) return NextResponse.json({ pages: [], error: error.message }, { status: 500 });
    return NextResponse.json({ pages: data ?? [] });
  } catch (e: unknown) {
    return NextResponse.json({ pages: [], error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const email = await readSession();
  if (!email) return NextResponse.json({ authed: false }, { status: 401 });
  if (!supabase) return NextResponse.json({ ok: false, error: 'no-db' }, { status: 503 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const { error } = await supabase.from('builder_pages').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
