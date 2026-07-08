/**
 * Trashformas — initial assessment (BSO-793).
 *
 * Migration of the live bespoke `trashformas.backspaceoddity.com` route onto the
 * /w block engine. Reproduces the LIVE page 1:1 (verified against the authed
 * live render, 2026-07-08) — the live copy is a hand-polished edit of Anna's
 * Notion draft 660c96f9, NOT verbatim. The one intentional addition is the §07
 * `clientInput` "Your notes" section, which brings the BSO-792 edit/delete.
 *
 * Company: Trashformas — biogas / circular infrastructure, Nigeria.
 * Contact: Thara Aisha Atta. CRM: Deal "[Trashformas] Context graph" — Proposal.
 *
 * Seamless-migration invariant (BSO-793): same URL + same access code as the
 * live bespoke page. The Supabase `workspaces` row for slug 'trashformas' must
 * carry the CURRENT live code (from .workspace-secrets/trashformas.txt), never a
 * freshly generated one.
 */

import type { ClientPage } from '../types';

export const trashformasPage: ClientPage = {
  slug: 'trashformas',
  title: 'Conceptual proposal — Trashformas',
  blocks: [
    {
      block: 'docHeader',
      label: 'Conceptual proposal',
      meta: 'Prepared by Backspace Oddity · for Thara Aisha Atta',
      version: 'v0.1',
      date: 'July 2026',
    },

    {
      block: 'heardIt',
      sectionNum: '01 — How we heard it',
      heading: 'What we took from the call, in your words',
      statement:
        'What’s slowing you down isn’t the work itself — it’s that every decision has to pass through you.',
      body: [
        'Trashformas is building a biogas supply chain in Nigeria — from household waste collection to distribution as a clean cooking fuel — and most of it still runs manually today. Your team is four people, and the context lives in your head: meetings repeat themselves, and even the outside marketing firm you hired routes every question back to you. What you want is one place that holds what the team already knows and hands it back at the moment someone needs it.',
      ],
      pills: [
        'Biogas / circular infrastructure',
        'Nigeria, emerging market',
        'Pre-launch startup',
        'Founder-as-bottleneck',
        'Context, not tasks',
      ],
    },

    { block: 'divider' },

    {
      block: 'beforeAfter',
      sectionNum: '02 — The core challenge',
      heading: 'The shift this is really about',
      before: {
        label: 'Today',
        core: 'Every question has one address — you',
        body:
          'You hand a task to your outsourced marketing team, with a written guideline and battle cards already in their hands. They open a WhatsApp group — and still direct every question straight to you, so the intermediary you brought on to save your time now spends it. The same pattern shows up inside the team: you explain a decision in one meeting, and a week later you explain it again, because there’s nowhere it stayed.',
      },
      after: {
        label: 'Where this goes',
        core: 'The system holds the context, so you don’t',
        body:
          'A place that already holds the business context — so the marketing partner asks the system instead of you, a decision made once stays made, and you can step out of conversations that don’t need you while the team still moves forward.',
      },
      note:
        'When the context only lives in your head, every question has one address — yours.',
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '03 — Where we’d start',
      heading: 'The first move, and why it comes first',
      body: [
        'We’d start with capture — getting what the team already knows into one structured place — because the guides and guardrails you described only work if there’s something reliable underneath them. You’ve chosen n8n and you’re already recording with Fathom; the missing piece is the layer those recordings feed.',
      ],
      bullets: [
        'Start with the meetings, because that’s where your context is born and lost. You run internal and virtual calls through Fathom today, but the output scatters into Gemini, Claude, and ChatGPT and never lands anywhere shared. Pulling those transcripts into one structured store is the first thing that stops you repeating yourself.',
        'Keep the internal layer and the app data on separate tracks at first. Meeting context and the household data from the collection app are two different kinds of information — audio and decisions on one side, images and waste-volume measurements on the other. They’ll meet eventually, but forcing them together on day one is how a store fills with noise.',
        'Decide what “valuable” means before the guides read anything. You said the Passive Project Guides should surface only what matters — not every piece of jargon that enters the vault. That filter is a design choice to make with you, not a default to inherit.',
      ],
    },

    { block: 'divider' },

    {
      block: 'processFlow',
      sectionNum: '04 — What it might look like',
      heading: 'What it might look like',
      intro:
        'A hypothesis to co-shape, not a fixed plan. The first artifact would likely be a <strong>decision log</strong> — a single structured record of what the team decided, why, and what it rules out.',
      steps: [
        {
          title: 'A question lands',
          desc:
            'Someone — say your outsourced marketing partner — asks a question in the WhatsApp group.',
        },
        {
          title: 'The system checks the log',
          desc:
            'If the answer already sits in the decision log — a settled guideline, a prior decision — it surfaces straight to them, and you never see the ping.',
          branches: [
            {
              label: 'Already decided',
              body: 'Surfaced to the asker directly. You’re not pulled in.',
              primary: true,
            },
            {
              label: 'New or unclear',
              body:
                'Routes to you or the COO for a call — and that answer goes back into the log, so it’s only ever answered once.',
            },
          ],
        },
        {
          title: 'Answered once, kept forever',
          desc:
            'It’s the same accept-or-escalate logic your COO sign-off gate already implies. We’d shape the artifact with you once we’ve walked a real week of your decisions together.',
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'whatStayed',
      sectionNum: '05 — What stayed with us',
      heading: 'One thing from the call',
      body: [
        'You named the trap most people walk into: it isn’t automation itself, it’s automating the wrong task and then hiring someone to babysit the machine — automate 80% of the work and still do 80% of it by hand. That’s the exact failure you’re designing against, and it’s why you keep insisting the system guide the team rather than replace it. Guardrails, not autonomy — that instinct is the right one to build on.',
      ],
    },

    { block: 'divider' },

    {
      block: 'nextSteps',
      sectionNum: '06 — What happens next',
      heading: 'What happens next',
      intro: 'Two steps, co-owned.',
      steps: [
        {
          title: 'Walk one real week together',
          desc:
            'The marketing escalations, the two-app roadmap debate, the decisions you had to repeat — and mark exactly where context went missing and who had to step in.',
        },
        {
          title: 'Agree on the one signal that says it’s working',
          desc:
            'The clearest candidate from the call is you being absent from a decision that still moves forward — let’s define what that looks like before anything gets built.',
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'clientInput',
      sectionNum: '07 — What you told us',
      heading: 'Your notes on this page',
      intro:
        'Captured straight from what you add here — so it stays with the work and we build the next call around it.',
    },

    { block: 'divider' },

    {
      block: 'discussion',
      sectionNum: '08 — Questions for our next call',
      heading: 'Questions for our next call',
      addLabel: 'Add your own question',
      questions: [
        {
          q: 'Decision rights: which decisions should the system answer on its own, and which must always wait for the COO?',
          note: 'You want the COO’s sign-off gate respected.',
        },
        {
          q: 'The test case: is the B2B institutional / estate-contract blueprint still live, and does it belong to Trashformas or a separate venture?',
          note: 'It didn’t surface on the call.',
        },
        {
          q: 'Capture habit: is recording with Fathom consistent across every meeting, or does the system also need to fix the habit of capturing?',
          note: 'You’re recording with Fathom today.',
        },
        {
          q: 'App data: should the internal context layer wait for the collection app, or stand on its own with meetings first and connect later?',
          note: 'The collection app isn’t built yet.',
        },
        {
          q: 'Replicability: design the first build portable from day one, or prove it once at Trashformas first?',
          note: 'You want this to carry to transport, textiles, logistics.',
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
