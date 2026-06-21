/**
 * Builder-local stub of proposal-workspace/responses.ts — TYPES ONLY.
 *
 * The real module (server) reads saved client responses from fs/Supabase. The
 * builder renders blocks in their default/empty state, so it only needs the
 * types that blocks.ts type-imports. No node/server deps here.
 */
export type SavedResponses = Record<string, unknown>;
export type MatrixPlacement = { id: string; importance: number; satisfaction: number; label?: string };
export type LockAnswer = { q: string; a: string };
