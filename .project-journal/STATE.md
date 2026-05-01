# Backspace Oddity Website — Current State

**Last updated:** 2026-05-01 (afternoon /wrap — V2 deploy attempted via SB cross-project session, blocked on auth wall)
**Status:** **V2 builds корректно, но не на live — auth wall блокирует public access. Action required from Yegor in Vercel UI.**

**Today (cross-project work via SB session):**
- **PR #2** `release/2026-05-01-v2 → production` — merged 6af4b85 (journal-only release, no code changes)
- **PR #3** `fix/vercel-nextjs-config` — delete `vercel.json` (V1 static-output override). Result: 404 NOT_FOUND. Framework auto-detect не сработал т.к. project framework=null.
- **PR #4** `fix/vercel-framework-nextjs` — добавил vercel.json с `{"framework": "nextjs"}`. Result: Next.js build OK ✅. V2 contents render: Three Layers, /_next/ chunks, EditableText pipeline, correct title.
- **3× `vercel promote --yes`** — Vercel «Production Branch» setting = `main` (не `production`), поэтому push в production branch = preview target. Manual promote создаёт production target build.
- **3× `vercel alias set backspaceoddity.com + www`** — alias re-binding на каждый promoted deployment (default не переходит автоматически).
- **`PATCH /v9/projects/.../ssoProtection: null`** через vercel curl — 200 OK, но auth wall на месте (значит Deployment Protection живёт на team level).

**Critical findings (root-cause architecture drift):**
1. **Option C из global CLAUDE.md never actually landed** — Vercel project «Production Branch» = `main`, не `production`. CLAUDE.md заявляет «Option C completed 2026-04-30, domains bound to production branch» — реальность другая. Это объясняет 30-04 incident («одной командой запушил» = `git push origin master:main` → main = production target → 30s до live). И объясняет сегодняшние час debugging — я работал по PR-в-production пути который не работает в текущей Vercel конфигурации.
2. **Project `framework: null`** — legacy от V1 static. Без явного `vercel.json` framework=nextjs билд не происходит.
3. **Deployment Protection — team-level Vercel Authentication** — project-level PATCH не override'ит. Только Yegor в Vercel UI.

**Action required from Yegor:**
1. Vercel Team Settings → Security → Deployment Protection → Disabled (или Standard для preview only). После этого V2 будет публично доступен на backspaceoddity.com.
2. (Optionally) Vercel project Settings → Git → Production Branch: `main` → `production`. Это реально завершит Option C — push в production branch = автодеплой live, без manual promote/alias.

---

**Last updated (previous):** 2026-05-01 (/wrap end of day 2026-04-30)
**Status (previous):** In Progress — **V2 evolves — Three Layers section live, real-time edit-cycle через visual edit-mode picker, brand-frame → GTM-frame reframes, +20 visual edits applied this session** (BSO-189 mid-flight, BSO-244 + BSO-245 backlog)
**Client/Context:** Backspace Oddity — strategic brand growth agency, Amsterdam

## Quick state — late session 2026-04-30 (+5 часов real-time edit cycle)

- **New Screen 2 «Three layers of GTM strategy»** — landed между Hero и Selected Work. Layer 1 Strategy (jobs / ICP / positioning / narrative / messaging architecture) → Layer 2 Tactics (PR / outreach / advertising / content / partnerships × LinkedIn / email / podcasts / paid / owned, **CEPs as the lens** that pulls into coherent GTM) → Layer 3 Creative execution (AI-native production, channels-keep-up framing, no rebrand-mention per Yegor's pushback).
- **Visual edit-mode pipeline matured** — `surface-visual-edits.py` + symlink master/_edit-threads.json → worktree (Layer A quick-fix per BSO-236) + extended thread status `'open' | 'approved' | 'applied'` (per current edit-mode bug fix — keeps activeText displayed after Send to Claude). ~20 visual edits applied real-time через picker → Claude apply → user views → next.
- **Body-text scale system-wide bump** — --size-body 20→24, --size-body-lg 24→28, plus per-element. Editorial premium (USER-FLAGGED learning).
- **Layer 2 reframe iterations** — Cascade/Channel architecture rejected (unclear) → user clarified: tactics = PR/outreach/advertising × channels, CEPs = the lens. Final structure tactically grounded.
- **Logo mark added в nav** — Logo Mark.svg (44px) перед wordmark, aligned to hero block left edge.
- **YC application context loaded** — `context/yc-application-daily-2026-04-30.md` snapshot. Strategy/execution gap added в Three Layers intro per YC pitch insights.

## Open items (Notion canonical update needed)
- Notion landing skeleton page — нужно отразить Three Layers section (новая секция, не была в skeleton)
- Нужно отразить Layer 2 «PR/outreach/advertising × channels, CEPs as lens» framing
- Layer 1 расширенная formulation (positioning/narrative/messaging architecture в strategy)

## Quick state — earlier 2026-04-30 (autonomous task)

- **BSO-228 closed** — backport KOS-main 3-layer edit-mode архитектуры в Tools/edit-mode templates + bso-canvas-app + BSO Website worktree. KOS main bundle также получил Layer 2 fix (setThreads({})). Decisions-inbox файл в KOS обновлён — был неточным (claim'ил 3 слоя на main, реально только Layer 1).
- **BSO-142 closed** — `context/CANONICAL-SOURCES.md` расширен Notion-canonical классом + новой re-sync секцией. File index теперь имеет колонку Type (Git / Notion / Local). Каждый context/*.md явно объявляет canonical source. Снимает класс ошибок «Notion-snapshot stale, никто не знает откуда он».
- **BSO-61 closed** — push разблокирован (74 commit'а pushed в этой сессии раньше). PAT-блок снят.
- **OG image cleanup** — `app/layout.tsx` метаданные теперь указывают на local `/images/og-image-v2.jpg` вместо absolute URL на static prod. Forward-compatible с Next.js миграцией.
- **Backlog hygiene** — комменты на BSO-58, BSO-59, BSO-60, BSO-189 с per-issue review (likely-done / likely-obsolete / needs-acceptance / progress checkpoint). Без автономного закрытия — Yegor's call.
- **tov-lint pass на page.tsx** — 1 known violation (Screen 4 P1 «We embed. We don't consult from the outside» — anti-consultant per tov.md), но Notion-locked. Остальная копи проходит чисто.
- **Vercel verify** — backspaceoddity.com отдаёт V2 (hero / sub / 6 cards / Jobs / How we work / AI-native messaging — всё на месте).

## Quick state — 2026-04-29 late session

- **PAT-блок снят** — все 74 commit'а с master pushed на `origin/main` (включая `793c290` /wrap день-entry).
- **Edit-mode подключён к копи в worktree** — `app/page.tsx` обёрнут в `<EditableText id="...">` для всех ~80 смысловых текстовых нод (hero / work-cards / 5 jobs / how / team / final / footer).
- **Корневая баг-фикс edit-mode shared library** — `Tools/edit-mode/src/context.tsx`: после успешного `saveAll()` теперь очищается и `threads`.
- **Verified end-to-end в браузере** — text-mode, click on hero.h1, add variant, approve, Send to Claude → counter падает до 0.

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
