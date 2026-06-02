/**
 * Subdomain routing — routes <slug>.backspaceoddity.com to /w/<slug>.
 *
 * urembo.backspaceoddity.com/    → rewrite to /w/urembo
 * backspaceoddity.com/w/urembo  → passes through unchanged
 *
 * Local dev and Vercel preview URLs (.vercel.app) are skipped so existing
 * /w/<slug> paths continue to work without DNS changes.
 */
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'backspaceoddity.com';

export function proxy(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0];

  const isRootOrWww =
    host === ROOT_DOMAIN ||
    host === `www.${ROOT_DOMAIN}`;

  const isLocalOrPreview =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app');

  if (isRootOrWww || isLocalOrPreview) {
    return NextResponse.next();
  }

  // It's a client subdomain — extract slug.
  const slug = host.endsWith(`.${ROOT_DOMAIN}`)
    ? host.slice(0, -(`.${ROOT_DOMAIN}`.length))
    : null;

  if (!slug) return NextResponse.next();

  const path = request.nextUrl.pathname;

  // Don't double-rewrite if the path is already under /w/ (e.g. POST to
  // /w/<slug> from the login form while on a subdomain).
  if (path.startsWith('/w/')) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/w/${slug}${path === '/' ? '' : path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
