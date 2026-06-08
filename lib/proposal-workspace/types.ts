/**
 * Interactive Proposal Workspace — block contract (v1)
 *
 * A per-client page is an ordered list of blocks. Each block carries its own
 * props; the renderer (render.ts) dispatches to a render function per block
 * type. Content lives in `clients/<slug>.ts` data files — never markup.
 *
 * Design source: extracted from app/ajtbd-naming-brief/route.ts.
 * See AI-Native GTM/Client Proposal Agent/deliverables/interactive-proposal-workspace-v1-design.md
 *
 * v1 is static. Blocks that have a stateful v2 form (demo, discussion,
 * results-log) ship their static variant here and are upgraded in v2.
 */

/** Fields marked "rich" accept inline HTML (<strong>, <em>, <a>). All other
 *  string fields are escaped at render time. Keep rich content in data files
 *  we author. */
export type Rich = string;

export interface ClientPage {
  /** url slug → /w/<slug> */
  slug: string;
  /** <title> of the rendered page */
  title: string;
  /** ordered blocks */
  blocks: Block[];
}

export type Block =
  | DocHeaderBlock
  | DividerBlock
  | StatementBlock
  | HeardItBlock
  | BeforeAfterBlock
  | EmphasisFrameBlock
  | NarrativeBlock
  | DemoBlock
  | ProcessFlowBlock
  | PhasesBlock
  | WhatStayedBlock
  | NextStepsBlock
  | DiscussionBlock
  | ClientInputBlock
  | BookingEmbedBlock
  | ExerciseMatrixBlock
  | ExerciseRankBlock
  | ExerciseChipsBlock
  | ExerciseSolutionsBlock
  | DocFooterBlock;

export interface DocHeaderBlock {
  block: 'docHeader';
  label: string;
  meta: string;
  version?: string;
  date?: string;
}

export interface DividerBlock {
  block: 'divider';
}

export interface StatementBlock {
  block: 'statement';
  text: Rich;
}

export interface HeardItBlock {
  block: 'heardIt';
  sectionNum?: string;
  heading: string;
  /** optional framed thesis above the paragraphs */
  statement?: Rich;
  /** body paragraphs (rich) */
  body: Rich[];
  pills?: string[];
}

export interface BeforeAfterBlock {
  block: 'beforeAfter';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  before: { label: string; core: Rich; body?: Rich };
  after: { label: string; core: Rich; body?: Rich };
  note?: Rich;
}

export interface EmphasisFrameBlock {
  block: 'emphasisFrame';
  label: string;
  text: Rich;
  note?: Rich;
}

export interface NarrativeBlock {
  block: 'narrative';
  sectionNum?: string;
  heading: string;
  body: Rich[];
  /** optional structured points rendered as a list after the body */
  bullets?: Rich[];
  /** list marker style when bullets are present (default: disc) */
  bulletStyle?: 'disc' | 'number';
  /** optional pulled-out concrete example */
  example?: Rich;
}

export interface DemoBlock {
  block: 'demo';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  /** v1: raw HTML for the tailored worked example (e.g. a static
   *  cascade-hypotheses illustration on the client's business). v2 upgrades
   *  this to an interactive widget. Authored by us — trusted HTML. */
  html: Rich;
}

/** Visual process-flow infographic: a numbered editorial "spine" of steps.
 *  A step may carry branches (e.g. a decision point) rendered as inset paths.
 *  v1 static; replaces a plain text walkthrough with a scannable diagram. */
export interface ProcessFlowBlock {
  block: 'processFlow';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  steps: {
    title: string;
    desc: Rich;
    /** optional branch paths shown under the step (e.g. decision outcomes).
     *  `primary: true` marks the happy path (heavier left rule). */
    branches?: { label: string; body: Rich; primary?: boolean }[];
  }[];
}

/** Now / Next / Later horizon — a row of phase cards showing how scope expands.
 *  `emphasis: true` marks the current phase (inverted/dark). Editorial, static. */
export interface PhasesBlock {
  block: 'phases';
  phases: { tag: string; title: string; body: Rich; emphasis?: boolean }[];
}

export interface WhatStayedBlock {
  block: 'whatStayed';
  sectionNum?: string;
  heading: string;
  body: Rich[];
}

export interface NextStepsBlock {
  block: 'nextSteps';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  steps: { title: string; desc: Rich }[];
  link?: { href: string; label: string };
}

export interface DiscussionBlock {
  block: 'discussion';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  /** v1: static checklist. v2: form that persists + client adds their own. */
  questions: { q: Rich; note?: Rich }[];
}

/** Read-back display of what the client submitted on this page (§07 questions),
 *  rendered server-side as a readable "What you told us" section. Content comes
 *  from saved responses, not the data file — the block itself holds only framing. */
export interface ClientInputBlock {
  block: 'clientInput';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  /** shown when the client hasn't submitted anything yet */
  emptyNote?: Rich;
}

/** Closing CTA: an inline cal.com booking widget so the client books the next
 *  call without leaving the page. calLink is the cal.com path, e.g.
 *  'team/backspace-oddity/ai-skills'. */
export interface BookingEmbedBlock {
  block: 'bookingEmbed';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  /** cal.com link path after cal.com/ — e.g. 'team/backspace-oddity/deep-dive' */
  calLink: string;
}

/** One-way workshop, Exercise 1: place pre-filled underserved-job cards on a
 *  2-axis matrix (importance × satisfaction). Each placed card takes an
 *  optional comment (typed; voice best-effort). Save persists to the
 *  exercise endpoint. Maps to cascade-hypotheses Block 1 (Underserved JTBD). */
export interface ExerciseMatrixBlock {
  block: 'exerciseMatrix';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  /** stable id stored with the response, e.g. 'jtbd-matrix' */
  exerciseId: string;
  /** x-axis (left→right). Default: satisfaction with current solution */
  axisX?: { label: string; low: string; high: string };
  /** y-axis (bottom→top). Default: importance */
  axisY?: { label: string; low: string; high: string };
  /** pre-filled job cards the client positions */
  jobs: { id: string; label: string }[];
}

/** Exercise 2 — Problems (cascade block 3). For each underserved job, a short
 *  list of problems (max 5) the client drags into rank order, most painful at
 *  top. Saves a per-job ranking. */
export interface ExerciseRankBlock {
  block: 'exerciseRank';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  exerciseId: string;
  groups: { jobId: string; jobLabel: string; problems: { id: string; label: string }[] }[];
}

/** Exercise 3 — Category Entry Points (cascade block 4). The Sharp & Romaniuk
 *  five W-questions (Why / When / Where / With whom / With what). Each question
 *  offers quick-pick chips + add-your-own; multi-select. Saves picks per W. */
export interface ExerciseChipsBlock {
  block: 'exerciseChips';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  exerciseId: string;
  questions: { id: string; q: string; example?: string; options: string[] }[];
}

/** Exercise 4 — Current solutions / competition (cascade block 5). For each job,
 *  "what do you do today?" — a text field per row. Saves { jobId: text }. */
export interface ExerciseSolutionsBlock {
  block: 'exerciseSolutions';
  sectionNum?: string;
  heading: string;
  intro?: Rich;
  exerciseId: string;
  jobs: { id: string; label: string; placeholder?: string }[];
}

export interface DocFooterBlock {
  block: 'docFooter';
  left: string;
  right: string;
}
