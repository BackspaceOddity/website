import { NextRequest, NextResponse } from 'next/server';

/**
 * Serve the 8FIGURES proposal at the root of its custom subdomain.
 *
 *   8figures.backspaceoddity.com/  ->  /8figures
 *
 * Matcher is scoped to the root path only, so this has zero effect on any other
 * route, asset, or host. Bind the subdomain to this branch's deployment in Vercel.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  if (host.startsWith('8figures.')) {
    const url = req.nextUrl.clone();
    url.pathname = '/8figures';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  // Only the subdomain root needs rewriting; everything else passes through.
  matcher: ['/'],
};
