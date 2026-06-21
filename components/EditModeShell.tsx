'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  EditModeProvider,
  EditToolbar,
  VisualEditPicker,
} from '@/lib/edit-mode/index.js';

/**
 * Client-side wrapper around the whole app tree. Mounts:
 *   - EditModeProvider      — shared state for text + visual editing
 *   - EditToolbar           — always-visible toggle UI (text / visual modes)
 *   - VisualEditPicker      — overlay that activates in visual mode: hover
 *                             highlights element, click opens prompt input,
 *                             submits to /api/save-draft with captured
 *                             selector + component + computed styles
 *
 * The provider persists to `_edit-threads.json` in repo root via the API
 * route at `app/api/save-draft/route.ts`. Yegor can pipe that file into the
 * next Claude session for context on what needs to be changed.
 */
export function EditModeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // /builder runs the canonical @backspace-oddity/edit-mode panel injected by its own
  // route (BSO-658). Suppress the legacy global picker there to avoid a double panel.
  if (pathname?.startsWith('/builder')) return <>{children}</>;
  return (
    <EditModeProvider>
      {children}
      <EditToolbar />
      <VisualEditPicker />
    </EditModeProvider>
  );
}
