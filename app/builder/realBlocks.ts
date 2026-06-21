/**
 * Real block catalog + renderer for the Landing Builder (BSO-658).
 *
 * The builder canvas renders pages through the REAL proposal-workspace renderer
 * (lib/proposal-workspace/blocks.ts + styles.ts) — single source of truth, no
 * re-implementation (avoids the Claude-Design port-discipline trap where
 * hand-rebuilt blocks drift visually). Mirrors render.ts's dispatch exactly.
 *
 * Default content is BSO-voice placeholder — never client-specific, never the
 * prototype's old-brand marketing copy.
 */
import * as B from '@/lib/proposal-workspace/blocks';
import { styles } from '@/lib/proposal-workspace/styles';
import type { Block } from '@/lib/proposal-workspace/types';

const SLUG = 'builder-preview';

/** Render one real block to HTML. Mirrors render.ts renderBlock dispatch. */
export function renderOne(b: Block): string {
  switch (b.block) {
    case 'docHeader': return B.docHeader(b);
    case 'divider': return B.divider(b);
    case 'statement': return B.statement(b);
    case 'heardIt': return B.heardIt(b);
    case 'beforeAfter': return B.beforeAfter(b);
    case 'emphasisFrame': return B.emphasisFrame(b);
    case 'narrative': return B.narrative(b);
    case 'demo': return B.demo(b);
    case 'processFlow': return B.processFlow(b);
    case 'phases': return B.phases(b);
    case 'whatStayed': return B.whatStayed(b);
    case 'nextSteps': return B.nextSteps(b);
    case 'discussion': return B.discussion(b, SLUG);
    case 'exerciseMatrix': return B.exerciseMatrix(b, SLUG);
    case 'exerciseRank': return B.exerciseRank(b, SLUG);
    case 'exerciseChips': return B.exerciseChips(b, SLUG);
    case 'exerciseSolutions': return B.exerciseSolutions(b, SLUG);
    case 'docFooter': return B.docFooter(b);
    default: return '';
  }
}

/** Full standalone page HTML (real DS) for the canvas iframe. */
export function renderPageHtml(blocks: Block[]): string {
  const body = blocks.map(renderOne).join('\n');
  return `<!DOCTYPE html><html lang="en" data-builder-preview><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${styles}
  body{padding-top:48px;padding-bottom:120px;}
  .__bp-empty{max-width:860px;margin:120px auto;text-align:center;font-family:var(--mono);font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-40);}
  </style></head><body>${body || '<div class="__bp-empty">Empty page — add a section from the library</div>'}</body></html>`;
}

export type BlockType = Block['block'];

export interface CatalogEntry {
  type: BlockType;
  name: string;
  desc: string;
  make: () => Block; // real block fields; the builder adds an id wrapper
}

/** The library — our real proposal-workspace block types with BSO-voice defaults. */
export const CATALOG: CatalogEntry[] = [
  { type: 'docHeader', name: 'Doc header', desc: 'Label · meta · version/date masthead', make: () => ({ block: 'docHeader', label: 'Proposal', meta: 'Prepared by Backspace Oddity', version: 'v1', date: '2026' }) },
  { type: 'statement', name: 'Statement', desc: 'A single sharp framing sentence', make: () => ({ block: 'statement', text: 'A single sentence that frames the whole page.' }) },
  { type: 'heardIt', name: 'What we heard', desc: 'Heading + paragraphs + theme pills', make: () => ({ block: 'heardIt', sectionNum: '01', heading: 'What we heard', body: ['A paragraph capturing the core of the conversation.', 'A second paragraph that sharpens it.'], pills: ['Theme one', 'Theme two'] }) },
  { type: 'beforeAfter', name: 'Before / after', desc: 'Two-column today → with us', make: () => ({ block: 'beforeAfter', sectionNum: '02', heading: 'Before and after', before: { label: 'Today', core: 'The current state, in one line.', body: 'A little more detail.' }, after: { label: 'With us', core: 'The state we move you to.', body: 'A little more detail.' } }) },
  { type: 'emphasisFrame', name: 'Emphasis frame', desc: 'Dark well with a pulled-out idea', make: () => ({ block: 'emphasisFrame', label: 'The idea', text: 'The one thing worth emphasising.' }) },
  { type: 'narrative', name: 'Narrative', desc: 'Heading + argument paragraphs', make: () => ({ block: 'narrative', sectionNum: '03', heading: 'How we see it', body: ['Opening paragraph of the argument.', 'Supporting paragraph.'], example: 'A concrete example, pulled out.' }) },
  { type: 'demo', name: 'Demo', desc: 'A tailored worked example', make: () => ({ block: 'demo', sectionNum: '04', heading: 'A worked example', intro: 'Tailored to your business.', html: '<p>Worked-example content goes here.</p>' }) },
  { type: 'processFlow', name: 'Process flow', desc: 'Numbered step-by-step spine', make: () => ({ block: 'processFlow', sectionNum: '05', heading: 'How it works', intro: 'Step by step.', steps: [{ title: 'Step one', desc: 'What happens first.' }, { title: 'Step two', desc: 'What happens next.' }, { title: 'Step three', desc: 'And then this.' }] }) },
  { type: 'phases', name: 'Phases', desc: 'Now / Next / Later horizon cards', make: () => ({ block: 'phases', phases: [{ tag: 'Now', title: 'Phase one', body: 'What we do first.', emphasis: true }, { tag: 'Next', title: 'Phase two', body: 'What follows.' }, { tag: 'Later', title: 'Phase three', body: 'Where it goes.' }] }) },
  { type: 'whatStayed', name: 'What stayed', desc: 'The lasting value paragraphs', make: () => ({ block: 'whatStayed', sectionNum: '06', heading: 'What stays with you', body: ['The lasting value, in a sentence or two.'] }) },
  { type: 'nextSteps', name: 'Next steps', desc: 'Numbered steps + a CTA link', make: () => ({ block: 'nextSteps', sectionNum: '07', heading: 'Next steps', intro: 'Here is how we start.', steps: [{ title: 'Kickoff', desc: 'We align on scope.' }, { title: 'Sprint', desc: 'We do the work.' }], link: { href: '#', label: 'Book a call' } }) },
  { type: 'discussion', name: 'Discussion', desc: 'Open questions checklist', make: () => ({ block: 'discussion', sectionNum: '08', heading: "Let's discuss", intro: 'A few open questions.', questions: [{ q: 'First question to cover?' }, { q: 'Second question?' }] }) },
  { type: 'exerciseMatrix', name: 'Exercise — matrix', desc: 'JTBD importance × satisfaction grid', make: () => ({ block: 'exerciseMatrix', sectionNum: '09', heading: 'Map the jobs', intro: 'Place each job on the grid.', exerciseId: 'jtbd-matrix', jobs: [{ id: 'j1', label: 'Job one' }, { id: 'j2', label: 'Job two' }, { id: 'j3', label: 'Job three' }] }) },
  { type: 'exerciseRank', name: 'Exercise — rank', desc: 'Drag-rank problems per job', make: () => ({ block: 'exerciseRank', heading: 'Rank the problems', exerciseId: 'rank', groups: [{ jobId: 'j1', jobLabel: 'Job one', problems: [{ id: 'p1', label: 'Problem A' }, { id: 'p2', label: 'Problem B' }] }] }) },
  { type: 'exerciseChips', name: 'Exercise — chips', desc: 'Category entry-point questions', make: () => ({ block: 'exerciseChips', heading: 'Entry points', exerciseId: 'chips', questions: [{ id: 'why', q: 'Why do they buy?', options: ['Option A', 'Option B'] }] }) },
  { type: 'exerciseSolutions', name: 'Exercise — solutions', desc: '"What do you do today" per job', make: () => ({ block: 'exerciseSolutions', heading: 'What you do today', exerciseId: 'sol', jobs: [{ id: 'j1', label: 'Job one', placeholder: 'Your current solution…' }] }) },
  { type: 'docFooter', name: 'Doc footer', desc: 'Left/right footer line', make: () => ({ block: 'docFooter', left: 'Backspace Oddity', right: '2026' }) },
  { type: 'divider', name: 'Divider', desc: 'A horizontal rule', make: () => ({ block: 'divider' }) },
];

export const CATALOG_BY_TYPE: Record<string, CatalogEntry> = Object.fromEntries(CATALOG.map(c => [c.type, c]));
