/**
 * Landing Builder — publish a page to a public slug (BSO-658).
 * POST — snapshot the saved blocks/styles into the published_* columns and flip
 *        published=true under a slug. Auth-gated like the parent page route.
 * GET  — slug availability check (?slug=foo → { available }).
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

async function getEmail(): Promise<string | null> {
  const token = (await cookies()).get('bso_b_sess')?.value;
  if (!token && process.env.NODE_ENV !== 'production' && process.env.BUILDER_DEV_LOGIN) return process.env.BUILDER_DEV_LOGIN;
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error || !data.user ? null : (data.user.email || 'unknown');
}

function slugify(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 60);
}

export async function GET(req: Request) {
  try {
    if (!supabase) return NextResponse.json({ available: true });
    const slug = slugify(new URL(req.url).searchParams.get('slug') || '');
    if (!slug) return NextResponse.json({ available: false });
    const { data, error } = await supabase
      .from('builder_pages').select('id').eq('published', true).eq('slug', slug).maybeSingle();
    if (error) return NextResponse.json({ available: false, error: error.message }, { status: 500 });
    return NextResponse.json({ available: !data });
  } catch (e: any) {
    return NextResponse.json({ available: false, error: e?.message || 'error' }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const email = await getEmail();
    if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (!supabase) return NextResponse.json({ error: 'no-db' }, { status: 503 });

    const { id } = await ctx.params;
    let body: any = {};
    try { body = await req.json(); } catch {}
    const slug = slugify(body.slug || '');
    if (!slug) return NextResponse.json({ error: 'empty slug' }, { status: 400 });

    // Load the page being published.
    const { data: page, error: loadErr } = await supabase
      .from('builder_pages').select('*').eq('id', id).maybeSingle();
    if (loadErr) return NextResponse.json({ error: loadErr.message }, { status: 500 });
    if (!page) return NextResponse.json({ error: 'page not found' }, { status: 404 });

    // Slug collision: another published row owns this slug.
    const { data: clash, error: clashErr } = await supabase
      .from('builder_pages').select('id').eq('published', true).eq('slug', slug).neq('id', id).maybeSingle();
    if (clashErr) return NextResponse.json({ error: clashErr.message }, { status: 500 });
    if (clash) return NextResponse.json({ error: 'slug taken' }, { status: 409 });

    const publishedAt = new Date().toISOString();
    const { error: upErr } = await supabase.from('builder_pages').update({
      slug,
      published: true,
      published_blocks: page.blocks ?? [],
      published_styles: page.styles ?? null,
      published_real_page: page.real_page ?? null,
      published_title: page.title ?? null,
      published_at: publishedAt,
      published_by: email,
    }).eq('id', id);
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    return NextResponse.json({ url: '/published/' + slug, slug, publishedAt });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}
