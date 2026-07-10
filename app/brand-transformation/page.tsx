import type { Metadata } from "next";
import Script from "next/script";
import { LeadForm } from "./LeadForm";
import "./brand-transformation.css";

export const metadata: Metadata = {
  title: "Brand Transformation — Backspace Oddity",
  description:
    "We turn a company into a brand that sells — from strategy and positioning to identity, website, and launch. Evidence-based, modular, AI-native. One continuous process, not five contractors.",
  openGraph: {
    type: "website",
    url: "https://backspaceoddity.com/brand-transformation",
    title: "Brand Transformation — Backspace Oddity",
    description:
      "We turn a company into a brand that sells — from strategy and positioning to identity, website, and launch. Evidence-based, modular, AI-native.",
  },
};

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

export default function BrandTransformationPage() {
  return (
    <div className="page bt-page" data-screen-label="Brand Transformation">
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
            <span className="bt-nav__label">Contact</span>
            <a href={MAIL}>yegor@backspaceoddity.com</a>
            <button type="button" className="bt-cta-link" {...CAL_TRIGGER}>Book a call</button>
          </div>
          <div className="bt-nav__col">
            <span className="bt-nav__label">Office</span>
            <span>Vijzelstraat 68-78</span>
            <span>1017 ES Amsterdam</span>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="bt-hero" id="top" data-screen-label="01 Hero">
        <div className="bt-hero__inner">
          <span className="bt-hero__eyebrow">Brand transformation &amp; rebrand</span>
          <h1 className="bt-hero__title">Turning brand into a growth lever that compounds</h1>
          <div className="bt-hero__how">
            <div className="bt-hero__princ">
              <h3>Strategy ↔ execution, end-to-end</h3>
              <p>
                You get strategy, brand, content, website, and launch as one continuous process —
                not five contractors to coordinate.
              </p>
            </div>
            <div className="bt-hero__princ">
              <h3>Brand is a means, not the goal</h3>
              <p>
                Your brand becomes a tool for a durable business strategy, not an end in itself —
                you walk away with results, not a rebrand for its own sake.
              </p>
            </div>
            <div className="bt-hero__princ">
              <h3>AI-native</h3>
              <p>
                You inherit a working system, not a folder of files: a Figma ↔ code design system,
                your Messaging House in Notion, plus our agents and assets you keep using.
              </p>
            </div>
          </div>
          <Pill label="Book a call" />
        </div>
      </header>

      {/* ============ WHEN YOU NEED A REBRAND ============ */}
      <section className="bt-sec bt-sec--light bt-sec--compact" id="when" data-screen-label="02 When you need a rebrand">
        <div className="bt-inner">
          <header className="bt-head bt-head--compact">
            <span className="bt-eyebrow">When a rebrand earns its place</span>
            <h2 className="bt-h2">When you need this</h2>
            <p className="bt-intro">
              We work modularly. After a short diagnostic we assemble a proposal for your specific
              task — from a positioning refresh to a full rebrand with renaming.
            </p>
          </header>

          <div className="bt-eps">
            <div className="bt-ep">
              <span className="bt-ep__num">01</span>
              <h3 className="bt-ep__name">Moving up-market</h3>
              <p className="bt-ep__text">
                SMB → Enterprise — signal the market that you&apos;re no longer a startup.
              </p>
            </div>
            <div className="bt-ep">
              <span className="bt-ep__num">02</span>
              <h3 className="bt-ep__name">A market full of lookalikes</h3>
              <p className="bt-ep__text">
                Competitors say and look the same — you need to explain how you&apos;re different.
              </p>
            </div>
            <div className="bt-ep">
              <span className="bt-ep__num">03</span>
              <h3 className="bt-ep__name">Raising investment</h3>
              <p className="bt-ep__text">Package the company so investors want in.</p>
            </div>
            <div className="bt-ep">
              <span className="bt-ep__num">04</span>
              <h3 className="bt-ep__name">Category shift</h3>
              <p className="bt-ep__text">
                M&amp;A, a new business model, a shifted product-market fit, or launching a product
                in a new category.
              </p>
            </div>
            <div className="bt-ep">
              <span className="bt-ep__num">05</span>
              <h3 className="bt-ep__name">Entering new markets</h3>
              <p className="bt-ep__text">
                New countries and audiences — the brand has to speak their language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY A BRAND MATTERS ============ */}
      <section className="bt-block" id="why" data-screen-label="03 Why a brand matters">
        <div className="bt-inner">
          <header className="bt-head">
            <span className="bt-eyebrow bt-eyebrow--on-dark">Why a brand matters</span>
            <h2 className="bt-h2 bt-h2--on-dark">Brand is one of the last unfair advantages</h2>
            <p className="bt-intro bt-intro--on-dark">
              Building a product has never been easier — so the moats that came with it are mostly
              gone. Features, distribution, even pricing get copied within a quarter. Brand is one of
              the few advantages a competitor can&apos;t clone — and it compounds into a growth
              flywheel: four levers that feed each other.
            </p>
          </header>

          <ol className="bt-leverages">
            <li className="bt-leverage">
              <span className="bt-leverage__metric">Lower CAC</span>
              <h3 className="bt-leverage__name">Acquisition</h3>
              <p className="bt-leverage__text">
                Buyers pick the brand they already know — so you pay less to win them.
              </p>
            </li>
            <li className="bt-leverage">
              <span className="bt-leverage__metric">Higher LTV</span>
              <h3 className="bt-leverage__name">Retention</h3>
              <p className="bt-leverage__text">
                People stay with a brand they love — churn drops, lifetime value climbs.
              </p>
            </li>
            <li className="bt-leverage">
              <span className="bt-leverage__metric">Pricing power</span>
              <h3 className="bt-leverage__name">Monetization</h3>
              <p className="bt-leverage__text">A strong brand commands a premium on the same product.</p>
            </li>
            <li className="bt-leverage">
              <span className="bt-leverage__metric">Organic growth</span>
              <h3 className="bt-leverage__name">Referral</h3>
              <p className="bt-leverage__text">A loved brand gets recommended — reach you don&apos;t pay for.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ============ OUR EXPERIENCE ============ */}
      <section className="bt-sec bt-sec--light" id="experience" data-screen-label="04 Our experience">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">Our experience</span>
            <h2 className="bt-h2">Brands we&apos;ve transformed</h2>
            <p className="bt-intro">
              Three very different projects — each closing a different part of the same offering.
              Together they map the full arc we run end-to-end: strategy, identity, system, and
              launch.
            </p>
          </header>
          <div className="bt-projects">
            <div className="bt-projitem">
              <a className="bt-proj" href="https://miro.com/" target="_blank" rel="noopener noreferrer">
                <img className="bt-proj__img" src="/images/projects/miro.webp" alt="RealtimeBoard → Miro rebrand" />
                <span className="bt-proj__shade" aria-hidden="true"></span>
                <h3 className="bt-proj__title">RealtimeBoard → Miro</h3>
              </a>
              <p className="bt-proj__desc">
                A full rebrand and brand architecture for the move from RealtimeBoard to Miro — a new
                name, identity, and platform story that scaled into a category leader on the way to a
                $17.5B valuation.
              </p>
            </div>
            <div className="bt-projitem">
              <a className="bt-proj" href="https://kleos.io/" target="_blank" rel="noopener noreferrer">
                <img className="bt-proj__img" src="/images/projects/kleos.webp" alt="Stape → Kleos rebrand" />
                <span className="bt-proj__shade" aria-hidden="true"></span>
                <h3 className="bt-proj__title">Stape → Kleos</h3>
              </a>
              <p className="bt-proj__desc">
                Renaming, repositioning, and a new identity for Stape&apos;s move into a new category
                as Kleos — strategy and brand system built to carry the shift.
              </p>
            </div>
            <div className="bt-projitem">
              <a
                className="bt-proj"
                href="https://www.theinformation.com/briefings/perplexity-buys-browser-startup-sidekick"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="bt-proj__img" src="/images/projects/sidekick.webp" alt="Sidekick browser, acquired by Perplexity" />
                <span className="bt-proj__shade" aria-hidden="true"></span>
                <h3 className="bt-proj__title">Sidekick (acq. Perplexity)</h3>
              </a>
              <p className="bt-proj__desc">
                Brand and positioning for Sidekick, the productivity browser — sharp enough to make
                the product an acquisition target, later bought by Perplexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW THE PROPOSAL IS BUILT ============ */}
      <section className="bt-sec bt-sec--light" id="proposal" data-screen-label="06 The proposal">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">Diagnostic</span>
            <h2 className="bt-h2">Run your business through our frame — get a quick diagnostic</h2>
            <p className="bt-intro">
              A few quick answers and we send back a short diagnostic: the job you&apos;re really
              hired for, who you actually compete with, your biggest opening, and an under-used
              angle. A surface cut of one frame — the full picture is the real work. Takes a minute.
            </p>
          </header>
          <LeadForm />
        </div>
      </section>

      {/* ============ PHASES & TIMELINE ============ */}
      <section className="bt-sec bt-sec--light" id="timeline" data-screen-label="07 Phases & timeline">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">Phases &amp; timeline</span>
            <h2 className="bt-h2">The phases, assembled to fit</h2>
            <p className="bt-intro">
              Core phases run every project; optional phases switch on when the scope calls for them.
            </p>
          </header>

          <div className="bt-timeline">
            <div className="bt-trow">
              <span className="bt-trow__name">1. Project setup</span>
              <span className="bt-trow__weeks"><b>1</b> week</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">2. Brand strategy &amp; platform</span>
              <span className="bt-trow__weeks"><b>4</b> weeks</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">3. Brand system</span>
              <span className="bt-trow__weeks"><b>3</b> weeks</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">+ Naming / renaming</span>
              <span className="bt-trow__weeks"><b>2</b> weeks</span>
              <span className="bt-trow__tag">optional</span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">4. Production</span>
              <span className="bt-trow__weeks"><b>4</b> weeks</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">5. Migration &amp; launch</span>
              <span className="bt-trow__weeks"><b>2–3</b> weeks</span>
              <span className="bt-trow__tag">optional</span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">6. Live system</span>
              <span className="bt-trow__weeks"><b>2</b> weeks</span>
              <span className="bt-trow__tag">optional</span>
            </div>
          </div>
          <p className="bt-total">Total: <b>≈ 16–18 weeks.</b></p>
          <p className="bt-total-note">
            Each phase ends in a client sign-off; further changes require a scope extension.
          </p>
        </div>
      </section>

      {/* ============ PHASE DETAIL ============ */}
      <section className="bt-sec bt-sec--light" id="phases" data-screen-label="08 Phase detail">
        <div className="bt-inner">
          <ol className="bt-phases">
            {/* Project setup */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 1</span>
                <h3 className="bt-phase__name">Project setup</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">1 week</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We spin up a client workspace and gather all your raw material in one place.
                </p>
                <ul className="bt-modules">
                  <li>Client workspace in Notion — sprints, tasks, projects, knowledge base, call recordings — plus an inventory of your data sources: analytics, calls, research, documents.</li>
                  <li>Slack for async work, Miro for workshops.</li>
                  <li>Goals, success criteria, and interview plan agreed up front.</li>
                  <li>BSO work rhythm: weekly sprints — Mon planning · daily async · Fri retro + client sync.</li>
                </ul>
              </div>
            </li>

            {/* Phase 1 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 2</span>
                <h3 className="bt-phase__name">Brand strategy &amp; platform</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">4 weeks</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We understand the business, market, and customers — and develop positioning
                  rooted in real customers&apos; data and insights.
                </p>
                <ul className="bt-modules">
                  <li>Immersion in your raw material — calls, analytics, research — topped up via interviews with founders and team.</li>
                  <li>Product &amp; market audit + competitive analysis and white space.</li>
                  <li>Brand platform workshop: 10-year plan, Why / How / What.</li>
                  <li>Values, mission &amp; vision workshop.</li>
                  <li>Audiences workshop: key segments via JTBD.</li>
                  <li>Brand personality workshop: character, attributes, tone.</li>
                  <li>ICP profiles from interviews or call analysis: JTBD, triggers, barriers, buying journey.</li>
                  <li>Positioning — the project&apos;s key fork: territories → choosing a direction → Positioning Canvas + PMF narrative.</li>
                  <li>Messaging foundation: Category Entry Points per segment.</li>
                  <li>AI-native delivery: strategy and positioning land as living context your agents can work from — not just a PDF deck.</li>
                </ul>
              </div>
            </li>

            {/* Phase 2 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 3</span>
                <h3 className="bt-phase__name">Brand system</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">3 weeks (+2 naming)</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">We turn strategy into a brand — verbal and visual.</p>
                <ul className="bt-modules">
                  <li>Messaging House — universal + situational.</li>
                  <li>Tone of Voice: voice character, principles, the &ldquo;volume knob&rdquo; of tone.</li>
                  <li>Brand identity: logo, typography, palette, graphics.</li>
                  <li>Design system — tokens + components — and brand guidelines.</li>
                  <li>Design system in detail: core components (buttons, nav, forms, cards, grids), spacing &amp; layout rules, tokens (color, shadow, radii, typography, states), interaction patterns (hover, focus, transitions), light + optional dark mode, documented in Figma.</li>
                  <li>AI-native delivery: the design system and Messaging House ship ready for agents — working context your team&apos;s AI can build on, not files someone has to re-interpret.</li>
                </ul>
                <div className="bt-phase__subhead">Naming / renaming · +2 weeks · optional</div>
                <ul className="bt-modules">
                  <li>If the name can&apos;t carry the new strategy.</li>
                  <li>Brief and agreed naming criteria.</li>
                  <li>Name generation + trademark check.</li>
                  <li>Final name, rationale, domains.</li>
                </ul>
              </div>
            </li>

            {/* Phase 3 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 4</span>
                <h3 className="bt-phase__name">Production</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">4 weeks</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">We build all the brand&apos;s assets.</p>
                <ul className="bt-modules">
                  <li>Creative assets across multiple channels: website, email, ads, social, support, hiring — depending on the product.</li>
                  <li>Website: prototype → design → build, on the platform that fits your needs.</li>
                  <li>Page templates: homepage, use-case templates, acquisition LPs, company info pages, blog index + article — plus reusable components (hero, features, pricing, CTAs, forms, FAQ).</li>
                  <li>Build: project setup (nav, footer, global styles), assembly, responsive behaviors, animations, CMS for blog, final QA.</li>
                  <li>Asset production for dev: finalized &amp; documented Figma files, logo &amp; identity package, exported web assets (SVGs, optimized images), component &amp; template docs.</li>
                  <li>Sales enablement: decks, scripts, objection handling.</li>
                  <li>Marketing &amp; brand assets: social kit, ad creatives, templates.</li>
                  <li>AI-native delivery: templates and assets handed over in a format your agents can pick up and run with — not a static folder to wire up by hand.</li>
                </ul>
              </div>
            </li>

            {/* Phase 4 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 5</span>
                <h3 className="bt-phase__name">Migration &amp; launch</h3>
                <div className="bt-phase__meta">
                  <span className="bt-phase__weeks">2–3 weeks</span>
                  <span className="bt-phase__opt">optional</span>
                </div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We switch the world over to the new brand without losing customers. Needed for any
                  launch — not only when renaming.
                </p>
                <ul className="bt-modules">
                  <li>Customer comms and trust preservation: announcements, FAQ, contracts.</li>
                  <li>Internal brand adoption: onboarding decks, team checklists, internal presentations.</li>
                  <li>Launch orchestration: readiness → release runbook → final check.</li>
                  <li>
                    Rollout across hundreds of touchpoints — every asset, channel, integration, and
                    account. The most underestimated part of a rebrand: reaching launch isn&apos;t
                    enough — you have to run the whole todo-list and hit the date exactly.
                  </li>
                  <li>AI-native delivery: the launch runbook, comms, and assets are handed over agent-ready — your team and its agents can run the rollout, not just read it.</li>
                </ul>
                <div className="bt-callout">
                  <span className="bt-callout__title">Technical migration — on your side</span>
                  <p className="bt-callout__text">
                    Domains, SSO, redirects, and the product rebrand itself are handled by your
                    engineering team. We coordinate the launch and dependencies.
                  </p>
                </div>
              </div>
            </li>

            {/* Phase 5 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 6</span>
                <h3 className="bt-phase__name">Live system</h3>
                <div className="bt-phase__meta">
                  <span className="bt-phase__weeks">2 weeks</span>
                  <span className="bt-phase__opt">optional</span>
                </div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We don&apos;t just hand the brand over — we turn the project into a living system
                  your team keeps working in. The goal is the lowest-friction switch possible: you
                  wake up in the new brand and keep moving, instead of rolling it out for months.
                </p>
                <ul className="bt-modules">
                  <li>First-week monitoring: traffic, conversion, churn.</li>
                  <li>Long tail: finishing the brand across every corner of the product.</li>
                  <li>Rebrand success metrics.</li>
                  <li>A Figma design system connected to code (Figma ↔ CC) — designers work in a ready system right away.</li>
                  <li>Messaging House, brand guidelines, and assets live in your Notion and update via agents.</li>
                  <li>Everything connected into one system: strategy → tactics → creative execution.</li>
                  <li>Access to our agents and assets by subscription; marketing &amp; GTM automations on request, as a separate scope.</li>
                </ul>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bt-final" id="contact" data-screen-label="09 Final CTA">
        <div className="bt-final__inner">
          <h2 className="bt-final__h2">A quantum leap for your business (seriously)</h2>
          <p className="bt-final__copy">
            Built end-to-end, strategy to launch — and kept as a living system your team keeps
            working with on its own, not a project that ends.
          </p>
          <Pill label="Book a call" />
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
          <span className="bt-footer__label">This page</span>
          <a href="#when">When you need it</a>
          <a href="#timeline">Phases &amp; timeline</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="bt-footer__col">
          <span className="bt-footer__label">Reach us</span>
          <a href={MAIL}>yegor@backspaceoddity.com</a>
          <button type="button" className="bt-cta-link" {...CAL_TRIGGER}>Book a call</button>
          <span>Amsterdam</span>
        </div>
      </footer>
    </div>
  );
}
