"use client";

import Script from "next/script";
import { content } from "./content";

const MAIL = "mailto:yegor@backspaceoddity.com";

// cal.com floating pop-up - data-cal attrs on a <button> (no href, so the click never navigates)
const CAL_TRIGGER = {
  "data-cal-link": "team/backspace-oddity/discovery-call",
  "data-cal-namespace": "discovery-call",
  "data-cal-config": '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
};

function Pill({ label }: { label: string }) {
  return (
    <button type="button" className="bt-pill" {...CAL_TRIGGER}>
      {label}
      <span className="bt-pill__arrow" aria-hidden="true">→</span>
    </button>
  );
}

/**
 * 8FIGURES landing. Content is a 1:1 mirror of the Notion v4 doc — sections and
 * text track the doc, with no invented hero/closing copy. See content.ts.
 */
export function EightFiguresClient() {
  const c = content;

  return (
    <div className="page bt-page" data-screen-label="8FIGURES — Brand Sprint" lang="en">
      <Script id="cal-embed-init" strategy="afterInteractive">{`
        (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        Cal("init", "discovery-call", {origin:"https://app.cal.com"});
        Cal.config = Cal.config || {};
        Cal.config.forwardQueryParams = true;
        Cal.ns["discovery-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
      `}</Script>

      {/* ============ NAV ============ */}
      <nav className="bt-nav" aria-label="Primary">
        <a href="/" className="bt-nav__logo" aria-label="Backspace Oddity">
          <img className="bt-nav__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" />
          <span className="bt-nav__logo-text">
            <span>Backspace</span>
            <span>Oddity</span>
          </span>
        </a>
        <div className="bt-nav__right">
          <div className="bt-nav__col">
            <span className="bt-nav__label">{c.nav.contact}</span>
            <a href={MAIL}>yegor@backspaceoddity.com</a>
            <button type="button" className="bt-cta-link" {...CAL_TRIGGER}>{c.nav.book}</button>
          </div>
          <div className="bt-nav__col">
            <span className="bt-nav__label">Office</span>
            {c.nav.office.map((line) => <span key={line}>{line}</span>)}
          </div>
        </div>
      </nav>

      {/* ============ HERO (doc title only — no invented copy) ============ */}
      <header className="bt-hero" id="top" data-screen-label="Hero">
        <div className="bt-hero__inner">
          <span className="bt-hero__eyebrow">{c.hero.eyebrow}</span>
          <h1 className="bt-hero__title">{c.hero.title}</h1>
          <p className="bt-hero__sub">{c.hero.subtitle}</p>
        </div>
      </header>

      {/* ============ THE CHALLENGE (one heading + What you see / What we see) ============ */}
      <section className="bt-sec bt-sec--light" id="challenge" data-screen-label="The challenge">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <h2 className="bt-h2">{c.challenge.h2}</h2>
          </header>
          <div className="bt-challenge">
            <div>
              <h3 className="bt-sublabel">{c.challenge.you.label}</h3>
              <p className="bt-intro">{c.challenge.you.body}</p>
            </div>
            <div>
              <h3 className="bt-sublabel">{c.challenge.we.label}</h3>
              <ul className="bt-modules">
                {c.challenge.we.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW WE'LL APPROACH (light) ============ */}
      <section className="bt-sec bt-sec--light bt-sec--compact" id="approach" data-screen-label="How we'll approach">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <h2 className="bt-h2">{c.approach.h2}</h2>
            <p className="bt-intro">{c.approach.intro}</p>
          </header>
          <div className="bt-eps">
            {c.approach.points.map((p) => (
              <div className="bt-ep" key={p.name}>
                <span className="bt-ep__num">{p.metric}</span>
                <h3 className="bt-ep__name">{p.name}</h3>
                <p className="bt-ep__text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT WE'LL DO (sprint intro + phases) ============ */}
      <section className="bt-sec bt-sec--light" id="phases" data-screen-label="What we'll do">
        <div className="bt-inner">
          <header className="bt-head bt-head--compact">
            <h2 className="bt-h2">What we'll do</h2>
            <p className="bt-intro">{c.sprint.lead} {c.sprint.note}</p>
          </header>
          <ul className="bt-modules">
            {c.sprint.nutshell.map((n) => <li key={n}>{n}</li>)}
          </ul>
          <ol className="bt-phases">
            {c.phases.map((ph) => (
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
                  {ph.modules.length > 0 ? (
                    <ul className="bt-modules">
                      {ph.modules.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ WHAT WE'VE DONE ============ */}
      <section className="bt-sec bt-sec--light" id="experience" data-screen-label="What we've done">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <h2 className="bt-h2">{c.experience.h2}</h2>
          </header>
          <div className="bt-projects">
            {c.experience.projects.map((p) => (
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

      {/* ============ INVESTMENT & TIMELINE (light) ============ */}
      <section className="bt-sec bt-sec--light bt-sec--compact" id="investment" data-screen-label="Investment & timeline">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <h2 className="bt-h2">{c.investment.eyebrow}</h2>
          </header>
          <div className="bt-invest">
            <div className="bt-invest__price">{c.investment.price}</div>
            <p className="bt-invest__terms">{c.investment.terms}</p>
            <div className="bt-invest__pay">
              <h3 className="bt-sublabel">{c.investment.paymentLabel}</h3>
              <p className="bt-intro">{c.investment.payment}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEXT STEP (final CTA) ============ */}
      <section className="bt-final" id="contact" data-screen-label="Next step">
        <div className="bt-final__inner">
          <h2 className="bt-final__h2">{c.nextStep.eyebrow}</h2>
          <p className="bt-final__copy">{c.nextStep.body}</p>
          <Pill label={c.nextStep.cta} />
          <a className="bt-final__email" href={MAIL}>yegor@backspaceoddity.com</a>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bt-footer" data-screen-label="Footer">
        <div>
          <div className="bt-footer__logo">
            <img className="bt-footer__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" />
            <span>Backspace<br />Oddity</span>
          </div>
          <div className="bt-footer__copy">© Backspace Oddity 2026</div>
        </div>
        <div className="bt-footer__col">
          <span className="bt-footer__label">{c.footer.thisPage}</span>
          {c.footer.links.map((l) => <a href={l.href} key={l.href}>{l.label}</a>)}
        </div>
        <div className="bt-footer__col">
          <span className="bt-footer__label">{c.footer.reach}</span>
          <a href={MAIL}>yegor@backspaceoddity.com</a>
          <button type="button" className="bt-cta-link" {...CAL_TRIGGER}>{c.nav.book}</button>
          <span>{c.footer.city}</span>
        </div>
      </footer>
    </div>
  );
}
