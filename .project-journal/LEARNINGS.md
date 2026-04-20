# Learnings

## What Works

- **CSS subgrid for multi-column card alignment** — when card titles have variable heights, `display: grid; grid-template-rows: subgrid; grid-row: span 2` on child cards syncs row alignment across all columns. Set `row-gap` on the parent grid, not the child.
- **`--side-padding: 0px` override** — the `.page` wrapper had `padding: 0 var(--side-padding)` which added to section padding. Zeroing `--side-padding` in `:root` override gives clean control via `--px` only.
- **`mix-blend-mode: normal` on `.hero__title`** — fixes title turning blue when over yellow-green backdrop.
- **`object-fit: contain` + dark background for screenshot cards** — `object-position: top` alone doesn't fix wide screenshots in portrait cards. The `card--top` class with `background: #0d0d0d` is the correct pattern.
- **Vercel CLI install workaround** — `npm install -g vercel --prefix /sessions/youthful-dreamy-archimedes/.npm-global` works when sudo is blocked.
- **cairosvg + Pillow for SVG → PNG** — reliable for generating icons from SVG assets. `pip install cairosvg Pillow --break-system-packages`.

## What Doesn't Work

- **ChatGPT image gen for 70s sci-fi aesthetic** — defaults to synthwave/CG "neon grid + horizon" regardless of prompt. Keywords like "airbrush", "Chris Foss", "painterly", "not digital" help somewhat but not enough. The model is overfit to retrowave aesthetics.
- **Gradient mask over photos** — tried mix-blend-mode: color (grayscale result looked "dirty") and multiply (also bad). User rejected both. Clean photos preferred.
- **`object-position: top` for landscape screenshots** — only helps vertically; wide screenshots still crop horizontally. Use object-fit: contain instead.
- **Vercel CLI interactive login in VM** — requires browser auth, blocks in sandbox. Must use GitHub → Vercel Git integration instead.

## Errors & Fixes

- **Edit tool "File has not been read yet"** — Fix: always call Read on the file (even just 1-3 lines around the target) before calling Edit. Root cause: Edit tool tracks whether Read was called in the session.
- **`git add` with unlink warnings** — "unable to unlink tmp_obj" warnings during `git add` in mounted filesystem. Non-fatal, staging still works. Root cause: filesystem permissions on mount.

## Strategies & Patterns

- **CSS override pattern** — all changes go in a `<style>` block in `src/index.html`, never touching the original CSS files. This preserves the design system and makes changes reversible.
- **Two-file content sync** — WEBSITE-CONTENT.md tracks all approved copy, PROJECT-CONTEXT.md tracks design tokens and file structure. Update both after every copy or structural change.
- **camelCase → kebab-case naming** — project image files use `project-name.png` convention in `src/assets/images/`.

## User Preferences

- Formatting: no bullet points in copy, no excessive headers
- Copy tone: W+K-style — short, punchy, conceptual, no jargon
- "every hire" rejected from manifesto copy — too HR/culture, not brand-adjacent enough
- "stellar" in heading felt self-congratulatory — avoided
- "but also" felt additive/weak — "too" preferred as softer additive
- Images should feel atmospheric and evocative, not illustrative or metaphorical
- Retrofuturistic 70s sci-fi aesthetic (Tangerine Dream, Chris Foss, analog, painterly) — NOT synthwave/CG
- Two dark sections should differ by color temperature: hero = cool (teal/yellow-green), manifesto = warm (orange/amber)
- Градиентные маски на портфолио: отклонено. Чистые фото предпочтительнее
- Hovер overlay должен быть чёрным, не зелёным

## Retroactive fill 2026-04-20

_Backfilled after fixing the session-end-gate hook that silently skipped this project. Entries reconstructed from session-log + git history._

[RETRO 2026-04-20] [WIN] [CROSS-PROJECT]: CSS Grid subgrid fixes multi-column baseline alignment where flexbox drifts. Metrics grid had mismatched body text rows under flex — switching the parent to grid with subgrid on children locked every row's baseline. Use subgrid any time independent columns need to share a row grid.

[RETRO 2026-04-20] [ERROR] [CROSS-PROJECT]: ChatGPT image generation defaults to synthwave/CG clichés when given "retrofuturistic 70s sci-fi" prompts. Three rounds failed. Next time: anchor the prompt to a specific artist (Chris Foss, Syd Mead, Moebius) and medium ("painterly, analog, matte, grainy") rather than the decade. Generic era tags route the model to the most common training signal.

[RETRO 2026-04-20] [LEARN] [CROSS-PROJECT]: Two dark sections on one page read as one long dark block unless differentiated by color temperature. Hero cool (teal/yellow-green), manifesto warm (orange/amber) — not luminance shift. Temperature pairing is the cheap fix; don't waste time on different darkness levels.

[RETRO 2026-04-20] [LEARN] [LOCAL]: Deployment flow for BackspaceOddity/website requires a GitHub PAT that the CC VM can't obtain interactively. Workaround: `git -c credential.helper= commit && git push https://<PAT>@github.com/BackspaceOddity/website.git main`. The user must supply the PAT each session — don't assume cached credentials.

[RETRO 2026-04-20] [WIN] [CROSS-PROJECT]: Two-file content-sync pattern (WEBSITE-CONTENT.md + PROJECT-CONTEXT.md) survives multi-session copy churn. Content doc tracks approved strings, context doc tracks tokens/structure. Update both after any copy change, in the same edit batch, or they desync within one session.
