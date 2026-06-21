/**
 * Subdomain routing — serves <slug>.backspaceoddity.com as a client workspace.
 *
 * urembo.backspaceoddity.com/           → rewrite to /w/urembo/
 * urembo.backspaceoddity.com/proposal   → rewrite to /w/urembo/  (vanity entry)
 * urembo.backspaceoddity.com/w/urembo/  → passthrough (login POST + post-login)
 * urembo.backspaceoddity.com/fonts/…    → passthrough (static assets)
 *
 * Apex/www, localhost, and *.vercel.app are skipped so the main site and
 * existing /w/<slug> paths keep working without DNS changes.
 *
 * One wildcard DNS record (*.backspaceoddity.com) lights up every client
 * subdomain — no per-client DNS. BSO-583.
 */
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'backspaceoddity.com';

export function proxy(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0];

  const skip =
    host === ROOT_DOMAIN ||
    host === `www.${ROOT_DOMAIN}` ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app');

  if (skip) return NextResponse.next();

  const slug = host.endsWith(`.${ROOT_DOMAIN}`)
    ? host.slice(0, -(`.${ROOT_DOMAIN}`.length))
    : null;

  if (!slug) return NextResponse.next();

  // kern.backspaceoddity.com → the Landing Builder app (the SaaS surface), not a
  // /w/ client page. Bare host serves /builder; everything else (the builder's
  // own routes + assets) passes through to the same app on this host.
  if (slug === 'kern') {
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/builder';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname;

  // Vanity entry points → the client page. Everything else (assets, the /w/
  // login POST + post-login GET) is served by the same app on this host.
  const isEntry = path === '/' || path === '/proposal' || path === '/proposal/';
  if (isEntry) {
    const url = request.nextUrl.clone();
    url.pathname = `/w/${slug}/`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
