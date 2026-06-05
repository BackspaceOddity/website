import { buildScript } from '@backspace-oddity/edit-mode/build-script';

/**
 * Throwaway sandbox landing — exists only to exercise the CANONICAL Edit Mode
 * (@backspace-oddity/edit-mode) in isolation. Served as a route handler so it
 * bypasses app/layout.tsx — no nav, no globals.css, and crucially NO legacy
 * EditModeShell fork. The only Edit Mode here is the canonical package panel.
 *
 * NOT a client-facing page. Placeholder product ("Orbit") copy is deliberate.
 */
export const dynamic = 'force-dynamic';

const TWEAKS = {
  sizes: [
    { k: '--fs-h1', l: 'Hero H1', d: 76, min: 40, max: 140 },
    { k: '--fs-h2', l: 'Section H2', d: 40, min: 24, max: 80 },
    { k: '--fs-body', l: 'Body', d: 21, min: 14, max: 32 },
  ],
  lineHeights: [
    { k: '--lh-head', l: 'Heading LH', d: 100, min: 80, max: 140 },
    { k: '--lh-body', l: 'Body LH', d: 155, min: 100, max: 200 },
  ],
  weightStyles: [
    { l: 'Body', w: '--w-body', s: '--st-body', wd: '400', sd: 'normal' },
  ],
  weightOptions: [
    ['100|normal', 'Ultra Light'], ['200|normal', 'Thin'], ['300|normal', 'Light'],
    ['400|normal', 'Regular'], ['500|normal', 'Medium'], ['700|normal', 'Bold'],
    ['800|normal', 'Ultra Bold'],
    ['100|italic', 'Ultra Light Italic'], ['200|italic', 'Thin Italic'], ['300|italic', 'Light Italic'],
    ['400|italic', 'Italic'], ['500|italic', 'Medium Italic'], ['700|italic', 'Bold Italic'],
    ['800|italic', 'Ultra Bold Italic'],
  ],
  fontFamilies: [
    { k: '--font-display', l: 'Display (headings)', d: 'GT Eesti Pro Display' },
    { k: '--font-text',    l: 'Text (body)',         d: 'GT Eesti Pro Text' },
  ],
};

export function GET() {
  const editPanel =
    process.env.NODE_ENV !== 'production'
      ? buildScript({ slug: 'playground', inboxBase: 'http://localhost:8002', tweaks: TWEAKS })
      : '';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Playground — Edit Mode sandbox</title>
<style>
  @font-face { font-family:"GT Eesti Pro Display"; src:url("/fonts/GTEestiProDisplay-Regular.ttf") format("truetype"); font-weight:400; font-style:normal; font-display:swap; }
  @font-face { font-family:"GT Eesti Pro Display"; src:url("/fonts/GTEestiProDisplay-Bold.ttf") format("truetype"); font-weight:700; font-style:normal; font-display:swap; }
  @font-face { font-family:"GT Eesti Pro Text"; src:url("/fonts/GTEestiProText-Regular.ttf") format("truetype"); font-weight:400; font-style:normal; font-display:swap; }
  @font-face { font-family:"GT Eesti Pro Text"; src:url("/fonts/GTEestiProText-Medium.ttf") format("truetype"); font-weight:500; font-style:normal; font-display:swap; }
  @font-face { font-family:"GT Eesti Pro Text"; src:url("/fonts/GTEestiProText-Bold.ttf") format("truetype"); font-weight:700; font-style:normal; font-display:swap; }

  :root{
    --color-cream:#F5F2E9; --color-ivory:#FDFBF4; --color-dark-green:#011C00;
    --font-display:"GT Eesti Pro Display",system-ui,sans-serif;
    --font-text:"GT Eesti Pro Text",system-ui,sans-serif;
    /* tweakable (Edit Mode → Tweaks panel) */
    --fs-h1:76px; --fs-h2:40px; --fs-body:21px;
    --lh-head:1; --lh-body:1.55;
    --w-body:400; --st-body:normal;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--color-cream);color:var(--color-dark-green);font-family:var(--font-text);-webkit-font-smoothing:antialiased}
  .wrap{max-width:1200px;margin:0 auto;padding:0 40px}
  .hero{padding:160px 0 120px}
  .eyebrow{font-family:var(--font-text);font-size:15px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;margin-bottom:28px}
  h1{font-family:var(--font-display);font-weight:700;font-size:var(--fs-h1);line-height:var(--lh-head);letter-spacing:-.02em;max-width:14ch}
  .hero p{font-family:var(--font-text);font-weight:var(--w-body);font-style:var(--st-body);font-size:var(--fs-body);line-height:var(--lh-body);max-width:46ch;margin-top:32px;opacity:.78}
  .cta{display:inline-block;margin-top:40px;background:var(--color-dark-green);color:var(--color-ivory);font-family:var(--font-text);font-size:17px;padding:16px 30px;border-radius:10px;text-decoration:none}
  section.block{padding:90px 0;border-top:1px solid color-mix(in oklch,var(--color-dark-green) 16%,transparent)}
  h2{font-family:var(--font-display);font-weight:700;font-size:var(--fs-h2);line-height:var(--lh-head);letter-spacing:-.02em;max-width:18ch}
  section.block p{font-family:var(--font-text);font-weight:var(--w-body);font-style:var(--st-body);font-size:var(--fs-body);line-height:var(--lh-body);max-width:52ch;margin-top:22px;opacity:.78}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:48px}
  .card{background:var(--color-ivory);border-radius:14px;padding:30px}
  .card h3{font-family:var(--font-display);font-weight:700;font-size:22px;line-height:1.1;margin-bottom:12px}
  .card p{font-size:17px;margin-top:0;opacity:.72}
  .dark{background:var(--color-dark-green);color:var(--color-ivory)}
  .dark h2,.dark p{color:var(--color-ivory)}
  footer{padding:60px 0;font-size:15px;opacity:.5}
</style>
</head>
<body>
  <header class="wrap" style="padding-top:28px"><strong style="font-family:var(--font-display)">Orbit</strong></header>

  <div class="wrap hero">
    <div class="eyebrow">Sandbox · placeholder product</div>
    <h1>The control layer for everything your team already runs.</h1>
    <p>Orbit is a placeholder landing used only to test Edit Mode. Click any element in Visual mode, leave a copy note in Copy mode, or push a slider in the Tweaks panel.</p>
    <a class="cta" href="#">Request access</a>
  </div>

  <section class="block wrap">
    <h2>One surface for the work that lives in ten tools.</h2>
    <p>Placeholder body copy. This paragraph exists so you can comment on real text and watch the amber highlight + margin marker appear.</p>
    <div class="grid">
      <div class="card"><h3>Connect</h3><p>Wire up the systems you use today. No migration.</p></div>
      <div class="card"><h3>Compose</h3><p>Build flows from blocks, not scripts.</p></div>
      <div class="card"><h3>Observe</h3><p>See what ran, what changed, what needs you.</p></div>
    </div>
  </section>

  <section class="block dark">
    <div class="wrap">
      <h2>A dark section, for color-temperature rhythm.</h2>
      <p>Placeholder. Use this block to test how Edit Mode reads against an inverted background.</p>
    </div>
  </section>

  <footer class="wrap">Playground sandbox · not a client-facing page</footer>
${editPanel}
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
