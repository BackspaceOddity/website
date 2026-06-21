/**
 * Builder session check — returns the signed-in user from the session cookie.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  if (!supabase) return NextResponse.json({ authed: false });
  const token = (await cookies()).get('bso_b_sess')?.value;
  if (!token) return NextResponse.json({ authed: false });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ authed: false });
  return NextResponse.json({ authed: true, email: data.user.email });
}
