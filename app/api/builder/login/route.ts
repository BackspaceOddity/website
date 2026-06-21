/**
 * Builder sign-in — real email+password auth via Supabase Auth (BSO-659).
 * On success sets an httpOnly session cookie (the Supabase access token).
 * `mode: 'magic'` sends a magic-link email instead (best-effort; needs SMTP).
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const COOKIE = 'bso_b_sess';

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Auth is not configured on this deployment.' }, { status: 503 });
  }
  const body = await req.json().catch(() => ({} as Record<string, string>));
  const email = String(body.email || '').trim().toLowerCase();
  const mode = body.mode === 'magic' ? 'magic' : 'password';

  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid work email.' }, { status: 400 });
  }

  if (mode === 'magic') {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ magic: true });
  }

  const password = String(body.password || '');
  if (!password) return NextResponse.json({ error: 'Enter your password.' }, { status: 400 });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const res = NextResponse.json({ email: data.user?.email });
  res.cookies.set(COOKIE, data.session.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
