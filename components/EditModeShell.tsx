'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  EditModeProvider,
  EditToolbar,
  VisualEditPicker,
} from '@/lib/edit-mode/index.js';

/**
 * App-wide Edit Mode mount.
 *
 * BSO-598 — the canonical Edit Mode (Visual + Copy + Tweaks + Send-to-Claude)
 * from the `@backspace-oddity/edit-mode` package replaces the vendored V1 panel
 * (`lib/edit-mode/`, only a Text/Visual toggle) on migrated routes. The rest
 * keep V1 because `app/page.tsx` still consumes the V1 `EditableText` provider.
 *
 * RECURRENCE FIX (2026-06-20): the canonical panel is a LOCAL DEV authoring tool.
 * It is loaded ONLY in development, via a dynamic import INSIDE a
 * `process.env.NODE_ENV !== 'production'` branch. In a production build the
 * bundler inlines NODE_ENV, the branch becomes dead code, and the dynamic
 * import is dropped — so the production build NEVER resolves
 * `@backspace-oddity/edit-mode` and can never fail because of it, regardless of
 * whether the dep is a `file:` or `github:` source. This breaks the loop where
 * "fix the deploy" mechanically removed the canonical route (a static top-level
 * import coupled dev-tooling to the production bundle). Do NOT reintroduce a
 * static top-level import of `@backspace-oddity/edit-mode/build-script` here.
 */

// Route prefixes wired to the canonical panel.
const CANONICAL_ROUTES = ['/8figures'];

function CanonicalEditMode({ slug }: { slug: string }) {
  useEffect(() => {
    // Dev-only. In production this whole branch is dead code (NODE_ENV inlined),
    // so the dynamic import below is dropped from the bundle.
    if (process.env.NODE_ENV !== 'production') {
      if (document.getElementById('bso-canonical-edit-mode')) return;
      let cancelled = false;
      import('@backspace-oddity/edit-mode/build-script')
        .then((mod) => {
          if (cancelled) return;
          const inner = mod.buildScriptInner({
            slug,
            inboxBase: 'http://localhost:8003',
            tweaks: {
              sizes: [
                { k: '--fs-h1', l: 'H1 / Hero', d: 88, min: 32, max: 120 },
                { k: '--fs-h2', l: 'H2 / Section', d: 60, min: 28, max: 96 },
                { k: '--fs-lead', l: 'Lead', d: 28, min: 18, max: 44 },
                { k: '--fs-card', l: 'Card title', d: 21, min: 14, max: 32 },
                { k: '--fs-body', l: 'Body', d: 18, min: 14, max: 24 },
                { k: '--fs-eyebrow', l: 'Eyebrow', d: 18, min: 11, max: 24 },
              ],
              lineHeights: [
                { k: '--lh-h1', l: 'H1 leading', d: 0.92, min: 0.8, max: 1.2 },
                { k: '--lh-h2', l: 'H2 leading', d: 0.9, min: 0.8, max: 1.2 },
                { k: '--lh-body', l: 'Body leading', d: 1.5, min: 1.2, max: 1.9 },
              ],
              weightStyles: [
                { l: 'Display / Headings', w: '--fw-display', s: '--fst-display', wd: 500, sd: 'normal' },
                { l: 'Body', w: '--fw-body', s: '--fst-body', wd: 400, sd: 'normal' },
              ],
              fontFamilies: [
                { k: '--font-display', l: 'Display (Headings)', d: 'GT Eesti Pro Display' },
                { k: '--font-text', l: 'Text (Body)', d: 'GT Eesti Pro Text' },
              ],
              weightOptions: [
                ['400|normal', 'Regular'],
                ['500|normal', 'Medium'],
                ['700|normal', 'Bold'],
                ['400|italic', 'Italic'],
              ],
            },
            tokenMap: [
              { match: '.bt-hero__title', token: '--fs-h1' },
              { match: '.bt-h2', token: '--fs-h2' },
              { match: '.bt-hero__eyebrow', token: '--fs-eyebrow' },
              { match: '.bt-eyebrow', token: '--fs-eyebrow' },
              { match: '.bt-ep__name', token: '--fs-card' },
              { match: '.bt-phase__name', token: '--fs-lead' },
              { match: '.bt-proj__title', token: '--fs-lead' },
              { match: '.bt-intro', token: '--fs-body' },
              { match: '.bt-phase__summary', token: '--fs-body' },
              { match: '.bt-ep__text', token: '--fs-body' },
              { match: '.bt-modules li', token: '--fs-body' },
            ],
          });
          const s = document.createElement('script');
          s.id = 'bso-canonical-edit-mode';
          s.textContent = inner;
          document.body.appendChild(s);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
  }, [slug]);
  return null;
}

export function EditModeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const canonical = CANONICAL_ROUTES.some((p) => pathname.startsWith(p));

  if (canonical) {
    const slug = pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';
    return (
      <>
        {children}
        <CanonicalEditMode slug={slug} />
      </>
    );
  }

  // Legacy V1 path (homepage etc. still depend on the V1 EditableText provider).
  return (
    <EditModeProvider>
      {children}
      <EditToolbar />
      <VisualEditPicker />
    </EditModeProvider>
  );
}
