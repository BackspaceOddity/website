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

export const uremboV2Page: ClientPage = {
  slug: 'urembo-v2',
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
        'Urembo Hub is a beauty marketplace for Kenya — the platform is built and live, and you’re bringing merchants onto it.',
        'The bottleneck right now is operational. Every merchant sign-up passes through you by hand — document checks, business verification, Paystack sub-account approval — and a new merchant waits three to five days before they can start. As traffic grows, that queue grows with you in the middle of it.',
        'Across the business, we see real room to streamline the operational work. The place to start is merchant onboarding — the back-office approvals that gate every new store. Once that runs on its own, the same approach extends to the rest: support as volume grows, and the bigger growth goals you came in with.',
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
        'It’s the same way we work on the engagements you saw on the page: take the one workflow that eats the most time and rebuild it with AI built in — so within a few weeks you run it without us. For Urembo, that workflow is merchant onboarding, on the stack you already own.',
        'You own your stack — GitHub, your own database, your own back office — and your data sits in one place. The automation builds on what you already have, instead of bolting on from outside.',
        'The first build is the onboarding approval flow: read the submitted documents, run the verification and authenticity checks, set up the Paystack sub-account, and activate the merchant — escalating to you only when something is genuinely unclear. Support tickets follow the same pattern once volume is real.',
      ],
      example:
        'The same engine that clears a merchant in minutes also gives you the audit trail — every approval, every reason, on record.',
    },

    { block: 'divider' },

    {
      block: 'processFlow',
      sectionNum: '04 — What it looks like',
      heading: 'Your onboarding flow, automated',
      intro: 'A walk-through of the first build, on your actual process. We’d tailor this together.',
      steps: [
        {
          title: 'Merchant signs up',
          desc: 'They upload their business documents through the same sign-up they use today — nothing changes on their side.',
        },
        {
          title: 'Automatic checks',
          desc: 'The documents are read and validated, the business details verified, and anything that looks off is flagged.',
        },
        {
          title: 'Payment setup',
          desc: 'The Paystack sub-account is created and confirmed — no manual setup step.',
        },
        {
          title: 'Decision',
          desc: 'Every application sorts itself into one of two paths.',
          branches: [
            {
              label: 'Clean application',
              body: 'Activates in minutes — no one has to touch it.',
              primary: true,
            },
            {
              label: 'Needs a look',
              body: 'Routes to you with the reason attached, so the call is quick to make.',
            },
          ],
        },
        {
          title: 'Merchant live',
          desc: 'Activation email sent, dashboard open — no manual step in between.',
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'whatStayed',
      sectionNum: '05 — What stayed with us',
      heading: 'Why this is a good place to build',
      body: [
        'Fifteen years in the beauty industry before you built the platform — you’re not solving a problem you read about, you’re solving one you lived. That shows in how specifically you described the gap in the market and the merchants you’re onboarding.',
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseMatrix',
      sectionNum: '06 — Over to you',
      heading: 'Which of these slow you down most?',
      intro:
        'We pulled these from our call. Drag each onto the grid — left to right is how important it is to you (1–10), bottom to top is how well it’s handled today (1–10). The ones that matter most but still run painfully are where the time really goes. Tap ＋ note on any card to tell us why (type or record a voice note).',
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
    },

    { block: 'divider' },

    {
      block: 'exerciseRank',
      sectionNum: '07 — Where each part hurts',
      heading: 'Within each job, what hurts most?',
      intro:
        'We grouped the problems under each part of the operation. Inside each group, drag them so the one that bites most sits on top. (Draft problem lists — we’ll refine these together.)',
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
    },

    { block: 'divider' },

    {
      block: 'exerciseChips',
      sectionNum: '08 — The moment it lands',
      heading: 'When does the need actually arise?',
      intro:
        'A category entry point is the exact moment the work shows up — mapped across five questions (Sharp & Romaniuk). For merchant onboarding, pick what fits and add your own.',
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
    },

    { block: 'divider' },

    {
      block: 'exerciseSolutions',
      sectionNum: '09 — What you do today',
      heading: 'How do you handle each one now?',
      intro:
        'For each step, tell us how it works today — the tool, the workaround, the manual step. This is how we learn what to build around.',
      exerciseId: 'current-solutions',
      jobs: [
        { id: 'approve', label: 'Approving a new merchant' },
        { id: 'verify', label: 'Checking documents & business authenticity' },
        { id: 'paystack', label: 'Setting up the Paystack sub-account' },
        { id: 'support', label: 'Handling merchant support questions' },
        { id: 'audit', label: 'Keeping a record of every approval' },
      ],
    },

    {
      block: 'nextSteps',
      sectionNum: '10 — From our side',
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
          title: 'Turn the pilot into a system',
          desc: 'With the first workflow running on its own, the growth and revenue goals you came in with become a real next conversation — on solid ground.',
        },
      ],
      link: { href: 'https://backspaceoddity.com/ai-skills/', label: 'The five AI products we scoped' },
    },

    {
      block: 'discussion',
      sectionNum: '11 — To align on',
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
