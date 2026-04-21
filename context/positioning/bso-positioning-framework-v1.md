---
id: bso-positioning-framework-v1
type: methodology
tags: [positioning, gtm, strategy, ai-native, agency-model, service-as-software, brand, content]
status: active
domain: [business, strategy, process]
source: "Consolidated from Content Marketing BRIEF v1 (2026-04-21), Foundation Capital + Sequoia articles, BSO magician-not-teacher doc (Feb 2026)"
---

# BSO Positioning Framework v1

Единый каркас позиционирования Backspace Oddity: что мы продаём, кому, какую рамку используем, чем отличаемся от рынка. Используется для любых клиентских материалов — сайт, презентации, proposals, контент, sales-звонки, fundraising-нарратив. Обновляется по мере накопления сигнала.

## 1. Что мы строим

**Категория:** AI-native agency и [[service-as-software]] — формат, где deliverable выполняется AI-пайплайном, а агентство держит архитектуру, approval-логику и доверие клиента. См. [[ai-native-agency]] для базовой концепции.

**Оптика продукта — двойная** (из [[vault/docs/2026-02-bso-magician-not-teacher-architecture]]):

1. **AI-native agency** — язык для рынка, который уже понимает, что агентство + AI — это отдельный класс
2. **Game design studio** — внутренний язык, который точнее описывает то, что мы делаем: проектируем иммерсивный опыт, меняющий участников пока они решают рабочие задачи. «Игра» называется по-разному: Rebranding, PMF, Germany market entry, Content machine

## 2. Рабочая архитектурная рамка: Intelligence / Judgement

Из Sequoia «Services: The New Software» (Julien Bek, март 2026).

- **Intelligence** — rule-based работа (распаковать, переформатировать, разложить, собрать черновик, разнести по каналам). Передаётся AI-системе.
- **Judgement** — experience-driven решения (что публиковать, под каким углом, когда, для кого). Остаётся у человека как нераздельная ответственность.

Split — architectural, не операционный. HITL approval gate (см. [[hitl-approval-architectural-invariant]]) — прямое следствие этой рамки, а не просто feature.

Критерий «что можно автоматизировать»: когда intelligence-компонент задачи доминирует над judgement-компонентом.

## 3. Три слоя сервиса BSO

Операционная упаковка оффера клиенту. Каждый слой — отдельная гипотеза про рынок, тестируется независимо.

### Слой 1 — GTM Strategy

Работа с фундаментом: underserved jobs → ICP per job → problems per ICP → entry-point categories → конкуренция внутри категории.

Опирается на три движка из [[vault/docs/2026-02-bso-magician-not-teacher-architecture]]:

- **Structural JTBD** — задачи клиента как математический граф, betweenness centrality / диффузия напряжения / CEP-активация / мультиплексные сети / Active Learning. Даёт вычислимые приоритеты вместо экспертных интерпретаций.
- **SHIFT+** (методология Ивана Дьяченко) — 10 шагов от запроса до стандартизации; Бррр-эффект, теория верблюда, формула Глейчера, изобретательские задачи.
- **Армия AI-агентов** — 5 слоёв (Data Foundation + Intelligence + Problem Framing + Strategy & Alignment + Execution + Change & Learning) + Meta-слой human governance.

**Intelligence/Judgement профиль:** judgement-heavy. Copilot-only tendency — эта работа плохо поддаётся externalization как autopilot.

### Слой 2 — Tactics

Cold outreach, PR, brand activations, sponsorships, partnerships. Реализация выбранной стратегии через конкретные активности.

**Intelligence/Judgement профиль:** mixed. Проектирование тактик копилотно (судит человек), исполнение может autopilot-ить (tools типа Clay, Apollo).

### Слой 3 — Creative Execution

Презентации, лендинги, баннеры, видео, контент всех форматов. Дизайн, креатив, производство.

**Intelligence/Judgement профиль:** intelligence-dominant. Autopilot-ready — это слой, где externalization тестируется первым. Внутри BSO уже построены примеры: [[bso-figma-mcp]], [[bso-miro-mcp]], [[runway-mcp]], Content Marketing pipeline.

### Мапинг на 5-слойную агент-архитектуру

Трёхслойный оффер клиенту — упрощённая упаковка более глубокой 5-слойной архитектуры из magician-документа:

| Клиентский слой | Агент-слои |
|---|---|
| Strategy | Intelligence + Problem Framing + Strategy & Alignment (слои 1-3) |
| Tactics | Execution (слой 4) + Channels/Targeting из слоя 3 |
| Creative Execution | Creative Production + Brand Design Consistency + Performance Marketing assets (в слое 4) |
| Meta (knowledge ops) | Data Foundation (слой 0) + Change & Learning (слой 5) |

## 4. Signature контрарный тезис

**Все называют go-to-market стратегией то, что по сути тактика.** Cold outreach, Clay/Apollo, LinkedIn reach — это не стратегия, это implementation. Слово strategy выхолощено до неузнаваемости.

BSO возвращает различение: стратегия — это работа с underserved jobs и ICP, а не с каналами outreach-а. Тактики идут после стратегии. Creative execution — отдельный слой ещё ниже.

Этот тезис — ключевой нарратив BSO, не временный опенинг. Мы готовы отстаивать его в комментариях, потому что глубоко в нём убеждены. Позиционно это то, что отделяет нас от типичного growth-агентства.

## 5. Методология как продажа (не barrier)

Мы рассказываем про свои фреймворки, наработки и шаблоны открыто. Делиться методологией — то, что делает нас thought leader-ами.

Но: если компания захочет применить это самостоятельно, она скорее всего не сможет (это сложно, требует архитектурного мышления + математического аппарата + опыта с SHIFT+). Показывая методологию, мы создаём желание ею воспользоваться — и именно из-за того, что сами они этого не сделают, они пригласят нас. Это и есть стратегия.

Что публикуется: методологии, фреймворки, архитектурные принципы.
Что не публикуется: клиентские шаблоны с результатами, проприетарная инженерия агентов, конкретные calibrations математических моделей.

## 6. Wedge-фильтр аудитории

Из Sequoia: «vendor swap, не reorg». Наш первичный клиент — тот, у кого уже есть **бюджетная строка на внешнюю помощь** (агентство, freelancer, внешний редактор, SMM-подрядчик). Мы не продаём концепцию агентства — мы занимаем уже существующую budget line.

Это сужает target, но точнее попадает в людей с готовой мышцей принятия решения.

## 7. Открытая развилка: copilot или autopilot?

См. [[externalization-of-expertise-open-question]] — развилка не монолитна, решается **per layer**:

- **Strategy** — скорее всего copilot only (strategy-as-service как autopilot мало кто покупает)
- **Tactics** — hybrid
- **Creative Execution** — autopilot-ready first

Content Marketing pipeline BSO используется как public probe: форма inbound-писем покажет, какой слой рынок покупает первым и в какой форме (copilot vs autopilot). См. [[content-marketing-pipeline]] для деталей.

## 8. Клиентская дорожка — Three-Phase Model

Из [[vault/docs/2026-02-bso-magician-not-teacher-architecture]] «Фокусник, а не учитель»:

- **Фаза 1 — Magician (Show Don't Tell)** — BSO берёт execution на себя, клиент видит результат без механики. Результат: «это кардинально другое качество».
- **Фаза 2 — «Как вы это сделали?»** — раскрываем механику топ-2-3 агентов, даём доступ. Результат: клиент начинает использовать инструменты сам, adoption через pull-запросы коллег.
- **Фаза 3 — Transfer** — агенты переходят внутрь организации клиента, работают каждый день, закрепляя новые паттерны. Результат: transformation flywheel замкнулся, не требует внешних стимулов.

Это и ответ на «как продавать»: клиент приходит за стратегией/ребрендингом/PMF, получает результат, спрашивает «как?» — мы раскрываем магию по мере готовности.

## 9. Аудитория

Четыре слоя (детали в [[content-marketing-pipeline]] → BRIEF.md Section 2):

1. **Tech founders-претенденты** в сложных категориях (с outsource-бюджетом)
2. **CMO в средне-крупных компаниях** на конкурентных рынках (финтех, необанки, B2B-платформы)
3. **Thought leaders + peer-агентства** — Elena Verna, Maja Voje, Kyle Poyar, Camille Ricketts, MKT1 и круг
4. **VC-партнёры** с портфелем AI-native компаний (двойная ценность: exposure + fundraising-readiness)

Герой-классы из magician-документа (Strategist / Tactician / Inventor / Ranger / Guardian) — это ortогональный способ нарезки для client-side адаптации: внутри одной компании-клиента у каждой роли свой JTBD трансформации.

## 10. Non-goals / границы рамки

- Не engineering-firm, не software-vendor. Мы продаём deliverable, не софт.
- Не product-only agency — у нас есть стратегический слой, и он главный.
- Не конкурируем за HubSpot-трафик или алгоритмы соцсетей — берём глубиной.
- Не пишем listicles, SEO-ферму, ghost-content. См. BRIEF Section 10 для полного списка.

## Связи

- [[ai-native-agency]] — базовая концепция категории
- [[service-as-software]] — рыночный контекст (Foundation + Sequoia 2026)
- [[hitl-approval-architectural-invariant]] — прямое следствие Intelligence/Judgement split
- [[externalization-of-expertise-open-question]] — открытая развилка, per-layer
- [[content-marketing-pipeline]] — первая реализация рамки (этот канал + probe)
- [[vault/docs/2026-02-bso-magician-not-teacher-architecture]] — полный текст magician-архитектуры

## Ближайшие действия по рамке

1. Применить рамку в Content Marketing BRIEF v1 — secial Section 4 rewrite под 3 слоя (apr 21)
2. Обновить [[externalization-of-expertise-open-question]] с per-layer ответами
3. При создании BSO сайта — эта рамка как structural backbone для information architecture
4. При создании клиентских презентаций — использовать как source для core slides

## Revisit

- После каждого крупного клиентского engagement (что сломалось в рамке?)
- После accumulation of ≥3 inbound-писем с чётким copilot- или autopilot-запросом
- При fundraising → рамка превращается в deck
- Ежеквартально
