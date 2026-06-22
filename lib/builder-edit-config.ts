/**
 * Edit Mode typography config for builder PUBLISHED pages (BSO-658 Pass 2).
 *
 * Mirrors the BSO config in lib/proposal-workspace/chrome.ts so the canonical
 * Edit Mode "Aa" Tweaks panel on a published page adjusts the same tokens the
 * page CSS (public/builder-css/{urembo,pbt}.css) uses. Plain data — no server
 * imports — so it can be passed to buildScriptInner from a server component.
 *
 * Edit Mode on the published page is DEV-ONLY (gated in page.tsx); it is a
 * review/comment surface (Send to Claude → inbox :8014). Build-time editing
 * that PERSISTS lives in the builder canvas, not here.
 */
export const BUILDER_EDIT_SIZES = [
  { k: '--fs-h2', l: 'H2 heading', d: 42, min: 24, max: 64 },
  { k: '--fs-body', l: 'Body', d: 22, min: 14, max: 32 },
  { k: '--fs-statement', l: 'Pull quote', d: 22, min: 14, max: 40 },
  { k: '--fs-ba-core', l: 'Before/After', d: 22, min: 14, max: 36 },
  { k: '--fs-secondary', l: 'Secondary', d: 15, min: 11, max: 24 },
  { k: '--fs-small', l: 'Small', d: 16, min: 11, max: 22 },
  { k: '--fs-list-item', l: 'List item', d: 19, min: 12, max: 28 },
  { k: '--fs-section-num', l: 'Section label', d: 13, min: 10, max: 18 },
];
export const BUILDER_EDIT_LHS = [
  { k: '--lh-body', l: 'Body line-height', d: 150, min: 120, max: 220 },
  { k: '--lh-heading', l: 'Heading line-height', d: 115, min: 100, max: 160 },
];
export const BUILDER_EDIT_WSTYLE = [
  { l: 'H2 heading', w: '--w-h2', s: '--st-h2', wd: 400, sd: 'normal' },
  { l: 'Body', w: '--w-body', s: '--st-body', wd: 400, sd: 'normal' },
  { l: 'Pull quote', w: '--w-statement', s: '--st-statement', wd: 400, sd: 'italic' },
];
export const BUILDER_EDIT_TOKEN_MAP = [
  { match: '.statement', token: '--fs-statement', label: 'PULL QUOTE' },
  { match: '.ba-core', token: '--fs-ba-core', label: 'BEFORE/AFTER' },
  { match: '.section-num', token: '--fs-section-num', label: 'SECTION LABEL' },
  { match: 'h2', token: '--fs-h2', label: 'H2 HEADING' },
  { match: '.step-title', token: '--fs-list-item', label: 'LIST ITEM' },
  { match: '.step-desc', token: '--fs-secondary', label: 'SECONDARY' },
  { match: '.check-list', token: '--fs-small', label: 'SMALL' },
  { match: 'p', token: '--fs-body', label: 'BODY' },
];

/** Inline pre-paint theme script — applies saved/system theme before first paint. */
export const THEME_HEAD_SCRIPT =
  "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();";

/** Floating theme toggle button + handler (client-facing, always on). */
export const THEME_TOGGLE_HTML =
  '<button class="theme-toggle" onclick="(function(){var d=document.documentElement.classList.toggle(\'dark\');try{localStorage.setItem(\'theme\',d?\'dark\':\'light\');}catch(e){}})()" title="Светлая / тёмная тема" aria-label="Светлая / тёмная тема">&#x25D0;</button>';
