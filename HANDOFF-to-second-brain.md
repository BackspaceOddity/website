# Handoff — paste as first message in Second Brain CC session

**Отвечай по-русски.**

Forkнулся из BSO Website session через /move-to-session 2026-04-23.

Задача: разобраться с BSO Figma Bridge setup friction и пофиксить в коде раз-и-навсегда. Контекст и options расписаны в:

```
docs/DECISIONS-INBOX/bso-figma-bridge-setup-friction.md
```

Session-bootstrap должен подхватить файл автоматически. Если нет:

1. Прочитай `docs/DECISIONS-INBOX/bso-figma-bridge-setup-friction.md` — problem, findings, 3 options, recommendation.
2. Решение — **Option A сейчас** (extend `require-figma-bridge.py` hook под auto-scaffold `.mcp.json`) **+ Option B через 1-2 недели** (workspace-inherited config).
3. Работать в `bso-figma-mcp/` + `_system/hooks/` репозиториях.

Parent BSO Website session остаётся открытой, продолжает Screen 2 V2 copy drafting (разблокирована — PDF JetBrains получен локально). Bridge fix — параллельный track.

Key refs:
- [[hook-reminder-to-blocker-upgrade-pattern]] — soft-inject → block upgrade path
- [[three-layer-rule-enforcement]] — code + graph node + doc
- [[decision-graph-lookup-before-generation]] — precedent, тот же hook-архитектурный паттерн

Hard rails:
- Не трогать token secrets в commits
- Сначала soft-inject pattern, upgrade до auto-write только после evidence
- Commit-per-layer (hook edit, decision node, doc update — отдельные коммиты)
