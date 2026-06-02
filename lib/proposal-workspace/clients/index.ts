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

export interface ClientEntry {
  page: ClientPage;
}

export const clients: Record<string, ClientEntry> = {
  _demo: { page: demoPage },
  urembo: { page: uremboPage },  // BSO-560 — DRAFT, ungated until Supabase workspaces row has password
};

export function getClient(slug: string): ClientEntry | undefined {
  return clients[slug];
}
