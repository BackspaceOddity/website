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

## Session 2026-04-20 — content-sync rebuild

[2026-04-20] [ERROR] [CROSS-PROJECT]: WebFetch returns AI-summarized content that can invent or miss structural details. On the BSO site rebuild, WebFetch reported Row 3 of the portfolio as "3 equal cards" matching a stale HTML comment, when the actual DOM had only 2 cards (pf-row--2col). Fix: after any WebFetch of a page whose source you own, grep the source file for the key entities to verify before treating WebFetch as ground truth. Source file > live scrape > WebFetch summary, in that order.

[2026-04-20] [LEARN] [LOCAL]: When a content doc (WEBSITE-CONTENT.md) diverges from the deployed source, rebuild from `src/index.html` not the live URL. The HTML file is the committed source of truth; the live site can be momentarily out of sync during deploys. For BSO Website: `src/index.html` is always canonical.

[2026-04-20] [WIN] [CROSS-PROJECT]: Archive-with-banner pattern for versioned content docs: when a content file gets rebuilt from scratch, rename the old one to `<name>-v1-archive.md` and prepend a "⚠️ HISTORICAL SNAPSHOT — do not edit" blockquote with a pointer to the current file. Cheaper than git archaeology, survives file moves, and prevents accidental edits to stale content.

[2026-04-20] [LEARN] [LOCAL]: Stale HTML comments outlive the code they describe. The `<!-- Row 3: 3 equal — Wayfund, iki.ai, Superabundance -->` comment survived the iki.ai card removal. Scan HTML comments during any structural change and update them in the same commit, or they mislead future WebFetch/AI passes.

## Session 2026-04-21 — positioning context load

[2026-04-21] [WIN] [CROSS-PROJECT]: Snapshot-plus-indirection pattern for cross-project canonical docs. When project A needs authoritative content that lives in project B, copy it into `A/context/<tier>/` and add a `CANONICAL-SOURCES.md` manifest with: (1) source path per file, (2) last-synced date, (3) re-sync shell block, (4) reading order. Beats symlinks (don't rot when sibling project restructures) and flat dumps (no provenance → same class of error as WEBSITE-CONTENT v1 drift). Tier sub-folders (`positioning/` / `foundation/` / `market-context/`) encode trust + reading order. Applicable any time you need locked context from a fast-moving sibling project without creating hard coupling.

[2026-04-21] [LEARN] [CROSS-PROJECT]: When the advisor (/help) caller already has full context loaded in the conversation, deliver the structured HEURISTICS response directly rather than spawning another Task subagent. The spawn exists to give the advisor fresh graph context when the caller lacks it — if you've already grepped the nodes, read BRIEF.md, walked session timelines, the subagent would just re-do that work with less information than you have. The structured format (Ситуация / Реальная проблема / Опции / Рекомендую / Графовые ссылки) is the artifact that matters, not the spawn.

[2026-04-21] [LEARN] [LOCAL]: BSO positioning lives in two coupled documents, not one. `Second Brain/nodes/bso-positioning-framework-v1.md` is the consolidated framework (structural backbone, 10 sections); `Content Marketing/docs/BRIEF.md` is the operational specification (Why/Audience/Promise/Pillars/Formats/Channels/Cadence/Measurement/Bets/Non-goals). For any BSO narrative work (site, deck, proposal), read both — framework alone is too abstract, BRIEF alone misses the architectural framing (Intelligence/Judgement split, three-layer service).

## Session 2026-04-22 — IA sketch iteration + three error classes

[2026-04-22] [ERROR] [CROSS-PROJECT]: Option-C snapshot (CANONICAL-SOURCES.md) is write-once without a re-fetch trigger. I cached Content Marketing BRIEF as `v0-in-progress` at session start; by mid-session the Notion-locked v1 existed, I never re-checked. Same shape as the cascade-hypotheses miss earlier — canonical lives externally, snapshot freezes. Pattern: snapshot protocol needs a `last_synced > N hours ago` gate that fires on any session `generation-request`. Advisor proposed this as Option B in case-analysis — extend [[decision-graph-lookup-before-generation]] hook with project-canonical-manifest re-fetch. Write once is not enough for docs that evolve mid-session.

[2026-04-22] [ERROR] [CROSS-PROJECT]: Under user pushback on copy, I re-generated new drafts from abstract principles instead of re-reading the canonical source (BRIEF §4). Three iterations of the same class in one session: "client-as-subject" principle replaced "strategy vs tactics thesis"; "your product works, growth is bottleneck" was generic-SaaS pitch BRIEF explicitly warns against; "You have a GTM plan. You don't have a GTM strategy." violated tov.md no-client-judgment rule. Root cause per advisor diagnosis: no retrieval gate on pushback event — current [[decision-graph-lookup-before-generation]] hook covers generation-requests and mode-shifts but not "user critique → re-draft". Proposal: add pushback regex pattern to the hook; on hit, inject "BEFORE responding, quote relevant BRIEF passage verbatim and align new draft to it".

[2026-04-22] [WIN] [CROSS-PROJECT]: Fact-check the thesis against adjacent thought-leaders before defending it. BRIEF §4's locked signature thesis ("everything called GTM strategy is tactics") didn't survive a check against Maja Voje's knowledge base — her 8-chapter framework covers exactly the upstream work BSO calls "real strategy", positions Clay as downstream execution, doesn't conflate strategy with channel playbooks. Thesis is true against mid-market outbound-as-a-service agencies, false as a categorical claim against thought leaders in the category — including Maja, who BRIEF §2 explicitly lists as third-layer amplifier. A thesis that erases your amplifiers is a mis-targeted thesis. Before a signature thesis locks as positioning lens, stress-test it against 2-3 public thought leaders in the same space. If they refute the thesis on substance, tighten the target.

[2026-04-22] [LEARN] [CROSS-PROJECT]: Notion normalises `_italic_` markdown to `*italic*` on storage. When you create a page with underscore-italics, future `update_content` anchors must use asterisk syntax to match. The failure mode is silent — no error, the update just doesn't land. Proposal rule: for any Notion `update_content`, build `old_str` from the output of a prior `notion-fetch`, never from the markdown you sent at create time. Applies to any Notion page you've edited more than once.

[2026-04-22] [LEARN] [LOCAL]: tov.md rule "no correcting the client's question / no client-diagnosis" is easy to violate when you think you're being direct. "You have X. You don't have Y." reads as a diagnosis — reader didn't ask you to tell them what's true about them. Category-observational frames ("there's a layer most work skips" / "frameworks exist; systems to run them don't") carry the thesis without diagnosing the reader. Before delivering any hero/tagline copy, run it through the test: "does this make a claim about the reader's actual situation?" If yes, rewrite as observation about the category.

[2026-04-22] [LEARN] [CROSS-PROJECT]: Four failed hero drafts in one session made clear: I had imposed a constraint on myself ("hero must carry signature thesis in one line") that wasn't in BRIEF. BRIEF §4 says the thesis is "a permanent positioning lens in every post" — that's about content, not about cramming into the H1 line. The hero can be a different opening, with the thesis unfolding in Screen 2. Before generating N variants under a constraint, verify the constraint against the source. Self-imposed constraints masquerading as source-imposed are a common failure mode when working from memory of a doc rather than the doc.
