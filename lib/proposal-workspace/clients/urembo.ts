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
      version: 'Conceptual proposal',
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
        core: 'Every merchant waits for you',
        body:
          'Sign-up arrives → you open the admin dashboard → check the uploaded documents → verify the business → approve the Paystack sub-account → the merchant gets the email and can finally start. Three to five days, and a real chance they drop off before the approval lands.',
      },
      after: {
        label: 'Where this goes',
        core: 'Merchants onboard themselves; you handle the exceptions',
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
        'We start the same way as on the engagements you saw: take the one workflow that costs you the most time and rebuild it with AI inside — so within a few weeks you run it without us. For Urembo, that workflow is merchant onboarding, on the stack you already own.',
      ],
      bullets: [
        'It builds on what you already have — your GitHub, your database, your back office. We add AI to your own stack, rather than bolting a tool on from outside.',
        'The first build is the onboarding approval flow: it reads the submitted documents, runs the verification and authenticity checks, sets up the Paystack sub-account, and activates the merchant.',
        'You stay in the loop only where it matters — anything genuinely unclear comes to you, while the routine applications clear on their own.',
        'Once support volume is real, the same pattern extends to tickets — one approach, steadily taking more of the operation off your plate.',
      ],
      example:
        'The same engine that clears a merchant in minutes also gives you the audit trail — every approval, every reason, on record.',
    },

    { block: 'divider' },

    {
      block: 'processFlow',
      sectionNum: '04 — What it might look like',
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
      block: 'nextSteps',
      sectionNum: '06 — From our side',
      heading: 'What happens next',
      intro:
        'This is our read, not a proposal yet. The next step is a short call to discuss it together and agree where to actually start.',
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
    },

    { block: 'divider' },

    {
      block: 'clientInput',
      sectionNum: '07 — What you told us',
      heading: 'Your notes on this page',
      intro:
        'Captured straight from what you added here — so it stays with the work and we build the next call around it.',
    },

    { block: 'divider' },

    {
      block: 'discussion',
      sectionNum: '08 — To align on',
      heading: 'Questions for our next call',
      intro:
        'We’ve turned your notes above into the questions below — the agenda for our call. Add your own anytime; this page stays yours.',
      questions: [
        {
          q: 'When an application gets flagged for review, should we automatically email the merchant exactly what’s missing — registration, tax compliance, store number, location, bank details, commission split — and activate them the moment it all clears?',
          note: 'From your note on the “needs a look” path in section 04.',
        },
        {
          q: 'Should the merchant agreement and the onboarding video become part of sign-up itself, instead of a manual email back-and-forth?',
          note: 'You flagged this as still manual today.',
        },
        {
          q: 'Should the jurisdiction-specific policies be a required checkbox at sign-up?',
          note: 'You mentioned the documents are already prepared per jurisdiction.',
        },
        {
          q: 'Should the system map DHL pickup and drop-off by jurisdiction and calculate each shipment’s cost automatically from the rate cards?',
          note: 'Building on the DHL partnership and rate cards you already have in place.',
        },
        {
          q: 'Should merchants get automatic order alerts, so nothing slips when they’re not logged into the dashboard?',
          note: 'From the missed-orders risk you raised.',
        },
        {
          q: 'Of all of these, which one would free you up the most if we built it first?',
          note: 'So we start where it unblocks you fastest.',
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'bookingEmbed',
      sectionNum: '09 — Book the call',
      heading: 'Grab a time that works for you',
      intro:
        'Pick a slot below and we’ll walk through it together.',
      calLink: 'team/backspace-oddity/deep-dive',
    },

    {
      block: 'docFooter',
      left: 'Initial Assessment · Not a proposal',
      right: 'backspaceoddity.com',
    },
  ],
};
