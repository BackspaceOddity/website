/**
 * Builder session check — returns the signed-in user from the session cookie.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const token = (await cookies()).get('bso_b_sess')?.value;
  // Local-only login shortcut for the screenshot/preview loop. Inert in production
  // (NODE_ENV guard) AND unless BUILDER_DEV_LOGIN is set in the gitignored .env.local
  // — the committed code can never authenticate on its own.
  if (!token && process.env.NODE_ENV !== 'production' && process.env.BUILDER_DEV_LOGIN) {
    return NextResponse.json({ authed: true, email: process.env.BUILDER_DEV_LOGIN, dev: true });
  }
  if (!supabase) return NextResponse.json({ authed: false });
  if (!token) return NextResponse.json({ authed: false });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ authed: false });
  return NextResponse.json({ authed: true, email: data.user.email });
}
