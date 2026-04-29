# Graph precedent for Next.js + edit-mode migration — 2026-04-29

Snapshot at fork time. Re-verify via `/resume` catch-up step in new session.

## Most relevant (architectural decisions)

- [[decision-visual-edits-protocol-v1]] — formal protocol for `_edit-threads.json` + surface hook + phased rollout (Phase 1 per-project norm in CLAUDE.md, Phase 2 global hook, Phase 3 living agent). This migration ships Phase 1 for BSO Website.
- [[decision-cross-project-knowledge-flow-default]] — why the migration goes A (Next.js) not B (custom adapter). Pattern transfer from sibling projects is the default; custom adapter is opt-out from a workspace pattern, needs explicit rationale.
- [[three-layer-rule-enforcement]] — applies to edit-mode wiring: hook layer (surface-visual-edits) + skill-step layer (in `/resume`) + doc layer (CLAUDE.md). All three needed for the rule to hold.

## Supporting (context)

- [[bso-positioning-framework-v1]] — V2 copy lens. Don't drift during port.
- [[bso-website]] / [[bso-website-current-build]] — project-level nodes, may be stale after V2 lands.
- [[bso-writing-system]] — TOV gate for any copy review during port.
- [[hero-mode-stop-rule]] — pushback discipline, applies if user critiques migration output.

## Reference siblings

- `bso-canvas-app/lib/edit-mode/` — primary reference implementation
- `Knowledge-OS-Product/web/lib/edit-mode/` — same pattern, second instance
- `Stape/Website/` — declared sibling in Linear

## Heuristic precedent (knowledge-architect rules)

- Rule #2 — enforcement-as-hook (edit-mode is a hook, not a skill instruction)
- Rule #3 — single source of truth (`_edit-threads.json` is the only edit-state store)
- Rule #4 — harvest is only intake (post-migration, edit-mode comments harvest through normal flow)
- Rule #5d — cross-project knowledge flow as default

## Heuristic precedent (figma-web-pixel-perfect rules)

- Rule #1 — verify before trusting verify (when migration is "done", run pixel-diff between old static and new Next.js render before declaring success)
- Rule #5 — Gate-3 enforced by Stop-hook (not yet wired for BSO Website; could be added during this migration if value-positive)
- Rule #8 — node-map is single source of truth for section geometry (less applicable — no Figma extraction here, but the SSoT principle generalizes)
