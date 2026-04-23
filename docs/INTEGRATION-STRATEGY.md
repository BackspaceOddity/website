# Integration Strategy — BSO Website

How this project connects to sister projects in the workspace.

## Forward dependencies (we consume)

- **`../../Internal projects/Second Brain`** — canonical positioning framework, methodology nodes, decisions. Specifically:
  - `nodes/bso-positioning-framework-v1.md` — structural backbone for any V2 copy
  - `nodes/cascade-hypotheses.md` + `vault/docs/2026-04-cascade-navigation-system-v5.1.md` — canonical methodology IP
  - `nodes/backspace-oddity-brand.md` — brand identity reference (partial; currently stale on tagline)
  - `~/.claude/tov.md` — tone-of-voice hard rules for all client-facing copy
- **`../Content Marketing`** — canonical BRIEF (`docs/BRIEF.md`) with signature thesis, audience, pillars, cadence. V2 copy must align with BRIEF §4.

Snapshots of canonical docs are cached locally in `context/` with `CANONICAL-SOURCES.md` manifest. Re-sync protocol defined there.

## Reverse dependencies (we produce)

- **Second Brain** — learnings about canonical-IP drift, tov enforcement, pushback-protocol. Harvested at `/wrap` as cross-project nodes.
- **Content Marketing** — fact-check findings (e.g. Maja-check against BRIEF §4 thesis) surface as change-requests to BRIEF.
- **backspace-oddity-design-system** — will consume locked IA + copy when DS-to-HTML pipeline runs. Currently no direct handoff; DS and Website iterate in parallel.

## Shared protocols

- **Canonical source pattern** — `[[decision-three-layer-source-pattern]]`. Notion = live canonical for evolving docs; SB graph = summary + versioned cache.
- **Context-load** — Option C (snapshot + CANONICAL-SOURCES manifest). Local `context/` snapshots, with explicit re-sync on material changes in source.
- **Session lifecycle** — `[[decision-session-lifecycle-architecture-v1]]` (/start, /resume, /save, /wrap, /end).

## Anti-patterns observed

- Copy generation from abstract principles under pushback without re-reading BRIEF — captured in `.project-journal/LEARNINGS.md`. Advisor proposed pushback-trigger for canonical re-read hook (Apr 22).
- Snapshot drift — context/ cache goes stale if source updates mid-session. See [[decision-three-layer-source-pattern]] Phase B for drift detector.
