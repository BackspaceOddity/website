/**
 * Server-side read-back of client submissions for a workspace page.
 *
 * The page is the source of truth, not the visitor's localStorage: on render we
 * pull the latest saved payload per exercise from Supabase (fallback: the dev
 * JSONL written by the exercise route) so submitted content persists ON THE
 * PAGE across devices/sessions and is visible to both the client and us.
 *
 * BSO-560/586 follow-up: closes the "added questions don't stay on the page" gap.
 */
import fs from 'node:fs';
import path from 'node:path';
import { supabase } from '@/lib/supabase';

/** exercise key -> latest payload object */
export type SavedResponses = Record<string, unknown>;

export async function getSavedResponses(slug: string): Promise<SavedResponses> {
  // Primary: Supabase — newest row per exercise wins.
  if (supabase) {
    const { data, error } = await supabase
      .from('exercise_responses')
      .select('exercise, payload, created_at')
      .eq('slug', slug)
      .order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      const out: SavedResponses = {};
      for (const row of data) {
        const ex = (row as { exercise?: string }).exercise;
        if (ex && !(ex in out)) out[ex] = (row as { payload?: unknown }).payload;
      }
      return out;
    }
  }

  // Dev fallback: gitignored JSONL written by the exercise route.
  try {
    const file = path.join(process.cwd(), '.workspace-data', `${slug}-exercises.jsonl`);
    const txt = fs.readFileSync(file, 'utf8');
    const out: SavedResponses = {};
    for (const line of txt.trim().split('\n')) {
      if (!line) continue;
      const row = JSON.parse(line) as { exercise?: string; payload?: unknown };
      if (row.exercise) out[row.exercise] = row.payload; // later line = newer → overwrites
    }
    return out;
  } catch {
    return {};
  }
}

export type MatrixPlacement = { id: string; importance: number; satisfaction: number; label?: string };

/** Extract matrix placements from saved responses, safely. */
export function savedMatrixPlacements(r: SavedResponses, exerciseId: string): MatrixPlacement[] {
  const p = r[exerciseId] as { placements?: unknown } | undefined;
  if (p && Array.isArray(p.placements)) {
    return p.placements.filter(
      (x): x is MatrixPlacement =>
        x !== null &&
        typeof x === 'object' &&
        typeof (x as MatrixPlacement).id === 'string' &&
        typeof (x as MatrixPlacement).importance === 'number' &&
        typeof (x as MatrixPlacement).satisfaction === 'number',
    );
  }
  return [];
}

export type SavedQuestion = { id: string; text: string };

/** Deterministic id for a legacy string question — stable across renders so a
 *  pre-uuid note keeps identity (the client recomputes the same id to match its
 *  own localStorage entry). MUST stay identical to the client-side legacyId()
 *  in blocks.ts (discussion + clientInput). */
export function legacyQuestionId(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 31) + text.charCodeAt(i)) | 0;
  return 'q' + (h >>> 0).toString(36);
}

/** Extract the client's added questions (§07) from saved responses, safely.
 *  New shape: [{id,text}]. Back-compat: legacy string[] rows map to
 *  {id: legacyQuestionId(text), text} so old submissions keep rendering and the
 *  client can still edit/delete them (same id on both sides). BSO-792. */
export function savedQuestions(r: SavedResponses): SavedQuestion[] {
  const p = r['client-questions'] as { questions?: unknown } | undefined;
  if (!p || !Array.isArray(p.questions)) return [];
  const out: SavedQuestion[] = [];
  for (const q of p.questions) {
    if (typeof q === 'string') {
      const text = q.trim();
      if (text) out.push({ id: legacyQuestionId(text), text });
    } else if (q && typeof q === 'object') {
      const obj = q as { id?: unknown; text?: unknown };
      const text = typeof obj.text === 'string' ? obj.text.trim() : '';
      if (!text) continue;
      const id = typeof obj.id === 'string' && obj.id ? obj.id : legacyQuestionId(text);
      out.push({ id, text });
    }
  }
  return out;
}

export type LockAnswer = { q: string; a: string };

/** Extract the discussion-lock answers (§08) from saved responses, safely. */
export function savedDiscussionLock(r: SavedResponses): LockAnswer[] | null {
  const p = r['discussion-lock'] as { answers?: unknown } | undefined;
  if (p && Array.isArray(p.answers) && p.answers.length > 0) {
    const answers = p.answers.filter(
      (x): x is LockAnswer =>
        x !== null &&
        typeof x === 'object' &&
        typeof (x as LockAnswer).q === 'string' &&
        typeof (x as LockAnswer).a === 'string',
    );
    if (answers.length > 0) return answers;
  }
  return null;
}
