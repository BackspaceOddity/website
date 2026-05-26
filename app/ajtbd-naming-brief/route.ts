import { NextResponse } from 'next/server';

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
<title>Methodology — Naming</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Roboto+Mono:wght@400;500&family=Roboto+Serif:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f0e0d;
    --paper: #f5f2ee;
    --warm-mid: #9c8b78;
    --accent: #c2440f;
    --accent-soft: #f0e0d8;
    --rule: #d9d2c8;
    --mono: ui-monospace, 'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace;
    --serif: 'Roboto Serif', 'New York', Georgia, serif;
    --sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  }

  html { background: var(--paper); color: var(--ink); font-family: var(--sans); }

  body {
    max-width: 860px;
    margin: 0 auto;
    padding: 60px 40px 100px;
  }

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
    color: var(--warm-mid);
  }
  .doc-date {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--warm-mid);
    text-align: right;
  }

  .section-num {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
    display: block;
  }
  h2 {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 400;
    line-height: 1.15;
    margin-bottom: 20px;
  }
  h3 {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 12px;
    color: var(--ink);
  }

  p {
    font-size: 15px;
    line-height: 1.7;
    color: #2a2724;
  }
  p + p { margin-top: 12px; }

  .divider {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 48px 0;
  }

  .statement {
    font-family: var(--serif);
    font-size: 21px;
    line-height: 1.55;
    font-style: italic;
    color: var(--ink);
    border-left: 3px solid var(--accent);
    padding-left: 24px;
    margin: 28px 0;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

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
    border: 1px solid var(--warm-mid);
    border-radius: 2px;
    color: var(--warm-mid);
    letter-spacing: 0.04em;
  }

  .criteria-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 8px;
  }
  .criterion {
    background: white;
    padding: 18px 20px;
    position: relative;
  }
  .criterion-num {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--warm-mid);
    display: block;
    margin-bottom: 6px;
  }
  .criterion-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .criterion-desc {
    font-size: 13px;
    line-height: 1.55;
    color: #5a534c;
  }
  .criterion-check {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 22px;
    height: 22px;
    border: 1.5px solid var(--rule);
    border-radius: 2px;
  }

  .limits {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .limit-row {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 16px;
    background: #fdf6f3;
    border-left: 3px solid var(--accent);
  }
  .limit-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    white-space: nowrap;
    padding-top: 1px;
    min-width: 70px;
  }
  .limit-text {
    font-size: 13.5px;
    line-height: 1.55;
    color: #2a2724;
  }

  .comp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 8px;
  }
  .comp-card {
    padding: 16px 18px;
    background: white;
  }
  .comp-card.theirs {
    background: #f5f2ee;
  }
  .comp-card-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--warm-mid);
    margin-bottom: 8px;
    display: block;
  }
  .comp-card p {
    font-size: 13px;
    line-height: 1.6;
    color: #3a3530;
  }

  .check-section {
    background: var(--ink);
    color: var(--paper);
    padding: 36px 40px;
    margin-top: 48px;
  }
  .check-section .section-num { color: #c2440f; }
  .check-section h2 { color: var(--paper); margin-bottom: 24px; }
  .check-section p { color: #b8b0a6; font-size: 14px; }
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
    font-size: 14px;
    line-height: 1.55;
    color: #e8e0d6;
  }
  .check-box {
    width: 20px;
    height: 20px;
    border: 1.5px solid #6b6560;
    border-radius: 2px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .check-question { color: #e8e0d6; }
  .check-note {
    display: block;
    font-family: var(--mono);
    font-size: 11px;
    color: #7a7068;
    margin-top: 3px;
  }

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
    color: var(--warm-mid);
  }

  @media print {
    body { padding: 30px; }
    .check-section { break-inside: avoid; }
  }

  .positioning-block {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 0 28px;
    margin-top: 8px;
  }
  .positioning-row { display: contents; }
  .positioning-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    padding-top: 4px;
    border-top: 1px solid var(--rule);
  }
  .positioning-text {
    font-size: 15px;
    line-height: 1.65;
    color: #2a2724;
    padding: 16px 0 22px;
    border-top: 1px solid var(--rule);
  }
  .positioning-text strong { font-weight: 600; color: var(--ink); }
  .positioning-text em {
    font-family: var(--serif);
    font-style: italic;
    font-size: 17px;
  }

  .brand-adjectives {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-top: 8px;
  }
  .adjective {
    background: white;
    padding: 18px 14px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
    position: relative;
  }
  .adjective.en {
    font-family: var(--serif);
    font-style: italic;
    font-size: 17px;
    color: var(--accent);
  }
  .adjective::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 4px;
    height: 4px;
    background: var(--rule);
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
  .brand-slider-label { font-size: 13.5px; font-family: var(--sans); }
  .brand-slider-label.active { font-weight: 600; color: var(--ink); }
  .brand-slider-label.muted { color: var(--warm-mid); font-weight: 300; }
  .brand-slider-label:first-child { text-align: left; }
  .brand-slider-label:last-child { text-align: right; }
  .brand-slider-track { position: relative; height: 1px; background: var(--rule); }
  .brand-slider-dot {
    position: absolute;
    top: 50%;
    width: 11px;
    height: 11px;
    background: var(--accent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 4px var(--paper);
  }
  .brand-slider-dot::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px solid var(--accent);
    border-radius: 50%;
    opacity: 0.25;
  }

  .tov-summary {
    margin-top: 32px;
    padding: 22px 26px;
    background: white;
    border-left: 3px solid var(--ink);
  }
  .tov-summary-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--warm-mid);
    display: block;
    margin-bottom: 8px;
  }
  .tov-summary p {
    font-family: var(--serif);
    font-size: 18px;
    line-height: 1.55;
    font-style: italic;
    color: var(--ink);
  }

  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
  }
  .strategy-card {
    background: white;
    padding: 22px 24px;
    border-top: 2px solid var(--accent);
    position: relative;
  }
  .strategy-tag {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--warm-mid);
    display: block;
    margin-bottom: 10px;
  }
  .strategy-decision {
    font-family: var(--serif);
    font-size: 20px;
    line-height: 1.25;
    color: var(--ink);
    margin-bottom: 12px;
    font-style: italic;
  }
  .strategy-rationale { font-size: 13.5px; line-height: 1.6; color: #5a534c; }
  .strategy-rationale strong { color: var(--ink); font-weight: 600; }
  .strategy-card.resolved::after {
    content: '\\2713 resolved';
    position: absolute;
    top: 22px;
    right: 24px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
  }

  /* ── Dark theme ──────────────────────────────────── */
  html.dark {
    --ink: #ede8e0;
    --paper: #111010;
    --warm-mid: #6e6258;
    --accent: #d4562a;
    --accent-soft: #2a1a12;
    --rule: #2a2520;
  }

  /* Hardcoded text colors */
  html.dark p { color: #c8c0b6; }
  html.dark .criterion-desc { color: #9a9088; }
  html.dark .limit-text { color: #c8c0b6; }
  html.dark .comp-card p { color: #b8b0a6; }
  html.dark .strategy-rationale { color: #9a9088; }
  html.dark .positioning-text { color: #c8c0b6; }

  /* Surface colors */
  html.dark .criterion { background: #1c1916; }
  html.dark .comp-card { background: #1c1916; }
  html.dark .comp-card.theirs { background: #161310; }
  html.dark .limit-row { background: #1a1210; }
  html.dark .adjective { background: #1c1916; }
  html.dark .strategy-card { background: #1c1916; }
  html.dark .tov-summary { background: #1c1916; }

  /* Inline background: white on section-02 arrow rows */
  html.dark [style*="background: white"] { background: #1c1916 !important; }

  /* Check section inverts to cream in dark mode — adjust text inside it */
  html.dark .check-section p { color: #3a3530; }
  html.dark .check-list li { color: #2a2724; }
  html.dark .check-question { color: #2a2724; }
  html.dark .check-note { color: #5a534c; }
  html.dark .check-box { border-color: #9a9088; }

  /* Theme toggle button */
  .theme-toggle {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--rule);
    background: var(--paper);
    color: var(--ink);
    font-size: 17px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    line-height: 1;
  }
  .theme-toggle:hover { border-color: var(--warm-mid); }

  @media print { .theme-toggle { display: none; } }
</style>
</head>
<body>

<div class="doc-header">
  <div>
    <div class="doc-label">Working Document · Methodology Naming</div>
    <div style="font-family: var(--mono); font-size: 11px; color: var(--warm-mid); margin-top: 4px;">Author: Ivan Zamesin · zamesin.ru</div>
  </div>
  <div class="doc-date">Version 0.1<br>May 2026</div>
</div>

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

<section>
  <span class="section-num">02 — What It Does</span>
  <h2>Algorithms for Problems Previously Solved by Intuition</h2>
  <div class="two-col">
    <div>
      <h3>Problems with Algorithms</h3>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Launch a product</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Escape direct competition</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Define positioning</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Grow average order value</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Improve conversion</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Reduce churn</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Build an acquisition channel</div>
        <div style="font-size: 14px; padding: 10px 14px; background: white; display: flex; gap: 10px;"><span style="font-family: var(--mono); font-size: 10px; color: var(--accent); padding-top: 2px;">→</span>Scale to a new segment</div>
      </div>
    </div>
    <div>
      <h3>What You Get</h3>
      <p style="font-size: 14px; margin-bottom: 16px;">The core feeling after mastering it:</p>
      <div class="statement" style="font-size: 17px; margin: 0 0 16px;">From any business situation, at any moment, I will find a way out. Understand where I stand. Make an informed decision. And model the future as a set of possible outcomes of my choices.</div>
      <p style="font-size: 13.5px; color: #5a534c; line-height: 1.65;">Clarity of position. Visibility of options. The ability to model consequences. Confidence in your choice — not as self-suggestion, but as the outcome of an algorithm you've run.</p>
    </div>
  </div>
</section>

<hr class="divider">

<section>
  <span class="section-num">03 — What Makes It Different</span>
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

<section>
  <span class="section-num">04 — Positioning</span>
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

<section>
  <span class="section-num">05 — Brand Character</span>
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

<section>
  <span class="section-num">06 — Naming Strategy</span>
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

<section>
  <span class="section-num">07 — Naming Criteria</span>
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

<section>
  <span class="section-num">08 — Hard Limits</span>
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
  <p style="margin-top: 20px; font-size: 13px; color: var(--warm-mid); font-style: italic;">Note: constructions like <strong>"Theory of …"</strong> are a valid reference (Theory of Constraints), not a stop factor.</p>
</section>

<div class="check-section">
  <span class="section-num">09 — Validation</span>
  <h2>Questions for Discussion</h2>
  <p>A checklist to align on before generating name options.</p>
  <ul class="check-list">
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Is the methodology description accurate? What would you change or add?</span>
        <span class="check-note">Sections 01–02 are statements for the outside world, not internal use</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Is the core feeling formulated accurately? "I will find a way out of any situation, understand where I am, make an informed decision, model the future."</span>
        <span class="check-note">This is what must grow into the name — not literally, but in its energy</span>
      </div>
    </li>
    <li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">Does the positioning (Section 04) accurately describe the category and differentiation? What would you reformulate?</span>
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
  <span>zamesin.ru · Methodology v0.1</span>
</div>

<button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">&#x25D0;</button>

<script>
  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
</script>

</body>
</html>`;

export async function GET() {
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
