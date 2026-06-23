/**
 * Merz fake-door funnel tracking (BSO-677).
 *
 * Logs lightweight funnel events (page_view | cta_click) to public.merz_events
 * via the service-role client. `form_submit` is logged server-side by the
 * demo-signup route, not here. Whitelisted events only; no PII.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const ALLOWED = new Set(['page_view', 'cta_click']);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = String(body.event || '').trim();
  if (!ALLOWED.has(event)) return NextResponse.json({ ok: false, error: 'bad event' }, { status: 400 });

  const slug = String(body.slug || 'merz').trim().slice(0, 80) || 'merz';
  const sid = String(body.sid || '').trim().slice(0, 80) || null;
  const meta = body.meta && typeof body.meta === 'object' ? body.meta : null;

  if (!supabase) return NextResponse.json({ ok: true });

  const { error } = await supabase.from('merz_events').insert({ slug, event, sid, meta });
  if (error) { console.error('[merz-track]', error.message); return NextResponse.json({ ok: false }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
