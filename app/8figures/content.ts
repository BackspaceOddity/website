// 8FIGURES - Brand Sprint landing content.
// 1:1 MIRROR of the Notion v4 doc (384402511cda8120b821d4a0e39a8097).
// The user's edited Notion doc is the single source of truth - this file must match it
// section-for-section, text-for-text. Do not add copy that isn't in the doc.

export type SeePoint = { metric: string; name: string; text: string };
export type Project = { title: string; desc: string; href: string; img: string; alt: string };
export type Phase = {
  kicker: string;
  name: string;
  meta: string;
  summary: string;
  modules: string[];
  optional?: string;
};

export const content = {
  nav: {
    contact: "Contact",
    office: ["Vijzelstraat 68-78", "1017 ES Amsterdam"],
    book: "Book a call",
  },
  hero: {
    eyebrow: "Prepared by Backspace Oddity for 8FIGURES",
    title: "Growth foundations sprint",
    subtitle: "Groundwork for turning the brand into a growth flywheel",
    cta: "Book a call",
  },
  // § The challenge (one section, two sub-parts — mirrors the doc)
  challenge: {
    h2: "The challenge",
    you: {
      label: "What you see",
      body:
        "Retention and activation: about 20 paying users come in per week and about the same number leave — so there’s essentially no growth. There’s no systematic marketing work, the budget is under $10k per month, and experiments so far have been scattered.",
    },
    we: {
      label: "What we see",
      points: [
        "Lack of confidence in understanding the key customer segments and their underserved jobs-to-be-done,",
        "the criteria and context for choosing a solution for those jobs,",
        "the real competitive landscape, and",
        "positioning that would allow it to win the competitive battle and achieve solid traction.",
      ],
    },
  },
  // § How we'll approach your challenge
  approach: {
    eyebrow: "",
    h2: "How we'll approach it",
    intro:
      "Three principles run under the whole sprint. They keep the work fast and the bets connected, instead of five tactics pulling in different directions.",
    points: [
      {
        metric: "01",
        name: "One connected chain",
        text: "JTBD → ICP → Activation moment → Problems → Competition. Each link sets up the next, so the work compounds. Confirm one bet and the rest sharpen; disprove one and everything downstream reprioritizes.",
      },
      {
        metric: "02",
        name: "Everything is a hypothesis",
        text: "Positioning, identity, the site - bets to test, not truths to polish and defend. Our job is to find the hypothesis most likely to lead us to success, and test that one first.",
      },
      {
        metric: "03",
        name: "Minimum Awesome Product",
        text: "We don't sand the brand and the site to a mirror finish before they've earned it. We ship something already good enough to put in front of real people, learn, and move to the next hypothesis.",
      },
    ],
  },
  // § What we'll do (intro)
  sprint: {
    lead:
      "This is a Brand Foundation Sprint, an MVP of what proper work on turning the brand into a growth lever might look like.",
    nutshell: [
      "~5 weeks",
      "async as much as possible",
      "one round of edits",
      "swift feedback, fast iterations, incremental build",
      "AI-native",
    ],
    note:
      "The heavy full-version modules sit out, but we can always build on that later, turning it into the growth flywheel.",
  },
  phases: [
    {
      kicker: "Phase 1",
      name: "Project kick-off",
      meta: "",
      summary:
        "We digest what you already have and treat it as default knowledge, not something to challenge.",
      modules: [
        "Sales calls",
        "Product and marketing analytics",
        "Customer interviews",
        "The JTBDs you’ve defined",
      ],
    },
    {
      kicker: "Phase 2",
      name: "Brand strategy & platform",
      meta: "workshops",
      summary:
        "A series of workshops to define the key parts of the brand platform and positioning",
      modules: [
        "Brand platform: vision, mission, values, audiences, competitive advantage, promise, reasons to believe, brand personality.",
        "Positioning (1-pager): category, value proposition, difference, who it's for.",
        "ICP through jobs: who to drive in, and when.",
      ],
    },
    {
      kicker: "Phase 3",
      name: "Brand system",
      meta: "verbal + visual",
      summary: "Strategy becomes verbal and visual",
      modules: [
        "Messaging House (Universal): one-liner, elevator pitch, value themes, Tone of Voice base.",
        "Brand identity: logo for digital use, typography system, iconography and illustration direction if agreed.",
        "AI-native design system: enough for your team and its agents to keep the brand consistent without us.",
      ],
    },
    {
      kicker: "Phase 4",
      name: "Creative production",
      meta: "website + brand assets",
      summary:
        "The website and brand assets the user and the investor meet before SF, built on our AI-native stack from templates and components",
      modules: [
        "Website experience: main landing page (value proposition + sign-up form), About us.",
        "Assembly of all core templates and pages.",
        "Responsive behaviors.",
        "Brand assets: LinkedIn post, profile header images, email signature, meeting backgrounds (2 variants).",
        "Final QA and refinements.",
      ],
    },
  ] as Phase[],
  // § What we've done
  experience: {
    eyebrow: "What we've done",
    h2: "Brands we've transformed",
    intro: "Three rebrands, each closing a different part of this same arc.",
    projects: [
      {
        title: "RealtimeBoard → Miro",
        href: "https://miro.com/",
        img: "/images/projects/miro.webp",
        alt: "RealtimeBoard to Miro rebrand",
        desc: "Full rebrand and brand architecture for the move to Miro - a new name, identity, and platform story that scaled into a category leader.",
      },
      {
        title: "Stape → Kleos",
        href: "https://kleos.io/",
        img: "/images/projects/kleos.webp",
        alt: "Stape to Kleos rebrand",
        desc: "Renaming, repositioning, and a new identity for a global payroll and compliance platform moving into a new category.",
      },
      {
        title: "Sidekick (acquired by Perplexity)",
        href: "https://www.theinformation.com/briefings/perplexity-buys-browser-startup-sidekick",
        img: "/images/projects/sidekick.webp",
        alt: "Sidekick browser, acquired by Perplexity",
        desc: "Brand and positioning sharp enough to make the product an acquisition target. Later bought by Perplexity.",
      },
    ],
  },
  // § Investment & timeline
  investment: {
    eyebrow: "Investment & timeline",
    price: "€15,000",
    terms: "Fixed price · 6 weeks, finished before your August trip.",
    paymentLabel: "Payment schedule",
    payment: "50% pre-pay, and 50% after the work is complete.",
  },
  // § Next step
  nextStep: {
    eyebrow: "Next step",
    body:
      "A short call to confirm the starting segment and the first job, and to lock a start date so the finish lands before your flight.",
    cta: "Book a call",
  },
  footer: {
    thisPage: "This page",
    links: [
      { label: "The challenge", href: "#challenge" },
      { label: "How we'll approach", href: "#approach" },
      { label: "The sprint", href: "#phases" },
    ],
    reach: "Reach us",
    city: "Amsterdam",
  },
};
