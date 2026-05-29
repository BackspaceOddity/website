/**
 * _demo — canonical example of the v1 block library.
 *
 * Renders every block with sample content. Doubles as living documentation:
 * to see what a block looks like, look here. Not a real client.
 */

import type { ClientPage } from '../types';

export const demoPage: ClientPage = {
  slug: '_demo',
  title: 'Block Library — Demo',
  blocks: [
    {
      block: 'docHeader',
      label: 'Working Workspace · Sample Client',
      meta: 'Assessment by Backspace Oddity',
      version: 'v0.1',
      date: 'May 2026',
    },
    {
      block: 'heardIt',
      sectionNum: '01 — How we heard it',
      heading: 'The task, as we understood it',
      statement: 'You have demand you can already see, and a way of working that can’t yet keep pace with it.',
      body: [
        'Sample paragraph restating the client’s business in their own terms — what they do, who for, and the one specific challenge that maps to where they are right now.',
        'A second paragraph that narrows the ambition to the single thing worth solving first, rather than the whole company at once.',
      ],
      pills: ['Advanced JTBD', 'Cascade Hypotheses', 'Positioning'],
    },
    { block: 'divider' },
    {
      block: 'beforeAfter',
      sectionNum: '02 — The core challenge',
      heading: 'The shift this work is really about',
      before: {
        label: 'Today',
        core: 'Moving fast, but unsure the direction is the right one.',
        body: 'Sample description of the current state — competent execution without a system that confirms the bet.',
      },
      after: {
        label: 'After',
        core: 'The same speed, pointed at a direction you can defend.',
        body: 'Sample description of the relief — strategy and intuition finally agreeing.',
      },
      note: 'The work must resolve this, not just describe it.',
    },
    { block: 'divider' },
    {
      block: 'narrative',
      sectionNum: '03 — How we’d approach it',
      heading: 'Our read on the path',
      body: [
        'The typical approach does <strong>X</strong>, which leaves <em>Y</em> unsolved.',
        'Our path is one concrete sequence, not a framework dump — here is the first move and why it comes first.',
      ],
      example: 'A concrete, one-line example of the first deliverable applied to the client’s own situation.',
    },
    { block: 'divider' },
    {
      block: 'demo',
      sectionNum: '04 — A worked example',
      heading: 'Cascade hypotheses, on your business',
      intro: 'A static illustration in v1; this becomes an interactive widget in v2.',
      html: `<p style="font-size:var(--fs-secondary);color:var(--ink-55);line-height:1.6;">
        <strong>Hypothesis 1</strong> → if we change A, then B follows, measured by C.<br>
        <strong>Hypothesis 2</strong> → if B holds, then D becomes testable, measured by E.
      </p>`,
    },
    { block: 'divider' },
    {
      block: 'whatStayed',
      sectionNum: '05 — What stayed with us',
      heading: 'One thing from the conversation',
      body: [
        'A single, specific, genuine positive from the call — not flattery, an observation only someone who listened could make.',
      ],
    },
    { block: 'divider' },
    {
      block: 'nextSteps',
      sectionNum: '06 — From our side',
      heading: 'What happens next',
      intro: 'Concrete, small, and reversible — a first step, not a commitment to the whole programme.',
      steps: [
        { title: 'Initial assessment', desc: 'Our read of the situation — <em>not a proposal yet</em>, just where we think the leverage is.' },
        { title: 'A short working session', desc: 'We pressure-test the read together and pick the first move.' },
      ],
      link: { href: 'https://backspaceoddity.com/ai-skills/', label: 'See how we work' },
    },
    {
      block: 'discussion',
      sectionNum: '07 — To align on',
      heading: 'Questions for our next conversation',
      intro: 'Add your own — this page is shared.',
      questions: [
        { q: 'Is the challenge in section 01 the right one to start with?', note: 'Or is there a more urgent first move?' },
        { q: 'Does the worked example map to how your business actually runs?' },
      ],
    },
    {
      block: 'docFooter',
      left: 'Working Document · Not for Publication',
      right: 'backspaceoddity.com',
    },
  ],
};
