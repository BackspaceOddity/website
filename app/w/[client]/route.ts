/**
 * Interactive Proposal Workspace — generic gated route (v1)
 *
 * /w/<client>  or  <client>.backspaceoddity.com (via middleware rewrite)
 *
 * Password source (in priority order):
 *   1. Supabase `workspaces` table — authoritative in production
 *   2. WS_PW_{SLUG} env var         — dev fallback / CI without Supabase
 *
 * Empty password → serve ungated (dev convenience).
 *
 * BSO-558 (parent BSO-557). Supabase auth: BSO-577.
 */

import { NextResponse } from 'next/server';
import { getClient } from '@/lib/proposal-workspace/clients';
import { renderPage } from '@/lib/proposal-workspace/render';
import { token, getCookie, cookieName, loginHtml } from '@/lib/proposal-workspace/chrome';
import { getWorkspacePassword } from '@/lib/proposal-workspace/auth';
import { getSavedResponses } from '@/lib/proposal-workspace/responses';

// Edit Mode auto-enables in local dev (NODE_ENV !== 'production'); Vercel
// preview/prod builds run as 'production' so the panel never ships to a client.
// WS_EDIT_MODE=1 forces it on regardless (escape hatch). Per BSO-563 +
// "Edit Mode on every localhost deploy" rule.
const editMode = () => process.env.WS_EDIT_MODE === '1' || process.env.NODE_ENV !== 'production';
const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };

/** Secure cookies only over HTTPS. On local http dev a `secure` cookie is
 *  silently dropped by the browser → login loop. Detect the real protocol. */
function isSecureReq(req: Request): boolean {
  if (req.headers.get('x-forwarded-proto') === 'https') return true;
  try { return new URL(req.url).protocol === 'https:'; } catch { return false; }
}

function notFound(): NextResponse {
  return new NextResponse('Not found', { status: 404 });
}

export async function GET(req: Request, ctx: { params: Promise<{ client: string }> }) {
  const { client } = await ctx.params;
  const entry = getClient(client);
  if (!entry) return notFound();

  const accessKey = await getWorkspacePassword(client);

  // Gate first; only fetch the client's saved submissions once we're going to
  // render the real page (avoids a Supabase round-trip on the login screen).
  if (accessKey && getCookie(req, cookieName(client)) !== token(accessKey, client)) {
    return new NextResponse(
      loginHtml({ clientName: entry.page.title, subtitle: 'Backspace Oddity', actionPath: `/w/${client}/` }),
      { headers: htmlHeaders },
    );
  }

  const responses = await getSavedResponses(client);
  return new NextResponse(
    renderPage(entry.page, { editMode: editMode(), responses }),
    { headers: htmlHeaders },
  );
}

export async function POST(req: Request, ctx: { params: Promise<{ client: string }> }) {
  const { client } = await ctx.params;
  const entry = getClient(client);
  if (!entry) return notFound();

  const accessKey = await getWorkspacePassword(client);
  const body = await req.text();
  // trim: pasting the code from a file/editor often carries a trailing
  // newline or space, which would silently fail the exact match.
  const entered = (new URLSearchParams(body).get('code') ?? '').trim();

  if (accessKey && entered === accessKey) {
    const res = NextResponse.redirect(new URL(`/w/${client}/`, req.url), 303);
    res.cookies.set(cookieName(client), token(accessKey, client), {
      httpOnly: true,
      secure: isSecureReq(req),
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      // path '/' (not /w/<client>/) so the cookie is also sent on the bare
      // subdomain root <slug>.backspaceoddity.com, which proxy.ts rewrites to
      // /w/<slug>. Cookie name is per-client (pw-<slug>) so no cross-unlock.
      path: '/',
    });
    return res;
  }

  return new NextResponse(
    loginHtml({ clientName: entry.page.title, subtitle: 'Backspace Oddity', actionPath: `/w/${client}/`, err: true }),
    { headers: htmlHeaders },
  );
}
