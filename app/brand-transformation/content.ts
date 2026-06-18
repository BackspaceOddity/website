// Bilingual copy for /brand-transformation. EN mirrors the original page; RU from
// Notion "🪄 Бренд-трансформация". Rendered via content[lang] in the client component.

export type Lang = "en" | "ru";

type Principle = { title: string; text: string };
type Entry = { num: string; name: string; text: string };
type Lever = { metric: string; name: string; text: string };
type Project = { title: string; desc: string; href: string; img: string; alt: string };
type Row = { name: string; weeks: string; tag?: string };
type Phase = {
  kicker: string;
  name: string;
  meta: string;
  optional?: string;
  summary: string;
  modules: string[];
  subhead?: string;
  subModules?: string[];
  callout?: { title: string; text: string };
};

export type Content = {
  nav: { contact: string; office: string[]; book: string };
  hero: { eyebrow: string; title: string; principles: Principle[]; cta: string };
  when: { eyebrow: string; h2: string; intro: string; entries: Entry[] };
  why: { eyebrow: string; h2: string; intro: string; levers: Lever[] };
  experience: { eyebrow: string; h2: string; intro: string; projects: Project[] };
  diagnostic: { eyebrow: string; h2: string; intro: string };
  timeline: {
    eyebrow: string; h2: string; intro: string;
    rows: Row[]; total: string; totalNote: string; optionalLabel: string;
  };
  phases: Phase[];
  final: { h2: string; copy: string; cta: string };
  footer: { thisPage: string; links: { label: string; href: string }[]; reach: string; city: string };
};

export const content: Record<Lang, Content> = {
  en: {
    nav: { contact: "Contact", office: ["Vijzelstraat 68-78", "1017 ES Amsterdam"], book: "Book a call" },
    hero: {
      eyebrow: "Brand transformation & rebrand",
      title: "Did you know your brand might be your most under-used growth lever?",
      principles: [
        { title: "Strategy ↔ execution, end-to-end", text: "You get strategy, brand, content, website, and launch as one continuous process — not five contractors to coordinate." },
        { title: "Brand is a means, not the goal", text: "Your brand becomes a tool for a durable business strategy, not an end in itself — you walk away with results, not a rebrand for its own sake." },
        { title: "AI-native", text: "You inherit a working system, not a folder of files: a Figma ↔ code design system, your Messaging House in Notion, plus our agents and assets you keep using." },
      ],
      cta: "Book a call",
    },
    when: {
      eyebrow: "When a rebrand earns its place",
      h2: "When you need this",
      intro: "We work modularly. After a short diagnostic we assemble a proposal for your specific task — from a positioning refresh to a full rebrand with renaming.",
      entries: [
        { num: "01", name: "Moving up-market", text: "SMB → Enterprise — signal the market that you're no longer a startup." },
        { num: "02", name: "A market full of lookalikes", text: "Competitors say and look the same — you need to explain how you're different." },
        { num: "03", name: "Raising investment", text: "Package the company so investors want in." },
        { num: "04", name: "Category shift", text: "M&A, a new business model, a shifted product-market fit, or launching a product in a new category." },
        { num: "05", name: "Entering new markets", text: "New countries and audiences — the brand has to speak their language." },
      ],
    },
    why: {
      eyebrow: "Why a brand matters",
      h2: "Brand is one of the last unfair advantages",
      intro: "Building a product has never been easier — so the moats that came with it are mostly gone. Features, distribution, even pricing get copied within a quarter. Brand is one of the few advantages a competitor can't clone — and it compounds into a growth flywheel: four levers that feed each other.",
      levers: [
        { metric: "Lower CAC", name: "Acquisition", text: "Buyers pick the brand they already know — so you pay less to win them." },
        { metric: "Higher LTV", name: "Retention", text: "People stay with a brand they love — churn drops, lifetime value climbs." },
        { metric: "Pricing power", name: "Monetization", text: "A strong brand commands a premium on the same product." },
        { metric: "Organic growth", name: "Referral", text: "A loved brand gets recommended — reach you don't pay for." },
      ],
    },
    experience: {
      eyebrow: "Our experience",
      h2: "Brands we've transformed",
      intro: "Three very different projects — each closing a different part of the same offering. Together they map the full arc we run end-to-end: strategy, identity, system, and launch.",
      projects: [
        { title: "RealtimeBoard → Miro", href: "https://miro.com/", img: "/images/projects/miro.webp", alt: "RealtimeBoard → Miro rebrand", desc: "A full rebrand and brand architecture for the move from RealtimeBoard to Miro — a new name, identity, and platform story that scaled into a category leader on the way to a $17.5B valuation." },
        { title: "Stape → Kleos", href: "https://kleos.io/", img: "/images/projects/kleos.webp", alt: "Stape → Kleos rebrand", desc: "Renaming, repositioning, and a new identity for Stape's move into a new category as Kleos — strategy and brand system built to carry the shift." },
        { title: "Sidekick (acq. Perplexity)", href: "https://www.theinformation.com/briefings/perplexity-buys-browser-startup-sidekick", img: "/images/projects/sidekick.webp", alt: "Sidekick browser, acquired by Perplexity", desc: "Brand and positioning for Sidekick, the productivity browser — sharp enough to make the product an acquisition target, later bought by Perplexity." },
      ],
    },
    diagnostic: {
      eyebrow: "Free brand diagnostic",
      h2: "Want to find out how much of your brand's potential you're using?",
      intro: "Answer a few questions and we'll send you a short brand diagnostic — the job you're really hired for, who you actually compete with, your biggest opening, and an under-used angle. By email, takes a minute.",
    },
    timeline: {
      eyebrow: "Phases & timeline",
      h2: "The phases, assembled to fit",
      intro: "Core phases run every project; optional phases switch on when the scope calls for them.",
      optionalLabel: "optional",
      rows: [
        { name: "1. Project setup", weeks: "<b>1</b> week" },
        { name: "2. Brand strategy & platform", weeks: "<b>4</b> weeks" },
        { name: "3. Brand system", weeks: "<b>3</b> weeks" },
        { name: "+ Naming / renaming", weeks: "<b>2</b> weeks", tag: "optional" },
        { name: "4. Production", weeks: "<b>4</b> weeks" },
        { name: "5. Migration & launch", weeks: "<b>2–3</b> weeks", tag: "optional" },
        { name: "6. Live system", weeks: "<b>2</b> weeks", tag: "optional" },
      ],
      total: "Total: <b>≈ 16–18 weeks.</b>",
      totalNote: "Each phase ends in a client sign-off; further changes require a scope extension.",
    },
    phases: [
      {
        kicker: "Phase 1", name: "Project setup", meta: "1 week",
        summary: "We spin up a client workspace and gather all your raw material in one place.",
        modules: [
          "Client workspace in Notion — sprints, tasks, projects, knowledge base, call recordings — plus an inventory of your data sources: analytics, calls, research, documents.",
          "Slack for async work, Miro for workshops.",
          "Goals, success criteria, and interview plan agreed up front.",
          "BSO work rhythm: weekly sprints — Mon planning · daily async · Fri retro + client sync.",
        ],
      },
      {
        kicker: "Phase 2", name: "Brand strategy & platform", meta: "4 weeks",
        summary: "We understand the business, market, and customers — and develop positioning rooted in real customers' data and insights.",
        modules: [
          "Immersion in your raw material — calls, analytics, research — topped up via interviews with founders and team.",
          "Product & market audit + competitive analysis and white space.",
          "Brand platform workshop: 10-year plan, Why / How / What.",
          "Values, mission & vision workshop.",
          "Audiences workshop: key segments via JTBD.",
          "Brand personality workshop: character, attributes, tone.",
          "ICP profiles from interviews or call analysis: JTBD, triggers, barriers, buying journey.",
          "Positioning — the project's key fork: territories → choosing a direction → Positioning Canvas + PMF narrative.",
          "Messaging foundation: Category Entry Points per segment.",
          "AI-native delivery: strategy and positioning land as living context your agents can work from — not just a PDF deck.",
        ],
      },
      {
        kicker: "Phase 3", name: "Brand system", meta: "3 weeks (+2 naming)",
        summary: "We turn strategy into a brand — verbal and visual.",
        modules: [
          "Messaging House — universal + situational.",
          "Tone of Voice: voice character, principles, the “volume knob” of tone.",
          "Brand identity: logo, typography, palette, graphics.",
          "Design system — tokens + components — and brand guidelines.",
          "Design system in detail: core components (buttons, nav, forms, cards, grids), spacing & layout rules, tokens (color, shadow, radii, typography, states), interaction patterns (hover, focus, transitions), light + optional dark mode, documented in Figma.",
          "AI-native delivery: the design system and Messaging House ship ready for agents — working context your team's AI can build on, not files someone has to re-interpret.",
        ],
        subhead: "Naming / renaming · +2 weeks · optional",
        subModules: [
          "If the name can't carry the new strategy.",
          "Brief and agreed naming criteria.",
          "Name generation + trademark check.",
          "Final name, rationale, domains.",
        ],
      },
      {
        kicker: "Phase 4", name: "Production", meta: "4 weeks",
        summary: "We build all the brand's assets.",
        modules: [
          "Creative assets across multiple channels: website, email, ads, social, support, hiring — depending on the product.",
          "Website: prototype → design → build, on the platform that fits your needs.",
          "Page templates: homepage, use-case templates, acquisition LPs, company info pages, blog index + article — plus reusable components (hero, features, pricing, CTAs, forms, FAQ).",
          "Build: project setup (nav, footer, global styles), assembly, responsive behaviors, animations, CMS for blog, final QA.",
          "Asset production for dev: finalized & documented Figma files, logo & identity package, exported web assets (SVGs, optimized images), component & template docs.",
          "Sales enablement: decks, scripts, objection handling.",
          "Marketing & brand assets: social kit, ad creatives, templates.",
          "AI-native delivery: templates and assets handed over in a format your agents can pick up and run with — not a static folder to wire up by hand.",
        ],
      },
      {
        kicker: "Phase 5", name: "Migration & launch", meta: "2–3 weeks", optional: "optional",
        summary: "We switch the world over to the new brand without losing customers. Needed for any launch — not only when renaming.",
        modules: [
          "Customer comms and trust preservation: announcements, FAQ, contracts.",
          "Internal brand adoption: onboarding decks, team checklists, internal presentations.",
          "Launch orchestration: readiness → release runbook → final check.",
          "Rollout across hundreds of touchpoints — every asset, channel, integration, and account. The most underestimated part of a rebrand: reaching launch isn't enough — you have to run the whole todo-list and hit the date exactly.",
          "AI-native delivery: the launch runbook, comms, and assets are handed over agent-ready — your team and its agents can run the rollout, not just read it.",
        ],
        callout: {
          title: "Technical migration — on your side",
          text: "Domains, SSO, redirects, and the product rebrand itself are handled by your engineering team. We coordinate the launch and dependencies.",
        },
      },
      {
        kicker: "Phase 6", name: "Live system", meta: "2 weeks", optional: "optional",
        summary: "We don't just hand the brand over — we turn the project into a living system your team keeps working in. The goal is the lowest-friction switch possible: you wake up in the new brand and keep moving, instead of rolling it out for months.",
        modules: [
          "First-week monitoring: traffic, conversion, churn.",
          "Long tail: finishing the brand across every corner of the product.",
          "Rebrand success metrics.",
          "A Figma design system connected to code (Figma ↔ CC) — designers work in a ready system right away.",
          "Messaging House, brand guidelines, and assets live in your Notion and update via agents.",
          "Everything connected into one system: strategy → tactics → creative execution.",
          "Access to our agents and assets by subscription; marketing & GTM automations on request, as a separate scope.",
        ],
      },
    ],
    final: {
      h2: "A quantum leap for your business (seriously)",
      copy: "Built end-to-end, strategy to launch — and kept as a living system your team keeps working with on its own, not a project that ends.",
      cta: "Book a call",
    },
    footer: {
      thisPage: "This page",
      links: [
        { label: "Brand diagnostic", href: "#proposal" },
        { label: "Why a brand matters", href: "#why" },
        { label: "Contact", href: "#contact" },
      ],
      reach: "Reach us",
      city: "Amsterdam",
    },
  },

  ru: {
    nav: { contact: "Контакт", office: ["Vijzelstraat 68-78", "1017 ES Amsterdam"], book: "Записаться на звонок" },
    hero: {
      eyebrow: "Бренд-трансформация и ребрендинг",
      title: "А знаете ли вы, что бренд — возможно, ваш самый недоиспользованный рычаг роста?",
      principles: [
        { title: "Связка стратегии и исполнения, end-to-end", text: "Вы получаете стратегию, бренд, контент, сайт и запуск как один сквозной процесс — а не пять подрядчиков, которых надо координировать." },
        { title: "Бренд — средство, а не цель", text: "Ваш бренд становится инструментом устойчивой бизнес-стратегии, а не самоцелью — вы уходите с результатом, а не с ребрендом ради ребренда." },
        { title: "AI-native", text: "Вы наследуете рабочую систему, а не папку файлов: дизайн-система Figma ↔ код, ваш Messaging House в Notion, плюс наши агенты и наработки, которыми вы продолжаете пользоваться." },
      ],
      cta: "Записаться на звонок",
    },
    when: {
      eyebrow: "Когда ребрендинг оправдан",
      h2: "Когда это нужно",
      intro: "Работаем модульно. После короткой диагностики собираем предложение под вашу задачу — от обновления позиционирования до полного ребрендинга с переименованием.",
      entries: [
        { num: "01", name: "Переходите в новый сегмент", text: "Из SMB в Enterprise — показать рынку, что вы уже не стартап." },
        { num: "02", name: "Рынок переполнен похожими", text: "Конкуренты говорят и выглядят одинаково — нужно объяснить, чем вы отличаетесь." },
        { num: "03", name: "Привлекаете инвестиции", text: "Упаковать компанию так, чтобы в неё захотелось вложиться." },
        { num: "04", name: "Сменили категорию", text: "M&A, новая бизнес-модель, сместился product-market fit или запуск продукта в новой категории." },
        { num: "05", name: "Выходите на новые рынки", text: "Другие страны и аудитории — бренд должен говорить на их языке." },
      ],
    },
    why: {
      eyebrow: "Зачем нужен бренд",
      h2: "Бренд — одно из последних конкурентных преимуществ",
      intro: "Создавать продукт стало как никогда легко — и рвы, которые с этим приходили, почти исчезли. Фичи, дистрибуцию и даже цену копируют за квартал. Бренд — одно из немногих преимуществ, которое конкурент не скопирует, и оно складывается в growth flywheel: четыре рычага, которые усиливают друг друга.",
      levers: [
        { metric: "Lower CAC", name: "Acquisition", text: "Покупатели выбирают уже знакомый бренд — вы платите меньше за их привлечение." },
        { metric: "Higher LTV", name: "Retention", text: "С любимым брендом остаются дольше — отток падает, LTV растёт." },
        { metric: "Pricing power", name: "Monetization", text: "Сильный бренд берёт премию за тот же продукт." },
        { metric: "Organic growth", name: "Referral", text: "Любимый бренд рекомендуют — охват, за который вы не платите." },
      ],
    },
    experience: {
      eyebrow: "Наш опыт",
      h2: "Бренды, которые мы трансформировали",
      intro: "Три очень разных проекта — каждый закрывает свою часть одного и того же предложения. Вместе они складываются в полную дугу, которую мы ведём end-to-end: стратегия, айдентика, система и запуск.",
      projects: [
        { title: "RealtimeBoard → Miro", href: "https://miro.com/", img: "/images/projects/miro.webp", alt: "RealtimeBoard → Miro rebrand", desc: "Полный ребрендинг и бренд-архитектура для перехода RealtimeBoard → Miro — новое имя, айдентика и платформенный нарратив, которые выросли в лидера категории на пути к оценке $17.5B." },
        { title: "Stape → Kleos", href: "https://kleos.io/", img: "/images/projects/kleos.webp", alt: "Stape → Kleos rebrand", desc: "Переименование, репозиционирование и новая айдентика для перехода Stape в новую категорию как Kleos — стратегия и бренд-система, собранные под этот сдвиг." },
        { title: "Sidekick (acq. Perplexity)", href: "https://www.theinformation.com/briefings/perplexity-buys-browser-startup-sidekick", img: "/images/projects/sidekick.webp", alt: "Sidekick browser, acquired by Perplexity", desc: "Бренд и позиционирование для Sidekick, браузера для продуктивности — достаточно сильные, чтобы сделать продукт целью поглощения; позже куплен Perplexity." },
      ],
    },
    diagnostic: {
      eyebrow: "Бесплатная бренд-диагностика",
      h2: "Хотите узнать, насколько вы используете потенциал своего бренда?",
      intro: "Ответьте на несколько вопросов — и мы пришлём короткую бренд-диагностику: за какую работу вас на самом деле нанимают, с кем вы реально конкурируете, ваш самый большой разрыв возможности и недоиспользованный угол. На почту, за минуту.",
    },
    timeline: {
      eyebrow: "Этапы и сроки",
      h2: "Этапы, собранные под задачу",
      intro: "Базовые фазы идут в каждом проекте; опциональные включаются, когда того требует объём.",
      optionalLabel: "опционально",
      rows: [
        { name: "1. Старт проекта", weeks: "<b>1</b> неделя" },
        { name: "2. Бренд-стратегия и платформа", weeks: "<b>4</b> недели" },
        { name: "3. Бренд-система", weeks: "<b>3</b> недели" },
        { name: "+ Нейминг / переименование", weeks: "<b>2</b> недели", tag: "опционально" },
        { name: "4. Производство", weeks: "<b>4</b> недели" },
        { name: "5. Миграция и запуск", weeks: "<b>2–3</b> недели", tag: "опционально" },
        { name: "6. Живая система", weeks: "<b>2</b> недели", tag: "опционально" },
      ],
      total: "Итого: <b>≈ 16–18 недель.</b>",
      totalNote: "Каждая фаза заканчивается приёмкой; дальнейшие изменения — через расширение скоупа.",
    },
    phases: [
      {
        kicker: "Фаза 1", name: "Старт проекта", meta: "1 неделя",
        summary: "Разворачиваем клиентский воркспейс и собираем всё ваше сырьё в одном месте.",
        modules: [
          "Клиентский воркспейс в Notion — спринты, задачи, проекты, база знаний, записи звонков — плюс инвентаризация источников данных: аналитика, звонки, исследования, документы.",
          "Slack для асинхронной работы, Miro — для воркшопов.",
          "Цели, критерии успеха и план интервью согласованы на старте.",
          "Рабочий ритм BSO: недельные спринты — планирование пн · дейли-асинхрон · ретро пт + синк с клиентом.",
        ],
      },
      {
        kicker: "Фаза 2", name: "Бренд-стратегия и платформа", meta: "4 недели",
        summary: "Понимаем бизнес, рынок и клиентов — и разрабатываем позиционирование, опирающееся на данные и инсайты реальных клиентов.",
        modules: [
          "Погружение в ваше сырьё — звонки, аналитика, исследования — с добором через интервью с фаундерами и командой.",
          "Аудит продукта и рынка + конкурентный анализ и белые пятна.",
          "Воркшоп бренд-платформы: 10-летний план, Why / How / What.",
          "Воркшоп ценностей, миссии и видения.",
          "Воркшоп аудиторий: ключевые сегменты через JTBD.",
          "Воркшоп личности бренда: характер, атрибуты, тон.",
          "ICP-профили из интервью или анализа звонков: JTBD, триггеры, барьеры, путь покупки.",
          "Позиционирование — ключевая развилка проекта: территории → выбор направления → Positioning Canvas + PMF-нарратив.",
          "Фундамент сообщений: Category Entry Points под каждый сегмент.",
          "AI-native delivery: стратегия и позиционирование приходят как живой контекст, с которым работают ваши агенты, — а не просто PDF-дек.",
        ],
      },
      {
        kicker: "Фаза 3", name: "Бренд-система", meta: "3 недели (+2 нейминг)",
        summary: "Превращаем стратегию в бренд — вербальный и визуальный.",
        modules: [
          "Messaging House — универсальный + ситуативный.",
          "Tone of Voice: характер голоса, принципы, «ручка громкости» тона.",
          "Бренд-айдентика: логотип, типографика, палитра, графика.",
          "Дизайн-система — токены + компоненты — и руководство по бренду.",
          "Дизайн-система детально: базовые компоненты (кнопки, навигация, формы, карточки, сетки), правила отступов и раскладки, токены (цвет, тени, радиусы, типографика, состояния), паттерны взаимодействия (hover, focus, переходы), светлая + опционально тёмная тема, документация в Figma.",
          "AI-native delivery: дизайн-система и Messaging House отдаются готовыми для агентов — рабочий контекст, на котором строит AI вашей команды, а не файлы, которые надо переинтерпретировать.",
        ],
        subhead: "Нейминг / переименование · +2 недели · опционально",
        subModules: [
          "Если имя не тянет новую стратегию.",
          "Анкета и согласованные критерии нейминга.",
          "Генерация имён + трейдмарк-проверка.",
          "Финальное имя, обоснование, домены.",
        ],
      },
      {
        kicker: "Фаза 4", name: "Производство", meta: "4 недели",
        summary: "Собираем все ассеты бренда.",
        modules: [
          "Креативные ассеты под разные каналы: сайт, email, реклама, соцсети, поддержка, найм — зависят от продукта.",
          "Сайт: прототип → дизайн → сборка, на платформе под ваши задачи.",
          "Шаблоны страниц: главная, use-case-шаблоны, acquisition-лендинги, информационные страницы, индекс блога + статья — плюс переиспользуемые компоненты (hero, фичи, прайсинг, CTA, формы, FAQ).",
          "Сборка: настройка проекта (навигация, футер, глобальные стили), вёрстка, адаптив, анимации, CMS для блога, финальный QA.",
          "Подготовка ассетов для разработки: финальные и задокументированные Figma-файлы, пакет лого и айдентики, экспортированные веб-ассеты (SVG, оптимизированные изображения), документация компонентов и шаблонов.",
          "Поддержка продаж: деки, скрипты, работа с возражениями.",
          "Маркетинговые и бренд-ассеты: набор для соцсетей, рекламные макеты, шаблоны.",
          "AI-native delivery: шаблоны и ассеты отдаются в формате, который ваши агенты подхватят и запустят, — а не статичная папка, которую надо собирать руками.",
        ],
      },
      {
        kicker: "Фаза 5", name: "Миграция и запуск", meta: "2–3 недели", optional: "опционально",
        summary: "Переключаем мир на новый бренд без потери клиентов. Нужна при любом запуске — не только при переименовании.",
        modules: [
          "Коммуникации клиентам и сохранение доверия: анонсы, FAQ, договоры.",
          "Внутреннее внедрение бренда: онбординг-деки, чеклисты для команды, внутренние презентации.",
          "Оркестрация запуска: готовность → сценарий релиза → финальная проверка.",
          "Раскатка по сотням точек — каждый артефакт, канал, интеграция и аккаунт. Самая недооценённая часть ребрендинга: дойти до запуска мало — нужно пройти весь todo-лист и попасть точно в срок.",
          "AI-native delivery: раннбук запуска, коммуникации и ассеты отдаются agent-ready — ваша команда и её агенты могут провести раскатку, а не просто прочитать её.",
        ],
        callout: {
          title: "Техническая миграция — на вашей стороне",
          text: "Домены, SSO, редиректы и ребрендинг самого продукта ведёт ваша инженерная команда. Мы координируем запуск и зависимости.",
        },
      },
      {
        kicker: "Фаза 6", name: "Живая система", meta: "2 недели", optional: "опционально",
        summary: "Мы не просто передаём бренд — мы превращаем проект в живую систему, в которой ваша команда продолжает работать. Цель — максимально бесшовный переход: вы просыпаетесь в новом бренде и продолжаете двигаться, а не раскатываете его месяцами.",
        modules: [
          "Мониторинг первой недели: трафик, конверсия, отток.",
          "Длинный хвост: добиваем бренд по всем углам продукта.",
          "Метрики успеха ребрендинга.",
          "Дизайн-система в Figma, связанная с кодом (Figma ↔ CC) — дизайнеры сразу работают в готовой системе.",
          "Messaging House, руководство по бренду и наработки живут в вашем Notion и обновляются агентами.",
          "Всё связано в одну систему: стратегия → тактики → creative execution.",
          "Доступ к нашим агентам и наработкам по подписке; автоматизации маркетинга и GTM — по запросу, отдельным скоупом.",
        ],
      },
    ],
    final: {
      h2: "Квантовый скачок для вашего бизнеса (правда)",
      copy: "Собрано end-to-end, от стратегии до запуска — и сохранено как живая система, с которой ваша команда работает дальше сама, а не проект, который заканчивается.",
      cta: "Записаться на звонок",
    },
    footer: {
      thisPage: "Эта страница",
      links: [
        { label: "Бренд-диагностика", href: "#proposal" },
        { label: "Зачем нужен бренд", href: "#why" },
        { label: "Контакт", href: "#contact" },
      ],
      reach: "Связаться",
      city: "Амстердам",
    },
  },
};
