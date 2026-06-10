# Handoff — Edit Mode (BSO-563) state as of 2026-06-02

**For:** the follow-up session continuing BSO-563 Edit Mode work.
**Source of truth:** current state on `main` at commit `e33e38f` + files below. This doc summarises what's already landed so the next session doesn't redo it.

**Caveat:** verbatim Yegor feedback from the originating sessions has been rolled up per 7-day retention policy and is no longer recoverable. Intent below is reconstructed from commit messages, file diffs, and current code shape. If anything reads wrong against Yegor's mental model — ask, don't guess.

---

## Scope

Edit Mode lives **inside the proposal-workspace dynamic route** at `app/w/[client]/route.ts`, rendered via the shared `lib/proposal-workspace/chrome.ts` panel. This is the **canonical** Edit Mode per the `edit-mode-panel` skill — Visual / Copy / Tweaks all required. Earlier ad-hoc forks (e.g. comment-only picker on `/w/urembo`) were converged into this canonical surface by `73e026d`.

**Inbox endpoint:** `POST localhost:8002/inbox` (env var `INBOX`). Server-side receiver must be running on :8002 for "Send to Claude" / "Save to Claude" buttons to deliver — same convention as other BSO projects with edit-mode.

---

## Files

| File | Lines | Role |
|------|-------|------|
| `lib/proposal-workspace/chrome.ts` | 239 | `editModeScript(slug)` returns the injected JS — picker, Visual/Copy dialog, Tweaks panel, two-stage save, badge, persistence. **Locus of all BSO-563 work.** |
| `lib/proposal-workspace/styles.ts` | 212 | Theme tokens (`--ink`, `--paper`, `--rule`, `--rule-strong`, ring colour, etc.) consumed by chrome.ts via CSS vars. Day/night palette lives here. |
| `app/w/[client]/route.ts` | — | Hosts the page that injects `editModeScript(slug)`. Edit Mode is auto-injected on every workspace page render (per global CLAUDE.md "Edit Mode on every localhost deploy"). |

`chrome.ts` is essentially one large IIFE-style script template with inline styles. It's intentionally not split into modules — the entire panel ships as a single string for the route handler to embed.

---

## What's landed (BSO-563 series, chronological)

| Commit | Title | What it actually added |
|--------|-------|------------------------|
| `73e026d` | converge workspace Edit Mode to canonical — Visual/Copy toggle + Tweaks panel | The full canonical surface: two-mode picker (Visual ≠ layout/style comment, Copy = variant generator), Tweaks panel with CSS-var sliders, side list of pending threads. Replaces the urembo-only "comment + Send" stub. |
| `dc922e0` | Edit Mode UX — hover→Tweaks-row highlight, bold Tweaks headers, copy-variant swap workflow | Hover on a Tweaks row highlights it; section headers bold; Copy mode supports variant preview (`previewIndex`) + chosen variant marker. |
| `89696ae` | two-stage Tweaks save — Save (stage batch) then Save to Claude (send batch) | Splits Tweaks save into local "Save" (writes batch to `localStorage[TW_STAGED]`) and "Save to Claude" (POSTs the batch to inbox). Prevents premature send while iterating sliders. |
| `9bf179c` | Tweaks weight & style controls — real Regular/Medium/Bold + italic per token | Adds Weight & Style row group below Font sizes / Line heights — dropdown per token (Regular / Medium / Bold × Roman / Italic). Calls `twApplyWeight` / `twApplyStyle` to live-update CSS vars. |
| `ff445c8` | Tweaks weight = simple dropdown + stop picker hijacking Tweaks controls | Replaces custom weight UI with a plain `<select>`. Adds `stopPropagation` on all Tweaks-panel controls so the underlying element-picker doesn't capture clicks meant for sliders/selects. |
| `e33e38f` | Edit Mode ring colour per theme (#3D6A4E day / #E8F0EA night) | Theme-aware hover/focus ring colour in `styles.ts`. Day token `#3D6A4E` (BSO dark-green-light), night token `#E8F0EA`. |

Adjacent (not BSO-563 but landed in same window):
- `771c3aa` — `feat(BSO-577)` subdomain routing + Supabase workspace auth. Adds `app/w/[client]/route.ts` rewrite via `proxy.ts`, `middleware.ts`, `lib/proposal-workspace/auth.ts`, `lib/supabase.ts`, migration `supabase/migrations/001_workspaces.sql`. **Independent concern**, but touches the host route that injects Edit Mode — be aware when debugging routing.

---

## Current surface area in `chrome.ts`

Functions / sections to know, by approximate line:

- `25` `token(accessKey, slug)` — workspace token helper
- `29` `getCookie(req, name)` — cookie reader
- `39` `loginHtml({ clientName, subtitle, actionPath, err })` — login page (separate concern from Edit Mode but lives here)
- `96` `themeToggle` — day/night toggle button (Edit Mode reads `--ink` / `--paper` from current theme)
- `108` **`editModeScript(slug)` — entire Edit Mode JS** (the main artifact, ~130 lines of inline JS)
  - Picker / hover ring (uses `--ring` token from styles.ts)
  - Mode toggle Visual / Copy (`em-mode-v` / `em-mode-c`)
  - `renderVisualBody(body)` — textarea + Save / Cancel
  - `ensureCopyThread()` / `renderCopyBody(body)` — copy-variant flow, supports source + V1, V2, … with preview & chosen index
  - `em-send` handler — POSTs threads payload to `INBOX`, clears local on success
  - Tweaks panel — built by `twRow(o, isLh)` + `wsRow(o)` for weight/style
    - `SIZES`, `LHS`, `WSTYLE` arrays — token definitions (font-size, line-height, weight+style)
    - `twApplyPx(key, value)` / `twApplyLh(key, value)` / `twApplyWeight(...)` / `twApplyStyle(...)` — live `style.setProperty(...)` calls
    - `tw-stage` (Save batch to localStorage) → `tw-save` (Send batch to inbox)
    - `WOPTS` — weight×style cartesian options for the dropdown
- `237` `esc(s)` — HTML escape util

State keys (localStorage):
- `editThreadsRaw_${slug}` — pending Visual/Copy edits
- `TW_STAGED` — staged Tweaks batch (before "Save to Claude")
- `TW_SAVED` — last saved Tweaks (server hasn't necessarily ack'd)

---

## Open / likely-still-needed (best inference)

I do **not** have ground truth on what's still open — Yegor's most recent feedback was lost to retention. Based on the canonical Edit Mode definition in global CLAUDE.md ("all 6 functions must be present") and the surface in chrome.ts, candidates for follow-up:

1. **Inbox server :8002** — chrome.ts assumes it's running. If Yegor's pain was "Save doesn't do anything", root cause is likely the server not being armed + no Monitor loop in CC session. Verify before adding UI logic.
2. **Tweaks weight dropdown** (`ff445c8`) replaced a richer UI with a `<select>`. If feedback was "I want clickable buttons back", that's the trigger.
3. **Ring colour** (`e33e38f`) — newest commit, possible Yegor still wants tuning per theme.
4. **Copy-variant workflow** (`dc922e0`) — preview/chosen index — non-trivial UX. Might have rough edges (e.g. delete behaviour around `chosenIndex`).
5. **Persistence/idempotency** — `_edit-threads.json` semantics across the global hook `surface-visual-edits.py` — chrome.ts writes to localStorage AND posts to inbox; downstream consumption pattern might still need work.

If the follow-up session is sure about a specific Yegor pain — go fix it. If not — ask Yegor one line ("which part felt wrong?") before touching code.

---

## How to verify before assuming anything

```bash
# 1. Check inbox server is alive
curl -s localhost:8002/health || echo "INBOX OFFLINE"

# 2. Run dev server, open a workspace route, inspect injected script
cd "Internal projects/BSO Website"
npm run dev
# then open localhost:3000/w/_demo (or whichever slug)
# Toggle Edit Mode (button rendered in chrome) — verify Visual/Copy/Tweaks all present

# 3. Click an element → verify dialog opens with Visual/Copy toggle at top
# 4. In Tweaks panel, drag any slider → live preview should update CSS var on page
# 5. Click "Save" → "Save to Claude" → button should flip to "✓ Sent batch!" if inbox is up
```

If any of those 5 checks fail — that's the bug surface. Don't add features until baseline works.

---

## What this session (the one writing this handoff) DID NOT do

This session worked exclusively in the Figma DS file (`LSlHR0QK0d5tNiyYt957dS`) on font swaps to GT Eesti Pro and brand-frame composition variants. **No code in `lib/proposal-workspace/` was touched.** The Edit Mode handoff above is reconstructed from git history + current file state, not from in-session work.
