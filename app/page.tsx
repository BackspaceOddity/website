import type { ReactNode } from "react";

// V1 edit-mode removed (BSO-658): EditableText is now a plain inline passthrough,
// so the homepage renders without the legacy EditModeProvider.
function EditableText({ children }: { id?: string; children?: ReactNode }) {
  return <>{children}</>;
}

export default function HomePage() {
  return (
    <div className="page" data-screen-label="Homepage">
      {/* ============ NAV ============ */}
      <nav className="nav" aria-label="Primary">
        <a href="#top" className="nav__logo" aria-label="Backspace Oddity">
          <img className="nav__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" />
          <span className="nav__logo-text">
            <span>Backspace</span>
            <span>Oddity</span>
          </span>
        </a>
        <div className="nav__right">
          <div className="nav__block">
            <span className="nav__block-label">
              <EditableText id="nav.contact.label">Contact us:</EditableText>
            </span>
            <a href="mailto:yegor@backspaceoddity.com">
              <EditableText id="nav.contact.email">yegor@backspaceoddity.com</EditableText>
            </a>
            <div>
              <a href="https://cal.com/krbnkv/30min">
                <EditableText id="nav.contact.cta">Book a call</EditableText>
              </a>
            </div>
          </div>
          <div className="nav__block">
            <span className="nav__block-label">
              <EditableText id="nav.office.label">Office:</EditableText>
            </span>
            <div>
              <EditableText id="nav.office.line1">Vijzelstraat 68-78</EditableText>
            </div>
            <div>
              <EditableText id="nav.office.line2">1017 ES Amsterdam</EditableText>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ SCREEN 1 — HERO ============ */}
      <section className="hero" id="top" data-screen-label="01 Hero">
        <div className="hero__bg" aria-hidden="true"></div>
        <div className="hero__inner">
          <h1 className="hero__title">
            <EditableText id="hero.h1">GTM strategy is not a set of tactics across channels</EditableText>
          </h1>
          <p className="hero__sub">
            <EditableText id="hero.sub">{`It's what channels execute — who your audience is, the job they need done, the context they're buying in, who you compete with there, and why you fit best.`}</EditableText>
          </p>
          <a className="hero__cta" href="https://cal.com/krbnkv/30min">
            <EditableText id="hero.cta">Book a call</EditableText>
            <span className="hero__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </section>

      {/* ============ SCREEN 2 — THREE LAYERS ============ */}
      <section className="layers" id="approach" data-screen-label="02 Three layers">
        <div className="layers__inner">
          <header className="layers__head">
            <span className="layers__eyebrow">
              <EditableText id="layers.eyebrow">What we mean by GTM strategy</EditableText>
            </span>
            <h2 className="section-h2">
              <EditableText id="layers.h2">{`Three layers under every channel that actually runs`}</EditableText>
            </h2>
            <p className="layers__intro">
              <EditableText id="layers.intro">{`Strategy without operationalisation drifts in a quarter. Channels without strategy underneath burn budget without compounding. We work the gap between the two — three layers, in this order.`}</EditableText>
            </p>
          </header>

          <ol className="layers__list">
            <li className="layer">
              <div className="layer__num">01</div>
              <div className="layer__body">
                <h3 className="layer__name">
                  <EditableText id="layer.strategy.name">Strategy</EditableText>
                </h3>
                <p className="layer__lead">
                  <EditableText id="layer.strategy.lead">Which battles to fight.</EditableText>
                </p>
                <p className="layer__body-text">
                  <EditableText id="layer.strategy.body">{`Underserved jobs, ICP, positioning, narrative, the messaging architecture that makes a stranger pick you on the second meeting. The decisions every channel runs on, whether you've made them explicitly or not.`}</EditableText>
                </p>
              </div>
            </li>

            <li className="layer">
              <div className="layer__num">02</div>
              <div className="layer__body">
                <h3 className="layer__name">
                  <EditableText id="layer.tactics.name">Tactics</EditableText>
                </h3>
                <p className="layer__lead">
                  <EditableText id="layer.tactics.lead">How to run them.</EditableText>
                </p>
                <p className="layer__body-text">
                  <EditableText id="layer.tactics.body">{`PR, cold outreach, advertising, content, partnerships, events — the moves you make, paired with the channels they live in: LinkedIn, email, podcasts, paid, owned. Category Entry Points are the lens that pulls all of this into one coherent GTM — every tactic anchored to a moment a buyer is actually in, not a slot in your campaign calendar.`}</EditableText>
                </p>
              </div>
            </li>

            <li className="layer">
              <div className="layer__num">03</div>
              <div className="layer__body">
                <h3 className="layer__name">
                  <EditableText id="layer.exec.name">Creative execution</EditableText>
                </h3>
                <p className="layer__lead">
                  <EditableText id="layer.exec.lead">Making it ship — without the headcount bottleneck.</EditableText>
                </p>
                <p className="layer__body-text">
                  <EditableText id="layer.exec.body">{`Strategy lands as a deck. Then channels have to learn it, ship it, and repeat it across hundreds of touchpoints — stuck waiting on a creative team that can't scale. AI-native production turns site, content, campaigns, and sales collateral from headcount-bound projects into a system that ships daily and compounds with every release.`}</EditableText>
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ============ SCREEN 3 — SELECTED WORK ============ */}
      <section className="work" id="work" data-screen-label="03 Work">
        <header className="work__head">
          <h2 className="section-h2">
            <EditableText id="work.h2">{`Companies we've worked with`}</EditableText>
          </h2>
        </header>

        <div className="work__grid">
          <div className="work__row work__row--60-40">
            <a className="card" href="https://miro.com" target="_blank" rel="noopener" data-case="miro">
              <img
                className="card__backdrop"
                src="/images/project-miro.webp"
                alt=""
                loading="lazy"
                style={{ objectPosition: "50% 25%" }}
              />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  <EditableText id="card.miro.description">{`From RealtimeBoard to Miro: new name, identity, and brand architecture. Then an in-house studio built to keep the brand running, not just documented — so any internal request could close with the same predictability, without heroics. Path to a $17.5B valuation followed.`}</EditableText>
                  <span className="card__role">
                    <EditableText id="card.miro.role">{`Our role — full rebrand + in-house studio setup.`}</EditableText>
                  </span>
                </p>
              </div>
              <h3 className="card__title">
                <EditableText id="card.miro.title">Rebrand: from RealtimeBoard to Miro (in-house)</EditableText>
              </h3>
            </a>
            <a className="card" href="#" data-case="sidekick">
              <img className="card__backdrop" src="/images/project-sidekick.webp" alt="" loading="lazy" />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  <EditableText id="card.sidekick.description">{`Product repositioning and category creation: the productivity browser as a distinct class for power users. Acquired by Perplexity in 2025, relaunched as Comet Browser.`}</EditableText>
                  <span className="card__role">
                    <EditableText id="card.sidekick.role">{`Our role — product repositioning, category creation.`}</EditableText>
                  </span>
                </p>
              </div>
              <h3 className="card__title">
                <EditableText id="card.sidekick.title">Sidekick Browser (in-house)</EditableText>
              </h3>
            </a>
          </div>

          <div className="work__row work__row--50-50">
            <a className="card" href="#" data-case="payroll">
              <img
                className="card__backdrop"
                src="/images/project-global-payroll.webp"
                alt=""
                loading="lazy"
              />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  <EditableText id="card.payroll.description">{`Cross-border employment is a category of compliance nightmares and lookalike brands. A new name, positioning, and identity gave this platform a reason to be chosen side-by-side. Agentic workflows behind the brand now run the parts that don't need a human.`}</EditableText>
                  <span className="card__role">
                    <EditableText id="card.payroll.role">{`Our role — brand strategy, renaming, positioning, identity, agentic workflows.`}</EditableText>
                  </span>
                </p>
              </div>
              <h3 className="card__title">
                <EditableText id="card.payroll.title">Global Payroll Platform</EditableText>
              </h3>
            </a>
            <a className="card" href="#" data-case="film">
              <img className="card__backdrop" src="/images/project-film.webp" alt="" loading="lazy" />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  <EditableText id="card.film.description">{`Stage-gate architecture for content-IP investment decisions. Every experiment doesn't just test one hypothesis — it updates the whole map. A working framework for who decides, on what evidence, and what "hypothesis confirmed" actually means in the content business.`}</EditableText>
                  <span className="card__role">
                    <EditableText id="card.film.role">{`Our role — governance model + Cascade Navigation System (v5.1 origin).`}</EditableText>
                  </span>
                </p>
              </div>
              <h3 className="card__title">
                <EditableText id="card.film.title">AI-native Film Production Company</EditableText>
              </h3>
            </a>
          </div>

          <div className="work__row work__row--40-60">
            <a className="card" href="#" data-case="wayfund">
              <img className="card__backdrop" src="/images/project-wayfund.webp" alt="" loading="lazy" />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  <EditableText id="card.wayfund.description">{`Customer development, market opportunity mapping, product development, and agentic workflows for an AI-powered platform helping EU SMEs find and access government funding.`}</EditableText>
                  <span className="card__role">
                    <EditableText id="card.wayfund.role">{`Our role — customer development, market mapping, product, agentic workflows.`}</EditableText>
                  </span>
                </p>
              </div>
              <h3 className="card__title">
                <EditableText id="card.wayfund.title">Wayfund</EditableText>
              </h3>
            </a>
            <a className="card" href="#" data-case="superabundance">
              <img
                className="card__backdrop"
                src="/images/project-superabundance.webp"
                alt=""
                loading="lazy"
                style={{ objectPosition: "50% 8%" }}
              />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  <EditableText id="card.superabundance.description">{`A studio running multiple portfolio companies at once needed a shared methodology for when to push, when to kill, and when to hand off. We built that methodology plus agentic workflows around every stage-gate.`}</EditableText>
                  <span className="card__role">
                    <EditableText id="card.superabundance.role">{`Our role — market-product fit methodology + agentic workflows + brand identity + positioning + website.`}</EditableText>
                  </span>
                </p>
              </div>
              <h3 className="card__title">
                <EditableText id="card.superabundance.title">Superabundance</EditableText>
              </h3>
            </a>
          </div>
        </div>
      </section>

      {/* ============ SCREEN 3 — JOBS WE CLOSE ============ */}
      <section className="jobs" id="jobs" data-screen-label="03 Jobs">
        <header className="jobs__head">
          <h2 className="section-h2">
            <EditableText id="jobs.h2">The jobs we close</EditableText>
          </h2>
          <p className="jobs__intro">
            <EditableText id="jobs.intro">Pick the one that matches where you are</EditableText>
          </p>
        </header>

        <div className="jobs__list">
          <article className="job">
            <div className="job__num">01</div>
            <div className="job__body">
              <h3 className="job__headline">
                <EditableText id="job.01.headline">{`Move upmarket to enterprise buyers — when our brand still signals "scrappy startup"`}</EditableText>
              </h3>
            </div>
          </article>

          <article className="job">
            <div className="job__num">02</div>
            <div className="job__body">
              <h3 className="job__headline">
                <EditableText id="job.02.headline">{`Outpace competitors in a highly competitive market`}</EditableText>
              </h3>
            </div>
          </article>

          <article className="job">
            <div className="job__num">03</div>
            <div className="job__body">
              <h3 className="job__headline">
                <EditableText id="job.03.headline">{`Operationalise strategy into a system that runs daily`}</EditableText>
              </h3>
            </div>
          </article>

          <article className="job">
            <div className="job__num">04</div>
            <div className="job__body">
              <h3 className="job__headline">
                <EditableText id="job.04.headline">{`Treat every launch as hypotheses we test, not as a plan we execute until we die`}</EditableText>
              </h3>
            </div>
          </article>

          <article className="job">
            <div className="job__num">05</div>
            <div className="job__body">
              <h3 className="job__headline">
                <EditableText id="job.05.headline">{`Turn "become AI-native" from wishful thinking into workflows the team actually runs daily`}</EditableText>
              </h3>
            </div>
          </article>
        </div>
      </section>

      {/* ============ SCREEN 4 — HOW WE WORK ============ */}
      <section className="how" id="how" data-screen-label="04 How we work">
        <div className="how__inner">
          <header className="how__head">
            <h2 className="section-h2" style={{ color: "var(--color-ivory)" }}>
              <EditableText id="how.h2">How we work</EditableText>
            </h2>
          </header>
          <p className="how__intro">
            <EditableText id="how.intro">{`We're an AI-native agency. Strategy is a human call. The execution layer — research, drafts, repeat work — runs on AI. That split shapes the three principles below.`}</EditableText>
          </p>

          <div className="how__principles">
            <div className="principle">
              <h3 className="principle__headline">
                <EditableText id="principle.embed.headline">{`We embed GTM engineers, not consultants`}</EditableText>
              </h3>
              <p className="principle__body">
                <EditableText id="principle.embed.body">{`One of us is in your team full-time — in the room, in the standup, shipping alongside. We treat GTM as infrastructure, not a deck: versioned, tested, propagated across surfaces in code. A strategy that arrives as a deck drifts in a quarter; one built from inside the daily work doesn't.`}</EditableText>
              </p>
            </div>
            <div className="principle">
              <h3 className="principle__headline">
                <EditableText id="principle.navigation.headline">We build navigation, not strategy documents</EditableText>
              </h3>
              <p className="principle__body">
                <EditableText id="principle.navigation.body">{`Every plan we leave you with behaves like a map: each result redraws the whole chart, not just the current heading. When reality diverges, the team updates the map — no re-plan from scratch. The Cascade Navigation System is the runtime.`}</EditableText>
              </p>
            </div>
            <div className="principle">
              <h3 className="principle__headline">
                <EditableText id="principle.system.headline">When we leave, the system keeps running</EditableText>
              </h3>
              <p className="principle__body">
                <EditableText id="principle.system.body">{`The last thing we build is the thing that runs without us. AI-native workflows and the navigation live in your team's week — not in our shared Notion. Transfer is the deliverable, not an afterthought.`}</EditableText>
              </p>
            </div>
          </div>

          <div className="how__phases">
            <div className="phase">
              <div className="phase__num">Phase 01</div>
              <h4 className="phase__name">
                <EditableText id="phase.01.name">Map</EditableText>
              </h4>
              <p className="phase__body">
                <EditableText id="phase.01.body">{`We embed, learn your production cycle, name the breakpoints, build the hypothesis graph.`}</EditableText>
              </p>
            </div>
            <div className="phase">
              <div className="phase__num">Phase 02</div>
              <h4 className="phase__name">
                <EditableText id="phase.02.name">Build</EditableText>
              </h4>
              <p className="phase__body">
                <EditableText id="phase.02.body">{`Together we design the new processes, the navigation system, the AI-native infrastructure. Weekly cycles. Stage-gates. Confidence × Opportunity scoring.`}</EditableText>
              </p>
            </div>
            <div className="phase">
              <div className="phase__num">Phase 03</div>
              <h4 className="phase__name">
                <EditableText id="phase.03.name">Transfer</EditableText>
              </h4>
              <p className="phase__body">
                <EditableText id="phase.03.body">{`The system starts running without us. We tune, we document, we hand over. When we step back, the team doesn't miss a beat.`}</EditableText>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SCREEN 6 — TEAM ============ */}
      <section className="team" id="team" data-screen-label="05 Team">
        <header className="team__head">
          <h2 className="section-h2">
            <EditableText id="team.h2">{`We've done this before. At companies you've heard of`}</EditableText>
          </h2>
          <div className="team__intro">
            <p>
              <EditableText id="team.intro.p1">{`Built by people who've shipped brands and products at Miro, Sidekick Browser, Meta, McKinsey, R/GA, Metalab, Stink Studios, Your Majesty, ONY, and Action. When you work with us, the people on this page are the ones running your project — not their junior account leads.`}</EditableText>
            </p>
            <p>
              <EditableText id="team.intro.p2">{`We stay small on purpose. An AI-native stack lets us take on the volume that used to need thirty people. Client economics on one side, quality guarantee on the other.`}</EditableText>
            </p>
          </div>
        </header>

        <div className="team__grid">
          <article className="member">
            <div
              className="member__photo"
              role="img"
              aria-label="Yegor Korobeynikov portrait"
              style={{ backgroundImage: "url('/images/Yegor Korobeynikov.webp')" }}
            ></div>
            <h3 className="member__name">
              <EditableText id="member.yegor.name">Yegor Korobeynikov</EditableText>
            </h3>
            <div className="member__role">
              <EditableText id="member.yegor.role">Founder & CEO</EditableText>
            </div>
            <p className="member__bio">
              <EditableText id="member.yegor.bio">{`Brand, GTM, marketing, product. Led the RealtimeBoard → Miro rebrand and in-house brand studio. Was in charge of marketing at Sidekick Browser (acquired by Perplexity, now Comet). Co-founded Superabundance, a venture studio for AI startups.`}</EditableText>
            </p>
          </article>

          <article className="member">
            <div
              className="member__photo"
              role="img"
              aria-label="Anna Barinova portrait"
              style={{ backgroundImage: "url('/images/Anna Barinova.webp')" }}
            ></div>
            <h3 className="member__name">
              <EditableText id="member.anna.name">Anna Barinova</EditableText>
            </h3>
            <div className="member__role">
              <EditableText id="member.anna.role">Product Lead</EditableText>
            </div>
            <p className="member__bio">
              <EditableText id="member.anna.bio">{`Leads product. Shipped 50+ products from zero, built cross-functional processes in teams of 35+, and architected design systems scaled across products with up to 14M MAU.`}</EditableText>
            </p>
          </article>
        </div>
      </section>

      {/* ============ SCREEN 8 — FINAL CTA ============ */}
      <section className="final" id="contact" data-screen-label="06 Final CTA">
        <div className="final__inner">
          <h2 className="final__h2">
            <EditableText id="final.h2">{`What's something that prevents you from moving the needle?`}</EditableText>
          </h2>
          <p className="final__copy">
            <EditableText id="final.copy">{`You show us the problem. We tell you where we'd start, and whether we're the right fit. If not, we'll point you at someone who is.`}</EditableText>
          </p>
          <a className="final__cta" href="https://cal.com/krbnkv/30min">
            <EditableText id="final.cta">Book a call</EditableText>
            <span aria-hidden="true" style={{ marginLeft: "8px" }}>
              →
            </span>
          </a>
          <a className="final__email" href="mailto:yegor@backspaceoddity.com">
            <EditableText id="final.email">yegor@backspaceoddity.com</EditableText>
          </a>
        </div>
      </section>

      {/* ============ SCREEN 7 — INSIGHTS STRIP ============ */}
      <aside className="insights" data-screen-label="07 Insights">
        <p className="insights__text">
          <EditableText id="insights.text">We write about strategy systems on Substack. Launching soon.</EditableText>
        </p>
      </aside>

      {/* ============ FOOTER ============ */}
      <footer className="footer" data-screen-label="08 Footer">
        <div>
          <div className="footer__logo">
            <img className="footer__logo-mark" src="/images/Logo Mark.svg" alt="" aria-hidden="true" />
            <span className="footer__logo-text">
              Backspace
              <br />
              Oddity
            </span>
          </div>
          <div className="footer__copy">
            <EditableText id="footer.copy">© Backspace Oddity 2026</EditableText>
          </div>
        </div>
        <div className="footer__nav">
          <span className="footer__col-label">
            <EditableText id="footer.col1.label">Site</EditableText>
          </span>
          <a href="#work">
            <EditableText id="footer.nav.work">Work</EditableText>
          </a>
          <a href="#how">
            <EditableText id="footer.nav.how">How we work</EditableText>
          </a>
          <a href="#contact">
            <EditableText id="footer.nav.contact">Contact</EditableText>
          </a>
        </div>
        <div className="footer__contact">
          <span className="footer__col-label">
            <EditableText id="footer.col2.label">Reach us</EditableText>
          </span>
          <a href="mailto:yegor@backspaceoddity.com">
            <EditableText id="footer.contact.email">yegor@backspaceoddity.com</EditableText>
          </a>
          <div>
            <EditableText id="footer.contact.city">Amsterdam</EditableText>
          </div>
        </div>
      </footer>
    </div>
  );
}
