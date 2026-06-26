"use client";

import { useEffect, useState } from "react";
import CascadeSankey from "./kos/cascade-sankey";
import QueryBlocks from "./components/QueryBlocks";
import { SEED } from "./lib/cascade";
import { toCascade } from "./lib/toCascade";

const DEMO_ASKS = [
  "What's the riskiest hypothesis still open on SELFIES?",
  "Which experiments are in the read window?",
  "Show me everything denied on a form failure",
];

export default function PumaRunbook() {
  const { cascade, nodes } = toCascade(SEED);
  const [q, setQ] = useState("");

  // This route owns the dark KOS canvas (tana-skin :root[data-theme="dark"]).
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute("data-theme");
    html.setAttribute("data-theme", "light");
    return () => {
      if (prev) html.setAttribute("data-theme", prev);
      else html.removeAttribute("data-theme");
    };
  }, []);

  return (
    <div className="puma-root">
      <div className="kos-shell">
        <aside className="kos-side">
          <div className="kos-brand">
            <span className="kos-brand-mark" />
            Puma in a Tank
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
          <div className="kos-nav-item active">SELFIES</div>
        </aside>

        <div className="kos-main">
          <div className="kos-topbar">
            <span className="kos-crumb">
              puma · runbook · <strong>SELFIES</strong>
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
              <div className="eyebrow">Puma in a Tank · Runbook</div>
              <h1 className="h1">Ask your graph</h1>
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
                {DEMO_ASKS.map((d) => (
                  <button key={d} className="hero-chip" onClick={() => setQ(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </section>

            <div className="kos-pin-label">Saved queries</div>
            <QueryBlocks />

            <div className="kos-pin-label">Pinned · Selfies current cascade</div>
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
