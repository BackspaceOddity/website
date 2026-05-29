/**
 * Interactive Proposal Workspace — block render functions (v1)
 *
 * One pure function per block: (props) => HTML string, styled by styles.ts.
 * Extract-as-you-go: only the blocks the first real page (Fatuma/Urembo)
 * needs are implemented. Add more as a client requires them — no speculative
 * blocks.
 */

import type {
  DocHeaderBlock, DividerBlock, StatementBlock, HeardItBlock, BeforeAfterBlock,
  EmphasisFrameBlock, NarrativeBlock, DemoBlock, WhatStayedBlock, NextStepsBlock,
  DiscussionBlock, DocFooterBlock,
} from './types';

/** Escape plain-text fields. Rich fields (documented in types.ts) are inserted raw. */
export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const sectionNum = (n?: string) => (n ? `<span class="section-num">${esc(n)}</span>` : '');
const paras = (body: string[]) => body.map(p => `<p>${p}</p>`).join('\n  ');

export function docHeader(b: DocHeaderBlock): string {
  const right = [b.version, b.date].filter((x): x is string => Boolean(x)).map(esc).join('<br>');
  return `<div class="doc-header">
  <div>
    <div class="doc-label">${esc(b.label)}</div>
    <div class="doc-meta">${esc(b.meta)}</div>
  </div>
  <div class="doc-date">${right}</div>
</div>`;
}

export function divider(_b: DividerBlock): string {
  return `<hr class="divider">`;
}

export function statement(b: StatementBlock): string {
  return `<div class="statement">${b.text}</div>`;
}

export function heardIt(b: HeardItBlock): string {
  const pills = b.pills?.length
    ? `<div class="pill-group">${b.pills.map(p => `<span class="pill">${esc(p)}</span>`).join('')}</div>`
    : '';
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.statement ? `<div class="statement">${b.statement}</div>` : ''}
  ${paras(b.body)}
  ${pills}
</section>`;
}

export function beforeAfter(b: BeforeAfterBlock): string {
  const col = (c: { label: string; core: string; body?: string }, before: boolean) => `<div class="ba-col${before ? ' ba-before' : ''}">
      <span class="ba-label">${esc(c.label)}</span>
      <div class="ba-core">${c.core}</div>
      ${c.body ? `<p>${c.body}</p>` : ''}
    </div>`;
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="ba-grid">
    ${col(b.before, true)}
    ${col(b.after, false)}
  </div>
  ${b.note ? `<p class="note-small">${b.note}</p>` : ''}
</section>`;
}

export function emphasisFrame(b: EmphasisFrameBlock): string {
  return `<div class="ej-frame">
  <span class="ej-label">${esc(b.label)}</span>
  <p>${b.text}</p>
</div>
${b.note ? `<p class="note-small">${b.note}</p>` : ''}`;
}

export function narrative(b: NarrativeBlock): string {
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${paras(b.body)}
  ${b.example ? `<div class="statement">${b.example}</div>` : ''}
</section>`;
}

export function demo(b: DemoBlock): string {
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="demo-frame">${b.html}</div>
</section>`;
}

export function whatStayed(b: WhatStayedBlock): string {
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${paras(b.body)}
</section>`;
}

export function nextSteps(b: NextStepsBlock): string {
  const rows = b.steps.map((s, i) => `<div class="step-row">
      <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="step-body">
        <div class="step-title">${esc(s.title)}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
    </div>`).join('\n    ');
  const link = b.link ? `<a class="next-link" href="${esc(b.link.href)}">${esc(b.link.label)} →</a>` : '';
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="steps">
    ${rows}
  </div>
  ${link}
</section>`;
}

export function discussion(b: DiscussionBlock): string {
  const items = b.questions.map(q => `<li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">${q.q}</span>
        ${q.note ? `<span class="check-note">${q.note}</span>` : ''}
      </div>
    </li>`).join('\n    ');
  return `<div class="check-section">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <ul class="check-list">
    ${items}
  </ul>
</div>`;
}

export function docFooter(b: DocFooterBlock): string {
  return `<div class="doc-footer">
  <span>${esc(b.left)}</span>
  <span>${esc(b.right)}</span>
</div>`;
}
