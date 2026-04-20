# Backspace Oddity Website — Current State

**Last updated:** 2026-04-08
**Status:** In Progress
**Client/Context:** Backspace Oddity — brand strategy agency, Amsterdam

## What This Project Is
Rebuilding the Backspace Oddity marketing website (backspaceoddity.com) — static HTML/CSS, no framework. The existing CSS design system is preserved; all changes happen via `<style>` block overrides and HTML edits in `src/index.html`. Goal: ship a polished, content-accurate site that reflects current brand positioning.

## Current Status
- All major copy updated and approved
- Portfolio section fully redesigned (3-row grid, titles overlaid on images, hover overlay)
- Project photos in place for all portfolio cards
- Two new portfolio cards added: Global Payroll Platform + Film Production Company (placeholder)
- Key sections rewritten: manifesto ("Not just decision-making. But decision making, too."), business case heading, brand diagram heading
- WEBSITE-CONTENT.md and PROJECT-CONTEXT.md kept up to date
- **Deployment PENDING** — GitHub repo created (BackspaceOddity/website), git initialized locally, but push requires GitHub PAT from user (not yet provided)
- Hero backdrop image: currently existing gradient — user exploring AI-generated retrofuturistic image (yellow-green palette, atmospheric, 70s sci-fi style)

## Key Files
- `src/index.html` — single source of truth, all CSS overrides and HTML
- `src/css/variables.css` — design tokens (colors, type, spacing)
- `src/assets/images/` — all images including project photos
- `src/.vercel/project.json` — Vercel project ID: `prj_5TYE5DAN2OcDbmdaHgenHMPDXQ9s`, team: `team_CpyPYy2LZijsPpqCbWPJDkn0`
- `vercel.json` — image optimization config
- `WEBSITE-CONTENT.md` — full copy reference, kept in sync with HTML
- `PROJECT-CONTEXT.md` — design system tokens, portfolio cases, tech stack

## Open Issues
1. **Deployment blocked** — need GitHub PAT to push to BackspaceOddity/website and trigger Vercel deploy
2. **Hero backdrop** — user wants a retrofuturistic 70s sci-fi image (yellow-green palette); ChatGPT keeps generating synthwave clichés; unresolved
3. **Manifesto backdrop** — user wants to replace orange gradient with AI-generated warm retrofuturistic image; pending
4. **Team section** — Artem Sologub and Siraj Hasanov to be added once photos are available (their companies already included in copy: R/GA, Metalab, Stink Studios, Your Majesty, Meta)
5. **Film Production Company card** — placeholder text and backdrop image; real content pending
6. **every hire** was in manifesto col 2 copy — was changed to "every pricing change" ✓

## Next Steps
1. User provides GitHub PAT → run `git commit` + `git push` → Vercel deploys automatically
2. Finalize hero backdrop image (user to generate in ChatGPT, then drop into `src/assets/images/backdrop-01.webp`)
3. Add Artem and Siraj to team section once photos arrive
4. Update Film Production Company card with real description

## How to Resume This Project
1. Read this STATE.md + WEBSITE-CONTENT.md
2. The main working file is `src/index.html` — all CSS overrides are in a `<style>` block at the top
3. Before any Edit, always Read the file first (tool requires it)
4. Git repo initialized at `/sessions/youthful-dreamy-archimedes/mnt/New website/` with remote `https://github.com/BackspaceOddity/website.git`
5. To deploy: get GitHub PAT from user, run `git -c credential.helper= commit -m "..." && git push https://<PAT>@github.com/BackspaceOddity/website.git main`
6. Vercel project already linked — deployment triggers automatically on push to main
