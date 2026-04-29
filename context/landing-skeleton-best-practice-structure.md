<!--
READ-ONLY SNAPSHOT — do not edit in place.
Canonical: Notion page 34a402511cda81bcaf55fcc83eadd4d0
URL: https://www.notion.so/Landing-skeleton-best-practice-structure-34a402511cda81bcaf55fcc83eadd4d0
Fetched: 2026-04-28 (snapshot of Notion as of 2026-04-24T07:20:31Z)
This page is live — Yegor annotates inline. Re-fetch from Notion before client-facing work.
-->

# 🧱 Landing skeleton — best-practice structure

> **Статус 2026-04-23:** все 8 экранов + Footer прошли drafting. Экраны 1, 2, 3, 4, 6, 8, Footer — залочены. Экран 5 (Proof) скипнут для V1 (BSO too early). Экран 7 (Insights) отложен (Content Marketing pipeline ещё запускается). **Design prompts per screen — `BSO Website/context/v2-design-prompts.md`** (вход для Claude Design).
>
> **Что это.** Структурный скелет лендинга агентства на основе best-practice паттернов (Metalab, Pentagram, Work & Co, Instrument, R/GA, Huge, Ueno, Koto). Без наполнения — только роли экранов, что обычно на них живёт, и какие вопросы они закрывают у посетителя.
>
> **Как использовать.** Прочти каждый экран, напиши свои мысли прямо в блок «Твои заметки» под ним. Всё, что ты впишешь, я возьму и соберу v2 лендинга. Можно добавлять / удалять / переставлять экраны — свобода полная.

---

## Общие best-practice принципы

Проходят через все экраны.

- **Одна идея на экран.** Если экран отвечает на два вопроса — это два экрана.
- **Work > claim.** Кейсы убеждают сильнее заявлений. Чем ближе реальная работа к верху — тем выше доверие.
- **Конкретика > абстракция.** Имена клиентов, цифры, результаты. Избегаем «we help companies grow».
- **Плотная копия.** Каждое слово работает. Premium-агентства не многословные.
- **Визуальная иерархия.** Крупный тайп, щедрое пространство, ограниченная палитра.
- **Mobile-first.** Одноколоночная логика на всех экранах. Desktop — расширение, не основа.
- **Meta правильная.** Title / description / OG image / favicon — базовая гигиена.

---

## Экран 1 — Hero ✅ locked (2026-04-22)

**Роль.** Дать посетителю одну мысль за 3 секунды: что это за агентство, стоит ли оставаться.

**H1 (locked).** GTM strategy is not a set of tactics across channels.

**Sub (locked 2026-04-23 — полировка позже).** It's what channels execute — who your audience is, the job they need done, the context they're buying in, who you compete with there, and why you fit best.

**CTA.** Book a call → Cal.com.

**Почему этот тезис работает** (прошёл 4 проверки): tov.md (субъект «GTM strategy» — категория, не читатель); Maja-check (её книга об этом и есть); BSO-тезис BRIEF §4 (несёт негативную половину); Hook («is not X» создаёт пустоту).

**Открытые вопросы:** visual-first или text-first; sub-линия может упроститься после Screen 2; CTA-текст («Book a call» / «Let's talk» / «See how we work»).

---

## Экран 2 — Selected work ✅ locked (2026-04-23)

**H2.** Companies we've worked with.

**Layout.** 6 cards in grid. In-house flagships впереди (Miro, Sidekick), потом клиентские.

1. **Miro** (in-house) — full rebrand + in-house studio setup. RealtimeBoard → Miro, $17.5B valuation followed.
2. **Sidekick Browser** (in-house) — product repositioning, category creation. Acquired by Perplexity 2025, relaunched as Comet.
3. **Stape** — brand platform + identity + positioning + site + ToV + agentic production pipelines.
4. **AI-native Film Production Company** (PiaT, withheld pending consent) — governance model + Cascade Navigation System (v5.1 origin).
5. **Global Payroll Platform** — brand strategy, renaming, positioning, identity, agentic workflows.
6. **Superabundance** — market-product fit methodology + agentic workflows + brand identity + positioning + website.

**Отложено в backlog:** Wayfund — overlaps со Stape/Superabundance, держим в `/work` deep-page.

**Открытые:** grid-раскладка (3×2 / mix-grid / другая); deep case-study pages vs hover-only; изображения (existing vs new — Stape точно нужна новая).

---

## Cross-cutting principle — Jobs framing

Сайт описывает что мы делаем через **JTBD**, не через сегменты (стартапы vs корпорации). Сквозной принцип:

- **Visitor self-selects по job, не по размеру компании.** Founder Series-B и Fortune-500 CMO могут стоять в одной очереди за одну job.
- **Re-frames конкуренцию.** По каждой job соревнуемся не с другими агентствами, а с McKinsey Brand / in-house hire / ChatGPT / «do nothing».
- **Drink own champagne.** Сайт сам структурирован по Structural JTBD — мы не *говорим*, что используем JTBD, мы *показываем*.

**Изменения в скелете:** Screen 3 = «Jobs we close» (не «Services»); Screen 2 group по jobs; Screen 1 может адресовать доминирующую job; Screen 4 (Approach) может стать лишним.

## ✅ Final JTBDs — locked 2026-04-23

Пять jobs, все в BSO ToV, клиент сам себя классифицирует, пересечений минимум.

1. **Move upmarket to enterprise buyers** — when our brand still signals «scrappy startup».
2. **Win in a market where competitors have pretty much the same product.**
3. **Operationalise strategy into a system that runs daily** — when «we already aligned on this» keeps not translating into execution.
4. **Treat the launch plan as hypotheses we test** — so when reality diverges, the plan updates and execution keeps moving.
5. **Turn «become AI-native» from wishful thinking into workflows the team actually runs daily.**

**Methodology per job (internal, not on site):**
- Job 1 — Brand strategy / repositioning / category architecture
- Job 2 — Structural JTBD + Category Entry Points + positioning
- Job 3 — Cascade Navigation System (operationalisation layer)
- Job 4 — Cascade Navigation System (runtime / hypotheses layer)
- Job 5 — AI-native knowledge ops / agents / internal tooling

---

## Экран 3 — Jobs we close ✅ locked (2026-04-23)

**H2.** The jobs we close.
**Intro.** Five. Pick the one that matches where you are.

**1. Move upmarket to enterprise buyers** — when our brand still signals "scrappy startup" in every RFP, first call, and side-by-side review.
- *What you get:* a repositioning that holds up in RFPs, first calls, side-by-sides.
- *Worked on this with:* Miro, Stape, Sidekick Browser.
- *Instead of:* brand boutiques · in-house brand team · logo-level refresh.

**2. Win in a market where competitors have pretty much the same product** — when every buyer asks "what's the difference" and we don't have a sharp answer.
- *What you get:* positioning the buyer can see in the moment they decide, not on a slide.
- *Worked on this with:* Sidekick Browser, Global Payroll Platform.
- *Instead of:* growth agencies · adding another feature · out-spending the incumbent.

**3. Operationalise strategy into a system that runs daily** — when "we already aligned on this" keeps not translating into execution.
- *What you get:* a weekly Cascade Navigation System — one that lives outside the offsite.
- *Worked on this with:* AI-native Film Production Company, Superabundance.
- *Instead of:* quarterly offsites · playbooks and templates · standing re-alignment meetings.

**4. Treat the launch plan as hypotheses we test** — so when reality diverges in week three, the team updates instead of starting over.
- *What you get:* a plan where week-3 evidence updates the plan, not the team.
- *Worked on this with:* AI-native Film Production Company.
- *Instead of:* execute-as-written · pre-flight validation · start-over re-plans.

**5. Turn "become AI-native" from an ambition in the all-hands deck into workflows the team actually runs on a Monday morning.**
- *What you get:* specific workflows that earn their place in your team's week.
- *Worked on this with:* Stape, Superabundance, Global Payroll Platform.
- *Instead of:* Notion templates · enterprise KM software · change-management consultants.

**Открытые:** matrix-style comparison (по умолчанию не добавляем — per-card теплее); визуал/иконки (decide в design-pass).

---

## Экран 4 — How we work ✅ locked (2026-04-23)

**H2.** How we work.

**Principles — three things we do differently:**

1. **We embed. We don't consult from the outside.** Один из нас в команде full-time на engagement. В standup, shipping alongside. Стратегия как deck дрейфует за квартал; стратегия из daily work — нет.
2. **We build navigation, not strategy documents.** Каждый план — карта: каждый результат перерисовывает chart, не только текущий heading. Cascade Navigation System — runtime.
3. **When we leave, the system keeps running.** Последнее, что строим — то, что работает без нас. AI-native workflows и навигация живут в неделе клиента, не в shared Notion. Transfer is the deliverable.

**Three phases, every engagement:** Map → Build → Transfer.

**Открытые:** визуал (cascade diagram / иконки / team-inside-client photo); Principle 3 формулировка («keeps running» менее конкретно); связка principles с phases (Principle N ↔ Phase N).

---

## Экран 5 — Proof ❌ skipped for V1 (2026-04-23)

**Причина.** Logo strip / metrics grid / attribution testimonials честно работают только при достаточной клиентской базе. BSO ранний — ни один не срабатывает без натягки.

**Компенсация в V1:** Screen 2 (кейсы с outcome-anchor); Screen 6 (team pedigree); deep-pages.

**Когда возвращаем:** 10+ logos или 3+ attribution testimonials. Revisit Q3 2026.

---

## Экран 6 — Team ✅ locked (2026-04-23)

**H2.** We've done this before. At companies you've heard of.

**Intro.** Built by people who've shipped brands and products at Miro, Sidekick Browser, Meta, McKinsey, R/GA, Metalab, Stink Studios, Your Majesty, ONY, and Action. The people on this page are the ones running your project — not their junior account leads. We stay small on purpose. AI-native stack lets us take volume that used to need thirty people.

**Team (pending photos + Anna/Alena clarification):**
- **Yegor Korobeynikov** — Founder & CEO. Brand, GTM, marketing, product. RealtimeBoard → Miro rebrand, Miro in-house brand studio. Sidekick Browser marketing lead. Superabundance venture studio.
- **Anna Barinova** — Head of Production. [bio details TBD]
- **Alena [?]** — Operational lead. Ex-ONY ops director. Yandex.Taxi rebrand from agency side, embedded inside in-house team. Amsterdam. [Anna = Alena? — to clarify]
- **Ivan** — Change methodology. Action, JAMI Group. Designs transitions for adoption.
- **Artem Sologub** — Design × dev × growth. Miro in-house, R/GA, Metalab, Stink Studios, Your Majesty.
- **Siraj Hasanov** — Tech lead. Ex-Meta SWE. Founder of Acris.ai.

**Открытые:** Anna vs Alena (один или два?); photos; teaser+see-full vs all visible; Anna bio; LinkedIn links.

---

## Экран 7 — Insights / Writing ✅ locked — minimal strip (2026-04-23)

**Решение.** V1 минимальная строка над Footer, без активной ссылки до запуска Content pipeline.

**Content (V1):** «We write about strategy systems on Substack. Launching soon.»

**Layout.** Single line strip над Footer. EB Garamond Regular 20px, muted (70% opacity). Cream / dark в зависимости от Footer.

**Триггер promotion → full секция:** 3+ живых постов + регулярный ритм. Q2–Q3 2026.

---

## Экран 8 — Final CTA ✅ locked (2026-04-23)

**H2.** The first call takes 30 minutes. No deck.

**Copy.** You show us the problem. We tell you where we'd start, and whether we're the right fit. If not, we'll point you at someone who is.

**Primary.** Book a call → https://cal.com/krbnkv/30min
**Secondary.** yegor@backspaceoddity.com

**Открытые:** visual (full-bleed dark mirror Hero / light closing); secondary CTA inline или отдельной строкой; «Point you at someone who is» — оставить или убрать.

---

## Footer ✅ locked (2026-04-23)

3 columns desktop / stacked mobile.

- **Col 1 brand:** logo (BSO wordmark SVG), © Backspace Oddity 2026.
- **Col 2 nav:** Work · How we work · Contact.
- **Col 3 contact & social:** yegor@backspaceoddity.com · Amsterdam · LinkedIn (BSO company) · Substack (когда live).

**Открытые:** office address (city-only vs full Vijzelstraat); social links (LinkedIn URL, Substack placeholder); legal (Privacy/Terms — собираем email?).

---

## Вопросы структурного уровня — открыты

1. Сколько экранов в итоге? Full 8 vs 5–6 (без Insights, без Team на main).
2. Work first или thesis first?
3. Deep case study pages vs grid only.
4. Отдельные страницы /about /services /writing /work vs single-page main.
5. Primary CTA одинаковый везде или разный на каждом экране.
6. English-only vs RU тоже.
7. Jobs framing — как глубоко (только Screen 3 vs каскадно по cases/Hero/Approach).

---

*Снимок Notion-страницы. Свежие правки Yegor — только в Notion.*
