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

const editMode = () => process.env.WS_EDIT_MODE === '1';
const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };

function notFound(): NextResponse {
  return new NextResponse('Not found', { status: 404 });
}

export async function GET(req: Request, ctx: { params: Promise<{ client: string }> }) {
  const { client } = await ctx.params;
  const entry = getClient(client);
  if (!entry) return notFound();

  const accessKey = await getWorkspacePassword(client);
  const renderHtml = () => new NextResponse(renderPage(entry.page, { editMode: editMode() }), { headers: htmlHeaders });

  if (!accessKey) return renderHtml();

  if (getCookie(req, cookieName(client)) !== token(accessKey, client)) {
    return new NextResponse(
      loginHtml({ clientName: entry.page.title, subtitle: 'Backspace Oddity', actionPath: `/w/${client}` }),
      { headers: htmlHeaders },
    );
  }
  return renderHtml();
}

export async function POST(req: Request, ctx: { params: Promise<{ client: string }> }) {
  const { client } = await ctx.params;
  const entry = getClient(client);
  if (!entry) return notFound();

  const accessKey = await getWorkspacePassword(client);
  const body = await req.text();
  const entered = new URLSearchParams(body).get('code') ?? '';

  if (accessKey && entered === accessKey) {
    const res = NextResponse.redirect(new URL(`/w/${client}`, req.url), 303);
    res.cookies.set(cookieName(client), token(accessKey, client), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: `/w/${client}`,
    });
    return res;
  }

  return new NextResponse(
    loginHtml({ clientName: entry.page.title, subtitle: 'Backspace Oddity', actionPath: `/w/${client}`, err: true }),
    { headers: htmlHeaders },
  );
}
