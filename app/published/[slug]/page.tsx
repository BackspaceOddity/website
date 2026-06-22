/*
 * Public landing route for a published Landing Builder page (BSO-658).
 * No auth. Fetches the published snapshot by slug, injects the page's per-page
 * stylesheet (p8fig / pbt), and renders the blocks via PublishedView.
 *
 * CSS layering: app/globals.css (loaded globally by the root layout) supplies the
 * fonts (@font-face GT Eesti) and base tokens (--pad-content: 80px, --font-text,
 * --font-display, --radius-block). The per-page <link> below supplies the
 * `.bt-page` token block + all `.bt-*` section styles. The editor-chrome file
 * (app/builder/builder.css) is NOT pulled in — it is scoped to /builder only — so
 * the published page is clean public output with correct gutters and fonts.
 */
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PublishedView from './PublishedView';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REAL_CSS: Record<string, string> = { p8fig: 'p8fig', pbt: 'pbt' };

export default async function PublishedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from('builder_pages')
    .select('published_blocks, published_real_page, published_title, published, published_styles')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error || !data) notFound();

  const blocks = Array.isArray(data.published_blocks) ? data.published_blocks : [];
  const realPage = data.published_real_page as string | null;
  const cssId = realPage && REAL_CSS[realPage] ? REAL_CSS[realPage] : null;

  return (
    <>
      {cssId && <link rel="stylesheet" href={'/builder-css/' + cssId + '.css'} />}
      <PublishedView blocks={blocks} styles={data.published_styles} />
    </>
  );
}
