# Urembo Hub — Proposal · "Plan" section (source for /w/urembo page)

Source: Notion proposal 384402511cda8110b44de90387b3c193 (canonical, Yegor-reviewed).
Fetched 2026-07-06. Rendered on the page as a new block replacing the old §12 "Questions for our call".

## Intro
Two weeks, in detail — the concrete work, the people on it, the hours, and exactly what you receive at the end.

## What the sprint is for
Two weeks to turn merchant onboarding from something only you can do into something we can build — and to put a firm price and timeline on that build before you commit to it. We haven't seen your system yet — week one is where we do. So the plan below is detailed about our work, and deliberately open about what we learn from yours.

## Week 1 — Map and capture (Lead 11.5h · Eng 26.5h · 38h)
- Kickoff & access setup — 2h / 2h — Access to the codebase, database, admin dashboard, and Paystack; a working agreement for the two weeks.
- Session 1 — walk the current onboarding flow end to end — 2h / 1.5h — A shared, written map of how onboarding works today.
- Read the codebase & back office — — / 10h — Technical map of the current system and where automation hooks in.
- Audit the documents & data a merchant submits — 1h / 4h — Inventory of the document types and fields captured today.
- Session 2 — capture your approval criteria — 2.5h / 1h — Your manual judgement on record: what makes an application genuine, the red flags, the edge cases.
- Write up the approval criteria (first-pass decision logic) — 4h / — — Draft decision rules.
- Document-AI feasibility spike on a sample of your real documents — — / 8h — What an AI can read and validate, with confidence levels and what still needs a human.

## Week 2 — Design and size (Lead 18h · Eng 22h · 40h)
- Design the decision logic & escalation line — 5h / 2h — The auto-approve rules, the confidence thresholds, and what always comes to you.
- Design the integration — 1h / 9h — How the automation triggers, runs on your stack, writes back, and keeps the audit trail.
- Risk & edge-case review — 2h / 2h — Failure modes, spoofed documents, fallbacks to a human, data handling.
- Size & price the build — 3h / 5h — The build broken into work packages, with effort, timeline, and a firm fixed price.
- Session 3 — review with you — 2h / 1h — The spec, escalation policy and quote walked through together and adjusted.
- Assemble the deliverables — 4h / 2h — The four documents below, finalised and handed over.
- Final adjustments & handover — 1h / 1h — Loose ends closed; everything handed over.

## Team and hours (~80h total)
- Engagement Lead (~30h) — Runs the sessions, pulls the approval criteria out of your head, frames the build, owns the spec and the quote. (Strategy, AI solution design, facilitation.)
- AI / Solutions Engineer (~50h) — Technical mapping of your stack, document-AI feasibility, integration design, build sizing. (AI/LLM engineering, backend integration, document processing.)

## Sessions with you (3 × 60–90 min)
- Session 1 (week 1) — walk your current onboarding and approval flow end to end.
- Session 2 (week 1) — capture the approval criteria: how you decide a merchant is genuine.
- Session 3 (week 2) — review the spec, the escalation policy, and the firm build quote together.

## What you get at the end
1. Onboarding decision spec — your approval logic in plain terms: the criteria, the auto-approve rules, the escalation policy.
2. Technical integration plan — how the automation fits your existing stack, end to end.
3. Document-AI feasibility note — what can be automated, with what confidence, and what still needs a human.
4. A firm fixed price and timeline for the build (Stage two).
