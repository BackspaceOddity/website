# Changelog

## 2026-04-22 → 2026-04-23 — V2 content rebuild: skeleton + audit + hero locked

**What happened:**
- Published IA sketch drafts v0 / v1 / v1.1 to Notion → Yegor rejected the lot: "wrong accents, wrong packaging, wrong positioning". Drafts archived.
- Built best-practice structure skeleton page (8 screens + footer + open questions); added Jobs-framing cross-cutting principle, Screen 3 renamed "Jobs we close"
- Reference site audit of 7 sites (Harvey, Sierra, Decagon, 11x, Sana, Superside, IDEO) published as Notion subpage
- Yegor annotated audit with 14 inline comments → filtered most enterprise-grade patterns out for V1 (BSO too early)
- Hero went through 4 failed iterations before landing on Yegor's formulation: "GTM strategy is not a set of tactics across channels." Locked in skeleton 2026-04-22.
- Mid-session catch: Cascade Navigation System v5.1 canonical IP was missing from graph → patched SB node + positioning-framework wiki-links + cached full v5.1 doc in vault/docs

**Decisions made:**
- Jobs framing (JTBD over segments) as cross-cutting structural principle
- Content Marketing Strategy v1 BRIEF signature thesis didn't survive Maja-check → needs tightening (change-request to parallel CM session)
- Screen 1 Hero locked; Screen 2 work deferred; Screens 3–10 skeleton only
- "Defer V1 for": logo strip, outcome metrics, testimonials, trust/SOC2, video hero, FAQ

**Errors encountered (all captured in LEARNINGS):**
- Option-C snapshot (CANONICAL-SOURCES.md) is write-once — cached v0 BRIEF at session start, didn't catch v1 lock in Notion mid-session. Same class as cascade miss.
- Under pushback I re-generated drafts from abstract principles instead of re-reading BRIEF §4. Four failed hero drafts before landing.
- Notion normalizes `_italic_` → `*italic*` on storage — first `update_content` failed silently because anchors used create-time syntax.
- tov.md rule "no client diagnosis" violated with "You have X. You don't have Y." despite knowing the rule.

**Result:**
- Notion skeleton page ready for Screen 2 drafting next session
- Hero locked with 4-gate validation (tov/Maja/BRIEF/hook)
- 6 transferable learnings captured
- Advisor identified 3 distinct error roots + hook/enforcement proposal

---

## 2026-04-20 — WEBSITE-CONTENT.md rebuilt from live-site ground truth

**What happened:**
- Fetched backspaceoddity.com + cross-referenced `src/index.html` to capture actual deployed copy
- Created V2 of WEBSITE-CONTENT.md with verbatim section-by-section content
- Renamed: V2 → `WEBSITE-CONTENT.md` (primary), V1 → `WEBSITE-CONTENT-v1-archive.md` with do-not-edit banner
- Documented 12+ divergences between V1 (2026-03-17 state) and live site in a DIFF section
- Updated STATE.md to reflect current reality: Film Production has real content, iki.ai removed, Row 3 restructured to 2 cards, 5 unpushed commits

**Decisions made:**
- Keep V1 as historical snapshot rather than delete — useful diff baseline for future copy changes
- Primary filename stays `WEBSITE-CONTENT.md` so downstream references don't break

**Errors encountered:**
- WebFetch missed Row 3 structure (treated stale HTML comment as truth); caught by grepping `iki` in the actual HTML. Lesson: always verify WebFetch output against the source file.

**Result:**
- `WEBSITE-CONTENT.md` now matches live site 1:1 (source: `src/index.html`)
- 5 commits queued for push (awaiting GitHub PAT)

---

## 2026-04-08 — Major copy rewrite + portfolio restructure + deployment setup

**What happened:**
- Replaced manifesto section heading and copy entirely: "Most agencies leave after the strategy" → "Not just decision-making. But decision making, too." with new body copy about brand as OS
- Rewrote business case heading: "How brand work shows up in numbers" → "How investing in brand shows up in numbers"
- Replaced brand diagram heading: "But what is brand?" → "Why invest in brand when the product sells itself?"
- Updated reframe copy: added "even your business model or GTM strategy" to the list of brand-affecting decisions
- Added portfolio section heading: "Our most recent experience"
- Reordered portfolio rows: 2-col-eq (Global Payroll + Film Production) moved to Row 2, 3-col (Wayfund + iki.ai + Superabundance) to Row 3
- Updated Sidekick Browser description: added acquisition by Perplexity, relaunch as Comet
- Updated team copy: added McKinsey, R/GA, Metalab, Stink Studios, Your Majesty, Meta to company list
- Increased hero desc font size: 20px → 26px
- Fixed metrics grid alignment: switched from flex to CSS Grid subgrid so all body texts align
- Added 120px margin-top before portfolio section
- Explored AI image generation for hero backdrop (retrofuturistic 70s sci-fi, yellow-green palette) — unresolved
- Created GitHub repo BackspaceOddity/website, initialized git locally, deployment pending PAT
- Created Slack workspace icon (512×512, white padding around Logo Mark SVG)
- Kept WEBSITE-CONTENT.md and PROJECT-CONTEXT.md in sync throughout

**Decisions made:**
- Manifesto concept: brand as decision-making OS, not just process claim
- "decision-making / decision making" wordplay (hyphen removal = shift from noun to active force)
- "but also" rejected → "But decision making, too." approved
- Retrofuturistic 70s sci-fi aesthetic for hero image (inspired by Tangerine Dream, Chris Foss, user's Pinterest moodboard)
- Two backdrop images planned: hero (cool/teal or yellow-green) + manifesto (warm orange) — differentiated by color temperature
- ChatGPT keeps generating synthwave CG, not 70s painterly — try Chris Foss prompt or accept current gradient

**Errors encountered:**
- Edit tool "File has not been read yet" — must always Read before Edit
- npm install -g vercel failed (permissions) — used --prefix workaround
- Vercel CLI login required interactive auth — blocked in VM

**Result:**
- Website copy substantially updated and approved
- Portfolio visually restructured
- Deployment infrastructure ready, awaiting GitHub PAT

---

## 2026-03-17 — Portfolio redesign + real project photos

**What happened:**
- Redesigned portfolio from original flex layout to 2+3 grid (Superside-style titles on images)
- Added hover overlay (dark background + description text)
- Replaced gradient placeholders with real project photos
- Added two new cards: Global Payroll Platform + Film Production Company
- Fixed hero title turning blue (mix-blend-mode: normal override)
- Tightened horizontal margins (--px: 40px system, --side-padding: 0px)
- Added whitespace between sections (manifesto margin, bizcase header spacing)
- Fixed screenshot cropping (object-fit: contain + dark bg for card--top class)
- Fixed hover color: green → black overlay

**Decisions made:**
- object-fit: contain + #0d0d0d background for screenshot cards (card--top class)
- Gradient/grayscale mask attempts rejected — clean photos preferred
- 2+3+2 grid structure (later reordered to 2+2+3)

**Result:**
- Portfolio section fully rebuilt and approved

### 2026-04-20 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-20-1930-89345-yegorkorobeynikov.md` had 2 user prompts, 16 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-21 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-20-2149-98664-yegorkorobeynikov.md` had 8 user prompts, 40 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-21 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-20-2149-98664-yegorkorobeynikov.md` had 8 user prompts, 40 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-21 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-21-1410-1817-yegorkorobeynikov.md` had 3 user prompts, 14 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-22 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-21-1435-7686-yegorkorobeynikov.md` had 8 user prompts, 39 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-23 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-22-1610-33436-yegorkorobeynikov.md` had 17 user prompts, 64 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-23 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-23-1501-71903-yegorkorobeynikov.md` had 13 user prompts, 50 tool calls, 0 errors. Full raw log has been deleted (retention policy).
