/**
 * Builder session check — returns the signed-in user from the session cookie.
 * readSession() refreshes an expired access token and re-writes the rotated
 * cookie, so a reload stays signed in (see lib/builder-auth).
 */
import { NextResponse } from 'next/server';
import { readSession } from '@/lib/builder-auth';

export async function GET() {
  const email = await readSession();
  return NextResponse.json(email ? { authed: true, email } : { authed: false });
}
