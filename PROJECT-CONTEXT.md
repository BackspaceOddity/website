# Backspace Oddity — Website

## Company
- **Name**: Backspace Oddity
- **Office**: Vijzelstraat 68-78, 1017 ES Amsterdam
- **Email**: start@backspaceoddity.com
- **Tagline**: "We help companies uncover hidden growth levers"

## Design System (from Figma)

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cream` | `#F5F2E9` | Page background |
| `--color-ivory` | `#FDFBF4` | Light text on dark backgrounds |
| `--color-dark-green` | `#011C00` | Primary text, card backgrounds |
| `--color-black` | `#000000` | Dark section backgrounds |

### Typography
| Role | Font | Weight | Size | Line-height | Letter-spacing |
|------|------|--------|------|-------------|----------------|
| Hero heading | SouvenirGothic | 700 (Bold) | 160px | 88% | -0.02em |
| Section heading | SouvenirGothic | 700 | 80px | 80-96% | -0.03em |
| Card title | SouvenirGothic | 700 | 30px | 83% | -0.03em |
| Body large | EB Garamond | 400 | 30px | 112% | -0.02em |
| Body medium | EB Garamond | 400 | 24px | 112% | -0.02em |
| Body small | EB Garamond | 400 | 20px | 112% | -0.02em |

### Layout
- Page max-width: 1440px
- Content widths: 1280px / 1400px
- Side padding: 20px (outer), 80px (content)
- Border radius: 22px (sections), 12px (cards)
- Card gap: 20px
- Text column gap: 80px

### Fonts Available
- SouvenirGothic Regular (.otf)
- SouvenirGothic Medium (.otf)
- SouvenirGothic DemiBold Italic (.otf)
- SouvenirGothic Italic (.otf)
- EB Garamond — loaded from Google Fonts

### Backdrop Images
Used as visual textures inside hero, cards, and dark sections:
- `backdrop-01.png` — hero section
- `backdrop-02.png` — manifesto and card backgrounds
- `backdrop-03.png` through `backdrop-06.png` — portfolio cards

## Page Structure (Homepage)

1. **Navigation** — Logo (left), contact + office info (right)
2. **Hero** — Full-width dark card, backdrop image, large heading, subtitle
3. **Below hero** — Two-column body text (cream bg)
4. **Mission statement** — Large SouvenirGothic heading, capitalize
5. **Description** — Two-column body text
6. **Portfolio Row 1** — 1 large card + 3 smaller cards (masonry-like)
7. **Portfolio Row 2** — 5 columns (3 visible, 2 hidden/opacity:0)
8. **Manifesto** — Dark section, bold heading + two-column body text

## Portfolio Cases
_3-row grid (2+3+2 layout → reordered to 2+2+3). Section heading: "Our most recent experience". Titles overlaid on images, hover shows description on dark overlay._

**Row 1 (60/40):**
1. **Rebrand: from RealtimeBoard to Miro** — `project-miro.png`
2. **Sidekick Browser** — `project-sidekick.png` (card--top)

**Row 2 (2 equal):**
3. **Global Payroll Platform** — `project-global-payroll.png` (card--top)
4. **Film Production Company** — `backdrop-01.webp` (placeholder, "Coming soon")

**Row 3 (3 equal):**
5. **Wayfund** — `project-wayfund.png` (card--top)
6. **iki.ai** — `project-iki.png` (card--top)
7. **Superabundance** — `project-superabundance.png`

## Tech Stack
- Static HTML/CSS/JS
- No framework (simple landing page)
- Google Fonts for EB Garamond
- Local OTF for SouvenirGothic
