/**
 * Merz — fake-door demo-signup landing (BSO-677, Knowledge OS smoke-test).
 *
 * A small Merz-specific block set that reuses the `bt-` design-system CSS but
 * carries its own brand (no Backspace Oddity logo / Cal.com / email coupling)
 * and a demo-signup form that persists to Supabase instead of the agency
 * diagnostic → Slack path.
 *
 * Funnel instrumentation is contained here (no change to the generic published
 * route): MerzNav fires `page_view` on mount + a delegated `cta_click` listener
 * for every demo CTA on the page (.bt-pill[data-cta=demo]); the form's
 * `/api/demo-signup` logs `form_submit` server-side. All keyed by a per-browser
 * session id so the view → click → signup funnel is correlated.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Ed } from './bt';

type E = { on: boolean; set: (k: string, v: string) => void; touch?: () => void } | undefined;

/* per-browser session id, so the funnel can be deduped to unique visitors */
function merzSid(): string {
  try {
    let s = localStorage.getItem('merz_sid');
    if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('merz_sid', s); }
    return s;
  } catch { return 'nostore'; }
}

function track(slug: string, event: string, meta?: Record<string, unknown>) {
  try {
    fetch('/api/track/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ slug, event, sid: merzSid(), meta: meta || null }),
    }).catch(() => {});
  } catch { /* ignore */ }
}

/* ---------- Merz nav (brand + demo CTA) + page-level tracking ---------- */
export function MerzNav({ brand = 'Merz', cta = 'Book a demo', slug = 'merz', e }: { brand?: string; cta?: string; slug?: string; e?: E }) {
  useEffect(() => {
    if (e?.on) return; // never track inside the builder canvas
    track(slug, 'page_view');
    const onClick = (ev: MouseEvent) => {
      const t = (ev.target as HTMLElement)?.closest?.('.bt-pill[data-cta="demo"], a[href="#demo"][data-cta="demo"]');
      if (t) track(slug, 'cta_click');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [slug, e]);

  return (
    <nav className="bt-nav" aria-label="Primary">
      <a href="#top" className="bt-nav__logo" aria-label={brand}>
        <span className="bt-nav__logo-text"><Ed e={e} k="brand" v={brand} as="span" /></span>
      </a>
      <div className="bt-nav__right">
        <div className="bt-nav__col">
          <a className="bt-cta-link" href="#demo" data-cta="demo"><Ed e={e} k="cta" v={cta} role="button" /></a>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Demo-signup form (email + optional reason) → /api/demo-signup ---------- */
type Status = 'idle' | 'sending' | 'done' | 'error';
export function BtDemoSignup({
  eyebrow = 'Early access',
  h2 = 'Book a demo',
  intro = 'Merz is in private beta. Leave your email — we’ll invite you to a live demo and get you in among the first.',
  cta = 'Book a demo',
  done = 'Done — we’ll be in touch and invite you to a demo in the coming days.',
  emailLabel = 'Email',
  reasonLabel = 'What are you trying to solve? — optional',
  slug = 'merz',
  e,
}: {
  eyebrow?: string; h2?: string; intro?: string; cta?: string; done?: string; emailLabel?: string; reasonLabel?: string; slug?: string; e?: E;
}) {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/demo-signup/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, reason, slug, sid: merzSid(), website: hp }),
      });
      if (!res.ok) throw new Error('bad response');
      setStatus('done');
    } catch { setStatus('error'); }
  }

  return (
    <section className="bt-sec bt-sec--light" id="demo" data-screen-label="Demo">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow" role="eyebrow" />
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" role="h2" />
          <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" role="body" />
        </header>

        {status === 'done' ? (
          <div className="bt-form__done">{done}</div>
        ) : (
          <form className="bt-form" onSubmit={submit}>
            <label className="bt-field">
              <span><Ed e={e} k="emailLabel" v={emailLabel} as="span" /></span>
              <input required type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} autoComplete="email" placeholder="you@email.com" />
            </label>
            <label className="bt-field">
              <span><Ed e={e} k="reasonLabel" v={reasonLabel} as="span" /></span>
              <textarea rows={3} value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder="Notion, Obsidian, Google Docs, a pile of browser tabs…" />
            </label>
            {/* honeypot */}
            <input className="bt-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(ev) => setHp(ev.target.value)} />
            <button className="bt-pill" type="submit" data-cta="demo" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : cta}
              <span className="bt-pill__arrow" aria-hidden="true">→</span>
            </button>
            {status === 'error' && <p className="bt-form__err">Something went wrong — please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------- Minimal Merz footer (no agency coupling) ---------- */
export function MerzFooter({ brand = 'Merz', tagline = 'Knowledge that compounds.', e }: { brand?: string; tagline?: string; e?: E }) {
  return (
    <footer className="bt-footer" data-screen-label="Footer">
      <div>
        <div className="bt-footer__logo"><span><Ed e={e} k="brand" v={brand} as="span" /></span></div>
        <div className="bt-footer__copy">© {brand} 2026</div>
      </div>
      <div className="bt-footer__col">
        <Ed e={e} k="tagline" v={tagline} as="span" className="bt-footer__label" />
      </div>
    </footer>
  );
}

/* ---------- Text-only statement section (hinge / methodology / why-own-UI) ----------
 * Pure content block: eyebrow + h2 + intro, no form, no cards. Reuses the
 * already-styled .bt-head / .bt-eyebrow / .bt-h2 / .bt-intro classes so it needs
 * zero new CSS. Used for the "show → reveal" bridges where BtDiagnostic can't be
 * used (that one embeds a LeadForm). */
export function MerzStatement({ eyebrow = '', h2 = '', intro = '', id = 'note', e }: { eyebrow?: string; h2?: string; intro?: string; id?: string; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light" id={id} data-screen-label={eyebrow || 'Note'}>
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          {eyebrow ? <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow" role="eyebrow" /> : null}
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" role="h2" />
          {intro ? <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" role="body" /> : null}
        </header>
      </div>
    </section>
  );
}

/* ---------- Embedded live demo — the real v11 KOS UI on mock data ---------- */
export function KosDemo({
  caption = 'Live demo — click around. This is the real Merz running on sample data.',
  src = '/merz-demo/index.html',
  e,
}: { caption?: string; src?: string; e?: E }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const goFull = () => {
    const el = frameRef.current as any;
    if (el?.requestFullscreen) el.requestFullscreen();
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else window.open(src, '_blank');
  };
  return (
    <section className="kos-demo" id="demo-live" data-screen-label="Live demo">
      <div className="kos-demo__bar">
        <p className="kos-demo__cap"><Ed e={e} k="caption" v={caption} as="span" /></p>
        <button type="button" className="kos-demo__full" onClick={goFull} aria-label="Open the demo full screen">⤢ Full screen</button>
      </div>
      <div className="kos-demo__frame" ref={frameRef}>
        <iframe src={src} title="Merz live demo" loading="lazy" />
      </div>
    </section>
  );
}

/* ---------- registry (merged into BT_COMPONENTS / BT_TYPE_NAMES) ---------- */
export const MERZ_COMPONENTS = {
  'merz:nav': MerzNav,
  'merz:demo': BtDemoSignup,
  'merz:footer': MerzFooter,
  'merz:statement': MerzStatement,
  'kos:demo': KosDemo,
};
export const MERZ_TYPE_NAMES = {
  'merz:nav': 'Merz nav',
  'merz:demo': 'Demo signup',
  'merz:footer': 'Merz footer',
  'merz:statement': 'Statement',
  'kos:demo': 'Live demo',
};

/* ---------- the Merz page block-list (seeded into builder_pages) ---------- */
const b = (id: string, type: string, props: any) => ({ id, type, props, real: true });

export const MERZ_PAGE = [
  b('merz-nav', 'merz:nav', { brand: 'Merz', cta: 'Request access', slug: 'merz' }),

  /* ── SHOW ── result-first hero (IFR: the outcome with none of the labor) → routes into the demo, not a form */
  b('merz-hero', 'bt:hero', {
    eyebrow: 'An AI-native knowledge workspace',
    title: 'Everything you capture becomes a connected second brain — without you sorting a thing.',
    subtitle: 'Drop in a thought, a link, a fragment of a call. Merz breaks it down, connects it to what you already know, and hands the whole picture back the moment you ask. No folders, no tagging, no upkeep.',
    cta: 'See it work',
    ctaHref: '#demo-live',
  }),

  /* the demo IS the pitch — let the visitor perform the trick themselves */
  b('merz-demo-live', 'kos:demo', {
    caption: 'The real Merz, running on a sample workspace. Open a node, follow a connection, search by meaning.',
  }),

  /* ── REVEAL ── the "how did you do that?" bridge: wow → curiosity, magician register */
  b('merz-hinge', 'merz:statement', {
    id: 'hinge',
    eyebrow: 'How did you do that?',
    h2: 'You didn’t sort, tag, or file anything. The connections were already there.',
    intro: 'That’s the point. You did what you’d normally do — captured a thought. The structure formed underneath you. Here’s what makes that happen.',
  }),

  /* two-layer architecture — infrastructure, not an app */
  b('merz-twolayer', 'bt:eps', {
    id: 'architecture', label: 'Architecture', compact: false,
    eyebrow: 'Infrastructure, not an app',
    h2: 'Two layers: one that lasts, one that changes',
    intro: 'Merz isn’t a notes app you’ll migrate off in a year. It’s two separated layers — and that separation is why your knowledge keeps compounding no matter which tools you use.',
    points: [
      { metric: 'Layer 1', name: 'The substrate', text: 'Your knowledge lives as plain, portable atoms in an open graph you own — independent of any one app, vendor, or format. This layer is permanent.' },
      { metric: 'Layer 2', name: 'The surface', text: 'What you read and write through: this workspace, your editor, a chat, an MCP client. Surfaces come and go. The substrate underneath never moves.' },
    ],
  }),

  /* why we built our own surface */
  b('merz-ownui', 'merz:statement', {
    id: 'why-own-ui',
    eyebrow: 'Why we built our own',
    h2: 'A surface you can see into — for the people other tools assume away.',
    intro: 'Most knowledge tools assume you live in Notion. Most people don’t. Merz runs on plain markdown and git — the formats that outlive any app — and gives the majority who never adopted Notion a home that fits how they already think. Building the surface ourselves means nothing about how it works stays hidden from you.',
  }),

  /* depth engine — three tiers, signal of real engineering */
  b('merz-engine', 'bt:eps', {
    id: 'engine', label: 'Under the hood', compact: false,
    eyebrow: 'Under the hood',
    h2: 'A three-tier engine doing the work you don’t see',
    intro: 'Capture is one tap. Everything that makes it useful happens in three tiers beneath it.',
    points: [
      { metric: '01', name: 'Ambient capture', text: 'Anything you drop in — a message, a link, a voice note — lands without a decision. No folder to pick, no form to fill.' },
      { metric: '02', name: 'Atomize & connect', text: 'A model breaks each capture into its meaningful parts and links them to what you already know — reviewed before anything enters your graph, so it compounds safely.' },
      { metric: '03', name: 'Recall by meaning', text: 'Ask in plain words. Merz returns what fits — by meaning, not exact match — and shows how it connects to the rest of your thinking.' },
    ],
  }),

  /* the moat — methodology delivered through MCP */
  b('merz-methodology', 'merz:statement', {
    id: 'methodology',
    eyebrow: 'The part that’s hard to copy',
    h2: 'A piece of our brain, wired into yours.',
    intro: 'The graph is yours. How it stays trustworthy is ours: the checks that run the moment knowledge is written, the way claims get grounded before they’re relied on. That methodology is delivered live through MCP — the difference between storing notes and building knowledge that holds up. The longer you run it, the more that judgment compounds in your favor.',
  }),

  /* use cases — three teams, three different jobs */
  b('merz-usecases', 'bt:eps', {
    id: 'who', label: 'Who it’s for', compact: false,
    eyebrow: 'Who it’s for',
    h2: 'Three teams, three different jobs',
    intro: 'The same engine, pointed at very different problems.',
    points: [
      { metric: 'Startups', name: 'Move without losing the thread', text: 'Decisions, research, and context pile up fast across five tools. Merz keeps the whole picture in one place, so the next hire — or the next you — can pick it up cold.' },
      { metric: 'Mid-size', name: 'Turn scattered work into shared memory', text: 'Teams know things that never leave one person’s head. Merz turns individual capture into a connected memory the whole team can search by meaning.' },
      { metric: 'Enterprise', name: 'Compounding knowledge, safely', text: 'Capability is granted per action, not per session. Observation is wide; nothing leaves or changes without a human yes. Knowledge that compounds without handing an agent the keys.' },
    ],
  }),

  /* ── SELL ── request access + segment signal (what's your stack) */
  b('merz-demo', 'merz:demo', {
    eyebrow: 'Early access',
    h2: 'Get your team in',
    intro: 'Merz is in private beta. Tell us what you’re running today — we’ll get you set up and walk you through it live.',
    cta: 'Request access',
    done: 'You’re in the queue — we’ll be in touch shortly to get you set up.',
    emailLabel: 'Work email',
    reasonLabel: 'What’s your team running today? — optional',
    slug: 'merz',
  }),

  b('merz-footer', 'merz:footer', { brand: 'Merz', tagline: 'Knowledge that compounds.' }),
];

/* ---------- Merz marketing Library: section types -> variations (BSO-696).
   Merz is the MARKETING facet on the KOS system — landing blocks, NOT the BSO
   landing library. Built from MERZ_PAGE so the Library carries real Merz copy. */
const mp = (id: string) => (MERZ_PAGE.find((x) => x.id === id) || ({} as any)).props;

export const MERZ_SECTIONS = [
  { type: 'merz:nav', name: 'Nav', variations: [
    { id: 'merz-nav', name: 'Brand + request access', props: mp('merz-nav') },
  ] },
  { type: 'bt:hero', name: 'Hero', variations: [
    { id: 'merz-hero', name: 'Result-first hero', props: mp('merz-hero') },
  ] },
  { type: 'kos:demo', name: 'Live demo', variations: [
    { id: 'merz-demo-live', name: 'Embedded product demo', props: mp('merz-demo-live') },
  ] },
  { type: 'merz:statement', name: 'Statement', variations: [
    { id: 'st-hinge', name: 'Hinge — “how did you do that?”', props: mp('merz-hinge') },
    { id: 'st-ownui', name: 'Why we built our own', props: mp('merz-ownui') },
    { id: 'st-method', name: 'Methodology moat', props: mp('merz-methodology') },
  ] },
  { type: 'bt:eps', name: 'Numbered cards', variations: [
    { id: 'eps-2layer', name: 'Two-layer architecture', props: mp('merz-twolayer') },
    { id: 'eps-engine', name: 'Three-tier engine', props: mp('merz-engine') },
    { id: 'eps-usecases', name: 'Use cases', props: mp('merz-usecases') },
  ] },
  { type: 'merz:demo', name: 'Request access', variations: [
    { id: 'merz-demo', name: 'Access form', props: mp('merz-demo') },
  ] },
  { type: 'merz:footer', name: 'Footer', variations: [
    { id: 'merz-footer', name: 'Brand + tagline', props: mp('merz-footer') },
  ] },
];
