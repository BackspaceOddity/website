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
  | WhatStayedBlock
  | NextStepsBlock
  | DiscussionBlock
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

export interface DocFooterBlock {
  block: 'docFooter';
  left: string;
  right: string;
}
