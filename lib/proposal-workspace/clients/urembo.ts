/**
 * Urembo Hub — proposal (BSO-560).
 *
 * Interactive proposal workspace. Evolved from the initial assessment into a
 * full proposal: the original read (§01–05) is unchanged; §06–11 add the
 * commercial shape — a two-stage engagement (discovery sprint → onboarding build).
 *
 * Grounded in: call transcript 2026-05-21 (Notion 367402511cda80a4b5def87aede6531d)
 * + Yegor's follow-up email thread (Gmail 19e419c17f2b815e).
 * Commercial sections mirror the Notion proposal 384402511cda8110b44de90387b3c193.
 *
 * Wedge = onboarding automation (approach A, Yegor-approved 2026-05-30).
 * Sprint price: €14,000 excl. VAT for 2 weeks (Anna, 2026-06-19). Build priced
 * after the sprint.
 *
 * STATUS: must pass tov-lint + Yegor review before deploy.
 */

import type { ClientPage } from '../types';

export const uremboPage: ClientPage = {
  slug: 'urembo',
  title: 'Urembo Hub — Proposal',
  blocks: [
    {
      block: 'docHeader',
      label: 'Proposal · Urembo Hub',
      meta: 'Prepared by Backspace Oddity · for Fatuma Dabassa',
      version: 'Proposal',
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
      block: 'narrative',
      sectionNum: '06 — How we’d work',
      heading: 'Two steps, not one leap',
      body: [
        'We’d rather not hand over one big number built on guesswork. Two things make an up-front quote for the whole build unreliable today: its hardest part — the judgement behind each approval — isn’t written down anywhere yet, and the spend should match an early stage.',
        'So we start small and earn the rest. A short discovery sprint turns the onboarding process into a concrete, buildable spec — and a firm price for the build. With that in front of both of us, we build.',
      ],
      example:
        'If the sprint shows the build isn’t worth it yet, we’ll say so — and the cost will have been small and fixed, not a quarter’s budget.',
    },

    {
      block: 'phases',
      phases: [
        {
          tag: 'Stage 1 · 2 weeks · €14,000 excl. VAT',
          title: 'Discovery sprint',
          body:
            'Map the onboarding flow, capture the approval criteria, and confirm the technical ground. You leave with a written spec and a firm price for the build.',
          emphasis: true,
        },
        {
          tag: 'Stage 2 · scoped after the sprint',
          title: 'The onboarding build',
          body:
            'We build the approval automation on the stack you already own and hand it over — running on its own within a few weeks.',
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'nextSteps',
      sectionNum: '07 — Stage one: the discovery sprint',
      heading: 'What the two weeks cover',
      intro: 'A focused piece of work to map onboarding as it runs today and pin down what the automation has to do.',
      steps: [
        {
          title: 'We map the real flow with you',
          desc: 'Every approval step, every edge case, the points where a merchant actually drops off.',
        },
        {
          title: 'We pull the criteria out of your head',
          desc: 'What makes an application authentic, what you check by eye, where you hesitate. This is the part only you can answer, and it’s the heart of the build.',
        },
        {
          title: 'We confirm the technical ground',
          desc: 'Access to your codebase, database, and the Paystack API, and where the automation will run on your stack.',
        },
        {
          title: 'We agree the escalation line',
          desc: 'Which applications activate on their own, and which always wait for you.',
        },
      ],
    },

    {
      block: 'emphasisFrame',
      label: 'What you get',
      text:
        'A written onboarding spec — the decision logic in plain terms — a technical integration plan, and a firm fixed price and timeline for the build.',
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '08 — Stage two: what the build covers',
      heading: 'In scope, and what waits',
      body: [
        '<strong>In this build.</strong> The onboarding approval flow, end to end: the submitted documents are read and validated, the business details verified, the Paystack sub-account created and confirmed, and the merchant activated. Clean applications go through in minutes; anything unclear routes to you with the reason attached. Every decision is logged.',
        '<strong>Done means.</strong> Clean merchants onboard without you touching them, the exceptions reach you with a reason, every decision is on record — and within a few weeks you run it without us.',
      ],
      example:
        '<strong>Not in this build.</strong> Support-ticket automation, lead generation and the revenue goals, and any change to the merchant-facing sign-up — each a later step, on solid ground once the first one runs. We build on the platform you own, not a rebuild of it.',
    },

    { block: 'divider' },

    {
      block: 'processFlow',
      sectionNum: '09 — Timeline',
      heading: 'How the work runs',
      intro: 'From the first session to a flow you run on your own.',
      steps: [
        {
          title: 'Kickoff',
          desc: 'We agree the sprint scope and get access to the codebase, database, and Paystack.',
        },
        {
          title: 'Discovery sprint',
          desc: 'A couple of working sessions to capture the approval criteria, plus the technical mapping. Two weeks.',
        },
        {
          title: 'The build',
          desc: 'We build the approval automation on your stack — scoped and priced from the sprint.',
        },
        {
          title: 'Test on real applications',
          desc: 'We run it against live sign-ups; you watch it clear merchants and catch the edge cases.',
        },
        {
          title: 'Handoff',
          desc: 'The flow runs on its own. You hold the audit trail and the controls.',
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '10 — Investment',
      heading: 'What it costs',
      body: [
        '<strong>Discovery sprint — €14,000 excl. VAT.</strong> Two weeks of work: the onboarding spec, the technical integration plan, and a firm price for the build.',
        '<strong>The onboarding build — priced at the end of the sprint.</strong> The larger number is set only once the spec is firm and we both know exactly what it covers.',
      ],
      example:
        'Staged on purpose: a small first commitment you can carry now, the bigger one priced only when it’s real.',
    },

    { block: 'divider' },

    {
      block: 'nextSteps',
      sectionNum: '11 — What we need from you',
      heading: 'To get going',
      steps: [
        {
          title: 'Access',
          desc: 'To the codebase, database, and the Paystack API.',
        },
        {
          title: 'A few working sessions',
          desc: 'Two or three sessions to get the approval criteria out of your head.',
        },
        {
          title: 'One point of contact',
          desc: 'On your side, for the technical hand-offs.',
        },
      ],
      link: { href: 'https://backspaceoddity.com/ai-skills/', label: 'The five AI products we scoped' },
    },

    {
      block: 'planDetail',
      sectionNum: '12 — The plan',
      heading: 'The two weeks, in detail',
      intro:
        'The concrete work, the people on it, the hours, and exactly what you receive at the end.',
      lead: {
        label: 'What the sprint is for',
        body:
          'Two weeks to turn merchant onboarding from something only you can do into something we can build — and to put a firm price and timeline on that build before you commit to it. We haven’t seen your system yet — week one is where we do. So the plan below is detailed about our work, and deliberately open about what we learn from yours.',
      },
      weeks: [
        {
          label: 'Week 1 — Map and capture',
          tasks: [
            {
              task: 'Kickoff &amp; access setup',
              produces:
                'Access to the codebase, database, admin dashboard, and Paystack; a working agreement for the two weeks.',
              lead: '2h',
              eng: '2h',
            },
            {
              task: 'Session 1 — walk the current onboarding flow end to end',
              produces: 'A shared, written map of how onboarding works today.',
              lead: '2h',
              eng: '1.5h',
            },
            {
              task: 'Read the codebase &amp; back office',
              produces: 'Technical map of the current system and where automation hooks in.',
              lead: '—',
              eng: '10h',
            },
            {
              task: 'Audit the documents &amp; data a merchant submits',
              produces: 'Inventory of the document types and fields captured today.',
              lead: '1h',
              eng: '4h',
            },
            {
              task: 'Session 2 — capture your approval criteria',
              produces:
                'Your manual judgement on record: what makes an application genuine, the red flags, the edge cases.',
              lead: '2.5h',
              eng: '1h',
            },
            {
              task: 'Write up the approval criteria (first-pass decision logic)',
              produces: 'Draft decision rules.',
              lead: '4h',
              eng: '—',
            },
            {
              task: 'Document-AI feasibility spike on a sample of your real documents',
              produces:
                'What an AI can read and validate, with confidence levels and what still needs a human.',
              lead: '—',
              eng: '8h',
            },
          ],
          subtotal: { lead: '11.5h', eng: '26.5h', total: '38h' },
        },
        {
          label: 'Week 2 — Design and size',
          tasks: [
            {
              task: 'Design the decision logic &amp; escalation line',
              produces: 'The auto-approve rules, the confidence thresholds, and what always comes to you.',
              lead: '5h',
              eng: '2h',
            },
            {
              task: 'Design the integration',
              produces:
                'How the automation triggers, runs on your stack, writes back, and keeps the audit trail.',
              lead: '1h',
              eng: '9h',
            },
            {
              task: 'Risk &amp; edge-case review',
              produces: 'Failure modes, spoofed documents, fallbacks to a human, data handling.',
              lead: '2h',
              eng: '2h',
            },
            {
              task: 'Size &amp; price the build',
              produces: 'The build broken into work packages, with effort, timeline, and a firm fixed price.',
              lead: '3h',
              eng: '5h',
            },
            {
              task: 'Session 3 — review with you',
              produces: 'The spec, escalation policy and quote walked through together and adjusted.',
              lead: '2h',
              eng: '1h',
            },
            {
              task: 'Assemble the deliverables',
              produces: 'The four documents below, finalised and handed over.',
              lead: '4h',
              eng: '2h',
            },
            {
              task: 'Final adjustments &amp; handover',
              produces: 'Loose ends closed; everything handed over.',
              lead: '1h',
              eng: '1h',
            },
          ],
          subtotal: { lead: '18h', eng: '22h', total: '40h' },
        },
      ],
      team: {
        label: 'Team and hours',
        roles: [
          {
            role: 'Engagement Lead',
            desc:
              'Runs the sessions, pulls the approval criteria out of your head, frames the build, owns the spec and the quote. <em>Strategy, AI solution design, facilitation.</em>',
            hours: '~30h',
          },
          {
            role: 'AI / Solutions Engineer',
            desc:
              'Technical mapping of your stack, document-AI feasibility, integration design, build sizing. <em>AI/LLM engineering, backend integration, document processing.</em>',
            hours: '~50h',
          },
        ],
        note: 'Around 80 focused hours across the two weeks.',
      },
      sessions: {
        label: 'Sessions with you',
        intro: 'Three working sessions across the two weeks, about 60–90 minutes each.',
        items: [
          {
            title: 'Session 1 · Week 1',
            desc: 'Walk your current onboarding and approval flow end to end.',
          },
          {
            title: 'Session 2 · Week 1',
            desc: 'Capture the approval criteria: how you decide a merchant is genuine.',
          },
          {
            title: 'Session 3 · Week 2',
            desc: 'Review the spec, the escalation policy, and the firm build quote together.',
          },
        ],
      },
      deliverables: {
        label: 'What you get at the end',
        items: [
          {
            title: 'Onboarding decision spec',
            desc:
              'Your approval logic in plain terms: the criteria, the auto-approve rules, the escalation policy.',
          },
          {
            title: 'Technical integration plan',
            desc: 'How the automation fits your existing stack, end to end.',
          },
          {
            title: 'Document-AI feasibility note',
            desc: 'What can be automated, with what confidence, and what still needs a human.',
          },
          {
            title: 'A firm fixed price and timeline for the build',
            desc: 'For Stage two — so you decide on the build with the full picture.',
          },
        ],
      },
    },

    {
      block: 'docFooter',
      left: 'Proposal · Urembo Hub',
      right: 'backspaceoddity.com',
    },
  ],
};
