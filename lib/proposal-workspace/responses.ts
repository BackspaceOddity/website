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

/** Extract the client's added questions (§07) from saved responses, safely. */
export function savedQuestions(r: SavedResponses): string[] {
  const p = r['client-questions'] as { questions?: unknown } | undefined;
  if (p && Array.isArray(p.questions)) {
    return p.questions.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  }
  return [];
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
