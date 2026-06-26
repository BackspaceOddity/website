'use client';
/*
 * bt:cascade — the Puma "Runbook" cascade screen as a Landing Builder block (BSO-689).
 *
 * Lifts the verified runbook-engine prototype (app/puma) into a single stateful
 * builder block: KOS dark shell + "Ask your graph" hero + the CascadeSankey
 * overview, seeded from the Selfies case. Renders identically on the builder
 * canvas (e.on) and the published page (e:{on:false}).
 *
 * v1 = faithful single-screen block. Next iteration: split the hero out as its own
 * editable block, lift hypotheses to props, add Evidence/Opportunity Tweaks.
 *
 * Stylesheet: css_key 'puma' → /builder-css/puma.css (self-contained dark theme).
 */
import React, { useEffect, useState } from 'react';
import CascadeSankey from './cascade/cascade-sankey';
import { SEED } from './cascade/cascade';
import { toCascade } from './cascade/toCascade';

type Props = {
  brand?: string;
  eyebrow?: string;
  title?: string;
  caseName?: string;
  asks?: string[];
};

const DEFAULT_ASKS = [
  "What's the riskiest hypothesis still open on SELFIES?",
  'Which experiments are in the read window?',
  'Show me everything denied on a form failure',
];

export function BtCascade({
  brand = 'Puma in a Tank',
  eyebrow = 'Puma in a Tank · Runbook',
  title = 'Ask your graph',
  caseName = 'SELFIES',
  asks = DEFAULT_ASKS,
}: Props) {
  const { cascade, nodes } = toCascade(SEED);
  const [q, setQ] = useState('');

  // This block owns the dark KOS canvas (tana-skin :root[data-theme="dark"]).
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute('data-theme');
    html.setAttribute('data-theme', 'dark');
    return () => {
      if (prev) html.setAttribute('data-theme', prev);
      else html.removeAttribute('data-theme');
    };
  }, []);

  return (
    <div className="puma-root">
      <div className="kos-shell">
        <aside className="kos-side">
          <div className="kos-brand">
            <span className="kos-brand-mark" />
            {brand}
          </div>
          <input className="kos-side-search" placeholder="Search…  ⌘K" readOnly />

          <div className="kos-side-label">Workspace</div>
          <div className="kos-nav-item active">
            Runbook <span className="kos-badge">cascade</span>
          </div>
          <div className="kos-nav-item">Today</div>
          <div className="kos-nav-item">
            Inbox <span className="kos-badge">7</span>
          </div>

          <div className="kos-side-label">Cascade</div>
          <div className="kos-nav-item">Story Directions</div>
          <div className="kos-nav-item">Hypotheses</div>
          <div className="kos-nav-item">Experiments</div>
          <div className="kos-nav-item">Decision Register</div>

          <div className="kos-side-label">Cases</div>
          <div className="kos-nav-item active">{caseName}</div>
        </aside>

        <div className="kos-main">
          <div className="kos-topbar">
            <span className="kos-crumb">
              puma · runbook · <strong>{caseName}</strong>
            </span>
            <div className="kos-topbar-right">
              <span className="kos-seg">
                <span>Today</span>
                <span className="on">Overall</span>
              </span>
              <span className="kos-search-chip">Search ⌘K</span>
            </div>
          </div>

          <div className="kos-content">
            <section className="hero">
              <div className="eyebrow">{eyebrow}</div>
              <h1 className="h1">{title}</h1>
              <div className="hero-input-wrap">
                <input
                  className="hero-input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ask · 'what should we test next?'   or   Query · 'status:testing'"
                />
                <span className="hero-kbd">⌘K</span>
              </div>
              <div className="hero-chips">
                {asks.map((d) => (
                  <button key={d} className="hero-chip" onClick={() => setQ(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </section>

            <div className="kos-pin-label">Pinned · {caseName} current cascade</div>
            <div className="kos-block-wrap">
              <CascadeSankey
                cascade={cascade}
                nodes={nodes}
                onNav={() => {}}
                onExpand={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BtCascade;
