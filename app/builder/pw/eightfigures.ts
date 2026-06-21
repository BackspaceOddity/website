/**
 * 8FIGURES — Brand Sprint (interactive proposal page).
 *
 * Source: Notion v2 cad5950afde644fc96d47bc93bf09bc0 (fetched fresh 2026-06-19).
 * All content sections are verbatim from the Notion document.
 * Interactive blocks (clientInput, bookingEmbed) are format additions.
 *
 * STATUS: DRAFT — pass ToV + Yegor review before onboarding + deploy.
 */

import type { ClientPage } from './types';

export const eightfiguresPage: ClientPage = {
  slug: '8figures',
  title: '8FIGURES — Brand Sprint',
  blocks: [
    {
      block: 'docHeader',
      label: 'Brand Sprint · 8FIGURES',
      meta: 'Prepared by Backspace Oddity · for 8FIGURES',
      version: 'Conceptual proposal',
      date: 'June 2026',
    },

    // § 01 — How we’ve interpreted your ask
    {
      block: 'heardIt',
      sectionNum: '01 — How we heard it',
      heading: 'How we’ve interpreted your ask',
      statement:
        '8FIGURES has the team, a product past v1, and a real market — what’s missing is a marketing engine you can read.',
      body: [
        'You want to pull it out of chaos and walk into your August investor meetings looking fundable.',
        'Before spending more, you need three answers: who do we win first, why do they pick us, and in what order do we move?',
      ],
      pills: ['August fundraise', 'Marketing engine', 'ICP clarity', 'SEC-registered'],
    },

    { block: 'divider' },

    // § 02 — How we’ll approach it
    {
      block: 'narrative',
      sectionNum: '02 — How we’ll approach it',
      heading: 'How we’ll approach it',
      body: [
        'You’ve run the experiments already — a marketer brought in, budget spread across channels, still no clean read on what worked. The cause is mechanical, not effort. Until the positioning is fixed, every test changes the audience, the message and the promise together — so a flat result tells you something missed, never which one. That’s how motion piles up and conclusions don’t.',
        'We start somewhere else. We look for the underserved job your customer hires 8FIGURES to do, and the moment that job becomes important. Get those right and everything downstream narrows — who to reach, what to say, and who you are really beating.',
        'Two people hold the same $1M. The first is an engineer whose company just sold — the cash landed yesterday, no advisor, searching "what to do with 20 million." The second inherited years ago and has always had an advisor. Same net worth, different job, different moment, different rival. For the first you beat confusion and a search bar; for the second you beat the advisor who answers email in five days. Same product, two strategies that share nothing. Net worth told you nothing — the moment told you everything.',
        'We build each answer as something you can use — a locked direction, positioning, a Messaging House, then a site that carries them. We treat all of it as hypotheses: what we lock in week one can sharpen by the time it reaches the screen.',
      ],
    },

    { block: 'divider' },

    // § 03 — Three phases + timeline
    {
      block: 'processFlow',
      sectionNum: '03 — The sprint',
      heading: 'Three phases',
      intro:
        '€15,000 fixed, 3–4 weeks, done before your August trip — async, one round of edits on the meaning layer, 8–10 person-days. That’s a month or two of your current marketing spend, so we keep the scope narrow and you keep performance running while we work. Out of scope, on purpose: fresh user interviews, a full design system, the whole site and every channel, sales enablement, launch.',
      steps: [
        {
          title: 'Phase 1 — Lock who it’s for, and how it feels',
          desc:
            'Before we write or design anything, we settle the one decision the rest stands on. We pull together what you already know, then resolve who 8FIGURES wins first and the feeling the brand has to carry — light intake of the current site, analytics, whatever you already know about how users behave; AI synthesis of that raw material into one picture; a working session to resolve the fork: net worth vs portfolio complexity vs the activation moment; lock the brand attributes — the bar we judge every visual against.<br><br>What you get: <strong>Locked direction (one page)</strong> — the decision the team stops re-litigating, "millionaires or mass affluent" settled, with the reasoning behind it. <strong>Brand attributes</strong> — "Expensive and trustworthy" written down as a bar, so taste stops being the argument.',
        },
        {
          title: 'Phase 2 — Name the customer, and the reason they pick you',
          desc:
            'Here the fork becomes a sharp, defensible answer — the moment the team, and later the investor, lean in. We turn the locked direction into the core of meaning — the job, the moment, the rival, and the words: segments through jobs; who you beat in that moment — ChatGPT, the expensive advisor, the habit of doing nothing; Positioning (1-pager) — category, value proposition, difference, who it’s for; Messaging House (Universal) — one-liner, elevator pitch, value themes, a Tone of Voice base. A review and one round of edits.<br><br>What you get: <strong>Positioning (1-pager)</strong> — one answer to "what is your product," the same on the site, in the pitch, and on the team’s lips. <strong>ICP through jobs</strong> — who to drive in, and at which moment — so channels stop firing blind. <strong>Messaging House (Universal)</strong> — language the team uses the next day — why you beat ChatGPT, in words, not guesses.',
        },
        {
          title: 'Phase 3 — Put it on screen, and hand it over',
          desc:
            'The meaning now exists; this step puts it in front of a person and into your team’s hands, so the system runs without us. Core identity — logo, typography, color. A redesigned landing on our AI-native stack — first screen, promise, and the proof you already hold: SEC registration, your ratings, your press. A mini brand guide. Handover — files and guide, so your front-end builds the next surfaces in the same language.<br><br>What you get: <strong>Core identity (logo / type / color)</strong> — 8FIGURES reads like a product for people with real money. <strong>Redesigned landing</strong> — by August the user and the investor meet an expensive, trustworthy first screen. <strong>Mini brand guide + files</strong> — the team builds the next surfaces itself, in one language, without us.',
        },
      ],
    },

    { block: 'divider' },

    // Interactive additions — not in the Notion doc; part of the landing page format
    {
      block: 'clientInput',
      sectionNum: '04 — What you told us',
      heading: 'Your notes on this page',
      intro:
        'Captured straight from what you added here — so it stays with the work and we build the next call around it.',
    },

    { block: 'divider' },

    {
      block: 'bookingEmbed',
      sectionNum: '05 — Book the call',
      heading: 'Grab a time that works for you',
      intro: 'Pick a slot below and we’ll walk through it together.',
      calLink: 'team/backspace-oddity/deep-dive',
    },

    {
      block: 'docFooter',
      left: 'Brand Sprint · Initial Assessment · Not a proposal',
      right: 'backspaceoddity.com',
    },
  ],
};
