/**
 * Builder block library — proposal/landing sections extracted 1:1 from the real
 * landings (app/8figures, app/brand-transformation). Each section is a
 * data-driven, composable block. Markup mirrors the source pages verbatim so the
 * visual is identical; the builder composes pages as ordered block lists.
 *
 * Styling comes from brand-transformation.css / eightfigures.css (the `bt-`
 * design system), injected by whoever renders these blocks.
 *
 * Inline editing: every text field is wrapped in <Ed>. When an `e` (edit) prop
 * is passed ({on, set}), the field becomes contentEditable and commits to the
 * block's props on blur — this is the builder's deterministic text editing.
 * Standalone routes pass no `e`, so they render static.
 */
'use client';

import Script from 'next/script';
import { LeadForm } from '../../brand-transformation/LeadForm';

const MAIL = 'mailto:yegor@backspaceoddity.com';

export const CAL_TRIGGER = {
  'data-cal-link': 'team/backspace-oddity/discovery-call',
  'data-cal-namespace': 'discovery-call',
  'data-cal-config': '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
} as const;

/* edit context threaded into every block */
type E = { on: boolean; set: (k: string, v: string) => void } | undefined;

/* one inline-editable text field — static unless an edit context is active */
function Ed({ e, k, v, as = 'span', className }: { e?: E; k: string; v?: string; as?: any; className?: string }) {
  const As: any = as;
  if (!e || !e.on) return <As className={className}>{v}</As>;
  return (
    <As
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-edit-k={k}
      onBlur={(ev: any) => { const t = ev.currentTarget.innerText; if (t !== v) e.set(k, t); }}
      style={{ outline: 'none', cursor: 'text' }}
    >
      {v}
    </As>
  );
}

export function CalInit() {
  return (
    <Script id="cal-embed-init" strategy="afterInteractive">{`
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", "discovery-call", {origin:"https://app.cal.com"});
      Cal.config = Cal.config || {};
      Cal.config.forwardQueryParams = true;
      Cal.ns["discovery-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    `}</Script>
  );
}

export function Pill({ label, e, k = 'cta' }: { label: string; e?: E; k?: string }) {
  return (
    <button type="button" className="bt-pill" {...CAL_TRIGGER}>
      <Ed e={e} k={k} v={label} />
      <span className="bt-pill__arrow" aria-hidden="true">→</span>
    </button>
  );
}

/* ---------- Nav ---------- */
export function BtNav({ contact = 'Contact', book = 'Book a call', office, e }: { contact?: string; book?: string; office: string[]; e?: E }) {
  return (
    <nav className="bt-nav" aria-label="Primary">
      <a href="/" className="bt-nav__logo" aria-label="Backspace Oddity">
        <img className="bt-nav__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" />
        <span className="bt-nav__logo-text"><span>Backspace</span><span>Oddity</span></span>
      </a>
      <div className="bt-nav__right">
        <div className="bt-nav__col">
          <Ed e={e} k="contact" v={contact} as="span" className="bt-nav__label" />
          <a href={MAIL}>yegor@backspaceoddity.com</a>
          <button type="button" className="bt-cta-link" {...CAL_TRIGGER}><Ed e={e} k="book" v={book} /></button>
        </div>
        <div className="bt-nav__col">
          <span className="bt-nav__label">Office</span>
          {office.map((line, i) => <Ed key={i} e={e} k={`office.${i}`} v={line} as="span" />)}
        </div>
      </div>
    </nav>
  );
}

/* ---------- Hero (subtitle variant + optional principles variant) ---------- */
type Princ = { h3: string; p: string };
export function BtHero({ eyebrow, title, subtitle, principles, cta, e }: { eyebrow: string; title: string; subtitle?: string; principles?: Princ[]; cta?: string; e?: E }) {
  return (
    <header className="bt-hero" id="top" data-screen-label="Hero">
      <div className="bt-hero__inner">
        <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-hero__eyebrow" />
        <Ed e={e} k="title" v={title} as="h1" className="bt-hero__title" />
        {subtitle ? <Ed e={e} k="subtitle" v={subtitle} as="p" className="bt-hero__sub" /> : null}
        {principles && principles.length ? (
          <div className="bt-hero__how">
            {principles.map((p, i) => (
              <div className="bt-hero__princ" key={i}><Ed e={e} k={`principles.${i}.h3`} v={p.h3} as="h3" /><Ed e={e} k={`principles.${i}.p`} v={p.p} as="p" /></div>
            ))}
          </div>
        ) : null}
        {cta ? <Pill label={cta} e={e} k="cta" /> : null}
      </div>
    </header>
  );
}

/* ---------- Challenge (stacked: label+body / label+list) ---------- */
export function BtChallenge({ h2, you, we, e }: { h2: string; you: { label: string; body: string }; we: { label: string; points: string[] }; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light" id="challenge" data-screen-label="The challenge">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap"><Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" /></header>
        <div className="bt-challenge">
          <div><Ed e={e} k="you.label" v={you.label} as="h3" className="bt-sublabel" /><Ed e={e} k="you.body" v={you.body} as="p" className="bt-intro" /></div>
          <div><Ed e={e} k="we.label" v={we.label} as="h3" className="bt-sublabel" /><ul className="bt-modules">{we.points.map((p, i) => <Ed key={i} e={e} k={`we.points.${i}`} v={p} as="li" />)}</ul></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- EPS numbered cards (approach / when-you-need) ---------- */
type Ep = { metric: string; name: string; text: string };
export function BtEps({ id = 'approach', label = 'How we’ll approach', h2, intro, eyebrow, points, compact = true, e }: { id?: string; label?: string; h2: string; intro?: string; eyebrow?: string; points: Ep[]; compact?: boolean; e?: E }) {
  return (
    <section className={`bt-sec bt-sec--light${compact ? ' bt-sec--compact' : ''}`} id={id} data-screen-label={label}>
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          {eyebrow ? <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow" /> : null}
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" />
          {intro ? <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" /> : null}
        </header>
        <div className="bt-eps">
          {points.map((p, i) => (
            <div className="bt-ep" key={i}><Ed e={e} k={`points.${i}.metric`} v={p.metric} as="span" className="bt-ep__num" /><Ed e={e} k={`points.${i}.name`} v={p.name} as="h3" className="bt-ep__name" /><Ed e={e} k={`points.${i}.text`} v={p.text} as="p" className="bt-ep__text" /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- What we'll do: intro + nutshell + phases ---------- */
type Phase = { kicker: string; name: string; meta?: string; optional?: string; summary: string; modules: string[]; subhead?: string; subModules?: string[]; callout?: { title: string; text: string } };
export function BtPhasesSection({ id = 'phases', label = 'What we’ll do', h2, intro, nutshell, phases, e }: { id?: string; label?: string; h2: string; intro?: string; nutshell?: string[]; phases: Phase[]; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light" id={id} data-screen-label={label}>
      <div className="bt-inner">
        <header className="bt-head bt-head--compact">
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" />
          {intro ? <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" /> : null}
        </header>
        {nutshell && nutshell.length ? <ul className="bt-modules">{nutshell.map((n, i) => <Ed key={i} e={e} k={`nutshell.${i}`} v={n} as="li" />)}</ul> : null}
        <ol className="bt-phases">
          {phases.map((ph, pi) => (
            <li className="bt-phase" key={pi}>
              <div className="bt-phase__aside">
                <Ed e={e} k={`phases.${pi}.kicker`} v={ph.kicker} as="span" className="bt-phase__kicker" />
                <Ed e={e} k={`phases.${pi}.name`} v={ph.name} as="h3" className="bt-phase__name" />
                {(ph.meta || ph.optional) ? (
                  <div className="bt-phase__meta">
                    {ph.meta ? <Ed e={e} k={`phases.${pi}.meta`} v={ph.meta} as="span" className="bt-phase__weeks" /> : null}
                    {ph.optional ? <Ed e={e} k={`phases.${pi}.optional`} v={ph.optional} as="span" className="bt-phase__opt" /> : null}
                  </div>
                ) : null}
              </div>
              <div className="bt-phase__main">
                <Ed e={e} k={`phases.${pi}.summary`} v={ph.summary} as="p" className="bt-phase__summary" />
                {ph.modules.length ? <ul className="bt-modules">{ph.modules.map((m, i) => <Ed key={i} e={e} k={`phases.${pi}.modules.${i}`} v={m} as="li" />)}</ul> : null}
                {ph.subhead ? <Ed e={e} k={`phases.${pi}.subhead`} v={ph.subhead} as="div" className="bt-phase__subhead" /> : null}
                {ph.subModules && ph.subModules.length ? <ul className="bt-modules">{ph.subModules.map((m, i) => <Ed key={i} e={e} k={`phases.${pi}.subModules.${i}`} v={m} as="li" />)}</ul> : null}
                {ph.callout ? <div className="bt-callout"><Ed e={e} k={`phases.${pi}.callout.title`} v={ph.callout.title} as="span" className="bt-callout__title" /><Ed e={e} k={`phases.${pi}.callout.text`} v={ph.callout.text} as="p" className="bt-callout__text" /></div> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Investment ---------- */
export function BtInvest({ h2, price, terms, paymentLabel, payment, e }: { h2: string; price: string; terms: string; paymentLabel: string; payment: string; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light bt-sec--compact" id="investment" data-screen-label="Investment & timeline">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap"><Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" /></header>
        <div className="bt-invest">
          <Ed e={e} k="price" v={price} as="div" className="bt-invest__price" />
          <Ed e={e} k="terms" v={terms} as="p" className="bt-invest__terms" />
          <div className="bt-invest__pay"><Ed e={e} k="paymentLabel" v={paymentLabel} as="h3" className="bt-sublabel" /><Ed e={e} k="payment" v={payment} as="p" className="bt-intro" /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */
type Project = { title: string; href: string; img: string; alt: string; desc: string };
export function BtProjects({ id = 'experience', label = 'What we’ve done', eyebrow, h2, intro, projects, e }: { id?: string; label?: string; eyebrow?: string; h2: string; intro?: string; projects: Project[]; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light" id={id} data-screen-label={label}>
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          {eyebrow ? <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow" /> : null}
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" />
          {intro ? <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" /> : null}
        </header>
        <div className="bt-projects">
          {projects.map((p, i) => (
            <div className="bt-projitem" key={i}>
              <a className="bt-proj" href={p.href} target="_blank" rel="noopener noreferrer">
                <img className="bt-proj__img" src={p.img} alt={p.alt} />
                <span className="bt-proj__shade" aria-hidden="true"></span>
                <Ed e={e} k={`projects.${i}.title`} v={p.title} as="h3" className="bt-proj__title" />
              </a>
              <Ed e={e} k={`projects.${i}.desc`} v={p.desc} as="p" className="bt-proj__desc" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
export function BtFinal({ h2, copy, cta, e }: { h2: string; copy: string; cta: string; e?: E }) {
  return (
    <section className="bt-final" id="contact" data-screen-label="Next step">
      <div className="bt-final__inner">
        <Ed e={e} k="h2" v={h2} as="h2" className="bt-final__h2" />
        <Ed e={e} k="copy" v={copy} as="p" className="bt-final__copy" />
        <Pill label={cta} e={e} k="cta" />
        <a className="bt-final__email" href={MAIL}>yegor@backspaceoddity.com</a>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function BtFooter({ thisPage = 'This page', links, reach = 'Reach us', city = 'Amsterdam', book = 'Book a call', e }: { thisPage?: string; links: { label: string; href: string }[]; reach?: string; city?: string; book?: string; e?: E }) {
  return (
    <footer className="bt-footer" data-screen-label="Footer">
      <div>
        <div className="bt-footer__logo"><img className="bt-footer__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" /><span>Backspace<br />Oddity</span></div>
        <div className="bt-footer__copy">© Backspace Oddity 2026</div>
      </div>
      <div className="bt-footer__col"><Ed e={e} k="thisPage" v={thisPage} as="span" className="bt-footer__label" />{links.map((l, i) => <Ed key={i} e={e} k={`links.${i}.label`} v={l.label} as="a" />)}</div>
      <div className="bt-footer__col"><Ed e={e} k="reach" v={reach} as="span" className="bt-footer__label" /><a href={MAIL}>yegor@backspaceoddity.com</a><button type="button" className="bt-cta-link" {...CAL_TRIGGER}><Ed e={e} k="book" v={book} /></button><Ed e={e} k="city" v={city} as="span" /></div>
    </footer>
  );
}

/* ---------- Leverages — "Why a brand matters" (dark) ---------- */
type Leverage = { metric: string; name: string; text: string };
export function BtLeverages({ eyebrow, h2, intro, items, e }: { eyebrow: string; h2: string; intro: string; items: Leverage[]; e?: E }) {
  return (
    <section className="bt-block" id="why" data-screen-label="Why a brand matters">
      <div className="bt-inner">
        <header className="bt-head">
          <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow bt-eyebrow--on-dark" />
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2 bt-h2--on-dark" />
          <Ed e={e} k="intro" v={intro} as="p" className="bt-intro bt-intro--on-dark" />
        </header>
        <ol className="bt-leverages">
          {items.map((it, i) => (
            <li className="bt-leverage" key={i}>
              <Ed e={e} k={`items.${i}.metric`} v={it.metric} as="span" className="bt-leverage__metric" />
              <Ed e={e} k={`items.${i}.name`} v={it.name} as="h3" className="bt-leverage__name" />
              <Ed e={e} k={`items.${i}.text`} v={it.text} as="p" className="bt-leverage__text" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Timeline — phase rows + total ---------- */
type TRow = { name: string; weeksNum: string; weeksUnit: string; tag?: string };
export function BtTimeline({ eyebrow, h2, intro, rows, totalNum, totalNote, e }: { eyebrow: string; h2: string; intro: string; rows: TRow[]; totalNum: string; totalNote?: string; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light" id="timeline" data-screen-label="Phases & timeline">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow" />
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" />
          <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" />
        </header>
        <div className="bt-timeline">
          {rows.map((r, i) => (
            <div className="bt-trow" key={i}>
              <Ed e={e} k={`rows.${i}.name`} v={r.name} as="span" className="bt-trow__name" />
              <span className="bt-trow__weeks"><b><Ed e={e} k={`rows.${i}.weeksNum`} v={r.weeksNum} /></b> <Ed e={e} k={`rows.${i}.weeksUnit`} v={r.weeksUnit} /></span>
              {r.tag ? <Ed e={e} k={`rows.${i}.tag`} v={r.tag} as="span" className="bt-trow__tag" /> : <span></span>}
            </div>
          ))}
        </div>
        <p className="bt-total">Total: <b><Ed e={e} k="totalNum" v={totalNum} /></b></p>
        {totalNote ? <Ed e={e} k="totalNote" v={totalNote} as="p" className="bt-total-note" /> : null}
      </div>
    </section>
  );
}

/* ---------- Brand Diagnostic — section header + the lead form ---------- */
export function BtDiagnostic({ eyebrow, h2, intro, e }: { eyebrow: string; h2: string; intro: string; e?: E }) {
  return (
    <section className="bt-sec bt-sec--light" id="proposal" data-screen-label="The proposal">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          <Ed e={e} k="eyebrow" v={eyebrow} as="span" className="bt-eyebrow" />
          <Ed e={e} k="h2" v={h2} as="h2" className="bt-h2" />
          <Ed e={e} k="intro" v={intro} as="p" className="bt-intro" />
        </header>
        <LeadForm />
      </div>
    </section>
  );
}
