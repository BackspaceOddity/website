# Canonical Sources — `context/`

> These files are **snapshots** of canonical documents that live in sibling projects.
> They are NOT the source of truth. They exist so that BSO Website sessions can work offline from them
> without walking into `Second Brain/` or `Content Marketing/` mid-task.
>
> When reality in the source project changes materially, re-sync via the protocol below.

**Last synced:** 2026-04-21
**Synced by:** /help advisor flow → Option C (snapshot + indirection)

---

## File index

| Path | Canonical source | Role |
|---|---|---|
| `positioning/bso-positioning-framework-v1.md` | `Second Brain/nodes/bso-positioning-framework-v1.md` | **Single source of truth** for BSO positioning. Structural backbone of the new site. |
| `positioning/content-marketing-brief-v0.md` | `Content Marketing/docs/BRIEF.md` | Why / Audience / Promise / Pillars / Formats / Channels / Cadence / Measurement / Year-1 bets / Non-goals. Sections 1-3 final, 4-10 draft. |
| `foundation/bso-magician-not-teacher-architecture.md` | `Second Brain/vault/docs/2026-02-bso-magician-not-teacher-architecture.md` | Original narrative foundation (Feb 2026). Three-phase client journey, 5-layer agent architecture, hero classes. |
| `market-context/foundation-ai-service-as-software.md` | `Content Marketing/context/foundation-ai-service-as-software-paradigm.md` | Foundation Capital: "AI Leads Service-as-Software Paradigm Shift". Market rationale. |
| `market-context/foundation-4-6t-lessons.md` | `Content Marketing/context/foundation-4-6t-lessons-first-year.md` | Foundation Capital: "$4.6T Services-as-Software Lessons". |
| `market-context/sequoia-services-new-software.md` | `Content Marketing/context/sequoia-services-new-software.md` | Sequoia (Julien Bek, Mar 2026): "Services: The New Software". Source of Intelligence/Judgement split + copilot/autopilot framing. |

---

## How to use in BSO Website sessions

1. **Reading order for new-site copy rebuild:**
   - Start with `positioning/bso-positioning-framework-v1.md` — that's the backbone.
   - Then `positioning/content-marketing-brief-v0.md` sections 1-3 (Why/Audience/Promise) — they drive hero + manifesto + target audience copy.
   - `foundation/bso-magician-not-teacher-architecture.md` is supporting material for "How we work" and "What happens next" sections — read after the top-level narrative is locked.
   - `market-context/*` are for citations in manifesto / "why now" sections, not primary copy source.

2. **Never edit these files in place.** If you notice something wrong or stale, edit the canonical source (column 2 in the index), then re-sync.

3. **Do not treat these as the latest word** if the sync date (header above) is more than ~2 weeks old without a session that explicitly re-synced. When in doubt, diff against the canonical source before using verbatim.

---

## Re-sync protocol

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

## Why this shape (rather than symlinks or a flat dump)

- **Not symlinks** — if canonical paths change or a sibling project gets restructured, symlinks rot silently mid-session. Snapshot + protocol is the robust version.
- **Not a flat dump** — sub-folders (`positioning/` / `foundation/` / `market-context/`) encode the reading order and trust tier. Reading `positioning/` first and `market-context/` last is the correct order every time.
- **With this index** — future sessions and future Yegor know in one glance where the truth lives and how to refresh. Avoids the WEBSITE-CONTENT.md-v1-divergence class of error.
