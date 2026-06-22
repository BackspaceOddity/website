/**
 * Interactive exercise/workshop blocks — render functions ported VERBATIM from
 * the JetBrains workshop (`jetbrains-ci-workshop` branch,
 * lib/proposal-workspace/blocks.ts, 996-line version). BSO-658 Pass 2.
 *
 * These are the live `/w` widgets (drag matrix + voice, drag-rank, chips,
 * solutions, discussion-lock, client-notes read-back) — same markup, same
 * inline-<script> handler logic, copied 1:1 so behaviour matches the field-
 * tested version exactly. Only THREE things are rewired for the builder:
 *   1. save target   /w/<slug>/exercise/        -> POST /api/builder/exercise (slug in body)
 *      read-back GET  /w/<slug>/exercise/        -> GET  /api/builder/exercise?slug=<slug>
 *   2. storage keys   ws:<slug>:jtbd|questions   -> builder:<slug>:jtbd|questions
 *      events         ws:jtbd-changed            -> builder:jtbd-changed
 *   3. a `live` flag: in the builder canvas (not a published page) Save is a
 *      no-op with a "preview — clients save on the published page" note.
 *
 * Each function returns a full HTML string incl. <style> + <script>; the React
 * wrapper in exercises.tsx mounts it via innerHTML and re-executes the scripts.
 * `b` is typed `any` on purpose — these are copied JS-in-TS render helpers and
 * the on-disk types.ts predates the ui/wide/editable/singleSelect fields.
 */

export function esc(s: any): string {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const sectionNum = (n?: string) => (n ? `<span class="section-num">${esc(n)}</span>` : '');
const PREVIEW = 'preview — clients save on the published page';

/* ======================= MATRIX ======================= */
export function exerciseMatrix(b: any, slug: string, serverSeed: any[] = [], live = false): string {
  const ax = b.axisX ?? { label: 'How well it’s handled today', low: 'Badly served', high: 'Well served' };
  const ay = b.axisY ?? { label: 'How important to you', low: 'Minor', high: 'Critical' };
  const u = {
    note: '＋ note', placed: '{n} of {t} placed', underserved: 'Underserved',
    dragHint: 'Drag each onto the grid — left/right = importance, up/down = how well it’s handled today',
    notePlaceholder: 'Optional: why did you place it there?', whyRating: 'Why that rating — ',
    record: '● Record', stop: '■ Stop', voiceSaved: 'voice note saved',
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', save: 'Save',
    valFormat: 'IMP {imp} · SAT {sat}',
    addSticker: '＋ Add sticker', newStickerPlaceholder: 'Your own job…',
    ...(b.ui || {}),
  };
  const xnums = Array.from({ length: 10 }, (_, i) => `<span>${i + 1}</span>`).join('');
  const ynums = Array.from({ length: 10 }, (_, i) => `<span>${10 - i}</span>`).join('');
  const cards = (b.jobs || []).map((j: any) =>
    `<div class="exm-card" data-id="${esc(j.id)}" data-label="${esc(j.label)}"><span class="exm-card-label">${esc(j.label)}</span><div class="exm-card-foot"><span class="exm-val" aria-hidden="true"></span><button class="exm-note-btn" type="button" title="${esc(u.note)}" aria-label="${esc(u.note)}">${esc(u.note)}</button></div></div>`
  ).join('\n      ');

  const css = `
  .exm-wrap { margin-top: 18px; }
  .exm-intro { font-family: var(--text); font-size: var(--fs-secondary); color: var(--ink-55); line-height: 1.6; margin-bottom: 20px; max-width: 640px; }
  .exm-stage { display: grid; grid-template-columns: 76px 1fr; grid-template-rows: auto auto; gap: 6px 8px; max-width: 644px; }
  .exm-yaxis { grid-row: 1; grid-column: 1; display: flex; flex-direction: row; align-items: stretch; gap: 4px; }
  .exm-yaxis .ttl { writing-mode: vertical-rl; transform: rotate(180deg); font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-55); text-align: center; }
  .exm-ynums { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; font-family: var(--mono); font-size: 9px; line-height: 1; color: var(--ink-40); padding: 1px 0; }
  .exm-matrix { grid-row: 1; grid-column: 2; position: relative; aspect-ratio: 1; width: 100%; max-width: 560px; border: 1.5px solid var(--ink-40); background-color: var(--surface); background-image: repeating-linear-gradient(to right, var(--rule) 0 1px, transparent 1px calc(100%/9)), repeating-linear-gradient(to bottom, var(--rule) 0 1px, transparent 1px calc(100%/9)); }
  .exm-matrix::before, .exm-matrix::after { content: ''; position: absolute; background: var(--ink-25); }
  .exm-matrix::before { left: 50%; top: 0; bottom: 0; width: 1px; }
  .exm-matrix::after { top: 50%; left: 0; right: 0; height: 1px; }
  .exm-hot { position: absolute; left: 50%; top: 50%; width: 50%; height: 50%; background: rgba(1,28,0,.05); }
  .exm-hot span { position: absolute; left: 11px; top: 9px; font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-40); }
  .exm-xaxis { grid-row: 2; grid-column: 2; display: flex; flex-direction: column; gap: 3px; margin-top: 6px; }
  .exm-xnums { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 9px; line-height: 1; color: var(--ink-40); }
  .exm-xaxis .ttl { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-55); text-align: center; }
  .exm-tray { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .exm-tray-label { width: 100%; font-family: var(--mono); font-size: 12px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink); margin-bottom: 12px; }
  .exm-card { display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 6px; width: 120px; min-height: 120px; box-sizing: border-box; background: #F6EFC4; border: 1px solid rgba(150,130,40,.20); border-radius: 1px; padding: 11px; font-family: var(--text); font-size: 12px; line-height: 1.3; color: #011C00; cursor: grab; touch-action: none; box-shadow: 0 4px 10px rgba(1,28,0,.16), 0 1px 2px rgba(1,28,0,.10); transition: box-shadow .12s ease, transform .12s ease; }
  .exm-card-label { flex: 1; }
  .exm-card-foot { display: none; }
  .exm-card.placed .exm-card-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 8px; width: 100%; padding-top: 6px; border-top: 1px solid rgba(1,28,0,.14); }
  .exm-val { font-family: var(--mono); font-size: 9px; letter-spacing: .02em; color: rgba(1,28,0,.72); white-space: nowrap; }
  .exm-guide { position: absolute; background: var(--ink-40); opacity: 0; transition: opacity .08s; pointer-events: none; z-index: 1; }
  .exm-guide.on { opacity: 1; }
  .exm-guide-v { top: 0; bottom: 0; width: 1px; }
  .exm-guide-h { left: 0; right: 0; height: 1px; }
  .exm-tray .exm-card { transform: rotate(-1.4deg); }
  .exm-tray .exm-card:nth-of-type(3n) { transform: rotate(1.8deg); }
  .exm-tray .exm-card:nth-of-type(3n+2) { transform: rotate(.6deg); }
  .exm-card:active { cursor: grabbing; box-shadow: 0 10px 22px rgba(1,28,0,.22); }
  .exm-card.placed { position: absolute; z-index: 2; width: 136px; min-height: 0; height: auto; font-size: 11px; transform: none !important; box-shadow: 0 6px 14px rgba(1,28,0,.18); }
  .exm-card.placed:active { box-shadow: 0 11px 24px rgba(1,28,0,.24); }
  .exm-card.has-note { border-color: #011C00; }
  .exm-note-btn { background: none; border: none; font-family: var(--mono); font-size: 9px; letter-spacing: .04em; text-transform: uppercase; line-height: 1; color: rgba(1,28,0,.55); cursor: pointer; padding: 0; white-space: nowrap; flex-shrink: 0; }
  .exm-note-btn:hover { color: #011C00; }
  .exm-card-label[contenteditable="true"] { outline: none; cursor: text; }
  .exm-card.editing { cursor: default; box-shadow: 0 0 0 2px var(--ink), 0 10px 22px rgba(1,28,0,.22); }
  .exm-card-label:empty::before { content: attr(data-ph); color: rgba(1,28,0,.42); font-style: italic; }
  .exm-add-sticker { display: flex; align-items: center; justify-content: center; gap: 6px; width: 120px; min-height: 120px; box-sizing: border-box; background: transparent; border: 1.5px dashed var(--rule-strong); border-radius: 1px; padding: 11px; font-family: var(--text); font-size: 12px; color: var(--ink-55); cursor: pointer; transition: border-color .12s, color .12s; }
  .exm-add-sticker:hover { border-color: var(--ink); color: var(--ink); }
  .exm-panel { margin-top: 18px; border-top: 1px solid var(--rule); padding-top: 14px; display: none; }
  .exm-panel.open { display: block; }
  .exm-panel-h { font-family: var(--mono); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-55); margin-bottom: 8px; }
  .exm-panel textarea { display: block; width: 100%; box-sizing: border-box; border: 1px solid var(--rule-strong); border-radius: 6px; padding: 8px 10px; font-family: var(--text); font-size: 14px; line-height: 1.5; resize: vertical; background: var(--surface); color: var(--ink); outline: none; min-height: 58px; }
  .exm-panel-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
  .exm-mic { background: var(--paper); border: 1px solid var(--rule-strong); border-radius: 6px; padding: 8px 12px; font-family: var(--mono); font-size: 10px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink-55); cursor: pointer; }
  .exm-mic.rec { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .exm-mic-note { font-family: var(--mono); font-size: 10px; color: var(--ink-40); }
  .exm-actions { display: flex; align-items: center; gap: 14px; margin-top: 22px; }
  .exm-save { background: var(--ink); color: var(--paper); border: none; border-radius: 7px; padding: 12px 22px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .exm-save:disabled { opacity: .4; cursor: default; }
  .exm-status { font-family: var(--mono); font-size: 11px; color: var(--ink-40); }
  ${b.wide ? `
  .exm-section-wide .exm-wrap { width: min(1240px, calc(100vw - 40px)); position: relative; left: 50%; transform: translateX(-50%); display: grid; grid-template-columns: minmax(580px, 0.64fr) minmax(260px, 0.36fr); column-gap: 56px; row-gap: 22px; align-items: start; }
  .exm-section-wide .exm-stage { grid-column: 1; grid-row: 1; width: 100%; max-width: none; }
  .exm-section-wide .exm-matrix { max-width: none; }
  .exm-section-wide .exm-tray { grid-column: 2; grid-row: 1; margin-top: 30px; align-content: flex-start; }
  .exm-section-wide .exm-panel { grid-column: 1 / -1; }
  .exm-section-wide .exm-actions { grid-column: 1 / -1; }
  @media (max-width: 920px) {
    .exm-section-wide .exm-wrap { width: auto; left: 0; transform: none; display: block; }
    .exm-section-wide .exm-tray { margin-top: 28px; }
  }
  ` : ''}
  `;

  const root = `exm-${esc(b.exerciseId)}`;
  const js =
`(function(){
  var root=document.getElementById('${root}'); if(!root) return;
  var LIVE=${live ? 'true' : 'false'}, PREVIEW=${JSON.stringify(PREVIEW)};
  var matrix=root.querySelector('.exm-matrix'), tray=root.querySelector('.exm-tray');
  var guideV=root.querySelector('.exm-guide-v'), guideH=root.querySelector('.exm-guide-h');
  var panel=root.querySelector('.exm-panel'), panelH=root.querySelector('.exm-panel-h');
  var ta=root.querySelector('.exm-ta'), mic=root.querySelector('.exm-mic'), micNote=root.querySelector('.exm-mic-note');
  var saveBtn=root.querySelector('.exm-save'), statusEl=root.querySelector('.exm-status');
  var P={}, active=null, drag=null, ox=0, oy=0, moved=false;
  var EDIT=${b.editable ? 'true' : 'false'}, NOTE=${JSON.stringify(u.note)}, PH=${JSON.stringify(u.newStickerPlaceholder)}, addN=0;
  function coords(card){
    var mr=matrix.getBoundingClientRect(), cr=card.getBoundingClientRect();
    var sx=Math.max(0,Math.min(1,(cr.left+cr.width/2-mr.left)/mr.width));
    var sy=Math.max(0,Math.min(1,(cr.top+cr.height/2-mr.top)/mr.height));
    return {sx:sx, sy:sy, imp:Math.round(sx*9)+1, sat:Math.round((1-sy)*9)+1};
  }
  function setVal(card,imp,sat){ var v=card.querySelector('.exm-val'); if(v){ v.textContent=${JSON.stringify(u.valFormat)}.replace('{imp}',imp).replace('{sat}',sat); } }
  function record(card,c){ var id=card.getAttribute('data-id'); P[id]=P[id]||{label:card.getAttribute('data-label')};
    P[id].importance=c.imp; P[id].satisfaction=c.sat; setVal(card,c.imp,c.sat); }
  function place(card){ record(card,coords(card)); status(); }
  function status(){ var n=Object.keys(P).length, t=root.querySelectorAll('.exm-card').length; statusEl.textContent=${JSON.stringify(u.placed)}.replace('{n}',n).replace('{t}',t); saveBtn.disabled=!LIVE||n===0; if(!LIVE&&n>0){ statusEl.textContent=PREVIEW; } persist(); }
  function persist(){ try{ localStorage.setItem('builder:${slug}:jtbd', JSON.stringify(Object.keys(P).map(function(id){ return {id:id,label:P[id].label,importance:P[id].importance,satisfaction:P[id].satisfaction}; }))); window.dispatchEvent(new CustomEvent('builder:jtbd-changed')); }catch(_){} }
  var __seed__=${JSON.stringify(serverSeed || [])};
  function restore(){ try{
    var local=JSON.parse(localStorage.getItem('builder:${slug}:jtbd')||'[]');
    var saved=local.length?local:__seed__;
    if(!saved.length) return;
    var mr=matrix.getBoundingClientRect(); if(mr.width===0) return;
    saved.forEach(function(item){
      var card=tray.querySelector('.exm-card[data-id="'+item.id+'"]');
      if(!card||card.classList.contains('placed')) return;
      var sx=(item.importance-1)/9, sy=1-(item.satisfaction-1)/9;
      card.classList.add('placed'); matrix.appendChild(card);
      var cw=card.offsetWidth||136, ch=card.offsetHeight||60;
      card.style.left=Math.max(0,sx*mr.width-cw/2)+'px';
      card.style.top=Math.max(0,sy*mr.height-ch/2)+'px';
      P[item.id]=P[item.id]||{label:item.label||card.getAttribute('data-label')};
      P[item.id].importance=item.importance; P[item.id].satisfaction=item.satisfaction;
      setVal(card,item.importance,item.satisfaction);
    });
    status();
  }catch(_){} }
  function down(e){ var card=e.target.closest('.exm-card'); if(!card) return;
    if(card.classList.contains('editing')) return;
    if(e.target.closest('.exm-note-btn')){ openNote(card); return; }
    drag=card; moved=false; card.setPointerCapture(e.pointerId);
    var r=card.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; card.style.cursor='grabbing'; }
  function move(e){ if(!drag) return; moved=true;
    if(!drag.classList.contains('placed')){ drag.classList.add('placed'); matrix.appendChild(drag); }
    var mr=matrix.getBoundingClientRect();
    drag.style.left=(e.clientX-mr.left-ox)+'px'; drag.style.top=(e.clientY-mr.top-oy)+'px';
    var c=coords(drag);
    guideV.style.left=(c.sx*100)+'%'; guideH.style.top=(c.sy*100)+'%';
    guideV.classList.add('on'); guideH.classList.add('on');
    record(drag,c); }
  function up(){ if(!drag) return; if(drag.classList.contains('placed')){ place(drag); }
    guideV.classList.remove('on'); guideH.classList.remove('on'); drag.style.cursor='grab'; drag=null; }
  function openNote(card){ active=card.getAttribute('data-id'); P[active]=P[active]||{label:card.getAttribute('data-label')};
    panelH.textContent=${JSON.stringify(u.whyRating)}+card.getAttribute('data-label'); ta.value=P[active].comment||'';
    micNote.textContent=P[active].audio?${JSON.stringify(u.voiceSaved)}:''; panel.classList.add('open'); ta.focus();
    panel.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  ta && ta.addEventListener('input',function(){ if(active){ P[active].comment=ta.value; mark(active); } });
  function mark(id){ var c=matrix.querySelector('.exm-card[data-id="'+id+'"]'); if(c){ var has=(P[id].comment&&P[id].comment.trim())||P[id].audio; c.classList.toggle('has-note',!!has); } }
  matrix.addEventListener('pointerdown',down); tray.addEventListener('pointerdown',down);
  document.addEventListener('pointermove',move); document.addEventListener('pointerup',up);
  var mr_=null, chunks=[];
  mic && mic.addEventListener('click',function(){
    if(!active) return;
    if(mr_&&mr_.state==='recording'){ mr_.stop(); return; }
    if(!navigator.mediaDevices||!window.MediaRecorder){ micNote.textContent='voice not supported here'; return; }
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){
      chunks=[]; mr_=new MediaRecorder(s); mic.classList.add('rec'); mic.textContent=${JSON.stringify(u.stop)};
      mr_.ondataavailable=function(ev){ chunks.push(ev.data); };
      mr_.onstop=function(){ s.getTracks().forEach(function(t){t.stop();}); mic.classList.remove('rec'); mic.textContent=${JSON.stringify(u.record)};
        var blob=new Blob(chunks,{type:'audio/webm'}); var fr=new FileReader();
        fr.onload=function(){ if(active){ P[active].audio=fr.result; micNote.textContent=${JSON.stringify(u.voiceSaved)}; mark(active); } }; fr.readAsDataURL(blob); };
      mr_.start();
    }).catch(function(){ micNote.textContent='mic blocked'; });
  });
  saveBtn.addEventListener('click',function(){
    if(!LIVE){ statusEl.textContent=PREVIEW; saveBtn.disabled=true; return; }
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var items=Object.keys(P).map(function(id){ return {id:id,label:P[id].label,importance:P[id].importance,satisfaction:P[id].satisfaction,comment:P[id].comment||'',hasAudio:!!P[id].audio,audio:P[id].audio||null}; });
    fetch('/api/builder/exercise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:'${slug}',exercise:'${esc(b.exerciseId)}',payload:{placements:items}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.saveFail)}; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent=${JSON.stringify(u.saveFailNet)}; saveBtn.disabled=false; });
  });
  function enterEdit(card){ if(!EDIT) return; var lbl=card.querySelector('.exm-card-label'); if(!lbl) return;
    card.classList.add('editing'); lbl.setAttribute('contenteditable','true'); lbl.focus();
    try{ var r=document.createRange(); r.selectNodeContents(lbl); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }catch(_){}
  }
  function exitEdit(card){ var lbl=card.querySelector('.exm-card-label'); if(!lbl) return;
    lbl.removeAttribute('contenteditable'); card.classList.remove('editing');
    var txt=(lbl.textContent||'').replace(/\\s+/g,' ').trim(); lbl.textContent=txt; card.setAttribute('data-label',txt);
    var id=card.getAttribute('data-id'); if(P[id]){ P[id].label=txt; } persist();
  }
  if(EDIT){
    root.addEventListener('dblclick',function(e){ var c=e.target.closest('.exm-card'); if(c) enterEdit(c); });
    root.addEventListener('keydown',function(e){ if(e.target.classList&&e.target.classList.contains('exm-card-label')&&e.key==='Enter'){ e.preventDefault(); e.target.blur(); } });
    root.addEventListener('blur',function(e){ if(e.target.classList&&e.target.classList.contains('exm-card-label')){ var c=e.target.closest('.exm-card'); if(c) exitEdit(c); } }, true);
    var addBtn=root.querySelector('.exm-add-sticker');
    addBtn&&addBtn.addEventListener('click',function(){ addN++; var id='custom-'+addN+'-'+Date.now();
      var card=document.createElement('div'); card.className='exm-card'; card.setAttribute('data-id',id); card.setAttribute('data-label','');
      var lbl=document.createElement('span'); lbl.className='exm-card-label'; lbl.setAttribute('data-ph',PH); card.appendChild(lbl);
      var foot=document.createElement('div'); foot.className='exm-card-foot';
      foot.innerHTML='<span class="exm-val" aria-hidden="true"></span><button class="exm-note-btn" type="button" title="'+NOTE+'" aria-label="'+NOTE+'">'+NOTE+'</button>';
      card.appendChild(foot); tray.insertBefore(card, addBtn); status(); enterEdit(card);
    });
  }
  status(); requestAnimationFrame(restore);
})();`;

  return `<section id="${root}"${b.wide ? ' class="exm-section-wide"' : ''}>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exm-intro">${esc(b.intro)}</p>` : ''}
  <style>${css}</style>
  <div class="exm-wrap">
    <div class="exm-stage">
      <div class="exm-yaxis"><span class="ttl">${esc(ay.label)}</span><div class="exm-ynums">${ynums}</div></div>
      <div class="exm-matrix">
        ${b.hideUnderservedZone ? '' : `<div class="exm-hot"><span>${esc(u.underserved)}</span></div>`}
        <div class="exm-guide exm-guide-v"></div>
        <div class="exm-guide exm-guide-h"></div>
      </div>
      <div class="exm-xaxis"><div class="exm-xnums">${xnums}</div><span class="ttl">${esc(ax.label)}</span></div>
    </div>
    <div class="exm-tray">
      <div class="exm-tray-label">${esc(u.dragHint)}</div>
      ${cards}
      ${b.editable ? `<button type="button" class="exm-add-sticker">${esc(u.addSticker)}</button>` : ''}
    </div>
    <div class="exm-panel">
      <div class="exm-panel-h"></div>
      <textarea class="exm-ta" placeholder="${esc(u.notePlaceholder)}"></textarea>
      <div class="exm-panel-row"><button type="button" class="exm-mic">${esc(u.record)}</button><span class="exm-mic-note"></span></div>
    </div>
    <div class="exm-actions"><button type="button" class="exm-save" disabled>${esc(u.save)}</button><span class="exm-status"></span></div>
  </div>
  <script>${js}</script>
</section>`;
}

/* ======================= RANK ======================= */
export function exerciseRank(b: any, slug: string, live = false): string {
  const root = `exr-${esc(b.exerciseId)}`;
  const u = {
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', saveRanking: 'Save ranking',
    addProblem: '＋ Add problem', newProblemPlaceholder: 'Your problem…',
    ...(b.ui || {}),
  };
  const fallbackJobs = (b.groups || []).slice(0, 3).map((g: any) => g.jobId);
  const groups = (b.groups || []).map((g: any) => `<div class="exr-group">
      <div class="exr-job">${esc(g.jobLabel)}</div>
      <ol class="exr-list" data-job="${esc(g.jobId)}">
        ${(g.problems || []).slice(0, 5).map((p: any) => `<li class="exr-row" data-id="${esc(p.id)}"><span class="exr-rank"></span><span class="exr-label">${esc(p.label)}</span><span class="exr-handle" aria-hidden="true">⠿</span></li>`).join('\n        ')}
      </ol>
      ${b.editable ? `<button type="button" class="exr-add">${esc(u.addProblem)}</button>` : ''}
    </div>`).join('\n    ');
  const css = `
  .exr { margin-top: 18px; max-width: 580px; }
  .exr-intro { font-family: var(--text); font-size: var(--fs-secondary); color: var(--ink-55); line-height: 1.6; margin-bottom: 24px; }
  .exr-group { margin-bottom: 26px; }
  .exr-job { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-55); margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--rule); }
  .exr-list { list-style: none; display: flex; flex-direction: column; gap: 6px; padding: 0; margin: 0; }
  .exr-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; background: var(--surface); border: 1px solid var(--rule); cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; transition: box-shadow .15s ease, transform .1s ease, opacity .1s ease; }
  .exr-row.dragging { opacity: .88; box-shadow: 0 10px 24px rgba(1,28,0,.22); cursor: grabbing; transform: scale(1.015); }
  .exr-rank { font-family: var(--mono); font-size: 12px; color: var(--ink-40); min-width: 16px; text-align: right; }
  .exr-label { font-family: var(--text); font-size: var(--fs-small); color: var(--ink); flex: 1; }
  .exr-handle { color: var(--ink-25); font-size: 13px; letter-spacing: -2px; }
  .exr-label[contenteditable="true"] { outline: none; cursor: text; user-select: text; -webkit-user-select: text; }
  .exr-row.editing { cursor: default; user-select: text; -webkit-user-select: text; box-shadow: 0 0 0 2px var(--ink); }
  .exr-label:empty::before { content: attr(data-ph); color: var(--ink-40); font-style: italic; }
  .exr-add { margin-top: 6px; background: transparent; border: 1px dashed var(--rule-strong); border-radius: 6px; padding: 8px 12px; font-family: var(--text); font-size: var(--fs-small); color: var(--ink-55); cursor: pointer; transition: border-color .12s, color .12s; }
  .exr-add:hover { border-color: var(--ink); color: var(--ink); }
  .exr-actions { display: flex; align-items: center; gap: 14px; margin-top: 8px; }
  .exr-save { background: var(--ink); color: var(--paper); border: none; border-radius: 7px; padding: 12px 22px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .exr-save:disabled { opacity: .4; cursor: default; }
  .exr-status { font-family: var(--mono); font-size: 11px; color: var(--ink-40); }`;
  const js =
`(function(){
  var root=document.getElementById('${root}'); if(!root) return;
  var LIVE=${live ? 'true' : 'false'}, PREVIEW=${JSON.stringify(PREVIEW)};
  var saveBtn=root.querySelector('.exr-save'), statusEl=root.querySelector('.exr-status');
  var drag=null, dragList=null, dragPH=null, dragOffY=0, dragOrigStyle='';
  var EDIT=${b.editable ? 'true' : 'false'}, PH=${JSON.stringify(u.newProblemPlaceholder)};
  function rowsIn(l){ return Array.prototype.slice.call(l.querySelectorAll('.exr-row:not(.exr-ph)')); }
  function lists(){ return Array.prototype.slice.call(root.querySelectorAll('.exr-list')); }
  function renum(l){ rowsIn(l).forEach(function(r,i){ r.querySelector('.exr-rank').textContent=(i+1); }); }
  function down(e){ var r=e.target.closest('.exr-row'); if(!r) return; if(r.classList.contains('editing')) return; e.preventDefault();
    drag=r; dragList=r.closest('.exr-list');
    var rect=r.getBoundingClientRect(); dragOffY=e.clientY-rect.top;
    dragPH=document.createElement('li'); dragPH.className='exr-ph'; dragPH.style.cssText='height:'+rect.height+'px;box-sizing:border-box;border:2px dashed var(--rule-strong);border-radius:6px;opacity:.5;';
    r.parentNode.insertBefore(dragPH,r);
    dragOrigStyle=r.style.cssText;
    r.classList.add('dragging'); r.style.cssText=dragOrigStyle+'position:fixed;left:'+rect.left+'px;top:'+rect.top+'px;width:'+rect.width+'px;z-index:9999;pointer-events:none;margin:0;';
    try{ r.setPointerCapture(e.pointerId); }catch(_){} }
  function move(e){ if(!drag||!dragList||!dragPH) return;
    drag.style.top=(e.clientY-dragOffY)+'px';
    var after=null, rs=rowsIn(dragList);
    for(var i=0;i<rs.length;i++){ if(rs[i]===drag) continue; var bb=rs[i].getBoundingClientRect(); if(e.clientY<bb.top+bb.height/2){ after=rs[i]; break; } }
    if(after){ dragList.insertBefore(dragPH,after); } else { dragList.appendChild(dragPH); }
  }
  function up(){ if(!drag||!dragPH) return;
    drag.style.cssText=dragOrigStyle; dragOrigStyle='';
    dragList.insertBefore(drag,dragPH); dragPH.remove(); dragPH=null;
    drag.classList.remove('dragging'); renum(dragList); drag=null; dragList=null; if(LIVE) saveBtn.disabled=false; }
  root.addEventListener('pointerdown',down); document.addEventListener('pointermove',move); document.addEventListener('pointerup',up);
  function topJobs(){ try{ var d=JSON.parse(localStorage.getItem('builder:${slug}:jtbd')||'[]'); if(d.length){ d.sort(function(a,b){ return (b.importance+(11-b.satisfaction))-(a.importance+(11-a.satisfaction)); }); return d.slice(0,3).map(function(x){ return x.id; }); } }catch(_){} return ${JSON.stringify(fallbackJobs)}; }
  function applyTop(){ var keep=topJobs(); Array.prototype.slice.call(root.querySelectorAll('.exr-group')).forEach(function(g){ var l=g.querySelector('.exr-list'); g.style.display = (l && keep.indexOf(l.getAttribute('data-job'))>=0) ? '' : 'none'; }); }
  saveBtn.addEventListener('click',function(){
    if(!LIVE){ statusEl.textContent=PREVIEW; saveBtn.disabled=true; return; }
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var rankings=lists().filter(function(l){ return l.closest('.exr-group').style.display!=='none'; }).map(function(l){ return {job:l.getAttribute('data-job'), order:rowsIn(l).map(function(r,i){ return {id:r.getAttribute('data-id'), label:(r.querySelector('.exr-label').textContent||'').trim(), rank:i+1}; })}; });
    fetch('/api/builder/exercise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:'${slug}',exercise:'${esc(b.exerciseId)}',payload:{rankings:rankings}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.saveFail)}; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent=${JSON.stringify(u.saveFailNet)}; saveBtn.disabled=false; });
  });
  function enterEditR(row){ if(!EDIT) return; var lbl=row.querySelector('.exr-label'); if(!lbl) return;
    row.classList.add('editing'); lbl.setAttribute('contenteditable','true'); lbl.focus();
    try{ var rg=document.createRange(); rg.selectNodeContents(lbl); var s=window.getSelection(); s.removeAllRanges(); s.addRange(rg); }catch(_){}
  }
  function exitEditR(row){ var lbl=row.querySelector('.exr-label'); if(!lbl) return;
    lbl.removeAttribute('contenteditable'); row.classList.remove('editing');
    lbl.textContent=(lbl.textContent||'').replace(/\\s+/g,' ').trim(); if(LIVE) saveBtn.disabled=false;
  }
  if(EDIT){
    root.addEventListener('dblclick',function(e){ var r=e.target.closest('.exr-row'); if(r) enterEditR(r); });
    root.addEventListener('keydown',function(e){ if(e.target.classList&&e.target.classList.contains('exr-label')&&e.key==='Enter'){ e.preventDefault(); e.target.blur(); } });
    root.addEventListener('blur',function(e){ if(e.target.classList&&e.target.classList.contains('exr-label')){ var r=e.target.closest('.exr-row'); if(r) exitEditR(r); } }, true);
    root.addEventListener('click',function(e){ var ab=e.target.closest('.exr-add'); if(!ab) return;
      var list=ab.closest('.exr-group').querySelector('.exr-list');
      var li=document.createElement('li'); li.className='exr-row'; li.setAttribute('data-id','custom-'+Date.now());
      li.innerHTML='<span class="exr-rank"></span><span class="exr-label" data-ph="'+PH+'"></span><span class="exr-handle" aria-hidden="true">⠿</span>';
      list.appendChild(li); renum(list); if(LIVE) saveBtn.disabled=false; enterEditR(li);
    });
  }
  lists().forEach(renum); applyTop();
  window.addEventListener('builder:jtbd-changed', applyTop);
  if(!LIVE) statusEl.textContent=PREVIEW;
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exr-intro">${esc(b.intro)}</p>` : ''}
  <style>${css}</style>
  <div class="exr">
    ${groups}
  </div>
  <div class="exr-actions">
    <button class="exr-save" type="button">${esc(u.saveRanking)}</button>
    <span class="exr-status"></span>
  </div>
  <script>${js}</script>
</section>`;
}

/* ======================= CHIPS ======================= */
export function exerciseChips(b: any, slug: string, live = false): string {
  const root = `exc-${esc(b.exerciseId)}`;
  const u = {
    egPrefix: ' — e.g. ', addPlaceholder: 'Add your own…', addBtn: 'Add',
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', save: 'Save',
    ...(b.ui || {}),
  };
  const qs = (b.questions || []).map((q: any) => `<div class="exc-q" data-q="${esc(q.id)}"${q.singleSelect ? ' data-single="1"' : ''}>
      <div class="exc-q-h">${esc(q.q)}${q.example ? `<span class="exc-q-ex">${esc(u.egPrefix)}${esc(q.example)}</span>` : ''}</div>
      <div class="exc-chips">
        ${(q.options || []).map((o: any) => `<button type="button" class="exc-chip">${esc(o)}</button>`).join('\n        ')}
      </div>
      <div class="exc-add"><input class="exc-inp" type="text" placeholder="${esc(u.addPlaceholder)}" /><button class="exc-add-btn" type="button">${esc(u.addBtn)}</button></div>
    </div>`).join('\n    ');
  const css = `
  .exc { margin-top: 18px; max-width: 620px; }
  .exc-intro { font-family: var(--text); font-size: var(--fs-secondary); color: var(--ink-55); line-height: 1.6; margin-bottom: 24px; }
  .exc-q { margin-bottom: 24px; }
  .exc-q-h { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-55); margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--rule); }
  .exc-q-ex { color: var(--ink-40); text-transform: none; letter-spacing: 0; }
  .exc-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .exc-chip { font-family: var(--text); font-size: 14px; padding: 8px 14px; background: var(--surface); border: 1px solid var(--rule-strong); color: var(--ink); cursor: pointer; transition: background .12s, color .12s, border-color .12s; }
  .exc-chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .exc-add { display: flex; gap: 8px; margin-top: 10px; }
  .exc-add input { flex: 1; max-width: 320px; border: 1px solid var(--rule-strong); border-radius: 6px; padding: 8px 11px; font-family: var(--text); font-size: 14px; background: var(--surface); color: var(--ink); outline: none; }
  .exc-add button { background: none; border: 1px solid var(--rule-strong); border-radius: 6px; padding: 8px 12px; font-family: var(--mono); font-size: 10px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink-55); cursor: pointer; }
  .exc-actions { display: flex; align-items: center; gap: 14px; margin-top: 8px; }
  .exc-save { background: var(--ink); color: var(--paper); border: none; border-radius: 7px; padding: 12px 22px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .exc-save:disabled { opacity: .4; cursor: default; }
  .exc-status { font-family: var(--mono); font-size: 11px; color: var(--ink-40); }`;
  const js =
`(function(){
  var root=document.getElementById('${root}'); if(!root) return;
  var LIVE=${live ? 'true' : 'false'}, PREVIEW=${JSON.stringify(PREVIEW)};
  var saveBtn=root.querySelector('.exc-save'), statusEl=root.querySelector('.exc-status');
  function touch(){ if(LIVE) saveBtn.disabled=false; }
  root.addEventListener('click',function(e){
    var c=e.target.closest('.exc-chip'); if(c){ var cq=c.closest('.exc-q'); if(cq && cq.getAttribute('data-single')){ Array.prototype.slice.call(cq.querySelectorAll('.exc-chip')).forEach(function(ch){ ch.classList.remove('on'); }); c.classList.add('on'); } else { c.classList.toggle('on'); } touch(); return; }
    var add=e.target.closest('.exc-add-btn'); if(add){ var box=add.closest('.exc-add'); var inp=box.querySelector('.exc-inp'); var v=(inp.value||'').trim(); if(v){ var chips=add.closest('.exc-q').querySelector('.exc-chips'); var nb=document.createElement('button'); nb.type='button'; nb.className='exc-chip on'; nb.textContent=v; chips.appendChild(nb); inp.value=''; touch(); } }
  });
  root.addEventListener('keydown',function(e){ if(e.key==='Enter' && e.target.classList.contains('exc-inp')){ e.preventDefault(); e.target.parentNode.querySelector('.exc-add-btn').click(); } });
  saveBtn.addEventListener('click',function(){
    if(!LIVE){ statusEl.textContent=PREVIEW; saveBtn.disabled=true; return; }
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var cep=Array.prototype.slice.call(root.querySelectorAll('.exc-q')).map(function(q){
      return { q:q.getAttribute('data-q'), picks:Array.prototype.slice.call(q.querySelectorAll('.exc-chip.on')).map(function(c){ return c.textContent; }) };
    });
    fetch('/api/builder/exercise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:'${slug}',exercise:'${esc(b.exerciseId)}',payload:{cep:cep}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.saveFail)}; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent=${JSON.stringify(u.saveFailNet)}; saveBtn.disabled=false; });
  });
  if(!LIVE) statusEl.textContent=PREVIEW;
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exc-intro">${esc(b.intro)}</p>` : ''}
  <style>${css}</style>
  <div class="exc">
    ${qs}
    <div class="exc-actions">
      <button class="exc-save" type="button">${esc(u.save)}</button>
      <span class="exc-status"></span>
    </div>
  </div>
  <script>${js}</script>
</section>`;
}

/* ======================= SOLUTIONS ======================= */
export function exerciseSolutions(b: any, slug: string, live = false): string {
  const root = `exs-${esc(b.exerciseId)}`;
  const u = {
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', save: 'Save',
    notePlaceholder: 'What do you do about this today?',
    ...(b.ui || {}),
  };
  const fallbackJobs = (b.jobs || []).slice(0, 3).map((j: any) => j.id);
  const rows = (b.jobs || []).map((j: any) =>
    `<div class="exs-row" data-id="${esc(j.id)}">
      <div class="exs-label">${esc(j.label)}</div>
      <textarea class="exs-ta" rows="2" placeholder="${esc(j.placeholder || u.notePlaceholder)}"></textarea>
    </div>`
  ).join('\n      ');
  const css = `
  .exs { margin-top: 18px; max-width: 600px; }
  .exs-intro { font-family: var(--text); font-size: var(--fs-secondary); color: var(--ink-55); line-height: 1.6; margin-bottom: 20px; }
  .exs-row { margin-bottom: 18px; }
  .exs-label { font-family: var(--text); font-weight: 500; font-size: var(--fs-list-item); color: var(--ink); margin-bottom: 8px; }
  .exs-ta { display: block; width: 100%; box-sizing: border-box; border: 1px solid var(--rule-strong); border-radius: 6px; padding: 10px 12px; font-family: var(--text); font-size: 15px; line-height: 1.5; resize: vertical; background: var(--surface); color: var(--ink); outline: none; }
  .exs-actions { display: flex; align-items: center; gap: 14px; margin-top: 8px; }
  .exs-save { background: var(--ink); color: var(--paper); border: none; border-radius: 7px; padding: 12px 22px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .exs-save:disabled { opacity: .4; cursor: default; }
  .exs-status { font-family: var(--mono); font-size: 11px; color: var(--ink-40); }`;
  const js =
`(function(){
  var root=document.getElementById('${root}'); if(!root) return;
  var LIVE=${live ? 'true' : 'false'}, PREVIEW=${JSON.stringify(PREVIEW)};
  var saveBtn=root.querySelector('.exs-save'), statusEl=root.querySelector('.exs-status');
  root.addEventListener('input',function(e){ if(e.target.classList.contains('exs-ta')&&LIVE) saveBtn.disabled=false; });
  function topJobs(){ try{ var d=JSON.parse(localStorage.getItem('builder:${slug}:jtbd')||'[]'); if(d.length){ d.sort(function(a,b){ return (b.importance+(11-b.satisfaction))-(a.importance+(11-a.satisfaction)); }); return d.slice(0,3).map(function(x){ return x.id; }); } }catch(_){} return ${JSON.stringify(fallbackJobs)}; }
  function applyTop(){ var keep=topJobs(); Array.prototype.slice.call(root.querySelectorAll('.exs-row')).forEach(function(r){ r.style.display = keep.indexOf(r.getAttribute('data-id'))>=0 ? '' : 'none'; }); }
  applyTop(); window.addEventListener('builder:jtbd-changed', applyTop);
  saveBtn.addEventListener('click',function(){
    if(!LIVE){ statusEl.textContent=PREVIEW; saveBtn.disabled=true; return; }
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var ans=Array.prototype.slice.call(root.querySelectorAll('.exs-row')).filter(function(r){ return r.style.display!=='none'; }).map(function(r){ return {id:r.getAttribute('data-id'), text:(r.querySelector('.exs-ta').value||'').trim()}; });
    fetch('/api/builder/exercise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:'${slug}',exercise:'${esc(b.exerciseId)}',payload:{solutions:ans}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.saveFail)}; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent=${JSON.stringify(u.saveFailNet)}; saveBtn.disabled=false; });
  });
  if(!LIVE) statusEl.textContent=PREVIEW;
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exs-intro">${esc(b.intro)}</p>` : ''}
  <style>${css}</style>
  <div class="exs">
      ${rows}
    <div class="exs-actions">
      <button class="exs-save" type="button">${esc(u.save)}</button>
      <span class="exs-status"></span>
    </div>
  </div>
  <script>${js}</script>
</section>`;
}

/* ======================= DISCUSSION + LOCK ======================= */
export function discussion(b: any, slug: string, savedLock?: any[], live = false): string {
  const u = {
    questionPlaceholder: "Type a question you’d like to cover…", addQuestion: 'Add question',
    saved: "✓ Saved — it’ll appear in “Your notes” above", savedLocal: 'Saved on this device',
    lockBtnLabel: 'Lock it in', lockedBadge: 'Locked', locking: 'Locking…', lockFail: 'Save failed — try again',
    lockFormLabel: 'Record the decision', lockAnswerPlaceholder: 'Your answer…',
    ...(b.ui || {}),
  };
  const items = (b.questions || []).map((q: any) => `<li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">${esc(q.q)}</span>
        ${q.note ? `<span class="check-note">${esc(q.note)}</span>` : ''}
      </div>
    </li>`).join('\n    ');
  const css = `
  .cq-add { margin-top: 26px; border-top: 1px solid var(--on-dark-border); padding-top: 20px; }
  .cq-add-label { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--on-dark-muted); margin-bottom: 10px; }
  .cq-ta { display: block; width: 100%; box-sizing: border-box; background: transparent; border: 1px solid var(--on-dark-border); border-radius: 6px; padding: 10px 12px; font-family: var(--text); font-size: var(--fs-small); line-height: 1.5; color: var(--on-dark-primary); resize: vertical; min-height: 52px; outline: none; }
  .cq-ta::placeholder { color: var(--on-dark-muted); }
  .cq-ta:focus { border-color: var(--on-dark-primary); }
  .cq-row { display: flex; align-items: center; gap: 14px; margin-top: 10px; }
  .cq-btn { background: var(--on-dark-primary); color: var(--ink); border: none; border-radius: 7px; padding: 10px 20px; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .cq-btn:disabled { opacity: .4; cursor: default; }
  .cq-status { font-family: var(--mono); font-size: 11px; color: var(--on-dark-muted); }
  .dl-form { margin-top: 26px; border-top: 1px solid var(--on-dark-border); padding-top: 22px; }
  .dl-form-label { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--on-dark-muted); margin-bottom: 18px; }
  .dl-q-row { margin-bottom: 18px; }
  .dl-q-label { font-family: var(--text); font-size: var(--fs-small); line-height: 1.45; color: var(--on-dark-primary); margin-bottom: 8px; }
  .dl-ta { display: block; width: 100%; box-sizing: border-box; background: transparent; border: 1px solid var(--on-dark-border); border-radius: 6px; padding: 10px 12px; font-family: var(--text); font-size: var(--fs-small); line-height: 1.5; color: var(--on-dark-primary); resize: vertical; min-height: 52px; outline: none; }
  .dl-ta::placeholder { color: var(--on-dark-muted); }
  .dl-ta:focus { border-color: var(--on-dark-primary); }
  .dl-footer { display: flex; align-items: center; gap: 14px; margin-top: 18px; }
  .dl-btn { background: var(--on-dark-primary); color: var(--ink); border: none; border-radius: 7px; padding: 10px 22px; font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .dl-btn:disabled { opacity: .4; cursor: default; }
  .dl-st { font-family: var(--mono); font-size: 11px; color: var(--on-dark-muted); }
  .dl-locked { margin-top: 26px; border-top: 1px solid var(--on-dark-border); padding-top: 22px; }
  .dl-lock-badge { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--accent, #4ade80); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .dl-lock-badge::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent, #4ade80); }
  .dl-answer-card { border: 1px solid var(--on-dark-border); border-radius: 8px; padding: 16px 18px; margin-bottom: 12px; }
  .dl-aq { font-family: var(--mono); font-size: 10px; letter-spacing: .07em; text-transform: uppercase; color: var(--on-dark-muted); margin-bottom: 8px; }
  .dl-aa { font-family: var(--text); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--on-dark-primary); white-space: pre-wrap; }
  `;

  if (savedLock && savedLock.length > 0) {
    const lockedCards = savedLock.map(({ q, a }: any) =>
      `<div class="dl-answer-card"><div class="dl-aq">${esc(q)}</div><div class="dl-aa">${esc(a)}</div></div>`,
    ).join('');
    return `<div class="check-section">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${esc(b.intro)}</p>` : ''}
  <style>${css}</style>
  <ul class="check-list">
    ${items}
  </ul>
  <div class="dl-locked">
    <div class="dl-lock-badge">${esc(u.lockedBadge)}</div>
    ${lockedCards}
  </div>
</div>`;
  }

  const lockFormId = `dlf-${esc(slug)}`;
  const lockResultId = `dll-${esc(slug)}`;
  const qTexts = JSON.stringify((b.questions || []).map((q: any) => String(q.q)));

  const lockForm = `<div class="dl-form" id="${lockFormId}">
    <div class="dl-form-label">${esc(u.lockFormLabel)}</div>
    ${(b.questions || []).map((q: any, i: number) => `<div class="dl-q-row">
      <div class="dl-q-label">${esc(q.q)}</div>
      <textarea class="dl-ta" data-idx="${i}" placeholder="${esc(u.lockAnswerPlaceholder)}" rows="2"></textarea>
    </div>`).join('\n    ')}
    <div class="dl-footer">
      <button type="button" class="dl-btn">${esc(u.lockBtnLabel)}</button>
      <span class="dl-st"></span>
    </div>
  </div>
  <div class="dl-locked" id="${lockResultId}" style="display:none"></div>`;

  const lockJs =
`(function(){
  var form=document.getElementById(${JSON.stringify(lockFormId)});
  var res=document.getElementById(${JSON.stringify(lockResultId)});
  if(!form||!res) return;
  var LIVE=${live ? 'true' : 'false'}, PREVIEW=${JSON.stringify(PREVIEW)};
  var btn=form.querySelector('.dl-btn'), st=form.querySelector('.dl-st');
  var qs=${qTexts};
  function collect(){
    return Array.from(form.querySelectorAll('.dl-ta')).map(function(el,i){
      return {q:qs[i]||'', a:el.value.trim()};
    });
  }
  function renderLocked(answers){
    var badge=document.createElement('div'); badge.className='dl-lock-badge';
    badge.textContent=${JSON.stringify(u.lockedBadge)}; res.appendChild(badge);
    answers.forEach(function(a){
      var card=document.createElement('div'); card.className='dl-answer-card';
      var qEl=document.createElement('div'); qEl.className='dl-aq'; qEl.textContent=a.q;
      var aEl=document.createElement('div'); aEl.className='dl-aa'; aEl.textContent=a.a;
      card.appendChild(qEl); card.appendChild(aEl); res.appendChild(card);
    });
    form.style.display='none'; res.style.display='';
  }
  btn.addEventListener('click',function(){
    var answers=collect();
    if(answers.every(function(a){return a.a.length===0;})) return;
    if(!LIVE){ st.textContent=PREVIEW; return; }
    btn.disabled=true; st.textContent=${JSON.stringify(u.locking)};
    fetch('/api/builder/exercise',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({slug:'${slug}',exercise:'discussion-lock',payload:{answers:answers}})})
      .then(function(r){return r.json();})
      .then(function(j){
        if(j.ok){ renderLocked(answers); }
        else{ st.textContent=${JSON.stringify(u.lockFail)}; btn.disabled=false; }
      })
      .catch(function(){ st.textContent=${JSON.stringify(u.lockFail)}; btn.disabled=false; });
  });
})();`;

  const cqJs =
`(function(){
  var root=document.getElementById('cq-${esc(slug)}'); if(!root) return;
  var LIVE=${live ? 'true' : 'false'}, PREVIEW=${JSON.stringify(PREVIEW)};
  var ta=root.querySelector('.cq-ta'), btn=root.querySelector('.cq-btn'), st=root.querySelector('.cq-status');
  var KEY='builder:${slug}:questions';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(_){ return []; } }
  function save(a){ try{ localStorage.setItem(KEY, JSON.stringify(a)); }catch(_){} }
  function update(){ btn.disabled = ta.value.trim().length===0; }
  ta.addEventListener('input',update); update();
  function add(){ var t=ta.value.trim(); if(!t) return;
    var a=load(); a.push(t); save(a); ta.value=''; update();
    if(!LIVE){ st.textContent=PREVIEW; return; }
    st.textContent='Saving…';
    fetch('/api/builder/exercise',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:'${slug}',exercise:'client-questions',payload:{questions:a}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ st.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.savedLocal)}; })
      .catch(function(){ st.textContent=${JSON.stringify(u.savedLocal)}; });
  }
  btn.addEventListener('click',add);
  ta.addEventListener('keydown',function(e){ if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){ e.preventDefault(); add(); } });
})();`;

  return `<div class="check-section" id="cq-${esc(slug)}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${esc(b.intro)}</p>` : ''}
  <style>${css}</style>
  <ul class="check-list">
    ${items}
  </ul>
  ${lockForm}
  <div class="cq-add">
    <div class="cq-add-label">${esc(b.addLabel ?? 'Add your own question')}</div>
    <textarea class="cq-ta" placeholder="${esc(u.questionPlaceholder)}" rows="2"></textarea>
    <div class="cq-row">
      <button type="button" class="cq-btn" disabled>${esc(u.addQuestion)}</button>
      <span class="cq-status"></span>
    </div>
  </div>
  <script>${lockJs}</script>
  <script>${cqJs}</script>
</div>`;
}

/* ======================= CLIENT NOTES (read-back) ======================= */
export function clientInput(b: any, slug: string, saved: string[] = []): string {
  const ns = `${slug}`.replace(/[^a-zA-Z0-9_]/g, '_');
  const listId = `ci-list-${ns}`;
  const empty = String(b.emptyNote ?? 'Nothing added yet — your notes from this page will appear here.');
  const css = `
  .ci-list { margin-top: 22px; display: flex; flex-direction: column; gap: 16px; }
  .ci-card { border: 1px solid var(--rule-strong); border-radius: 8px; padding: 18px 20px; background: var(--paper-soft, transparent); }
  .ci-num { font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-55); margin-bottom: 8px; display: block; }
  .ci-text { font-family: var(--text); font-weight: var(--w-body); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--ink); white-space: pre-wrap; }
  .ci-empty { font-family: var(--text); font-size: var(--fs-small); color: var(--ink-55); font-style: italic; margin-top: 18px; }
  `;
  const inner = saved.length
    ? saved.map((t, i) => `<div class="ci-card">
      <span class="ci-num">From you · ${String(i + 1).padStart(2, '0')}</span>
      <div class="ci-text">${esc(t)}</div>
    </div>`).join('\n    ')
    : `<p class="ci-empty">${esc(empty)}</p>`;
  const js =
`(function(){
  var box=document.getElementById('${listId}'); if(!box) return;
  function pad(n){return n<10?'0'+n:''+n;}
  function render(arr){
    box.innerHTML='';
    if(!arr.length){ var p=document.createElement('p'); p.className='ci-empty'; p.textContent=${JSON.stringify(empty)}; box.appendChild(p); return; }
    arr.forEach(function(t,i){
      var c=document.createElement('div'); c.className='ci-card';
      var n=document.createElement('span'); n.className='ci-num'; n.textContent='From you \\u00b7 '+pad(i+1);
      var x=document.createElement('div'); x.className='ci-text'; x.textContent=t;
      c.appendChild(n); c.appendChild(x); box.appendChild(c);
    });
  }
  var current=${saved.length};
  function poll(){
    fetch('/api/builder/exercise?slug=${encodeURIComponent(slug)}',{headers:{accept:'application/json'}})
      .then(function(r){return r.ok?r.json():null;})
      .then(function(j){ if(j&&j.questions&&j.questions.length!==current){ current=j.questions.length; render(j.questions); } })
      .catch(function(){});
  }
  setInterval(poll, 12000);
})();`;
  return `<section>
  <style>${css}</style>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${esc(b.intro)}</p>` : ''}
  <div class="ci-list" id="${listId}">
    ${inner}
  </div>
  <script>${js}</script>
</section>`;
}
