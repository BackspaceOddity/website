# Backspace Oddity Website — Current State

**Last updated:** 2026-04-20
**Status:** In Progress
**Client/Context:** Backspace Oddity — strategic brand growth agency, Amsterdam

## What This Project Is
Rebuilding the Backspace Oddity marketing website (backspaceoddity.com) — static HTML/CSS, no framework. The existing CSS design system is preserved; all changes happen via `<style>` block overrides and HTML edits in `src/index.html`. Goal: ship a polished, content-accurate site that reflects current brand positioning.

## Current Status
- Live site is up at backspaceoddity.com
- Major copy, portfolio, hero, manifesto, and CTA sections all approved and deployed
- **WEBSITE-CONTENT.md rebuilt (2026-04-20)** from `src/index.html` as ground truth; old version preserved as `WEBSITE-CONTENT-v1-archive.md`
- Portfolio currently: Miro + Sidekick (Row 1, 60/40), Global Payroll + Film Production (Row 2, 2-eq), Wayfund + Superabundance (Row 3, 40/60). `iki.ai` card removed
- Film Production Company card now has real content (governance model + content hypothesis framework)
- Team: Yegor + Anna. Artem and Siraj still pending photos
- Contact email in nav + footer: `yegor@backspaceoddity.com`; Cal.com booking link
- 5 local commits on `master` not yet pushed to `origin/main` (blocked on PAT)

## Key Files
- `src/index.html` — single source of truth, all CSS overrides and HTML
- `WEBSITE-CONTENT.md` — current live-site copy (V2, synced 2026-04-20)
- `WEBSITE-CONTENT-v1-archive.md` — historical snapshot (V1, 2026-03-17)
- `src/css/variables.css` — design tokens
- `src/assets/images/` — all images
- `src/.vercel/project.json` — Vercel project ID
- `vercel.json` — image optimization config
- `PROJECT-CONTEXT.md` — design system tokens, portfolio cases, tech stack

## Open Issues
1. **Deployment push blocked** — 5 local commits on `master` need GitHub PAT to push to `BackspaceOddity/website` (branch tracks `origin/main`)
2. **Hero backdrop** — retrofuturistic 70s sci-fi image still unresolved; ChatGPT keeps producing synthwave
3. **Manifesto backdrop** — `backdrop-02.webp` in place but may want refinement (warm/amber retrofuturistic)
4. **Team section** — Artem Sologub and Siraj Hasanov to be added once photos are available (companies already in team copy)
5. **Stale HTML comment** in Row 3 references `iki.ai` but card is removed — cosmetic, low priority

## Next Steps
1. User provides GitHub PAT → `git push origin master:main` (5 commits queued) → Vercel deploys automatically
2. Finalize hero backdrop (user to generate, drop as `src/assets/images/hero_alt.webp` or similar)
3. Add Artem and Siraj to team section once photos arrive
4. Clean stale `iki.ai` comment in `src/index.html` Row 3 (~line 757)

## How to Resume This Project
1. Read this STATE.md + `WEBSITE-CONTENT.md` (current) — `src/index.html` is authoritative source
2. Main working file is `src/index.html` — all CSS overrides are in a `<style>` block at the top
3. Before any Edit, always Read the file first
4. To push: get GitHub PAT from user → `git push https://<PAT>@github.com/BackspaceOddity/website.git master:main`
5. Vercel auto-deploys on push to main
