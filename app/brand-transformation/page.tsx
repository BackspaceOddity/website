import type { Metadata } from "next";
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

const CAL = "https://cal.com/krbnkv/30min";
const MAIL = "mailto:yegor@backspaceoddity.com";

function Pill({ href, label }: { href: string; label: string }) {
  return (
    <a className="bt-pill" href={href}>
      {label}
      <span className="bt-pill__arrow" aria-hidden="true">→</span>
    </a>
  );
}

export default function BrandTransformationPage() {
  return (
    <div className="page bt-page" data-screen-label="Brand Transformation">
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
            <a href={CAL}>Book a call</a>
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
          <span className="bt-hero__eyebrow">Brand transformation &amp; rebranding</span>
          <h1 className="bt-hero__title">We turn brand into a growth lever that compounds</h1>
          <p className="bt-hero__sub">
            Brand stops being decoration — it becomes the assembly point of your company: who
            you&apos;re for, how you&apos;re different, and why you. Built end-to-end, strategy to
            launch, AI-native — and kept as a living system, not a project that ends.
          </p>
          <Pill href={CAL} label="Book a call" />
        </div>
      </header>

      {/* ============ WHEN YOU NEED A REBRAND ============ */}
      <section className="bt-sec bt-sec--light" id="when" data-screen-label="02 When you need a rebrand">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">When a rebrand earns its place</span>
            <h2 className="bt-h2">When you need this</h2>
            <p className="bt-intro">
              We work modularly. After a short diagnostic we assemble a proposal for your specific
              task — from a positioning refresh to a full rebrand with renaming.
            </p>
          </header>

          <ol className="bt-list">
            <li className="bt-row">
              <div className="bt-row__num">01</div>
              <div className="bt-row__body">
                <h3 className="bt-row__name">Moving up-market</h3>
                <p className="bt-row__text">
                  SMB → Enterprise — signal the market that you&apos;re no longer a startup.
                </p>
              </div>
            </li>
            <li className="bt-row">
              <div className="bt-row__num">02</div>
              <div className="bt-row__body">
                <h3 className="bt-row__name">A market full of lookalikes</h3>
                <p className="bt-row__text">
                  Competitors say and look the same — you need to explain how you&apos;re different.
                </p>
              </div>
            </li>
            <li className="bt-row">
              <div className="bt-row__num">03</div>
              <div className="bt-row__body">
                <h3 className="bt-row__name">Raising investment</h3>
                <p className="bt-row__text">Package the company so investors want in.</p>
              </div>
            </li>
            <li className="bt-row">
              <div className="bt-row__num">04</div>
              <div className="bt-row__body">
                <h3 className="bt-row__name">Category shift</h3>
                <p className="bt-row__text">
                  M&amp;A, a new business model, a shifted product-market fit, or launching a product
                  in a new category.
                </p>
              </div>
            </li>
            <li className="bt-row">
              <div className="bt-row__num">05</div>
              <div className="bt-row__body">
                <h3 className="bt-row__name">Entering new markets</h3>
                <p className="bt-row__text">
                  New countries and audiences — the brand has to speak their language.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ============ WHY A BRAND MATTERS ============ */}
      <section className="bt-block" id="why" data-screen-label="03 Why a brand matters">
        <div className="bt-inner">
          <header className="bt-head">
            <span className="bt-eyebrow bt-eyebrow--on-dark">Why a brand matters</span>
            <h2 className="bt-h2 bt-h2--on-dark">A brand is a competitive moat</h2>
            <p className="bt-intro bt-intro--on-dark">
              The one advantage competitors can&apos;t copy — it drives four growth levers.
            </p>
          </header>

          <ol className="bt-leverages">
            <li className="bt-leverage">
              <h3 className="bt-leverage__name">Acquisition</h3>
              <p className="bt-leverage__text">
                With equal offers, people pick the brand they know — cheaper to acquire.
              </p>
            </li>
            <li className="bt-leverage">
              <h3 className="bt-leverage__name">Retention</h3>
              <p className="bt-leverage__text">People return to a brand they love and stay longer.</p>
            </li>
            <li className="bt-leverage">
              <h3 className="bt-leverage__name">Monetization</h3>
              <p className="bt-leverage__text">People pay more for a strong brand.</p>
            </li>
            <li className="bt-leverage">
              <h3 className="bt-leverage__name">Referral</h3>
              <p className="bt-leverage__text">A loved brand gets recommended.</p>
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
          </header>
          <div className="bt-cards">
            <article className="bt-card">
              <div className="bt-card__transform">
                <span className="bt-card__from">RealtimeBoard</span>
                <span className="bt-card__arrow" aria-hidden="true">→</span>
                <span className="bt-card__to">Miro</span>
              </div>
              <div className="bt-card__foot">
                <p className="bt-card__desc">
                  Full rebrand and brand architecture — followed by a path to a $17.5B valuation.
                </p>
                <span className="bt-tag">Rebrand</span>
              </div>
            </article>
            <article className="bt-card">
              <div className="bt-card__transform">
                <span className="bt-card__from">Stape</span>
                <span className="bt-card__arrow" aria-hidden="true">→</span>
                <span className="bt-card__to">Kleos</span>
              </div>
              <div className="bt-card__foot">
                <p className="bt-card__desc">Renaming, positioning, and a new brand identity.</p>
                <span className="bt-tag">Renaming</span>
              </div>
            </article>
            <article className="bt-card">
              <div className="bt-card__transform">
                <span className="bt-card__to">Sidekick</span>
              </div>
              <div className="bt-card__foot">
                <p className="bt-card__desc">Sidekick browser — acquired by Perplexity.</p>
                <span className="bt-tag">Acquired</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============ HOW WE WORK ============ */}
      <section className="bt-block" id="how" data-screen-label="05 How we work">
        <div className="bt-inner">
          <header className="bt-head">
            <span className="bt-eyebrow bt-eyebrow--on-dark">How we work</span>
            <h2 className="bt-h2 bt-h2--on-dark">One continuous process — and a system you keep</h2>
          </header>
          <p className="bt-how__intro">
            You get it built end-to-end — strategy to launch, AI-native — and keep it as a living
            system, not a project that ends.
          </p>
          <div className="bt-principles">
            <div className="bt-principle">
              <h3 className="bt-principle__name">Strategy ↔ execution, end-to-end</h3>
              <p className="bt-principle__text">
                You get strategy, brand, content, website, and launch as one continuous process —
                not five contractors to coordinate.
              </p>
            </div>
            <div className="bt-principle">
              <h3 className="bt-principle__name">Brand is a means, not the goal</h3>
              <p className="bt-principle__text">
                Your brand becomes a tool for a durable business strategy, not an end in itself —
                you walk away with results, not a rebrand for its own sake.
              </p>
            </div>
            <div className="bt-principle">
              <h3 className="bt-principle__name">AI-native</h3>
              <p className="bt-principle__text">
                You inherit a working system, not a folder of files: a Figma ↔ code design system,
                your Messaging House in Notion, plus our agents and assets you keep using.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW THE PROPOSAL IS BUILT ============ */}
      <section className="bt-sec bt-sec--light" id="proposal" data-screen-label="06 The proposal">
        <div className="bt-diagnostic">
          <span className="bt-eyebrow">How the proposal is built</span>
          <h2 className="bt-diagnostic__title">Mini-diagnostic → a proposal tailored to you</h2>
          <p className="bt-diagnostic__text">
            We start with a short diagnostic: goal, brand state, market, timeline. Based on it we
            lock the scope — which phases and modules are included — and assemble the final proposal
            for your specific task.
          </p>
        </div>
      </section>

      {/* ============ PHASES & TIMELINE ============ */}
      <section className="bt-sec bt-sec--light" id="timeline" data-screen-label="07 Phases & timeline">
        <div className="bt-inner">
          <header className="bt-head bt-head--gap">
            <span className="bt-eyebrow">Phases &amp; timeline</span>
            <h2 className="bt-h2">Six phases, assembled to fit</h2>
            <p className="bt-intro">
              Core phases run every project; optional phases switch on when the scope calls for them.
            </p>
          </header>

          <div className="bt-timeline">
            <div className="bt-trow">
              <span className="bt-trow__name">0. Kickoff</span>
              <span className="bt-trow__weeks"><b>1</b> week</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">1. Diagnostics &amp; strategy</span>
              <span className="bt-trow__weeks"><b>4</b> weeks</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">2.1 Brand platform</span>
              <span className="bt-trow__weeks"><b>3</b> weeks</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">2.2 Naming</span>
              <span className="bt-trow__weeks"><b>2</b> weeks</span>
              <span className="bt-trow__tag">optional</span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">3. Production</span>
              <span className="bt-trow__weeks"><b>4</b> weeks</span>
              <span></span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">4. Migration &amp; launch</span>
              <span className="bt-trow__weeks"><b>2–3</b> weeks</span>
              <span className="bt-trow__tag">optional</span>
            </div>
            <div className="bt-trow">
              <span className="bt-trow__name">5. Stabilization &amp; handover</span>
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
            {/* Phase 0 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 0</span>
                <h3 className="bt-phase__name">Kickoff</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">1 week</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We spin up a client workspace in Notion and gather all your raw material in one
                  place.
                </p>
                <ul className="bt-modules">
                  <li>
                    Client workspace in Notion — sprints, tasks, projects, knowledge base, call
                    recordings — plus an inventory of your data sources: analytics, calls, research,
                    documents.
                  </li>
                  <li>Slack for async work, Miro for workshops.</li>
                  <li>Kickoff: goals, success criteria, interview plan.</li>
                  <li>BSO work rhythm: weekly sprints — Mon planning · daily async · Fri retro + client sync.</li>
                </ul>
              </div>
            </li>

            {/* Phase 1 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 1</span>
                <h3 className="bt-phase__name">Diagnostics &amp; strategy</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">4 weeks</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We understand the business, market, and customers — and formulate positioning
                  proven by the customers&apos; own language.
                </p>
                <ul className="bt-modules">
                  <li>Immersion in your raw material — calls, analytics, research — topped up via interviews with founders and team.</li>
                  <li>Product &amp; market audit + competitive analysis and white space.</li>
                  <li>Brand platform workshop: 10-year plan, Why / How / What.</li>
                  <li>Values, mission &amp; vision workshop.</li>
                  <li>Audiences workshop: key segments via JTBD.</li>
                  <li>Brand personality workshop: character, attributes, tone.</li>
                  <li>Brand platform — the 9-box artifact: vision · mission · values · key audiences · meaningful difference · positioning · brand promise · reasons to believe · brand personality.</li>
                  <li>ICP profiles from interviews or call analysis: JTBD, triggers, barriers, buying journey.</li>
                  <li>Positioning — the project&apos;s key fork: territories → choosing a direction → Positioning Canvas + PMF narrative.</li>
                  <li>Messaging foundation: Category Entry Points per segment.</li>
                </ul>
              </div>
            </li>

            {/* Phase 2 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 2</span>
                <h3 className="bt-phase__name">Brand platform</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">3 weeks (+2 naming)</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">We turn strategy into a brand — verbal and visual.</p>
                <div className="bt-phase__subhead">2.1 Verbal &amp; visual brand</div>
                <ul className="bt-modules">
                  <li>Messaging House — universal + situational.</li>
                  <li>Tone of Voice: voice character, principles, the &ldquo;volume knob&rdquo; of tone.</li>
                  <li>Brand identity: logo, typography, palette, graphics.</li>
                  <li>Design system — tokens + components — and brand guidelines.</li>
                  <li>Design system in detail: core components (buttons, nav, forms, cards, grids), spacing &amp; layout rules, tokens (color, shadow, radii, typography, states), interaction patterns (hover, focus, transitions), light + optional dark mode, documented in Figma.</li>
                </ul>
                <div className="bt-phase__subhead">2.2 Naming / renaming · +2 weeks · optional</div>
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
                <span className="bt-phase__kicker">Phase 3</span>
                <h3 className="bt-phase__name">Production</h3>
                <div className="bt-phase__meta"><span className="bt-phase__weeks">4 weeks</span></div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">We build all the brand&apos;s carriers.</p>
                <ul className="bt-modules">
                  <li>Tactical layer per channel: which channels, for which moment.</li>
                  <li>Content for every surface: website, email, ads, social, support, hiring — depending on the product.</li>
                  <li>Website: prototype → design → build, on the platform that fits your needs.</li>
                  <li>Page templates: homepage, use-case templates, acquisition LPs, company info pages, blog index + article — plus reusable components (hero, features, pricing, CTAs, forms, FAQ).</li>
                  <li>Build: project setup (nav, footer, global styles), assembly, responsive behaviors, animations, CMS for blog, final QA.</li>
                  <li>Asset production for dev: finalized &amp; documented Figma files, logo &amp; identity package, exported web assets (SVGs, optimized images), component &amp; template docs.</li>
                  <li>Sales enablement: decks, scripts, objection handling.</li>
                  <li>Marketing &amp; brand assets: social kit, ad creatives, templates.</li>
                </ul>
              </div>
            </li>

            {/* Phase 4 */}
            <li className="bt-phase">
              <div className="bt-phase__aside">
                <span className="bt-phase__kicker">Phase 4</span>
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
                </ul>
                <div className="bt-callout">
                  <span className="bt-callout__title">⚙️ Technical migration — on your side</span>
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
                <span className="bt-phase__kicker">Phase 5</span>
                <h3 className="bt-phase__name">Stabilization &amp; handover</h3>
                <div className="bt-phase__meta">
                  <span className="bt-phase__weeks">2 weeks</span>
                  <span className="bt-phase__opt">optional</span>
                </div>
              </div>
              <div className="bt-phase__main">
                <p className="bt-phase__summary">
                  We lock in the result and hand the brand over to your team — AI-native, so you
                  won&apos;t notice the switch.
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
          <h2 className="bt-final__h2">A quantum leap for your business</h2>
          <p className="bt-final__copy">
            Built end-to-end, strategy to launch — and kept as a living system your team keeps
            working with on its own, not a project that ends.
          </p>
          <Pill href={CAL} label="Book a call" />
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
          <a href={CAL}>Book a call</a>
          <span>Amsterdam</span>
        </div>
      </footer>
    </div>
  );
}
