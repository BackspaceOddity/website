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
import { getBuilderResponses, bSavedMatrixPlacements, bSavedQuestions, bSavedDiscussionLock } from '@/lib/builder-responses';
import {
  THEME_HEAD_SCRIPT, THEME_TOGGLE_HTML,
  BUILDER_EDIT_SIZES, BUILDER_EDIT_LHS, BUILDER_EDIT_WSTYLE, BUILDER_EDIT_TOKEN_MAP,
} from '@/lib/builder-edit-config';
import PublishedView from './PublishedView';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REAL_CSS: Record<string, string> = { p8fig: 'p8fig', pbt: 'pbt' };
// Fallback when the page isn't one of the two seeded real pages: inject the CSS
// for its design system (bso -> pbt tokens, urembo -> urembo). Without this a
// published Urembo page (where the exercise blocks live) would render unstyled.
const DS_CSS: Record<string, string> = { bso: 'pbt', urembo: 'urembo', kos: 'kos', quiet: 'quiet' };

export default async function PublishedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from('builder_pages')
    .select('published_blocks, published_real_page, published_title, published, published_styles, ds')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error || !data) notFound();

  const blocks = Array.isArray(data.published_blocks) ? data.published_blocks : [];
  const realPage = data.published_real_page as string | null;
  const ds = (data.ds as string | null) || 'bso';
  const cssId = (realPage && REAL_CSS[realPage]) || DS_CSS[ds] || null;

  // Seed the interactive blocks with the client's prior submissions so a
  // returning visitor sees their matrix placements / locked decision / notes.
  const responses = await getBuilderResponses(slug);
  const matrixIds = blocks
    .filter((b: any) => b?.type === 'ub:exMatrix')
    .map((b: any) => b?.props?.exerciseId)
    .filter((x: any): x is string => typeof x === 'string');
  const matrix: Record<string, ReturnType<typeof bSavedMatrixPlacements>> = {};
  for (const id of matrixIds) matrix[id] = bSavedMatrixPlacements(responses, id);
  const seed = { matrix, lock: bSavedDiscussionLock(responses) || undefined, questions: bSavedQuestions(responses) };

  // Workspace chrome — mirrors the live /w shell. Theme toggle is client-facing
  // (always on). The canonical Edit Mode panel (EDIT picker + Aa typography) is
  // DEV-ONLY — a review/comment surface (Send to Claude → inbox :8014); the
  // production client page never resolves the dev tool. Same gate as /w + /builder.
  let editPanel = '';
  if (process.env.NODE_ENV !== 'production') {
    const { buildScriptInner } = await import('@backspace-oddity/edit-mode/build-script');
    editPanel = buildScriptInner({
      slug: 'published-' + slug,
      inboxBase: 'http://localhost:8014',
      tweaks: { sizes: BUILDER_EDIT_SIZES, lineHeights: BUILDER_EDIT_LHS, weightStyles: BUILDER_EDIT_WSTYLE },
      tokenMap: BUILDER_EDIT_TOKEN_MAP,
    } as any);
  }

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_HEAD_SCRIPT }} />
      {(cssId === 'kos' || cssId === 'quiet') && (
        <>
          <link rel="preload" as="font" type="font/otf" crossOrigin="anonymous" href="/fonts/ABCSchengenACyrillic-Medium.otf" />
          <link rel="preload" as="font" type="font/otf" crossOrigin="anonymous" href="/fonts/ABCSchengenACyrillic-Bold.otf" />
        </>
      )}
      {cssId && <link rel="stylesheet" href={'/builder-css/' + cssId + '.css'} />}
      <PublishedView blocks={blocks} styles={data.published_styles} slug={slug} seed={seed} />
      <div dangerouslySetInnerHTML={{ __html: THEME_TOGGLE_HTML }} />
      {editPanel && <script dangerouslySetInnerHTML={{ __html: editPanel }} />}
    </>
  );
}
