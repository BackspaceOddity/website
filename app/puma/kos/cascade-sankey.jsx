"use client";
import React from "react";

// Lifted verbatim from KOS v11 (web/public/v11/src/cascade-sankey.jsx).
// Only adaptations: ESM imports/export, and titleOf shim (was titleOf).
const titleOf = (n) => (n && n.title) || "";

// CascadeSankey — pinned top block on the BSO workspace home (and on initiative nodes).
// Left:   initiative node (bso-current-cascade)
// Middle: hypothesis cards with status pill, confidence bar, category-entry-point badge
// Right:  evidence chips pulled from each hypothesis's evidence_for frontmatter
//
// v2: first click on a hypothesis — expand in-place (cascade drill-down).
//   - dims non-related cards/flows
//   - shows prospect badge (Conf × Opp), status glyph, CEP, owner
//   - reveals upstream siblings (same CEP) + existing evidence as downstream
//   - Stripe-style "Expand →" button navigates to node
//   - click again (or outside) collapses

function CascadeSankey({ cascade, nodes, onNav, onExpand }) {
  const [selectedId, setSelectedId] = React.useState(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const panRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const [isPanning, setIsPanning] = React.useState(false);

  if (!cascade) return null;

  // ---- Pull linked hypotheses in spec order ----
  const hypRefs = Array.isArray(cascade.fm.hypotheses) ? cascade.fm.hypotheses : [];
  const hyps = hypRefs
    .map(ref => {
      const id = String(ref).replace(/^\[\[([^\]|]+).*\]\]$/, '$1').replace(/^.*\//, '').trim();
      return nodes[id];
    })
    .filter(Boolean);

  // ---- Collect evidence across all hypotheses, dedupe by id ----
  const evidenceMap = new Map();
  for (const h of hyps) {
    const refs = Array.isArray(h.fm.evidence_for) ? h.fm.evidence_for : [];
    for (const r of refs) {
      const id = String(r).replace(/^\[\[([^\]|]+).*\]\]$/, '$1').replace(/^.*\//, '').trim();
      const n = nodes[id];
      if (!n) continue;
      if (!evidenceMap.has(id)) evidenceMap.set(id, { node: n, from: new Set() });
      evidenceMap.get(id).from.add(h.id);
    }
  }
  const evidence = Array.from(evidenceMap.values());

  // ---- Summary numbers ----
  const active = hyps.filter(h => {
    const s = String(h.fm.status || '').toLowerCase();
    return s === 'testing' || s === 'pending';
  });
  const avgConf = hyps.length
    ? Math.round(
        (hyps.reduce((sum, h) => sum + (Number(h.fm.confidence) || 0), 0) / hyps.length) * 100
      )
    : 0;
  const nextReview = 'Monday';

  // ---- Selected hypothesis drill-down ----
  const selected = selectedId ? hyps.find(h => h.id === selectedId) : null;
  const selectedIdx = selected ? hyps.findIndex(h => h.id === selectedId) : -1;

  // For a selected hypothesis, compute upstream & downstream ids.
  // Upstream: parent initiative + sibling hypotheses that share the same CEP (co-supporting context).
  // Downstream: its evidence_for + evidence_against nodes.
  let upstreamIds = new Set();
  let downstreamIds = new Set();
  let selectedSiblings = []; // hypotheses (excluding selected) that share CEP — shown in-place, highlighted
  if (selected) {
    upstreamIds.add(cascade.id);
    const sCEP = selected.fm.category_entry_point;
    hyps.forEach(h => {
      if (h.id !== selected.id && sCEP && h.fm.category_entry_point === sCEP) {
        selectedSiblings.push(h);
      }
    });
    const evFor = Array.isArray(selected.fm.evidence_for) ? selected.fm.evidence_for : [];
    const evAgainst = Array.isArray(selected.fm.evidence_against) ? selected.fm.evidence_against : [];
    [...evFor, ...evAgainst].forEach(r => {
      const id = String(r).replace(/^\[\[([^\]|]+).*\]\]$/, '$1').replace(/^.*\//, '').trim();
      downstreamIds.add(id);
    });
  }

  // Does a flow path connect TO or FROM selected? used for dimming non-related flows.
  const flowIsRelated = (hId) => selected && (hId === selected.id || selectedSiblings.some(s => s.id === hId));

  // ---- Status glyph / Prospect score ----
  const statusOf = (h) => String(h.fm.status || 'pending').toLowerCase();
  const prospectOf = (h) => {
    const conf10 = Math.round((Number(h.fm.confidence) || 0) * 10); // 0-10
    const opp10 = Number(h.fm.risk_score) || 5; // 1-10; using risk_score as opportunity proxy
    return { conf: conf10, opp: opp10, score: conf10 * opp10 };
  };
  const StatusGlyph = ({ status }) => {
    if (status === 'validated' || status === 'confirmed') {
      return (
        <span className="csb-status-glyph csb-glyph-ok" title="confirmed" aria-label="confirmed">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.3 L6 10 L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      );
    }
    if (status === 'denied' || status === 'rejected' || status === 'superseded') {
      return (
        <span className="csb-status-glyph csb-glyph-x" title="denied" aria-label="denied">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5 L10.5 10.5 M10.5 3.5 L3.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
      );
    }
    if (status === 'testing') {
      return (
        <span className="csb-status-glyph csb-glyph-test" title="testing" aria-label="testing">
          <span className="csb-pulse-dot" />
        </span>
      );
    }
    return (
      <span className="csb-status-glyph csb-glyph-pending" title="pending" aria-label="pending">
        <span className="csb-dot-static" />
      </span>
    );
  };

  const onCardClick = (h, e) => {
    e.stopPropagation();
    if (selectedId === h.id) {
      setSelectedId(null);
      setDetailsOpen(false);
    } else {
      setSelectedId(h.id);
      setDetailsOpen(false);
    }
  };

  const onBackgroundClick = () => {
    if (selectedId) {
      setSelectedId(null);
      setDetailsOpen(false);
    }
  };

  // ---- Drag-to-pan on the Miro-style viewport ----
  const onPanDown = (e) => {
    // Only pan on background (not cards, chips, buttons)
    if (e.target.closest('.csb-hyp-card, .csb-init-card, .csb-ev-chip, .csb-drill, button, a')) return;
    const el = panRef.current;
    if (!el) return;
    dragRef.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
    setIsPanning(true);
  };
  const onPanMove = (e) => {
    if (!dragRef.current) return;
    const el = panRef.current;
    if (!el) return;
    el.scrollLeft = dragRef.current.sl - (e.clientX - dragRef.current.x);
    el.scrollTop = dragRef.current.st - (e.clientY - dragRef.current.y);
  };
  const onPanUp = () => { dragRef.current = null; setIsPanning(false); };

  return (
    <section className={'cascade-sankey-block' + (selectedId ? ' has-selection' : '')} onClick={onBackgroundClick}>
      <header className="csb-head">
        <div className="csb-head-main">
          <h2 className="csb-title">{cascade.title} · Current Cascade</h2>
          <span className="csb-sub">what we're testing right now · <a className="csb-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNav(cascade.id); }}>{cascade.id}</a></span>
        </div>
        {onExpand && (
          <button
            className="csb-expand-btn"
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            title="Open as full page"
          >
            <span>Expand</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M7 1 L11 1 L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 11 L1 11 L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 1 L6.5 5.5 M1 11 L5.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </header>

      <div
        ref={panRef}
        className={'csb-sankey-pan' + (isPanning ? ' is-panning' : '')}
        onMouseDown={onPanDown}
        onMouseMove={onPanMove}
        onMouseUp={onPanUp}
        onMouseLeave={onPanUp}
      >
      <div className="csb-sankey">
        {/* -- LEFT: initiative node -- */}
        <div className="csb-col csb-col-left">
          <div
            className={'csb-init-card' + (selected && upstreamIds.has(cascade.id) ? ' is-related' : (selected ? ' is-dim' : ''))}
            onClick={(e) => { e.stopPropagation(); onNav(cascade.id); }}
          >
            <div className="csb-init-kind">initiative · cascade</div>
            <div className="csb-init-title">{titleOf ? titleOf(cascade) : cascade.title}</div>
            <div className="csb-init-meta">
              <span className={'csb-status-pill ' + String(cascade.fm.status || 'active').toLowerCase()}>{cascade.fm.status || 'active'}</span>
              <span className="csb-init-owner">owner: {cascade.fm.owner || '—'}</span>
            </div>
          </div>
        </div>

        {/* -- FLOW 1 : initiative → hypotheses -- */}
        <svg className="csb-flow csb-flow-1" viewBox="0 0 100 480" preserveAspectRatio="none" aria-hidden="true">
          {hyps.map((h, i) => {
            const y2 = ((i + 0.5) / hyps.length) * 480;
            const related = flowIsRelated(h.id);
            return (
              <path
                key={h.id}
                className={'csb-flow-path ' + statusOf(h) + (selected ? (related ? ' is-related' : ' is-dim') : '')}
                d={`M 0 240 C 50 240, 50 ${y2}, 100 ${y2}`}
                strokeWidth={Math.max(3, (Number(h.fm.confidence) || 0.3) * 18)}
              />
            );
          })}
        </svg>

        {/* -- MIDDLE: hypothesis cards -- */}
        <div className="csb-col csb-col-mid">
          {hyps.map((h, i) => {
            const status = statusOf(h);
            const conf = Math.round((Number(h.fm.confidence) || 0) * 100);
            const entry = h.fm.category_entry_point || '';
            const isSelected = selectedId === h.id;
            const isSibling = selected && selectedSiblings.some(s => s.id === h.id);
            const related = isSelected || isSibling;
            const dim = selected && !related;
            const p = prospectOf(h);
            return (
              <div
                key={h.id}
                className={'csb-hyp-card' + (isSelected ? ' is-selected' : '') + (isSibling ? ' is-sibling' : '') + (dim ? ' is-dim' : '')}
                onClick={(e) => onCardClick(h, e)}
              >
                <div className="csb-hyp-row">
                  <StatusGlyph status={status} />
                  <span className={'csb-status-pill ' + status}>{status}</span>
                  {entry && <span className="csb-entry-badge" title="Category entry point">{entry}</span>}
                  {isSelected && (
                    <span className="csb-prospect-badge" title="Prospect Score = Confidence × Opportunity">
                      Conf <strong>{p.conf}</strong> × Opp <strong>{p.opp}</strong> = <strong>{p.score}</strong>
                    </span>
                  )}
                </div>
                <div className="csb-hyp-title">{titleOf ? titleOf(h) : h.title}</div>
                <div className="csb-conf">
                  <div className="csb-conf-bar">
                    <div className={'csb-conf-fill ' + status} style={{ width: conf + '%' }} />
                  </div>
                  <span className="csb-conf-num">{conf}%</span>
                </div>

                {/* Selected drill-down panel */}
                {isSelected && (
                  <div className="csb-drill" onClick={(e) => e.stopPropagation()}>
                    <div className="csb-drill-controls">
                      <button
                        className={'csb-details-toggle' + (detailsOpen ? ' is-open' : '')}
                        onClick={(e) => { e.stopPropagation(); setDetailsOpen(v => !v); }}
                        aria-expanded={detailsOpen}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true" className="csb-chevron">
                          <path d="M2.5 1.5 L5.5 4 L2.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>SHOW DETAILS</span>
                      </button>
                      <button
                        className="csb-expand-icon-btn"
                        onClick={(e) => { e.stopPropagation(); onNav(h.id); }}
                        title="Expand hypothesis"
                        aria-label="Expand hypothesis"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M7 1 L11 1 L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 11 L1 11 L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 1 L6.5 5.5 M1 11 L5.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>

                    {detailsOpen && (
                      <div className="csb-drill-body">
                        <div className="csb-drill-meta">
                          <span className="csb-drill-label">author</span>
                          <span className="csb-drill-value">{h.fm.author || h.fm.owner || '—'}</span>
                          <span className="csb-drill-sep">·</span>
                          <span className="csb-drill-label">owner</span>
                          <span className="csb-drill-value">{h.fm.owner || h.fm.author || '—'}</span>
                        </div>
                        {selectedSiblings.length > 0 && (
                          <div className="csb-drill-cascade">
                            <div className="csb-drill-head">↑ upstream · siblings in same CEP</div>
                            {selectedSiblings.map(s => (
                              <div
                                key={s.id}
                                className="csb-drill-chip"
                                onClick={(e) => { e.stopPropagation(); setSelectedId(s.id); setDetailsOpen(false); }}
                              >
                                <span className={'csb-mini-dot ' + statusOf(s)} />
                                <span className="csb-drill-chip-title">{titleOf ? titleOf(s) : s.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="csb-drill-cascade">
                          <div className="csb-drill-head">↓ downstream · evidence</div>
                          {downstreamIds.size === 0 ? (
                            <div className="csb-drill-empty">no evidence linked yet</div>
                          ) : (
                            Array.from(downstreamIds).map(eid => {
                              const ev = nodes[eid];
                              if (!ev) return null;
                              return (
                                <div
                                  key={eid}
                                  className="csb-drill-chip"
                                  onClick={(e) => { e.stopPropagation(); onNav(eid); }}
                                >
                                  <span className="csb-mini-dot" style={{ background: `var(--type-${ev.type}, var(--text-muted))` }} />
                                  <span className="csb-drill-chip-title">{titleOf ? titleOf(ev) : ev.title}</span>
                                  <span className="csb-drill-chip-type">{ev.type}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* -- FLOW 2 : hypotheses → evidence -- */}
        <svg className="csb-flow csb-flow-2" viewBox="0 0 100 480" preserveAspectRatio="none" aria-hidden="true">
          {hyps.map((h, i) => {
            const y1 = ((i + 0.5) / hyps.length) * 480;
            const refs = Array.isArray(h.fm.evidence_for) ? h.fm.evidence_for : [];
            if (refs.length === 0) return null;
            const related = flowIsRelated(h.id);
            return refs.map((r, ri) => {
              const eid = String(r).replace(/^\[\[([^\]|]+).*\]\]$/, '$1').replace(/^.*\//, '').trim();
              const eIdx = evidence.findIndex(e => e.node.id === eid);
              if (eIdx === -1) return null;
              const y2 = ((eIdx + 0.5) / evidence.length) * 480;
              return (
                <path
                  key={h.id + '-' + ri}
                  className={'csb-flow-path ' + statusOf(h) + (selected ? (related ? ' is-related' : ' is-dim') : '')}
                  d={`M 0 ${y1} C 50 ${y1}, 50 ${y2}, 100 ${y2}`}
                  strokeWidth={2}
                />
              );
            });
          })}
        </svg>

        {/* -- RIGHT: evidence chips -- */}
        <div className="csb-col csb-col-right">
          {evidence.length === 0 && (
            <div className="csb-no-evidence">no evidence linked yet</div>
          )}
          {evidence.map(({ node: n, from }, i) => {
            const related = selected && downstreamIds.has(n.id);
            const dim = selected && !related;
            return (
              <div
                key={n.id}
                className={'csb-ev-chip' + (related ? ' is-related' : '') + (dim ? ' is-dim' : '')}
                onClick={(e) => { e.stopPropagation(); onNav(n.id); }}
                title={`evidence for ${from.size} hypothesis${from.size === 1 ? '' : 'es'}`}
              >
                <span className="csb-ev-kind" style={{ background: `var(--type-${n.type}, var(--text-muted))` }} />
                <span className="csb-ev-title">{titleOf ? titleOf(n) : n.title}</span>
                <span className="csb-ev-type">{n.type}</span>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      <footer className="csb-foot">
        <span className="csb-foot-stat"><strong>{active.length}</strong> hypotheses active</span>
        <span className="csb-dot-sep">·</span>
        <span className="csb-foot-stat">average confidence <strong>{avgConf}%</strong></span>
        <span className="csb-dot-sep">·</span>
        <span className="csb-foot-stat">next weekly review: <strong>{nextReview}</strong></span>
      </footer>
    </section>
  );
}

export default CascadeSankey;
