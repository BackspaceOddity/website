# Changelog

## 2026-04-08 — Major copy rewrite + portfolio restructure + deployment setup

**What happened:**
- Replaced manifesto section heading and copy entirely: "Most agencies leave after the strategy" → "Not just decision-making. But decision making, too." with new body copy about brand as OS
- Rewrote business case heading: "How brand work shows up in numbers" → "How investing in brand shows up in numbers"
- Replaced brand diagram heading: "But what is brand?" → "Why invest in brand when the product sells itself?"
- Updated reframe copy: added "even your business model or GTM strategy" to the list of brand-affecting decisions
- Added portfolio section heading: "Our most recent experience"
- Reordered portfolio rows: 2-col-eq (Global Payroll + Film Production) moved to Row 2, 3-col (Wayfund + iki.ai + Superabundance) to Row 3
- Updated Sidekick Browser description: added acquisition by Perplexity, relaunch as Comet
- Updated team copy: added McKinsey, R/GA, Metalab, Stink Studios, Your Majesty, Meta to company list
- Increased hero desc font size: 20px → 26px
- Fixed metrics grid alignment: switched from flex to CSS Grid subgrid so all body texts align
- Added 120px margin-top before portfolio section
- Explored AI image generation for hero backdrop (retrofuturistic 70s sci-fi, yellow-green palette) — unresolved
- Created GitHub repo BackspaceOddity/website, initialized git locally, deployment pending PAT
- Created Slack workspace icon (512×512, white padding around Logo Mark SVG)
- Kept WEBSITE-CONTENT.md and PROJECT-CONTEXT.md in sync throughout

**Decisions made:**
- Manifesto concept: brand as decision-making OS, not just process claim
- "decision-making / decision making" wordplay (hyphen removal = shift from noun to active force)
- "but also" rejected → "But decision making, too." approved
- Retrofuturistic 70s sci-fi aesthetic for hero image (inspired by Tangerine Dream, Chris Foss, user's Pinterest moodboard)
- Two backdrop images planned: hero (cool/teal or yellow-green) + manifesto (warm orange) — differentiated by color temperature
- ChatGPT keeps generating synthwave CG, not 70s painterly — try Chris Foss prompt or accept current gradient

**Errors encountered:**
- Edit tool "File has not been read yet" — must always Read before Edit
- npm install -g vercel failed (permissions) — used --prefix workaround
- Vercel CLI login required interactive auth — blocked in VM

**Result:**
- Website copy substantially updated and approved
- Portfolio visually restructured
- Deployment infrastructure ready, awaiting GitHub PAT

---

## 2026-03-17 — Portfolio redesign + real project photos

**What happened:**
- Redesigned portfolio from original flex layout to 2+3 grid (Superside-style titles on images)
- Added hover overlay (dark background + description text)
- Replaced gradient placeholders with real project photos
- Added two new cards: Global Payroll Platform + Film Production Company
- Fixed hero title turning blue (mix-blend-mode: normal override)
- Tightened horizontal margins (--px: 40px system, --side-padding: 0px)
- Added whitespace between sections (manifesto margin, bizcase header spacing)
- Fixed screenshot cropping (object-fit: contain + dark bg for card--top class)
- Fixed hover color: green → black overlay

**Decisions made:**
- object-fit: contain + #0d0d0d background for screenshot cards (card--top class)
- Gradient/grayscale mask attempts rejected — clean photos preferred
- 2+3+2 grid structure (later reordered to 2+2+3)

**Result:**
- Portfolio section fully rebuilt and approved

### 2026-04-20 — orphan session rolled up (PID no longer alive)

- Timeline file `2026-04-20-1930-89345-yegorkorobeynikov.md` had 2 user prompts, 16 tool calls, 0 errors. Full raw log has been deleted (retention policy).
