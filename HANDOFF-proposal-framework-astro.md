# Handoff — Proposal Pipeline → reusable framework on Astro

**For:** the session continuing BSO-557 (interactive proposal workspace, branch `yegor/bso-557-interactive-proposal-workspace-v1`).
**Written:** 2026-06-05, by a parallel session, at Yegor's request — to transfer the full context of a discussion about re-architecting the proposal pipeline.
**You will also get:** the repo link (`BackspaceOddity/website`) + the Astro repo (`github.com/withastro/astro`, v6.4.4).

---

## The decision Yegor made

The proposal workspace stops being a one-off. **It becomes the framework we use for ALL commercial proposals.** Three proposals so far were effectively built by hand (`_demo`, `urembo`, `urembo-v2`). For systematic work, Yegor wants the **architecture rewritten with Astro** as the foundation. This handoff is the grounding for that rewrite — not a spec to follow blindly; the architectural decisions below are still yours to make with Yegor.

Carry the intent at full strength: **a framework for every future proposal**, not a patch on the current three.

---

## What exists today (grounded — read these files, do not trust this summary alone)

The pipeline is a **hand-built content-rendering engine** living in `lib/proposal-workspace/`:

| File | Role |
|------|------|
| `types.ts` | The block contract. `ClientPage = { slug, title, blocks[] }`. `Block` is a discriminated union of ~18 types: `docHeader, divider, statement, heardIt, beforeAfter, emphasisFrame, narrative, demo, processFlow, phases, whatStayed, nextSteps, discussion, exerciseMatrix, exerciseRank, exerciseChips, exerciseSolutions, docFooter`. `Rich` = trusted inline HTML (authored by us). |
| `render.ts` | `renderBlock()` — a `switch` dispatching each block type to a function in `blocks.ts`, with an exhaustiveness `never` guard. `renderPage()` assembles the full HTML document (styles + theme + edit panel + blocks). Hand-rolled `escAttr`. |
| `blocks.ts` | ~18 functions, each returns an HTML **string** for one block type. |
| `styles.ts` | Design-system tokens + day/night theme, as a CSS string. |
| `chrome.ts` | `themeHeadScript`, `themeToggle`, `editModeScript` (hand-rolled Edit Mode IIFE — BSO-563), `loginHtml`, cookie/token helpers. |
| `clients/<slug>.ts` | Per-client `ClientPage` data files. `_demo` renders every block = living documentation. `urembo` (BSO-560, clean fallback), `urembo-v2` (experimental redesign + interactive exercises). |
| `clients/index.ts` | slug → `ClientEntry` registry. `getClient(slug)`. |
| `auth.ts` | `getWorkspacePassword(slug)` — Supabase `workspaces` table (`password`, `active`) primary; `WS_PW_{SLUG}` env fallback; empty = ungated. |
| `app/w/[client]/route.ts` | 88-line route handler. `GET` = cookie auth check → `renderPage` or `loginHtml`. `POST` = login form → set per-client cookie (`pw-<slug>`, path `/`). |

Adjacent: `middleware.ts`, `lib/supabase.ts`, `supabase/migrations/001_workspaces.sql` (BSO-577 auth), `app/api/notion-sync/route.ts` (BSO-586 — client submissions → Notion Deal page).

The `exercise*` blocks (matrix / rank / chips / solutions) are the **interactive** ones — they SAVE responses to an endpoint and map onto cascade-hypotheses blocks (underserved JTBD → problems → CEPs → current solutions). Everything else is static editorial content.

---

## Why Astro fits this better than anything else in our stack

We have **reinvented, by hand, exactly what Astro gives natively.** The assessment from this session:

- **`types.ts` block union → Astro Content Collections.** A typed content schema (Zod) is Astro's core feature. Our hand-maintained discriminated union becomes a collection schema.
- **`render.ts` switch + `blocks.ts` HTML strings → disappear.** Each block becomes a `.astro` component. Astro renders + auto-escapes natively — no manual `switch`, no string concatenation, no hand-rolled `escAttr`, no `never` guard.
- **Mostly-static document + a few interactive widgets = islands architecture.** The `exercise*` blocks become React **islands** (`client:visible`); every other block ships **zero JS**. This is precisely Astro's sweet spot — a proposal is a document, not an app.
- **`styles.ts` string → scoped `.astro` styles + one global tokens sheet.**

It's a stronger fit than the marketing site, because the marketing site is partly app-shaped; the proposal is overwhelmingly content-shaped with a thin interactive + auth shell.

---

## Current → Astro mapping (proposed; refine with Yegor)

```
ClientPage.blocks[]      → content collection entry (Zod schema mirrors types.ts)
render.ts / blocks.ts    → one .astro component per block (DocHeader.astro, …) — switch dies
styles.ts                → global tokens.css + scoped component styles
exercise* blocks         → React islands (@astrojs/react, client:visible) — only JS on the page
chrome.ts editModeScript → canonical @backspace-oddity/edit-mode package (buildScript), dev-only
auth.ts + route.ts GET/POST → Astro middleware (src/middleware.ts) + login endpoint; Supabase stays
app/api/notion-sync      → Astro endpoint (src/pages/api/notion-sync.ts)
deploy                   → @astrojs/vercel SSR adapter (auth needs SSR, not static export)
```

---

## Decisions for you + Yegor to settle BEFORE writing code

1. **Where does the framework live?** New standalone repo (it's becoming a product for all proposals) vs new app in this monorepo vs replace `/w` in-place. *Lean: separate repo/app — don't tangle a client-facing proposal product with the marketing site. Yegor's call.*
2. **Content model:** typed **data collection** (Zod schema mirroring `types.ts` — preserves the existing block contract, lowest migration friction) vs **MDX** (more authoring freedom, looser contract). *Lean: data collection — keep the block contract.*
3. **Migration order:** build the framework → port **`_demo` first** (it exercises every block = conformance test) → then `urembo` / `urembo-v2`. Do NOT half-rewrite real proposals before `_demo` renders cleanly on Astro.
4. **Edit Mode:** converge to the canonical `@backspace-oddity/edit-mode` package; delete the hand-rolled `editModeScript` in `chrome.ts`. The repo currently has THREE Edit Modes (legacy `lib/edit-mode` React fork in `EditModeShell`, the `chrome.ts` IIFE, and the canonical package) — collapse to the package. Inbox on `localhost:8002` + a Monitor loop is the receiver; it works in Astro (it's a `<script>` string injected into HTML).
5. **Auth:** keep the Supabase `workspaces` table; port `route.ts` GET/POST to Astro middleware + a login endpoint. Per-client cookie (`pw-<slug>`, path `/`), HTTPS-secure detection — preserve the dev-http carve-out (a `secure` cookie is dropped on local http → login loop).

---

## Do NOT

- Do **not** rewrite the marketing Next.js site. This is scoped to the proposal pipeline only.
- Do **not** rewrite the three existing proposals by hand before the framework + `_demo` conformance render works — that strands them in a half-state.
- Do **not** lose the block semantics — especially the `exercise*` → cascade-hypotheses mapping (underserved JTBD / problems / CEPs / current solutions). That mapping is the IP, not decoration.

---

## Stack facts to carry (verified this session)

- **Astro 6.4.4**, ~60k stars, content-first, framework-agnostic islands. Needs `@astrojs/vercel` (SSR) + `@astrojs/react` (islands).
- **Tokens:** GT Eesti Pro (Display + Text, 8 TTFs in `public/fonts/`), colors `--color-cream #F5F2E9`, `--color-ivory #FDFBF4`, `--color-dark-green #011C00`. These live in **code** (`app/globals.css`) — the Figma DS file (`LSlHR0QK0d5tNiyYt957dS`) has **zero** Figma variables / text styles / paint styles, so tokens cannot be machine-pulled from Figma. Source of truth for tokens is CSS, not Figma export.
- **Edit Mode canonical:** `@backspace-oddity/edit-mode` package → `buildScript({ slug, inboxBase, tweaks })` for HTML/route surfaces, `buildScriptInner` for React. `inbox-server.py` on `:8002` (`/inbox`, `/tov-request`, `/tov-poll`, `/tov-result`, `/health`); writes `_edit-inbox.json` / `_tov-requests.json` / `_tov-results.json`.
- **Branch model (hard rule):** `main` = staging, `production` = live (backspaceoddity.com). Push to `main` is a production-publish concern — do not push autonomously. Release flow: feature → PR to `main` → PR `main → production`.

---

## References

- Linear: **BSO-557** (parent — interactive proposal workspace), BSO-558, BSO-560 (urembo clean fallback), BSO-577 (Supabase auth), BSO-563 (Edit Mode convergence), BSO-586 (Notion sync).
- Design doc referenced in `types.ts`: `AI-Native GTM/Client Proposal Agent/deliverables/interactive-proposal-workspace-v1-design.md`.
- Files to read first: `lib/proposal-workspace/{types,render,blocks,styles,chrome,auth}.ts`, `clients/_demo.ts`, `clients/index.ts`, `app/w/[client]/route.ts`, `middleware.ts`, `lib/supabase.ts`, `supabase/migrations/001_workspaces.sql`.
- Astro: `github.com/withastro/astro`, docs at `docs.astro.build` (Content Collections, islands, `@astrojs/vercel`).
