# BSO Website V2 — Design prompts for Claude Design

**Purpose.** Per-screen prompts that Claude Design consumes to generate HTML/CSS layouts for the rebuilt backspaceoddity.com.

**Inputs.**
- Locked copy: Notion skeleton page `34a402511cda81bcaf55fcc83eadd4d0` (screens 1–4 locked; 5–8 + Footer locked with open-items flagged).
- Existing design system: `PROJECT-CONTEXT.md` (colors, typography tokens, layout metrics). Stay within the token set unless the prompt explicitly opens a choice.
- Existing source: `src/index.html` + `src/css/*.css`. Any new section is a `<section>` inside the same `.page` wrapper, with all overrides in the in-file `<style>` block (CSS override pattern per project CLAUDE.md).
- Brand identity file: Figma `[Share] Backspace Oddity` fileKey `LSlHR0QK0d5tNiyYt957dS`, page "Week 06. Concept 03.1".

**Global constraints.**
- Page max-width 1440px, side padding 20px outer / 80px content.
- Fonts: SouvenirGothic (headings) + EB Garamond (body). Sizes in PROJECT-CONTEXT.md.
- Color palette: cream `#F5F2E9` (light sections), ivory `#FDFBF4` (text on dark), dark-green `#011C00` (primary text), black `#000000` (dark sections).
- Radii: 22px (section containers), 12px (cards).
- Mobile-first: every screen collapses to single column ≤ 768px.
- No framework. Static HTML + CSS, same as current live site.
- Keep `<style>` block in `src/index.html` as the only CSS authoring surface (don't create new CSS files for V2).

**Reference patterns (from site audit).**
- Sequoia AI-native (Harvey, Sierra, Decagon, 11x, Sana): short brand-statement hero, product-screenshot explainers, metrics with client logos.
- IDEO: thought-leadership strip near top, FAQ as methodology exposition.
- Superside: comparison matrix for competition re-frame.
- Pentagram / Instrument / Metalab / Koto / Ueno: **not a reference** (BSO ≠ design studio).

**Anti-patterns to reject.**
- "Strategy / Design / Technology" capability buckets.
- Generic "Innovative approach" / "Trusted partner" slogans.
- 16-screen walls of copy. Target: 7 screens + footer.
- Client-diagnostic language ("Your team struggles with …").
- Anonymous logo strips without attached testimonial or metric.

---

## Screen 1 — Hero

**Role.** One thought in three seconds: what this agency is and whether to stay.

**Visitor question.** "Is this the right kind of agency for me?"

**Content (verbatim, locked 2026-04-22).**

- H1: *GTM strategy is not a set of tactics across channels.*
- Sub: *It's what channels execute — who your audience is, the job they need done, the context they're buying in, who you compete with there, and why you fit best.*
- Primary CTA button: `Book a call` → `https://cal.com/krbnkv/30min`

**Composition.**

- Full-bleed dark section. Height ≥ 85vh (hero dominates fold).
- Content centered horizontally, vertically positioned at ~55% down.
- Single column, no side copy.
- Primary CTA sits ~80px below sub.

**Typography.**

- H1: SouvenirGothic Bold, size 160px desktop / 96px tablet / 64px mobile, line-height 88%, letter-spacing -0.02em. Color: ivory.
- Sub: EB Garamond Regular, 26–30px desktop / 22px mobile, line-height 112%, letter-spacing -0.02em. Color: ivory 80% opacity.
- CTA: EB Garamond Medium, 18px, letter-spacing 0.02em. Underline-on-hover, no button-shape (minimalist pattern per Harvey).

**Color / mood.**

- Background: dark green `#011C00` or black — dealer's choice, designer picks based on backdrop image warmth.
- Backdrop image: retrofuturistic 70s sci-fi (yellow-green / teal palette, painterly — Chris Foss / Syd Mead reference, NOT synthwave). Uses existing `hero_alt.webp` or commissioned replacement. Blend mode: multiply or soft-light to keep text legible. `mix-blend-mode: normal` on `.hero__title` (fixes text turning color).

**Visual elements.**

- Backdrop image behind text, ~40% opacity gradient overlay for legibility.
- No decorative illustrations, no diagrams on hero.
- Logo top-left (wordmark), email top-right: this lives in `<nav>`, not hero.

**Interaction.**

- CTA hover: underline fade-in + tiny scale (1.02).
- Optional: slight parallax on backdrop image on scroll (2-3px offset).

**Mobile.**

- H1 size 64px. Sub stays 22px. CTA full-width or auto-width centered.
- Backdrop image: either cover or a solid color replacement on very narrow screens where backdrop becomes distracting.

**Reference.**

- Tone: Harvey (aspirational brand-statement) meets Metalab (single declarative thesis).
- Structure: single-column centered, minimal chrome.

**Must not.**

- Long sub-line (>2 sentences).
- Multiple CTAs.
- Stock "abstract" tech illustrations.
- Animated word-pairs / rotating text carousels (Flash-era feel).

---

## Screen 2 — Selected work

**Role.** Show the strongest proof immediately after the thesis.

**Visitor question.** "Who trusts these people? Anyone like me?"

**Content (verbatim, locked 2026-04-23).**

- H2: *Companies we've worked with.*
- Six cards, order fixed: Miro · Sidekick Browser · Stape · AI-native Film Production Company · Global Payroll Platform · Superabundance. Full bodies per Notion skeleton Screen 2 block.

**Composition.**

- Light section (cream background).
- Grid: 3×2 desktop, with one featured "wide" card in top-left (Miro) — 60/40 split in Row 1, 50/50 in Rows 2 and 3.
- Or alternative: flat 3×2 equal. Designer picks based on image quality.
- Each card: image (card background) + client name overlaid on image (bottom-left).
- Hover state: dark overlay fades in + description text appears.
- Click: opens case study page or external link (case pages deferred; external link for in-house cases like Miro → miro.com, for PiaT → no link until consent, for Stape → their site).

**Typography.**

- Card title (client name): SouvenirGothic Bold, 30px, line-height 83%, letter-spacing -0.03em. Color: ivory on dark overlay.
- Card description (hover): EB Garamond Regular, 20px, line-height 112%. Color: ivory.
- "Our role" line: EB Garamond Italic, 16px, reduced opacity (70%).
- Section H2 above grid: SouvenirGothic Bold, 80px, line-height 88%, letter-spacing -0.03em. Color: dark-green.

**Color / mood.**

- Cards: image backgrounds (existing `project-miro.webp`, `project-sidekick.webp`, etc — new image needed for Stape; placeholder for PiaT backdrop-01 style).
- Hover overlay: dark-green `#011C00` at 90% opacity, fade-in 200ms.
- Section background: cream.

**Visual elements.**

- 6 project photos / mockups. Existing assets in `src/assets/images/project-*.webp`. Stape needs new image (commission or placeholder).
- Card border-radius: 12px.
- Card gap: 20px.

**Interaction.**

- Default state: image + client name, no description visible.
- Hover: overlay fades in, description + "Our role" line appear.
- Click → case study page (deep page deferred; V1 external-link fallback for Miro / Sidekick / Stape).

**Mobile.**

- Grid collapses to single column.
- Hover state becomes "always visible" (since touch devices can't hover) — description shows on tap-to-expand, or always shown beneath image.

**Reference.**

- Layout: Decagon's client-stories grid (logo + outcome metric), adapted.
- Hover pattern: Metalab / current BSO live site.

**Must not.**

- Include Wayfund in V1 (deferred to `/work` deep page — too similar angle to Stape/Superabundance).
- Include iki.ai (removed from current live, don't re-add).
- Show "Coming soon" placeholder cards (Film Production now has real content).
- Add "See all work" button unless there's a real `/work` page to route to.

---

## Screen 3 — Jobs we close

**Role.** Show the JTBDs we serve so visitors self-select by task, not by company size.

**Visitor question.** "Is my job one of theirs?"

**Content (verbatim, locked 2026-04-23).**

- H2: *The jobs we close.*
- Intro: *Five. Pick the one that matches where you are.*
- Five job-cards per Notion skeleton Screen 3. Each: **Job statement (bold + context trigger)** → *What you get* → *Worked on this job with* → *Instead of*.

**Composition.**

- Light section. Cream background.
- Vertical stack of 5 job-blocks, each full-width (no grid). Blocks separated by hairline divider (dark-green 1px, low opacity) or whitespace (80px between).
- Each block: 4 lines visually — bold job headline, "What you get" line, "Worked on this job with" line (with case-name chips linking to Screen 2 cards), "Instead of" line (with bullet separator `·`).
- No images per job — type-driven layout.

**Typography.**

- Job headline: SouvenirGothic Bold, 40–48px, line-height 95%, letter-spacing -0.02em. Color: dark-green.
- Body lines (What you get / Worked on / Instead of): EB Garamond, 20px (Medium for labels "What you get:" etc; Regular for content). Line-height 112%. Color: dark-green.
- Bullet separator `·`: ivory-against-dark-green dot or unicode middle-dot.
- Case-name chips (Miro / Stape / etc): underlined on hover, link to Screen 2 card or case page.

**Color / mood.**

- Section: cream.
- Text: dark-green.
- Accent on labels ("What you get:") — slightly muted dark-green (70% opacity) or italic.

**Visual elements.**

- Optional: tiny icons next to each job headline. Designer's call — can omit for text-first minimalism (IDEO pattern).
- No photos.

**Interaction.**

- Case-name chips → anchor to Screen 2 case card.
- Job headline hover: no change (not clickable).

**Mobile.**

- Same vertical stack. Font sizes scale down: headline 32px, body 18px.
- Bullet-separated lists become comma-separated (tighter).

**Reference.**

- IDEO FAQ structure (long-form, text-driven, each block earns its space).
- Superside comparison matrix principle (competition re-frame in each card's "Instead of").

**Must not.**

- Use "Strategy / Design / Technology" capability columns.
- Turn each job into a generic "problem → solution" formula.
- Add a big table/matrix cross-referencing jobs × alternatives (per-card "Instead of" already does this work; matrix would be redundant).
- Include job icons if they look like generic stock icons (better: omit than look generic).

---

## Screen 4 — How we work

**Role.** Methodology. What's different about working with BSO.

**Visitor question.** "How do they actually work?"

**Content (verbatim, locked 2026-04-23).**

- H2: *How we work.*
- Three principles (bold + body paragraph each).
- Three phases (short descriptors) below principles.

**Composition.**

- Dark section (dark-green or black background).
- Section split into two vertical subsections:
  - Top: "Three principles" — 3 blocks side-by-side on desktop (3-column), stacked on mobile. Each block: bold principle headline + 2–3 sentence paragraph.
  - Bottom: "Three phases" — 3 blocks side-by-side (3-column). Each: phase name (bold) + one sentence.
- Divider line (1px ivory, 30% opacity) between principles and phases.

**Typography.**

- Section H2: SouvenirGothic Bold, 80px. Color: ivory.
- Principle headline: SouvenirGothic Medium, 30px, line-height 100%. Color: ivory.
- Principle body: EB Garamond Regular, 20px, line-height 120%. Color: ivory 85% opacity.
- Phase name: SouvenirGothic Bold, 24px. Color: ivory.
- Phase body: EB Garamond Regular, 18px. Color: ivory 80% opacity.

**Color / mood.**

- Background: dark-green or black. Similar to Hero for unity.
- Backdrop image (optional): abstract / diagrammatic visual showing navigation-chart-like shapes. Can use `backdrop-02.webp` as texture at 15% opacity, or omit entirely for cleaner type-focused composition.

**Visual elements.**

- Optional: 1 diagram illustrating "cascade" or "navigation map" concept. Lives between principles and phases or as backdrop behind principles. Claude Design to propose — but keep it subtle (not a full infographic).
- No stock icons.

**Interaction.**

- No hover effects on principles or phases — static content section.
- Optional: subtle fade-in on scroll for each principle block (100ms stagger).

**Mobile.**

- Principles and phases each collapse to single column.
- H2 60px, principles 24px, phases 20px.

**Reference.**

- IDEO's "methodology" exposition (short, principled, text-first).
- Sierra's product-section layout (two rows of 3, with clear hierarchy).

**Must not.**

- Write out phases as a linear "1 → 2 → 3" with arrows (reads as consulting-deck).
- Use icons on each principle unless they're custom-designed to match BSO identity.
- Merge principles and phases into one long list — keep them as two distinct blocks.

---

## Screen 5 — Proof — skipped for V1

**Role (when eventually included).** Social proof: client logos, numbers, testimonials.

**Why skipped.** BSO early-in-category. Social-proof patterns (logo strip, metrics grid, attribution testimonials) don't land honestly yet: not enough logos for a strip, clients' metrics not generally releasable, not enough attribution testimonials.

**Compensating for V1.** Screen 2 cards carry proof via outcome-language ("$17.5B valuation", "acquired by Perplexity"). Screen 6 team block carries pedigree proof.

**Trigger to un-skip.** 10+ client logos OR 3+ attribution testimonials with consent. Revisit Q3 2026.

**Design prompt (when re-enabled):** TBD. Draft pattern: logo strip + 2–3 testimonial cards with photo/name/title/quote/company.

---

## Screen 6 — Team

**Role.** Answer "who'll be on my project?" without HR language.

**Visitor question.** "Who would I actually get?"

**Content (verbatim, locked 2026-04-23).**

- H2: *We've done this before. At companies you've heard of.*
- Intro paragraph (2 short paragraphs — pedigree + "we stay small on purpose").
- Team member grid (5–6 members, per Notion skeleton Screen 6 block). Each: photo, name, role, 1–2 sentence bio, optional LinkedIn.

**Composition.**

- Light section (cream background).
- Section H2 top, intro paragraph centered under (max 720px).
- Team grid: 3-column desktop (2 rows × 3 people), 2-column tablet, 1-column mobile.
- Each member card: square portrait photo (top), name + role below photo, bio underneath, optional LinkedIn icon.

**Typography.**

- Section H2: SouvenirGothic Bold, 80px. Color: dark-green.
- Intro: EB Garamond Regular, 22px, line-height 120%, two paragraphs. Color: dark-green.
- Member name: SouvenirGothic Bold, 24px. Color: dark-green.
- Member role: SouvenirGothic Medium, 16px, uppercase, letter-spacing 0.04em. Color: dark-green 60% opacity.
- Member bio: EB Garamond Regular, 16px, line-height 130%. Color: dark-green 85% opacity.

**Color / mood.**

- Section: cream.
- Portraits: square crop, consistent treatment (b&w or warm-color-graded — pick one and stick).

**Visual elements.**

- 5–6 portrait photos, square, edge-to-edge.
- No placeholders for missing photos (Ivan / Artem / Siraj currently photo-pending per project STATE.md). If photo missing → stylized monogram (initials) on a dark-green background, 12px radius. Same weight and treatment as photos.
- LinkedIn icon bottom-right of each member card (optional, small, ivory outline on dark bg).

**Interaction.**

- Member card hover: subtle elevation (shadow 0 4px 12px rgba(0,0,0,0.08)).
- LinkedIn icon → external link, new tab.

**Mobile.**

- Grid collapses to single column. Photos: same square ratio. Bio spans full width.

**Reference.**

- Work & Co team section layout (clean, photo-forward, no frills).
- IDEO people page (trust-through-specific-pedigree).

**Must not.**

- Add org-chart / hierarchy diagrams.
- Include "Values" / "Why we love what we do" / inspirational copy.
- Use stock photos. Use real portraits or stylized monograms.
- Make the team section longer than intro + grid.

**Open items (for Yegor to resolve before Claude Design consumes this):**

- Anna vs Alena: confirm if two people or one. If two, include both in grid.
- Photos: decide if we gate Screen 6 on photos arriving, or ship with monograms.
- LinkedIn: provide links or omit.

---

## Screen 7 — Insights / Writing — deferred for V1

**Role (when eventually included).** Thought-leadership signal + newsletter acquisition.

**Why deferred.** Content Marketing pipeline not live yet (BRIEF v1 locked, infra Phase 1 in progress, writer-agents not configured). Empty/stale Insights section reads worse than no section. BRIEF §10 non-goal: no engagement-farming or fake-frequency posts.

**Trigger to include.** 3+ Substack posts with regular cadence (2 LinkedIn posts/week). Target: end of Q2 2026.

**V1 minimal alternative (optional, if wanting any writing signal).** Single-line footer teaser: `We write about strategy systems on Substack. [Subscribe →]`. No section needed.

**Design prompt (when re-enabled):** Above-fold strip on a content-light section with 3 featured essays (thumbnail + title + date + excerpt) plus newsletter signup. IDEO / Harvey resource-hub pattern.

---

## Screen 8 — Final CTA

**Role.** Last-chance conversion before visitor leaves.

**Visitor question.** "How do I start a conversation? What will happen?"

**Content (verbatim, locked 2026-04-23).**

- H2: *The first call takes 30 minutes. No deck.*
- Copy: *You show us the problem. We tell you where we'd start, and whether we're the right fit. If not, we'll point you at someone who is.*
- Primary button: `Book a call` → `https://cal.com/krbnkv/30min`
- Secondary (inline): `yegor@backspaceoddity.com`

**Composition.**

- Dark section — mirrors Hero to close the visual loop.
- Full-bleed, centered. Max-width 800px for text.
- H2 top, copy below, CTA button 40px below copy, email link below button (smaller, muted).

**Typography.**

- H2: SouvenirGothic Bold, 72–96px desktop / 56px mobile. Line-height 90%. Color: ivory.
- Copy: EB Garamond Regular, 24px. Line-height 120%. Color: ivory 90%.
- Button: same style as Hero CTA — underline-on-hover, no button-shape. Size 18px, medium weight.
- Email link: EB Garamond Regular, 16px. Color: ivory 60%. Hover: ivory 100%.

**Color / mood.**

- Background: dark-green or black (match Hero choice for unity).
- Optional backdrop image: none, or very subtle gradient (not the same backdrop image as Hero — different visual cue so this section reads as "closing" not "opening").

**Visual elements.**

- None beyond text + buttons.

**Interaction.**

- CTA button: underline fade-in on hover.
- Email: underline on hover.

**Mobile.**

- H2 56px. Copy 20px. Button and email stack vertically.

**Reference.**

- Instrument's single-CTA closing screen.
- Harvey's "Unlock Professional Class AI" closing (aspirational short line + single button).

**Must not.**

- Add a form inline (contact forms have higher friction than Cal.com — stick with calendar link).
- Include multiple action options ("Book a call · Send brief · Download deck · Schedule demo").
- Use generic "Let's connect" / "Get in touch" language.

**Open items.**

- "Point you at someone who is" — keep or drop? Signal filter but also could read as over-promise.
- Visual: confirm dark section mirrors Hero, or light closing section for contrast.

---

## Footer

**Role.** Standard footer: logo, contacts, navigation, legal.

**Content (verbatim, locked 2026-04-23).**

- Logo (BSO wordmark, dark or ivory depending on footer bg).
- Copyright: `© Backspace Oddity 2026`.
- Nav: Work (anchor to Screen 2), How we work (anchor to Screen 4), Contact (anchor to Screen 8 / Cal.com).
- Contact: `yegor@backspaceoddity.com`.
- Location: `Amsterdam` (city only, not full address).
- Social: LinkedIn (BSO company page), Substack (when live).
- Legal: `Privacy` link (deferred; add when needed).

**Composition.**

- Full-width, light section below Screen 8's dark section (or flip if Screen 8 is light).
- Three or four columns on desktop, stacked on mobile.
  - Col 1: logo + copyright.
  - Col 2: nav links.
  - Col 3: contact + location.
  - Col 4 (optional): social.

**Typography.**

- All text: EB Garamond Regular, 16px. Line-height 130%. Color: dark-green (on cream) or ivory 70% (on dark).
- Nav links: same, hover underline.

**Color / mood.**

- Background: cream (if Screen 8 was dark — creates contrast).
- Subtle top border (1px dark-green 10%) to separate from Screen 8.

**Visual elements.**

- Wordmark SVG (exists at `src/assets/images/Logo Workmark Black.svg`).
- No backdrop image.

**Interaction.**

- Nav links: smooth scroll to anchor.
- Email: mailto link.
- Social: external, new tab.

**Mobile.**

- Stacked columns. 60px vertical padding. Social row full-width at bottom.

**Must not.**

- Add a newsletter-signup form (until Insights screen activates and newsletter is actually mailing).
- Add office address at building level (privacy; city-only is enough).
- Pad with "handcrafted with love in Amsterdam" sentiments.

---

## Cross-screen notes for implementation

**Visual unity.**

- Hero and Final CTA both dark → bookend composition. Screens 2 (Work), 3 (Jobs), 6 (Team) all light → middle sequence is a single "reading surface". Screen 4 (How we work) dark → breaks up middle, creates rhythm: dark → light → light → dark → light → dark → footer-light.
- If this rhythm feels too strict, alternative: Screen 4 as cream with dark card nested inside (design call).

**Typographic hierarchy.**

- Three heading sizes max across the page: hero (160px), section (80px), sub-section/card (30px). Anything in between breaks the scale.
- Body stays at one size per section (20–24px depending on light/dark).

**Scroll narrative.**

- Reader scrolls Hero → Work → Jobs → How → Team → Final CTA.
- Each screen answers the visitor's next question: *is this the right agency? / who trusts them? / does my job match? / how do they work? / who'll I get? / how do I start?*
- No "About" standalone section — absorbed into Team.

**Image assets to commission or generate.**

- Hero backdrop: final retrofuturistic 70s sci-fi image (existing `hero_alt.webp` may suffice; Chris Foss / Syd Mead prompt reference).
- Stape case card image (not currently in `src/assets/images/`).
- Team photos: Ivan, Artem, Siraj pending (monograms as fallback).
- Optional: diagram/visual for Screen 4 cascade-navigation concept.

**What Claude Design should output.**

- Updated `src/index.html` with new section structure (Hero / Work / Jobs / How / Team / Final CTA / Footer).
- All CSS in the in-file `<style>` block (project convention — don't create new .css files).
- Preserves `src/css/variables.css` tokens (use existing custom properties rather than hardcoding).
- Mobile-first media queries inline (single breakpoint at 768px, secondary at 1024px).
- Smooth-scroll anchors for nav.
- Accessibility: semantic HTML (`<section>`, `<article>`, `<nav>`), alt text on images, proper heading hierarchy, color contrast ratios ≥ 4.5:1 on body text.

**Out of scope for Claude Design.**

- Image generation (hero backdrop, Stape photo, monograms).
- Case-study deep pages — link targets can be `#` for now.
- Newsletter integration / form handling.
- Analytics setup.
