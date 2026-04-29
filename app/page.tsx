export default function HomePage() {
  return (
    <div className="page" data-screen-label="Homepage">
      {/* ============ NAV ============ */}
      <nav className="nav" aria-label="Primary">
        <a href="#top" className="nav__logo" aria-label="Backspace Oddity">
          <span>Backspace</span>
          <span>Oddity</span>
        </a>
        <div className="nav__right">
          <div className="nav__block">
            <span className="nav__block-label">Contact us:</span>
            <a href="mailto:yegor@backspaceoddity.com">yegor@backspaceoddity.com</a>
            <div>
              <a href="https://cal.com/krbnkv/30min">Book a call</a>
            </div>
          </div>
          <div className="nav__block">
            <span className="nav__block-label">Office:</span>
            <div>Vijzelstraat 68-78</div>
            <div>1017 ES Amsterdam</div>
          </div>
        </div>
      </nav>

      {/* ============ SCREEN 1 — HERO ============ */}
      <section className="hero" id="top" data-screen-label="01 Hero">
        <div className="hero__bg" aria-hidden="true"></div>
        <div className="hero__inner">
          <h1 className="hero__title">GTM strategy is not a set of tactics across channels.</h1>
          <p className="hero__sub">
            It&apos;s what channels execute — who your audience is, the job they need done, the
            context they&apos;re buying in, who you compete with there, and why you fit best.
          </p>
          <a className="hero__cta" href="https://cal.com/krbnkv/30min">
            Book a call
            <span className="hero__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </section>

      {/* ============ SCREEN 2 — SELECTED WORK ============ */}
      <section className="work" id="work" data-screen-label="02 Work">
        <header className="work__head">
          <h2 className="section-h2">Companies we&apos;ve worked with.</h2>
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
                  From RealtimeBoard to Miro: new name, identity, and brand architecture. Then an
                  in-house studio built to keep the brand running, not just documented — so any
                  internal request could close with the same predictability, without heroics. Path
                  to a $17.5B valuation followed.
                  <span className="card__role">Our role — full rebrand + in-house studio setup.</span>
                </p>
              </div>
              <h3 className="card__title">Miro (in-house)</h3>
            </a>
            <a className="card" href="#" data-case="sidekick">
              <img className="card__backdrop" src="/images/project-sidekick.webp" alt="" loading="lazy" />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  Product repositioning and category creation: the productivity browser as a
                  distinct class for power users. Acquired by Perplexity in 2025, relaunched as
                  Comet Browser.
                  <span className="card__role">Our role — product repositioning, category creation.</span>
                </p>
              </div>
              <h3 className="card__title">Sidekick Browser (in-house)</h3>
            </a>
          </div>

          <div className="work__row work__row--50-50">
            <a className="card" href="#" data-case="stape">
              <img className="card__backdrop" src="/images/project-stape.webp" alt="" loading="lazy" />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  A fintech for cross-border payments to remote teams. Full relaunch — new name,
                  brand platform, identity, positioning, site, tone of voice — done from inside the
                  team, not at a distance. Paired with AI workflows that keep positioning and ToV
                  alive in marketing, sales, and GTM at scale.
                  <span className="card__role">
                    Our role — brand platform + identity + positioning + site + ToV + agentic
                    production pipelines.
                  </span>
                </p>
              </div>
              <h3 className="card__title">Stape</h3>
            </a>
            <a className="card" href="#" data-case="film">
              <img className="card__backdrop" src="/images/project-film.webp" alt="" loading="lazy" />
              <div className="card__shade"></div>
              <div className="card__overlay">
                <p className="card__description">
                  Stage-gate architecture for content-IP investment decisions. Every experiment
                  doesn&apos;t just test one hypothesis — it updates the whole map. A working
                  framework for who decides, on what evidence, and what &ldquo;hypothesis
                  confirmed&rdquo; actually means in the content business.
                  <span className="card__role">
                    Our role — governance model + Cascade Navigation System (v5.1 origin).
                  </span>
                </p>
              </div>
              <h3 className="card__title">AI-native Film Production Company</h3>
            </a>
          </div>

          <div className="work__row work__row--40-60">
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
                  Cross-border employment is a category of compliance nightmares and lookalike
                  brands. A new name, positioning, and identity gave this platform a reason to be
                  chosen side-by-side. Agentic workflows behind the brand now run the parts that
                  don&apos;t need a human.
                  <span className="card__role">
                    Our role — brand strategy, renaming, positioning, identity, agentic workflows.
                  </span>
                </p>
              </div>
              <h3 className="card__title">Global Payroll Platform</h3>
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
                  A studio running multiple portfolio companies at once needed a shared methodology
                  for when to push, when to kill, and when to hand off. We built that methodology
                  plus agentic workflows around every stage-gate.
                  <span className="card__role">
                    Our role — market-product fit methodology + agentic workflows + brand identity +
                    positioning + website.
                  </span>
                </p>
              </div>
              <h3 className="card__title">Superabundance</h3>
            </a>
          </div>
        </div>
      </section>

      {/* ============ SCREEN 3 — JOBS WE CLOSE ============ */}
      <section className="jobs" id="jobs" data-screen-label="03 Jobs">
        <header className="jobs__head">
          <h2 className="section-h2">The jobs we close.</h2>
          <p className="jobs__intro">Five. Pick the one that matches where you are.</p>
        </header>

        <div className="jobs__list">
          <article className="job">
            <div className="job__num">01</div>
            <div className="job__body">
              <h3 className="job__headline">
                Move upmarket to enterprise buyers — when our brand still signals &ldquo;scrappy
                startup&rdquo; in every RFP, first call, and side-by-side review.
              </h3>
              <div className="job__row">
                <div className="job__label">What you get</div>
                <div className="job__value">
                  A repositioning that holds up when it matters most — in RFPs, first calls,
                  side-by-sides.
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Worked on this with</div>
                <div className="job__value">
                  <a className="job__chip" href="#work">Miro</a>
                  <span className="job__sep">·</span>
                  <a className="job__chip" href="#work">Stape</a>
                  <span className="job__sep">·</span>
                  <a className="job__chip" href="#work">Sidekick Browser</a>
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Instead of</div>
                <div className="job__value">
                  Brand boutiques<span className="job__sep">·</span>In-house brand team
                  <span className="job__sep">·</span>Logo-level refresh.
                </div>
              </div>
            </div>
          </article>

          <article className="job">
            <div className="job__num">02</div>
            <div className="job__body">
              <h3 className="job__headline">
                Win in a market where competitors have pretty much the same product — when every
                buyer asks &ldquo;what&apos;s the difference&rdquo; and we don&apos;t have a sharp
                answer.
              </h3>
              <div className="job__row">
                <div className="job__label">What you get</div>
                <div className="job__value">
                  Positioning the buyer can see in the moment they decide, not on a slide.
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Worked on this with</div>
                <div className="job__value">
                  <a className="job__chip" href="#work">Sidekick Browser</a>
                  <span className="job__sep">·</span>
                  <a className="job__chip" href="#work">Global Payroll Platform</a>
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Instead of</div>
                <div className="job__value">
                  Growth agencies<span className="job__sep">·</span>Adding another feature
                  <span className="job__sep">·</span>Out-spending the incumbent.
                </div>
              </div>
            </div>
          </article>

          <article className="job">
            <div className="job__num">03</div>
            <div className="job__body">
              <h3 className="job__headline">
                Operationalise strategy into a system that runs daily — when &ldquo;we already
                aligned on this&rdquo; keeps not translating into execution, and we&apos;re running
                the same re-alignment workshop every quarter.
              </h3>
              <div className="job__row">
                <div className="job__label">What you get</div>
                <div className="job__value">
                  A weekly Cascade Navigation System — one that lives outside the offsite.
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Worked on this with</div>
                <div className="job__value">
                  <a className="job__chip" href="#work">AI-native Film Production Company</a>
                  <span className="job__sep">·</span>
                  <a className="job__chip" href="#work">Superabundance</a>
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Instead of</div>
                <div className="job__value">
                  Quarterly offsites<span className="job__sep">·</span>Playbooks and templates
                  <span className="job__sep">·</span>Standing re-alignment meetings.
                </div>
              </div>
            </div>
          </article>

          <article className="job">
            <div className="job__num">04</div>
            <div className="job__body">
              <h3 className="job__headline">
                Treat the launch plan as hypotheses we test — so when reality diverges from the plan
                in week three, the team updates it instead of starting over from scratch.
              </h3>
              <div className="job__row">
                <div className="job__label">What you get</div>
                <div className="job__value">
                  A plan where week-3 evidence updates the plan, not the team.
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Worked on this with</div>
                <div className="job__value">
                  <a className="job__chip" href="#work">AI-native Film Production Company</a>
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Instead of</div>
                <div className="job__value">
                  Execute-as-written<span className="job__sep">·</span>Pre-flight validation
                  <span className="job__sep">·</span>Start-over re-plans.
                </div>
              </div>
            </div>
          </article>

          <article className="job">
            <div className="job__num">05</div>
            <div className="job__body">
              <h3 className="job__headline">
                Turn &ldquo;become AI-native&rdquo; from an ambition in the all-hands deck into
                workflows the team actually runs on a Monday morning.
              </h3>
              <div className="job__row">
                <div className="job__label">What you get</div>
                <div className="job__value">
                  Specific workflows that earn their place in your team&apos;s week.
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Worked on this with</div>
                <div className="job__value">
                  <a className="job__chip" href="#work">Stape</a>
                  <span className="job__sep">·</span>
                  <a className="job__chip" href="#work">Superabundance</a>
                  <span className="job__sep">·</span>
                  <a className="job__chip" href="#work">Global Payroll Platform</a>
                </div>
              </div>
              <div className="job__row">
                <div className="job__label">Instead of</div>
                <div className="job__value">
                  Notion templates<span className="job__sep">·</span>Enterprise KM software
                  <span className="job__sep">·</span>Change-management consultants.
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ============ SCREEN 4 — HOW WE WORK ============ */}
      <section className="how" id="how" data-screen-label="04 How we work">
        <div className="how__inner">
          <header className="how__head">
            <h2 className="section-h2" style={{ color: "var(--color-ivory)" }}>
              How we work.
            </h2>
          </header>
          <p className="how__intro">
            We&apos;re an AI-native agency. Strategy is a human call. The execution layer —
            research, drafts, repeat work — runs on AI. That split shapes the three principles below.
          </p>

          <span className="how__section-label">Three principles</span>
          <div className="how__principles">
            <div className="principle">
              <h3 className="principle__headline">We embed. We don&apos;t consult from the outside.</h3>
              <p className="principle__body">
                One of us is in your team full-time for the engagement. In the room, in the standup,
                shipping alongside. A strategy that arrives as a deck drifts in a quarter; one
                that&apos;s built from inside the daily work doesn&apos;t.
              </p>
            </div>
            <div className="principle">
              <h3 className="principle__headline">We build navigation, not strategy documents.</h3>
              <p className="principle__body">
                Every plan we leave you with behaves like a map: each result redraws the whole
                chart, not just the current heading. When reality diverges, the team updates the map
                — no re-plan from scratch. The Cascade Navigation System is the runtime.
              </p>
            </div>
            <div className="principle">
              <h3 className="principle__headline">When we leave, the system keeps running.</h3>
              <p className="principle__body">
                The last thing we build is the thing that runs without us. AI-native workflows and
                the navigation live in your team&apos;s week — not in our shared Notion. Transfer is
                the deliverable, not an afterthought.
              </p>
            </div>
          </div>

          <span className="how__section-label" style={{ marginTop: "72px" }}>
            Three phases, every engagement
          </span>
          <div className="how__phases">
            <div className="phase">
              <div className="phase__num">Phase 01</div>
              <h4 className="phase__name">Map</h4>
              <p className="phase__body">
                We embed, learn your production cycle, name the breakpoints, build the hypothesis
                graph.
              </p>
            </div>
            <div className="phase">
              <div className="phase__num">Phase 02</div>
              <h4 className="phase__name">Build</h4>
              <p className="phase__body">
                Together we design the new processes, the navigation system, the AI-native
                infrastructure. Weekly cycles. Stage-gates. Confidence × Opportunity scoring.
              </p>
            </div>
            <div className="phase">
              <div className="phase__num">Phase 03</div>
              <h4 className="phase__name">Transfer</h4>
              <p className="phase__body">
                The system starts running without us. We tune, we document, we hand over. When we
                step back, the team doesn&apos;t miss a beat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SCREEN 6 — TEAM ============ */}
      <section className="team" id="team" data-screen-label="05 Team">
        <header className="team__head">
          <h2 className="section-h2">We&apos;ve done this before. At companies you&apos;ve heard of.</h2>
          <div className="team__intro">
            <p>
              Built by people who&apos;ve shipped brands and products at Miro, Sidekick Browser,
              Meta, McKinsey, R/GA, Metalab, Stink Studios, Your Majesty, ONY, and Action. When you
              work with us, the people on this page are the ones running your project — not their
              junior account leads.
            </p>
            <p>
              We stay small on purpose. An AI-native stack lets us take on the volume that used to
              need thirty people. Client economics on one side, quality guarantee on the other.
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
            <h3 className="member__name">Yegor Korobeynikov</h3>
            <div className="member__role">Founder &amp; CEO</div>
            <p className="member__bio">
              Brand, GTM, marketing, product. Ran the RealtimeBoard → Miro rebrand and led
              Miro&apos;s in-house brand studio. Marketing lead at Sidekick Browser. Runs the
              Superabundance venture studio.
            </p>
          </article>

          <article className="member">
            <div
              className="member__photo"
              role="img"
              aria-label="Anna Barinova portrait"
              style={{ backgroundImage: "url('/images/Anna Barinova.webp')" }}
            ></div>
            <h3 className="member__name">Anna Barinova</h3>
            <div className="member__role">Head of Production</div>
            <p className="member__bio">
              Identity, brand systems, and product-surface work. Previously on brand and product
              teams at Miro and with AI-native startups across Europe and the US.
            </p>
          </article>
        </div>
      </section>

      {/* ============ SCREEN 8 — FINAL CTA ============ */}
      <section className="final" id="contact" data-screen-label="06 Final CTA">
        <div className="final__inner">
          <h2 className="final__h2">The first call takes 30 minutes. No deck.</h2>
          <p className="final__copy">
            You show us the problem. We tell you where we&apos;d start, and whether we&apos;re the
            right fit. If not, we&apos;ll point you at someone who is.
          </p>
          <a className="final__cta" href="https://cal.com/krbnkv/30min">
            Book a call
            <span aria-hidden="true" style={{ marginLeft: "8px" }}>
              →
            </span>
          </a>
          <a className="final__email" href="mailto:yegor@backspaceoddity.com">
            yegor@backspaceoddity.com
          </a>
        </div>
      </section>

      {/* ============ SCREEN 7 — INSIGHTS STRIP ============ */}
      <aside className="insights" data-screen-label="07 Insights">
        <p className="insights__text">
          We write about strategy systems on Substack. Launching soon.
        </p>
      </aside>

      {/* ============ FOOTER ============ */}
      <footer className="footer" data-screen-label="08 Footer">
        <div>
          <div className="footer__logo">
            Backspace
            <br />
            Oddity
          </div>
          <div className="footer__copy">© Backspace Oddity 2026</div>
        </div>
        <div className="footer__nav">
          <span className="footer__col-label">Site</span>
          <a href="#work">Work</a>
          <a href="#how">How we work</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer__contact">
          <span className="footer__col-label">Reach us</span>
          <a href="mailto:yegor@backspaceoddity.com">yegor@backspaceoddity.com</a>
          <div>Amsterdam</div>
        </div>
      </footer>
    </div>
  );
}
