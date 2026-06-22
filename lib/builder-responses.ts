/**
 * Server-side read-back of client submissions for a PUBLISHED builder page.
 *
 * Mirrors lib/proposal-workspace/responses.ts but reads the builder's own table
 * (`builder_exercise_responses`, keyed by `page_slug`). Used to seed exercise
 * blocks on render so a returning client sees their prior matrix placements, the
 * locked decision, and their notes — across devices/sessions. BSO-658 Pass 2.
 */
import { supabase } from '@/lib/supabase';

export type SavedResponses = Record<string, unknown>;

export async function getBuilderResponses(slug: string): Promise<SavedResponses> {
  if (!supabase || !slug) return {};
  const { data, error } = await supabase
    .from('builder_exercise_responses')
    .select('exercise, payload, created_at')
    .eq('page_slug', slug)
    .order('created_at', { ascending: false });
  if (error || !Array.isArray(data)) return {};
  const out: SavedResponses = {};
  for (const row of data) {
    const ex = (row as { exercise?: string }).exercise;
    if (ex && !(ex in out)) out[ex] = (row as { payload?: unknown }).payload; // newest row per exercise wins
  }
  return out;
}

export type MatrixPlacement = { id: string; importance: number; satisfaction: number; label?: string };

/** Matrix placements for one exerciseId — minimal fields only (no audio data URLs). */
export function bSavedMatrixPlacements(r: SavedResponses, exerciseId: string): MatrixPlacement[] {
  const p = r[exerciseId] as { placements?: unknown } | undefined;
  if (p && Array.isArray(p.placements)) {
    return p.placements
      .filter(
        (x): x is MatrixPlacement =>
          x !== null && typeof x === 'object' &&
          typeof (x as MatrixPlacement).id === 'string' &&
          typeof (x as MatrixPlacement).importance === 'number' &&
          typeof (x as MatrixPlacement).satisfaction === 'number',
      )
      .map((x) => ({ id: x.id, importance: x.importance, satisfaction: x.satisfaction, label: x.label }));
  }
  return [];
}

/** The client's added questions (client-questions exercise). */
export function bSavedQuestions(r: SavedResponses): string[] {
  const p = r['client-questions'] as { questions?: unknown } | undefined;
  if (p && Array.isArray(p.questions)) {
    return p.questions.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  }
  return [];
}

export type LockAnswer = { q: string; a: string };

/** The locked discussion answers (discussion-lock exercise). */
export function bSavedDiscussionLock(r: SavedResponses): LockAnswer[] | null {
  const p = r['discussion-lock'] as { answers?: unknown } | undefined;
  if (p && Array.isArray(p.answers) && p.answers.length > 0) {
    const answers = p.answers.filter(
      (x): x is LockAnswer =>
        x !== null && typeof x === 'object' &&
        typeof (x as LockAnswer).q === 'string' &&
        typeof (x as LockAnswer).a === 'string',
    );
    if (answers.length > 0) return answers;
  }
  return null;
}
