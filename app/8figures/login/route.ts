/**
 * 8FIGURES proposal — login POST handler.
 *
 * Reuses the canonical /w workspace auth primitives (same password source,
 * same cookie token formula, same cookie name `pw-8figures`, path '/'), so the
 * later migration of the render to /w/8figures needs no re-login and no URL
 * change. Password lives in Supabase (`workspaces`, slug "8figures") with a
 * WS_PW_8FIGURES env fallback for dev.
 */
import { NextResponse } from 'next/server';
import { token, cookieName } from '@/lib/proposal-workspace/chrome';
import { getWorkspacePassword } from '@/lib/proposal-workspace/auth';

const SLUG = '8figures';

function isSecureReq(req: Request): boolean {
  if (req.headers.get('x-forwarded-proto') === 'https') return true;
  try { return new URL(req.url).protocol === 'https:'; } catch { return false; }
}

export async function POST(req: Request) {
  const accessKey = await getWorkspacePassword(SLUG);
  const entered = (new URLSearchParams(await req.text()).get('code') ?? '').trim();

  // Ungated (no password set) or correct code → set cookie, show the proposal.
  if (!accessKey || entered === accessKey) {
    const res = NextResponse.redirect(new URL('/proposal', req.url), 303);
    if (accessKey) {
      res.cookies.set(cookieName(SLUG), token(accessKey, SLUG), {
        httpOnly: true,
        secure: isSecureReq(req),
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 90, // 90 days
        path: '/',
      });
    }
    return res;
  }

  // Wrong code → back to the gate with an error flag.
  return NextResponse.redirect(new URL('/proposal?e=1', req.url), 303);
}
