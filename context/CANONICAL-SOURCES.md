# Canonical Sources — `context/`

> These files are **snapshots** of canonical documents that live elsewhere — sibling Git projects (Second Brain, Content Marketing) or Notion pages.
> They are NOT the source of truth. They exist so that BSO Website sessions can work offline from them
> without walking into the canonical project mid-task.
>
> When reality in the canonical source changes materially, re-sync via the protocol below.

**Last synced:** 2026-04-30
**Last sync notes:** 2026-04-30 (BSO-142): added Notion-canonical class — `landing-skeleton`, `new-website-v2`, references audit. Restructured file index with canonical-type column. Added Notion-canonical re-sync protocol.

---

## File index

Three canonical types:
- **Git** — file lives in a sibling project's git repo. Re-sync via `cp` (see protocol below).
- **Notion** — single source of truth lives in Notion. Re-sync via Notion MCP fetch.
- **Local** — artifact authored in this project (handoffs, sketches, ad-hoc captures). No re-sync; archive when stale.

| Path | Type | Canonical source | Role |
|---|---|---|---|
| `positioning/bso-positioning-framework-v1.md` | Git | `Second Brain/nodes/bso-positioning-framework-v1.md` | **Single source of truth** for BSO positioning. Structural backbone of the new site. |
| `positioning/content-marketing-brief-v0.md` | Git | `Content Marketing/docs/BRIEF.md` | Why / Audience / Promise / Pillars / Formats / Channels / Cadence / Measurement / Year-1 bets / Non-goals. Sections 1-3 final, 4-10 draft. |
| `positioning/cascade-navigation-system-v5.1.md` | Notion | [`33a402511cda819492cbcabb7a9603bc`](https://www.notion.so/33a402511cda819492cbcabb7a9603bc) (D1: Cascade Navigation System v5.1) | **Canonical methodology IP (v5.1.0, April 2026)** — 3 Pillars (Cascading Hypotheses, Category Entry Points, Stage-Gate), 3 Blocks (Audience / Product / Growth Engine), 5 Stages + Prep + Packaging, weekly cycle, governance roles, IP Scorecard, DB implementation, DRAGN worked example. Supersedes the outdated v0.5.0 stub node at `Second Brain/nodes/cascade-hypotheses.md`. |
| `foundation/bso-magician-not-teacher-architecture.md` | Git | `Second Brain/vault/docs/2026-02-bso-magician-not-teacher-architecture.md` | Original narrative foundation (Feb 2026). Three-phase client journey, 5-layer agent architecture, hero classes. |
| `market-context/foundation-ai-service-as-software.md` | Git | `Content Marketing/context/foundation-ai-service-as-software-paradigm.md` | Foundation Capital: "AI Leads Service-as-Software Paradigm Shift". Market rationale. |
| `market-context/foundation-4-6t-lessons.md` | Git | `Content Marketing/context/foundation-4-6t-lessons-first-year.md` | Foundation Capital: "$4.6T Services-as-Software Lessons". |
| `market-context/sequoia-services-new-software.md` | Git | `Content Marketing/context/sequoia-services-new-software.md` | Sequoia (Julien Bek, Mar 2026): "Services: The New Software". Source of Intelligence/Judgement split + copilot/autopilot framing. |
| `landing-skeleton-best-practice-structure.md` | Notion | [`34a402511cda81bcaf55fcc83eadd4d0`](https://www.notion.so/34a402511cda81bcaf55fcc83eadd4d0) | V2 landing-page skeleton — 8 screens + footer + open questions. Live doc; user annotates inline. Always fetch fresh before generating section copy. |
| `new-website-v2-notion.md` | Notion | [`349402511cda8064acc2f157d1ab11b8`](https://www.notion.so/349402511cda8064acc2f157d1ab11b8) | V2 parent page. Pointer doc — index of all V2 sub-pages (skeleton, audit, archive). Fetch when navigating V2 structure. |
| `website-ia-sketch-v0.md` | Local | this project (archived in Notion as v0/v1/v1.1 drafts at `349402511cda8171bd5bff0dc665a390`) | Rejected IA sketches (Yegor: "wrong accents, wrong packaging"). Kept as historical reference; do NOT use as input. |
| `claude-design-handoff/*` | Local | this project (Claude Design conversation 2026-04-24, file `DicK6mMEcbYL`) | One-shot conversation export from Claude Design session. Used to generate V2 HTML. No re-sync — archive if/when superseded. |
| `v2-design-prompts.md` | Local | this project | Per-screen design-handoff prompts for code-generation agents. Authored 2026-04-23. |
| `jetbrains-proposal-2026-04.md` | Local | this project (PDF cache from JetBrains) | Inbound brief snapshot. No re-sync (closed PDF). |

---

## How to use in BSO Website sessions

1. **Reading order for new-site copy rebuild:**
   - Start with `positioning/bso-positioning-framework-v1.md` — that's the backbone.
   - Then `positioning/content-marketing-brief-v0.md` sections 1-3 (Why/Audience/Promise) — they drive hero + manifesto + target audience copy.
   - For section copy: fetch `landing-skeleton-best-practice-structure.md` from Notion fresh — that's where Yegor locks copy decisions per-screen.
   - `foundation/bso-magician-not-teacher-architecture.md` is supporting material for "How we work" and "What happens next" sections — read after the top-level narrative is locked.
   - `market-context/*` are for citations in manifesto / "why now" sections, not primary copy source.

2. **Never edit Git or Notion canonical snapshots in place.** If you notice something wrong or stale, edit the canonical source (column 3 in the index), then re-sync via the protocol below.

3. **Stale-by-default for Notion-canonical.** If the local `landing-skeleton-...` snapshot is older than ~24h, re-fetch from Notion before producing section copy. Yegor edits Notion live; lag matters.

4. **For Git-canonical:** if the sync date (header above) is more than ~2 weeks old without a session that explicitly re-synced, diff against the source before using verbatim.

5. **Local artifacts** (`v2-design-prompts.md`, `jetbrains-proposal-2026-04.md`, `claude-design-handoff/*`, `website-ia-sketch-v0.md`) — treat as session-time evidence, not living docs. Don't re-sync; archive when superseded.

---

## Re-sync protocol — Git-canonical

When positioning moves in `Second Brain/` or `Content Marketing/` (e.g. BRIEF.md locks v1, framework updates to v2, or a new market-context doc is added):

1. From BSO Website root, run:
   ```bash
   BSO="/Users/yegorkorobeynikov/Cursor/Home space/Backspace Oddity/Internal projects/BSO Website"
   SB="/Users/yegorkorobeynikov/Cursor/Home space/Backspace Oddity/Internal projects/Second Brain"
   CM="/Users/yegorkorobeynikov/Cursor/Home space/Backspace Oddity/Internal projects/Content Marketing"

   cp "$SB/nodes/bso-positioning-framework-v1.md"                   "$BSO/context/positioning/bso-positioning-framework-v1.md"
   cp "$CM/docs/BRIEF.md"                                           "$BSO/context/positioning/content-marketing-brief-v0.md"
   cp "$SB/vault/docs/2026-02-bso-magician-not-teacher-architecture.md" "$BSO/context/foundation/bso-magician-not-teacher-architecture.md"
   cp "$CM/context/foundation-ai-service-as-software-paradigm.md"   "$BSO/context/market-context/foundation-ai-service-as-software.md"
   cp "$CM/context/foundation-4-6t-lessons-first-year.md"           "$BSO/context/market-context/foundation-4-6t-lessons.md"
   cp "$CM/context/sequoia-services-new-software.md"                "$BSO/context/market-context/sequoia-services-new-software.md"
   ```
2. Update `**Last synced:**` in this file's header to today's date.
3. Note in the commit message which canonical files moved and why.
4. If the positioning framework has versioned (`v1` → `v2`), rename the file in `positioning/` and update this index accordingly.

---

## Re-sync protocol — Notion-canonical

When a Notion-canonical doc has changed (Yegor edited the skeleton, audit got new comments, methodology v5.x bumped):

1. **Fetch via Notion MCP** (`notion-fetch` tool, scope: page-id from index column 3). Output is markdown.
   - For long pages (>10k chars / >100 blocks): use `notion-cache` skill to write to a temp file, then `notion-fetch` summary or section-by-section reads to assemble the snapshot.
   - For short pages (<10k chars): direct `notion-fetch` output is fine.

2. **Add a read-only header** to the snapshot:
   ```markdown
   <!--
   CANONICAL SOURCE: Notion page <page-id>
   URL: https://www.notion.so/<page-id>
   Last synced: YYYY-MM-DD HH:MM
   Synced by: <session-id or task description>

   This is a snapshot — DO NOT edit in place. Edits go in Notion.
   Re-sync via Notion MCP fetch (see context/CANONICAL-SOURCES.md).
   -->
   ```

3. **Save** to `BSO Website/context/<filename>.md`. Filename should match the title's slug or the Notion page slug (whichever is more readable).

4. **Update this file's index** if it's a new entry (path + type=Notion + page-id link + role description). Update `**Last synced:**` in the header above to today's date if any Notion source moved.

5. **Note in the commit message** which Notion page was re-fetched and why (e.g. "BRIEF v1 locked", "skeleton Screen 3 jobs locked").

### When NOT to keep a snapshot for a Notion page

If the page is essentially read-once-then-discard (one-time briefs, ad-hoc references), **don't** create a snapshot. Fetch live via Notion MCP at use-time. The snapshot pattern is for docs that drive multiple sessions of work.

### Notion-canonical drift discipline

Per project [CLAUDE.md](../CLAUDE.md) "Canonical sources — Notion > local (HARD RULE)":

- For client-facing copy decisions (hero / H1 / tagline / section copy): **always fetch Notion first**, even if a local snapshot exists. Yegor edits Notion live; the local copy lags.
- If you must use the local snapshot (offline, Notion MCP failing): explicit flag in the response — "working from local copy as of `<sync date>`; Notion may have diverged".

---

## Why this shape (rather than symlinks or a flat dump)

- **Not symlinks** — if canonical paths change or a sibling project gets restructured, symlinks rot silently mid-session. Snapshot + protocol is the robust version. Same applies to Notion: page IDs are stable but page contents move.
- **Not a flat dump** — sub-folders (`positioning/` / `foundation/` / `market-context/`) encode the reading order and trust tier for Git-canonical docs. Notion-canonical and Local artifacts live at the root because they're typically session-scoped or live-editable, and folder-grouping by source-type would obscure the per-doc role.
- **With this index** — future sessions and future Yegor know in one glance where the truth lives, what type of canonical it is, and how to refresh. Avoids the WEBSITE-CONTENT.md-v1-divergence class of error and the canonical-staleness-trap.

Related Second Brain nodes:
- `nodes/decision-three-layer-source-pattern.md` — three-layer pattern (Notion canonical → Git canonical → context/ snapshot). The Notion-canonical class added here (2026-04-30, BSO-142) extends that pattern to docs whose source-of-truth lives in Notion rather than Git.
- `nodes/snapshot-canonical-staleness-trap.md` — the failure mode this protocol prevents (cached snapshot diverges silently from canonical mid-session).
