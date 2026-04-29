# Backspace Oddity Website — Current State

**Last updated:** 2026-04-29 (/wrap)
**Status:** In Progress — **V2 implemented on master; Next.js migration active in worktree** (BSO-189)
**Client/Context:** Backspace Oddity — strategic brand growth agency, Amsterdam

## Quick state — what changed 2026-04-29

- **V2 homepage** (Claude Design handoff DicK6mMEcbYL + Notion-canonical copy) committed на master `2bd13cd`. Hero, Selected work (6 cards including Stape placeholder), Jobs we close (5 final JTBDs), How we work (3 principles + Map/Build/Transfer + AI-native intro), Team, Final CTA, Insights strip, Footer.
- **Notion landing skeleton page sync-checked** (status block, AI-native intro в Screen 4, archive-block stale-comments note).
- **Next.js migration started** в worktree `nextjs-migration` (commit `74d189e`). `lib/edit-mode/` + EditModeShell + `/api/save-draft` + `_edit-threads.json` подключены — pattern parity с BSO Canvas / Knowledge-OS-Product/web / Stape. Dev server на http://localhost:3456 верифицирован: все 8 секций рендерятся, edit toolbar монтируется. Linear: BSO-189.
- **Push blocked на PAT** — на master 73 commit'а unpushed. На branch `nextjs-migration` тот же блок.

## What This Project Is
Rebuilding the Backspace Oddity marketing website (backspaceoddity.com) under two tracks:
1. **Live-site maintenance** — static HTML/CSS at `src/index.html`, what's currently deployed.
2. **V2 content rebuild** — new site copy + IA, authored in Notion under "New website V2" parent page (`349402511cda8064acc2f157d1ab11b8`). Skeleton + drafts live there before anything lands in HTML.

## Current Status

### Track 1 — Live site (on pause)
- Live at backspaceoddity.com
- WEBSITE-CONTENT.md synced to `src/index.html` (2026-04-20)
- 5 local commits on `master` still unpushed (blocked on PAT)

### Track 2 — V2 content rebuild (active, 2026-04-22 → 2026-04-23)

Notion structure under "New website V2":
- **IA sketch v0 — screen by screen** (`349402511cda8171bd5bff0dc665a390`) — archive of v0 + v1 + v1.1 drafts that got rejected
- **Landing skeleton — best-practice structure** (`34a402511cda81bcaf55fcc83eadd4d0`) — working skeleton where drafts land
- **Reference site audit — 6 sites across 3 clusters** (`34a402511cda81bd84c6e88f60918a05`) — Harvey, Sierra, Decagon, 11x, Sana, Superside, IDEO with 14 Yegor annotations

**Hero locked 2026-04-22:**
- **H1:** "GTM strategy is not a set of tactics across channels."
- **Sub (draft):** "It's the decisions underneath — underserved jobs, ICP, category entry points — that make the channels worth running."
- **CTA:** Book a call → Cal.com
- Passed 4 gates: tov.md (no client judgment), Maja-check (thesis survives against thought-leaders in the category), BRIEF §4 thesis (negative half; positive half unfolds Screen 2), hook (implicit "if not X, then what").

**Cross-cutting principle locked:** Jobs framing (JTBD over segments) — Screen 3 renamed "Jobs we close" with 5 draft jobs + competition re-frame per job.

**Context loaded in `context/`:**
- `positioning/bso-positioning-framework-v1.md`
- `positioning/content-marketing-brief-v0.md`
- `positioning/cascade-navigation-system-v5.1.md` (mid-session catch of canonical drift)
- `foundation/bso-magician-not-teacher-architecture.md`
- `market-context/` (Foundation + Sequoia articles)

### Track 2 — filtered OUT for V1 (per Yegor's review of audit)
Logo strip, outcome metrics in cases, attribution testimonials, trust/SOC2-style sections, video hero, FAQ section. BSO too early in category for enterprise-grade patterns.

### Track 2 — kept FOR V1
- Hero with thesis (locked)
- Screen 3 Jobs we close + Comparison matrix pattern (Superside)
- Screen 4 tab-switcher product-screens concept (Sierra/Decagon/11x pattern)
- Target 8–10 screens, not 16

## Key Files

### Project root
- `src/index.html` — live-site source of truth
- `WEBSITE-CONTENT.md` — current live-site copy
- `WEBSITE-CONTENT-v1-archive.md` — pre-2026-04-20 snapshot
- `PROJECT-CONTEXT.md` — design tokens, portfolio cases
- `context/` — canonical positioning + market-context cache (6 files + CANONICAL-SOURCES.md)
- `context/new-website-v2-notion.md` — pointer to Notion V2 parent page

### Notion (V2 rebuild)
- Parent: `https://www.notion.so/New-website-V2-349402511cda8064acc2f157d1ab11b8`
- Skeleton: `https://www.notion.so/34a402511cda81bcaf55fcc83eadd4d0`
- Audit: `https://www.notion.so/34a402511cda81bd84c6e88f60918a05`
- Drafts archive: `https://www.notion.so/349402511cda8171bd5bff0dc665a390`

## Open Issues
1. **BSO Figma Bridge setup friction** — forked to Second Brain session 2026-04-23 via `/move-to-session`. Full context in `Second Brain/docs/DECISIONS-INBOX/bso-figma-bridge-setup-friction.md` + paste-prompt in `HANDOFF-to-second-brain.md` at project root. Non-blocking — BSO Website V2 track продолжается (JetBrains PDF got локально).
2. **Deployment push blocked** — 5+ local commits on `master` need GitHub PAT
2. **BRIEF §4 thesis needs tightening** — "everything called GTM strategy is tactics" doesn't survive Maja-check; proposed shift to "frameworks exist, systems to run them don't" gap-framing. Change-request belongs in parallel Content Marketing session, not here.
3. **Screen 2–10 skeleton copy** — only Screen 1 Hero is locked. Screens 2–10 have roles/structures drafted but no copy.
4. **Notion italic normalization gotcha** — `_italic_` at create becomes `*italic*` on storage; future `update_content` anchors must use fetched representation, not create-time source.
5. **Hero backdrop, manifesto backdrop, team photos, stale iki.ai HTML comment** — legacy open items from Track 1 (maintenance)

## Next Steps

### Immediate (Track 2, next session)
1. Screen 2 — "What real GTM strategy is" (positive half of hero thesis unfolds here). Source: BRIEF §4 + Pillar 1 methodology list (Structural JTBD, CEP, SHIFT+, Cascade Navigation).
2. Screen 3 — already has Jobs framing principle + 5 draft jobs + Screen 3 renamed. Needs: lock 3–5 final jobs + competition-vs-what per job.
3. Screen 4 — Approach, tab-switcher product-screens concept. Visually-unclear per Yegor's audit comment — defer until visual is decided.

### Parallel (outside this project)
- Content Marketing session: handoff proposal to tighten BRIEF §4 thesis from "everything called X is Y" to "gap between frameworks and systems" framing.

### Track 1 (when PAT available)
- Push queued commits to deploy live-site changes

## How to Resume This Project
1. Read this STATE.md + `WEBSITE-CONTENT.md` + `context/CANONICAL-SOURCES.md`
2. For V2 rebuild work — start at the Notion skeleton page (`34a402511cda81bcaf55fcc83eadd4d0`). Hero is locked; work on Screen 2.
3. Rule from 2026-04-22 learnings: before any copy draft, quote the relevant BRIEF §4 passage verbatim. Don't generate from abstract principles under pushback — re-read canonical each pivot.
4. Notion `update_content` — always use fetched representation for `old_str` (asterisk italic, not underscore).
5. For Track 1 push — get GitHub PAT, run `git push https://<PAT>@github.com/BackspaceOddity/website.git master:main`.
