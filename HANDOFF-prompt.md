# Handoff prompt — paste as first message in the new CC session

**Отвечай по-русски.** Дефолт языка общения в проекте — русский (см. `CLAUDE.md` → Language). English только для inline-кода, CLI, технических identifier'ов.

Я в worktree `nextjs-migration` форкнутом 2026-04-29 через /move-to-session из BSO Website (parent session `ba45eb3e-7604-4e52-a24a-93d5c75b72a0` на ветке master). Цель — миграция на Next.js + edit-mode, отслеживается в Linear [BSO-189](https://linear.app/backspace-oddity/issue/BSO-189/migrate-bso-website-to-nextjs-wire-edit-mode-canvaskosstape-pattern).

Пожалуйста:

1. Запусти `/resume` — scaffold audit, STATE, CHANGELOG, LEARNINGS, graph precedent.
2. Прочитай один раз `context/SPINOFF-CONTEXT.md` для полного контекста (что уже сделано на master, что не делать заново, hard-constraints).
3. Прочитай `context/GRAPH-PRECEDENT.md` — релевантные decision-ноды и эвристики из агентов.
4. `/invite figma-web-pixel-perfect knowledge-architect tone-of-voice typography` — все 4 агента подгружены, есть в `context/AGENTS-TO-INVITE.md` с rationale.
5. Открой [BSO-189](https://linear.app/backspace-oddity/issue/BSO-189/) — там 12 нумерованных шагов scope. Двигайся последовательно.

**Текущая точка:** master содержит V2 static `src/index.html` (закоммичен `2bd13cd`). Worktree на ветке `nextjs-migration` от того же commit'а. Migration ещё не начата — STATE.md / CHANGELOG.md в worktree пустые после fork'а.

**Hard-rails (из CLAUDE.md и SPINOFF-CONTEXT, не нарушать молча):**

- **Notion-canonical copy.** Jobs / principles / phases / hero / final CTA — текст из `src/index.html` верлайн, не из BRIEF. Не перегенерируй через ToV-агента «по канону BRIEF» — Notion landing skeleton (`34a40251-1cda-81bc-af55-fcc83eadd4d0`) — источник истины.
- **Reference implementation** — `Internal projects/bso-canvas/bso-canvas-app/lib/edit-mode/` + `app/api/save-draft/route.ts`. Копируй паттерн, не переизобретай.
- **Push не делать.** На master уже 72 unpushed commits, blocked на GitHub PAT. Migration commits пойдут поверх — push только когда Yegor явно даст PAT.
- **Mid-session settings reload.** `surface-visual-edits.py` хук подхватится только в следующей CC сессии после wiring. Сессия миграции не увидит surfaced edits — рестарт CC после завершения.
- **Архитектурный фикс vs заплатка.** Если упрёшься в препятствие — предлагай корневой фикс на уровне порождающего механизма (per global CLAUDE.md). Заплатка — только с TTL и явным «временно X, архитектурный — Y».
- **Stape placeholder.** `project-stape.webp` сейчас клон `backdrop-02.webp`. Реального скриншота нет. Не «починять» — это известное состояние, нужен скриншот от Yegor'а.

**Сессия в режиме implementation, не discussion.** Архитектурное решение принято (вариант A из 3 опций), все trade-offs зафиксированы в BSO-189. Двигайся к delivery.
