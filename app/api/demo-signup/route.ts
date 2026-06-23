/**
 * Merz fake-door demo-signup capture (BSO-677).
 *
 * Persists {email, reason} to public.merz_signups via the service-role client,
 * logs a `form_submit` funnel event (same sid as the page's view/click events),
 * and — if SLACK_LEAD_WEBHOOK_URL is set — pings Slack so a signup is noticed
 * live. The visitor always gets `ok` once validation passes; Slack/event
 * failures never block the UX.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // Honeypot — silently accept bots, store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const reason = String(body.reason || '').trim().slice(0, 2000);
  const slug = String(body.slug || 'merz').trim().slice(0, 80) || 'merz';
  const sid = String(body.sid || '').trim().slice(0, 80) || null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'valid email required' }, { status: 400 });
  }
  if (!supabase) {
    console.log('[merz-signup]', JSON.stringify({ email, reason, slug, at: new Date().toISOString() }));
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from('merz_signups').insert({ email, reason: reason || null, slug, sid });
  if (error) {
    console.error('[merz-signup] insert failed', error.message);
    return NextResponse.json({ ok: false, error: 'store failed' }, { status: 500 });
  }

  // Funnel event (best-effort) + Slack ping (best-effort).
  supabase.from('merz_events').insert({ slug, event: 'form_submit', sid, meta: { hasReason: !!reason } }).then(() => {}, () => {});

  const webhook = process.env.SLACK_LEAD_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: `🟢 Merz demo signup — ${email}${reason ? `\n> ${reason}` : ''}` }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
