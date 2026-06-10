/**
 * JetBrains — Campaign Intelligence workshop, Part 1 (discovery). RUSSIAN.
 *
 * Bespoke discovery flow for the live JetBrains marketing-team session.
 * Client-facing copy is Russian (JetBrains' marketing team is Russian-speaking;
 * all project deliverables are RU). English source of record: git history of
 * this file + Deliverables/workshop-part1-structure.md (v3).
 *
 * Built from the existing block primitives — NOT the urembo sequence.
 * Method: cascade-hypotheses — Underserved JTBD → Problems → CEP (the moment,
 * 7-W per the Puma operationalization) → Current solutions → converge → lock.
 *
 * NOTE: exercise-block UI chrome (Save / "X of Y placed" / drag-tray label /
 * add-your-own) is hardcoded EN in blocks.ts — made translatable via optional
 * `ui` props (English defaults) so this page renders fully Russian.
 *
 * STATUS: DRAFT for the live workshop. Ungated locally → /w/jetbrains.
 */

import type { ClientPage, ExerciseUI } from '../types';

/** Russian UI-chrome labels for the interactive blocks (buttons, status,
 *  drag hint, the Underserved zone). One object spread into every exercise +
 *  discussion block; each block reads only the keys it needs. */
const ru: ExerciseUI = {
  save: 'Сохранить',
  saving: 'сохраняю…',
  saved: '✓ Сохранено — спасибо',
  saveFail: 'Не удалось сохранить',
  saveFailNet: 'Не удалось сохранить — проверьте соединение',
  note: '＋ заметка',
  placed: 'размещено {n} из {t}',
  underserved: 'Недообслужено',
  dragHint: 'Перетащите каждую карточку на поле — влево/вправо = важность, вверх/вниз = насколько хорошо закрыто сегодня',
  notePlaceholder: 'По желанию: почему вы поместили её сюда?',
  whyRating: 'Почему такая оценка — ',
  record: '● Запись',
  stop: '■ Стоп',
  voiceSaved: 'голосовая заметка сохранена',
  saveRanking: 'Сохранить порядок',
  egPrefix: ' — напр. ',
  addPlaceholder: 'Добавить своё…',
  addBtn: 'Добавить',
  questionPlaceholder: 'Впишите вопрос, который хотите обсудить…',
  addQuestion: 'Добавить вопрос',
  savedLocal: 'Сохранено на этом устройстве',
  valFormat: 'ВАЖН {imp} · ЗАКР {sat}',
  addSticker: '＋ Добавить стикер',
  newStickerPlaceholder: 'Своя работа…',
  addProblem: '＋ Добавить проблему',
  newProblemPlaceholder: 'Своя проблема…',
};

export const jetbrainsPage: ClientPage = {
  slug: 'jetbrains',
  title: 'Campaign Intelligence — рабочая сессия',
  blocks: [
    {
      block: 'docHeader',
      label: 'Рабочая сессия · Campaign Intelligence',
      meta: 'JetBrains × Backspace Oddity',
      version: 'Рабочая сессия',
      date: 'Июнь 2026',
    },

    {
      block: 'demo',
      heading: '',
      html: `<style>
.mhdr{background:var(--ink);color:var(--paper);padding:36px 40px;border-radius:10px}
.mhdr-eyebrow{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.4;margin-bottom:18px}
.mhdr-title{font-family:var(--display);font-size:clamp(26px,3.5vw,42px);font-weight:700;letter-spacing:-1px;line-height:1.15;margin:0 0 32px}
.mhdr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:20px 40px}
.mhdr-lbl{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.4;margin-bottom:5px}
.mhdr-val{font-family:var(--text);font-size:15px;font-weight:500}
</style>
<div class="mhdr">
  <div class="mhdr-eyebrow">Рабочая сессия · JetBrains × Backspace Oddity</div>
  <div class="mhdr-title">Campaign Intelligence</div>
  <div class="mhdr-grid">
    <div><div class="mhdr-lbl">Дата</div><div class="mhdr-val">10 июня 2026</div></div>
    <div><div class="mhdr-lbl">Участники</div><div class="mhdr-val">Команда маркетинга JetBrains</div></div>
    <div><div class="mhdr-lbl">Фасилитатор</div><div class="mhdr-val">Backspace Oddity</div></div>
    <div><div class="mhdr-lbl">Продолжительность</div><div class="mhdr-val">90 минут</div></div>
  </div>
</div>`,
    },

    {
      block: 'demo',
      heading: '',
      html: `<style>
.agnd{background:var(--surface);border:1px solid var(--rule-strong);padding:32px 40px;border-radius:10px;color:var(--ink)}
.agnd-ttl{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-40);margin-bottom:8px}
.agnd-goal{font-family:var(--text);font-size:15px;color:var(--ink-55);margin:0 0 24px;line-height:1.5}
.agnd-item{display:flex;gap:16px;padding:13px 0;border-top:1px solid var(--rule)}
.agnd-n{font-family:var(--mono);font-size:11px;color:var(--ink-40);min-width:18px;padding-top:3px}
.agnd-q{font-family:var(--text);font-size:16px;font-weight:500;line-height:1.4}
.agnd-note{font-family:var(--text);font-size:13px;color:var(--ink-55);margin-top:3px}
.agnd-item.dec .agnd-n{color:var(--ink)}
.agnd-item.dec .agnd-q::before{content:'Решение · ';font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-55)}
</style>
<div class="agnd">
  <div class="agnd-ttl">Повестка</div>
  <p class="agnd-goal">Желаемый результат: выйти с согласованным приоритетом — одна работа, конкретный следующий шаг.</p>
  <div class="agnd-item"><span class="agnd-n">1</span><div><div class="agnd-q">Какие работы маркетинговой команды наиболее недообслужены?</div><div class="agnd-note">Упражнение: расставить работы на матрице важность × насколько закрыто</div></div></div>
  <div class="agnd-item"><span class="agnd-n">2</span><div><div class="agnd-q">Когда фоновая потребность превращается в срочную?</div><div class="agnd-note">Упражнение: описать конкретный момент для каждой работы</div></div></div>
  <div class="agnd-item"><span class="agnd-n">3</span><div><div class="agnd-q">Где болит конкретнее всего внутри каждой работы?</div><div class="agnd-note">Упражнение: проранжировать проблемы по болезненности</div></div></div>
  <div class="agnd-item"><span class="agnd-n">4</span><div><div class="agnd-q">Что уже пробовали — и почему это не закрывает задачу полностью?</div><div class="agnd-note">Упражнение: зафиксировать обходные пути по каждой работе</div></div></div>
  <div class="agnd-item dec"><span class="agnd-n">5</span><div><div class="agnd-q">Какую работу берём в работу первой?</div></div></div>
  <div class="agnd-item dec"><span class="agnd-n">6</span><div><div class="agnd-q">Как выглядит «это работает» через три месяца?</div></div></div>
</div>`,
    },

    { block: 'divider' },

    {
      block: 'heardIt',
      sectionNum: '01 — Как мы это услышали',
      heading: 'Задача, как мы её поняли',
      statement:
        'Вы просили инструмент, который показывает не только сколько кампания стоила, но и что она принесла. Под этим — более острый вопрос, на который сегодня ничего не отвечает.',
      body: [
        'Вы запускаете 10–15 креативных кампаний в год на 40 продуктов, плюс постоянные каналы — и каждая отчитывается в своём формате.',
        'Ключевой вопрос по этим продуктам и кампаниям — <strong>что наш маркетинг на самом деле произвёл на потраченные деньги?</strong> Сегодня ответа нет — не потому что данных нет, а потому что их никогда не сводили вместе.',
        'Эта сессия — о том, чтобы вместе договориться, какой кусок этого решать первым.',
      ],
    },

    { block: 'divider' },

    {
      block: 'beforeAfter',
      sectionNum: '02 — Суть задачи',
      heading: 'Каждая кампания считает по-своему — и они не сходятся',
      intro:
        'В материалах, что вы прислали, у каждого типа кампании свои метрики. Загрузки, узнаваемость, охват, опросы, время просмотра — каждый отчёт правильный, но они не разговаривают друг с другом.',
      before: {
        label: 'Сегодня',
        core: 'Каждая кампания — отдельный остров',
        body:
          'Пять типов метрик, и ни одна не переводится в другую или в выручку. Когда нужен ответ на вопрос «что маркетинг принёс» — его приходится собирать вручную из разных источников, и каждый раз по-новому.',
      },
      after: {
        label: 'Куда это ведёт',
        core: 'Одна картина, к которой можно обратиться',
        body:
          'Бриф, креатив, канал, результат и выручка связаны — так что «что это принесло» становится вопросом, который реально можно задать и получить ответ, по всем продуктам и типам кампаний.',
      },
      note:
        'Это не промах JetBrains — так бывает, когда число кампаний растёт быстрее, чем система под ними. Это задача про интеграцию, и именно поэтому она решаемая.',
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '03 — Как мы поработаем сегодня',
      heading: 'Как мы будем думать об этом вместе',
      body: [
        'Пройдём пять коротких упражнений: работы, на которые нанимают вашу маркетинговую команду → какие из них недообслужены → что именно ломается → момент, когда возникает потребность → что вы уже пробовали.',
        'Это тот же метод, что мы дали бы вам в руки для кампаний — сегодня направим его на задачу вашей собственной команды. Вы оцениваете, вы выбираете; мы фиксируем это как точку старта.',
      ],
      example:
        'К концу вы сами разместите и проранжируете работу — не мы назначаем объём, а вы его выбираете.',
    },

    { block: 'divider' },

    {
      block: 'exerciseMatrix',
      sectionNum: '04 — Теперь вы',
      heading: 'Что из этого важнее всего — и работает хуже всего?',
      intro:
        'Мы собрали это из наших созвонов и ваших отчётов. Перетащите каждую карточку на поле — насколько это важно против того, насколько хорошо это закрыто сегодня. То, что важнее всего, но идёт болезненно, — точка старта. Нажмите ＋заметку на любой карточке, чтобы пояснить.',
      exerciseId: 'jtbd-matrix',
      ui: ru,
      wide: true,
      hideUnderservedZone: true,
      editable: true,
      axisX: { label: 'Насколько важно для вас', low: 'Не очень', high: 'Критично' },
      axisY: { label: 'Насколько хорошо закрыто сегодня', low: 'Болезненно', high: 'Закрыто' },
      jobs: [
        { id: 'budget', label: 'Решать, куда направить следующий бюджет' },
        { id: 'creative', label: 'Понять, сработал ли креатив' },
        { id: 'value', label: 'Доказать ценность маркетинга руководству' },
        { id: 'produced', label: 'Знать, что кампания на самом деле принесла' },
        { id: 'compare', label: 'Сравнивать кампании по одной мерке' },
        { id: 'brief', label: 'Брифовать следующую кампанию умнее' },
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseSolutions',
      sectionNum: '05 — Момент, когда возникает потребность',
      heading: 'Что превращает фоновое желание в срочное?',
      intro:
        'Для каждой из отмеченных работ — опишите конкретный момент: что происходит вокруг, когда эта потребность становится неотложной? Кто спрашивает, что случилось, какой контекст.',
      exerciseId: 'entry-points',
      ui: ru,
      jobs: [
        { id: 'budget', label: 'Решать, куда направить следующий бюджет', placeholder: 'например: конец квартала и нужно перераспределить, или стейкхолдер запрашивает обоснование…' },
        { id: 'creative', label: 'Понять, сработал ли креатив', placeholder: 'например: запустили дорогой ролик и нужно понять, что он дал…' },
        { id: 'value', label: 'Доказать ценность маркетинга руководству', placeholder: 'например: планирование на следующий год, обоснование бюджета…' },
        { id: 'produced', label: 'Знать, что кампания на самом деле принесла', placeholder: 'например: кампания завершена, хотим ретро, но данные разрозненные…' },
        { id: 'compare', label: 'Сравнивать кампании по одной мерке', placeholder: 'например: нужно выбрать формат для нового запуска и хотим опереться на прошлое…' },
        { id: 'brief', label: 'Брифовать следующую кампанию умнее', placeholder: 'например: начинается планирование, но история предыдущих кампаний нигде не собрана…' },
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseRank',
      sectionNum: '06 — Где именно болит',
      heading: 'Внутри каждой — что ранит сильнее всего?',
      intro:
        'Для работ, что вы отметили недообслуженными, перетащите проблемы так, чтобы самая болезненная была сверху. Списки черновые — доработаем вместе.',
      exerciseId: 'problem-rank',
      ui: ru,
      editable: true,
      groups: [
        {
          jobId: 'budget',
          jobLabel: 'Решение, куда направить бюджет',
          problems: [
            { id: 'budget-reconcile', label: 'Одни и те же загрузки приходят как 7 300 / 6 063 / 2 204 — не сходятся' },
            { id: 'budget-loss', label: '~67% потерь данных в странах с согласием на сбор' },
            { id: 'budget-blind', label: '«Reddit выключаем, daily.dev усиливаем» опирается на цифры, которые мы сами считаем ненадёжными' },
          ],
        },
        {
          jobId: 'creative',
          jobLabel: 'Оценка, сработал ли креатив',
          problems: [
            { id: 'creative-severed', label: 'Креатив оторван от результата — нет связи от идеи до загрузки' },
            { id: 'creative-video', label: 'Ролик с 1,2 млн просмотров нельзя привязать ни к одной установке продукта' },
            { id: 'creative-noattr', label: '«Атрибуцию к загрузкам или использованию построить нельзя»' },
          ],
        },
        {
          jobId: 'value',
          jobLabel: 'Доказательство ценности маркетинга',
          problems: [
            { id: 'value-currencies', label: 'Пять валют, ничто не сводится в одно число' },
            { id: 'value-soft', label: '«Значимого роста нет, но кое-что мы заметили»' },
            { id: 'value-b2b', label: 'Лицензии B2B тянут компании, а не конечные пользователи, до которых мы дотягиваемся' },
          ],
        },
        {
          jobId: 'produced',
          jobLabel: 'Знание, что кампания принесла',
          problems: [
            { id: 'produced-nohome', label: 'Нет единого места, куда ложатся данные' },
            { id: 'produced-silo', label: 'Каждый PMM считает у себя' },
            { id: 'produced-nocompound', label: 'Ретро проводятся, но выводы не накапливаются' },
          ],
        },
      ],
    },

    { block: 'divider' },

    {
      block: 'exerciseSolutions',
      sectionNum: '07 — Что вы делаете сегодня',
      heading: 'Как вы справляетесь с каждой из них сейчас?',
      intro:
        'По каждой работе — какой сейчас обходной путь: инструмент, ручной шаг, то, что уже пробовали (ретро по проектам, тесты на панелях разработчиков, Looker, работа над фреймворком с прошлым агентством). Картина покажет, что стоит решать — и что разрыв не от того, что не пытались.',
      exerciseId: 'current-solutions',
      ui: ru,
      jobs: [
        { id: 'budget', label: 'Решение, куда направить бюджет', placeholder: 'например, атрибуция по каналам в Looker плюс чутьё…' },
        { id: 'creative', label: 'Оценка, сработал ли креатив', placeholder: 'например, ретро, изредка тесты на панелях разработчиков…' },
        { id: 'value', label: 'Доказательство ценности', placeholder: 'например, презентации по кампаниям, панели узнаваемости…' },
        { id: 'produced', label: 'Знание, что кампания принесла', placeholder: 'например, ретро по проектам, ручные выгрузки в таблицы…' },
      ],
    },

    { block: 'divider' },

    {
      block: 'emphasisFrame',
      label: 'Закономерность',
      text:
        'Четыре роли описали четыре разные проблемы. Под ними — одна и та же порванная цепочка: <strong>бриф → креатив → канал → результат → выручка</strong>. Почините это одно соединение — и каждый вопрос выше станет отвечаемым.',
      note: 'Это фундамент. Какую бы работу вы ни поставили выше всех — она ведёт сюда.',
    },

    { block: 'divider' },

    {
      block: 'discussion',
      sectionNum: '08 — С чего начинаем',
      heading: 'Кусок, который фиксируем сегодня',
      intro:
        'Из того, что вы оценили и проранжировали, выбираем один кусок, который строим первым, и фиксируем его здесь. Он записывается в наше общее пространство как то, по чему меряется эта работа — удерживая нас в чётком объёме, а работу — в выбранном.',
      questions: [
        {
          q: 'Из работ на поле — какую берём в работу первой?',
          note: 'Самая важная и хуже всего закрытая — естественный выбор, но решать вам, а не нам.',
        },
        {
          q: 'Как будет выглядеть «это работает» через три месяца?',
          note: 'Чтобы у зафиксированного куска был результат, который мы оба узнаем, когда дойдём.',
        },
      ],
      addLabel: 'Что ещё зафиксировать?',
      ui: ru,
    },

    {
      block: 'statement',
      text:
        'Вот как это одно соединение выглядит уже решённым →',
    },

    {
      block: 'docFooter',
      left: 'Рабочая сессия · Часть 1 из 2',
      right: 'backspaceoddity.com',
    },
  ],
};
