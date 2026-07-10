# Backspace Oddity Website — Current State

**Last updated:** 2026-07-08
**Status:** 🟢 **Trashformas migrated to /w engine + LIVE on trashformas.backspaceoddity.com (seamless — same URL + reused code). §07 client edit/delete shipped (BSO-792). Branches `yegor/bso-792` + `yegor/bso-793` committed, NOT pushed.**

## Session summary — 2026-07-08 (BSO-792 + BSO-793)

**BSO-792 — §07 client edit/delete** (shipped, verified, commit `46f84e7`, branch `yegor/bso-792-...`):
- Payload `client-questions` `string[]`→`[{id,text}]` with deterministic `legacyId()` back-compat (same hash in server `responses.ts` + client `blocks.ts`).
- Edit/delete = re-POST the full array via the existing exercise endpoint (append-only, latest-row-wins) — no new route, no `deleted_at`.
- §07 `clientInput` cards: pencil/✕ gated by localStorage id set; §08 `discussion` read-only. Added `clientInput` to `_demo` as showcase + test surface.
- Verified e2e on `/w/_demo`: add→edit→delete round-trip to Supabase; legacy `string[]` back-compat; per-item gate; cross-device add-only.

**BSO-793 — Trashformas migration** (LIVE, verified, commits `f507508` + `0ed555e`, branch `yegor/bso-793-...` stacked on 792):
- `clients/trashformas.ts` reproduces the LIVE bespoke page 1:1 (title "Conceptual proposal — Trashformas", §02 cores + "The shift this is really about", §04 accept/escalate `processFlow`, §06, prefixed §07 questions). The live copy is a hand-polished edit of Anna's draft (Notion 660c96f9), NOT verbatim — matching live = seamless. Added §07 `clientInput` (brings BSO-792). Registered in `clients/index.ts`.
- Engine fix: discussion decision-lock form was hardcoded Russian ("Записать решение") leaking to all English clients → English defaults, overridable via `ExerciseUI`; jetbrains keeps Russian via `ui` overrides.
- Supabase `workspaces` row for `trashformas`: reused the LIVE access code (from `.workspace-secrets/trashformas.txt`, never regenerated) + mapped Notion Deal page `39140251-1cda-8046-adcc-da7b705a4edc`.
- Deployed `dpl_6uD1TQJtUMR32VVBrX638rMCgDt7` → aliased **subdomain only** (`trashformas.backspaceoddity.com`). Verified live by content: gate + live code unlocks the new page, English form, no Russian leak, **apex + urembo untouched**.

**Email:** Act-0 cover drafted (reply in "Re: Your AI form", tharaatta@gmail.com) with the subdomain link + access-code placeholder. Yegor sent it from the app.

**Infra:** Linear migrated to a local stdio MCP (BSO-790) — needed the key in `~/.config/linear/.env` + a CC restart; tools surface under a UUID-prefixed server name.

## Open (Yegor's call)
- Push + merge `yegor/bso-792` + `yegor/bso-793` (proposed base `8figures-proposal`; origin/main ~1400 lines behind the live engine). Close BSO-792 + BSO-793.
- `_demo` Supabase workspaces row (ungated) added for testing — keep (demo persists) or remove.
- BSO-793 §07 edit/delete NOT e2e'd on the live client page (to avoid polluting their data); proven on `_demo` (same engine).

---

**Last updated:** 2026-05-27
**Status:** 🟢 **`/ajtbd-naming-brief` standalone page live on backspaceoddity.com. Ivan Zamesin naming methodology brief (EN). Route handler pattern confirmed working.**

## Session summary — 2026-05-27

**What was done:**

1. **`/ajtbd-naming-brief` deployed to production** — translated Ivan Zamesin's naming methodology brief (RU→EN) and deployed as a standalone page on the BSO Website.
   - Route: `app/ajtbd-naming-brief/route.ts` — Next.js route handler returning raw HTML with `Content-Type: text/html`
   - This pattern completely bypasses the global layout/nav — correct for standalone shareable documents
   - Flow: `feature/ajtbd-naming-brief` → [PR #20](https://github.com/BackspaceOddity/website/pull/20) → main → [PR #21](https://github.com/BackspaceOddity/website/pull/21) → production
   - Vercel `dpl_4ESzsUMuQzXp5dshpMiRZYbbUvWi` (`target: production`, `state: READY`) confirmed serving backspaceoddity.com/ajtbd-naming-brief

**Open items:**
- `/ajtbd-naming-brief` dark theme requested by Yegor — pending

**Last updated:** 2026-05-21
**Status:** 🟢 **Mobile card overlap fix live on backspaceoddity.com. GT Eesti Pro fonts + dynamic OG image active. Branch: `main` (staging), deploy via `main → production` PR flow.**

## Session summary — 2026-05-21

**What was done:**

1. **Mobile card layout fix (shipped to production)** — `.card__title` (absolute, bottom-left, z-index 3) was overlapping `.card__overlay` description on mobile because overlay was `opacity: 1` always (no hover on touch) with `align-items: flex-end` — both occupying the bottom zone.
   - Fix: `align-items: flex-start`, gradient flipped `to bottom` (dark at top → description readable pinned to top), padding adjusted to 18px 20px
   - `.card__title` stays at bottom with `.card__shade` (z-index 1, gradient `to top`) ensuring readability
   - Also: `card { height: 280px }` (was 260px), `card__title { font-size: 22px }`, responsive fixes to `.how__head .section-h2`, `.final`, `.final__h2`
   - New breakpoint `@media (max-width: 390px)` added for 390px phones (iPhone 14 form factor)

2. **Deploy pipeline**: commit `db432f9` → PR #18 (`feat/ai-skills-proxy-rewrite → main`) → PR #19 (`main → production`) → Vercel `dpl_ExyhmH33pUGArymuiT9Rco8Z5nGD` READY
   - Confirmed: backspaceoddity.com HTTP 200

**Open items from this session:**
- Main is ahead of origin/main by 1 commit (`d0b6ff3 wrap: 2026-05-21 — auto-batch via /wrap-all`) — push when ready
- DECISIONS-INBOX: add typography section to `nodes/backspace-oddity-brand.md` in Second Brain (GT Eesti Pro for all, PT-Emil retired 2026-05-20)
- BSO-232: Next.js migration finish line decision still open

**Last updated:** 2026-05-20
**Status:** 🟢 **Dynamic OG image live (GT Eesti Pro + hero-bg). Font swap confirmed. Site clean on `main`. Production deploys via `main → production` PR flow.**

## Session summary — 2026-05-20

**What was done:**

1. **Dynamic OG image** — `app/opengraph-image.tsx` created using `next/og` (ImageResponse/Satori). Renders GT Eesti Pro Bold font, hero-bg-og.png background (resized to 1200×630 via `sips` to stay under Satori's 8MB base64 limit), BSO logo mark SVG (72px, white fill), "Backspace Oddity" wordmark (38px), headline at 74px. Facebook Debugger confirmed working. `vercel cache purge "/opengraph-image" --yes` required after first deploy.

2. **OG metadata cleanup** — `app/layout.tsx`: added `type: "website"`, `url: "https://backspaceoddity.com"` to openGraph; removed static `images` array (file convention now handles it).

3. **SouvenirGothic dead files removed** — dead `.otf` files purged from `public/fonts/`. `.gitignore` updated to include `.mcp.json`. Figma Bridge `.mcp.json` created for BSO Website session.

4. **Branch model established** — `main` = staging (preview deploys). `production` = live site (backspaceoddity.com). Workflow: commit to main → merge to production via PR → push production with `--no-verify` (user-approved per session).

5. **CC + Webflow MCP strategic assessment** — answered two questions about the Kleos (Stape client) project:
   - Q1 (developer at relaunch): CC accelerates CMS population and post-build QA, not the build itself
   - Q2 (marketer self-serve): works only if site built CMS-first from the start; Webflow API has no visual Designer access
   - Decision: defer BSO Website → Webflow migration; use Kleos as pilot to prove Figma→Webflow MCP workflow

6. **GT Eesti Pro font swap** — completed across two sessions:
   - Self-hosted 8 TTF files in `public/fonts/` (Display + Text, 4 weights each) and `src/assets/fonts/`
   - Removed SouvenirGothic @font-face + Google Fonts EB Garamond `<link>` from `src/index.html`
   - Removed SouvenirGothic @font-face from `app/globals.css`, added GT Eesti Pro @font-face via `url()`, updated CSS vars `--font-display` / `--font-text`
   - **Root fix this session**: removed `EB_Garamond` from `next/font/google` in `app/layout.tsx` — this was the blocker. The Next.js font pipeline was injecting EB Garamond via className on `<html>` and overriding the self-hosted declarations. Commit `e1c2b03`.

3. **Deploy status**: Latest deploy `dpl_4NCybyi4iTbCJJ9HYoMjgUmqSNR1` READY, `target: production`. Preview URL `backspace-oddity-nz89xw5hd-backspace-oddity.vercel.app` confirmed correct (GT Eesti Pro in CSS, no EB Garamond class). `backspaceoddity.com` still served stale edge cache (`x-vercel-cache: HIT`, `age: 102364` = 28h) at session end — should clear within 15–30 min.

## Next steps

1. **Kleos pilot** — Stape project folder at `../Client projects/Stape/`. Figma Bridge `.mcp.json` already in place. Start with Kleos Webflow CMS structure design — CMS-first architecture required for marketer self-serve goal.
2. **Vercel production branch (cosmetic)** — `production` git branch shows as "Preview" environment in Vercel dashboard (not "Production"). Fix: Vercel project Settings → Git → Production Branch: `main` → `production`. Low priority.
3. **BSO-232** — Next.js migration finish line (architectural decision, Yegor's call).

## How to resume

1. Read this STATE.md
2. `curl -sI https://backspaceoddity.com | grep x-vercel-cache` to verify site state
3. Check `git log --oneline -5` to see current branch state
4. For Kleos work: switch to `../Client projects/Stape/` project folder

**Last updated:** 2026-05-05 (вечер /wrap — og-image v3 heavy + AI-native GTM positioning live)
**Status:** **🟢 V2 + новый OG live. Title meta «AI-native GTM agency», og-image hero-style (heavy serif + top-left soundbar logo). Telegram preview обновлён (description + image оба V2-aligned). main и production выровнены.**

**2026-05-04→05 — финальный пуш позиционирования и превью:**
- og-image v3 пересобран: hero-bg-magenta-green backdrop + heavy SouvenirGothic Bold headline во всю ширину + Logo Mark (6-ellipse soundbar) + wordmark top-left
- Title metadata swap: «A strategic brand growth agency» → «AI-native GTM agency» (title / og:title / twitter:title)
- metadataBase = `new URL("https://backspaceoddity.com")` — og:image теперь резолвится на canonical-домен, не preview
- Generation script `scripts/build-og-image.py` коммичен — repeatable через `python3 scripts/build-og-image.py`
- 5 PR'ов через feature-branch flow: #5 metadataBase, #7 og v3 first-pass, #8 main↔production sync, #9 og v3 heavy + title, #10 sync
- Branch-aware post-observe hook landed в SB утром 2026-05-05 (advisor-relayed BSO-31, status: resolved)

**Открытые follow-ups (не блокеры):**
1. **Option C из global CLAUDE.md** — Vercel Production Branch всё ещё = `main`, не `production`. Сейчас main↔production sync через PR'ы работает; Option C завершит сделать push в production = автодеплой live (без manual promote). См. global CLAUDE.md «Push-to-main = Production Publish».
2. **BSO-326** — install pre-push hook в BSO Website repo per CLAUDE.md doctrine (drift найден advisor'ом 2026-05-01).

---

**Earlier 2026-05-01 (вечер — V2 RELEASED):**
- Yegor отключил Vercel Authentication на project-level (`backspace-oddity` → Project Settings → Deployment Protection → Disabled)
- backspaceoddity.com → HTTP 200, public, V2 контент

---

**Earlier 2026-05-01 (afternoon — V2 deploy debugging):**
- Yegor отключил Vercel Authentication на project-level (`backspace-oddity` → Project Settings → Deployment Protection → Disabled)
- `curl -I https://backspaceoddity.com` → 200 + `x-vercel-cache: HIT`, нет `_vercel_sso_nonce` cookie
- Hero копи V2 в HTML («GTM strategy is not a set of tactics across channels…»)
- Three Layers section, /_next chunks, Next.js production build — всё работает
- www-домен 200, apex 200

**Открытые архитектурные вопросы (не блокеры релиза):**
1. **Option C из global CLAUDE.md всё ещё не landed** — Vercel project Production Branch = `main`, не `production`. Сейчас работает потому что push в production branch + manual `vercel promote` создаёт production target. Чтобы CLAUDE.md doctrine соответствовала инфре, нужно: Vercel Settings → Git → Production Branch: `main` → `production`.
2. После Option C: можно перестать делать `vercel promote --yes` руками — push в production будет автоматически = live.

---

**Earlier 2026-05-01 (afternoon /wrap):**
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

