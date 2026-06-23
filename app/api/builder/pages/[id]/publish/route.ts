/**
 * Landing Builder — publish a page to a public slug (BSO-658).
 * POST — snapshot the saved blocks/styles into the published_* columns and flip
 *        published=true under a slug. Auth-gated like the parent page route.
 * GET  — slug availability check (?slug=foo → { available }).
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readSession } from '@/lib/builder-auth';

export const runtime = 'nodejs';

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
    const email = await readSession();
    if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (!supabase) return NextResponse.json({ error: 'no-db' }, { status: 503 });

    const { id } = await ctx.params;
    let body: any = {};
    try { body = await req.json(); } catch {}
    const slug = slugify(body.slug || '');
    if (!slug) return NextResponse.json({ error: 'empty slug' }, { status: 400 });

    // Load the page being published.
    // BSO-667 (accepted): this SELECT + the UPDATE below are two round-trips, so a save
    // landing between them could publish a pre-save snapshot. Accepted for this single-
    // editor tool — the window is sub-second and the editor auto-saves (debounced 1.4s)
    // before opening Deploy. If concurrent editors arrive, move to an rpc() with
    // SELECT FOR UPDATE (or a version/etag guard on the UPDATE).
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
    // Canonical model (BSO-682 #2): publishing PINS an immutable version snapshot of the
    // current draft. The published_* columns are still dual-written below as a fallback
    // until the render path is fully migrated, but published_version_id is the new truth.
    const { data: ver } = await supabase.from('builder_page_versions').insert({
      page_id: id,
      label: 'Published',
      blocks: page.blocks ?? [],
      styles: page.styles ?? null,
      css_key: page.css_key ?? null,
      real_page: page.real_page ?? null,
      title: page.title ?? null,
      created_by: email,
    }).select('id').single();
    const { error: upErr } = await supabase.from('builder_pages').update({
      slug,
      published: true,
      published_version_id: ver?.id ?? null,
      published_blocks: page.blocks ?? [],
      published_styles: page.styles ?? null,
      published_real_page: page.real_page ?? null,
      published_css_key: page.css_key ?? null, // pin the stylesheet at publish time (BSO-682 canonical model)
      published_title: page.title ?? null,
      published_at: publishedAt,
      published_by: email,
    }).eq('id', id);
    if (upErr) {
      // A concurrent publisher can trip the partial unique index
      // (builder_pages_slug_published_uniq) between the clash check above and this
      // UPDATE — return 409, not a 500 that leaks the Postgres index name (BSO-671).
      if ((upErr as any).code === '23505') return NextResponse.json({ error: 'slug taken' }, { status: 409 });
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ url: '/published/' + slug, slug, publishedAt });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
  }
}
