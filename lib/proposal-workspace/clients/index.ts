/**
 * Interactive Proposal Workspace — client registry (v1)
 *
 * Maps a url slug → its page data file. Password lives in Supabase
 * `workspaces` table (fallback: WS_PW_{SLUG} env var for local dev).
 * Add a client: import its ClientPage and add a row here + a Supabase row.
 *
 * The `_demo` entry is the canonical example of the block library — it renders
 * every v1 block with sample content and doubles as living documentation.
 * Real client pages (e.g. urembo) live in their own files in this folder.
 */

import type { ClientPage } from '../types';
import { demoPage } from './_demo';
import { uremboPage } from './urembo';
import { uremboV2Page } from './urembo-v2';
import { jetbrainsPage } from './jetbrains';
import { eightfiguresPage } from './eightfigures';
import { trashformasPage } from './trashformas';

export interface ClientEntry {
  page: ClientPage;
}

export const clients: Record<string, ClientEntry> = {
  '8figures': { page: eightfiguresPage },
  _demo: { page: demoPage },
  urembo: { page: uremboPage },        // BSO-560 — clean sendable fallback
  'urembo-v2': { page: uremboV2Page }, // experimental: infographic redesign + interactive exercises (parallel track)
  jetbrains: { page: jetbrainsPage },  // Campaign Intelligence workshop Part 1 (discovery) — live session
  trashformas: { page: trashformasPage }, // BSO-793 — migrated from bespoke route (biogas, Nigeria)
};

export function getClient(slug: string): ClientEntry | undefined {
  return clients[slug];
}
