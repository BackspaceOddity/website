/**
 * Interactive Proposal Workspace — design system CSS (v1)
 *
 * Extracted verbatim from app/ajtbd-naming-brief/route.ts so per-client pages
 * share one source of truth for the Backspace Oddity look (GT Eesti Pro,
 * --ink/--paper, light/dark). Edit here, not per page.
 */

export const styles = `
  @font-face {
    font-family: 'GT Eesti Pro Display';
    src: url('/fonts/GTEestiProDisplay-Regular.ttf') format('truetype');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Display';
    src: url('/fonts/GTEestiProDisplay-RegularItalic.ttf') format('truetype');
    font-weight: 400; font-style: italic; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Regular.ttf') format('truetype');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-RegularItalic.ttf') format('truetype');
    font-weight: 400; font-style: italic; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Medium.ttf') format('truetype');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Text';
    src: url('/fonts/GTEestiProText-Bold.ttf') format('truetype');
    font-weight: 700; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Display';
    src: url('/fonts/GTEestiProDisplay-Medium.ttf') format('truetype');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'GT Eesti Pro Display';
    src: url('/fonts/GTEestiProDisplay-Bold.ttf') format('truetype');
    font-weight: 700; font-style: normal; font-display: swap;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Brand colour tokens — approved AI Skills Landing CORE palette:
       cream #F2F2F0 / cream-soft #E8E8E6 / ivory #FAFAF8 / dark-green #011C00.
       No accent colour (the landing's amber signal is landing-specific, not brand). */
    --ink: #011C00;
    --paper: #F2F2F0;
    --paper-soft: #E8E8E6;
    --surface: #FAFAF8;
    --rule: rgba(1, 28, 0, 0.12);
    --rule-strong: rgba(1, 28, 0, 0.22);
    --ink-55: rgba(1, 28, 0, 0.55);
    --ink-40: rgba(1, 28, 0, 0.40);
    --ink-25: rgba(1, 28, 0, 0.25);
    --on-dark-primary:    rgba(242, 242, 240, 0.92);
    --on-dark-secondary:  rgba(242, 242, 240, 0.65);
    --em-ring: #3D6A4E;
    --on-dark-muted:      rgba(242, 242, 240, 0.42);
    --on-dark-border:     rgba(242, 242, 240, 0.22);
    --display: 'GT Eesti Pro Display', system-ui, sans-serif;
    --text:    'GT Eesti Pro Text',    system-ui, sans-serif;
    --mono:    ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    --fs-h2:          42px;
    --fs-body:        22px;
    --fs-statement:   22px;
    --fs-ba-core:     22px;
    --fs-ej-frame:    26px;
    --fs-tov-summary: 26px;
    --fs-secondary:        15px;
    --fs-small:       16px;
    --fs-note:        16px;
    --fs-list-item:   19px;
    --fs-section-num: 13px;
    --lh-body:    1.50;
    --lh-heading: 1.15;
    --lh-quote:   1.5;
    --lh-ba-core: 1.35;
    /* ── Weight + style tokens (adjustable via Tweaks panel) ── */
    --w-h2: 400;          --st-h2: normal;
    --w-body: 400;        --st-body: normal;
    --w-statement: 400;   --st-statement: italic;
    --w-ba-core: 400;     --st-ba-core: italic;
    --w-ej-frame: 400;    --st-ej-frame: italic;
    --w-list-item: 500;   --st-list-item: normal;
    --w-section-num: 400; --st-section-num: italic;
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
    --em-ring: #E8F0EA;
  }

  html { background: var(--paper); color: var(--ink); font-family: var(--text); }

  body { max-width: 860px; margin: 0 auto; padding: 60px 40px 100px; }

  /* ── Header ── */
  .doc-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 28px; border-bottom: 1.5px solid var(--ink); margin-bottom: 48px;
  }
  .doc-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-40); }
  .doc-meta { font-family: var(--mono); font-size: 11px; color: var(--ink-40); margin-top: 4px; }
  .doc-date { font-family: var(--mono); font-size: 11px; color: var(--ink-40); text-align: right; line-height: 1.7; }

  /* ── Typography ── */
  .section-num { font-family: var(--text); font-weight: var(--w-section-num); font-style: var(--st-section-num); font-size: var(--fs-section-num); letter-spacing: 0.05em; color: var(--ink-55); margin-bottom: 10px; display: block; }
  h2 { font-family: var(--display); font-size: var(--fs-h2); font-weight: var(--w-h2); font-style: var(--st-h2); line-height: var(--lh-heading); margin-bottom: 22px; color: var(--ink); }
  h3 { font-family: var(--text); font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; color: var(--ink-55); }
  p { font-family: var(--text); font-weight: var(--w-body); font-style: var(--st-body); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--ink); }
  p + p { margin-top: 12px; }
  a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--rule-strong); }
  a:hover { text-decoration-color: var(--ink); }

  .divider { border: none; border-top: 1px solid var(--rule); margin: 48px 0; }

  /* Each section owns its top gap so spacing is uniform whether or not a
     divider precedes it. Margins collapse with an adjacent .divider, so
     divider'd sections keep the same rhythm. First section's gap collapses
     with .doc-header margin-bottom. */
  body > section { margin-top: 48px; }

  /* ── Statement / pull quote ── */
  .statement {
    font-family: var(--display); font-size: var(--fs-statement); line-height: var(--lh-quote);
    font-weight: var(--w-statement); font-style: var(--st-statement); color: var(--ink); border-left: 3px solid var(--rule-strong);
    padding-left: 24px; margin: 28px 0;
  }

  /* ── Pills ── */
  .pill-group { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .pill { font-family: var(--mono); font-size: 11px; padding: 6px 12px; border: 1px solid var(--rule-strong); border-radius: 2px; color: var(--ink-55); letter-spacing: 0.04em; }

  /* ── Before / After ── */
  .ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 28px 0; }
  .ba-col { padding: 24px; background: var(--surface); }
  .ba-col.ba-before { background: var(--paper-soft); }
  .ba-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-40); display: block; margin-bottom: 14px; }
  .ba-core { font-family: var(--display); font-size: var(--fs-ba-core); line-height: var(--lh-ba-core); font-weight: var(--w-ba-core); font-style: var(--st-ba-core); color: var(--ink); margin-bottom: 12px; }
  .ba-col p { font-family: var(--text); font-size: var(--fs-secondary); line-height: var(--lh-body); color: var(--ink-55); }

  /* ── Emphasis frame (dark) ── */
  .ej-frame { background: var(--ink); padding: 28px 32px; margin: 28px 0 20px; }
  .ej-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--on-dark-muted); display: block; margin-bottom: 12px; }
  .ej-frame p { font-family: var(--display); font-size: var(--fs-ej-frame); line-height: var(--lh-quote); font-weight: var(--w-ej-frame); font-style: var(--st-ej-frame); color: var(--on-dark-primary); }
  .note-small { font-family: var(--text); font-size: var(--fs-note); color: var(--ink-40); font-style: italic; line-height: 1.6; margin-top: 4px; }

  /* ── Two-column ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }

  /* ── Next steps ── */
  .steps { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
  .step-row { display: flex; gap: 14px; align-items: flex-start; padding: 16px 18px; background: var(--surface); border-left: 3px solid var(--rule-strong); }
  .step-num { font-family: var(--mono); font-size: 11px; color: var(--ink-40); padding-top: 3px; min-width: 26px; }
  .step-body .step-title { font-family: var(--text); font-size: var(--fs-list-item); font-weight: var(--w-list-item); font-style: var(--st-list-item); color: var(--ink); margin-bottom: 4px; }
  .step-body .step-desc { font-family: var(--text); font-size: var(--fs-secondary); line-height: var(--lh-body); color: var(--ink-55); }
  .next-link { display: inline-block; margin-top: 20px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }

  /* ── Demo (tailored example) ── */
  .demo-frame { margin-top: 8px; padding: 28px; background: var(--surface); border: 1px solid var(--rule); }

  /* ── Discussion (inverted) ── */
  .check-section { background: var(--ink); color: var(--paper); padding: 36px 40px; margin-top: 48px; }
  .check-section .section-num { color: var(--on-dark-muted); font-style: italic; }
  .check-section h2 { color: var(--on-dark-primary); margin-bottom: 24px; }
  .check-section p { color: var(--on-dark-secondary); font-size: var(--fs-small); }
  .check-list { list-style: none; margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
  .check-list li { display: flex; gap: 16px; align-items: flex-start; font-size: var(--fs-small); line-height: 1.55; color: var(--on-dark-primary); }
  .check-box { width: 20px; height: 20px; border: 1.5px solid var(--on-dark-border); border-radius: 2px; flex-shrink: 0; margin-top: 1px; }
  .check-question { color: var(--on-dark-primary); }
  .check-note { display: block; font-family: var(--mono); font-size: 11px; color: var(--on-dark-muted); margin-top: 3px; }

  /* ── Footer ── */
  .doc-footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; }
  .doc-footer span { font-family: var(--mono); font-size: 11px; color: var(--ink-40); }

  /* ── Theme toggle ── */
  .theme-toggle {
    position: fixed; bottom: 24px; right: 24px; width: 40px; height: 40px; border-radius: 50%;
    border: 1.5px solid var(--rule-strong); background: var(--paper); color: var(--ink);
    font-size: 17px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, background 0.15s, color 0.15s; z-index: 999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10); line-height: 1;
  }
  .theme-toggle:hover { border-color: var(--ink-55); }

  @media print {
    body { padding: 30px; }
    .check-section { break-inside: avoid; }
    .theme-toggle { display: none; }
  }

  @media (max-width: 640px) {
    body { padding: 32px 20px 80px; }
    .two-col, .ba-grid { grid-template-columns: 1fr; }
    h2 { font-size: 34px; }
  }
`;
