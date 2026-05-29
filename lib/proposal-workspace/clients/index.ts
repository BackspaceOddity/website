/**
 * Interactive Proposal Workspace — client registry (v1)
 *
 * Maps a url slug → its page data file + the env var holding its password.
 * Add a client by importing its ClientPage and registering it here.
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
  /** Name of the env var holding this client's password. If the var is unset,
   *  the route serves the page ungated (dev convenience), matching the
   *  ajtbd-naming-brief behaviour. */
  passwordEnv: string;
}

export const clients: Record<string, ClientEntry> = {
  _demo: { page: demoPage, passwordEnv: 'WS_PW_DEMO' },
  urembo: { page: uremboPage, passwordEnv: 'WS_PW_UREMBO' },  // BSO-560 — DRAFT, ungated until WS_PW_UREMBO set
};

export function getClient(slug: string): ClientEntry | undefined {
  return clients[slug];
}
