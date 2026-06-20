'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  EditModeProvider,
  EditToolbar,
  VisualEditPicker,
} from '@/lib/edit-mode/index.js';
import { buildScriptInner } from '@backspace-oddity/edit-mode/build-script';

/**
 * App-wide Edit Mode mount.
 *
 * BSO-598 bridge (2026-06-19): routes are migrating off the vendored V1 panel
 * (`lib/edit-mode/`, only a Text/Visual toggle) onto the CANONICAL Edit Mode from
 * the `@backspace-oddity/edit-mode` package (Visual + Copy + Tweaks + Send to
 * Claude). Migrated routes render the canonical panel via `buildScriptInner`; the
 * rest keep V1 until full convergence, because `app/page.tsx` still consumes the
 * V1 `EditableText` provider. Per [[decision-visual-edits-protocol-v1]] there is
 * meant to be exactly ONE Edit Mode everywhere; this split is the temporary
 * bridge tracked in BSO-598.
 */

// Route prefixes already wired to the canonical panel.
const CANONICAL_ROUTES = ['/8figures'];

export function EditModeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const dev = process.env.NODE_ENV !== 'production';
  const canonical = CANONICAL_ROUTES.some((p) => pathname.startsWith(p));

  if (canonical) {
    const slug = pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';
    return (
      <>
        {children}
        {dev && (
          <script
            dangerouslySetInnerHTML={{
              __html: buildScriptInner({
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
                    { l: 'Display / Headings', w: '--fw-display', s: '--fst-display', wd: '500', sd: 'normal' },
                    { l: 'Body', w: '--fw-body', s: '--fst-body', wd: '400', sd: 'normal' },
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
                // hover-over-text → panel shows the text type (token label)
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
              }),
            }}
          />
        )}
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
