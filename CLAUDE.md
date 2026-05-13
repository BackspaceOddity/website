# BSO Website — project rules

**Project context:** Backspace Oddity's own website (agency landing + content). Design system locked (see `PROJECT-CONTEXT.md`). Positioning is the live iteration — hero / H1 / structure under active work.

**Scope gate (per tov.md + global CLAUDE.md):** this project publishes BSO-branded copy. Every client-facing sentence must align with the canonical BRIEF and with tov.md hard rules. `tov-lint` skill is MANDATORY before any copy lands in Notion or in a published markdown file.

## MANDATORY session-start protocol

Read in order:
1. `PROJECT-CONTEXT.md` — design system, colors, fonts, layout tokens
2. `.project-journal/STATE.md` — current state of active task
3. `.project-journal/CHANGELOG.md` last 3 entries
4. `.project-journal/LEARNINGS.md` — prior failures, especially `[RETRO]` entries
5. **Canonical sources (see section below)** — re-fetch from Notion, do not rely on local copies
6. `~/.claude/tov.md` — hard rules for all copy

## Canonical sources — Notion > local (HARD RULE)

For this project, **Notion is the canonical source of positioning / brand / brief content**. Local `context/*.md` files are ephemeral staging, stale by default. Before producing any H1 / hero / tagline / section copy / landing structure:

| Topic | Canonical (Notion) | Local staging (stale) | Rule |
|---|---|---|---|
| Content BRIEF v1 (locked 2026-04-21) | [Notion page `34a40251-1cda-819a-88a9-e4bce614f0d2`](https://www.notion.so/34a402511cda819a88a9e4bce614f0d2) (view authority); **Git canonical:** `../Content Marketing/docs/BRIEF.md` (edit here) | `context/positioning/content-marketing-brief-v0.md` (read-only snapshot from Git canonical, re-synced via CANONICAL-SOURCES.md) | **Always fetch Notion first** for client-facing copy — local snapshot may lag. For authoring edits — go to Git canonical, never edit the snapshot. |
| Landing skeleton v1.x | [Notion page `34a40251-1cda-81bc-af55-fcc83eadd4d0`](https://www.notion.so/34a402511cda81bcaf55fcc83eadd4d0) | — | Live doc; user annotates inline. Fetch before generating any content proposals. |
| Reference sites audit | [Notion page `34a40251-1cda-81bd-84c6-e88f60918a05`](https://www.notion.so/34a402511cda81bd84c6e88f60918a05) | — | User comments live here. |
| Tone of voice | `~/.claude/tov.md` | — | Re-read in full before every H1 / hero / tagline — NOT from memory of the rules. |
| Brand tokens | `PROJECT-CONTEXT.md` (colors, fonts, layout) | — | Locked at commit; safe to cache. |

**Local-vs-Notion drift discipline:**
- If `context/` has a file whose name suggests it mirrors a Notion page (e.g. `content-marketing-brief-v0.md`), treat it as a **local snapshot**, not a source. The version tag in the filename is a warning — fetch Notion to see if it's still current.
- If you must use local (offline, Notion MCP failing), say so explicitly in your response: "working from local copy as of <commit-hash>; Notion may have diverged".

## Hard rules for copy on this site

In addition to `~/.claude/tov.md`:

1. **Signature thesis carries.** The BRIEF §4 contrarian thesis ("GTM strategy is tactics; real strategy is about which battles to fight") is the **positional lens of the whole site**, not the opener of month one. Every hero candidate must be checkable against: "does this carry that thesis?". "Generic SaaS-growth pitch" fails this check.

2. **No direct diagnosis of the reader.** "Your product works" / "You have X, you don't have Y" / "Your GTM strategy is a list of sequences" — all violations. Reader-subject framing ≠ reader-diagnosis. Describe the world, let the reader place themselves.

3. **Run tov-lint.** `_system/skills/tov-lint/SKILL.md` is the 12-point checklist. It MUST run before any Write/Edit on `WEBSITE-CONTENT*.md`, `content/**`, or Notion patch with hero/H1/tagline semantics. The `require-tov-lint-on-copy.py` hook enforces this at tool-use time — don't argue with a block, run the skill.

4. **Pushback re-read.** If the user pushes back on copy ("не то", "generic", "не прочитал", "защищаешь"), the `pre-pushback-reread.py` hook will force canonical re-read before next draft. Do NOT respond with a new draft before completing the re-read sequence.

## Cross-project discipline (per global CLAUDE.md)

- Every `LEARNINGS.md` entry tagged `[LOCAL]` or `[CROSS-PROJECT]`.
- Brief insights promote to Second Brain via `/harvest` next SB session, not directly.
- Notion edits by user (feedback comments in brief / skeleton / audit) are harvest input — scan on next resume.

## Sister projects

- **`../../Internal projects/Second Brain`** — graph; positioning-related decision nodes live there.
- **`../Content Marketing`** — holds the canonical BRIEF (`docs/BRIEF.md`); this project's copy must align with it.

## Autonomy (from global CLAUDE.md)

- Local Bash / build / test / curl — all via Bash tool.
- Yegor decides: final copy, hero thesis, brand decisions, structural cuts.
- Claude: structure proposals, pattern matching from references, compliance checks — never the thesis itself.

## Language

Default conversation language: **Russian**. User-facing responses по-русски. English только для: inline-кода, CLI, технических identifier'ов, и сгенерированной английской копии (она и должна быть на английском — она для сайта).

## Tooling — Magic MCP (21st.dev)

`@21st-dev/magic` доступен как user-scoped MCP (`mcp__magic__*`). Natural-language → React/TSX/Tailwind генератор. Работает с Next + Tailwind стеком сайта.

**Использовать для:** bootstrapping новых типов секций (hero variants, feature grids, testimonial blocks, pricing tables, FAQ accordions), стандартных UI-паттернов (формы, modals, command palette), logo wall / icon-set вставок (`mcp__magic__logo_search`).

**НЕ использовать для:** копирайтинга — copy и structure НИКОГДА не из Magic, они из `bso-positioning-framework-v1` и BRIEF. Magic выдаёт визуальные обёртки, не контент. Также не трогать deploy-пайплайн (отдельные Vercel + branch-protection правила в global CLAUDE.md — push в main = production publish, hard-rule).

**Tracking:** [BSO-252](https://linear.app/backspace-oddity/issue/BSO-252).

## Analytics

This site uses Rybbit analytics. The tracking script must be present in the `<head>` of every page.

**Tracking snippet:**
```html
<script
    src="https://app.rybbit.io/api/script.js"
    data-site-id="41dafd61e53c"
    defer
></script>
```

**Where it lives:** `app/layout.tsx` — injected via Next.js `<Script>` from `next/script` with `strategy="afterInteractive"` (semantic equivalent of `defer`, with proper App Router integration so the script isn't re-executed on client-side navigation). Because this is the **root layout** of the App Router, every page in `app/**/page.tsx` inherits it automatically.

**When creating new pages:** nothing to do. Any new `page.tsx` placed anywhere under `app/` (including nested routes and route groups) is automatically wrapped by `app/layout.tsx` and will load the script. **Exception:** if you ever introduce a competing root layout inside a route group that defines its own `<html>` tag (e.g. `app/(marketing)/layout.tsx` with `<html>`), you must copy the `<Script>` block there too, or the tracker will be missing for routes in that group.

**Subdomains:** each subdomain (e.g. `blog.backspaceoddity.com`, `app.backspaceoddity.com`) is a separate origin from Rybbit's perspective. Two options: (a) register each subdomain as its own site in Rybbit and use a distinct `data-site-id` per app, or (b) register a single Rybbit site configured to accept all `*.backspaceoddity.com` origins and reuse the same `data-site-id`. Choose (a) when you want isolated dashboards per property; choose (b) for one unified funnel across the whole brand.

Do not remove this script or this section without explicit user confirmation.
