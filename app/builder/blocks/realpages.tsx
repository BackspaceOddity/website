/**
 * Real pages, expressed as editable builder block-lists (BSO-658, Variant A).
 *
 * This is the integration layer: the two real landings (8Figures, brand
 * transformation) become ordered lists of `bt:` blocks that the builder canvas
 * renders with the actual section components from ./bt — so opening a page in
 * the dashboard loads it *inside the editor*, faithful to the original, with the
 * editor's own selection / reorder / delete chrome on each section.
 *
 * Each page declares `css` — the id of the stylesheet to inject while it is open
 * (served by app/builder/css/[id]/route.ts). The two real pages share `bt-`
 * class names but ship different stylesheets, so only one is ever loaded at once.
 */
'use client';

import { content as c } from '../../8figures/content';
import {
  BtNav, BtHero, BtChallenge, BtEps, BtPhasesSection, BtInvest, BtProjects,
  BtFinal, BtFooter, BtLeverages, BtTimeline, BtDiagnostic,
} from './bt';

/* type string -> section component the canvas renders */
export const BT_COMPONENTS = {
  'bt:nav': BtNav,
  'bt:hero': BtHero,
  'bt:challenge': BtChallenge,
  'bt:eps': BtEps,
  'bt:phases': BtPhasesSection,
  'bt:invest': BtInvest,
  'bt:projects': BtProjects,
  'bt:final': BtFinal,
  'bt:footer': BtFooter,
  'bt:leverages': BtLeverages,
  'bt:timeline': BtTimeline,
  'bt:diagnostic': BtDiagnostic,
};

/* human label per bt type, shown on the section's editor tag */
export const BT_TYPE_NAMES = {
  'bt:nav': 'Nav', 'bt:hero': 'Hero', 'bt:challenge': 'Challenge', 'bt:eps': 'Numbered cards',
  'bt:phases': 'Phases', 'bt:invest': 'Investment', 'bt:projects': 'Projects', 'bt:final': 'Final CTA',
  'bt:footer': 'Footer', 'bt:leverages': 'Leverages', 'bt:timeline': 'Timeline', 'bt:diagnostic': 'Diagnostic',
};

const b = (id, type, props) => ({ id, type, props, real: true });

/* ---------- 8Figures — Brand Sprint (mirrors app/8figures/EightFiguresClient.tsx) ---------- */
const P8FIG = [
  b('p8fig-nav', 'bt:nav', { contact: c.nav.contact, book: c.nav.book, office: c.nav.office }),
  b('p8fig-hero', 'bt:hero', { eyebrow: c.hero.eyebrow, title: c.hero.title, subtitle: c.hero.subtitle }),
  b('p8fig-challenge', 'bt:challenge', { h2: c.challenge.h2, you: c.challenge.you, we: c.challenge.we }),
  b('p8fig-approach', 'bt:eps', { id: 'approach', label: "How we'll approach", h2: c.approach.h2, intro: c.approach.intro, points: c.approach.points }),
  b('p8fig-phases', 'bt:phases', { id: 'phases', label: "What we'll do", h2: "What we'll do", intro: `${c.sprint.lead} ${c.sprint.note}`, nutshell: c.sprint.nutshell, phases: c.phases }),
  b('p8fig-invest', 'bt:invest', { h2: c.investment.eyebrow, price: c.investment.price, terms: c.investment.terms, paymentLabel: c.investment.paymentLabel, payment: c.investment.payment }),
  b('p8fig-projects', 'bt:projects', { id: 'experience', label: "What we've done", h2: c.experience.h2, projects: c.experience.projects }),
  b('p8fig-final', 'bt:final', { h2: c.nextStep.eyebrow, copy: c.nextStep.body, cta: c.nextStep.cta }),
  b('p8fig-footer', 'bt:footer', { thisPage: c.footer.thisPage, links: c.footer.links, reach: c.footer.reach, city: c.footer.city, book: c.nav.book }),
];

/* ---------- Brand transformation (mirrors app/brand-transformation/page.tsx) ---------- */
const PBT_PROJECTS = [
  { title: 'RealtimeBoard → Miro', href: 'https://miro.com/', img: '/images/projects/miro.webp', alt: 'RealtimeBoard → Miro rebrand', desc: 'A full rebrand and brand architecture for the move from RealtimeBoard to Miro — a new name, identity, and platform story that scaled into a category leader on the way to a $17.5B valuation.' },
  { title: 'Stape → Kleos', href: 'https://kleos.io/', img: '/images/projects/kleos.webp', alt: 'Stape → Kleos rebrand', desc: 'Renaming, repositioning, and a new identity for Stape’s move into a new category as Kleos — strategy and brand system built to carry the shift.' },
  { title: 'Sidekick (acq. Perplexity)', href: 'https://www.theinformation.com/briefings/perplexity-buys-browser-startup-sidekick', img: '/images/projects/sidekick.webp', alt: 'Sidekick browser, acquired by Perplexity', desc: 'Brand and positioning for Sidekick, the productivity browser — sharp enough to make the product an acquisition target, later bought by Perplexity.' },
];

const PBT_PHASES = [
  { kicker: 'Phase 1', name: 'Project setup', meta: '1 week', summary: 'We spin up a client workspace and gather all your raw material in one place.', modules: ['Client workspace in Notion — sprints, tasks, projects, knowledge base, call recordings — plus an inventory of your data sources: analytics, calls, research, documents.', 'Slack for async work, Miro for workshops.', 'Goals, success criteria, and interview plan agreed up front.', 'BSO work rhythm: weekly sprints — Mon planning · daily async · Fri retro + client sync.'] },
  { kicker: 'Phase 2', name: 'Brand strategy & platform', meta: '4 weeks', summary: 'We understand the business, market, and customers — and develop positioning rooted in real customers’ data and insights.', modules: ['Immersion in your raw material — calls, analytics, research — topped up via interviews with founders and team.', 'Product & market audit + competitive analysis and white space.', 'Brand platform workshop: 10-year plan, Why / How / What.', 'Values, mission & vision workshop.', 'Audiences workshop: key segments via JTBD.', 'Brand personality workshop: character, attributes, tone.', 'ICP profiles from interviews or call analysis: JTBD, triggers, barriers, buying journey.', 'Positioning — the project’s key fork: territories → choosing a direction → Positioning Canvas + PMF narrative.', 'Messaging foundation: Category Entry Points per segment.', 'AI-native delivery: strategy and positioning land as living context your agents can work from — not just a PDF deck.'] },
  { kicker: 'Phase 3', name: 'Brand system', meta: '3 weeks (+2 naming)', summary: 'We turn strategy into a brand — verbal and visual.', modules: ['Messaging House — universal + situational.', 'Tone of Voice: voice character, principles, the “volume knob” of tone.', 'Brand identity: logo, typography, palette, graphics.', 'Design system — tokens + components — and brand guidelines.', 'Design system in detail: core components (buttons, nav, forms, cards, grids), spacing & layout rules, tokens (color, shadow, radii, typography, states), interaction patterns (hover, focus, transitions), light + optional dark mode, documented in Figma.', 'AI-native delivery: the design system and Messaging House ship ready for agents — working context your team’s AI can build on, not files someone has to re-interpret.'], subhead: 'Naming / renaming · +2 weeks · optional', subModules: ['If the name can’t carry the new strategy.', 'Brief and agreed naming criteria.', 'Name generation + trademark check.', 'Final name, rationale, domains.'] },
  { kicker: 'Phase 4', name: 'Production', meta: '4 weeks', summary: 'We build all the brand’s assets.', modules: ['Creative assets across multiple channels: website, email, ads, social, support, hiring — depending on the product.', 'Website: prototype → design → build, on the platform that fits your needs.', 'Page templates: homepage, use-case templates, acquisition LPs, company info pages, blog index + article — plus reusable components (hero, features, pricing, CTAs, forms, FAQ).', 'Build: project setup (nav, footer, global styles), assembly, responsive behaviors, animations, CMS for blog, final QA.', 'Asset production for dev: finalized & documented Figma files, logo & identity package, exported web assets (SVGs, optimized images), component & template docs.', 'Sales enablement: decks, scripts, objection handling.', 'Marketing & brand assets: social kit, ad creatives, templates.', 'AI-native delivery: templates and assets handed over in a format your agents can pick up and run with — not a static folder to wire up by hand.'] },
  { kicker: 'Phase 5', name: 'Migration & launch', meta: '2–3 weeks', optional: 'optional', summary: 'We switch the world over to the new brand without losing customers. Needed for any launch — not only when renaming.', modules: ['Customer comms and trust preservation: announcements, FAQ, contracts.', 'Internal brand adoption: onboarding decks, team checklists, internal presentations.', 'Launch orchestration: readiness → release runbook → final check.', 'Rollout across hundreds of touchpoints — every asset, channel, integration, and account. The most underestimated part of a rebrand: reaching launch isn’t enough — you have to run the whole todo-list and hit the date exactly.', 'AI-native delivery: the launch runbook, comms, and assets are handed over agent-ready — your team and its agents can run the rollout, not just read it.'], callout: { title: 'Technical migration — on your side', text: 'Domains, SSO, redirects, and the product rebrand itself are handled by your engineering team. We coordinate the launch and dependencies.' } },
  { kicker: 'Phase 6', name: 'Live system', meta: '2 weeks', optional: 'optional', summary: 'We don’t just hand the brand over — we turn the project into a living system your team keeps working in. The goal is the lowest-friction switch possible: you wake up in the new brand and keep moving, instead of rolling it out for months.', modules: ['First-week monitoring: traffic, conversion, churn.', 'Long tail: finishing the brand across every corner of the product.', 'Rebrand success metrics.', 'A Figma design system connected to code (Figma ↔ CC) — designers work in a ready system right away.', 'Messaging House, brand guidelines, and assets live in your Notion and update via agents.', 'Everything connected into one system: strategy → tactics → creative execution.', 'Access to our agents and assets by subscription; marketing & GTM automations on request, as a separate scope.'] },
];

const PBT = [
  b('pbt-nav', 'bt:nav', { office: ['Vijzelstraat 68-78', '1017 ES Amsterdam'] }),
  b('pbt-hero', 'bt:hero', {
    eyebrow: 'Brand transformation & rebrand',
    title: 'Turning brand into a growth lever that compounds',
    cta: 'Book a call',
    principles: [
      { h3: 'Strategy ↔ execution, end-to-end', p: 'You get strategy, brand, content, website, and launch as one continuous process — not five contractors to coordinate.' },
      { h3: 'Brand is a means, not the goal', p: 'Your brand becomes a tool for a durable business strategy, not an end in itself — you walk away with results, not a rebrand for its own sake.' },
      { h3: 'AI-native', p: 'You inherit a working system, not a folder of files: a Figma ↔ code design system, your Messaging House in Notion, plus our agents and assets you keep using.' },
    ],
  }),
  b('pbt-when', 'bt:eps', {
    id: 'when', label: 'When you need a rebrand', eyebrow: 'When a rebrand earns its place', h2: 'When you need this',
    intro: 'We work modularly. After a short diagnostic we assemble a proposal for your specific task — from a positioning refresh to a full rebrand with renaming.',
    points: [
      { metric: '01', name: 'Moving up-market', text: 'SMB → Enterprise — signal the market that you’re no longer a startup.' },
      { metric: '02', name: 'A market full of lookalikes', text: 'Competitors say and look the same — you need to explain how you’re different.' },
      { metric: '03', name: 'Raising investment', text: 'Package the company so investors want in.' },
      { metric: '04', name: 'Category shift', text: 'M&A, a new business model, a shifted product-market fit, or launching a product in a new category.' },
      { metric: '05', name: 'Entering new markets', text: 'New countries and audiences — the brand has to speak their language.' },
    ],
  }),
  b('pbt-why', 'bt:leverages', {
    eyebrow: 'Why a brand matters', h2: 'Brand is one of the last unfair advantages',
    intro: 'Building a product has never been easier — so the moats that came with it are mostly gone. Features, distribution, even pricing get copied within a quarter. Brand is one of the few advantages a competitor can’t clone — and it compounds into a growth flywheel: four levers that feed each other.',
    items: [
      { metric: 'Lower CAC', name: 'Acquisition', text: 'Buyers pick the brand they already know — so you pay less to win them.' },
      { metric: 'Higher LTV', name: 'Retention', text: 'People stay with a brand they love — churn drops, lifetime value climbs.' },
      { metric: 'Pricing power', name: 'Monetization', text: 'A strong brand commands a premium on the same product.' },
      { metric: 'Organic growth', name: 'Referral', text: 'A loved brand gets recommended — reach you don’t pay for.' },
    ],
  }),
  b('pbt-projects', 'bt:projects', {
    eyebrow: 'Our experience', h2: 'Brands we’ve transformed',
    intro: 'Three very different projects — each closing a different part of the same offering. Together they map the full arc we run end-to-end: strategy, identity, system, and launch.',
    projects: PBT_PROJECTS,
  }),
  b('pbt-diagnostic', 'bt:diagnostic', {
    eyebrow: 'Diagnostic', h2: 'Run your business through our frame — get a quick diagnostic',
    intro: 'A few quick answers and we send back a short diagnostic: the job you’re really hired for, who you actually compete with, your biggest opening, and an under-used angle. A surface cut of one frame — the full picture is the real work. Takes a minute.',
  }),
  b('pbt-timeline', 'bt:timeline', {
    eyebrow: 'Phases & timeline', h2: 'The phases, assembled to fit',
    intro: 'Core phases run every project; optional phases switch on when the scope calls for them.',
    totalNum: '≈ 16–18 weeks.', totalNote: 'Each phase ends in a client sign-off; further changes require a scope extension.',
    rows: [
      { name: '1. Project setup', weeksNum: '1', weeksUnit: 'week' },
      { name: '2. Brand strategy & platform', weeksNum: '4', weeksUnit: 'weeks' },
      { name: '3. Brand system', weeksNum: '3', weeksUnit: 'weeks' },
      { name: '+ Naming / renaming', weeksNum: '2', weeksUnit: 'weeks', tag: 'optional' },
      { name: '4. Production', weeksNum: '4', weeksUnit: 'weeks' },
      { name: '5. Migration & launch', weeksNum: '2–3', weeksUnit: 'weeks', tag: 'optional' },
      { name: '6. Live system', weeksNum: '2', weeksUnit: 'weeks', tag: 'optional' },
    ],
  }),
  b('pbt-phases', 'bt:phases', { id: 'phases', label: 'Phase detail', h2: 'The phases in detail', phases: PBT_PHASES }),
  b('pbt-final', 'bt:final', {
    h2: 'A quantum leap for your business (seriously)',
    copy: 'Built end-to-end, strategy to launch — and kept as a living system your team keeps working with on its own, not a project that ends.', cta: 'Book a call',
  }),
  b('pbt-footer', 'bt:footer', { links: [{ label: 'When you need it', href: '#when' }, { label: 'Phases & timeline', href: '#timeline' }, { label: 'Contact', href: '#contact' }] }),
];

/* id -> { css: stylesheet id served by /builder/css/[id], blocks } */
export const BT_PAGES = {
  p8fig: { css: 'p8fig', blocks: P8FIG },
  pbt: { css: 'pbt', blocks: PBT },
};
