/**
 * 8FIGURES proposal — login screen (GET) + login POST handler.
 *
 * The login screen is the CANONICAL loginHtml() — the same gate the /w
 * workspace serves for every client (Urembo etc.). We never re-implement it.
 *
 * Auth reuses the canonical /w primitives (same password source, same cookie
 * token formula, same cookie name `pw-8figures`, path '/'), so the later
 * migration of the render to /w/8figures needs no re-login and no URL change.
 * Password lives in Supabase (`workspaces`, slug "8figures") with a
 * WS_PW_8FIGURES env fallback for dev.
 */
import { NextResponse } from 'next/server';
import { token, cookieName, loginHtml } from '@/lib/proposal-workspace/chrome';
import { getWorkspacePassword } from '@/lib/proposal-workspace/auth';

const SLUG = '8figures';
const CLIENT_NAME = '8FIGURES — Growth Foundations Sprint';
const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };

function isSecureReq(req: Request): boolean {
  if (req.headers.get('x-forwarded-proto') === 'https') return true;
  try { return new URL(req.url).protocol === 'https:'; } catch { return false; }
}

export async function GET(req: Request) {
  const err = new URL(req.url).searchParams.get('e') === '1';
  return new NextResponse(
    loginHtml({
      clientName: CLIENT_NAME,
      subtitle: 'Backspace Oddity',
      actionPath: '/8figures/login/',
      err,
    }),
    { headers: htmlHeaders },
  );
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

  // Wrong code → back to the canonical gate with an error flag.
  return NextResponse.redirect(new URL('/8figures/login?e=1', req.url), 303);
}
