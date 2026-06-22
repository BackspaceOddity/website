/**
 * Interactive exercise/workshop blocks — React wrappers (BSO-658 Pass 2).
 *
 * Each block's behaviour is the field-tested JetBrains widget, rendered by the
 * verbatim string functions in ./exerciseRender. These thin React components
 * mount that HTML into a ref'd container and re-execute its inline <script> so
 * the handlers run (scripts set via innerHTML do not auto-execute).
 *
 * Render contexts (via _ctx.slug, injected only on published pages):
 *   - Builder canvas (no slug): fully interactive for preview; Save is a no-op
 *     with a "preview — clients save on the published page" note.
 *   - Published page: Save posts to /api/builder/exercise scoped to that slug;
 *     prior answers restore from _seed (server-queried) + localStorage.
 *
 * Known minor: the matrix/rank widgets attach document-level pointer listeners
 * that the verbatim /w code never removes (it assumed a one-shot page load). In
 * the SPA they persist after unmount but early-return on `!drag`, so they are
 * inert — acceptable for a per-client workshop tool; revisit if churn grows.
 */
'use client';

import { useRef, useEffect } from 'react';
import {
  exerciseMatrix, exerciseRank, exerciseChips, exerciseSolutions, discussion, clientInput,
} from './exerciseRender';

type Ctx = { slug?: string } | undefined;
type Seed = { matrix?: Record<string, any[]>; lock?: any[]; questions?: string[] } | undefined;

/** Mount an HTML string and execute its inline scripts; re-run when html changes. */
function useWidget(html: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = html;
    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      s.textContent = old.textContent || '';
      old.parentNode?.replaceChild(s, old);
    });
    return () => { if (el) el.innerHTML = ''; };
  }, [html]);
  return ref;
}

function ctxOf(props: any): { slug: string; live: boolean; seed: Seed } {
  const slug = (props._ctx as Ctx)?.slug || '_preview';
  const live = !!(props._ctx as Ctx)?.slug;
  return { slug, live, seed: props._seed as Seed };
}

export function UremboExMatrix(props: any) {
  const { slug, live, seed } = ctxOf(props);
  const placements = (seed?.matrix && (seed.matrix[props.exerciseId] || seed.matrix['jtbd-matrix'])) || [];
  return <div ref={useWidget(exerciseMatrix(props, slug, placements, live))} />;
}
export function UremboExRank(props: any) {
  const { slug, live } = ctxOf(props);
  return <div ref={useWidget(exerciseRank(props, slug, live))} />;
}
export function UremboExChips(props: any) {
  const { slug, live } = ctxOf(props);
  return <div ref={useWidget(exerciseChips(props, slug, live))} />;
}
export function UremboExSolutions(props: any) {
  const { slug, live } = ctxOf(props);
  return <div ref={useWidget(exerciseSolutions(props, slug, live))} />;
}
export function UremboDiscussionLock(props: any) {
  const { slug, live, seed } = ctxOf(props);
  return <div ref={useWidget(discussion(props, slug, seed?.lock, live))} />;
}
export function UremboClientNotes(props: any) {
  const { slug, seed } = ctxOf(props);
  return <div ref={useWidget(clientInput(props, slug, seed?.questions || []))} />;
}

/* ---------- registration ---------- */
export const UREMBO_EXERCISE_COMPONENTS = {
  'ub:exMatrix': UremboExMatrix,
  'ub:exRank': UremboExRank,
  'ub:exChips': UremboExChips,
  'ub:exSolutions': UremboExSolutions,
  'ub:discussionLock': UremboDiscussionLock,
  'ub:clientNotes': UremboClientNotes,
};
export const UREMBO_EXERCISE_TYPE_NAMES = {
  'ub:exMatrix': 'Exercise — Matrix',
  'ub:exRank': 'Exercise — Rank',
  'ub:exChips': 'Exercise — Chips',
  'ub:exSolutions': 'Exercise — Solutions',
  'ub:discussionLock': 'Discussion — Lock',
  'ub:clientNotes': 'Client notes (read-back)',
};

/* sample props for the Library (real Urembo/JetBrains-shaped workshop content) */
export const UREMBO_EXERCISE_SAMPLES: Record<string, any> = {
  'ub:exMatrix': {
    sectionNum: '06 — Where do these jobs sit?',
    heading: 'Place each job on the grid',
    intro: 'Drag each card onto the matrix — how important the job is to you, and how well it’s handled today. The bottom-right is where the pain lives. Double-click a card to rename it, or add your own.',
    exerciseId: 'jtbd-matrix',
    editable: true,
    jobs: [
      { id: 'approve', label: 'Approving a new merchant' },
      { id: 'verify', label: 'Verifying business documents' },
      { id: 'paystack', label: 'Setting up payment accounts' },
      { id: 'flag', label: 'Catching risky applications' },
      { id: 'activate', label: 'Activating a merchant' },
    ],
  },
  'ub:exRank': {
    sectionNum: '07 — What hurts most?',
    heading: 'Rank the problems inside each job',
    intro: 'For your most underserved jobs, drag the problems into order — most painful at the top. Double-click to edit, or add your own.',
    exerciseId: 'problem-rank',
    editable: true,
    groups: [
      { jobId: 'approve', jobLabel: 'Approving a new merchant', problems: [
        { id: 'a1', label: 'Too many manual checks' }, { id: 'a2', label: 'Slow turnaround' }, { id: 'a3', label: 'Inconsistent decisions' } ] },
      { jobId: 'verify', jobLabel: 'Verifying business documents', problems: [
        { id: 'v1', label: 'Documents come in wrong formats' }, { id: 'v2', label: 'Hard to spot fakes' }, { id: 'v3', label: 'No single place to review' } ] },
      { jobId: 'paystack', jobLabel: 'Setting up payment accounts', problems: [
        { id: 'p1', label: 'Manual sub-account creation' }, { id: 'p2', label: 'Errors mid-setup' }, { id: 'p3', label: 'No confirmation step' } ] },
    ],
  },
  'ub:exChips': {
    sectionNum: '08 — When does this come up?',
    heading: 'Pick the moments that fit — add your own',
    intro: 'Tap everything that applies. If something’s missing, type it in.',
    exerciseId: 'entry-points',
    questions: [
      { id: 'when', q: 'When does onboarding friction bite hardest?', example: 'end of month', options: ['New merchant signs up', 'Bulk imports', 'A document is rejected', 'Payment setup fails'] },
      { id: 'who', q: 'Who feels it first?', singleSelect: true, options: ['The merchant', 'Your ops team', 'Support', 'You'] },
    ],
  },
  'ub:exSolutions': {
    sectionNum: '09 — What do you do today?',
    heading: 'How you handle each job right now',
    intro: 'A sentence each — what the current workaround is. This is what we’re replacing.',
    exerciseId: 'current-solutions',
    jobs: [
      { id: 'approve', label: 'Approving a new merchant', placeholder: 'e.g. a teammate checks each one by hand' },
      { id: 'verify', label: 'Verifying business documents' },
      { id: 'paystack', label: 'Setting up payment accounts' },
    ],
  },
  'ub:discussionLock': {
    sectionNum: '10 — Record the decision',
    heading: 'Our read — and what’s the core of it?',
    intro: 'Answer in your own words and lock it in — this becomes the agreed starting point for the work.',
    addLabel: 'Add your own question',
    questions: [
      { q: 'Which job do we solve first?', note: 'The one that matters most and runs worst.' },
      { q: 'What does “done” look like for that first piece?', note: 'How we’ll both know it worked.' },
      { q: 'Anything we’ve misread about how it works today?', note: 'You know the edge cases we don’t.' },
    ],
  },
  'ub:clientNotes': {
    sectionNum: '07 — Your notes',
    heading: 'Your questions for our next call',
    intro: 'Anything you add on this page shows up here — for you and for us.',
    emptyNote: 'Nothing added yet — your notes from this page will appear here.',
  },
};
