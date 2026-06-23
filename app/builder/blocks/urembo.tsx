/**
 * Urembo Hub design system (DS #2) — builder blocks ported 1:1 from the live
 * proposal-workspace system (lib/proposal-workspace/blocks.ts + styles.ts).
 *
 * This is a CLONE of the editorial /w/<slug> proposal look — same classnames
 * (.doc-header, .statement, .ba-grid, .pf-step, .check-section …), same markup
 * structure — re-expressed as React so the builder canvas can render & inline-
 * edit it. Styling comes from /builder-css/urembo.css (the scoped port of
 * styles.ts), injected by the builder when a page's DS is 'urembo'.
 *
 * The `ub:` type prefix keeps these disjoint from the `bt:` (Backspace Oddity)
 * DS. Inline editing reuses the same <Ed> wrapper contract as bt.tsx, so
 * setBtText path-writing works with zero new machinery.
 *
 * Pass 1 = the 10 static blocks. The 4 stateful exercise blocks
 * (exerciseMatrix/Rank/Chips/Solutions) + Tweaks role-vars are Pass 2.
 */
'use client';

import { Ed } from './bt';
import { UREMBO_EXERCISE_SAMPLES } from './exercises';

/* edit context threaded into every block (mirrors bt.tsx) */
type E = { on: boolean; set: (k: string, v: string) => void; touch?: () => void } | undefined;

/* ---------- 01 Doc header ---------- */
export function UremboDocHeader({ label, meta, version, date, e }: { label: string; meta: string; version?: string; date?: string; e?: E }) {
  return (
    <div className="doc-header">
      <div>
        <Ed e={e} k="label" v={label} as="div" className="doc-label" role="section-num" />
        <Ed e={e} k="meta" v={meta} as="div" className="doc-meta" role="body" />
      </div>
      <div className="doc-date">
        {version ? <Ed e={e} k="version" v={version} as="span" /> : null}
        {version && date ? <br /> : null}
        {date ? <Ed e={e} k="date" v={date} as="span" /> : null}
      </div>
    </div>
  );
}

/* ---------- 02 How we heard it (thesis + body + pills) ---------- */
export function UremboHeardIt({ sectionNum, heading, statement, body, pills, e }: { sectionNum?: string; heading: string; statement?: string; body: string[]; pills?: string[]; e?: E }) {
  return (
    <section>
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {statement ? <Ed e={e} k="statement" v={statement} as="div" className="statement" role="statement" /> : null}
      {body.map((p, i) => <Ed key={i} e={e} k={`body.${i}`} v={p} as="p" role="body" />)}
      {pills && pills.length ? (
        <div className="pill-group">
          {pills.map((p, i) => <Ed key={i} e={e} k={`pills.${i}`} v={p} as="span" className="pill" role="pill" />)}
        </div>
      ) : null}
    </section>
  );
}

/* ---------- Divider ---------- */
export function UremboDivider() {
  return <hr className="divider" />;
}

/* ---------- 03 Before / After ---------- */
type BACol = { label: string; core: string; body?: string };
export function UremboBeforeAfter({ sectionNum, heading, intro, before, after, note, e }: { sectionNum?: string; heading: string; intro?: string; before: BACol; after: BACol; note?: string; e?: E }) {
  const col = (c: BACol, key: string, isBefore: boolean) => (
    <div className={`ba-col${isBefore ? ' ba-before' : ''}`}>
      <Ed e={e} k={`${key}.label`} v={c.label} as="span" className="ba-label" role="section-num" />
      <Ed e={e} k={`${key}.core`} v={c.core} as="div" className="ba-core" role="ba-core" />
      {c.body ? <Ed e={e} k={`${key}.body`} v={c.body} as="p" role="body" /> : null}
    </div>
  );
  return (
    <section>
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {intro ? <Ed e={e} k="intro" v={intro} as="p" role="body" /> : null}
      <div className="ba-grid">
        {col(before, 'before', true)}
        {col(after, 'after', false)}
      </div>
      {note ? <Ed e={e} k="note" v={note} as="p" className="note-small" role="body" /> : null}
    </section>
  );
}

/* ---------- 04 Narrative (body + pulled example) ---------- */
export function UremboNarrative({ sectionNum, heading, body, example, e }: { sectionNum?: string; heading: string; body: string[]; example?: string; e?: E }) {
  return (
    <section>
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {body.map((p, i) => <Ed key={i} e={e} k={`body.${i}`} v={p} as="p" role="body" />)}
      {example ? <Ed e={e} k="example" v={example} as="div" className="statement" role="statement" /> : null}
    </section>
  );
}

/* ---------- 05 Process flow (numbered spine + branches) ---------- */
type PFStep = { title: string; desc: string; branches?: { label: string; body: string; primary?: boolean }[] };
export function UremboProcessFlow({ sectionNum, heading, intro, steps, e }: { sectionNum?: string; heading: string; intro?: string; steps: PFStep[]; e?: E }) {
  return (
    <section>
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {intro ? <Ed e={e} k="intro" v={intro} as="p" role="body" /> : null}
      <div className="pf">
        {steps.map((s, i) => (
          <div className={`pf-step${s.branches && s.branches.length ? ' pf-has-branches' : ''}`} key={i}>
            <div className="pf-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="pf-body">
              <Ed e={e} k={`steps.${i}.title`} v={s.title} as="div" className="pf-title" role="step-title" />
              <Ed e={e} k={`steps.${i}.desc`} v={s.desc} as="div" className="pf-desc" role="body" />
              {s.branches && s.branches.length ? (
                <div className="pf-branches">
                  {s.branches.map((br, j) => (
                    <div className={`pf-branch${br.primary ? ' pf-primary' : ''}`} key={j}>
                      <Ed e={e} k={`steps.${i}.branches.${j}.label`} v={br.label} as="span" className="pf-branch-label" role="section-num" />
                      <Ed e={e} k={`steps.${i}.branches.${j}.body`} v={br.body} as="p" role="body" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 06 What stayed with us ---------- */
export function UremboWhatStayed({ sectionNum, heading, body, e }: { sectionNum?: string; heading: string; body: string[]; e?: E }) {
  return (
    <section>
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {body.map((p, i) => <Ed key={i} e={e} k={`body.${i}`} v={p} as="p" role="body" />)}
    </section>
  );
}

/* ---------- 07 Next steps (numbered rows + link) ---------- */
type NSStep = { title: string; desc: string };
export function UremboNextSteps({ sectionNum, heading, intro, steps, link, e }: { sectionNum?: string; heading: string; intro?: string; steps: NSStep[]; link?: { href: string; label: string }; e?: E }) {
  return (
    <section>
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {intro ? <Ed e={e} k="intro" v={intro} as="p" role="body" /> : null}
      <div className="steps">
        {steps.map((s, i) => (
          <div className="step-row" key={i}>
            <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="step-body">
              <Ed e={e} k={`steps.${i}.title`} v={s.title} as="div" className="step-title" role="step-title" />
              <Ed e={e} k={`steps.${i}.desc`} v={s.desc} as="div" className="step-desc" role="body" />
            </div>
          </div>
        ))}
      </div>
      {link ? <a className="next-link" href={link.href}><Ed e={e} k="link.label" v={`${link.label} →`} role="section-num" /></a> : null}
    </section>
  );
}

/* ---------- 08 Discussion (inverted checklist) ---------- */
type DQ = { q: string; note?: string };
export function UremboDiscussion({ sectionNum, heading, intro, questions, e }: { sectionNum?: string; heading: string; intro?: string; questions: DQ[]; e?: E }) {
  return (
    <div className="check-section">
      {sectionNum ? <Ed e={e} k="sectionNum" v={sectionNum} as="span" className="section-num" role="section-num" /> : null}
      <Ed e={e} k="heading" v={heading} as="h2" role="h2" />
      {intro ? <Ed e={e} k="intro" v={intro} as="p" role="body" /> : null}
      <ul className="check-list">
        {questions.map((q, i) => (
          <li key={i}>
            <div className="check-box"></div>
            <div>
              <Ed e={e} k={`questions.${i}.q`} v={q.q} as="span" className="check-question" role="body" />
              {q.note ? <Ed e={e} k={`questions.${i}.note`} v={q.note} as="span" className="check-note" role="section-num" /> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Doc footer ---------- */
export function UremboDocFooter({ left, right, e }: { left: string; right: string; e?: E }) {
  return (
    <div className="doc-footer">
      <Ed e={e} k="left" v={left} as="span" role="section-num" />
      <Ed e={e} k="right" v={right} as="span" role="section-num" />
    </div>
  );
}

/* ======================================================================
   Registry maps + page/section seeds (ub: prefix)
   ====================================================================== */

export const UREMBO_COMPONENTS = {
  'ub:docHeader': UremboDocHeader,
  'ub:heardIt': UremboHeardIt,
  'ub:divider': UremboDivider,
  'ub:beforeAfter': UremboBeforeAfter,
  'ub:narrative': UremboNarrative,
  'ub:processFlow': UremboProcessFlow,
  'ub:whatStayed': UremboWhatStayed,
  'ub:nextSteps': UremboNextSteps,
  'ub:discussion': UremboDiscussion,
  'ub:docFooter': UremboDocFooter,
};

export const UREMBO_TYPE_NAMES = {
  'ub:docHeader': 'Doc header',
  'ub:heardIt': 'How we heard it',
  'ub:divider': 'Divider',
  'ub:beforeAfter': 'Before / After',
  'ub:narrative': 'Narrative',
  'ub:processFlow': 'Process flow',
  'ub:whatStayed': 'What stayed',
  'ub:nextSteps': 'Next steps',
  'ub:discussion': 'Discussion',
  'ub:docFooter': 'Doc footer',
};

const b = (id: string, type: string, props: any) => ({ id, type, props, real: true });

/* ---------- UREMBO_PAGE — the real Urembo assessment as a block-list
   (seeded from clients/urembo-v2.ts; exercise blocks deferred to Pass 2) ---------- */
export const UREMBO_PAGE = [
  b('ub-header', 'ub:docHeader', {
    label: 'Initial Assessment · Urembo Hub',
    meta: 'Prepared by Backspace Oddity · for Fatuma Dabassa',
    version: 'Draft', date: 'June 2026',
  }),
  b('ub-heard', 'ub:heardIt', {
    sectionNum: '01 — How we heard it',
    heading: 'The task, as we understood it',
    statement: 'You’ve built a real marketplace. The thing slowing you down isn’t the product — it’s that the operation still runs through you.',
    body: [
      'Urembo Hub is a beauty marketplace for Kenya — the platform is built and live, and you’re bringing merchants onto it.',
      'The bottleneck right now is operational. Every merchant sign-up passes through you by hand — document checks, business verification, Paystack sub-account approval — and a new merchant waits three to five days before they can start. As traffic grows, that queue grows with you in the middle of it.',
      'Across the business, we see real room to streamline the operational work. The place to start is merchant onboarding — the back-office approvals that gate every new store. Once that runs on its own, the same approach extends to the rest: support as volume grows, and the bigger growth goals you came in with.',
    ],
    pills: ['Beauty marketplace', 'Kenya', 'Merchant onboarding', 'Operational wedge'],
  }),
  b('ub-div1', 'ub:divider', {}),
  b('ub-ba', 'ub:beforeAfter', {
    sectionNum: '02 — The core challenge',
    heading: 'The bottleneck is the back office',
    intro: 'You described it plainly on the call: the approvals that gate every new merchant are yours to do, one by one.',
    before: { label: 'Today', core: 'Every merchant waits for you.', body: 'Sign-up arrives → you open the admin dashboard → check the uploaded documents → verify the business → approve the Paystack sub-account → the merchant gets the email and can finally start. Three to five days, and a real chance they drop off before the approval lands.' },
    after: { label: 'Where this goes', core: 'Merchants onboard themselves; you handle the exceptions.', body: 'The routine checks run automatically the moment a merchant signs up. Clean applications activate in minutes. Only the ones that genuinely need a human reach you — so your time goes to judgement, not to the queue.' },
    note: 'This is the work that has to come off your shoulders first — before more traffic makes it heavier, not after.',
  }),
  b('ub-div2', 'ub:divider', {}),
  b('ub-narr', 'ub:narrative', {
    sectionNum: '03 — Where we’d start',
    heading: 'Our read on the first move',
    body: [
      'It’s the same way we work on the engagements you saw on the page: take the one workflow that eats the most time and rebuild it with AI built in — so within a few weeks you run it without us. For Urembo, that workflow is merchant onboarding, on the stack you already own.',
      'You own your stack — GitHub, your own database, your own back office — and your data sits in one place. The automation builds on what you already have, instead of bolting on from outside.',
      'The first build is the onboarding approval flow: read the submitted documents, run the verification and authenticity checks, set up the Paystack sub-account, and activate the merchant — escalating to you only when something is genuinely unclear. Support tickets follow the same pattern once volume is real.',
    ],
    example: 'The same engine that clears a merchant in minutes also gives you the audit trail — every approval, every reason, on record.',
  }),
  b('ub-div3', 'ub:divider', {}),
  b('ub-pf', 'ub:processFlow', {
    sectionNum: '04 — What it looks like',
    heading: 'Your onboarding flow, automated',
    intro: 'A walk-through of the first build, on your actual process. We’d tailor this together.',
    steps: [
      { title: 'Merchant signs up', desc: 'They upload their business documents through the same sign-up they use today — nothing changes on their side.' },
      { title: 'Automatic checks', desc: 'The documents are read and validated, the business details verified, and anything that looks off is flagged.' },
      { title: 'Payment setup', desc: 'The Paystack sub-account is created and confirmed — no manual setup step.' },
      { title: 'Decision', desc: 'Every application sorts itself into one of two paths.', branches: [
        { label: 'Clean application', body: 'Activates in minutes — no one has to touch it.', primary: true },
        { label: 'Needs a look', body: 'Routes to you with the reason attached, so the call is quick to make.' },
      ] },
      { title: 'Merchant live', desc: 'Activation email sent, dashboard open — no manual step in between.' },
    ],
  }),
  b('ub-div4', 'ub:divider', {}),
  b('ub-stayed', 'ub:whatStayed', {
    sectionNum: '05 — What stayed with us',
    heading: 'Why this is a good place to build',
    body: [
      'Fifteen years in the beauty industry before you built the platform — you’re not solving a problem you read about, you’re solving one you lived. That shows in how specifically you described the gap in the market and the merchants you’re onboarding.',
    ],
  }),
  b('ub-div5', 'ub:divider', {}),
  b('ub-ex-matrix', 'ub:exMatrix', {
    sectionNum: '06 — Over to you',
    heading: 'Which of these slow you down most?',
    intro: 'We pulled these from our call. Drag each onto the grid — left to right is how important it is to you (1–10), bottom to top is how well it’s handled today (1–10). The ones that matter most but still run painfully are where the time really goes. Tap ＋ note on any card to tell us why (type or record a voice note).',
    exerciseId: 'jtbd-matrix',
    axisX: { label: 'How important to you', low: 'Minor', high: 'Critical' },
    axisY: { label: 'How well it’s handled today', low: 'Painful', high: 'Handled' },
    jobs: [
      { id: 'approve', label: 'Approve a new merchant without the 3–5 day wait' },
      { id: 'verify', label: 'Check documents and business authenticity' },
      { id: 'paystack', label: 'Set up the Paystack sub-account for each merchant' },
      { id: 'support', label: 'Handle support tickets as volume grows' },
      { id: 'audit', label: 'Keep a clear record of every approval and reason' },
    ],
  }),
  b('ub-div6', 'ub:divider', {}),
  b('ub-ex-rank', 'ub:exRank', {
    sectionNum: '07 — Where each part hurts',
    heading: 'Within each job, what hurts most?',
    intro: 'We grouped the problems under each part of the operation. Inside each group, drag them so the one that bites most sits on top. (Draft problem lists — we’ll refine these together.)',
    exerciseId: 'problem-rank',
    groups: [
      {
        jobId: 'approve',
        jobLabel: 'Approving a new merchant',
        problems: [
          { id: 'approve-wait', label: '3–5 day wait before they can start' },
          { id: 'approve-desk', label: 'Only moves when you’re at the desk' },
          { id: 'approve-eta', label: 'Merchants don’t know when they’ll be live' },
        ],
      },
      {
        jobId: 'verify',
        jobLabel: 'Checking documents & authenticity',
        problems: [
          { id: 'verify-byhand', label: 'Reading every document by hand' },
          { id: 'verify-fakes', label: 'Hard to spot fake or low-quality docs' },
          { id: 'verify-formats', label: 'Every merchant submits a different format' },
        ],
      },
      {
        jobId: 'paystack',
        jobLabel: 'Setting up the Paystack sub-account',
        problems: [
          { id: 'paystack-manual', label: 'Manual setup for each merchant' },
          { id: 'paystack-errors', label: 'A mistake means redoing it' },
          { id: 'paystack-status', label: 'No clear view of what’s done' },
        ],
      },
      {
        jobId: 'support',
        jobLabel: 'Handling support as volume grows',
        problems: [
          { id: 'support-repeat', label: 'The same questions over and over' },
          { id: 'support-pileup', label: 'Tickets pile up when you’re busy' },
          { id: 'support-triage', label: 'No way to sort urgent from routine' },
        ],
      },
      {
        jobId: 'audit',
        jobLabel: 'Keeping a record of every approval',
        problems: [
          { id: 'audit-why', label: 'No log of why a merchant was approved' },
          { id: 'audit-trace', label: 'Hard to answer “why this one?” later' },
        ],
      },
    ],
  }),
  b('ub-div7', 'ub:divider', {}),
  b('ub-ex-chips', 'ub:exChips', {
    sectionNum: '08 — The moment it lands',
    heading: 'When does the need actually arise?',
    intro: 'A category entry point is the exact moment the work shows up — mapped across five questions (Sharp & Romaniuk). For merchant onboarding, pick what fits and add your own.',
    exerciseId: 'entry-points',
    questions: [
      {
        id: 'why',
        q: 'Why',
        example: 'a new merchant is ready to start selling',
        options: ['A new merchant signs up', 'A merchant is ready to sell', 'You promised a fast launch', 'A partner referred them'],
      },
      {
        id: 'when',
        q: 'When',
        example: 'after a marketing push',
        options: ['Right after a marketing push', 'End of the day', 'Over the weekend', 'The moment documents land'],
      },
      {
        id: 'where',
        q: 'Where',
        example: 'on your phone, away from the desk',
        options: ['At your desk', 'On your phone', 'Away from the office', 'Inside the admin dashboard'],
      },
      {
        id: 'with-whom',
        q: 'With whom',
        example: 'with the merchant waiting on you',
        options: ['Just you', 'With a VA or assistant', 'With the merchant waiting', 'With your co-founder'],
      },
      {
        id: 'with-what',
        q: 'With what',
        example: 'alongside the dashboard and WhatsApp',
        options: ['The admin dashboard', 'WhatsApp / chat', 'Paystack', 'Spreadsheets or email'],
      },
    ],
  }),
  b('ub-div8', 'ub:divider', {}),
  b('ub-ex-solutions', 'ub:exSolutions', {
    sectionNum: '09 — What you do today',
    heading: 'How do you handle each one now?',
    intro: 'For each step, tell us how it works today — the tool, the workaround, the manual step. This is how we learn what to build around.',
    exerciseId: 'current-solutions',
    jobs: [
      { id: 'approve', label: 'Approving a new merchant' },
      { id: 'verify', label: 'Checking documents & business authenticity' },
      { id: 'paystack', label: 'Setting up the Paystack sub-account' },
      { id: 'support', label: 'Handling merchant support questions' },
      { id: 'audit', label: 'Keeping a record of every approval' },
    ],
  }),
  b('ub-next', 'ub:nextSteps', {
    sectionNum: '10 — From our side',
    heading: 'What happens next',
    intro: 'This is our read, not a proposal yet. The next step is a short call to pressure-test it together and agree where to actually start.',
    steps: [
      { title: 'You react to this read', desc: 'Tell us where it’s right and where it’s off — especially the onboarding flow in section 04. You know the edge cases we don’t.' },
      { title: 'We scope the first build', desc: 'Together we turn the onboarding automation into a concrete first project — what’s in, what it touches, what “done” looks like.' },
      { title: 'Turn the pilot into a system', desc: 'With the first workflow running on its own, the growth and revenue goals you came in with become a real next conversation — on solid ground.' },
    ],
    link: { href: 'https://backspaceoddity.com/ai-skills/', label: 'The five AI products we scoped' },
  }),
  b('ub-disc', 'ub:discussion', {
    sectionNum: '11 — To align on',
    heading: 'Questions for our next call',
    intro: 'Add your own — this page is yours, and we’ll keep building on it as we go.',
    questions: [
      { q: 'Is the onboarding flow in section 04 how it actually works today?', note: 'Where does a merchant most often get stuck or drop off?' },
      { q: 'Of the approval steps, which take you the most time — documents, verification, or payment setup?', note: 'That tells us where the first automation earns its keep fastest.' },
      { q: 'When you picture this off your plate, what would you do with the time it frees?', note: 'It helps us aim the work at what matters most to you, not just what’s easiest to build.' },
    ],
  }),
  b('ub-footer', 'ub:docFooter', {
    left: 'Initial Assessment · Not a proposal',
    right: 'backspaceoddity.com',
  }),
];

const find = (arr: any[], type: string) => (arr.find((x) => x.type === type) || {}).props;

/* ---------- Library "Sections" — section TYPE -> variations (ub: prefix) ---------- */
export const UREMBO_SECTIONS = [
  { type: 'ub:docHeader', name: 'Doc header', variations: [
    { id: 'header', name: 'Label + meta + date', props: find(UREMBO_PAGE, 'ub:docHeader') },
  ] },
  { type: 'ub:heardIt', name: 'How we heard it', variations: [
    { id: 'heard-thesis', name: 'Thesis + pills', props: find(UREMBO_PAGE, 'ub:heardIt') },
    { id: 'heard-plain', name: 'Body only', props: (() => { const p = { ...find(UREMBO_PAGE, 'ub:heardIt') }; const { statement, pills, ...rest } = p; return rest; })() },
  ] },
  { type: 'ub:beforeAfter', name: 'Before / After', variations: [
    { id: 'ba-today', name: 'Today / Where this goes', props: find(UREMBO_PAGE, 'ub:beforeAfter') },
  ] },
  { type: 'ub:narrative', name: 'Narrative', variations: [
    { id: 'narr-example', name: 'Body + pulled example', props: find(UREMBO_PAGE, 'ub:narrative') },
    { id: 'narr-plain', name: 'Body only', props: (() => { const p = { ...find(UREMBO_PAGE, 'ub:narrative') }; const { example, ...rest } = p; return rest; })() },
  ] },
  { type: 'ub:processFlow', name: 'Process flow', variations: [
    { id: 'pf', name: 'Numbered spine + branches', props: find(UREMBO_PAGE, 'ub:processFlow') },
  ] },
  { type: 'ub:whatStayed', name: 'What stayed', variations: [
    { id: 'stayed', name: 'Short read', props: find(UREMBO_PAGE, 'ub:whatStayed') },
  ] },
  { type: 'ub:nextSteps', name: 'Next steps', variations: [
    { id: 'next', name: 'Numbered rows + link', props: find(UREMBO_PAGE, 'ub:nextSteps') },
  ] },
  { type: 'ub:discussion', name: 'Discussion', variations: [
    { id: 'disc', name: 'Inverted checklist', props: find(UREMBO_PAGE, 'ub:discussion') },
  ] },
  { type: 'ub:divider', name: 'Divider', variations: [
    { id: 'div', name: 'Rule', props: {} },
  ] },
  { type: 'ub:docFooter', name: 'Doc footer', variations: [
    { id: 'footer', name: 'Left / right', props: find(UREMBO_PAGE, 'ub:docFooter') },
  ] },
  { type: 'ub:exMatrix', name: 'Exercise — Matrix', variations: [
    { id: 'ex-matrix', name: 'Importance × satisfaction', props: UREMBO_EXERCISE_SAMPLES['ub:exMatrix'] },
  ] },
  { type: 'ub:exRank', name: 'Exercise — Rank', variations: [
    { id: 'ex-rank', name: 'Drag-to-rank problems', props: UREMBO_EXERCISE_SAMPLES['ub:exRank'] },
  ] },
  { type: 'ub:exChips', name: 'Exercise — Chips', variations: [
    { id: 'ex-chips', name: 'Multi-select + add own', props: UREMBO_EXERCISE_SAMPLES['ub:exChips'] },
  ] },
  { type: 'ub:exSolutions', name: 'Exercise — Solutions', variations: [
    { id: 'ex-solutions', name: 'Free-text per job', props: UREMBO_EXERCISE_SAMPLES['ub:exSolutions'] },
  ] },
  { type: 'ub:discussionLock', name: 'Discussion — Lock', variations: [
    { id: 'ex-lock', name: 'Record + lock the decision', props: UREMBO_EXERCISE_SAMPLES['ub:discussionLock'] },
  ] },
  { type: 'ub:clientNotes', name: 'Client notes (read-back)', variations: [
    { id: 'ex-notes', name: 'Your notes — live read-back', props: UREMBO_EXERCISE_SAMPLES['ub:clientNotes'] },
  ] },
];
