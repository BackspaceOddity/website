# BSO Website

Backspace Oddity's own marketing site (backspaceoddity.com). Internal BSO project, not a client engagement.

## Two tracks

1. **Live-site maintenance** — static HTML/CSS at `src/index.html`. What's currently deployed on Vercel. Copy synced to `WEBSITE-CONTENT.md`.
2. **V2 content rebuild (active)** — new site IA + copy authored in Notion under ["New website V2"](https://www.notion.so/New-website-V2-349402511cda8064acc2f157d1ab11b8). Drafts iterate in Notion before anything lands in HTML.

## Current state

See `.project-journal/STATE.md`.

## Key entry points

- `src/index.html` — live-site single source of truth
- `WEBSITE-CONTENT.md` — copy mirror of live site
- `context/` — canonical positioning + market-context cached locally (see `context/CANONICAL-SOURCES.md`)
- Notion V2 skeleton: `https://www.notion.so/34a402511cda81bcaf55fcc83eadd4d0`
- Notion audit: `https://www.notion.so/34a402511cda81bd84c6e88f60918a05`

## Sister projects

See `CLAUDE.md` and `docs/INTEGRATION-STRATEGY.md`.

## How to resume

`/resume` in a CC session mounted at this folder. Reads STATE.md, recent CHANGELOG, LEARNINGS, runs catch-up.
