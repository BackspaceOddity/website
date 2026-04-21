# New website V2 — Information architecture sketch

> **Статус:** v0 draft для ревью. Структура сайта экран за экраном, построенная на `bso-positioning-framework-v1` + Content Marketing BRIEF. Текст в секциях — не финальная копия, а «что примерно говорим здесь и зачем». Копию пишем следующим проходом, после того как IA залочена.
>
> **Источники:** `context/positioning/bso-positioning-framework-v1.md`, `context/positioning/content-marketing-brief-v0.md`, `context/foundation/bso-magician-not-teacher-architecture.md`.

---

## Narrative arc — почему именно такой порядок

Сайт ведёт читателя через три вопроса, в порядке убывания скепсиса.

1. **«Что вы вообще продаёте?»** → экраны 1–3 (Hero, Contrarian Thesis, Intelligence/Judgement)
2. **«Как это выглядит на практике?»** → экраны 4–7 (Three-Layer Service, Process, Methodology as Sales, Portfolio)
3. **«Почему вам можно доверять?»** → экраны 8–10 (Team, Copilot/Autopilot probe, CTA)

Это отход от старой структуры «hero → manifesto → business case → process → portfolio → team → CTA», где manifesto и business case боролись за одно внимание, а тезис растворялся. Новая структура — один главный тезис, раскрывающийся слоями.

---

## Экран 1 — Hero

**Роль.** Поставить signature контрарный тезис как первое, что читатель видит. Не «что мы делаем», а «с чем мы не согласны».

**H1 — направление, не финал.**
Что все называют GTM-стратегией — это тактика.

**Sub, 1–2 предложения.**
Cold outreach, Clay, LinkedIn reach — это реализация. Настоящая стратегия начинается с underserved jobs, а не с каналов. Мы работаем на этом уровне, затем спускаемся к тактике и креативу.

**CTA.** Book a call (Cal.com) + secondary link на Substack / последний signature piece, когда он будет.

**Визуал.** Dark section, backdrop сохраняем (70s retrofuturistic, если финализируешь; пока gradient остаётся).

**Зачем.** Signature тезис из framework §4 — он отделяет BSO от growth-агентств на первой секунде. Старый hero («Brand is not what you look like») — красивая философия, но не отвечает на «чем вы отличаетесь от сотен других».

---

## Экран 2 — Contrarian thesis unpacked

**Роль.** Развернуть hero-тезис так, чтобы скептик прочитал и не мог отмахнуться.

**Структура — два блока рядом.**

**Блок A — «Что такое стратегия на самом деле».**
Стратегия — это underserved jobs клиентов (Structural JTBD), ICP под каждую job, problems per ICP, Category Entry Points, конкуренция внутри категории. Это вычислимо. Это даёт приоритеты. Это не копирайт на лендинге.

**Блок B — «Что обычно называют стратегией».**
«Strategy» сегодня = план outbound-кампании. Clay + Apollo + LinkedIn sequences — это реализация выбранной стратегии, а не стратегия. Когда агентство продаёт «GTM strategy» и отдаёт outbound setup, оно продаёт тактику в обёртке.

**CTA внутри секции.** Ссылка на signature Substack piece «What GTM actually means» (когда выйдет).

**Зачем.** Один из немногих разделов, где читатель либо соглашается и остаётся, либо закрывает вкладку. Это фильтр, не убеждение.

---

## Экран 3 — Intelligence / Judgement split

**Роль.** Объяснить архитектурную рамку BSO языком, который уже знают читатели Sequoia и a16z.

**H2.**
Intelligence делает система. Judgement — всегда у человека.

**Копия — идея.**
Из Sequoia «Services: The New Software»: в любом сервисе есть rule-based работа (intelligence — распаковать, переформатировать, собрать черновик, разнести по каналам) и experience-driven решения (judgement — что публиковать, под каким углом, для кого, когда). AI забирает intelligence. BSO держит архитектуру, которая гарантирует, что judgement остаётся у человека.

Это не «автоматизация с присмотром». Это architectural split. HITL approval gate — следствие, не feature.

**Визуал.** Диаграмма вместо SVG Venn. Две колонки: что отдаётся системе и что остаётся человеку, с конкретными примерами из наших проектов.

**Зачем.** Эта рамка — единственный язык, которым мы честно отвечаем на вопрос «чем вы отличаетесь от AI automation agency». Без неё мы — ещё одна «we use AI» marketing-агентура.

---

## Экран 4 — Three-layer service

**Роль.** Показать, что мы продаём, в виде, который клиент может разобрать по слоям.

**H2.**
Три слоя. Разные гипотезы рынка. Разные экономики.

**Слой 1 — Strategy.**
Underserved jobs, ICP, CEP, positioning, category architecture. Methodology: Structural JTBD, SHIFT+, army of agents.
Intelligence/Judgement: judgement-heavy. Copilot-only.
Кому: founders-претенденты, CMO в сложных категориях.

**Слой 2 — Tactics.**
Cold outreach, PR, brand activations, sponsorships, partnerships. Реализация стратегии через конкретные активности.
Intelligence/Judgement: mixed. Hybrid copilot/autopilot.
Кому: компании с готовым budget line на рост.

**Слой 3 — Creative Execution.**
Презентации, лендинги, баннеры, видео, брендинг. Весь креативный production через наши MCP-инструменты.
Intelligence/Judgement: intelligence-dominant. Autopilot-ready.
Кому: любой клиент, нуждающийся в объёме production без потери качества.

**Зачем.** Клиент получает точку входа по уровню готовности. Strategy — для тех, кто готов пересобирать основание. Creative — для тех, кому нужно «просто быстрее и дешевле, не жертвуя качеством». Это map продаж, а не философия.

---

## Экран 5 — Process (three-phase client journey)

**Роль.** Объяснить, как мы работаем, через сквозную метафору «magician → teacher → transfer».

**H2.**
Сначала мы делаем. Потом показываем как. Потом оставляем систему у вас.

**Фаза 1 — Magician.**
Мы берём execution на себя. Клиент видит результат без механики внутри. Цель — показать, что это кардинально другое качество, чем то, с чем клиент привык работать. Нет никаких «давайте вместе выстроим процесс» на старте. Сначала вау, потом устройство.

**Фаза 2 — «Как вы это сделали?»**
Клиент сам спрашивает. Мы раскрываем механику двух-трёх ключевых агентов, даём доступ. Коллеги клиента начинают пользоваться — через pull-запросы, не через мандат сверху.

**Фаза 3 — Transfer.**
Агенты живут внутри организации клиента, работают каждый день. Transformation flywheel замкнулся. Мы уходим, система продолжает работать.

**Зачем.** Старый «four phases» (Frame / Build / Operationalize / Transfer) — консалтинговый лексикон. Новый narrative — про опыт клиента. Это и дифференциация, и soft answer на «change management»: мы не продаём реорганизацию.

---

## Экран 6 — Methodology as sales (the openness gamble)

**Роль.** Объяснить, почему мы открыто публикуем методологию и как это работает в нашу пользу.

**H2.**
Мы показываем методологию. Клиенты зовут нас, потому что сами её не соберут.

**Копия — идея.**
Всё, что мы понимаем в работе — графы JTBD, SHIFT+, Category Entry Points, Intelligence/Judgement split — живёт открыто в нашем Substack и на странице ресурсов. Пять причин, почему это не саморасстрел:

1. Методология без опыта применения остаётся академическим чтением.
2. Глубокое understanding вызывает желание работать с автором, а не копировать.
3. Открытость — быстрейший способ стать thought leader в узкой нише.
4. Клиенты, пытавшиеся самостоятельно, приходят быстрее и осознаннее.
5. Мы не публикуем калибровки, proprietary агентов, клиентские шаблоны — то, что создаёт реальное преимущество.

**CTA.** Link на Substack + на «Resources» страницу (новая, куда вынесем frameworks).

**Зачем.** Отвечает на подсознательный вопрос CMO / founder: «а чем вы лучше, если всё равно выкладываете всё в блог». Ответ встроен в позиционирование (framework §5), а не придумывается под сайт.

---

## Экран 7 — Portfolio, re-framed

**Роль.** Показать работу через язык трёх слоёв, а не через «все проекты в ряд».

**H2.**
Что это выглядит на практике.

**Strategy work.**
Miro rebrand (in-house) — from RealtimeBoard to $17.5B valuation. Global Payroll Platform — brand strategy, renaming, positioning. AI-native Film Production Company — governance model, content hypothesis framework. Wayfund — customer development, market opportunity, product development.

**Creative Execution (via AI pipeline).**
Sidekick Browser (in-house) — product repositioning → acquired by Perplexity → relaunched as Comet. Superabundance — market-product fit methodology, agentic workflows, brand identity.

**Tactics.** Пока пусто или добавляем, когда будет кейс.

**Зачем.** Клиенту, смотрящему Layer 3, нужно видеть примеры Layer 3, а не «вот все наши работы подряд». Группировка делает сайт читаемым как меню, а не как портфолио-дамп.

Оговорка — можем оставить старый 2+2+2 grid визуально, но с разделителями «Strategy work / Creative Execution», чтобы не ломать существующую вёрстку кардинально.

---

## Экран 8 — Team (credentials reframed)

**Роль.** Ответить на «кто эти люди и почему им можно доверять» — но без HR-риторики.

**H2.**
Мы уже делали это в компаниях, о которых вы слышали.

**Копия — основа, что работает.**
Built by people who've shipped brands and products at Miro, Sidekick Browser, Meta, McKinsey, R/GA, Metalab, Stink Studios, Your Majesty. Мы не набираем generalist-ов под проект. Когда вы работаете с нами, вы работаете с людьми, которые уже делали эту роль — не с младшими account-ами.

**Плюс новое — «мы не растём численностью».**
AI-native архитектура позволяет нам оставаться малой командой и брать объём, который исторически требовал тридцати человек. Это и экономика клиента, и гарантия качества — в проекте участвуют именно те, чьи имена на сайте.

**Team blocks, как сейчас.** Yegor, Anna. Artem и Siraj — когда подъедут фото.

**Зачем.** На рынке «мы маленькая команда» обычно читается как минус. Новая копия переворачивает: это архитектурный выбор, а не ограничение.

---

## Экран 9 — Copilot or autopilot? (honest open question)

**Роль.** Зафиксировать публично, что BSO находится в открытой развилке бизнес-модели, и что приглашает разговор.

**H2.**
Вы хотите инструмент у себя — или чтобы мы просто делали?

**Копия — идея.**
Есть два способа работать с AI-native agency. **Copilot** — вы ставите систему у себя. Ваши люди принимают решения, AI делает intelligence-работу. BSO проектирует и передаёт. **Autopilot** — BSO делает полностью. Вы получаете deliverable, не инфраструктуру.

Мы пока не знаем, в какой из этих двух моделей мы сильнее. Разные слои сервиса тянут в разные стороны: Strategy почти всегда copilot (эту работу никто не покупает полностью outsourced), Creative Execution ложится в autopilot почти естественно, Tactics — hybrid.

Если вам ближе один из сценариев — приходите. Форма вашего запроса поможет и нам: мы публично фиксируем эту развилку, чтобы решать её рынком, а не в кабинете.

**CTA.** Тот же «Book a call», но акцент на «tell us which model you need».

**Зачем.** Большинство агентств претендуют на полную определённость, когда её нет. Честное признание развилки — это position of strength, не слабость. И это прямой probe из Content Marketing BRIEF §8.

---

## Экран 10 — Final CTA

**Роль.** Точка выхода.

**H2.** Ready to build your flywheel? (сохраняем существующую).

**Копия.**
Если бренд и стратегия в вашей компании были финишным слоем — приложенным после того, как решения уже приняты — давайте поменяем это. Мы встроим работу в то, как вы принимаете решения.

**Button.** Start a conversation → Cal.com.

---

## Предлагаемое изменение навигации

Новый top nav (сейчас — только logo + email):

- Logo → home
- Work — anchor к Portfolio, экран 7
- Methodology — anchor к экранам 2–6 или новая страница `/methodology`
- Writing — external → Substack
- Contact — email + Book a call

Это даёт repeat-посетителям возможность прыгнуть сразу на нужное место, не скроллить всю нарратив-арку. Для первого визита скролл всё равно рекомендован.

---

## Что выпадает из старой версии

- **Brand diagram (Venn «Brand ↔ Experience»)** — убираем. Концепт устарел, заменяется Intelligence/Judgement split.
- **5 metrics grid («Decision speed / CAC reduction / NRR / Category ownership / Compounding advantage»)** — убираем. Это academic proof points, которые никто не считает своими; они не конвертят. Если захочется сохранить бизнес-кейс-язык — вынесем в отдельную страницу `/research`.
- **Manifesto «Not just decision-making. But decision making, too.»** — убираем как отдельную секцию. Тезис разворачивается в экранах 2–3 яснее.
- **What we make (список сервисов)** — заменяется на Three-layer service (экран 4). Старый список хорош, но не структурирован по стратегической логике.
- **Four phases (Frame / Build / Operationalize / Transfer)** — заменяется на Three-phase (Magician / Teacher / Transfer).

---

## Non-goals этого прохода

- Не финальная копия. Writing tone passes делаем после того, как структура залочена.
- Не визуал. Layout, typography, backdrop images — отдельный проход, на основе утверждённой IA.
- Не маппинг на Figma DS. `backspace-oddity-design-system` проект это подхватит позже, когда копия окажется в `src/index.html`.

---

## Три вопроса для ревью

1. **Экран 2 (contrarian thesis unpacked) — не слишком ли агрессивно?** Мы прямо говорим «то, что называют strategy, — тактика». Это отталкивающий тезис для людей, которые искренне делали что-то под названием «GTM strategy» три года. Риск — потерять аудиторию на втором скролле. Смягчать или это именно фильтр, который мы хотим?

2. **Экран 9 (copilot/autopilot) — оставлять на сайте?** Это прозрачность, которая может выглядеть как «мы сами не знаем, что продаём». Альтернатива — собирать signal приватно через inbound-письма и sales-звонки, а на сайте показывать уже lock-ed ответ.

3. **Экран 6 (methodology as sales) — не слишком ли meta?** Сайт объясняет, почему в блоге всё открыто. Может быть, это в FAQ или на странице `/writing`, а не на main?

Жду фидбека экран за экраном.
