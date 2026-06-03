/**
 * Interactive Proposal Workspace — block render functions (v1)
 *
 * One pure function per block: (props) => HTML string, styled by styles.ts.
 * Extract-as-you-go: only the blocks the first real page (Fatuma/Urembo)
 * needs are implemented. Add more as a client requires them — no speculative
 * blocks.
 */

import type {
  DocHeaderBlock, DividerBlock, StatementBlock, HeardItBlock, BeforeAfterBlock,
  EmphasisFrameBlock, NarrativeBlock, DemoBlock, WhatStayedBlock, NextStepsBlock,
  DiscussionBlock, ExerciseMatrixBlock, DocFooterBlock,
} from './types';

/** Escape plain-text fields. Rich fields (documented in types.ts) are inserted raw. */
export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const sectionNum = (n?: string) => (n ? `<span class="section-num">${esc(n)}</span>` : '');
const paras = (body: string[]) => body.map(p => `<p>${p}</p>`).join('\n  ');

export function docHeader(b: DocHeaderBlock): string {
  const right = [b.version, b.date].filter((x): x is string => Boolean(x)).map(esc).join('<br>');
  return `<div class="doc-header">
  <div>
    <div class="doc-label">${esc(b.label)}</div>
    <div class="doc-meta">${esc(b.meta)}</div>
  </div>
  <div class="doc-date">${right}</div>
</div>`;
}

export function divider(_b: DividerBlock): string {
  return `<hr class="divider">`;
}

export function statement(b: StatementBlock): string {
  return `<div class="statement">${b.text}</div>`;
}

export function heardIt(b: HeardItBlock): string {
  const pills = b.pills?.length
    ? `<div class="pill-group">${b.pills.map(p => `<span class="pill">${esc(p)}</span>`).join('')}</div>`
    : '';
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.statement ? `<div class="statement">${b.statement}</div>` : ''}
  ${paras(b.body)}
  ${pills}
</section>`;
}

export function beforeAfter(b: BeforeAfterBlock): string {
  const col = (c: { label: string; core: string; body?: string }, before: boolean) => `<div class="ba-col${before ? ' ba-before' : ''}">
      <span class="ba-label">${esc(c.label)}</span>
      <div class="ba-core">${c.core}</div>
      ${c.body ? `<p>${c.body}</p>` : ''}
    </div>`;
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="ba-grid">
    ${col(b.before, true)}
    ${col(b.after, false)}
  </div>
  ${b.note ? `<p class="note-small">${b.note}</p>` : ''}
</section>`;
}

export function emphasisFrame(b: EmphasisFrameBlock): string {
  return `<div class="ej-frame">
  <span class="ej-label">${esc(b.label)}</span>
  <p>${b.text}</p>
</div>
${b.note ? `<p class="note-small">${b.note}</p>` : ''}`;
}

export function narrative(b: NarrativeBlock): string {
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${paras(b.body)}
  ${b.example ? `<div class="statement">${b.example}</div>` : ''}
</section>`;
}

export function demo(b: DemoBlock): string {
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="demo-frame">${b.html}</div>
</section>`;
}

export function whatStayed(b: WhatStayedBlock): string {
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${paras(b.body)}
</section>`;
}

export function nextSteps(b: NextStepsBlock): string {
  const rows = b.steps.map((s, i) => `<div class="step-row">
      <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="step-body">
        <div class="step-title">${esc(s.title)}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
    </div>`).join('\n    ');
  const link = b.link ? `<a class="next-link" href="${esc(b.link.href)}">${esc(b.link.label)} →</a>` : '';
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="steps">
    ${rows}
  </div>
  ${link}
</section>`;
}

export function discussion(b: DiscussionBlock): string {
  const items = b.questions.map(q => `<li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">${q.q}</span>
        ${q.note ? `<span class="check-note">${q.note}</span>` : ''}
      </div>
    </li>`).join('\n    ');
  return `<div class="check-section">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <ul class="check-list">
    ${items}
  </ul>
</div>`;
}

export function exerciseMatrix(b: ExerciseMatrixBlock, slug: string): string {
  const ax = b.axisX ?? { label: 'How well it’s handled today', low: 'Badly served', high: 'Well served' };
  const ay = b.axisY ?? { label: 'How important to you', low: 'Minor', high: 'Critical' };
  const cards = b.jobs.map(j =>
    `<div class="exm-card" data-id="${esc(j.id)}" data-label="${esc(j.label)}"><span class="exm-card-label">${esc(j.label)}</span><button class="exm-note-btn" type="button" title="Add a note" aria-label="Add a note">＋ note</button></div>`
  ).join('\n      ');

  const css = `
  .exm-wrap { margin-top: 18px; }
  .exm-intro { font-family: var(--text); font-size: var(--fs-secondary); color: var(--ink-55); line-height: 1.6; margin-bottom: 20px; max-width: 640px; }
  .exm-stage { display: grid; grid-template-columns: 60px 1fr; grid-template-rows: auto auto; gap: 6px 12px; max-width: 632px; }
  .exm-yaxis { grid-row: 1; grid-column: 1; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; padding: 2px 0; text-align: right; }
  .exm-yaxis .hi, .exm-yaxis .lo { font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-40); max-width: 58px; line-height: 1.2; }
  .exm-yaxis .ttl { writing-mode: vertical-rl; transform: rotate(180deg); font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-55); margin: 8px 0; }
  .exm-matrix { grid-row: 1; grid-column: 2; position: relative; aspect-ratio: 1; width: 100%; max-width: 560px; border: 1.5px solid var(--rule-strong); background: var(--surface); }
  .exm-matrix::before, .exm-matrix::after { content: ''; position: absolute; background: var(--rule); }
  .exm-matrix::before { left: 50%; top: 0; bottom: 0; width: 1px; }
  .exm-matrix::after { top: 50%; left: 0; right: 0; height: 1px; }
  .exm-hot { position: absolute; left: 0; top: 0; width: 50%; height: 50%; background: rgba(1,28,0,.05); }
  .exm-hot span { position: absolute; left: 11px; top: 9px; font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-40); }
  .exm-xaxis { grid-row: 2; grid-column: 2; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-top: 8px; }
  .exm-xaxis .hi, .exm-xaxis .lo { font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-40); white-space: nowrap; }
  .exm-xaxis .ttl { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-55); text-align: center; }
  .exm-tray { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .exm-tray-label { width: 100%; font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-40); margin-bottom: 2px; }
  .exm-card { display: inline-flex; align-items: center; gap: 9px; background: #FFFFFF; border: 1px solid rgba(1,28,0,.10); border-radius: 3px; padding: 13px 14px; font-family: var(--text); font-size: 13px; line-height: 1.35; color: var(--ink); cursor: grab; max-width: 216px; touch-action: none; box-shadow: 0 3px 9px rgba(1,28,0,.13), 0 1px 2px rgba(1,28,0,.10); transition: box-shadow .12s ease, transform .12s ease; }
  .exm-tray .exm-card { transform: rotate(-1.1deg); }
  .exm-tray .exm-card:nth-of-type(3n) { transform: rotate(1.5deg); }
  .exm-tray .exm-card:nth-of-type(3n+2) { transform: rotate(.4deg); }
  .exm-card:active { cursor: grabbing; box-shadow: 0 9px 20px rgba(1,28,0,.20); }
  .exm-card.placed { position: absolute; z-index: 2; max-width: 182px; transform: none !important; box-shadow: 0 5px 13px rgba(1,28,0,.17); }
  .exm-card.placed:active { box-shadow: 0 10px 22px rgba(1,28,0,.22); }
  .exm-card.has-note { border-color: var(--ink); }
  .exm-note-btn { display: none; background: none; border: none; font-family: var(--mono); font-size: 9px; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-40); cursor: pointer; padding: 0; white-space: nowrap; }
  .exm-card.placed .exm-note-btn { display: inline; }
  .exm-panel { margin-top: 18px; border-top: 1px solid var(--rule); padding-top: 14px; display: none; }
  .exm-panel.open { display: block; }
  .exm-panel-h { font-family: var(--mono); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-55); margin-bottom: 8px; }
  .exm-panel textarea { display: block; width: 100%; box-sizing: border-box; border: 1px solid var(--rule-strong); border-radius: 6px; padding: 9px 10px; font-family: var(--text); font-size: 14px; line-height: 1.5; resize: vertical; background: var(--surface); color: var(--ink); outline: none; min-height: 58px; }
  .exm-panel-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
  .exm-mic { background: var(--paper); border: 1px solid var(--rule-strong); border-radius: 6px; padding: 7px 11px; font-family: var(--mono); font-size: 10px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink-55); cursor: pointer; }
  .exm-mic.rec { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .exm-mic-note { font-family: var(--mono); font-size: 10px; color: var(--ink-40); }
  .exm-actions { display: flex; align-items: center; gap: 14px; margin-top: 22px; }
  .exm-save { background: var(--ink); color: var(--paper); border: none; border-radius: 7px; padding: 11px 22px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .exm-save:disabled { opacity: .4; cursor: default; }
  .exm-status { font-family: var(--mono); font-size: 11px; color: var(--ink-40); }
  `;

  const root = `exm-${esc(b.exerciseId)}`;
  const js =
`(function(){
  var root=document.getElementById('${root}'); if(!root) return;
  var matrix=root.querySelector('.exm-matrix'), tray=root.querySelector('.exm-tray');
  var panel=root.querySelector('.exm-panel'), panelH=root.querySelector('.exm-panel-h');
  var ta=root.querySelector('.exm-ta'), mic=root.querySelector('.exm-mic'), micNote=root.querySelector('.exm-mic-note');
  var saveBtn=root.querySelector('.exm-save'), statusEl=root.querySelector('.exm-status');
  var P={}, active=null, drag=null, ox=0, oy=0, moved=false;
  function place(card){
    var mr=matrix.getBoundingClientRect(), cr=card.getBoundingClientRect();
    var sx=Math.max(0,Math.min(1,(cr.left+cr.width/2-mr.left)/mr.width));
    var sy=Math.max(0,Math.min(1,(cr.top+cr.height/2-mr.top)/mr.height));
    var id=card.getAttribute('data-id');
    P[id]=P[id]||{label:card.getAttribute('data-label')};
    P[id].satisfaction=Math.round(sx*100); P[id].importance=Math.round((1-sy)*100);
    status();
  }
  function status(){ var n=Object.keys(P).length, t=${b.jobs.length}; statusEl.textContent=n+' of '+t+' placed'; saveBtn.disabled=n===0; }
  function down(e){ var card=e.target.closest('.exm-card'); if(!card) return;
    if(e.target.closest('.exm-note-btn')){ openNote(card); return; }
    drag=card; moved=false; card.setPointerCapture(e.pointerId);
    var r=card.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; card.style.cursor='grabbing'; }
  function move(e){ if(!drag) return; moved=true;
    if(!drag.classList.contains('placed')){ drag.classList.add('placed'); matrix.appendChild(drag); }
    var mr=matrix.getBoundingClientRect();
    drag.style.left=(e.clientX-mr.left-ox)+'px'; drag.style.top=(e.clientY-mr.top-oy)+'px'; }
  function up(){ if(!drag) return; if(drag.classList.contains('placed')) place(drag); drag.style.cursor='grab'; drag=null; }
  function openNote(card){ active=card.getAttribute('data-id'); P[active]=P[active]||{label:card.getAttribute('data-label')};
    panelH.textContent='Why that rating — '+card.getAttribute('data-label'); ta.value=P[active].comment||'';
    micNote.textContent=P[active].audio?'voice note saved':''; panel.classList.add('open'); ta.focus();
    panel.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  ta && ta.addEventListener('input',function(){ if(active){ P[active].comment=ta.value; mark(active); } });
  function mark(id){ var c=matrix.querySelector('.exm-card[data-id="'+id+'"]'); if(c){ var has=(P[id].comment&&P[id].comment.trim())||P[id].audio; c.classList.toggle('has-note',!!has); } }
  matrix.addEventListener('pointerdown',down); tray.addEventListener('pointerdown',down);
  document.addEventListener('pointermove',move); document.addEventListener('pointerup',up);
  // voice — best-effort
  var mr_=null, chunks=[];
  mic && mic.addEventListener('click',function(){
    if(!active) return;
    if(mr_&&mr_.state==='recording'){ mr_.stop(); return; }
    if(!navigator.mediaDevices||!window.MediaRecorder){ micNote.textContent='voice not supported here'; return; }
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){
      chunks=[]; mr_=new MediaRecorder(s); mic.classList.add('rec'); mic.textContent='■ Stop';
      mr_.ondataavailable=function(ev){ chunks.push(ev.data); };
      mr_.onstop=function(){ s.getTracks().forEach(function(t){t.stop();}); mic.classList.remove('rec'); mic.textContent='● Record';
        var blob=new Blob(chunks,{type:'audio/webm'}); var fr=new FileReader();
        fr.onload=function(){ if(active){ P[active].audio=fr.result; micNote.textContent='voice note saved'; mark(active); } }; fr.readAsDataURL(blob); };
      mr_.start();
    }).catch(function(){ micNote.textContent='mic blocked'; });
  });
  saveBtn.addEventListener('click',function(){
    saveBtn.disabled=true; statusEl.textContent='saving…';
    var items=Object.keys(P).map(function(id){ return {id:id,label:P[id].label,importance:P[id].importance,satisfaction:P[id].satisfaction,comment:P[id].comment||'',hasAudio:!!P[id].audio,audio:P[id].audio||null}; });
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'${esc(b.exerciseId)}',payload:{placements:items}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?'✓ Saved — thank you':'Save failed'; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent='Save failed — check connection'; saveBtn.disabled=false; });
  });
  status();
})();`;

  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exm-intro">${b.intro}</p>` : ''}
  <style>${css}</style>
  <div class="exm-wrap">
    <div class="exm-stage">
      <div class="exm-yaxis">
        <span class="hi">${esc(ay.high)}</span>
        <span class="ttl">${esc(ay.label)}</span>
        <span class="lo">${esc(ay.low)}</span>
      </div>
      <div class="exm-matrix">
        <div class="exm-hot"><span>Underserved</span></div>
      </div>
      <div class="exm-xaxis">
        <span class="lo">${esc(ax.low)}</span>
        <span class="ttl">${esc(ax.label)}</span>
        <span class="hi">${esc(ax.high)}</span>
      </div>
    </div>
    <div class="exm-tray">
      <div class="exm-tray-label">Drag each onto the grid — height = importance, left/right = how well it’s handled today</div>
      ${cards}
    </div>
    <div class="exm-panel">
      <div class="exm-panel-h"></div>
      <textarea class="exm-ta" placeholder="Optional: why did you place it there?"></textarea>
      <div class="exm-panel-row">
        <button type="button" class="exm-mic">● Record</button>
        <span class="exm-mic-note"></span>
      </div>
    </div>
    <div class="exm-actions">
      <button type="button" class="exm-save" disabled>Save</button>
      <span class="exm-status"></span>
    </div>
  </div>
  <script>${js}</script>
</section>`;
}

export function docFooter(b: DocFooterBlock): string {
  return `<div class="doc-footer">
  <span>${esc(b.left)}</span>
  <span>${esc(b.right)}</span>
</div>`;
}
