# Changelog

## 2026-04-30 — Autonomous task: 3-layer backport + canonical-sources extension + backlog hygiene

**Context:** User stepped away для 2-часового отсутствия с просьбой работать автономно над backlog. Все 4 scope-варианта одобрены через AskUserQuestion (BSO-61 close, BSO-142 doc, KOS 3-layer backport, Verify Vercel + tov-lint, Backlog hygiene). Permission mode: bypassPermissions.

**What happened:**
- /resume → catch-up: STATE/CHANGELOG/LEARNINGS свежие после late-session /wrap. Graph precedent re-surfaced.
- **BSO-61 closed** — push разблокирован, 74 commit'а pushed в текущей сессии до начала autonomous work. Done.
- **BSO-228 created + closed** — Backport edit-mode 3-layer architecture across consumers. Investigation: KOS main `web/app/api/save-draft/route.ts` имеет Layer 1 (server pending/processed split + merge-on-write); KOS bundle на main НЕ имеет Layer 2 (setThreads({})) — это противоречит заявлению decisions-inbox файла. Layer 3 (outbox + 5s timeout) только на feature/autonomous-agents.
  - Tools/edit-mode template (`templates/save-draft-route.ts`) обновлён до KOS-main shape — commit `9e48f91`.
  - BSO Website worktree route — backported, commit `3490fd0`.
  - bso-canvas-app route — backported, commit `cc2dc87`.
  - KOS main bundle — обновлён setThreads({}) Layer 2 fix, commit `13ad9b1`.
  - KOS decisions-inbox файл скорректирован — commit `6a848a7`.
- **BSO-142 closed** — `context/CANONICAL-SOURCES.md` расширен Notion-canonical классом. File index теперь с колонкой Type, новые entries (`landing-skeleton`, `new-website-v2-notion` etc), Notion-canonical re-sync protocol описан, "How to use" rewritten как 5-point guide. Commit `35d2115`.
- **OG image path fix** — `app/layout.tsx` использует `/images/og-image-v2.jpg` вместо absolute prod URL. Forward-compatible с Next.js миграцией. Скопирован файл в `public/images/`. Commit `9094c88` (worktree).
- **Vercel verify** — WebFetch backspaceoddity.com подтверждает V2 deploy (hero, sub, 6 portfolio cards, Jobs, How we work, AI-native messaging — всё видно).
- **tov-lint pass** на `app/page.tsx` копи — 1 known violation (Screen 4 P1 «We embed. We don't consult from the outside» — anti-consultant per tov.md), но это Notion-locked, не autonomously правлю.
- **Backlog hygiene** — комменты на BSO-58, BSO-59, BSO-60, BSO-189 с per-issue review notes. Не закрываю без Yegor's подтверждения acceptance criteria. BSO-59 ("Screen 3 lock 5 jobs") — likely Done (5 jobs locked в Notion + V2 site). BSO-60 ("Screen 4 tab-switcher") — likely Obsolete (V2 has principles+phases pattern, not tabs). BSO-58 ("Screen 2 positive half") — needs acceptance criterion (may be obsolete OR new section needed).

**Decisions made:**
- Layer 1.5 enhancement (split threads by status='approved' → processed.jsonl) flagged как design-question, не делаю автономно. Текущее поведение: counter clears in memory (Layer 2), reload re-hydrates approved threads from disk (by design — Claude reads them).
- Не закрываю backlog issues без Yegor's подтверждения per global CLAUDE.md «Closure без acceptance criteria — issue не закрывай если готово неочевидно. Спроси подтверждения».
- Tools/edit-mode template — canonical source for future consumers. KOS_DEMO_MODE специфичный код НЕ включён в template (deployment-specific).

**Errors / learnings:**
- **LEARN cross-project:** decisions-inbox файлы могут быть неточными — original entry claim'ил 3 слоя на main, реально только Layer 1. При consuming чужой decision-trace файл — verify against actual deployed code (`git show HEAD:path/to/file`), не доверяй claim'у resolution. Обновлён файл в KOS с per-consumer status table.
- **LEARN local:** при git commit с heredoc'ами и backticks/quotes в commit message — failed дважды. Workaround: `cat > /tmp/msg.txt <<MSGEOF` + `git commit -F /tmp/msg.txt`. Робастно работает.
- **WIN cross-project:** AskUserQuestion с multi-select scope для autonomous work — clean handoff pattern. Список из 4 опций + permission mode вопрос отдельно — пользователь выбрал всё одной операцией, дальше работаю без ping.

**Result:**
- Linear backlog: 3 closed (BSO-61, BSO-142, BSO-228). 4 in Backlog с hygiene comments. BSO-189 in-progress с прогресс-чекпойнтом.
- Master `35d2115` (V2 + canonical-sources doc).
- Worktree `nextjs-migration` `9094c88` (page.tsx wrap + Layer 1 backport + OG fix).
- Tools/edit-mode `9e48f91`, bso-canvas `cc2dc87`, KOS `6a848a7`.
- Все pushed.

---

## 2026-04-29 (late) — Edit-mode wired в copy + shared-library bug fix

**What happened:**
- /resume в новой сессии после параллельного /wrap-commit `793c290` — подхватил day-entry.
- Push разблокирован — все 74 commit'а master → origin/main (Vercel deploys V2).
- `app/page.tsx` в worktree обёрнут `<EditableText id="...">` для всей смысловой копи (~80 нод). Schema: `screen.element[.subkey]` (например `hero.h1`, `card.miro.description`, `job.01.headline`). Скипнуты пунктуация/номера/лого/chip-ссылки.
- Текст-режим verified end-to-end через Claude Preview MCP: scroll → click hero.h1 → typed variant → Add → Approve → toolbar показывает «1 approved · Send to Claude» → click Send → toolbar очищается до `EDIT · Text · Visual`.
- **Root cause баг:** `Tools/edit-mode/src/context.tsx` `saveAll()` очищал только `setVisualEdits([])`, но не `threads`. Counter оставался «1 approved» хотя POST /api/save-draft вернулся 200.
- **Fix:** добавил `setThreads({})` рядом с `setVisualEdits([])`. Rebuild via `npm run build` (tsup). Dist скопирован в три потребителя: `BSO Website/.../nextjs-migration/lib/edit-mode/`, `bso-canvas-app/lib/edit-mode/`, `Knowledge-OS-Product/web/lib/edit-mode/`.
- **KOS surprise:** при копировании в KOS git status остался чистый — там уже была более глубокая архитектура fix'а (3 слоя per `Knowledge-OS-Product/docs/DECISIONS-INBOX/from-sb-2026-04-27-edit-queue-not-clearing-after-send-to-claude.md`, resolved 2026-04-28). Мой фикс — только слой «bundle clears». KOS дополнительно имеет server pending/processed split + bundle hydrates from server + outbox replay + 5s timeout.

**Decisions made:**
- Для page.tsx идём через `<EditableText id="...">` обёртки, не через альтернативу «только visual-mode без text-mode parity».
- Root fix в shared library, не локальная заплатка в worktree (per «Architectural fixes over patches»).
- KOS не трогаем — у него уже работает более полная версия. Тех долг: backport 3-слой архитектуры из KOS в bso-canvas-app + BSO Website worktree, чтобы reload-after-save не возвращал thread'ы из файла.

**Errors / learnings (3 в LEARNINGS):**
- LEARN cross-project: shared-library fix без backport KOS-архитектуры — частичный. Counter падает в memory, но reload вернёт threads из `_edit-threads.json` (нет server pending/processed split).
- LEARN local: `preview_click` MCP не всегда триггерит React click handler; для надёжности использовать `preview_eval` с `dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}))`.
- WIN cross-project: `<EditableText id="...">` wrap-pattern масштабируется на пейдж 80+ нод за один write; ID-схема `screen.element[.subkey]` читаема и стабильна для последующих edit-thread reference'ов.

**Result:**
- BSO Website master: 74 commits на origin/main, V2 деплоится.
- worktree `nextjs-migration`: page.tsx editable end-to-end, shared lib bundle обновлён, edit-mode counter ведёт себя корректно.
- Tools/edit-mode: src + dist готовы к коммиту.
- bso-canvas-app: dist готов к коммиту.
- KOS web: уже имеет полный fix, не трогаем.

---

## 2026-04-29 — V2 homepage implemented + Next.js migration started

**What happened:**
- /resume → catch-up: scaffold audit OK, STATE / CHANGELOG / LEARNINGS read, graph precedent surfaced.
- Pre-existing canonical-sources re-sync (2026-04-28) committed (`7aa9d37`).
- Notion landing skeleton page sync-checked vs canonical context (`bso-positioning-framework-v1` + BRIEF v1) — структурного drift нет; 3 housekeeping ops применены: статус-блок `2026-04-29 (верификация)`, AI-native agency intro в Screen 4, note над архив-блоком про устаревшие inline-discussions.
- V2 homepage написан в `src/index.html` из Claude Design handoff (`DicK6mMEcbYL`, 2026-04-24): структура/CSS/токены из дизайна, копи verbatim из Notion landing skeleton (jobs/principles/phases — заменили invented copy дизайна). Assets: 5 SouvenirGothic .otf + hero-bg-magenta-green.png + project-film.webp + project-stape.webp (placeholder backdrop-02).
- /invite загрузил 4 агентов: tone-of-voice (primary), figma-web-pixel-perfect, typography, knowledge-architect. Surfacing: tov rule #2 anti-consultant tension в Screen 4 P1 («We embed. We don't consult from the outside.») — Notion-locked, флажок не auto-fix.
- Архитектурное решение для edit-mode: вариант A (конвертация в Next.js) выбран против B (vanilla адаптер) и C (Stagewise CDN). Knowledge-architect rule #5d / #3 как обоснование.
- Linear [BSO-189](https://linear.app/backspace-oddity/issue/BSO-189) создан (Medium, project [BSO] Website, labels triage + decision-trace).
- /move-to-session → создан git worktree `.claude/worktrees/nextjs-migration/` от master `2bd13cd`. SPINOFF-CONTEXT.md / GRAPH-PRECEDENT.md / AGENTS-TO-INVITE.md / HANDOFF-prompt.md написаны.
- Next.js bootstrap в worktree: package.json (Next 16.2.4 + React 19.2.4), tsconfig, layout/page.tsx, globals.css, app/api/save-draft, components/EditModeShell, lib/edit-mode (copied verbatim из bso-canvas-app), public/ assets, _edit-threads.json инициализирован пустым. npm install: 344 packages.
- Dev server на http://localhost:3456 верифицирован: все 8 секций рендерятся (page height 9000px), edit toolbar смонтирован.

**Decisions made:**
- Skeleton structurally aligned с canonical → drift не требует обновления (3 housekeeping ops — это polish).
- AI-native agency framing добавляется как italic intro в Screen 4 (не в Hero sub) — короткий, концентрированный, мотивирует три principles.
- Wayfund swap → Stape возвращён per Notion канон. Stape gets backdrop-02 placeholder (нужен реальный screenshot).
- Edit-mode: Next.js A > B > C. Worktree, не sibling-проект. Branch `nextjs-migration`.
- Push не делаем — PAT-блок остаётся (LEARNINGS [RETRO 2026-04-20]).

**Errors / learnings (4 в LEARNINGS):**
- ERROR cross-project: Notion `update_content` silently no-ops на toggle-converted blocks — анкер должен быть outside `<details>` структуры.
- LEARN local: Notion blockquote+italic escape edge case (`> *Note...*` → `> \*Note...`).
- WIN cross-project: Skeleton-vs-canonical alignment audit pattern (4-step: read upstream → fetch live → per-section comparison → action list).
- LEARN local: activity-log + Stop-hook architectural tension (loop на каждом Edit).

**Result:**
- master: V2 homepage live на dev (`npx serve src` → 3456). 73 commit'а unpushed.
- worktree `nextjs-migration`: scaffold готов, edit-mode подключён, 1 commit (`74d189e`) ahead of master.
- Linear BSO-189 backlog с 12-step scope.
- Next session entry: `cd .claude/worktrees/nextjs-migration && claude` → пасть HANDOFF-prompt.md → /resume → /invite.

---

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

### 2026-04-23 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-23-1849-44955-yegorkorobeynikov.md` had 2 user prompts, 6 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-24 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-23-1901-50347-yegorkorobeynikov.md` had 4 user prompts, 13 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-24 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-23-1901-50347-yegorkorobeynikov.md` had 4 user prompts, 13 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-27 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-24-0916-10795-yegorkorobeynikov.md` had 2 user prompts, 14 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-28 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-28-1943-77005-yegorkorobeynikov.md` had 1 user prompts, 0 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-29 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-29-2144-64752-yegorkorobeynikov.md` had 8 user prompts, 41 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-29 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-29-1815-63439-yegorkorobeynikov.md` had 12 user prompts, 121 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-30 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-30-0058-48576-yegorkorobeynikov.md` had 2 user prompts, 19 tool calls, 0 errors. Full raw log has been deleted (retention policy).

### 2026-04-30 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-30-0839-31280-yegorkorobeynikov.md` had 1 user prompts, 0 tool calls, 0 errors. Full raw log has been deleted (retention policy).
