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

import { useEffect, useState } from 'react';
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
              <textarea rows={3} value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder="e.g. notes pile up but never add up to a picture…" />
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

/* ---------- Embedded live demo — the real v11 KOS UI on mock data ---------- */
export function KosDemo({
  caption = 'Live demo — click around. This is the real Merz running on sample data.',
  src = '/merz-demo/index.html',
  e,
}: { caption?: string; src?: string; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light kos-demo" id="demo-live" data-screen-label="Live demo">
      <div className="bt-inner">
        <p className="kos-demo__cap"><Ed e={e} k="caption" v={caption} as="span" /></p>
        <div className="kos-demo__frame">
          <iframe src={src} title="Merz live demo" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* ---------- registry (merged into BT_COMPONENTS / BT_TYPE_NAMES) ---------- */
export const MERZ_COMPONENTS = {
  'merz:nav': MerzNav,
  'merz:demo': BtDemoSignup,
  'merz:footer': MerzFooter,
  'kos:demo': KosDemo,
};
export const MERZ_TYPE_NAMES = {
  'merz:nav': 'Merz nav',
  'merz:demo': 'Demo signup',
  'merz:footer': 'Merz footer',
  'kos:demo': 'Live demo',
};

/* ---------- the Merz page block-list (seeded into builder_pages) ---------- */
const b = (id: string, type: string, props: any) => ({ id, type, props, real: true });

export const MERZ_PAGE = [
  b('merz-nav', 'merz:nav', { brand: 'Merz', cta: 'Book a demo', slug: 'merz' }),
  b('merz-hero', 'bt:hero', {
    eyebrow: 'AI-native space for your knowledge',
    title: 'Knowledge that compounds — instead of getting lost',
    subtitle: 'Merz takes everything you capture on the fly, turns it into a connected picture on its own, and hands it back the moment you need it. No manual sorting, no folders nobody opens later.',
    cta: 'Book a demo',
    ctaHref: '#demo',
  }),
  b('merz-demo-live', 'kos:demo', { caption: 'Live demo — click around. This is the real Merz running on sample data.' }),
  b('merz-how', 'bt:eps', {
    id: 'how', label: 'How it works', eyebrow: 'How it works', h2: 'Three steps — and the picture builds itself',
    intro: 'You just capture. Merz does the rest.',
    points: [
      { metric: '01', name: 'Capture on the fly', text: 'A thought, a link, a piece of a conversation — drop it into Merz like a message. No folders to choose.' },
      { metric: '02', name: 'It connects itself', text: 'Merz breaks every note into its meaningful parts and links them to what you already know. The picture forms without you.' },
      { metric: '03', name: 'It comes back in time', text: 'Ask in plain words — Merz pulls out what you need and shows how it connects to the rest.' },
    ],
  }),
  b('merz-challenge', 'bt:challenge', {
    h2: 'Why notes usually don’t work',
    you: { label: 'The usual way', body: 'You diligently write everything down — in notes, in Notion, across a dozen tools. Six months later it’s a graveyard you can’t search, so you start over.' },
    we: { label: 'With Merz', points: [
      'You capture in one place, with no folder to pick.',
      'Connections appear on their own — you don’t tag them.',
      'Search works by meaning, not the exact word.',
      'The longer you use it, the more useful it gets: knowledge compounds instead of going stale.',
    ] },
  }),
  b('merz-demo', 'merz:demo', {
    eyebrow: 'Early access',
    h2: 'Book a demo',
    intro: 'Merz is in private beta. Leave your email — we’ll invite you to a live demo and get you in among the first.',
    cta: 'Book a demo',
    done: 'Done — we’ll be in touch and invite you to a demo in the coming days.',
    emailLabel: 'Email',
    reasonLabel: 'What are you trying to solve? — optional',
    slug: 'merz',
  }),
  b('merz-footer', 'merz:footer', { brand: 'Merz', tagline: 'Knowledge that compounds.' }),
];
