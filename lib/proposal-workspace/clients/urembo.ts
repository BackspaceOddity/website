/**
 * Urembo Hub — initial assessment (BSO-560).
 *
 * First real instantiation of the interactive proposal workspace.
 * Grounded in: call transcript 2026-05-21 (Notion 367402511cda80a4b5def87aede6531d)
 * + Yegor's follow-up email thread (Gmail 19e419c17f2b815e).
 *
 * Wedge = onboarding/support automation (approach A, Yegor-approved 2026-05-30).
 * The $400K / $3M figures are Fatuma's stated ambitions from the match form;
 * she could not substantiate them on the call ("the number is on the form").
 * So they appear here as DESTINATION, never quoted as current fact.
 *
 * STATUS: DRAFT — must pass tov-lint + Yegor review before WS_PW_UREMBO is set
 * and the page goes live. Not for client eyes yet.
 */

import type { ClientPage } from '../types';

export const uremboPage: ClientPage = {
  slug: 'urembo',
  title: 'Urembo Hub — Initial Assessment',
  blocks: [
    {
      block: 'docHeader',
      label: 'Initial Assessment · Urembo Hub',
      meta: 'Prepared by Backspace Oddity · for Fatuma Dabassa',
      version: 'Draft',
      date: 'June 2026',
    },

    {
      block: 'heardIt',
      sectionNum: '01 — How we heard it',
      heading: 'The task, as we understood it',
      statement:
        'You’ve built a real marketplace. The thing slowing you down isn’t the product — it’s that the operation still runs through you.',
      body: [
        'Urembo Hub is a beauty marketplace for Kenya — verified vendors, authentic products, booking and live shopping in one place, with a merchant dashboard for the businesses you onboard. The platform is built and live, and you’re in the acquisition phase: first merchants on, first stores trading.',
        'The bottleneck right now is operational. Every merchant sign-up passes through you by hand — document checks, business verification, Paystack sub-account approval — and a new merchant waits three to five days before they can start. As traffic grows, that queue grows with you in the middle of it.',
        'You came in with two larger ambitions. We’re holding both — but the one that fits where Urembo actually is today is automating the onboarding and support work. The growth-and-content side is real, and we’ll come back to it; it’s a separate, harder project to scope before the operation underneath it runs on its own.',
      ],
      pills: ['Beauty marketplace', 'Kenya', 'Merchant onboarding', 'Operational wedge'],
    },

    { block: 'divider' },

    {
      block: 'beforeAfter',
      sectionNum: '02 — The core challenge',
      heading: 'The bottleneck is the back office',
      intro:
        'You described it plainly on the call: the approvals that gate every new merchant are yours to do, one by one.',
      before: {
        label: 'Today',
        core: 'Every merchant waits for you.',
        body:
          'Sign-up arrives → you open the admin dashboard → check the uploaded documents → verify the business → approve the Paystack sub-account → the merchant gets the email and can finally start. Three to five days, and a real chance they drop off before the approval lands.',
      },
      after: {
        label: 'Where this goes',
        core: 'Merchants onboard themselves; you handle the exceptions.',
        body:
          'The routine checks run automatically the moment a merchant signs up. Clean applications activate in minutes. Only the ones that genuinely need a human reach you — so your time goes to judgement, not to the queue.',
      },
      note:
        'This is the work that has to come off your shoulders first — before more traffic makes it heavier, not after.',
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '03 — Where we’d start',
      heading: 'Our read on the first move',
      body: [
        'Our approach is simple: take the one repetitive job that’s blocking growth and make it run without you, on the stack you already own.',
        'You’re in a stronger starting position than most businesses at this stage. The infrastructure is yours — GitHub, your own database, your own back office. Your data sits in one place. And you already think in systems. That means an automation can be built on top of what exists, not bolted on from outside.',
        'The first build is the onboarding approval flow: read the submitted documents, run the verification and authenticity checks, set up the Paystack sub-account, and activate the merchant — escalating to you only when something is genuinely unclear. Support tickets follow the same pattern once volume is real.',
      ],
      example:
        'The same engine that clears a merchant in minutes also gives you the audit trail — every approval, every reason — so the operation stays trustworthy as it scales.',
    },

    { block: 'divider' },

    {
      block: 'demo',
      sectionNum: '04 — What it looks like',
      heading: 'Your onboarding flow, automated',
      intro: 'A static walk-through of the first build, on your actual process. We’d tailor this together.',
      html: `<p style="font-size:var(--fs-secondary);color:var(--ink-55);line-height:1.7;">
        <strong>1 · Merchant signs up</strong> → uploads business documents.<br>
        <strong>2 · Automatic checks</strong> → documents read and validated, business details verified, authenticity flagged.<br>
        <strong>3 · Payment setup</strong> → Paystack sub-account created and confirmed.<br>
        <strong>4 · Decision</strong> → clean application activates in minutes; anything ambiguous routes to you with the reason attached.<br>
        <strong>5 · Merchant live</strong> → activation email sent, dashboard open — no manual step in between.
      </p>`,
    },

    { block: 'divider' },

    {
      block: 'whatStayed',
      sectionNum: '05 — What stayed with us',
      heading: 'Why this is a good place to build',
      body: [
        'Fifteen years in the beauty industry before you built the platform — you’re not solving a problem you read about, you’re solving one you lived. That shows in how specifically you described the gap in the market and the merchants you’re onboarding.',
        'And you own your stack, your data is in one place, and you’re already reaching for the right tools. That’s a much better foundation to automate on than most businesses your size have.',
      ],
    },

    {
      block: 'nextSteps',
      sectionNum: '06 — From our side',
      heading: 'What happens next',
      intro:
        'This is our read, not a proposal yet. The next step is a short call to pressure-test it together and agree where to actually start.',
      steps: [
        {
          title: 'You react to this read',
          desc: 'Tell us where it’s right and where it’s off — especially the onboarding flow in section 04. You know the edge cases we don’t.',
        },
        {
          title: 'We scope the first build',
          desc: 'Together we turn the onboarding automation into a concrete first project — what’s in, what it touches, what “done” looks like.',
        },
        {
          title: 'Then the bigger ambitions',
          desc: 'With the operation running on its own, the growth and revenue goals you came in with become a real next conversation — on solid ground.',
        },
      ],
      link: { href: 'https://backspaceoddity.com/ai-skills/', label: 'The five AI products we scoped' },
    },

    {
      block: 'discussion',
      sectionNum: '07 — To align on',
      heading: 'Questions for our next call',
      intro: 'Add your own — this page is yours, and we’ll keep building on it as we go.',
      questions: [
        {
          q: 'Is the onboarding flow in section 04 how it actually works today?',
          note: 'Where does a merchant most often get stuck or drop off?',
        },
        {
          q: 'Of the approval steps, which take you the most time — documents, verification, or payment setup?',
          note: 'That tells us where the first automation earns its keep fastest.',
        },
        {
          q: 'When you picture this off your plate, what would you do with the time it frees?',
          note: 'It helps us aim the work at what matters most to you, not just what’s easiest to build.',
        },
      ],
    },

    {
      block: 'docFooter',
      left: 'Initial Assessment · Not a proposal',
      right: 'backspaceoddity.com',
    },
  ],
};
