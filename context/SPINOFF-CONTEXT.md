# Spinoff context — 2026-04-29

**Source session:** `ba45eb3e-7604-4e52-a24a-93d5c75b72a0` in `Internal projects/BSO Website`
**Linear issue:** [BSO-189](https://linear.app/backspace-oddity/issue/BSO-189/migrate-bso-website-to-nextjs-wire-edit-mode-canvaskosstape-pattern)
**Last commit on master before fork:** `2bd13cd V2 homepage: Claude Design handoff + Notion-canonical copy`
**Worktree branch:** `nextjs-migration`

---

## Why this fork

Parent session executed `/resume` on BSO Website, then implemented V2 homepage from Claude Design handoff (URL `https://api.anthropic.com/v1/design/h/DicK6mMEcbYLoXoL7WgbyQ`) into `src/index.html` (static HTML, ~1000 lines, all CSS inline).

Yegor then asked to deploy on localhost + wire edit-mode so visual comments flow into CC sessions automatically — matching the BSO Canvas / Knowledge-OS-Product/web / Stape pattern.

Architectural fork surfaced: `lib/edit-mode/` from those projects is React-only (`'use client'` + JSX) — cannot run on static HTML. Three options weighed:

- **A — Convert BSO Website to Next.js** (chosen). Reuse `lib/edit-mode/` + `/api/save-draft` + `_edit-threads.json` pattern. 4th project on one stack, no second edit-mode mechanism in workspace.
- B — Vanilla-JS adapter for static HTML. Rejected as patch (global CLAUDE.md "Architectural fixes over patches").
- C — Stagewise toolbar via CDN. Comments don't auto-flow to CC chat; semantic mismatch.

Knowledge-architect rule #5d (cross-project knowledge flow as default) and #3 (single source of truth) drove the choice.

---

## What's already done on master (don't redo)

- ✅ V2 design handoff fetched + extracted to `context/claude-design-handoff/` (README + chat1)
- ✅ V2 written to `src/index.html` with Notion-canonical copy (jobs / principles / phases — replacing design's invented copy)
- ✅ Assets: SouvenirGothic .otf × 5 in `src/assets/fonts/`, `hero-bg-magenta-green.png`, `project-film.webp`, `project-stape.webp` (placeholder cloned from backdrop-02)
- ✅ AI-native agency intro line added to Screen 4 (mirrored to Notion landing skeleton)
- ✅ Notion landing-skeleton page sync-checked + 3 Notion ops landed (status block, Screen 4 framing, archive-block stale-comment note)
- ✅ Localhost dev-server runs on port 3456 via `.claude/launch.json` (`npx serve src`) — needs replacing with `next dev` after migration
- ✅ Linear issue BSO-189 created (Medium, labels: triage + decision-trace, project [BSO] Website)

---

## Migration scope (per BSO-189)

1. Bootstrap Next.js scaffold (`app/`, `package.json`, `tsconfig.json`, `next.config.js`)
2. Port V2 layout from `src/index.html` to `app/page.tsx` — keep all CSS in one place, no redesign
3. Move SouvenirGothic .otf to `public/fonts/`, EB Garamond stays Google Fonts
4. Move `src/assets/images/*` to `public/images/`
5. Copy `lib/edit-mode/` from `bso-canvas-app/`
6. Add `app/api/save-draft/route.ts` (same as Canvas/KOS)
7. Wrap root layout in `EditModeShell`
8. Initialise empty `_edit-threads.json` in repo root
9. Update `.claude/launch.json` from `npx serve` to `next dev` on 3456
10. Update `.gitignore` (`.next/`, `node_modules/`)
11. Verify edit-mode picker mounts and writes
12. Test surface-visual-edits.py hook on next CC session start (mid-session caveat — requires CC restart)

---

## Hard constraints (don't break)

- **Copy is canonical from Notion landing skeleton.** Do NOT regenerate jobs/principles from BRIEF — use the locked text from `src/index.html` verbatim. Notion page id: `34a40251-1cda-81bc-af55-fcc83eadd4d0`.
- **tone-of-voice rule #2 anti-consultant tension:** Screen 4 Principle 1 «We embed. We don't consult from the outside.» — locked by Yegor 2026-04-23. Don't auto-rewrite during port; if you spot tension, flag it, don't fix unilaterally.
- **Dev-server port 9229+ already assigned** (.mcp.json convention). Web dev port: 3456.
- **Assets are large.** `hero-bg-magenta-green.png` is 8.7MB, `project-miro.webp` 4.5MB. Don't re-import or re-encode — copy as-is to `public/images/`.
- **Stape image is a backdrop-02 clone** — placeholder, needs real screenshot. Flagged in V2 commit message.
- **No push to origin yet.** 72 commits unpushed on `master`, blocked on GitHub PAT. Migration commits will pile on top; don't push without Yegor's PAT.

---

## Reference implementations to copy from

- `Internal projects/bso-canvas/bso-canvas-app/` — primary reference. Has `lib/edit-mode/`, `EditModeShell`, `app/api/save-draft/route.ts`. Same pattern.
- `Internal projects/Knowledge-OS-Product/web/` — same pattern, web product context.
- `Client projects/Stape/Website/` — declared technical sibling in Linear ([Stape] Website project description).

Each has `_edit-threads.json` in their repo root showing the data format.

---

## Mid-session caveat

`surface-visual-edits.py` hook is global (per-project Phase 1 → workspace Phase 2 per `decision-visual-edits-protocol-v1`). Even after wiring, the hook only fires on session-start. New CC sessions will pick up `_edit-threads.json` automatically; the session that DID the migration won't see surfaced edits until restart. Plan the validation flow accordingly.
