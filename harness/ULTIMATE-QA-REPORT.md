# Ultimate QA Report — Kern (Landing Builder)

**Branch:** `yegor/bso-658-builder` · worktree `Internal projects/_bso-website-bso658`
**Date:** 2026-06-23 · **Method:** BSO cross-check (harness + scanners + DB advisors + dimension finders → adversarial verify → reconcile)
**Scope:** READ-ONLY audit of the whole Kern product — builder, published pages, builder APIs, exercise/workshop blocks + persistence, Supabase schema/RLS, the `/w` architectural boundary.

---

## 1. Executive summary

Kern is **functionally sound** — the full create → edit → save → publish → published-page → exercise-submit → DB → restore loop passes a 19-assertion live E2E harness with zero failures, every assertion grounded in real HTTP + Supabase reads. No XSS is exploitable as shipped (the one stored-XSS candidate was independently refuted by live browser test), no secrets are committed, auth gates on the builder write paths hold, and the live `/w` proposal-workspace system was not touched.

The blocking issue is **one P0 database-security gap**: `public.builder_templates` has **Row Level Security disabled** in a PostgREST-exposed schema, so the anon key (which ships in client JS) can read and write every row via the REST API. The table is empty today, so nothing has leaked, but it is an open public-write surface and a template-poisoning vector. This is a one-migration fix and the server is unaffected (it uses the service-role key, which bypasses RLS).

Beyond the P0 there are **two P1s** — a real auto-save data-loss path (clicking "← All pages" within 1.4 s of an edit cancels the pending save instead of flushing it) and **migration drift** (the `builder_pages` table-create + RLS-enable and the `builder_templates` RLS-enable are not in any versioned migration; live schema diverges from `supabase/migrations/`). Dependency CVEs (Next 16.2.4 → 7 HIGH advisories, fix in 16.2.9) sit at the P1/P2 boundary. The remaining findings are P2 hygiene: TOCTOU race windows on publish, a bounded (~10 MB/request) exercise-payload abuse vector, a silent voice-note restore failure, a missing deploy-screen staleness indicator, and a 500-instead-of-409 on concurrent slug collision.

**Backup/durability (D4) could not be verified** from the available read-only tooling — PITR/retention tier is unknown and there is no documented restore runbook. This is flagged as an open gap, not a pass.

**Verdict: GO-WITH-FIXES.** The P0 RLS gap must land before any real client data lives in these tables, and the P1 data-loss flush is a same-day fix. None is architecturally deep; all are localized, low-effort patches.

---

## 2. Verdict

| | |
|---|---|
| **Verdict** | **GO-WITH-FIXES** |
| **P0 (block)** | 1 — `builder_templates` RLS disabled (public read/write) |
| **P1 (fix soon)** | 2 — auto-save data-loss on `backToDash()`; migration drift (unversioned table-create + RLS-enable). Dependency CVEs (Next 16.2.4) tracked here too. |
| **P2 (hygiene)** | 6 — publish TOCTOU; bounded payload abuse + no rate-limit; audio voice-note not restored; deploy-screen staleness indicator missing; slug-collision 500≠409; `notify_notion_sync` SECURITY DEFINER anon-executable. |
| **Gate** | NO-GO trigger (P0 or data-loss) is present → would be NO-GO **if data already lived in the tables**. Tables are empty today and the fixes are trivial, so GO-WITH-FIXES with the P0 + P1-data-loss as must-fix-before-data. |

---

## 3. P0 — Blocking (1)

| # | Title | Location | Evidence (observed) | Proposed fix | Effort |
|---|---|---|---|---|---|
| P0-1 | **`builder_templates` RLS disabled — anon read+write via PostgREST** | `supabase/migrations/005_builder_templates.sql`; table `public.builder_templates` | **Live `get_advisors(security)` returns level=ERROR `rls_disabled_in_public`** for `public.builder_templates`. **Direct DB query confirms** `relrowsecurity=false`, `policy_count=0`. The table is in the public schema → exposed at `/rest/v1/builder_templates` to the `anon` role, whose key ships in the client bundle. Migration 005 creates the table with **no** `ENABLE ROW LEVEL SECURITY` and no policies. Empty (0 rows) today, so nothing exfiltrated yet — but anon can write rows that editors later re-insert onto pages (stored-content / template-poisoning). | `ALTER TABLE public.builder_templates ENABLE ROW LEVEL SECURITY;` + add deny-all `no_public_read` / `no_public_write` policies for `anon` (mirror migration 007). Version it as `008_builder_templates_rls.sql`. Server uses service-role → app behaviour unchanged. | **S** |

---

## 4. P1 — Fix soon (2 + dependency CVEs)

| # | Title | Location | Evidence (observed) | Proposed fix | Effort |
|---|---|---|---|---|---|
| P1-1 | **Auto-save data loss: `backToDash()` cancels the debounced save instead of flushing it** | `app/builder/BuilderApp.tsx:483` (`backToDash`), `:486` (`markDirty`), `:490` (`savePage` early-exit) | **grep-confirmed at exact lines.** L483: `backToDash(){ if(this._saveT){ clearTimeout(this._saveT); this._saveT=null; } … setState({…, realPage:null …}) }`. L486: `markDirty()` schedules `savePage()` at 1400 ms. L490: `savePage()` reads `id=this.state.realPage` and `if(!id) return` — so even if it fired after `backToDash`, it no-ops because `realPage` is now null. **Zero** `beforeunload` / `pagehide` / `visibilitychange` handlers anywhere in the file (grep returned 0). Repro: edit text → click "← All pages" within 1.4 s → timer cancelled → save never fires → reload shows the previous state. | In `backToDash()`, replace the `clearTimeout(this._saveT); this._saveT=null;` with a synchronous flush: `if (this.state.saveState === 'dirty') this.savePage();` **before** clearing `realPage`. Add a `window.addEventListener('beforeunload', …)` flush as a tab-close safety net. The in-app flush is the architectural fix; beforeunload is the second net. | **S** |
| P1-2 | **Migration drift: `builder_pages` table-create + RLS-enable and `builder_templates` RLS-enable are unversioned** | `supabase/migrations/004,005,006`; live schema | **grep of `supabase/migrations/`:** `ENABLE ROW LEVEL SECURITY` appears only in 001/002/007 (workspaces, exercise_responses, builder_exercise_responses). `builder_pages` is referenced only in 004/006 as **ALTER** (add publish/ds columns) — no `CREATE TABLE` and no RLS-enable exists in any file, yet **live `builder_pages` has `relrowsecurity=true`** (DB query). So the table create + RLS-enable were applied out-of-band. AC3.4 (live schema matches migration files) **fails**. | Capture the current `builder_pages` definition + RLS-enable into a versioned migration; same for `builder_templates` (folds into P0-1's `008`). Reconcile `list_migrations` vs files so a fresh DB rebuild reproduces the live schema. | **M** |
| P1-3 | **Dependency CVEs — Next 16.2.4 carries 7 HIGH advisories** | `package.json` / lockfile; `node_modules/next` = **16.2.4** (confirmed) | **osv-scanner:** Next 16.2.4 → 7 HIGH incl. SSRF (GHSA-c4j6-fc7j-m34r, 8.6), route-param bypass (GHSA-492v-c6pp-mqqv, 8.1), middleware bypass + DoS (7.5); 17 advisories across 398 pkgs. **npm audit:** high → fix `next 16.2.9` (non-major); moderate postcss/brace-expansion/js-yaml. | `npm i next@16.2.9` (non-major, low-risk) + `npm audit fix` for the moderate transitive set. Re-run build + the E2E harness after bump. | **S** |

---

## 5. P2 — Hygiene (6)

| # | Title | Location | Evidence (observed) | Proposed fix | Effort |
|---|---|---|---|---|---|
| P2-1 | **Publish TOCTOU — rapid save→publish can drop the last edit** | `app/api/builder/pages/[id]/route.ts:49` (PUT upsert); `…/publish/route.ts:57–78` | **File read confirmed.** PUT: `upsert(row,{onConflict:'id'})` — no `WHERE updated_at` guard. Publish: SELECT into `page` (L57) then UPDATE copying `page.blocks` (L69) — two round-trips, no `SELECT FOR UPDATE`, no serializable tx. **DB:** zero triggers on `builder_pages`; no `version`/`etag` column. Concurrent Save+Publish → Publish's SELECT captures pre-save state → snapshot silently omits the last edit. | Wrap publish SELECT+UPDATE in a Postgres `rpc('publish_page')` with `SELECT FOR UPDATE`, or accept the narrow window and document it for this single-editor tool. | **M** |
| P2-2 | **Exercise POST: no size limit + no rate-limit → bounded storage-abuse** | `app/api/builder/exercise/route.ts:50–66`; `migration 007` | **File read:** only `typeof body.payload !== 'object'` check (L50-52), no size guard; insert is verbatim `body.payload` (L66). Migration 007 `payload JSONB NOT NULL` — no CHECK. **Verifier correction:** Next 16 nodejs runtime caps each body at ~10 MiB (empirically: 10,485,760 B → 404 slug-guard; +10 B → 400 "bad json"), so **not "unbounded"** — but any visitor to a published page can POST up to ~9.99 MB arbitrary JSONB per request with **no rate-limit** (`vercel.json` is `{"framework":"nextjs"}` only; 5 rapid POSTs all 404, never 429). Audio data-URLs from `exerciseRender.ts:194 readAsDataURL` inflate this. | Add a server `JSON.stringify(body.payload).length` ceiling (e.g. 512 KB) → 413; add a DB CHECK `pg_column_size(payload) < 524288`; strip `audio` server-side and store blobs in Supabase Storage with a URL reference; add basic per-slug rate-limiting. | **M** |
| P2-3 | **Voice-note audio stored in DB but never restored to the matrix on return** | `lib/builder-responses.ts:31,43`; `app/builder/blocks/exerciseRender.ts:140–160,178,194,201` | **File read confirmed.** `MatrixPlacement` type (L29) has no `audio`; `bSavedMatrixPlacements` `.map` (L43) emits `{id,importance,satisfaction,label}` only (comment: "no audio data URLs"). Client `persist()` localStorage path (L140) also drops `audio`. `restore()` (L142-160) copies importance/satisfaction only; the indicator check at L178 reads `P[active].audio` which is never populated. Audio **is** written to the DB (POST L66 inserts `payload` verbatim; save-click L201 includes `audio`) — loss is entirely on read-back. Feature is 100% non-functional across sessions. | Either (a) carry `audio` through the type + `bSavedMatrixPlacements` map + `__seed__` + `restore()`, OR (b) drop `audio`/`hasAudio` from the save payload entirely and document voice notes as ephemeral — (b) also removes the P2-2 bloat vector. | **S** |
| P2-4 | **Deploy screen shows no "draft changed since last publish" indicator** | `app/builder/BuilderApp.tsx` `renderDeploy()` | **grep confirmed:** `renderDeploy` contains **zero** references to `published_blocks`/`published_styles`/`updated_at > published_at`/"republish"/"stale" — no draft-vs-published comparison, no staleness notice. Publish route itself is correct (re-reads fresh at publish time). **Note:** finder's + verifier's specific DB row figures were point-in-time and have since changed (at reconcile time only 2 unpublished `slug=null` rows exist) — the **durable** evidence is the code gap, not any row snapshot. A user returning to deploy has no signal the live page is stale. | In `renderDeploy()`, compare `updated_at > published_at` (from GET `/api/builder/pages/[id]`) and render a "Draft has unsaved changes since last publish — republish to update the live page" notice above Publish. UI hygiene, not data integrity. | **S** |
| P2-5 | **Slug collision under concurrent publish → 500 (leaks index name) instead of 409** | `app/api/builder/pages/[id]/publish/route.ts:63–66,79` | **File read + DB confirmed.** App-level clash check (L63-66) returns 409, but the subsequent bare UPDATE (L69-79) returns `{error: upErr.message}` status **500** if the partial unique index `builder_pages_slug_published_uniq (slug) WHERE published AND slug IS NOT NULL` rejects a concurrent second publisher — leaking the Postgres constraint/index name. | After UPDATE, if `upErr.code === '23505'` return `{error:'slug taken'}` 409 — unify with the app-level path and stop leaking internal index detail. | **S** |
| P2-6 | **`notify_notion_sync` is SECURITY DEFINER, anon+authenticated executable, mutable search_path** | function `public.notify_notion_sync()` | **Live `get_advisors(security)`:** WARN `anon_security_definer_function_executable` + `authenticated_…` — callable via `/rest/v1/rpc/notify_notion_sync` by anon and signed-in roles; WARN `function_search_path_mutable`. Pre-existing (not introduced by the builder), but in the same exposed schema. | Set `search_path` explicitly on the function; `REVOKE EXECUTE … FROM anon, authenticated` or switch to `SECURITY INVOKER` if RPC exposure is unintended. Confirm intent with the `/w` owners (function predates the builder). | **S** |

---

## 6. Eval scorecard (AC → PASS / FAIL / NA + evidence)

### D1 — Data integrity & persistence
| AC | Result | Evidence |
|---|---|---|
| AC1.1 right table+columns+shape | **PASS** | Harness #1/#1b/#3/#3b/#3c: `builder_pages` draft+`published_*`, `builder_exercise_responses` `page_slug/exercise/payload` all written + read back verbatim. |
| AC1.2 auto-save never loses last edit | **FAIL (P1-1)** | `backToDash()` cancels pending save; no flush, no beforeunload. Confirmed at BuilderApp.tsx:483/486/490. |
| AC1.3 publish is a clean snapshot | **PASS** | publish route re-reads fresh from DB at publish time (route.ts:57-78); editing draft after publish does not mutate `published_*`. |
| AC1.4 responses append-only; newest restored; matrix/lock/notes restore | **PARTIAL** | Append-only + lock + newest-row restore PASS (harness #3b/#7c/#8/#8b). **Matrix audio note does NOT restore** (P2-3). |
| AC1.5 no lost-update under race | **FAIL (P2-1)** | Publish SELECT+UPDATE TOCTOU; no FOR UPDATE / version guard. Narrow window. |

### D2 — Security, vulnerabilities & abuse
| AC | Result | Evidence |
|---|---|---|
| AC2.1 RLS correct on every public table | **FAIL (P0-1)** | `builder_templates` RLS off (advisor ERROR + DB `relrowsecurity=false`). `builder_pages` RLS-on/0-policy = service-role-only (OK, but unversioned → P1-2). |
| AC2.2 public endpoints validate + reject abuse | **PARTIAL** | Slug/type/published-only guards PASS (harness #4/#5/#5b). **No size ceiling + no rate-limit** (P2-2; bounded at ~10 MB by framework). |
| AC2.3 auth gates hold; dev-login prod-gated | **PASS** | pages routes 401 when no email (route.ts:22/38/57); dev-login double-gated `NODE_ENV!=='production' && BUILDER_DEV_LOGIN` (route.ts:14). |
| AC2.4 no XSS | **PASS** | Stored-XSS matrix-label candidate **refuted by live browser test** (JSON.stringify escapes quotes → truncated widget script throws SyntaxError, aborts re-exec before payload node; `window.__XSS_D2__` undefined). `pw/blocks.ts` unescaped path is dev-only/hardcoded-input (refuted). |
| AC2.5 no secrets in code/history | **PASS** | gitleaks: 383 commits, 0 leaks. Live service-role key only in gitignored `.env.local` (untracked, never committed). |
| AC2.6 no injectable SQL; SECURITY DEFINER assessed | **PARTIAL** | Supabase client params parameterized (no raw interpolation) → PASS. `notify_notion_sync` SECURITY DEFINER anon-executable flagged (P2-6). |
| AC2.7 dependency CVEs | **FAIL (P1-3)** | Next 16.2.4 → 7 HIGH (osv) + npm-audit high; fix 16.2.9. |

### D3 — Backend robustness & error handling
| AC | Result | Evidence |
|---|---|---|
| AC3.1 bad JSON / missing fields / DB error → correct status, no leak | **PARTIAL** | bad json→400, missing payload→400, missing slug→400 (harness #5/#5b + route.ts:41-52). **Leak exception:** slug-collision 500 leaks index name (P2-5). |
| AC3.2 error ≠ rollback (partial-success detected) | **PASS (by design)** | Single-statement inserts/updates; no multi-leg MCP pattern in the builder write paths. |
| AC3.3 409 / 404 / 401 consistent | **PARTIAL** | 404 unpublished (harness #4), 401 unauth (route.ts), 409 app-level slug clash — but concurrent collision falls to 500 (P2-5). |
| AC3.4 migration integrity / no drift | **FAIL (P1-2)** | `builder_pages` create + RLS-enable and `builder_templates` RLS-enable unversioned; live schema ≠ migration files. |

### D4 — Backup & durability
| AC | Result | Evidence |
|---|---|---|
| AC4.1 PITR/backup tier KNOWN + documented | **NA — UNKNOWN (gap)** | Not queryable from available read-only MCP tooling; no backup status surfaced. Flagged, not passed. |
| AC4.2 published pages + responses recoverable from backup | **NA — UNKNOWN (gap)** | Depends on AC4.1; unverified. |
| AC4.3 documented restore path exists | **FAIL (gap)** | No restore runbook found in repo/harness. |
| AC4.4 audio data-URLs won't blow row/restore limits | **PARTIAL** | Per-request capped ~10 MB by framework (P2-2 verifier); JSONB rows can still accrete. Mitigated if P2-3 option (b) chosen. |

### D5 — Functional correctness (the full loop)
| AC | Result | Evidence |
|---|---|---|
| AC5.1 E2E harness passes | **PASS** | `qa-e2e.mjs` 19/19, all grounded in live HTTP + DB, cleaned up (0 stray rows). |
| AC5.2 all 6 `ub:` blocks render + save/restore/lock/read-back | **PARTIAL** | Matrix + discussion-lock server-observable parts PASS (harness #7b/#7c/#8/#8b). Matrix **audio** restore fails (P2-3). Other blocks render; not all exhaustively asserted. |
| AC5.3 both DS published incl. dark theme | **PARTIAL** | urembo DS CSS injected + 200 confirmed (harness #2/#2b). bso→pbt + dark-toggle not asserted this run (no published pbt page at audit time). |

### D6 — Architectural integrity
| AC | Result | Evidence |
|---|---|---|
| AC6.1 `/w` + `lib/proposal-workspace/` untouched; build intact | **PASS** | No source files modified (read-only audit); only `harness/` written. `proxy.ts`/`lib/proposal-workspace/` not in any diff. |
| AC6.2 no main/production contamination; feature-branch only | **PASS** | Branch `yegor/bso-658-builder` confirmed; no commits/pushes from this audit. |
| AC6.3 no dead/duplicate ported code wired | **PARTIAL** | `pw/blocks.ts` superseded hand-translated path exists but is **not wired** into the live `/w` system (refuted XSS finding confirmed it is hardcoded/dev-only). Recommend deletion as cleanup. |

---

## 7. Backup & durability status + restore-runbook gaps

**Status: UNKNOWN — open gap, not a pass.** The available read-only Supabase MCP surface does not expose PITR/backup tier or retention, and the safety rails forbid mutation, so D4 could not be positively verified.

Gaps to close before real client data lives in Kern:
1. **Confirm the Supabase plan tier + PITR/daily-backup retention** for project `cgfifhprwfyurusfbxlb` (dashboard → Database → Backups). Free tier = no PITR, daily only with short retention.
2. **Write a restore runbook:** how Yegor recovers (a) a deleted/clobbered `builder_pages` row (draft + published snapshot), and (b) lost `builder_exercise_responses`. Document the point-in-time restore steps and the blast radius (full-DB restore vs single-table).
3. **Decide audio storage** (P2-3 option b or Supabase Storage) so JSONB rows stay restore-friendly and bounded.

---

## 8. Harness assertion table (`qa-e2e.mjs` — 19/19 PASS, cleaned up)

| # | Assertion | Pass | Detail |
|---|---|---|---|
| 1 | create+publish `builder_pages` row | ✅ | Service-role insert, ds=urembo, published=true. |
| 1b | row published in DB with our blocks | ✅ | published_blocks = 2 (exMatrix + discussionLock). |
| 2 | GET `/published/<slug>` → 200 | ✅ | trailing-slash 308 followed. |
| 2b | published HTML has DS CSS link | ✅ | `<link href=/builder-css/urembo.css>` from ds→DS_CSS map. |
| 3 | POST exercise valid → 200 {ok:true} | ✅ | jtbd-matrix placements. |
| 3b | DB row inserted in responses | ✅ | 0→1, append-only via service-role. |
| 3c | stored payload matches submission | ✅ | placements[0] verbatim. |
| 4 | POST unpublished/nonexistent slug → 404 | ✅ | published=true guard (route.ts:62). |
| 4b | no row written for unpublished slug | ✅ | 0 rows. |
| 5 | POST missing payload → 400 | ✅ | route.ts:50-52. |
| 5b | POST non-object payload → 400 | ✅ | typeof guard. |
| 6 | GET exercise read-back returns saved questions | ✅ | bSavedQuestions (route.ts:22-32). |
| 7 | published HTML re-fetch → 200 | ✅ | after matrix POST. |
| 7b | matrix seed restored into HTML | ✅ | `importance` token present. |
| 7c | specific placement label in seed | ✅ | unique run marker round-tripped. |
| 8 | locked answer delivered into seed | ✅ | answer under lock seed key (client-rendered cards). |
| 8b | discussion-lock persisted in DB | ✅ | payload.answers[0].a == submitted. |
| — | cleanup: all `_qa-e2e` rows removed | ✅ | pages=0 responses=0; SQL re-confirmed. |
| — | loop integrity: every assertion grounded | ✅ | live HTTP + Supabase source-of-truth. |

---

## 9. Dismissed findings (considered + refuted)

| Finding | Why dismissed |
|---|---|
| **Stored XSS via matrix label breaking out of inline `<script>` seed** | **Refuted by live browser test.** The `</script>` breakout parses, but the published widget is `'use client'` and mounted via `el.innerHTML` + a manual re-exec loop — scripts set via innerHTML don't auto-execute. The same `</script>` that breaks out truncates the widget script mid-string-literal; `replaceChild` of the truncated script throws SyntaxError synchronously and aborts the re-exec forEach **before** the injected payload node is recreated. Structural, not luck: `JSON.stringify` escapes the attacker's quotes/backslashes, so emitting a raw `</script>` while leaving the widget script valid JS is impossible. Live result: `window.__XSS_D2__` undefined, title unchanged, 2 SyntaxError page errors. Doubly gated: no currently-published page contains a `ub:exMatrix` block. Real **hygiene debt** (a future switch to true SSR inline-script would make it live) but not exploitable as shipped. All test rows/pages deleted. |
| **Latent XSS in `app/builder/pw/blocks.ts` (unescaped `b.statement`/`b.body`/`c.core`)** | **Refuted — by-design false positive.** Mechanics confirmed (those fields interpolate without `esc()` while siblings escape), but the import graph is fed only by the hardcoded `eightfiguresPage` const via a dev-only `pw-preview` route — no user input reaches it, and it is not wired into `lib/proposal-workspace` / the `/w` system. Recommend deletion as dead code (D6.3), not a security fix. |

---

## 10. Recommended fix order

1. **P0-1 — `builder_templates` RLS** (`008` migration: ENABLE RLS + deny-all anon policies). One migration, server unaffected. **Do this before any client data enters the tables.**
2. **P1-1 — auto-save flush in `backToDash()`** (synchronous flush + `beforeunload` net). Same-day, prevents silent data loss.
3. **P1-2 — migration drift** (version the live `builder_pages` create + RLS-enable; fold `builder_templates` into step 1's `008`). Makes a fresh-DB rebuild reproduce production.
4. **P1-3 — Next 16.2.4 → 16.2.9** (`npm i next@16.2.9` + `npm audit fix`), re-run build + harness.
5. **P2-2 — payload ceiling + rate-limit + audio-to-Storage** (closes the bounded-abuse vector; pairs with step 6).
6. **P2-3 — voice-note restore** (pick option b: drop audio from payload → also kills the bloat). Pairs with step 5.
7. **P2-1 — publish TOCTOU** (rpc + FOR UPDATE, or document-and-accept for single-editor).
8. **P2-5 — slug-collision 23505 → 409** (stop the 500 + index-name leak).
9. **P2-4 — deploy-screen staleness notice** (UI hygiene).
10. **P2-6 — `notify_notion_sync` SECURITY DEFINER** (set search_path + revoke/INVOKER; confirm with `/w` owners — predates the builder).
11. **D4 — backup/PITR audit + restore runbook** (out-of-code; confirm tier, write the runbook before go-live with real data).
12. **D6.3 cleanup — delete the dead `pw/blocks.ts` hand-translated path.**

---

*Reconciler note on evidence honesty:* The DB row-count/staleness figures cited by the original finder and by its adversarial verifier were both point-in-time snapshots that have since changed (at reconcile time `builder_pages` holds 2 unpublished `slug=null` rows; the previously-cited `p8fig`/`pbt` published rows are not present). The **durable** evidence for every finding in this report is code at file:line, live security-advisor output, RLS state, and the 19/19 harness — none of which depends on volatile row contents. Where a finding's only support was a row snapshot, it was re-grounded in code or dropped.
