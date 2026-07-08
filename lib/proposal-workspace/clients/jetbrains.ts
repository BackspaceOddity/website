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
  lockFormLabel: 'Записать решение',
  lockAnswerPlaceholder: 'Ваш ответ…',
  lockBtnLabel: 'Зафиксировать',
  lockedBadge: 'Зафиксировано',
  locking: 'Фиксируем…',
  lockFail: 'Ошибка — попробуйте ещё раз',
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
.mhdr-title{font-family:var(--display);font-size:var(--fs-mhdr-title,clamp(26px,3.5vw,42px));font-weight:700;letter-spacing:-1px;line-height:1.15;margin:0 0 32px}
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
.agnd-q[contenteditable="true"],.agnd-note[contenteditable="true"]{outline:1px dashed var(--rule-strong);outline-offset:3px;border-radius:3px}
.agnd-hint{font-family:var(--mono);font-size:10px;color:var(--ink-40);margin-top:16px}
.agnd-addrow{display:flex;gap:10px;margin-top:14px}
.agnd-inp{flex:1;border:1px solid var(--rule-strong);border-radius:6px;padding:9px 12px;font-family:var(--text);font-size:14px;background:var(--surface);color:var(--ink);outline:none}
.agnd-btn{background:transparent;border:1px solid var(--rule-strong);border-radius:6px;padding:9px 16px;font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);cursor:pointer}
.agnd-foot{display:flex;align-items:center;gap:14px;margin-top:18px}
.agnd-save{background:var(--ink);color:var(--paper);border:none;border-radius:7px;padding:11px 20px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
.agnd-save:disabled{opacity:.4;cursor:default}
.agnd-status{font-family:var(--mono);font-size:11px;color:var(--ink-40)}
</style>
<div class="agnd" id="agnd">
  <div class="agnd-ttl">Повестка</div>
  <p class="agnd-goal">Желаемый результат: выйти с согласованным приоритетом — одна работа, конкретный следующий шаг.</p>
  <div id="agnd-list"></div>
  <div class="agnd-addrow"><input class="agnd-inp" id="agnd-inp" placeholder="Добавить пункт повестки…"><button class="agnd-btn" id="agnd-add">Добавить</button></div>
  <div class="agnd-hint">Двойной клик по пункту — отредактировать текст</div>
  <div class="agnd-foot"><button class="agnd-save" id="agnd-save" disabled>Сохранить повестку</button><span class="agnd-status" id="agnd-status"></span></div>
</div>
<script>
(function(){
  var DEFAULT=[
    {q:'Какие работы маркетинговой команды наиболее недообслужены?',note:'Упражнение: расставить работы на матрице важность × насколько закрыто',dec:false},
    {q:'Когда фоновая потребность превращается в срочную?',note:'Упражнение: описать конкретный момент для каждой работы',dec:false},
    {q:'Где болит конкретнее всего внутри каждой работы?',note:'Упражнение: проранжировать проблемы по болезненности',dec:false},
    {q:'Что уже пробовали — и почему это не закрывает задачу полностью?',note:'Упражнение: зафиксировать обходные пути по каждой работе',dec:false},
    {q:'Какую работу берём в работу первой?',note:'',dec:true},
    {q:'Как выглядит «это работает» через три месяца?',note:'',dec:true}
  ];
  var KEY='ws:jetbrains:agenda';
  var list=document.getElementById('agnd-list'),inp=document.getElementById('agnd-inp'),
      addBtn=document.getElementById('agnd-add'),saveBtn=document.getElementById('agnd-save'),
      statusEl=document.getElementById('agnd-status');
  var items=DEFAULT;
  try{ var s=JSON.parse(localStorage.getItem(KEY)||'null'); if(s&&s.length) items=s; }catch(_){}
  function render(){
    list.innerHTML='';
    items.forEach(function(it,i){
      var row=document.createElement('div'); row.className='agnd-item'+(it.dec?' dec':''); row.setAttribute('data-i',i);
      var n=document.createElement('span'); n.className='agnd-n'; n.textContent=String(i+1);
      var body=document.createElement('div');
      var q=document.createElement('div'); q.className='agnd-q'; q.textContent=it.q;
      body.appendChild(q);
      if(it.note){ var nt=document.createElement('div'); nt.className='agnd-note'; nt.textContent=it.note; body.appendChild(nt); }
      row.appendChild(n); row.appendChild(body); list.appendChild(row);
    });
  }
  function persist(){ try{ localStorage.setItem(KEY,JSON.stringify(items)); }catch(_){} saveBtn.disabled=false; }
  render();
  list.addEventListener('dblclick',function(e){
    var el=e.target.closest('.agnd-q,.agnd-note'); if(!el) return;
    el.contentEditable='true'; el.focus();
    var r=document.createRange(); r.selectNodeContents(el); r.collapse(false);
    var sel=window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  });
  list.addEventListener('blur',function(e){
    var el=e.target; if(!el.isContentEditable) return;
    el.contentEditable='false';
    var i=+el.closest('.agnd-item').getAttribute('data-i');
    if(el.classList.contains('agnd-q')) items[i].q=el.textContent.trim();
    else items[i].note=el.textContent.trim();
    persist();
  },true);
  list.addEventListener('keydown',function(e){ if(e.key==='Enter'&&e.target.isContentEditable){ e.preventDefault(); e.target.blur(); } });
  function addItem(){ var v=inp.value.trim(); if(!v) return; items.push({q:v,note:'',dec:false}); inp.value=''; render(); persist(); }
  addBtn.addEventListener('click',addItem);
  inp.addEventListener('keydown',function(e){ if(e.key==='Enter') addItem(); });
  saveBtn.addEventListener('click',function(){
    saveBtn.disabled=true; statusEl.textContent='сохраняю…';
    fetch('/w/jetbrains/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'agenda',payload:{items:items}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?'✓ Сохранено':'Не удалось сохранить'; saveBtn.disabled=!!j.ok; })
      .catch(function(){ statusEl.textContent='Не удалось сохранить — проверьте соединение'; saveBtn.disabled=false; });
  });
})();
</script>`,
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
        'Ключевой вопрос — <strong>что маркетинг реально произвёл на потраченные деньги?</strong> Прямая атрибуция к продажам нереализуема: решения о покупке принимают одни люди, пользуются продуктом — другие. Реалистичный и ближайший к деньгам ответ — <strong>измерение brand lift</strong>: изменение восприятия на уровне кампании. Сейчас этого нет системно ни у кого.',
        'B2B-направление (IT decision-makers) — новый приоритет этого года. Панели и инструментов для работы с этой аудиторией пока нет.',
        'Эта сессия — о том, чтобы договориться, какой кусок решать первым.',
      ],
      confirm: {
        exerciseId: 'problem-statement',
        confirmLabel: 'Подтверждаем',
        altLabel: 'Другой вариант',
        editHint: 'Двойной клик по любому абзацу — отредактировать формулировку, затем «Подтверждаем»',
        savedMsg: '✓ Зафиксировано',
      },
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
          'Платная реклама — в BigQuery и Looker (команда Digital Marketing собирает вручную под каждую кампанию). Органика и инфлюенсеры — в Sprout и Excel. Тикеты и итоги — в uTrack и Google Drive. Соглашения по именованию работают непоследовательно. Сравнивать данные из этих источников сейчас невозможно — «тёплое с мягким».',
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

    {
      block: 'discussion',
      sectionNum: '02а — Метрики',
      heading: 'Какие метрики утверждаем точкой отсчёта?',
      intro:
        'Набросали стартовый список — сгруппирован по трём уровням. Снимите галочки с того, что не актуально, добавьте своё. Итог фиксируем как baseline для всей последующей работы.',
      questions: [
        {
          q: '<span style="display:block;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.25rem">АУДИТОРНЫЕ</span>MAU по продукту — уникальные активные пользователи в месяц',
        },
        { q: 'Охват по сегменту: разработчики / студенты / команды' },
        { q: 'Brand recall в целевых сегментах (опросы, brand lift)' },
        { q: 'Время вовлечения с контентом — engagement rate по формату' },
        {
          q: '<span style="display:block;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.25rem;margin-top:.5rem">МАРКЕТИНГОВЫЕ</span>CPL / CPA — стоимость лида и действия по каналу и типу кампании',
        },
        { q: 'CTR по формату (видео, баннер, editorial, спонсорство)' },
        {
          q: 'Trial downloads с атрибуцией к кампании',
          note: 'Требует сквозной UTM-разметки и сведения данных из магазинов',
        },
        { q: 'Share of voice в DevEx / Developer Tools пространстве' },
        {
          q: '<span style="display:block;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.25rem;margin-top:.5rem">БИЗНЕСОВЫЕ (ДЕНЕЖНЫЕ)</span>Revenue attributed — выручка, прямо связанная с кампанией',
          note: 'Ключевой вопрос сессии — именно здесь сегодня нет ответа',
        },
        { q: 'Trial → Paid конверсия в разбивке по источнику привлечения' },
        { q: 'LTV когорт, привлечённых через маркетинговые кампании' },
        { q: 'Marketing ROI = attributed revenue / marketing spend по продукту' },
      ],
      addLabel: 'Добавить свою метрику',
      ui: {
        save: 'Зафиксировать',
        saving: 'Сохраняем…',
        saved: '✓ Зафиксировано',
        saveFail: 'Ошибка сохранения',
        saveFailNet: 'Ошибка соединения',
        addQuestion: 'Добавить',
        questionPlaceholder: 'Ваша метрика…',
        savedLocal: '✓ Сохранено локально',
        lockFormLabel: 'Записать решение',
        lockAnswerPlaceholder: 'Ваш ответ…',
        lockBtnLabel: 'Зафиксировать',
        lockedBadge: 'Зафиксировано',
        locking: 'Фиксируем…',
        lockFail: 'Ошибка — попробуйте ещё раз',
      },
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
        { id: 'budget', label: 'Решать, куда направить бюджет на digital-marketing' },
        { id: 'automate', label: 'Автоматизированная подготовка результатов' },
        { id: 'compare', label: 'Сравнивать кампании по одной системе показателей / бенчмаркинг' },
        { id: 'past-results', label: 'Учитывать результаты прошедшей кампании для планирования следующих' },
        { id: 'channel', label: 'Эффективно ли сработала канальная стратегия' },
        { id: 'lpr', label: 'Узнавать мнение ЛПР в корпорациях' },
        { id: 'perception', label: 'Измерять, насколько кампания повлияла на восприятия людей' },
        { id: 'infra', label: 'Создать инфраструктуру для сбора, хранения, структуризации и аналитики данных' },
        { id: 'value', label: 'Доказать ценность маркетинга руководству' },
        { id: 'produced', label: 'Знать, что кампания на самом деле принесла' },
        { id: 'brief', label: 'Брифовать следующую кампанию умнее' },
        { id: 'brand-lift', label: 'Мерить brand lift на уровне кампании, а не только внутри канала' },
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

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '09 — Итоги сессии',
      heading: 'О чём договорились',
      body: [
        'Первый этап — не про brand lift и не про сравнение кампаний. Это про фундамент, без которого всё остальное невозможно.',
      ],
      bullets: [
        '<strong>Единое хранилище данных</strong> — унифицированное структурированное хранение из BigQuery, Looker, Sprout, uTrack и остальных источников',
        '<strong>Процессы сбора данных</strong> — устранение ручного труда, стандартизация отчётности с командами и агентствами',
        '<strong>Визуализация и доступ</strong> — интерфейс для работы с данными и формирования инсайтов, доступный разным ролям',
      ],
      bulletStyle: 'disc',
      example:
        'Brand lift и сравнение кампаний — задачи второго этапа. Сначала строим базу.',
    },

    {
      block: 'nextSteps',
      sectionNum: '10 — Что дальше',
      heading: 'Следующие шаги',
      intro: 'Договорились на встрече:',
      steps: [
        {
          title: 'Backspace Oddity готовит черновик roadmap',
          desc: 'Документ с описанием этапов, скопа и ожидаемых результатов — для обсуждения с Никитой и Юлей перед широкой презентацией.',
        },
        {
          title: 'Никита и Юля дают фидбэк по черновику',
          desc: 'До встречи со стейкхолдерами — внутренний раунд обратной связи от ключевых людей на стороне JetBrains.',
        },
        {
          title: 'Встреча с ключевыми стейкхолдерами',
          desc: 'Никита организует в течение ~2 недель. Backspace Oddity участвует в презентации roadmap совместно.',
        },
        {
          title: 'Разговор с Technical Marketing (Digital)',
          desc: 'Для понимания текущей инфраструктуры и пайплайнов — нужен перед проектированием хранилища.',
        },
      ],
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
