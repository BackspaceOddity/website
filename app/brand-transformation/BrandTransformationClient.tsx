"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { LeadForm } from "./LeadForm";
import { content, type Lang } from "./content";

const MAIL = "mailto:yegor@backspaceoddity.com";

// cal.com floating pop-up — data-cal attrs on a <button> (no href, so the click never navigates)
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

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="bt-lang" role="group" aria-label="Language">
      {(["en", "ru"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          className={`bt-lang__btn${lang === l ? " is-active" : ""}`}
          aria-pressed={lang === l}
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function BrandTransformationClient() {
  const [lang, setLang] = useState<Lang>("en");

  // Restore saved choice on mount.
  useEffect(() => {
    const saved = window.localStorage.getItem("bt-lang");
    if (saved === "en" || saved === "ru") setLang(saved);
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    window.localStorage.setItem("bt-lang", l);
    document.documentElement.lang = l;
  }

  const c = content[lang];

  return (
    <div className="page bt-page" data-screen-label="Brand Transformation" lang={lang}>
      {/* cal.com element-click embed (floating pop-up) */}
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
          <LangSwitch lang={lang} onChange={changeLang} />
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="bt-hero" id="top" data-screen-label="01 Hero">
        <div className="bt-hero__inner">
          <span className="bt-hero__eyebrow">{c.hero.eyebrow}</span>
          <h1 className="bt-hero__title">{c.hero.title}</h1>
          <div className="bt-hero__how">
            {c.hero.principles.map((p) => (
              <div className="bt-hero__princ" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <Pill label={c.hero.cta} />
        </div>
      </header>

      {/* ============ WHEN YOU NEED A REBRAND ============ */}
      <section className="bt-sec bt-sec--light bt-sec--compact" id="when" data-screen-label="02 When you need a rebrand">
        <div className="bt-inner">
          <header className="bt-head bt-head--compact">
            <span className="bt-eyebrow">{c.when.eyebrow}</span>
            <h2 className="bt-h2">{c.when.h2}</h2>
            <p className="bt-intro">{c.when.intro}</p>
          </header>
          <div className="bt-eps">
            {c.when.entries.map((e) => (
              <div className="bt-ep" key={e.num}>
                <span className="bt-ep__num">{e.num}</span>
                <h3 className="bt-ep__name">{e.name}</h3>
                <p className="bt-ep__text">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY A BRAND MATTERS ============ */}
      <section className="bt-block" id="why" data-screen-label="03 Why a brand matters">
        <div className="bt-inner">
          <header className="bt-head">
            <span className="bt-eyebrow bt-eyebrow--on-dark">{c.why.eyebrow}</span>
            <h2 className="bt-h2 bt-h2--on-dark">{c.why.h2}</h2>
            <p className="bt-intro bt-intro--on-dark">{c.why.intro}</p>
          </header>
          <ol className="bt-leverages">
            {c.why.levers.map((l) => (
              <li className="bt-leverage" key={l.name}>
                <span className="bt-leverage__metric">{l.metric}</span>
                <h3 className="bt-leverage__name">{l.name}</h3>
                <p className="bt-leverage__text">{l.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ OUR EXPERIENCE ============ */}
      <section className="bt-sec bt-sec--light" id="experience" data-screen-label="04 Our experience">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">{c.experience.eyebrow}</span>
            <h2 className="bt-h2">{c.experience.h2}</h2>
            <p className="bt-intro">{c.experience.intro}</p>
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

      {/* ============ DIAGNOSTIC ============ */}
      <section className="bt-sec bt-sec--light" id="proposal" data-screen-label="06 The proposal">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">{c.diagnostic.eyebrow}</span>
            <h2 className="bt-h2">{c.diagnostic.h2}</h2>
            <p className="bt-intro">{c.diagnostic.intro}</p>
          </header>
          <LeadForm lang={lang} />
        </div>
      </section>

      {/* ============ PHASES & TIMELINE ============ */}
      <section className="bt-sec bt-sec--light" id="timeline" data-screen-label="07 Phases & timeline">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">{c.timeline.eyebrow}</span>
            <h2 className="bt-h2">{c.timeline.h2}</h2>
            <p className="bt-intro">{c.timeline.intro}</p>
          </header>
          <div className="bt-timeline">
            {c.timeline.rows.map((r) => (
              <div className="bt-trow" key={r.name}>
                <span className="bt-trow__name">{r.name}</span>
                <span className="bt-trow__weeks" dangerouslySetInnerHTML={{ __html: r.weeks }} />
                {r.tag ? <span className="bt-trow__tag">{r.tag}</span> : <span></span>}
              </div>
            ))}
          </div>
          <p className="bt-total" dangerouslySetInnerHTML={{ __html: c.timeline.total }} />
          <p className="bt-total-note">{c.timeline.totalNote}</p>
        </div>
      </section>

      {/* ============ PHASE DETAIL ============ */}
      <section className="bt-sec bt-sec--light" id="phases" data-screen-label="08 Phase detail">
        <div className="bt-inner">
          <ol className="bt-phases">
            {c.phases.map((ph) => (
              <li className="bt-phase" key={ph.kicker}>
                <div className="bt-phase__aside">
                  <span className="bt-phase__kicker">{ph.kicker}</span>
                  <h3 className="bt-phase__name">{ph.name}</h3>
                  <div className="bt-phase__meta">
                    <span className="bt-phase__weeks">{ph.meta}</span>
                    {ph.optional ? <span className="bt-phase__opt">{ph.optional}</span> : null}
                  </div>
                </div>
                <div className="bt-phase__main">
                  <p className="bt-phase__summary">{ph.summary}</p>
                  <ul className="bt-modules">
                    {ph.modules.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                  {ph.subhead ? <div className="bt-phase__subhead">{ph.subhead}</div> : null}
                  {ph.subModules ? (
                    <ul className="bt-modules">
                      {ph.subModules.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  ) : null}
                  {ph.callout ? (
                    <div className="bt-callout">
                      <span className="bt-callout__title">{ph.callout.title}</span>
                      <p className="bt-callout__text">{ph.callout.text}</p>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bt-final" id="contact" data-screen-label="09 Final CTA">
        <div className="bt-final__inner">
          <h2 className="bt-final__h2">{c.final.h2}</h2>
          <p className="bt-final__copy">{c.final.copy}</p>
          <Pill label={c.final.cta} />
          <a className="bt-final__email" href={MAIL}>yegor@backspaceoddity.com</a>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bt-footer" data-screen-label="10 Footer">
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
