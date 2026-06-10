/**
 * Interactive Proposal Workspace — shared chrome (v1)
 *
 * Password gate, theme toggle, and a DEV-ONLY visual edit panel — extracted
 * from app/ajtbd-naming-brief/route.ts so every per-client page shares the
 * same gate + iteration tooling.
 *
 * The edit panel posts to localhost:8002/inbox and is gated behind
 * WS_EDIT_MODE=1 so it never renders on the client-facing production page.
 */

import crypto from 'crypto';
import { buildScript } from '@/lib/vendor/edit-mode/build-script';

const BSO_LOGO_SVG = `<svg width="268" height="268" viewBox="0 0 268 268" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M267.18 133.339C267.18 157.332 260.58 176.783 256.42 176.783C252.26 176.783 252.116 157.332 252.116 133.339C252.116 109.345 252.26 89.8948 256.42 89.8948C260.58 89.8948 267.18 109.345 267.18 133.339Z" fill="#F2F2F0"/>
  <path d="M233.305 134.008C233.305 183.194 228.15 223.068 225.773 223.068C223.396 223.068 224.697 183.194 224.697 134.008C224.697 84.8212 223.396 44.9476 225.773 44.9476C228.15 44.9476 233.305 84.8212 233.305 134.008Z" fill="#F2F2F0"/>
  <path d="M201.543 133.5C201.543 197.683 197.464 249.713 195.087 249.713C192.71 249.713 192.935 197.683 192.935 133.5C192.935 69.3177 192.71 17.2875 195.087 17.2875C197.464 17.2875 201.543 69.3177 201.543 133.5Z" fill="#F2F2F0"/>
  <ellipse cx="159.024" cy="133.59" rx="11.8362" ry="133.59" fill="#F2F2F0"/>
  <path d="M128.375 133.313C128.375 204.393 125.569 262.015 116.061 262.015C106.552 262.015 93.9424 204.393 93.9424 133.313C93.9424 62.2321 106.552 4.60986 116.061 4.60986C125.569 4.60986 128.375 62.2321 128.375 133.313Z" fill="#F2F2F0"/>
  <path d="M75.3212 133.754C75.3212 190.438 70.2526 236.39 49.1561 236.39C28.0596 236.39 0 190.438 0 133.754C0 77.0693 28.0596 31.1174 49.1561 31.1174C70.2526 31.1174 75.3212 77.0693 75.3212 133.754Z" fill="#F2F2F0"/>
</svg>`;

/** Stable cookie token derived from the client's access key. Per-client salt
 *  keeps one client's cookie from unlocking another. */
export function token(accessKey: string, slug: string): string {
  return crypto.createHash('sha256').update(accessKey + ':pw:' + slug).digest('hex').slice(0, 40);
}

export function getCookie(req: Request, name: string): string {
  return (req.headers.get('cookie') || '')
    .split(';').map(s => s.trim())
    .find(s => s.startsWith(name + '='))
    ?.slice(name.length + 1) ?? '';
}

export const cookieName = (slug: string) => `pw-${slug}`;

/** Password splash — same two-panel DS layout as ajtbd. */
export function loginHtml(opts: { clientName: string; subtitle: string; actionPath: string; err?: boolean }): string {
  const { clientName, subtitle, actionPath, err = false } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Access Required</title>
<style>
  @font-face { font-family: 'GT Eesti Pro Text'; src: url('/fonts/GTEestiProText-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
  @font-face { font-family: 'GT Eesti Pro Text'; src: url('/fonts/GTEestiProText-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: 'GT Eesti Pro Text', system-ui, sans-serif; min-height: 100vh; display: flex; }
  .panel-left { flex: 1; position: relative; background: #011C00 url('/images/hero-bg-magenta-green.webp') center / cover no-repeat; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; }
  .logo { display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .logo svg { display: block; width: 140px; height: 140px; }
  .logo-name { font-family: 'GT Eesti Pro Text', system-ui, sans-serif; font-size: 28px; line-height: 1.2; color: #F2F2F0; font-weight: 500; text-align: center; }
  .panel-right { width: 520px; flex-shrink: 0; background: #FAFAF8; display: flex; flex-direction: column; justify-content: center; padding: 72px 64px; }
  .form-title { font-family: 'GT Eesti Pro Text', system-ui, sans-serif; font-size: 30px; font-weight: 400; color: #011C00; line-height: 1.3; margin-bottom: 8px; }
  .form-sub { font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #9A9A9A; margin-bottom: 40px; }
  input[type="password"] { display: block; width: 100%; padding: 16px 18px; font-family: 'GT Eesti Pro Text', system-ui, sans-serif; font-size: 20px; background: #E8E8E6; border: 1.5px solid #E5E3DC; border-radius: 0; color: #011C00; outline: none; margin-bottom: 14px; transition: border-color 0.12s, background 0.12s; -webkit-appearance: none; appearance: none; }
  input[type="password"]::placeholder { color: #9A9A9A; }
  input[type="password"]:focus { border-color: #011C00; background: #FAFAF8; }
  button { display: block; width: 100%; padding: 18px 0; font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; background: #011C00; color: #FAFAF8; border: none; cursor: pointer; transition: opacity 0.12s; }
  button:hover { opacity: 0.78; }
  .err { font-size: 14px; color: rgba(26, 26, 26, 0.50); margin-top: 14px; font-style: italic; }
  @media (max-width: 640px) { body { flex-direction: column; } .panel-left { flex: none; height: 220px; padding: 24px; justify-content: flex-end; } .panel-right { width: 100%; padding: 40px 24px 48px; } }
</style>
</head>
<body>
  <div class="panel-left">
    <div class="logo">${BSO_LOGO_SVG}<div class="logo-name">Backspace<br>Oddity</div></div>
  </div>
  <div class="panel-right">
    <p class="form-title">${esc(clientName)}</p>
    <p class="form-sub">${esc(subtitle)}</p>
    <form method="POST" action="${esc(actionPath)}">
      <input type="password" name="code" placeholder="Enter password" autofocus autocomplete="current-password">
      <button type="submit">Enter →</button>
      ${err ? '<p class="err">Incorrect password.</p>' : ''}
    </form>
  </div>
</body>
</html>`;
}

/** Inline <head> script that applies saved/system theme before paint. */
export const themeHeadScript = `<script>
  (function() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
  })();
</script>`;

/** Floating theme toggle button + handler (end of body). */
export const themeToggle = `<button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">&#x25D0;</button>
<script>
  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
</script>`;

/** DEV-ONLY Edit Mode panel — sourced from the canonical @backspace-oddity/edit-mode
 *  package (buildScript). This file only supplies BSO Website's typography tokens +
 *  block->token map; the panel itself is identical across every project. */
const BSO_SIZES = [
  { k: '--fs-h2', l: 'H2 heading', d: 42, min: 24, max: 64 },
  { k: '--fs-body', l: 'Body', d: 22, min: 14, max: 32 },
  { k: '--fs-statement', l: 'Pull quote', d: 22, min: 14, max: 40 },
  { k: '--fs-ba-core', l: 'Before/After', d: 22, min: 14, max: 36 },
  { k: '--fs-ej-frame', l: 'Emphasis', d: 26, min: 16, max: 44 },
  { k: '--fs-secondary', l: 'Secondary', d: 15, min: 11, max: 24 },
  { k: '--fs-small', l: 'Small', d: 16, min: 11, max: 22 },
  { k: '--fs-list-item', l: 'List item', d: 19, min: 12, max: 28 },
  { k: '--fs-section-num', l: 'Section label', d: 13, min: 10, max: 18 },
];
const BSO_LHS = [
  { k: '--lh-body', l: 'Body line-height', d: 150, min: 120, max: 220 },
  { k: '--lh-heading', l: 'Heading line-height', d: 115, min: 100, max: 160 },
  { k: '--lh-quote', l: 'Quote line-height', d: 150, min: 120, max: 200 },
];
const BSO_WSTYLE = [
  { l: 'H2 heading', w: '--w-h2', s: '--st-h2', wd: 400, sd: 'normal' },
  { l: 'Body', w: '--w-body', s: '--st-body', wd: 400, sd: 'normal' },
  { l: 'Pull quote', w: '--w-statement', s: '--st-statement', wd: 400, sd: 'italic' },
  { l: 'Before/After', w: '--w-ba-core', s: '--st-ba-core', wd: 400, sd: 'italic' },
  { l: 'Emphasis', w: '--w-ej-frame', s: '--st-ej-frame', wd: 400, sd: 'italic' },
  { l: 'List item', w: '--w-list-item', s: '--st-list-item', wd: 500, sd: 'normal' },
  { l: 'Section label', w: '--w-section-num', s: '--st-section-num', wd: 400, sd: 'italic' },
];
const BSO_TOKEN_MAP = [
  { match: '.statement', token: '--fs-statement', label: 'PULL QUOTE' },
  { match: '.ba-core', token: '--fs-ba-core', label: 'BEFORE/AFTER' },
  { match: '.section-num', token: '--fs-section-num', label: 'SECTION LABEL' },
  { match: 'h2', token: '--fs-h2', label: 'H2 HEADING' },
  { match: '.ej-frame', token: '--fs-ej-frame', label: 'EMPHASIS' },
  // Step-list titles (numbered steps: "Payment setup", "Automatic checks", etc.)
  { match: '.step-title', token: '--fs-list-item', label: 'LIST ITEM' },
  // Step descriptions + other secondary-size text
  { match: '.step-desc', token: '--fs-secondary', label: 'SECONDARY' },
  { match: '.ba-col, .comp-card, .criterion', token: '--fs-secondary', label: 'SECONDARY' },
  { match: '.check-list', token: '--fs-small', label: 'SMALL' },
  { match: 'p', token: '--fs-body', label: 'BODY' },
];

const BSO_FONT_FAMILIES = [
  { k: '--display', l: 'Display (headings)', d: 'GT Eesti Pro Display' },
  { k: '--text',    l: 'Text (body)',         d: 'GT Eesti Pro Text' },
  { k: '--mono',    l: 'Mono',                d: 'ui-monospace' },
];

// Full GT Eesti Pro weight range — all faces are loaded in styles.ts @font-face declarations.
const GT_EESTI_WEIGHTS: Array<[string, string]> = [
  ['100|normal', 'Ultra Light'], ['100|italic', 'Ultra Light Italic'],
  ['200|normal', 'Thin'],        ['200|italic', 'Thin Italic'],
  ['300|normal', 'Light'],       ['300|italic', 'Light Italic'],
  ['350|normal', 'Book'],        ['350|italic', 'Book Italic'],
  ['400|normal', 'Regular'],     ['400|italic', 'Italic'],
  ['500|normal', 'Medium'],      ['500|italic', 'Medium Italic'],
  ['700|normal', 'Bold'],        ['700|italic', 'Bold Italic'],
  ['800|normal', 'Ultra Bold'],  ['800|italic', 'Ultra Bold Italic'],
];

export function editModeScript(slug: string): string {
  return buildScript({
    slug,
    tweaks: {
      sizes: BSO_SIZES, lineHeights: BSO_LHS,
      weightStyles: BSO_WSTYLE, weightOptions: GT_EESTI_WEIGHTS,
      fontFamilies: BSO_FONT_FAMILIES,
    },
    tokenMap: BSO_TOKEN_MAP,
  });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
