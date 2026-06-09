/**
 * JetBrains — Campaign Intelligence workshop, Part 1 (discovery).
 *
 * Bespoke discovery flow for the live JetBrains marketing-team session.
 * Built from the existing block primitives — NOT the urembo sequence
 * (different engagement). Goal of Part 1: agree, together, which slice of
 * "what did our marketing produce for the money" we solve first, and lock it.
 * Part 2 (separate) = the Campaign Intelligence prototype shown as the result.
 *
 * Grounded in: 10 BSO meetings (Mar–Jun 2026), the Campaign Intelligence
 * proposal, the client Q&A (2026-06-09), and the 5-campaign data corpus in
 * Client projects/JetBrains/Context/. Structure: Deliverables/workshop-part1-structure.md (v3).
 *
 * Method: cascade-hypotheses — Underserved JTBD → Problems → CEP (the moment,
 * 7-W per the Puma operationalization) → Current solutions → converge → lock.
 *
 * STATUS: DRAFT for the live workshop. Ungated locally (no Supabase row / no
 * WS_PW_JETBRAINS) → renders directly at /w/jetbrains for screen-share.
 */

import type { ClientPage } from '../types';

export const jetbrainsPage: ClientPage = {
  slug: 'jetbrains',
  title: 'Campaign Intelligence — Working Session',
  blocks: [
    {
      block: 'docHeader',
      label: 'Working session · Campaign Intelligence',
      meta: 'JetBrains × Backspace Oddity',
      version: 'Live working session',
      date: 'June 2026',
    },

    {
      block: 'heardIt',
      sectionNum: '01 — How we heard it',
      heading: 'The task, as we understood it',
      statement:
        'You asked for a tool that shows not just what a campaign cost, but what it returned. Underneath it is a sharper question — and today nothing answers it.',
      body: [
        'You run 10–15 creative campaigns a year across 40 products, plus always-on channels — and every one reports in its own shape.',
        'The sharper question underneath: across all those products and campaign types, <strong>what did our marketing actually produce for the money we spent?</strong> It has no answer today — not because the data is missing, but because it has never been joined.',
        'This session is about agreeing, together, which slice of that to solve first.',
      ],
      pills: ['40 products', '5 campaign types', 'Five currencies', 'One unanswered question'],
    },

    { block: 'divider' },

    {
      block: 'beforeAfter',
      sectionNum: '02 — The core challenge',
      heading: 'Five currencies, no exchange rate',
      intro:
        'Across the campaigns you shared, each kind of work is measured in its own unit — and none of them convert.',
      before: {
        label: 'Today',
        core: 'Every campaign is its own island',
        body:
          'Downloads, brand-lift points, impressions, survey sentiment, watch-time — five ways of counting, none converts to another or back to revenue. Each report is sound on its own; none was built to talk to the others.',
      },
      after: {
        label: 'Where this goes',
        core: 'One connected picture, queryable',
        body:
          'Brief, creative, channel, result and revenue connected — so “what did this produce” becomes a question you can actually ask, across products and campaign types.',
      },
      note:
        'This isn’t a JetBrains failing — it’s what happens when campaign volume grows faster than the system beneath it. It’s an integration problem, and that’s exactly what’s solvable.',
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '03 — How we’ll work today',
      heading: 'How we’ll think about it together',
      body: [
        'We’ll walk five short exercises: the jobs your marketing team is hired for → which ones are underserved → what specifically breaks → the moment the need lands → what you’ve already tried.',
        'It’s the same method we’d put in your hands for campaigns — today, pointed at your own team’s problem. You rate, you pick; we lock it as where we start.',
      ],
      example:
        'By the end you’ll have placed and ranked the work yourselves — not us telling you the scope, you choosing it.',
    },

    { block: 'divider' },

    {
      block: 'exerciseMatrix',
      sectionNum: '04 — Over to you',
      heading: 'Which of these matter most — and run worst?',
      intro:
        'We pulled these from our calls and your reports. Drag each onto the grid — how important it is to you against how well it’s handled today. The ones that matter most but still run painfully are where we start. Tap ＋note on any card to tell us why.',
      exerciseId: 'jtbd-matrix',
      axisX: { label: 'How important to you', low: 'Minor', high: 'Critical' },
      axisY: { label: 'How well it’s handled today', low: 'Painful', high: 'Handled' },
      jobs: [
        { id: 'budget', label: 'Decide where the next budget goes' },
        { id: 'creative', label: 'Tell whether a creative concept worked' },
        { id: 'value', label: 'Prove marketing’s value to leadership' },
        { id: 'produced', label: 'Know what a campaign actually produced' },
        { id: 'compare', label: 'Compare campaigns on one footing' },
        { id: 'brief', label: 'Brief the next campaign smarter' },
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseRank',
      sectionNum: '05 — Where each one hurts',
      heading: 'Inside each, what bites hardest?',
      intro:
        'For the jobs you flagged as underserved, drag the problems so the one that hurts most sits on top. Draft lists — we’ll refine them together.',
      exerciseId: 'problem-rank',
      groups: [
        {
          jobId: 'budget',
          jobLabel: 'Deciding where the next budget goes',
          problems: [
            { id: 'budget-reconcile', label: 'The same downloads come back 7,300 / 6,063 / 2,204 — none reconcile' },
            { id: 'budget-loss', label: '~67% data loss in consent countries' },
            { id: 'budget-blind', label: '“Reddit off, daily.dev up” rests on numbers we flag unreliable' },
          ],
        },
        {
          jobId: 'creative',
          jobLabel: 'Telling whether a concept worked',
          problems: [
            { id: 'creative-severed', label: 'Creative is severed from result — no join from concept to download' },
            { id: 'creative-video', label: 'A 1.2M-view video can’t be tied to any product install' },
            { id: 'creative-noattr', label: '“No attribution to downloads or usages can be made”' },
          ],
        },
        {
          jobId: 'value',
          jobLabel: 'Proving marketing’s value',
          problems: [
            { id: 'value-currencies', label: 'Five currencies, nothing converts to one number' },
            { id: 'value-soft', label: '“No significant uplift, but we saw some”' },
            { id: 'value-b2b', label: 'B2B licenses driven by companies, not the end-users we reach' },
          ],
        },
        {
          jobId: 'produced',
          jobLabel: 'Knowing what a campaign produced',
          problems: [
            { id: 'produced-nohome', label: 'No single place where the data lands' },
            { id: 'produced-silo', label: 'Each PMM counts on their own' },
            { id: 'produced-nocompound', label: 'Retros happen, but learnings don’t compound' },
          ],
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseChips',
      sectionNum: '06 — The moment it lands',
      heading: 'When does the need actually arise?',
      intro:
        'The need shows up at a specific moment — that moment is what turns a background wish into an urgent one. Map it across these questions; pick what fits and add your own.',
      exerciseId: 'entry-points',
      questions: [
        {
          id: 'why',
          q: 'Why',
          example: 'leadership asks what a year of marketing produced',
          options: ['Budget planning for next year', 'A campaign just wrapped', 'Leadership asked “what did we get”', 'A channel is underperforming mid-flight'],
        },
        {
          id: 'when',
          q: 'When',
          example: 'in the run-up to a board review',
          options: ['Board / budget review', 'Quarter close', 'Post-campaign retro', 'Mid-campaign channel review'],
        },
        {
          id: 'where',
          q: 'Where',
          example: 'in a leadership review, on the spot',
          options: ['A leadership review', 'The media-buying team', 'A PMM’s own spreadsheet', 'A cross-product sync'],
        },
        {
          id: 'while',
          q: 'While',
          example: 'defending the budget under an AI-native mandate',
          options: ['Defending the marketing budget', 'Deciding next quarter’s channel mix', 'Justifying spend under a hiring freeze', 'Briefing the next campaign'],
        },
        {
          id: 'with-whom',
          q: 'With whom',
          example: 'in front of the CFO',
          options: ['The CFO / board', 'The CEO (AI-native mandate)', 'Other PMMs', 'Just you'],
        },
        {
          id: 'with-what',
          q: 'With what',
          example: 'five reports open that don’t agree',
          options: ['Five reports that don’t reconcile', 'A Looker dashboard', 'A manual sheet pull', 'An agency export'],
        },
        {
          id: 'how-feeling',
          q: 'How feeling',
          example: 'exposed — the number should exist and doesn’t',
          options: ['Exposed — can’t prove the return', 'Frustrated — the answer should exist', 'Under pressure — every dollar must count', 'Behind — competitors moving faster'],
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseSolutions',
      sectionNum: '07 — What you do today',
      heading: 'How do you handle each one now?',
      intro:
        'For each job, tell us the current workaround — the tool, the manual step, the thing you’ve already tried (per-project retros, dev-panel tests, Looker, the framework work with the previous agency). The pattern shows what’s worth solving — and that the gap isn’t for lack of trying.',
      exerciseId: 'current-solutions',
      jobs: [
        { id: 'budget', label: 'Deciding where the next budget goes', placeholder: 'e.g. Looker channel attribution, plus judgement…' },
        { id: 'creative', label: 'Telling whether a concept worked', placeholder: 'e.g. retros, occasional developer-panel tests…' },
        { id: 'value', label: 'Proving marketing’s value', placeholder: 'e.g. per-campaign decks, brand-lift panels…' },
        { id: 'produced', label: 'Knowing what a campaign produced', placeholder: 'e.g. per-project retros, manual sheet pulls…' },
      ],
    },

    { block: 'divider' },

    {
      block: 'emphasisFrame',
      label: 'The pattern',
      text:
        'Four seats described four different problems. Underneath, they’re the same broken chain — <strong>brief → creative → channel → result → revenue</strong>. Fix that one connection and every question above becomes answerable.',
      note: 'That’s the foundation. Whichever job you rated highest, it traces back to this.',
    },

    { block: 'divider' },

    {
      block: 'discussion',
      sectionNum: '08 — Where we start',
      heading: 'The slice we lock today',
      intro:
        'From what you rated and ranked: we pick the one slice we build first, and lock it here. It records to our shared workspace as what this engagement is measured against — holding us to a clear scope, and the work to a chosen one.',
      questions: [
        {
          q: 'Of the jobs on the matrix, which one do we commit to first?',
          note: 'The most important × worst-handled is the natural pick — but it’s your call, not ours.',
        },
        {
          q: 'What would “this is working” look like, three months in?',
          note: 'So the locked slice has a result we both recognise when we get there.',
        },
      ],
      addLabel: 'Anything else to lock in?',
    },

    {
      block: 'statement',
      text:
        'Here’s what that one connection looks like, already solved →',
    },

    {
      block: 'docFooter',
      left: 'Working session · Part 1 of 2',
      right: 'backspaceoddity.com',
    },
  ],
};
