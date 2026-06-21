/**
 * Builder block library — proposal/landing sections extracted 1:1 from the real
 * landings (app/8figures, app/brand-transformation). Each section becomes a
 * data-driven, composable block. Markup mirrors the source pages verbatim so the
 * visual is identical; the builder composes pages as ordered block lists.
 *
 * Styling comes from brand-transformation.css (the `bt-` design system), imported
 * once by the page that renders these blocks.
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

export function Pill({ label }: { label: string }) {
  return (
    <button type="button" className="bt-pill" {...CAL_TRIGGER}>
      {label}
      <span className="bt-pill__arrow" aria-hidden="true">→</span>
    </button>
  );
}

/* ---------- Nav ---------- */
export function BtNav({ contact = 'Contact', book = 'Book a call', office }: { contact?: string; book?: string; office: string[] }) {
  return (
    <nav className="bt-nav" aria-label="Primary">
      <a href="/" className="bt-nav__logo" aria-label="Backspace Oddity">
        <img className="bt-nav__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" />
        <span className="bt-nav__logo-text"><span>Backspace</span><span>Oddity</span></span>
      </a>
      <div className="bt-nav__right">
        <div className="bt-nav__col">
          <span className="bt-nav__label">{contact}</span>
          <a href={MAIL}>yegor@backspaceoddity.com</a>
          <button type="button" className="bt-cta-link" {...CAL_TRIGGER}>{book}</button>
        </div>
        <div className="bt-nav__col">
          <span className="bt-nav__label">Office</span>
          {office.map((line) => <span key={line}>{line}</span>)}
        </div>
      </div>
    </nav>
  );
}

/* ---------- Hero (subtitle variant + optional principles variant) ---------- */
type Princ = { h3: string; p: string };
export function BtHero({ eyebrow, title, subtitle, principles, cta }: { eyebrow: string; title: string; subtitle?: string; principles?: Princ[]; cta?: string }) {
  return (
    <header className="bt-hero" id="top" data-screen-label="Hero">
      <div className="bt-hero__inner">
        <span className="bt-hero__eyebrow">{eyebrow}</span>
        <h1 className="bt-hero__title">{title}</h1>
        {subtitle ? <p className="bt-hero__sub">{subtitle}</p> : null}
        {principles && principles.length ? (
          <div className="bt-hero__how">
            {principles.map((p) => (
              <div className="bt-hero__princ" key={p.h3}><h3>{p.h3}</h3><p>{p.p}</p></div>
            ))}
          </div>
        ) : null}
        {cta ? <Pill label={cta} /> : null}
      </div>
    </header>
  );
}

/* ---------- Challenge (stacked: label+body / label+list) ---------- */
export function BtChallenge({ h2, you, we }: { h2: string; you: { label: string; body: string }; we: { label: string; points: string[] } }) {
  return (
    <section className="bt-sec bt-sec--light" id="challenge" data-screen-label="The challenge">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap"><h2 className="bt-h2">{h2}</h2></header>
        <div className="bt-challenge">
          <div><h3 className="bt-sublabel">{you.label}</h3><p className="bt-intro">{you.body}</p></div>
          <div><h3 className="bt-sublabel">{we.label}</h3><ul className="bt-modules">{we.points.map((p) => <li key={p}>{p}</li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- EPS numbered cards (approach / when-you-need) ---------- */
type Ep = { metric: string; name: string; text: string };
export function BtEps({ id = 'approach', label = 'How we’ll approach', h2, intro, eyebrow, points, compact = true }: { id?: string; label?: string; h2: string; intro?: string; eyebrow?: string; points: Ep[]; compact?: boolean }) {
  return (
    <section className={`bt-sec bt-sec--light${compact ? ' bt-sec--compact' : ''}`} id={id} data-screen-label={label}>
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          {eyebrow ? <span className="bt-eyebrow">{eyebrow}</span> : null}
          <h2 className="bt-h2">{h2}</h2>
          {intro ? <p className="bt-intro">{intro}</p> : null}
        </header>
        <div className="bt-eps">
          {points.map((p) => (
            <div className="bt-ep" key={p.name}><span className="bt-ep__num">{p.metric}</span><h3 className="bt-ep__name">{p.name}</h3><p className="bt-ep__text">{p.text}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- What we'll do: intro + nutshell + phases ---------- */
type Phase = { kicker: string; name: string; meta?: string; optional?: string; summary: string; modules: string[]; subhead?: string; subModules?: string[]; callout?: { title: string; text: string } };
export function BtPhasesSection({ id = 'phases', label = 'What we’ll do', h2, intro, nutshell, phases }: { id?: string; label?: string; h2: string; intro?: string; nutshell?: string[]; phases: Phase[] }) {
  return (
    <section className="bt-sec bt-sec--light" id={id} data-screen-label={label}>
      <div className="bt-inner">
        <header className="bt-head bt-head--compact">
          <h2 className="bt-h2">{h2}</h2>
          {intro ? <p className="bt-intro">{intro}</p> : null}
        </header>
        {nutshell && nutshell.length ? <ul className="bt-modules">{nutshell.map((n) => <li key={n}>{n}</li>)}</ul> : null}
        <ol className="bt-phases">
          {phases.map((ph) => (
            <li className="bt-phase" key={ph.kicker + ph.name}>
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">{ph.kicker}</span>
                <h3 className="bt-phase__name">{ph.name}</h3>
                {(ph.meta || ph.optional) ? (
                  <div className="bt-phase__meta">
                    {ph.meta ? <span className="bt-phase__weeks">{ph.meta}</span> : null}
                    {ph.optional ? <span className="bt-phase__opt">{ph.optional}</span> : null}
                  </div>
                ) : null}
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">{ph.summary}</p>
                {ph.modules.length ? <ul className="bt-modules">{ph.modules.map((m, i) => <li key={i}>{m}</li>)}</ul> : null}
                {ph.subhead ? <div className="bt-phase__subhead">{ph.subhead}</div> : null}
                {ph.subModules && ph.subModules.length ? <ul className="bt-modules">{ph.subModules.map((m, i) => <li key={i}>{m}</li>)}</ul> : null}
                {ph.callout ? <div className="bt-callout"><span className="bt-callout__title">{ph.callout.title}</span><p className="bt-callout__text">{ph.callout.text}</p></div> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Investment ---------- */
export function BtInvest({ h2, price, terms, paymentLabel, payment }: { h2: string; price: string; terms: string; paymentLabel: string; payment: string }) {
  return (
    <section className="bt-sec bt-sec--light bt-sec--compact" id="investment" data-screen-label="Investment & timeline">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap"><h2 className="bt-h2">{h2}</h2></header>
        <div className="bt-invest">
          <div className="bt-invest__price">{price}</div>
          <p className="bt-invest__terms">{terms}</p>
          <div className="bt-invest__pay"><h3 className="bt-sublabel">{paymentLabel}</h3><p className="bt-intro">{payment}</p></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */
type Project = { title: string; href: string; img: string; alt: string; desc: string };
export function BtProjects({ id = 'experience', label = 'What we’ve done', eyebrow, h2, intro, projects }: { id?: string; label?: string; eyebrow?: string; h2: string; intro?: string; projects: Project[] }) {
  return (
    <section className="bt-sec bt-sec--light" id={id} data-screen-label={label}>
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          {eyebrow ? <span className="bt-eyebrow">{eyebrow}</span> : null}
          <h2 className="bt-h2">{h2}</h2>
          {intro ? <p className="bt-intro">{intro}</p> : null}
        </header>
        <div className="bt-projects">
          {projects.map((p) => (
            <div className="bt-projitem" key={p.title}>
              <a className="bt-proj" href={p.href} target="_blank" rel="noopener noreferrer">
                <img className="bt-proj__img" src={p.img} alt={p.alt} />
                <span className="bt-proj__shade" aria-hidden="true"></span>
                <h3 className="bt-proj__title">{p.title}</h3>
              </a>
              <p className="bt-proj__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
export function BtFinal({ h2, copy, cta }: { h2: string; copy: string; cta: string }) {
  return (
    <section className="bt-final" id="contact" data-screen-label="Next step">
      <div className="bt-final__inner">
        <h2 className="bt-final__h2">{h2}</h2>
        <p className="bt-final__copy">{copy}</p>
        <Pill label={cta} />
        <a className="bt-final__email" href={MAIL}>yegor@backspaceoddity.com</a>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function BtFooter({ thisPage = 'This page', links, reach = 'Reach us', city = 'Amsterdam', book = 'Book a call' }: { thisPage?: string; links: { label: string; href: string }[]; reach?: string; city?: string; book?: string }) {
  return (
    <footer className="bt-footer" data-screen-label="Footer">
      <div>
        <div className="bt-footer__logo"><img className="bt-footer__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" /><span>Backspace<br />Oddity</span></div>
        <div className="bt-footer__copy">© Backspace Oddity 2026</div>
      </div>
      <div className="bt-footer__col"><span className="bt-footer__label">{thisPage}</span>{links.map((l) => <a href={l.href} key={l.href}>{l.label}</a>)}</div>
      <div className="bt-footer__col"><span className="bt-footer__label">{reach}</span><a href={MAIL}>yegor@backspaceoddity.com</a><button type="button" className="bt-cta-link" {...CAL_TRIGGER}>{book}</button><span>{city}</span></div>
    </footer>
  );
}

/* ---------- Leverages — "Why a brand matters" (dark) ---------- */
type Leverage = { metric: string; name: string; text: string };
export function BtLeverages({ eyebrow, h2, intro, items }: { eyebrow: string; h2: string; intro: string; items: Leverage[] }) {
  return (
    <section className="bt-block" id="why" data-screen-label="Why a brand matters">
      <div className="bt-inner">
        <header className="bt-head">
          <span className="bt-eyebrow bt-eyebrow--on-dark">{eyebrow}</span>
          <h2 className="bt-h2 bt-h2--on-dark">{h2}</h2>
          <p className="bt-intro bt-intro--on-dark">{intro}</p>
        </header>
        <ol className="bt-leverages">
          {items.map((it) => (
            <li className="bt-leverage" key={it.name}>
              <span className="bt-leverage__metric">{it.metric}</span>
              <h3 className="bt-leverage__name">{it.name}</h3>
              <p className="bt-leverage__text">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Timeline — phase rows + total ---------- */
type TRow = { name: string; weeksNum: string; weeksUnit: string; tag?: string };
export function BtTimeline({ eyebrow, h2, intro, rows, totalNum, totalNote }: { eyebrow: string; h2: string; intro: string; rows: TRow[]; totalNum: string; totalNote?: string }) {
  return (
    <section className="bt-sec bt-sec--light" id="timeline" data-screen-label="Phases & timeline">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          <span className="bt-eyebrow">{eyebrow}</span>
          <h2 className="bt-h2">{h2}</h2>
          <p className="bt-intro">{intro}</p>
        </header>
        <div className="bt-timeline">
          {rows.map((r, i) => (
            <div className="bt-trow" key={i}>
              <span className="bt-trow__name">{r.name}</span>
              <span className="bt-trow__weeks"><b>{r.weeksNum}</b> {r.weeksUnit}</span>
              {r.tag ? <span className="bt-trow__tag">{r.tag}</span> : <span></span>}
            </div>
          ))}
        </div>
        <p className="bt-total">Total: <b>{totalNum}</b></p>
        {totalNote ? <p className="bt-total-note">{totalNote}</p> : null}
      </div>
    </section>
  );
}

/* ---------- Brand Diagnostic — section header + the lead form ---------- */
export function BtDiagnostic({ eyebrow, h2, intro }: { eyebrow: string; h2: string; intro: string }) {
  return (
    <section className="bt-sec bt-sec--light" id="proposal" data-screen-label="The proposal">
      <div className="bt-inner">
        <header className="bt-head bt-head--gap">
          <span className="bt-eyebrow">{eyebrow}</span>
          <h2 className="bt-h2">{h2}</h2>
          <p className="bt-intro">{intro}</p>
        </header>
        <LeadForm />
      </div>
    </section>
  );
}
