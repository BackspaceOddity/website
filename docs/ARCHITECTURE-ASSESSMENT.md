# Landing Builder (Kern) — Architecture Assessment

_Written 2026-06-23 as a systems-architect review, grounded in the current code + DB (not from memory). Companion to BSO-658 (port), BSO-682 (foundation hardening), BSO-683 (deploy architecture)._

## Verdict (one paragraph)

Your instinct is correct, but "no architecture" is imprecise. There **is** an architecture — it just accreted reactively instead of being designed, and it has crossed the line from "clickable prototype" to "expected to be a stable SaaS" without anyone paying the bill for that promotion. The patchwork feeling has a specific, nameable root: **there is no single source of truth for "a page."** The same page exists in up to four representations, draft-vs-published is duplicated columns instead of versions, the rendering config is inferred by branchy code instead of stored as data, and the entire editor is one 1910-line `@ts-nocheck` class with types switched off. Each new feature is a new branch in that one file, so nothing composes and regressions are invisible until you hit them in the browser. Before committing months to harden the bespoke engine, there is a decision the project has been skipping (its own hard-rail): **build vs. extend vs. buy.** A billable-SaaS architecture is achievable on this codebase, but only as a deliberate re-foundation, not more feature-accretion.

## Current architecture (what we actually have)

```
Surface        proxy.ts → kern=builder | <client>=/w/<slug> | merz=published
Editor         app/builder/BuilderApp.tsx — ONE 1910-line @ts-nocheck class
               component (React.createElement). Holds every screen
               (boot/login/dashboard/editor/deploy/analytics) + every concern
               (auth, data, nav, blocks, tweaks, publish, edit) in one file.
Render         app/builder/blocks/*.tsx — block model {type,props,bg,pad,overrides}
               + per-DS stylesheets public/builder-css/{pbt,kos,quiet,urembo,p8fig}.css
               consuming CSS variables.
Data           Supabase builder_pages: jsonb blocks + styles, PLUS a parallel set
               of published_* columns (published_blocks/styles/title/real_page/at/by).
Auth           cookie {a,r} token pair + readSession() refresh (solid after #3).
API            9 route handlers under app/api/builder/.
Edit Mode      @backspace-oddity/edit-mode injected via app/builder/page.tsx.
```

## Why it feels like a patchwork — six structural debts

1. **No canonical page model (the root).** "A page" exists as: (a) a hardcoded built-in (`realpages.tsx` + `BT_PAGES` + its own `p8fig.css`), (b) a `builder_pages` DB row, (c) a published snapshot in `published_*` columns, and sometimes (d) a separate hardcoded route (`app/8figures/`). None is canonical. Every import/copy/style operation has to special-case which representation it's touching. This is exactly the 8figures import mess.

2. **God component.** `BuilderApp.tsx` = 1910 lines, `@ts-nocheck` (the compiler is OFF on the most complex file in the system). All concerns fused; every feature is another branch. No unit can be tested in isolation; coupling guarantees cross-feature regressions ("nothing integrates").

3. **Config is code, not data.** The page→stylesheet binding is resolved by branchy logic (`activeDs()` special-cases built-in vs DB pages); tabs were hardcoded (fixed in #4); deploy target is hardcoded to `kern/published` (BSO-683). A page's stylesheet should be a stored property of the page, not inferred. Until it is, every new DS/page/import fights the code.

4. **Draft/publish = duplicated columns, not versions.** `published_*` mirrors the draft columns. The "versions" shown in the editor are in-memory mock. There is no version table, no rollback, no audit. Publishing is a copy, not a release.

5. **No verification layer.** Everything is verified manually, behind login, with types disabled. Nothing catches a regression before the user does — so "it doesn't work reliably" is structural, not bad luck.

6. **No active roadmap spine.** BSO-658 defined milestones (M2 store, M4 publish, M7 lock/versioning) but they aren't driving the work; features land reactively. That is the patchwork, by construction.

## The decision we're skipping: build / extend / buy

A systems architect must surface this before proposing "the architecture," because the most reliable architecture may be *not* maintaining a bespoke page engine. The project's own CLAUDE.md flags it as unresolved.

- **(A) Keep building the bespoke engine.** Most control, most surface to own forever, most expensive. Only honest if we pay for a real architecture (below), not more accretion.
- **(B) Consolidate onto the real proposal-workspace blocks** (`lib/proposal-workspace/`) with a proper page model. Reuses assets we already maintain; less net-new surface than (A).
- **(C) Adopt Framer/Webflow/Tilda for page rendering + hosting**, keep only the BSO-specific layer (proposal assembly, Edit Mode, client workspaces, auth). Least bespoke engine to maintain; the page-engine reliability becomes a vendor's problem.

The question "what architecture lets us charge money" is downstream of this. If the answer is (C), most of the engine below is moot.

## Target architecture (if we keep building — A or B)

Layered, single source of truth. Each layer is replaceable and (where pure) testable.

```
1. Page model (canonical)   ONE builder_pages row = the only source of truth.
                            { id, slug, title, blocks[], style:{ dsKey, overrides },
                              status, target }. Kill the parallel published_* columns →
                              a page_versions table (draft = latest; published = a
                              pinned version id). Seed the "built-in" pages AS rows;
                              delete the hardcoded BT_PAGES path. → debts 1,3,4 gone.
2. Render layer (pure)      block {type,props} → component; stylesheet = page.style.dsKey
                            (a DATA lookup, no branchy DS resolution). The SAME renderer
                            serves the editor and the published route. → debt 1,3.
3. Editor (decomposed)      Split BuilderApp into Dashboard / Editor / Tweaks / Deploy /
                            Auth components + a small state store. Remove @ts-nocheck;
                            turn types back on. → debt 2.
4. Publish / deploy         publish = pin a version + write page.target {type,host,path}
                            (BSO-683). proxy.ts routes by target. → debt 4 + BSO-683.
5. Auth / session           Done (#3). Keep.
6. Edit Mode                Canonical package. Keep.
+ Verification              The pure render layer is unit-testable; add ~3 e2e smokes
                            (login, save, publish). CI gate before kern deploy. → debt 5.
+ Roadmap                   Activate the BSO-658 milestones as the work spine. → debt 6.
```

## Recommendation + sequence

1. **Make the build/extend/buy call first** (1 session, decision-only). Everything below assumes A or B. This is the gating product decision, not an engineering detail.
2. **If A/B: land the canonical page model (debt 1/3/4) before any more features.** It is the single highest-leverage move — the 8figures mess, the import fights, the publish duplication, and most "nothing integrates" pain all descend from the missing page model.
3. **Then decompose the God component (debt 2) + turn types on**, incrementally, screen by screen — not a big-bang rewrite (Spolsky's rule).
4. **Add the thin verification layer (debt 5)** so the re-foundation doesn't regress silently.
5. BSO-682 (#1–#4 done) and BSO-683 are compatible building blocks of this target — #4's data-driven config and #683's target field are literally steps 1 and 4 above.

## What this is NOT

Not a call to rewrite from scratch — that is the most expensive path and usually fails (the existing engine works for demos today; keep it running while re-foundating underneath). Not a claim that the current work was wasted — the four foundations (BSO-682) are real progress and slot into the target. It IS a claim that **feature-accretion must stop until the page model and the build-vs-buy decision are settled**, or the patchwork compounds and the "billable SaaS" expectation stays unmet.
