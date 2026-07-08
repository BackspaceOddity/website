/**
 * Trashformas — initial assessment (BSO-793).
 *
 * Migration of the live bespoke `trashformas.backspaceoddity.com` route onto the
 * /w block engine. Content is Anna's canon-format draft "Conceptual proposal —
 * Trashformas" (Notion Internal Docs 660c96f9-f6f9-4c45-ae19-c9f92d72a9ac),
 * mapped 1:1 to blocks. Body text is verbatim from that draft; before/after
 * cores and step titles are the block-format glue (same pattern as urembo.ts).
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
  title: 'Trashformas — Initial Assessment',
  blocks: [
    {
      block: 'docHeader',
      label: 'Initial Assessment · Trashformas',
      meta: 'Prepared by Backspace Oddity · for Thara Aisha Atta',
      version: 'Conceptual proposal',
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
      heading: 'Diagnosis before solution',
      before: {
        label: 'Today',
        core: 'Every question has one address — yours',
        body:
          'You hand a task to your outsourced marketing team, with a written guideline and battle cards already in their hands. They open a WhatsApp group. Inside it, they still direct every question straight to you — so you sit in the group answering things the guideline already covered, and the intermediary you brought on to save your time now spends it. The same pattern shows up inside the team: you explain a decision in one meeting, and a week later you explain it again, because there’s nowhere it stayed.',
      },
      after: {
        label: 'Where this goes',
        core: 'The team asks the system, not you',
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
      block: 'narrative',
      sectionNum: '04 — What it might look like',
      heading: 'A hypothesis to co-shape, not a fixed plan',
      body: [
        'The first artifact would likely be a <strong>decision log</strong> — a single structured record of what the team decided, why, and what it rules out. Walk it through your marketing example: a question lands in the WhatsApp group; if the answer already sits in the log — a settled guideline, a prior decision — the system surfaces it to the partner directly, and you never see the ping. If it’s genuinely new or unclear, it routes to you or the COO for a call, and that answer goes back into the log so it’s only ever answered once. It’s the same accept-or-escalate logic your COO sign-off gate already implies. Treat the name loosely — we’d shape it with you once we’ve walked a real week of your decisions together.',
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
      heading: 'Two steps, co-owned',
      steps: [
        {
          title: 'Walk one real week together',
          desc:
            'The marketing escalations, the two-app roadmap debate, the decisions you had to repeat — we mark exactly where context went missing and who had to step in.',
        },
        {
          title: 'Agree on the one signal that it’s working',
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
      heading: 'Sharp, one per theme',
      intro:
        'The questions below are our agenda for the call. If anything else comes to mind, add it — this page stays yours.',
      addLabel: 'Anything else to add?',
      questions: [
        {
          q: 'Which decisions should the system answer on its own, and which must always wait for the COO’s sign-off?',
          note: 'You want the COO’s sign-off gate respected.',
        },
        {
          q: 'The B2B institutional and estate-contract blueprint from your email didn’t surface on the call — is that still a live use case, and does it belong to Trashformas or to a separate venture?',
          note: 'The test case from your email.',
        },
        {
          q: 'Is capture happening consistently across every meeting, or does the system also need to fix the habit of recording in the first place?',
          note: 'You’re recording with Fathom today.',
        },
        {
          q: 'Should the internal context layer wait for the collection app, or stand on its own with meetings first and connect to the app later?',
          note: 'The collection app isn’t built yet.',
        },
        {
          q: 'Should we design the first build to be portable from day one, or prove it once at Trashformas first?',
          note: 'You want this to carry over to transport, textiles, and logistics.',
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
