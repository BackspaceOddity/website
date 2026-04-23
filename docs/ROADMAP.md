# Roadmap — BSO Website

Two parallel tracks. Ordered priorities within each.

## Track 1 — Live-site maintenance

1. **Push queued commits** (blocked on GitHub PAT from Yegor). 41 commits on `master` not yet pushed to `origin/main` — blocks Vercel deploy of most recent changes.
2. Hero backdrop — retrofuturistic 70s sci-fi image; ChatGPT keeps producing synthwave (anchor prompt on Chris Foss / Syd Mead, not decade).
3. Manifesto backdrop — warm/amber retrofuturistic variant; `backdrop-02.webp` placeholder in place.
4. Team photos — Artem Sologub + Siraj Hasanov when photos arrive.
5. Stale HTML comment cleanup — `iki.ai` reference in `src/index.html` Row 3 (line ~757).

## Track 2 — V2 content rebuild (active)

Authored in Notion under "New website V2" parent page.

**Phase 1 — Foundations (done 2026-04-22 → 23)**
- ✅ Context loaded (`context/` with CANONICAL-SOURCES manifest)
- ✅ Best-practice skeleton published (8 screens + footer + open questions)
- ✅ 7-site reference audit + Yegor's 14-comment filter pass
- ✅ Jobs framing as cross-cutting principle
- ✅ Hero locked — "GTM strategy is not a set of tactics across channels."

**Phase 2 — Screens 2–10 draft (next session)**
- Screen 2 — "What real GTM strategy is" (positive half of hero thesis). Source: BRIEF §4 + Pillar 1 methodology (Structural JTBD, CEP, SHIFT+, Cascade Navigation).
- Screen 3 — Jobs we close (framing locked; needs 3–5 final jobs + vs-what per job).
- Screen 4 — Approach (tab-switcher product-screens concept; deferred until visual direction).
- Screen 5 — Proof (filtered down per audit review; patterns TBD).
- Screen 6 — What you can take with you / Resources.
- Screen 7 — Work / Portfolio (reframed around jobs, not chronology).
- Screen 8 — Team.
- Screen 9 — Two ways to work with us (if kept from v1 experiment).
- Screen 10 — Final CTA.

Target: 8–10 screens, not 16.

**Phase 3 — Copy lock + HTML implementation**
- Copy passes through tov-lint skill before any landing
- Locked copy mirrors to `WEBSITE-CONTENT.md` (V3)
- HTML translation via `src/index.html` `<style>` overrides pattern (no framework)

**Phase 4 — Deploy**
- Requires GitHub PAT; Vercel auto-deploys on push

## Cross-track blockers / dependencies

- **BRIEF §4 tightening** — signature thesis "everything called GTM strategy is tactics" doesn't survive Maja-check; change-request belongs in parallel Content Marketing session. Blocks any copy that carries the thesis beyond Hero.
- **Figma design direction for V2** — currently no visual direction for V2 site. `backspace-oddity-design-system` project may contribute tokens; not yet wired.

## Non-goals

- Redesign of underlying CSS framework — existing design system preserved.
- Multi-language — EN-only (BRIEF §6 Channels locks LinkedIn/Substack/Twitter as EN; TG as RU, off-site).
- CMS migration — staying static HTML.
