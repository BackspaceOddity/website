/**
 * Interactive Proposal Workspace — generic gated route (v1)
 *
 * /w/<client> → resolves the slug in the client registry, applies the
 * per-client password gate (same sha256-cookie scheme as ajtbd-naming-brief),
 * and renders the page from its block data file.
 *
 * Per-client password lives in the env var named by the registry entry
 * (e.g. WS_PW_UREMBO). If that var is unset, the page serves ungated — a dev
 * convenience that mirrors the ajtbd route.
 *
 * BSO-558 (parent BSO-557).
 */

import { NextResponse } from 'next/server';
import { getClient } from '@/lib/proposal-workspace/clients';
import { renderPage } from '@/lib/proposal-workspace/render';
import { token, getCookie, cookieName, loginHtml } from '@/lib/proposal-workspace/chrome';

const editMode = () => process.env.WS_EDIT_MODE === '1';
const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };

function notFound(): NextResponse {
  return new NextResponse('Not found', { status: 404 });
}

export async function GET(req: Request, ctx: { params: Promise<{ client: string }> }) {
  const { client } = await ctx.params;
  const entry = getClient(client);
  if (!entry) return notFound();

  const accessKey = process.env[entry.passwordEnv] || '';
  const renderHtml = () => new NextResponse(renderPage(entry.page, { editMode: editMode() }), { headers: htmlHeaders });

  // No password configured → serve ungated (dev convenience).
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

  const accessKey = process.env[entry.passwordEnv] || '';
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
