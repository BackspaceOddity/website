# Ultimate QA — Kern (Landing Builder) — Plan & Spec

**Author:** Claude (Opus 4.8) · **Date:** 2026-06-23 · **Requested by:** Yegor (overnight delegation)
**Method:** BSO cross-check — end-to-end harness + eval + independent agents that verify each other, reconciled.
**Scope:** the WHOLE Kern product + code on branch `yegor/bso-658-builder` (worktree `Internal projects/_bso-website-bso658`): the builder (`/builder`), published pages (`/published/<slug>`), all builder APIs (`/api/builder/*`), the exercise/workshop blocks + persistence, Supabase schema/data integrity/backup, the canonical Edit Mode wiring, and the architectural boundary with the live `/w` system.

**Safety rails (hard):** READ-ONLY audit. Agents may run scanners, hit localhost endpoints, query the DB read-only, and WRITE only into `harness/` (the report + harness scripts). NO source fixes, NO migrations, NO `git push`, NO touching `lib/proposal-workspace/` / `proxy.ts` / the `/w` system, NO main/production. Findings + proposed fixes only — Yegor applies after review.

---

## 0. Tooling — import + reuse

**Import (mechanical scanner layer, run by agents for grounded evidence):**
- **Semgrep** — SAST, JS/TS rulesets (`p/javascript`, `p/typescript`, `p/react`, `p/nextjs`, `p/owasp-top-ten`, `p/secrets`). `pipx install semgrep` or `docker run semgrep`.
- **Gitleaks** — committed-secret scan over the worktree + git history. `brew install gitleaks`.
- **OSV-Scanner** (Google) — dependency CVEs from the lockfile. `brew install osv-scanner`.
- **`npm audit --json`** — built-in dependency advisories (no install).
- Installs are BEST-EFFORT; if a scanner can't install, the agent falls back to manual pattern analysis and LOGS the gap (no silent skip).

**Reuse (already available):**
- Supabase advisors (`get_advisors` security+performance) — already surfaced RLS + SECURITY DEFINER issues (see §Seed findings).
- Existing harnesses: `harness/verify-deploy.mjs`, `harness/verify-builder-1to1.mjs`.

**Considered, not imported:** RepoAudit (ICML-2025) / LLM-SmartAudit — they validate the cross-check approach but our Workflow orchestration + the scanners above cover the same ground without a heavyweight framework dependency.

---

## 1. Audit dimensions + Acceptance Criteria (ACs)

Each AC is PASS only with same-turn observed evidence (scanner output, curl response, DB query, harness assertion) — not assertion-from-reading.

### D1 — Data integrity & persistence
- AC1.1 Every write path lands in the right table+columns with the right shape: `builder_pages` (draft `blocks/styles/ds/real_page`), publish snapshot (`published_*`), `builder_exercise_responses` (`page_slug/exercise/payload`).
- AC1.2 Auto-save (debounced) never loses the last edit; reload restores exactly what was saved (no silent drop — the `commitText/commitTile→markDirty` class of bug).
- AC1.3 Publish is a clean snapshot: editing the draft after publish does NOT mutate the live page until re-publish; re-publish overwrites cleanly.
- AC1.4 Exercise responses are append-only; seed read-back returns the NEWEST row per exercise; matrix/lock/notes restore on a returning visit.
- AC1.5 No partial-write / lost-update under a rapid edit→save→publish sequence (race check).

### D2 — Security, vulnerabilities & abuse
- AC2.1 RLS enabled + correct on every `public` table, or documented service-role-only intent. (`builder_templates` currently FAILS — RLS off.)
- AC2.2 Public endpoints validate input + reject abuse: `POST /api/builder/exercise` rejects oversized payloads (matrix audio data-URLs → storage-bloat/DoS), bad/unknown slug, non-object payload; only accepts responses for a PUBLISHED page.
- AC2.3 Auth gates hold: `/api/builder/pages*` and `publish` reject unauthenticated; the dev-login shortcut is NODE_ENV-gated and cannot leak to prod.
- AC2.4 No XSS: every user/client-supplied string rendered into HTML is escaped (`esc`) or set via `textContent`; the innerHTML+script-exec mount path carries no unescaped user input.
- AC2.5 No secrets in code or git history (gitleaks clean); service-role key server-only; no secret in client bundle.
- AC2.6 No injectable SQL (Supabase client params are safe — confirm no raw string interpolation); `notify_notion_sync` SECURITY DEFINER exposure assessed.
- AC2.7 Dependency CVEs: no high/critical unpatched (osv-scanner + npm audit).

### D3 — Backend robustness & error handling
- AC3.1 Every API route handles bad JSON / missing fields / DB error with a correct status (no 500 leaking internals; no unhandled rejection).
- AC3.2 MCP/API "error ≠ rollback" class: partial-success paths are detected + reported, not assumed clean.
- AC3.3 Slug collision → 409; not-found → 404; unauth → 401 — consistently across endpoints.
- AC3.4 Migration integrity: every migration `001–007` is applied to `cgfifhprwfyurusfbxlb`; the live schema matches what the code reads/writes (no drift); migration files are idempotent.

### D4 — Backup & durability
- AC4.1 Supabase Point-in-Time-Recovery / daily backup status is KNOWN and documented (plan tier + retention).
- AC4.2 Published pages + exercise responses are recoverable from a backup (not only live rows).
- AC4.3 A documented restore path exists (how Yegor recovers a deleted/clobbered page or lost responses).
- AC4.4 Audio data-URLs in `payload` won't blow row/size limits or break a restore (size ceiling assessed).

### D5 — Functional correctness (the full loop)
- AC5.1 E2E harness passes: create page → edit → debounced save → reload (restores) → publish → `/published/<slug>` 200 → DS CSS injected → exercise interactive → save response → DB row → re-fetch restores via seed → lock → read-back poll.
- AC5.2 All 6 `ub:` exercise blocks render + their save/restore/lock/read-back behave (server-observable parts asserted).
- AC5.3 Both DS render correctly published (bso→pbt, urembo→urembo) incl. dark theme toggle.

### D6 — Architectural integrity
- AC6.1 The live `/w` system + `lib/proposal-workspace/` are untouched (read-only imports only); `proxy.ts`/Next 16 edge logic intact (build passes).
- AC6.2 No accidental main/production contamination; feature-branch-only.
- AC6.3 No dead/duplicate code from the port (e.g. the superseded hand-translated exercises) left wired.

---

## 2. Eval — pass/fail scorecard

A machine-checkable scorecard the reconciler fills: each AC → PASS / FAIL / N-A with the evidence pointer. Plus a severity-weighted score:
- **P0 (block):** data loss, auth bypass, RLS-open table with sensitive data, secret leak, public write of arbitrary data, XSS.
- **P1 (fix soon):** DoS/storage-bloat (unbounded payload), missing backup/restore path, error paths leaking internals, migration drift.
- **P2 (hygiene):** dead code, missing input ceilings with low impact, dependency warnings, perf lints.
The eval VERDICT = GO / GO-WITH-FIXES / NO-GO, with the P0/P1 list gating.

---

## 3. Agent roster (roles · model)

- **Mapper** (Explore · sonnet) — enumerate the surface → structured map (routes, public-vs-auth, tables, env vars, write paths, client-input surfaces, `/w` boundary).
- **Scanner** (general-purpose · sonnet) — install + run semgrep/gitleaks/osv-scanner/npm-audit on the worktree + git history → parsed high/critical findings.
- **DB/Infra auditor** (general-purpose · sonnet) — `get_advisors` (security+perf), RLS per table, migration-drift (list_migrations vs files), backup/PITR status, payload-size reality (largest `payload` rows).
- **Dimension finders ×6** (general-purpose · sonnet; D2-security on opus) — one per D1–D6, grounded on the map + scan output → findings[] `{title, severity, file/endpoint, evidence, repro, proposedFix}`.
- **Harness author+runner** (general-purpose · sonnet) — write `harness/qa-e2e.mjs` exercising the full loop against `localhost:3456` + asserting DB rows; RUN it → per-assertion pass/fail.
- **Adversarial verifiers** (general-purpose · sonnet) — per finding, an independent skeptic prompted to REFUTE (real? reproducible? severity right?); default-refuted-if-uncertain; drop refuted.
- **Reconciler** (general-purpose · opus) — merge harness + verified findings + scanner + advisors; dedup; prioritize; fill the eval scorecard; write `harness/ULTIMATE-QA-REPORT.md` (exec summary, P0/P1/P2 with evidence+fix+effort, scorecard, backup status, recommended fix order, GO/NO-GO).

---

## 4. Workflow phases (deterministic)

1. **Map** → mapper (1).
2. **Scan** (barrier) → scanner + DB/infra auditor in parallel (2); results feed every finder.
3. **Find** (pipeline by dimension) → 6 dimension finders; each finding flows straight into…
4. **Verify** → adversarial skeptics per finding (no barrier; verify as each dimension lands).
5. **Harness** (parallel with Find/Verify) → author+run `qa-e2e.mjs`.
6. **Reconcile** (barrier) → reconciler merges everything → report file + returns the exec summary.

Bounded (fixed counts, no loop-until-budget). Concurrency capped by the runtime. Estimated ~20–30 agent calls.

---

## 5. Seed findings (already observed this turn — feed into the audit)

- **P0 candidate:** `public.builder_templates` — RLS DISABLED in a PostgREST-exposed schema → anon read/write. ([lint 0013](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public))
- **Review:** `public.builder_pages` — RLS enabled, 0 policies (locked to service-role; confirm intent). ([lint 0008](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy))
- **P1/P2:** `public.notify_notion_sync` — SECURITY DEFINER executable by `anon`/`authenticated` via RPC + mutable `search_path`. ([lint 0011](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable) · [0028](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable))
- **P2:** Supabase Auth leaked-password protection disabled.
- **Known (from this session):** unbounded matrix-audio data-URL in `builder_exercise_responses.payload` (D4.4/D2.2); document-level pointer listeners not cleaned up (perf, low); published-page Edit Mode is dev-gated (confirm prod-decouple).
