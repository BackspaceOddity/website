import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ACCESS_KEY = process.env.NB_PASSWORD || '';
const COOKIE   = 'nb-auth';

function token() {
  return crypto.createHash('sha256').update(ACCESS_KEY + 'nb-2026').digest('hex').slice(0, 40);
}

function getCookie(req: Request, name: string) {
  return (req.headers.get('cookie') || '')
    .split(';').map(s => s.trim())
    .find(s => s.startsWith(name + '='))
    ?.slice(name.length + 1) ?? '';
}

const loginHtml = (err = false) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Access Required</title>
<style>
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Regular.ttf') format('truetype');
    font-weight: 400; font-style: normal;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Medium.ttf') format('truetype');
    font-weight: 500; font-style: normal;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }

  body {
    font-family: 'GT Eesti Pro Text', system-ui, sans-serif;
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #060a06 url('/images/hero-bg-magenta-green.png') center / cover no-repeat;
    position: relative;
    overflow: hidden;
  }

  /* Logo — bottom-left, matching the Figma cover */
  .logo {
    position: fixed;
    bottom: 32px;
    left: 40px;
    display: flex;
    align-items: center;
    gap: 14px;
    opacity: 0.75;
  }
  .logo svg { display: block; width: 28px; height: 28px; }
  .logo-text {
    font-family: 'GT Eesti Pro Text', system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.25;
    color: #F5F2E9;
    font-weight: 400;
  }

  /* Form card — light surface per BSO Web DS tokens */
  .card {
    position: relative;
    z-index: 1;
    width: calc(100% - 48px);
    max-width: 340px;
    padding: 32px;
    background: #FAF9F6;
    border-top: 2px solid #4A7C5E;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(26, 26, 26, 0.40);
    margin-bottom: 24px;
  }

  input[type="password"] {
    display: block;
    width: 100%;
    padding: 12px 14px;
    font-family: 'GT Eesti Pro Text', system-ui, sans-serif;
    font-size: 16px;
    background: transparent;
    border: 1.5px solid #E5E3DC;
    border-radius: 0;
    color: #1A1A1A;
    outline: none;
    margin-bottom: 10px;
    transition: border-color 0.12s;
    -webkit-appearance: none;
    appearance: none;
  }
  input[type="password"]::placeholder { color: #9A9A9A; }
  input[type="password"]:focus { border-color: #1A1A1A; }

  button {
    display: block;
    width: 100%;
    padding: 12px 0;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: #1A1A1A;
    color: #FAF9F6;
    border: none;
    cursor: pointer;
    transition: opacity 0.12s;
  }
  button:hover { opacity: 0.80; }

  .err {
    font-size: 12px;
    color: rgba(26, 26, 26, 0.50);
    margin-top: 10px;
    font-style: italic;
  }
</style>
</head>
<body>

  <!-- Logo mark — bottom-left, like the Figma splash -->
  <div class="logo">
    <svg width="268" height="268" viewBox="0 0 268 268" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M267.18 133.339C267.18 157.332 260.58 176.783 256.42 176.783C252.26 176.783 252.116 157.332 252.116 133.339C252.116 109.345 252.26 89.8948 256.42 89.8948C260.58 89.8948 267.18 109.345 267.18 133.339Z" fill="#F5F2E9"/>
      <path d="M233.305 134.008C233.305 183.194 228.15 223.068 225.773 223.068C223.396 223.068 224.697 183.194 224.697 134.008C224.697 84.8212 223.396 44.9476 225.773 44.9476C228.15 44.9476 233.305 84.8212 233.305 134.008Z" fill="#F5F2E9"/>
      <path d="M201.543 133.5C201.543 197.683 197.464 249.713 195.087 249.713C192.71 249.713 192.935 197.683 192.935 133.5C192.935 69.3177 192.71 17.2875 195.087 17.2875C197.464 17.2875 201.543 69.3177 201.543 133.5Z" fill="#F5F2E9"/>
      <ellipse cx="159.024" cy="133.59" rx="11.8362" ry="133.59" fill="#F5F2E9"/>
      <path d="M128.375 133.313C128.375 204.393 125.569 262.015 116.061 262.015C106.552 262.015 93.9424 204.393 93.9424 133.313C93.9424 62.2321 106.552 4.60986 116.061 4.60986C125.569 4.60986 128.375 62.2321 128.375 133.313Z" fill="#F5F2E9"/>
      <path d="M75.3212 133.754C75.3212 190.438 70.2526 236.39 49.1561 236.39C28.0596 236.39 0 190.438 0 133.754C0 77.0693 28.0596 31.1174 49.1561 31.1174C70.2526 31.1174 75.3212 77.0693 75.3212 133.754Z" fill="#F5F2E9"/>
    </svg>
    <div class="logo-text">Backspace<br>Oddity</div>
  </div>

  <!-- Password gate — DS-styled card -->
  <div class="card">
    <p class="eyebrow">Naming Brief · A Hundred Monkeys</p>
    <form method="POST" action="/ajtbd-naming-brief">
      <input type="password" name="code" placeholder="Password" autofocus autocomplete="current-password">
      <button type="submit">Enter →</button>
      ${err ? '<p class="err">Incorrect password.</p>' : ''}
    </form>
  </div>

</body>
</html>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>
  (function() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
<title>Methodology — Naming Brief</title>
<style>
  @font-face {
    font-family: 'GT Eesti Pro Display';
    src: url('/fonts/GTEestiProDisplay-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Display';
    src: url('/fonts/GTEestiProDisplay-RegularItalic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-RegularItalic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #011C00;
    --paper: #F5F2E9;
    --paper-soft: #EFECE3;
    --surface: #FDFBF4;
    --rule: rgba(1, 28, 0, 0.12);
    --rule-strong: rgba(1, 28, 0, 0.22);
    --ink-55: rgba(1, 28, 0, 0.55);
    --ink-40: rgba(1, 28, 0, 0.40);
    --ink-25: rgba(1, 28, 0, 0.25);
    /* Tokens for text on inverted (dark-ink) surfaces — auto-flip in dark mode */
    --on-dark-primary:    rgba(245, 242, 233, 0.92);
    --on-dark-secondary:  rgba(245, 242, 233, 0.65);
    --on-dark-muted:      rgba(245, 242, 233, 0.42);
    --on-dark-border:     rgba(245, 242, 233, 0.22);
    --display: 'GT Eesti Pro Display', system-ui, sans-serif;
    --text:    'GT Eesti Pro Text',    system-ui, sans-serif;
    --mono:    ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    /* ── Font size tokens — adjustable via Tweaks panel ── */
    --fs-h2:          42px;
    --fs-body:        22px;
    --fs-statement:   22px;
    --fs-ba-core:     22px;
    --fs-ej-frame:    26px;
    --fs-strategy:    26px;
    --fs-tov-summary: 26px;
    --fs-secondary:        15px;  /* ba-col p, criterion-title, limit-text, comp-card p */
    --fs-strategy-rationale: 17px;  /* strategy card body text */
    --fs-small:       16px;  /* criterion-desc, check-list li, check-section p */
    --fs-positioning: 17px;
    --fs-note:        16px;
    --fs-list-item:   19px;  /* two-col items */
    --fs-section-num: 13px;  /* section labels (01 — What the Methodology Is) */
    --fs-pos-label:   12px;  /* positioning row labels (For Whom, Unlike, etc.) */
    --fs-adjective:   14px;  /* brand character adjective cards (RU) */
    --fs-adjective-en:16px;  /* brand character adjective cards (EN italic) */
    /* ── Line-height tokens ── */
    --lh-body:    1.50;
    --lh-heading: 1.15;
    --lh-quote:   1.5;
    --lh-ba-core: 1.35;
  }

  html.dark {
    --ink: #e8e2d6;
    --paper: #0d1209;
    --paper-soft: #111810;
    --surface: #172014;
    --rule: rgba(232, 226, 214, 0.12);
    --rule-strong: rgba(232, 226, 214, 0.22);
    --ink-55: rgba(232, 226, 214, 0.55);
    --ink-40: rgba(232, 226, 214, 0.40);
    --ink-25: rgba(232, 226, 214, 0.25);
    --on-dark-primary:    rgba(13, 18, 9, 0.88);
    --on-dark-secondary:  rgba(13, 18, 9, 0.65);
    --on-dark-muted:      rgba(13, 18, 9, 0.42);
    --on-dark-border:     rgba(13, 18, 9, 0.22);
  }

  html { background: var(--paper); color: var(--ink); font-family: var(--text); }

  body {
    max-width: 860px;
    margin: 0 auto;
    padding: 60px 40px 100px;
  }

  /* ── Header ─────────────────────────────────────── */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 28px;
    border-bottom: 1.5px solid var(--ink);
    margin-bottom: 48px;
  }
  .doc-label {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-40);
  }
  .doc-meta {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-40);
    margin-top: 5px;
  }
  .doc-date {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-40);
    text-align: right;
    line-height: 1.7;
  }

  /* ── Typography ─────────────────────────────────── */
  .section-num {
    font-family: var(--text);
    font-style: italic;
    font-size: var(--fs-section-num);
    letter-spacing: 0.05em;
    color: var(--ink-55);
    margin-bottom: 10px;
    display: block;
  }
  h2 {
    font-family: var(--display);
    font-size: var(--fs-h2);
    font-weight: 400;
    line-height: var(--lh-heading);
    margin-bottom: 22px;
    color: var(--ink);
  }
  h3 {
    font-family: var(--text);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
    color: var(--ink-55);
  }
  p {
    font-family: var(--text);
    font-size: var(--fs-body);
    line-height: var(--lh-body);
    color: var(--ink);
  }
  p + p { margin-top: 12px; }

  .divider {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 48px 0;
  }

  /* ── Statement / pull quote ─────────────────────── */
  .statement {
    font-family: var(--display);
    font-size: var(--fs-statement);
    line-height: var(--lh-quote);
    font-style: italic;
    color: var(--ink);
    border-left: 3px solid var(--rule-strong);
    padding-left: 24px;
    margin: 28px 0;
  }

  /* ── Layout ─────────────────────────────────────── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  /* ── Pills ──────────────────────────────────────── */
  .pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .pill {
    font-family: var(--mono);
    font-size: 11px;
    padding: 5px 12px;
    border: 1px solid var(--rule-strong);
    border-radius: 2px;
    color: var(--ink-55);
    letter-spacing: 0.04em;
  }

  /* ── Emotional Job section ──────────────────────── */
  .ba-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin: 28px 0;
  }
  .ba-col {
    padding: 24px;
    background: var(--surface);
  }
  .ba-col.ba-before {
    background: var(--paper-soft);
  }
  .ba-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-40);
    display: block;
    margin-bottom: 14px;
  }
  .ba-core {
    font-family: var(--display);
    font-size: var(--fs-ba-core);
    line-height: var(--lh-ba-core);
    font-style: italic;
    color: var(--ink);
    margin-bottom: 12px;
  }
  .ba-col p {
    font-family: var(--text);
    font-size: var(--fs-secondary);
    line-height: var(--lh-body);
    color: var(--ink-55);
  }
  .ej-frame {
    background: var(--ink);
    padding: 28px 32px;
    margin: 28px 0 20px;
  }
  .ej-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--on-dark-muted);
    display: block;
    margin-bottom: 12px;
  }
  .ej-frame p {
    font-family: var(--display);
    font-size: var(--fs-ej-frame);
    line-height: var(--lh-quote);
    font-style: italic;
    color: var(--on-dark-primary);
  }
  .note-small {
    font-family: var(--text);
    font-size: var(--fs-note);
    color: var(--ink-40);
    font-style: italic;
    line-height: 1.6;
    margin-top: 4px;
  }

  /* ── Criteria grid ──────────────────────────────── */
  .criteria-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 8px;
  }
  .criterion {
    background: var(--surface);
    padding: 18px 20px;
    position: relative;
  }
  .criterion-num {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-40);
    display: block;
    margin-bottom: 6px;
  }
  .criterion-title {
    font-family: var(--text);
    font-size: var(--fs-secondary);
    font-weight: 500;
    margin-bottom: 6px;
    line-height: 1.3;
    color: var(--ink);
  }
  .criterion-desc {
    font-size: var(--fs-small);
    line-height: 1.55;
    color: var(--ink-55);
  }
  .criterion-check {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 22px;
    height: 22px;
    border: 1.5px solid var(--rule-strong);
    border-radius: 2px;
  }

  /* ── Hard limits ────────────────────────────────── */
  .limits {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .limit-row {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 16px;
    background: var(--paper-soft);
    border-left: 3px solid var(--rule-strong);
  }
  .limit-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-55);
    white-space: nowrap;
    padding-top: 1px;
    min-width: 90px;
  }
  .limit-text {
    font-size: var(--fs-secondary);
    line-height: 1.55;
    color: var(--ink);
  }

  /* ── Comparison ─────────────────────────────────── */
  .comp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 8px;
  }
  .comp-card {
    padding: 20px 22px;
    background: var(--surface);
  }
  .comp-card.theirs {
    background: var(--paper-soft);
  }
  .comp-card-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-40);
    margin-bottom: 10px;
    display: block;
  }
  .comp-card p {
    font-size: var(--fs-secondary);
    line-height: 1.6;
    color: var(--ink-55);
  }

  /* ── Positioning ────────────────────────────────── */
  .positioning-block {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 0 28px;
    margin-top: 8px;
  }
  .positioning-row { display: contents; }
  .positioning-label {
    font-family: var(--mono);
    font-size: var(--fs-pos-label);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-40);
    padding-top: 4px;
    border-top: 1px solid var(--rule);
  }
  .positioning-text {
    font-family: var(--text);
    font-size: var(--fs-positioning);
    line-height: 1.65;
    color: var(--ink);
    padding: 16px 0 22px;
    border-top: 1px solid var(--rule);
  }
  .positioning-text strong { font-weight: 500; }
  .positioning-text em {
    font-family: var(--display);
    font-style: italic;
    font-size: var(--fs-positioning);
  }

  /* ── Brand character ────────────────────────────── */
  .brand-adjectives {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-top: 8px;
  }
  .adjective {
    background: var(--surface);
    padding: 18px 14px;
    text-align: center;
    font-family: var(--text);
    font-size: var(--fs-adjective);
    font-weight: 400;
    color: var(--ink);
    position: relative;
  }
  .adjective.en {
    font-family: var(--display);
    font-style: italic;
    font-size: var(--fs-adjective-en);
    color: var(--ink-55);
  }
  .adjective::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 4px;
    height: 4px;
    background: var(--rule-strong);
    border-radius: 50%;
  }

  .brand-sliders {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
  }
  .brand-slider {
    display: grid;
    grid-template-columns: 130px 1fr 130px;
    align-items: center;
    gap: 16px;
    padding: 13px 0;
    border-bottom: 1px solid var(--rule);
  }
  .brand-slider:last-child { border-bottom: none; }
  .brand-slider-label { font-family: var(--text); font-size: 13.5px; }
  .brand-slider-label.active { font-weight: 500; color: var(--ink); }
  .brand-slider-label.muted { color: var(--ink-40); font-weight: 400; }
  .brand-slider-label:first-child { text-align: left; }
  .brand-slider-label:last-child { text-align: right; }
  .brand-slider-track { position: relative; height: 1px; background: var(--rule); }
  .brand-slider-dot {
    position: absolute;
    top: 50%;
    width: 10px;
    height: 10px;
    background: var(--ink);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 4px var(--paper);
  }
  .brand-slider-dot::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px solid var(--ink-25);
    border-radius: 50%;
  }

  .tov-summary {
    margin-top: 32px;
    padding: 22px 26px;
    background: var(--surface);
    border-left: 3px solid var(--ink);
  }
  .tov-summary-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-40);
    display: block;
    margin-bottom: 10px;
  }
  .tov-summary p {
    font-family: var(--display);
    font-size: var(--fs-tov-summary);
    line-height: 1.55;
    font-style: italic;
    color: var(--ink);
  }

  /* ── Naming strategy grid ───────────────────────── */
  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 8px;
  }
  .strategy-card {
    background: var(--surface);
    padding: 22px 24px;
    border-top: 2px solid var(--rule-strong);
    position: relative;
  }
  .strategy-tag {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-40);
    display: block;
    margin-bottom: 10px;
  }
  .strategy-decision {
    font-family: var(--display);
    font-size: var(--fs-strategy);
    line-height: 1.3;
    color: var(--ink);
    margin-bottom: 12px;
    font-style: italic;
  }
  .strategy-rationale { font-family: var(--text); font-size: var(--fs-strategy-rationale); line-height: var(--lh-body); color: var(--ink-55); }
  .strategy-rationale strong { color: var(--ink); font-weight: 500; }
  .strategy-card.resolved::after {
    content: '\\2713 resolved';
    position: absolute;
    top: 22px;
    right: 24px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-40);
  }

  /* ── Inverted section (dark-ink bg) ─────────────── */
  .check-section {
    background: var(--ink);
    color: var(--paper);
    padding: 36px 40px;
    margin-top: 48px;
  }
  .check-section .section-num { color: var(--on-dark-muted); font-style: italic; }
  .check-section h2 { color: var(--on-dark-primary); margin-bottom: 24px; }
  .check-section p { color: var(--on-dark-secondary); font-size: var(--fs-small); }
  .check-list {
    list-style: none;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .check-list li {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    font-size: var(--fs-small);
    line-height: 1.55;
    color: var(--on-dark-primary);
  }
  .check-box {
    width: 20px;
    height: 20px;
    border: 1.5px solid var(--on-dark-border);
    border-radius: 2px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .check-question { color: var(--on-dark-primary); }
  .check-note {
    display: block;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--on-dark-muted);
    margin-top: 3px;
  }

  /* ── Footer ─────────────────────────────────────── */
  .doc-footer {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .doc-footer span {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-40);
  }

  /* ── Theme toggle ───────────────────────────────── */
  .theme-toggle {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--rule-strong);
    background: var(--paper);
    color: var(--ink);
    font-size: 17px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
    line-height: 1;
  }
  .theme-toggle:hover { border-color: var(--ink-55); }

  @media print {
    body { padding: 30px; }
    .check-section { break-inside: avoid; }
    .theme-toggle { display: none; }
  }

  @media (max-width: 640px) {
    body { padding: 32px 20px 80px; }
    .two-col,
    .criteria-grid,
    .comp-row,
    .strategy-grid,
    .ba-grid { grid-template-columns: 1fr; }
    .brand-adjectives { grid-template-columns: repeat(2, 1fr); }
    .positioning-block { grid-template-columns: 1fr; }
    .brand-slider { grid-template-columns: 90px 1fr 90px; }
    h2 { font-size: 34px; }
  }
</style>
</head>
<body>

<div class="doc-header">
  <div>
    <div class="doc-label">Naming Brief · A Hundred Monkeys</div>
    <div class="doc-meta">Ivan Zamesin's Methodology · Naming strategy by Backspace Oddity</div>
  </div>
  <div class="doc-date">Version 0.2<br>May 2026</div>
</div>

<!-- 01 ─────────────────────────────────────────────── -->
<section>
  <span class="section-num">01 — What the Methodology Is</span>
  <h2>An Integral Algorithm for Any Product and Business Challenge</h2>
  <div class="statement">
    A methodology — in the same sense that JTBD or Theory of Constraints are methodologies. Not a tool, not a course, not a framework — a self-standing system of thinking with its own name.
  </div>
  <p>It emerged from a single question: why do product managers and founders have frameworks but no system? There's JTBD, there's unit economics, there's Theory of Constraints — but no algorithm that ties them into a sequence of concrete steps for a specific problem. That's the gap this methodology closes.</p>
  <p>At the core — Advanced JTBD, rebuilt from scratch. On top of it — an integration of proven tools into a single decision-making chain. The result: you see the <em>full spectrum</em> of possible strategies and choose the best move — like in a strategy game where the entire graph of possibilities is visible.</p>
  <div class="pill-group">
    <span class="pill">Advanced JTBD</span>
    <span class="pill">Unit Economics</span>
    <span class="pill">Riskiest Assumption Test</span>
    <span class="pill">ABCDX Segmentation</span>
    <span class="pill">Theory of Constraints</span>
    <span class="pill">OKR</span>
    <span class="pill">Job Graph</span>
    <span class="pill">Critical Chain</span>
  </div>
</section>

<hr class="divider">

<!-- 02 — NEW ─────────────────────────────────────────── -->
<section>
  <span class="section-num">02 — The Emotional Job</span>
  <h2>The Condition the Name Must Resolve</h2>
  <p>The person who needs this methodology isn't struggling because they're not working hard enough. They're competent. They're fast. They have frameworks — JTBD, Lean, unit economics. What they lack is a system that ties these together into a sequence for their specific situation.</p>
  <p>When asked about their deepest fear, they say "I don't know." But the fear is specific:</p>

  <div class="ba-grid">
    <div class="ba-col ba-before">
      <span class="ba-label">Before — The Fear</span>
      <div class="ba-core">Being the competent executor of the wrong strategy.</div>
      <p>Working hard, moving fast — in exactly the wrong direction. Smart enough to build the machine perfectly. Not yet equipped to know which machine to build.</p>
    </div>
    <div class="ba-col">
      <span class="ba-label">After — The Relief</span>
      <div class="ba-core">"I want to be the person who sees what others miss — not through talent, but through system."</div>
      <p>What students say after finishing the course: <em>"I exited the Matrix."</em> Not a metaphor for enlightenment. A description of finally seeing the structure beneath the noise.</p>
    </div>
  </div>

  <div class="ej-frame">
    <span class="ej-label">The Emotional Job</span>
    <p>When I give everything — because the stakes demand it, or because that's my ethos — know the direction is right. Not waste it all on a perfectly executed wrong bet.</p>
  </div>

  <p class="note-small">The name must carry this paradox — not "get faster" or "get smarter." The relief of finally knowing which direction to run before committing everything you have.</p>
</section>

<hr class="divider">

<!-- 03 (was 02) ──────────────────────────────────────── -->
<section>
  <span class="section-num">03 — What It Does</span>
  <h2>Algorithms for Problems Previously Solved by Intuition</h2>
  <div class="two-col">
    <div>
      <h3>Problems with Algorithms</h3>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Launch a product</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Escape direct competition</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Define positioning</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Grow average order value</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Improve conversion</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Reduce churn</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Build an acquisition channel</div>
        <div style="font-family: var(--text); font-size: var(--fs-list-item); padding: 10px 14px; background: var(--surface); display: flex; gap: 10px; color: var(--ink);"><span style="font-family: var(--mono); font-size: 10px; color: var(--ink-55); padding-top: 2px;">→</span>Scale to a new segment</div>
      </div>
    </div>
    <div>
      <h3>What You Get</h3>
      <p style="font-size: var(--fs-secondary); margin-bottom: 16px; color: var(--ink-55);">The core feeling after mastering it:</p>
      <div class="statement" style="margin: 0 0 16px;">From any business situation, at any moment, I will find a way out. Understand where I stand. Make an informed decision. And model the future as a set of possible outcomes of my choices.</div>
      <p style="font-size: var(--fs-secondary); color: var(--ink-55); line-height: var(--lh-body);">Clarity of position. Visibility of options. Confidence that comes not from self-suggestion, but from an algorithm you've run — and can run again. For many, this is the first time strategy and intuition finally agree.</p>
    </div>
  </div>
</section>

<hr class="divider">

<!-- 04 (was 03) ──────────────────────────────────────── -->
<section>
  <span class="section-num">04 — What Makes It Different</span>
  <h2>Uniqueness lies not in the components — but in the fact that they're assembled together for the first time</h2>
  <div class="comp-row">
    <div class="comp-card theirs">
      <span class="comp-card-label">Other Methodologies</span>
      <p>Lean Startup — a launch genre, but not a growth strategy. Theory of Constraints — flow optimization, but not value creation. JTBD — customer motivation, but not a complete business algorithm. Beautiful frameworks without a coherent step-by-step algorithm.</p>
    </div>
    <div class="comp-card">
      <span class="comp-card-label">This Methodology</span>
      <p>The first integration: value creation + positioning + unit economics + risk management + goal-setting — into a single chain. No problem is left without an algorithm. 100+ mechanics — all reduced to three: create value, communicate it, choose who for.</p>
    </div>
  </div>
</section>

<hr class="divider">

<!-- 05 (was 04) ──────────────────────────────────────── -->
<section>
  <span class="section-num">05 — Positioning</span>
  <h2>How the Methodology Occupies the Mind</h2>
  <p style="margin-bottom: 28px;">A statement for the outside world — what it is, who it's for, what makes it different. Not a marketing slogan, but the axis around which everything is built: name, packaging, education, product.</p>
  <div class="positioning-block">
    <div class="positioning-row">
      <span class="positioning-label">For Whom</span>
      <div class="positioning-text">For <strong>product managers</strong> (early adopters), <strong>founders and vibe-code founders</strong> (after their first products they realize they don't see the full picture) — everyone has frameworks, but no system. Every problem is solved by intuition or by the last case study they read.</div>
    </div>
    <div class="positioning-row">
      <span class="positioning-label">What It Is</span>
      <div class="positioning-text"><em>[Name]</em> — an integral methodology that provides <strong>a step-by-step algorithm for any product and business challenge</strong>: from launch to escaping competition, from improving conversion to modeling strategy years ahead.</div>
    </div>
    <div class="positioning-row">
      <span class="positioning-label">What It Delivers</span>
      <div class="positioning-text">From any business situation, at any moment, you <strong>find a way out, understand your position, make an informed decision</strong> — and model the future as a set of possible outcomes of your choices.</div>
    </div>
    <div class="positioning-row">
      <span class="positioning-label">Unlike</span>
      <div class="positioning-text">JTBD, Theory of Constraints, Lean Startup — each covers its own part of the journey. <em>[Name]</em> — <strong>the first methodology that assembles proven tools</strong> (Advanced JTBD, Unit Economics, RAT, ABCDX, ToC, OKR) into a single decision-making chain.</div>
    </div>
    <div class="positioning-row">
      <span class="positioning-label">Context</span>
      <div class="positioning-text">Built for the <strong>agentic world</strong> — where AI assistants process large volumes of data and help model scenarios, while the methodology provides the structure that gives that data meaning.</div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- 06 (was 05) ──────────────────────────────────────── -->
<section>
  <span class="section-num">06 — Brand Character</span>
  <h2>What Kind of Person This Brand Would Be</h2>
  <p style="margin-bottom: 24px;">The name must convey this character — depth, seriousness, power. Not loud, not inspiring — foundational.</p>
  <h3>Eight Qualities</h3>
  <div class="brand-adjectives">
    <div class="adjective">depth</div>
    <div class="adjective en">advanced</div>
    <div class="adjective">masculine</div>
    <div class="adjective">driven</div>
    <div class="adjective">reliable</div>
    <div class="adjective en">curiosity</div>
    <div class="adjective">foundational</div>
    <div class="adjective en">clarity</div>
    <div class="adjective">introvert</div>
    <div class="adjective">power</div>
    <div class="adjective en">authority</div>
    <div class="adjective">lucidity</div>
  </div>
  <div class="brand-sliders">
    <div class="brand-slider">
      <span class="brand-slider-label muted">playful</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 78%;"></div></div>
      <span class="brand-slider-label active">serious</span>
    </div>
    <div class="brand-slider">
      <span class="brand-slider-label active">bold</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 14%;"></div></div>
      <span class="brand-slider-label muted">polite</span>
    </div>
    <div class="brand-slider">
      <span class="brand-slider-label muted">emotional</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 72%;"></div></div>
      <span class="brand-slider-label active">rational</span>
    </div>
    <div class="brand-slider">
      <span class="brand-slider-label active">affordable</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 28%;"></div></div>
      <span class="brand-slider-label muted">elite</span>
    </div>
    <div class="brand-slider">
      <span class="brand-slider-label active">authority</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 22%;"></div></div>
      <span class="brand-slider-label muted">friend</span>
    </div>
    <div class="brand-slider">
      <span class="brand-slider-label active">mature</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 18%;"></div></div>
      <span class="brand-slider-label muted">young</span>
    </div>
    <div class="brand-slider">
      <span class="brand-slider-label active">progressive</span>
      <div class="brand-slider-track"><div class="brand-slider-dot" style="left: 22%;"></div></div>
      <span class="brand-slider-label muted">conservative</span>
    </div>
  </div>
  <div class="tov-summary">
    <span class="tov-summary-label">TOV in One Sentence</span>
    <p>The quiet power of a seasoned professional: serious, rational, authoritative — but without snobbery, without a guru pose, and without academic dryness. Depth that draws you in.</p>
  </div>
</section>

<hr class="divider">

<!-- 07 (was 06) ──────────────────────────────────────── -->
<section>
  <span class="section-num">07 — Naming Strategy</span>
  <h2>Four Decisions That Frame the Search for a Name</h2>
  <p style="margin-bottom: 24px;">These decisions have already been aligned. They set the direction of the search — what to look for, what to avoid, which benchmarks to aim for.</p>
  <div class="strategy-grid">
    <div class="strategy-card resolved">
      <span class="strategy-tag">01 · Scale</span>
      <div class="strategy-decision">The name must be broader than the product.</div>
      <div class="strategy-rationale">The methodology currently covers <strong>product + business</strong>; in the long run — decision-making in life. The name must not narrow like <em>Lean Startup</em>. <strong>Theory of Constraints</strong> is the benchmark: it survived the journey from manufacturing into any system.</div>
    </div>
    <div class="strategy-card resolved">
      <span class="strategy-tag">02 · Audience</span>
      <div class="strategy-decision">Resonate with product managers — without closing the door further.</div>
      <div class="strategy-rationale">Early adopters — <strong>product managers</strong>. Wave 2 — <strong>founders</strong>. Wave 3 — <strong>vibe-code founders</strong>, who after their first products will realize they don't see the whole picture. The name must read to a PM as "serious tool" without being professionally limiting.</div>
    </div>
    <div class="strategy-card resolved">
      <span class="strategy-tag">03 · Approach</span>
      <div class="strategy-decision">The antifragile path — the name names a new state.</div>
      <div class="strategy-rationale">Not pure invention like <em>Xerox</em> (requires millions to load meaning). Not playful like <em>Google</em>. <strong>Antifragile</strong> — gives a name to a state that had no word. Either a new word with a clear etymology, or a combination of existing ones that creates a new concept.</div>
    </div>
    <div class="strategy-card resolved">
      <span class="strategy-tag">04 · Spirit References</span>
      <div class="strategy-decision">Theory of Constraints &gt; Antifragile &gt; Lean Startup</div>
      <div class="strategy-rationale">In that order. <strong>ToC</strong> — structural, foundational, not tied to a domain. <strong>Antifragile</strong> — philosophical weight, names something new. <strong>Lean Startup</strong> — third: the name immediately locks in the audience (startups), scale is capped.</div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- 08 (was 07) ──────────────────────────────────────── -->
<section>
  <span class="section-num">08 — Naming Criteria</span>
  <h2>What the Name Must Do</h2>
  <p style="margin-bottom: 24px;">Benchmarks: <strong>Lean Startup</strong>, <strong>Six Sigma</strong>, <strong>Theory of Constraints</strong>, <strong>Antifragile</strong>. What they share — they name the new, not describe the existing. Antifragile gave a name to a state of systems that had no word. Lean Startup named a genre that didn't exist.</p>
  <div class="criteria-grid">
    <div class="criterion">
      <span class="criterion-num">Criterion 01</span>
      <div class="criterion-title">Names the New, Not the Existing</div>
      <div class="criterion-desc">The name names "algorithmic thinking for any business challenge" — a state that previously had no word. Not "improved JTBD", not "new Lean".</div>
      <div class="criterion-check"></div>
    </div>
    <div class="criterion">
      <span class="criterion-num">Criterion 02</span>
      <div class="criterion-title">Conveys Power and Clarity</div>
      <div class="criterion-desc">The person must feel: this is serious, this works, this gives an advantage. Not soft, not inspiring — powerful and reliable.</div>
      <div class="criterion-check"></div>
    </div>
    <div class="criterion">
      <span class="criterion-num">Criterion 03</span>
      <div class="criterion-title">Easy to Pronounce</div>
      <div class="criterion-desc">The name must be easy to say aloud and memorable by ear. Flowing, without complex consonant clusters. Can be one or more words — length is not limited.</div>
      <div class="criterion-check"></div>
    </div>
    <div class="criterion">
      <span class="criterion-num">Criterion 04</span>
      <div class="criterion-title">English Language</div>
      <div class="criterion-desc">The name is in English, aimed at the international market. Can be one to several words — what matters is meaning, not length.</div>
      <div class="criterion-check"></div>
    </div>
    <div class="criterion">
      <span class="criterion-num">Criterion 05</span>
      <div class="criterion-title">Not an Acronym</div>
      <div class="criterion-desc">Not an abbreviation that needs decoding. An acronym makes you think about the decoding, not the meaning.</div>
      <div class="criterion-check"></div>
    </div>
    <div class="criterion">
      <span class="criterion-num">Criterion 06</span>
      <div class="criterion-title">Trademarkable</div>
      <div class="criterion-desc">The word is unique enough to register with the USPTO (US) and EUIPO (Madrid system). Not a dictionary word, not an existing brand.</div>
      <div class="criterion-check"></div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- 09 (was 08) ──────────────────────────────────────── -->
<section>
  <span class="section-num">09 — Hard Limits</span>
  <h2>What Definitely Won't Work</h2>
  <div class="limits">
    <div class="limit-row">
      <span class="limit-label">Overuse</span>
      <span class="limit-text">Words like <em>strategy, growth, clarity, agile, smart, lean</em> — overloaded, won't register as a unique brand.</span>
    </div>
    <div class="limit-row">
      <span class="limit-label">Acronym</span>
      <span class="limit-text">Names like AURA, CORE, APEX — perceived as abbreviations, trigger the question "what does that stand for?".</span>
    </div>
    <div class="limit-row">
      <span class="limit-label">TikTok Energy</span>
      <span class="limit-text">Playful, light, inspiring words — contradict the brand character: deep, masculine, foundational.</span>
    </div>
    <div class="limit-row">
      <span class="limit-label">Unregistrable</span>
      <span class="limit-text">Any name with an existing trademark in classes 35, 41, 42 in the US or EU.</span>
    </div>
  </div>
  <p style="margin-top: 20px; font-size: var(--fs-note); color: var(--ink-40); font-style: italic;">Note: constructions like <strong>"Theory of …"</strong> are a valid reference (Theory of Constraints), not a stop factor.</p>
</section>

<!-- 10 (was 09) ──────────────────────────────────────── -->
<div class="check-section">
  <span class="section-num">10 — Validation</span>
  <h2>Questions for Discussion</h2>
  <p>A checklist to align on before generating name options.</p>
  <ul class="check-list">
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Is the methodology description accurate? What would you change or add?</span>
        <span class="check-note">Sections 01–03 are statements for the outside world, not internal use</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Does the emotional job formulation land? "When I give everything — because the stakes demand it, or because that's my ethos — know the direction is right. Not waste it all on a perfectly executed wrong bet."</span>
        <span class="check-note">This is the condition the name must resolve — not describe, but resolve. Does this feel true?</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Is the core functional feeling accurate? "I will find a way out of any situation, understand where I am, make an informed decision, model the future."</span>
        <span class="check-note">This is what must grow into the name — not literally, but in its energy</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Does the positioning (Section 05) accurately describe the category and differentiation? What would you reformulate?</span>
        <span class="check-note">Especially: the formulation "the first methodology that assembles…" — is that the right grounding for uniqueness?</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Brand character: is everything accurate? Eight qualities and seven sliders — is this a complete character description?</span>
        <span class="check-note">What's missing or what gets in the way? Especially: which of the 7 scales matters most for the name?</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Are there words, roots, or images you definitely don't want in the name? What immediately feels "wrong"?</span>
        <span class="check-note">Counter-examples narrow things down faster than criteria "for"</span>
      </div>
    </li>
  </ul>
</div>

<div class="doc-footer">
  <span>Working Document · Not for Publication</span>
  <span>zamesin.ru · backspaceoddity.com · v0.2</span>
</div>

<button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">&#x25D0;</button>

<script>
  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
</script>

<script>
/* ── Edit Mode Panel ────────────────────────────────── */
(function () {
  var INBOX = 'http://localhost:8002/inbox';
  var STORE = 'naming-brief-edit-threads';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{"threads":{}}'); }
    catch(e) { return { threads: {} }; }
  }
  function persist(d) { d.savedAt = new Date().toISOString(); localStorage.setItem(STORE, JSON.stringify(d)); }
  function cssSel(el) {
    if (el.id) return '#' + el.id;
    var path = [], n = el;
    while (n && n !== document.body && path.length < 4) {
      if (n.id) { path.unshift('#' + n.id); break; }
      var seg = n.tagName.toLowerCase();
      if (n.classList && n.classList.length) seg += '.' + n.classList[0];
      path.unshift(seg); n = n.parentElement;
    }
    return path.join(' > ');
  }
  function mk(tag) { return document.createElement(tag); }

  /* ── Toggle button ── */
  var editBtn = mk('button');
  editBtn.innerHTML = '&#9998; Edit';
  editBtn.style.cssText = 'position:fixed;top:14px;right:16px;z-index:10000;' +
    'background:var(--paper);color:var(--ink-55);' +
    'border:1px solid var(--rule-strong);border-radius:6px;padding:5px 12px;' +
    'font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;' +
    'cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
    'box-shadow:0 1px 6px rgba(0,0,0,.10);transition:all .12s;line-height:1;white-space:nowrap;';
  document.body.appendChild(editBtn);

  /* ── Count badge ── */
  var badge = mk('span');
  badge.style.cssText = 'position:fixed;top:8px;right:8px;z-index:10001;' +
    'background:var(--ink);color:var(--paper);' +
    'border-radius:50%;min-width:18px;height:18px;padding:0 3px;' +
    'font-size:10px;font-weight:600;text-align:center;line-height:18px;' +
    'display:none;pointer-events:none;font-family:var(--mono);';
  document.body.appendChild(badge);

  /* ── Hover ring ── */
  var ring = mk('div');
  ring.style.cssText = 'position:fixed;pointer-events:none;z-index:9997;display:none;' +
    'outline:2px solid rgba(1,28,0,.35);outline-offset:2px;' +
    'background:rgba(1,28,0,.03);border-radius:4px;';
  document.body.appendChild(ring);

  /* ── Comment dialog ── */
  var dlg = mk('div');
  dlg.style.cssText = 'position:fixed;z-index:10002;display:none;' +
    'background:var(--paper);border:1.5px solid var(--rule-strong);' +
    'border-radius:12px;padding:14px;width:300px;' +
    'box-shadow:0 16px 48px rgba(0,0,0,.20);font-family:var(--text);';
  var MODE_BTN_BASE = 'flex:1;border:none;border-radius:4px;padding:3px 0;font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;';
  dlg.innerHTML = [
    '<div style="display:flex;gap:4px;margin-bottom:10px;background:var(--paper-soft);border-radius:6px;padding:3px;">',
    '<button id="em-mode-v" style="' + MODE_BTN_BASE + 'background:transparent;color:var(--ink-40);">Visual</button>',
    '<button id="em-mode-c" style="' + MODE_BTN_BASE + 'background:var(--ink);color:var(--paper);">Copy</button>',
    '</div>',
    '<p id="em-lbl" style="font-family:var(--mono);font-size:10px;letter-spacing:.06em;',
    'text-transform:uppercase;color:var(--ink-40);margin-bottom:8px;',
    'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></p>',
    '<textarea id="em-ta" rows="3" style="display:block;width:100%;box-sizing:border-box;',
    'border:1px solid var(--rule-strong);border-radius:6px;padding:9px 10px;',
    'font-family:var(--text);font-size:14px;line-height:1.5;resize:vertical;',
    'background:var(--surface);color:var(--ink);outline:none;"></textarea>',
    '<div style="display:flex;gap:8px;margin-top:8px;">',
    '<button id="em-ok" style="flex:2;background:var(--ink);color:var(--paper);border:none;',
    'border-radius:6px;padding:8px 0;font-family:var(--mono);font-size:10px;font-weight:500;',
    'letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Save &#8629;</button>',
    '<button id="em-cancel" style="flex:1;background:transparent;color:var(--ink-55);',
    'border:1px solid var(--rule-strong);border-radius:6px;padding:8px 0;',
    'font-family:var(--mono);font-size:10px;font-weight:500;',
    'letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Cancel</button>',
    '</div>'
  ].join('');
  document.body.appendChild(dlg);

  /* ── Sidebar panel ── */
  var sidePanel = mk('div');
  sidePanel.style.cssText = 'position:fixed;z-index:9999;display:none;' +
    'top:50px;right:16px;width:272px;max-height:calc(100vh - 80px);overflow-y:auto;' +
    'background:var(--paper);border:1.5px solid var(--rule-strong);' +
    'border-radius:12px;padding:12px 14px;' +
    'box-shadow:0 16px 48px rgba(0,0,0,.20);font-family:var(--text);';
  sidePanel.innerHTML = [
    '<div style="display:flex;gap:6px;margin-bottom:10px;">',
    '<button id="em-clear" style="flex:1;background:transparent;color:var(--ink-40);',
    'border:1px solid var(--rule-strong);border-radius:6px;',
    'padding:5px 0;font-family:var(--mono);font-size:9px;',
    'letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">Clear all</button>',
    '<button id="em-send" style="flex:2;background:var(--ink);color:var(--paper);',
    'border:none;border-radius:6px;padding:5px 12px;',
    'font-family:var(--mono);font-size:9px;font-weight:500;',
    'letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">&#8594; Send to Claude</button>',
    '</div>',
    '<div id="em-list"></div>'
  ].join('');
  document.body.appendChild(sidePanel);

  /* ── Helpers ── */
  function ours(el) {
    return el && (editBtn.contains(el) || badge.contains(el) || ring.contains(el) ||
                  dlg.contains(el) || sidePanel.contains(el));
  }
  function syncBadge() {
    var n = Object.keys(load().threads).length;
    badge.textContent = n; badge.style.display = n ? 'block' : 'none';
    if (n && active && sidePanel.style.display === 'none') sidePanel.style.display = 'block';
    if (!n && !active) sidePanel.style.display = 'none';
    renderPanel();
  }
  function renderPanel() {
    var threads = load().threads, list = document.getElementById('em-list');
    var ids = Object.keys(threads);
    if (!ids.length) {
      list.innerHTML = '<p style="font-family:var(--mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-40);text-align:center;padding:16px 0;line-height:1.8;">No edits yet.<br>Click any element to comment.</p>';
      return;
    }
    list.innerHTML = ids.map(function(id) {
      var t = threads[id], e = t.element;
      var snip = e.textContent.slice(0, 52) + (e.textContent.length > 52 ? '…' : '');
      var time = new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var typeLabel = t.type === 'copy' ? 'copy' : 'visual';
      return '<div style="border-top:1px solid var(--rule);padding:10px 0;">' +
        '<p style="font-family:var(--mono);font-size:9px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-40);margin-bottom:4px;">' + e.tag + ' · ' + time + ' · ' + typeLabel + '</p>' +
        (snip ? '<p style="font-family:var(--text);font-size:12px;color:var(--ink-55);margin-bottom:4px;line-height:1.4;font-style:italic;">“' + snip + '”</p>' : '') +
        '<p style="font-family:var(--text);font-size:13px;line-height:1.5;color:var(--ink);">' + t.prompt + '</p>' +
        '<button data-rm="' + id + '" style="background:none;border:none;color:var(--ink-40);font-family:var(--mono);font-size:9px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;padding:4px 0;">× remove</button>' +
        '</div>';
    }).join('');
    list.querySelectorAll('[data-rm]').forEach(function(b) {
      b.addEventListener('click', function(ev) {
        ev.stopPropagation();
        var d = load(); delete d.threads[b.dataset.rm]; persist(d); syncBadge();
      });
    });
  }

  /* ── Edit mode state ── */
  var active = false, pending = null, editMode = 'copy';

  function activate() {
    active = true;
    editBtn.innerHTML = '✕ Exit';
    editBtn.style.background = 'var(--ink)'; editBtn.style.color = 'var(--paper)';
    document.body.style.cursor = 'crosshair';
    sidePanel.style.display = 'block'; renderPanel();
    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('mouseout', onUnhover, true);
    document.addEventListener('click', onPick, true);
  }
  function deactivate() {
    active = false;
    editBtn.innerHTML = '&#9998; Edit';
    editBtn.style.background = 'var(--paper)'; editBtn.style.color = 'var(--ink-55)';
    document.body.style.cursor = '';
    ring.style.display = 'none'; closeDlg();
    document.removeEventListener('mouseover', onHover, true);
    document.removeEventListener('mouseout', onUnhover, true);
    document.removeEventListener('click', onPick, true);
    if (!Object.keys(load().threads).length) sidePanel.style.display = 'none';
  }

  editBtn.addEventListener('click', function(ev) { ev.stopPropagation(); active ? deactivate() : activate(); });

  function onHover(ev) {
    if (ours(ev.target)) { ring.style.display = 'none'; return; }
    var r = ev.target.getBoundingClientRect();
    ring.style.top = r.top + 'px'; ring.style.left = r.left + 'px';
    ring.style.width = r.width + 'px'; ring.style.height = r.height + 'px';
    ring.style.display = 'block';
  }
  function onUnhover() { ring.style.display = 'none'; }

  function onPick(ev) {
    if (ours(ev.target)) return;
    ev.preventDefault(); ev.stopPropagation();
    pending = ev.target;
    var r = ev.target.getBoundingClientRect();
    var top = r.bottom + 8;
    if (top + 230 > window.innerHeight) top = Math.max(8, r.top - 240);
    var left = Math.min(ev.clientX, window.innerWidth - 316);
    if (left < 8) left = 8;
    dlg.style.top = top + 'px'; dlg.style.left = left + 'px'; dlg.style.display = 'block';
    var tag = ev.target.tagName.toLowerCase();
    var cls = ev.target.classList[0] ? '.' + ev.target.classList[0] : '';
    var text = ev.target.textContent.trim().slice(0, 42);
    document.getElementById('em-lbl').textContent = tag + cls + ': "' + text + '"';
    var ta = document.getElementById('em-ta');
    ta.value = ''; ta.placeholder = editMode === 'copy' ? 'What copy change?' : 'What layout/style change?';
    setTimeout(function() { ta.focus(); }, 40);
    ta.onkeydown = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
      if (e.key === 'Escape') closeDlg();
    };
  }
  function closeDlg() { dlg.style.display = 'none'; pending = null; }
  function saveEdit() {
    var ta = document.getElementById('em-ta'), txt = ta.value.trim();
    if (!txt) { closeDlg(); return; }
    var id = 'edit-' + Date.now(), d = load();
    d.threads[id] = { id: id, type: editMode, prompt: txt,
      element: { tag: pending.tagName.toLowerCase(), className: pending.className || '',
        textContent: pending.textContent.trim().slice(0, 100), selector: cssSel(pending), styles: {} },
      status: 'pending', createdAt: new Date().toISOString() };
    persist(d); closeDlg(); syncBadge();
    var prev = pending.style.outline;
    pending.style.outline = '2px solid var(--ink)';
    var el = pending;
    setTimeout(function() { el.style.outline = prev; }, 700);
  }

  document.getElementById('em-ok').addEventListener('click', function(ev) { ev.stopPropagation(); saveEdit(); });
  document.getElementById('em-cancel').addEventListener('click', function(ev) { ev.stopPropagation(); closeDlg(); });

  function setMode(m) {
    editMode = m;
    var mv = document.getElementById('em-mode-v'), mc = document.getElementById('em-mode-c');
    if (!mv || !mc) return;
    mv.style.background = m === 'visual' ? 'var(--ink)' : 'transparent';
    mv.style.color      = m === 'visual' ? 'var(--paper)' : 'var(--ink-40)';
    mc.style.background = m === 'copy'   ? 'var(--ink)' : 'transparent';
    mc.style.color      = m === 'copy'   ? 'var(--paper)' : 'var(--ink-40)';
  }
  document.getElementById('em-mode-v').addEventListener('click', function(ev) { ev.stopPropagation(); setMode('visual'); });
  document.getElementById('em-mode-c').addEventListener('click', function(ev) { ev.stopPropagation(); setMode('copy'); });

  document.getElementById('em-send').addEventListener('click', function(ev) {
    ev.stopPropagation();
    var sendBtn = document.getElementById('em-send'), data = load();
    if (!Object.keys(data.threads).length) {
      sendBtn.textContent = '— no edits'; setTimeout(function() { sendBtn.innerHTML = '&#8594; Send to Claude'; }, 1200); return;
    }
    fetch(INBOX, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function() {
        persist({ threads: {} }); syncBadge();
        sendBtn.textContent = '✓ Sent!';
        setTimeout(function() { sendBtn.innerHTML = '&#8594; Send to Claude'; }, 2000);
      }).catch(function() {
        sendBtn.textContent = '✗ Server off';
        setTimeout(function() { sendBtn.innerHTML = '&#8594; Send to Claude'; }, 2500);
      });
  });
  document.getElementById('em-clear').addEventListener('click', function(ev) {
    ev.stopPropagation();
    if (confirm('Remove all pending edits?')) { persist({ threads: {} }); syncBadge(); }
  });

  document.addEventListener('keydown', function(ev) {
    if (ev.key !== 'Escape') return;
    if (dlg.style.display !== 'none') closeDlg(); else if (active) deactivate();
  });

  syncBadge();
}());
</script>

<script>
/* ── Font Tweaks Panel ──────────────────────────────── */
(function () {
  var SIZES = [
    { key: '--fs-h2',          label: 'H2 headings',      def: 32, min: 20, max: 56 },
    { key: '--fs-body',        label: 'Body text',         def: 17, min: 12, max: 28 },
    { key: '--fs-statement',   label: 'Pull quote',        def: 22, min: 14, max: 40 },
    { key: '--fs-ba-core',     label: 'Before/After head', def: 20, min: 14, max: 36 },
    { key: '--fs-ej-frame',    label: 'EJ frame',          def: 24, min: 16, max: 44 },
    { key: '--fs-strategy',    label: 'Strategy card',     def: 22, min: 14, max: 40 },
    { key: '--fs-tov-summary', label: 'TOV summary',       def: 20, min: 14, max: 36 },
    { key: '--fs-secondary',   label: 'Secondary body',    def: 15, min: 12, max: 24 },
    { key: '--fs-small',       label: 'Small / captions',  def: 14, min: 11, max: 20 },
    { key: '--fs-positioning', label: 'Positioning text',  def: 17, min: 12, max: 24 },
    { key: '--fs-note',        label: 'Notes',             def: 13, min: 10, max: 18 },
    { key: '--fs-list-item',   label: 'List items',        def: 16, min: 12, max: 24 },
    { key: '--fs-section-num',  label: 'Section labels',    def: 13, min: 10, max: 18 },
    { key: '--fs-pos-label',    label: 'Positioning labels',def: 12, min: 10, max: 18 },
    { key: '--fs-adjective',         label: 'Brand adjectives',   def: 14, min: 11, max: 22 },
    { key: '--fs-adjective-en',      label: 'Adj. EN italic',     def: 16, min: 12, max: 24 },
    { key: '--fs-strategy-rationale',label: 'Strategy rationale', def: 17, min: 13, max: 26 },
  ];
  /* line-heights stored as integers ×100 (e.g. 170 = 1.70) */
  var LINE_HEIGHTS = [
    { key: '--lh-body',    label: 'Body line-height',    def: 170, min: 130, max: 220 },
    { key: '--lh-heading', label: 'Heading line-height', def: 115, min: 100, max: 160 },
    { key: '--lh-quote',   label: 'Quote line-height',   def: 150, min: 120, max: 200 },
    { key: '--lh-ba-core', label: 'B/A line-height',     def: 135, min: 110, max: 180 },
  ];
  var STORE = 'naming-brief-tweaks';
  var INBOX = 'http://localhost:8002/inbox';

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch(e) { return {}; }
  }
  function applyPx(k, v) {
    document.documentElement.style.setProperty(k, v + 'px');
    var s = loadSaved(); s[k] = Number(v);
    localStorage.setItem(STORE, JSON.stringify(s));
  }
  function applyLh(k, v) {
    document.documentElement.style.setProperty(k, (v / 100).toFixed(2));
    var s = loadSaved(); s[k] = Number(v);
    localStorage.setItem(STORE, JSON.stringify(s));
  }

  /* Apply saved on load */
  var saved = loadSaved();
  SIZES.forEach(function(s) {
    if (saved[s.key] !== undefined) document.documentElement.style.setProperty(s.key, saved[s.key] + 'px');
  });
  LINE_HEIGHTS.forEach(function(lh) {
    if (saved[lh.key] !== undefined) document.documentElement.style.setProperty(lh.key, (saved[lh.key] / 100).toFixed(2));
  });

  function sectionLabel(text) {
    return '<p style="font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.1em;' +
      'text-transform:uppercase;color:var(--ink-40);margin:12px 0 4px;">' + text + '</p>';
  }
  function pxRow(s) {
    var cur = saved[s.key] !== undefined ? saved[s.key] : s.def;
    var sid = 'tw' + s.key.replace(/[^a-z0-9]/gi, '_');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--rule);">' +
      '<span style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);white-space:nowrap;min-width:96px;">' + s.label + '</span>' +
      '<div style="display:flex;align-items:center;gap:5px;">' +
      '<input type="range" data-type="px" min="' + s.min + '" max="' + s.max + '" value="' + cur + '" data-key="' + s.key + '" style="width:68px;cursor:pointer;accent-color:var(--ink);">' +
      '<span id="' + sid + '" style="font-family:var(--mono);font-size:9px;color:var(--ink-55);min-width:28px;text-align:right;">' + cur + 'px</span>' +
      '</div></div>';
  }
  function lhRow(lh) {
    var cur = saved[lh.key] !== undefined ? saved[lh.key] : lh.def;
    var sid = 'tw' + lh.key.replace(/[^a-z0-9]/gi, '_');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--rule);">' +
      '<span style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);white-space:nowrap;min-width:96px;">' + lh.label + '</span>' +
      '<div style="display:flex;align-items:center;gap:5px;">' +
      '<input type="range" data-type="lh" min="' + lh.min + '" max="' + lh.max + '" value="' + cur + '" data-key="' + lh.key + '" style="width:68px;cursor:pointer;accent-color:var(--ink);">' +
      '<span id="' + sid + '" style="font-family:var(--mono);font-size:9px;color:var(--ink-55);min-width:28px;text-align:right;">' + (cur/100).toFixed(2) + '</span>' +
      '</div></div>';
  }

  var panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;bottom:74px;right:24px;z-index:9998;display:none;' +
    'background:var(--paper);border:1.5px solid var(--rule-strong);padding:14px 16px;width:248px;' +
    'max-height:80vh;overflow-y:auto;box-shadow:0 4px 24px rgba(0,0,0,.16);';

  panel.innerHTML =
    sectionLabel('Font sizes') +
    SIZES.map(pxRow).join('') +
    sectionLabel('Line heights') +
    LINE_HEIGHTS.map(lhRow).join('') +
    '<div style="display:flex;gap:6px;margin-top:14px;">' +
    '<button id="tw-save" style="flex:2;background:var(--ink);color:var(--paper);border:none;' +
    'padding:7px 0;font-family:var(--mono);font-size:10px;letter-spacing:.06em;' +
    'text-transform:uppercase;cursor:pointer;">&#8594; Save to Claude</button>' +
    '<button id="tw-reset" style="flex:1;background:transparent;border:1px solid var(--rule-strong);' +
    'padding:7px 0;font-family:var(--mono);font-size:10px;letter-spacing:.06em;' +
    'text-transform:uppercase;color:var(--ink-55);cursor:pointer;">&#8635; Reset</button>' +
    '</div>';

  document.body.appendChild(panel);

  panel.querySelectorAll('input[type="range"]').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var sid = 'tw' + inp.dataset.key.replace(/[^a-z0-9]/gi, '_');
      var sp = document.getElementById(sid);
      if (inp.dataset.type === 'lh') {
        if (sp) sp.textContent = (inp.value / 100).toFixed(2);
        applyLh(inp.dataset.key, inp.value);
      } else {
        if (sp) sp.textContent = inp.value + 'px';
        applyPx(inp.dataset.key, inp.value);
      }
    });
  });

  document.getElementById('tw-reset').addEventListener('click', function() {
    localStorage.removeItem(STORE);
    SIZES.forEach(function(s) { document.documentElement.style.setProperty(s.key, s.def + 'px'); });
    LINE_HEIGHTS.forEach(function(lh) { document.documentElement.style.setProperty(lh.key, (lh.def/100).toFixed(2)); });
    panel.remove(); btn.remove();
  });

  document.getElementById('tw-save').addEventListener('click', function() {
    var saveBtn = document.getElementById('tw-save');
    var current = loadSaved();
    var payload = { type: 'font-tweaks', source: 'naming-brief', values: current, savedAt: new Date().toISOString() };
    fetch(INBOX, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function() {
        saveBtn.textContent = '✓ Sent!';
        setTimeout(function() { saveBtn.textContent = '→ Save to Claude'; }, 2000);
      })
      .catch(function() {
        saveBtn.textContent = '✗ Server off';
        saveBtn.style.background = '#a00';
        setTimeout(function() { saveBtn.textContent = '→ Save to Claude'; saveBtn.style.background = 'var(--ink)'; }, 2500);
      });
  });

  var btn = document.createElement('button');
  btn.textContent = 'Aa';
  btn.title = 'Font tweaks';
  btn.style.cssText = 'position:fixed;bottom:24px;right:70px;z-index:9999;width:40px;height:40px;' +
    'border-radius:50%;border:1.5px solid var(--rule-strong);background:var(--paper);' +
    'color:var(--ink);font-size:15px;cursor:pointer;display:flex;align-items:center;' +
    'justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.10);' +
    'font-family:var(--display);line-height:1;transition:border-color .15s;';

  btn.addEventListener('click', function() {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  document.body.appendChild(btn);
})();
</script>

</body>
</html>`;

export async function GET(req: Request) {
  if (!ACCESS_KEY) {
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  if (getCookie(req, COOKIE) !== token()) {
    return new NextResponse(loginHtml(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function POST(req: Request) {
  const body    = await req.text();
  const entered = new URLSearchParams(body).get('code') ?? '';
  if (entered === ACCESS_KEY) {
    const res = NextResponse.redirect(new URL('/ajtbd-naming-brief', req.url), 303);
    res.cookies.set(COOKIE, token(), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 90, // 90 days
      path: '/ajtbd-naming-brief',
    });
    return res;
  }
  return new NextResponse(loginHtml(true), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
