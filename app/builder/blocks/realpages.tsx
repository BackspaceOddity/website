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
import { UREMBO_COMPONENTS, UREMBO_TYPE_NAMES } from './urembo';
import { UREMBO_EXERCISE_COMPONENTS, UREMBO_EXERCISE_TYPE_NAMES } from './exercises';
import { MERZ_COMPONENTS, MERZ_TYPE_NAMES } from './merz';
import { BtCascade } from './cascade';
import { buildBuiltinPages, PBT_PROJECTS } from '../../8figures/builtin-pages';

/* type string -> section component the canvas renders.
   bt: = Backspace Oddity DS; ub: = Urembo Hub DS (BSO-658 Pass 1). Merged into
   one lookup so the canvas/thumbnails resolve either DS by full type string. */
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
  'bt:cascade': BtCascade,
  ...UREMBO_COMPONENTS,
  ...UREMBO_EXERCISE_COMPONENTS,
  ...MERZ_COMPONENTS,
};

/* human label per type, shown on the section's editor tag */
export const BT_TYPE_NAMES = {
  'bt:nav': 'Nav', 'bt:hero': 'Hero', 'bt:challenge': 'Challenge', 'bt:eps': 'Numbered cards',
  'bt:phases': 'Phases', 'bt:invest': 'Investment', 'bt:projects': 'Projects', 'bt:final': 'Final CTA',
  'bt:footer': 'Footer', 'bt:leverages': 'Leverages', 'bt:timeline': 'Timeline', 'bt:diagnostic': 'Diagnostic',
  'bt:cascade': 'Cascade',
  ...UREMBO_TYPE_NAMES,
  ...UREMBO_EXERCISE_TYPE_NAMES,
  ...MERZ_TYPE_NAMES,
};

/* Built-in real pages, now sourced from ./builtin-pages — pure data shared with
   the one-time DB seed so content.ts is the single seed input (BSO-684). */
export const BT_PAGES = buildBuiltinPages(c);
const P8FIG = BT_PAGES.p8fig.blocks;
const PBT = BT_PAGES.pbt.blocks;

/* ---------- Library: section types -> nested variations ----------
 * Two-level library for real pages: high-level section TYPE, and inside each a
 * set of variations (different counts / layouts) carrying real content. Props
 * are reused from the assembled pages above; the builder clones on insert.
 */
const find = (arr: any[], type: string) => (arr.find((x) => x.type === type) || {}).props;

export const BT_SECTIONS = [
  { type: 'bt:hero', name: 'Hero', variations: [
    { id: 'hero-sub', name: 'With subtitle', props: find(P8FIG, 'bt:hero') },
    { id: 'hero-princ', name: 'With 3 principles', props: find(PBT, 'bt:hero') },
  ] },
  { type: 'bt:eps', name: 'Numbered cards', variations: [
    { id: 'eps-3', name: '3 cards', props: find(P8FIG, 'bt:eps') },
    { id: 'eps-5', name: '5 cards', props: find(PBT, 'bt:eps') },
  ] },
  { type: 'bt:projects', name: 'Projects', variations: [
    { id: 'proj-3', name: '3 projects', props: find(PBT, 'bt:projects') },
    { id: 'proj-6', name: '6 projects', props: { ...find(PBT, 'bt:projects'), projects: [...PBT_PROJECTS, ...PBT_PROJECTS] } },
  ] },
  { type: 'bt:phases', name: 'Phases', variations: [
    { id: 'phases-sprint', name: 'Sprint (5 phases)', props: find(P8FIG, 'bt:phases') },
    { id: 'phases-full', name: 'Full (6 phases)', props: find(PBT, 'bt:phases') },
  ] },
  { type: 'bt:challenge', name: 'Challenge', variations: [
    { id: 'chal', name: 'You see / We see', props: find(P8FIG, 'bt:challenge') },
  ] },
  { type: 'bt:leverages', name: 'Leverages', variations: [
    { id: 'lev-4', name: '4 levers (dark)', props: find(PBT, 'bt:leverages') },
  ] },
  { type: 'bt:timeline', name: 'Timeline', variations: [
    { id: 'tl', name: 'Phase rows + total', props: find(PBT, 'bt:timeline') },
  ] },
  { type: 'bt:invest', name: 'Investment', variations: [
    { id: 'inv', name: 'Price + terms', props: find(P8FIG, 'bt:invest') },
  ] },
  { type: 'bt:diagnostic', name: 'Diagnostic', variations: [
    { id: 'diag', name: 'Lead form', props: find(PBT, 'bt:diagnostic') },
  ] },
  { type: 'bt:final', name: 'Final CTA', variations: [
    { id: 'final', name: 'Closing CTA', props: find(P8FIG, 'bt:final') },
  ] },
  { type: 'bt:nav', name: 'Nav', variations: [
    { id: 'nav', name: 'Logo + contact', props: find(P8FIG, 'bt:nav') },
  ] },
  { type: 'bt:footer', name: 'Footer', variations: [
    { id: 'footer', name: 'Links + reach', props: find(P8FIG, 'bt:footer') },
  ] },
];
