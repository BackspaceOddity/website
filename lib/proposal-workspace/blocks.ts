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
  EmphasisFrameBlock, NarrativeBlock, DemoBlock, ProcessFlowBlock, PhasesBlock,
  WhatStayedBlock, NextStepsBlock, DiscussionBlock, ClientInputBlock, BookingEmbedBlock, ExerciseMatrixBlock, ExerciseRankBlock,
  ExerciseChipsBlock, ExerciseSolutionsBlock, DocFooterBlock,
} from './types';
import type { LockAnswer } from './responses';

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

export function heardIt(b: HeardItBlock, slug?: string): string {
  const pills = b.pills?.length
    ? `<div class="pill-group">${b.pills.map(p => `<span class="pill">${esc(p)}</span>`).join('')}</div>`
    : '';
  if (!b.confirm || !slug) {
    return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.statement ? `<div class="statement">${b.statement}</div>` : ''}
  ${paras(b.body)}
  ${pills}
</section>`;
  }
  const c = b.confirm;
  const root = `hic-${esc(c.exerciseId)}`;
  const confirmLabel = c.confirmLabel || 'Confirm';
  const altLabel = c.altLabel || 'Different version';
  const editHint = c.editHint || 'Double-click any paragraph to edit, then Confirm.';
  const savedMsg = c.savedMsg || '✓ Locked';
  const css = `
  #${root} .hic-ed[contenteditable="true"]{outline:1px dashed var(--rule-strong);outline-offset:4px;border-radius:3px}
  #${root} .hic-actions{display:flex;align-items:center;gap:12px;margin-top:22px}
  #${root} .hic-confirm{background:var(--ink);color:var(--paper);border:none;border-radius:7px;padding:11px 20px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
  #${root} .hic-confirm:disabled{opacity:.4;cursor:default}
  #${root} .hic-alt{background:transparent;border:1px solid var(--rule-strong);border-radius:7px;padding:11px 20px;font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);cursor:pointer}
  #${root} .hic-status{font-family:var(--mono);font-size:11px;color:var(--ink-40)}
  #${root} .hic-hint{font-family:var(--mono);font-size:10px;color:var(--ink-40);margin-top:10px;display:none}
  #${root}.hic-editing .hic-hint{display:block}`;
  const js =
`(function(){
  var root=document.getElementById('${root}'); if(!root) return;
  var confirmBtn=root.querySelector('.hic-confirm'), altBtn=root.querySelector('.hic-alt'), statusEl=root.querySelector('.hic-status');
  function eds(){ return Array.prototype.slice.call(root.querySelectorAll('.hic-ed')); }
  root.addEventListener('dblclick',function(e){ var el=e.target.closest('.hic-ed'); if(!el) return; el.contentEditable='true'; el.focus(); });
  root.addEventListener('blur',function(e){ if(e.target.isContentEditable){ e.target.contentEditable='false'; } },true);
  altBtn.addEventListener('click',function(){
    root.classList.add('hic-editing');
    var first=eds()[0]; if(first){ first.contentEditable='true'; first.focus(); }
  });
  confirmBtn.addEventListener('click',function(){
    confirmBtn.disabled=true; statusEl.textContent='…';
    var st=root.querySelector('.statement'); var body=eds().filter(function(el){ return !el.classList.contains('statement'); }).map(function(el){ return el.textContent.trim(); });
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'${esc(c.exerciseId)}',payload:{confirmed:true,statement:st?st.textContent.trim():'',body:body}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(savedMsg)}:'!'; confirmBtn.disabled=!!j.ok; })
      .catch(function(){ statusEl.textContent='!'; confirmBtn.disabled=false; });
  });
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  <style>${css}</style>
  ${b.statement ? `<div class="statement hic-ed">${b.statement}</div>` : ''}
  ${b.body.map(p => `<p class="hic-ed">${p}</p>`).join('\n  ')}
  ${pills}
  <div class="hic-hint">${esc(editHint)}</div>
  <div class="hic-actions">
    <button class="hic-confirm">${esc(confirmLabel)}</button>
    <button class="hic-alt">${esc(altLabel)}</button>
    <span class="hic-status"></span>
  </div>
  <script>${js}</script>
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
  const list = b.bullets?.length
    ? `<${b.bulletStyle === 'number' ? 'ol' : 'ul'} class="ws-list">
    ${b.bullets.map(x => `<li>${x}</li>`).join('\n    ')}
  </${b.bulletStyle === 'number' ? 'ol' : 'ul'}>`
    : '';
  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${paras(b.body)}
  ${list}
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

export function processFlow(b: ProcessFlowBlock): string {
  const steps = b.steps.map((s, i) => {
    const branches = s.branches?.length
      ? `<div class="pf-branches">
        ${s.branches.map(br => `<div class="pf-branch${br.primary ? ' pf-primary' : ''}">
          <span class="pf-branch-label">${esc(br.label)}</span>
          <p>${br.body}</p>
        </div>`).join('\n        ')}
      </div>`
      : '';
    return `<div class="pf-step${branches ? ' pf-has-branches' : ''}">
      <div class="pf-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="pf-body">
        <div class="pf-title">${esc(s.title)}</div>
        <div class="pf-desc">${s.desc}</div>
        ${branches}
      </div>
    </div>`;
  }).join('\n    ');

  const css = `
  .pf { margin-top: 8px; }
  .pf-step { display: grid; grid-template-columns: 44px 1fr; gap: 16px; position: relative; }
  .pf-step:not(:last-child) { margin-bottom: 28px; }
  /* connector spine — runs from below each node into the next step's gap */
  .pf-step:not(:last-child)::before { content: ''; position: absolute; left: 21px; top: 44px; bottom: -28px; width: 1px; background: var(--rule-strong); }
  .pf-num { width: 44px; height: 44px; border: 1.5px solid var(--ink); display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 13px; color: var(--ink); background: var(--paper); position: relative; z-index: 1; }
  .pf-body { padding-top: 2px; min-width: 0; }
  .pf-title { font-family: var(--text); font-weight: 500; font-size: var(--fs-list-item); color: var(--ink); margin-bottom: 4px; }
  .pf-desc { font-family: var(--text); font-size: var(--fs-secondary); line-height: var(--lh-body); color: var(--ink-55); }
  .pf-branches { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 16px; }
  .pf-branch { padding: 16px 18px; background: var(--surface); border-left: 3px solid var(--rule); }
  .pf-branch.pf-primary { border-left-color: var(--ink); }
  .pf-branch-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-40); display: block; margin-bottom: 8px; }
  .pf-branch p { font-family: var(--text); font-size: var(--fs-secondary); line-height: var(--lh-body); color: var(--ink-55); }
  @media (max-width: 640px) { .pf-branches { grid-template-columns: 1fr; } }`;

  return `<section>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <style>${css}</style>
  <div class="pf">
    ${steps}
  </div>
</section>`;
}

export function phases(b: PhasesBlock): string {
  const cols = b.phases.map(p => `<div class="phx-col${p.emphasis ? ' phx-now' : ''}">
      <span class="phx-tag">${esc(p.tag)}</span>
      <div class="phx-title">${esc(p.title)}</div>
      <div class="phx-body">${p.body}</div>
    </div>`).join('\n    ');
  const css = `
  .phx { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 24px; }
  .phx-col { padding: 20px; background: var(--surface); }
  .phx-col.phx-now { background: var(--ink); }
  .phx-tag { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-40); margin-bottom: 10px; }
  .phx-col.phx-now .phx-tag { color: var(--on-dark-muted); }
  .phx-title { font-family: var(--text); font-weight: 500; font-size: var(--fs-list-item); color: var(--ink); margin-bottom: 6px; }
  .phx-col.phx-now .phx-title { color: var(--on-dark-primary); }
  .phx-body { font-family: var(--text); font-size: var(--fs-secondary); line-height: var(--lh-body); color: var(--ink-55); }
  .phx-col.phx-now .phx-body { color: var(--on-dark-secondary); }
  @media (max-width: 640px) { .phx { grid-template-columns: 1fr; } }`;
  return `<style>${css}</style>
<div class="phx">
    ${cols}
  </div>`;
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

export function discussion(b: DiscussionBlock, slug: string, savedLock?: LockAnswer[]): string {
  const u = {
    questionPlaceholder: "Type a question you’d like to cover…", addQuestion: 'Add question',
    saved: "✓ Saved — it’ll appear in “Your notes” above", savedLocal: 'Saved on this device',
    lockBtnLabel: 'Зафиксировать',
    lockedBadge: 'Зафиксировано',
    locking: 'Фиксируем…',
    lockFail: 'Ошибка — попробуйте ещё раз',
    ...(b.ui || {}),
  };

  const items = b.questions.map(q => `<li>
      <div class="check-box"></div>
      <div>
        <span class="check-question">${q.q}</span>
        ${q.note ? `<span class="check-note">${q.note}</span>` : ''}
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
    const lockedCards = savedLock.map(({ q, a }) =>
      `<div class="dl-answer-card"><div class="dl-aq">${esc(q)}</div><div class="dl-aa">${esc(a)}</div></div>`,
    ).join('');
    return `<div class="check-section">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
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
  const qTexts = JSON.stringify(b.questions.map(q => String(q.q)));

  const lockForm = `<div class="dl-form" id="${lockFormId}">
    <div class="dl-form-label">Записать решение</div>
    ${b.questions.map((q, i) => `<div class="dl-q-row">
      <div class="dl-q-label">${q.q}</div>
      <textarea class="dl-ta" data-idx="${i}" placeholder="Ваш ответ…" rows="2"></textarea>
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
    btn.disabled=true; st.textContent=${JSON.stringify(u.locking)};
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({exercise:'discussion-lock',payload:{answers:answers}})})
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
  var ta=root.querySelector('.cq-ta'), btn=root.querySelector('.cq-btn'), st=root.querySelector('.cq-status');
  var KEY='ws:${slug}:questions';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(_){ return []; } }
  function save(a){ try{ localStorage.setItem(KEY, JSON.stringify(a)); }catch(_){} }
  function update(){ btn.disabled = ta.value.trim().length===0; }
  ta.addEventListener('input',update); update();
  function add(){ var t=ta.value.trim(); if(!t) return;
    var a=load(); a.push(t); save(a); ta.value=''; update();
    st.textContent='Saving…';
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'client-questions',payload:{questions:a}})})
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
  ${b.intro ? `<p>${b.intro}</p>` : ''}
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

export function clientInput(b: ClientInputBlock, slug: string, saved: string[] = []): string {
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
  // Live poll: new submissions appear without a page reload (closes the
  // "added something, see nothing" gap — the cards re-render when the
  // server-side count changes). Client text set via textContent (safe).
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
    fetch('/w/${slug}/exercise/',{headers:{accept:'application/json'}})
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
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="ci-list" id="${listId}">
    ${inner}
  </div>
  <script>${js}</script>
</section>`;
}

export function bookingEmbed(b: BookingEmbedBlock, slug: string): string {
  const ns = `${slug}`.replace(/[^a-zA-Z0-9_]/g, '_');
  const elId = `cal-inline-${ns}`;
  const css = `
  .booking-embed { margin-top: 22px; min-height: 620px; width: 100%; overflow: scroll; border: 1px solid var(--rule-strong); border-radius: 10px; }
  `;
  // cal-brand follows the page palette: dark-green accent on the light theme,
  // cream on the dark theme. Mirrors --ink/--paper in styles.ts.
  const js =
`(function(C,A,L){let p=function(a,ar){a.q.push(ar);};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}if(ar[0]===L){const api=function(){p(api,arguments);};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace]);}else p(cal,ar);return;}p(cal,ar);};})(window,"https://app.cal.com/embed/embed.js","init");
Cal("init","${esc(ns)}",{origin:"https://app.cal.com"});
Cal.ns["${esc(ns)}"]("inline",{elementOrSelector:"#${esc(elId)}",config:{layout:"month_view",useSlotsViewOnSmallScreen:true},calLink:"${esc(b.calLink)}"});
Cal.ns["${esc(ns)}"]("ui",{cssVarsPerTheme:{light:{"cal-brand":"#011C00"},dark:{"cal-brand":"#F2F2F0"}},hideEventTypeDetails:false,layout:"month_view"});`;
  return `<section>
  <style>${css}</style>
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p>${b.intro}</p>` : ''}
  <div class="booking-embed" id="${esc(elId)}"></div>
  <script>${js}</script>
</section>`;
}

export function exerciseMatrix(b: ExerciseMatrixBlock, slug: string): string {
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
  const cards = b.jobs.map(j =>
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
  /* Underserved = high importance (right) + low satisfaction (bottom) */
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
  /* editorial wide: heading + intro stay in the normal centered column; only the
     canvas (.exm-wrap) breaks out past the 860px column. Matrix left + cards
     right; the note-panel and Save action span the full width BELOW the row. */
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
  var matrix=root.querySelector('.exm-matrix'), tray=root.querySelector('.exm-tray');
  var guideV=root.querySelector('.exm-guide-v'), guideH=root.querySelector('.exm-guide-h');
  var panel=root.querySelector('.exm-panel'), panelH=root.querySelector('.exm-panel-h');
  var ta=root.querySelector('.exm-ta'), mic=root.querySelector('.exm-mic'), micNote=root.querySelector('.exm-mic-note');
  var saveBtn=root.querySelector('.exm-save'), statusEl=root.querySelector('.exm-status');
  var P={}, active=null, drag=null, ox=0, oy=0, moved=false;
  var EDIT=${b.editable ? 'true' : 'false'}, NOTE=${JSON.stringify(u.note)}, PH=${JSON.stringify(u.newStickerPlaceholder)}, addN=0;
  /* X = importance (left→right), Y = satisfaction (top→bottom). 1–10 scale. */
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
  function status(){ var n=Object.keys(P).length, t=root.querySelectorAll('.exm-card').length; statusEl.textContent=${JSON.stringify(u.placed)}.replace('{n}',n).replace('{t}',t); saveBtn.disabled=n===0; persist(); }
  function persist(){ try{ localStorage.setItem('ws:${slug}:jtbd', JSON.stringify(Object.keys(P).map(function(id){ return {id:id,label:P[id].label,importance:P[id].importance,satisfaction:P[id].satisfaction}; }))); window.dispatchEvent(new CustomEvent('ws:jtbd-changed')); }catch(_){} }
  function restore(){ try{
    var saved=JSON.parse(localStorage.getItem('ws:${slug}:jtbd')||'[]');
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
  // voice — best-effort
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
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var items=Object.keys(P).map(function(id){ return {id:id,label:P[id].label,importance:P[id].importance,satisfaction:P[id].satisfaction,comment:P[id].comment||'',hasAudio:!!P[id].audio,audio:P[id].audio||null}; });
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'${esc(b.exerciseId)}',payload:{placements:items}})})
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
  ${b.intro ? `<p class="exm-intro">${b.intro}</p>` : ''}
  <style>${css}</style>
  <div class="exm-wrap">
    <div class="exm-stage">
      <div class="exm-yaxis">
        <span class="ttl">${esc(ay.label)}</span>
        <div class="exm-ynums">${ynums}</div>
      </div>
      <div class="exm-matrix">
        ${b.hideUnderservedZone ? '' : `<div class="exm-hot"><span>${esc(u.underserved)}</span></div>`}
        <div class="exm-guide exm-guide-v"></div>
        <div class="exm-guide exm-guide-h"></div>
      </div>
      <div class="exm-xaxis">
        <div class="exm-xnums">${xnums}</div>
        <span class="ttl">${esc(ax.label)}</span>
      </div>
    </div>
    <div class="exm-tray">
      <div class="exm-tray-label">${esc(u.dragHint)}</div>
      ${cards}
      ${b.editable ? `<button type="button" class="exm-add-sticker">${esc(u.addSticker)}</button>` : ''}
    </div>
    <div class="exm-panel">
      <div class="exm-panel-h"></div>
      <textarea class="exm-ta" placeholder="${esc(u.notePlaceholder)}"></textarea>
      <div class="exm-panel-row">
        <button type="button" class="exm-mic">${esc(u.record)}</button>
        <span class="exm-mic-note"></span>
      </div>
    </div>
    <div class="exm-actions">
      <button type="button" class="exm-save" disabled>${esc(u.save)}</button>
      <span class="exm-status"></span>
    </div>
  </div>
  <script>${js}</script>
</section>`;
}

export function exerciseRank(b: ExerciseRankBlock, slug: string): string {
  const root = `exr-${esc(b.exerciseId)}`;
  const u = {
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', saveRanking: 'Save ranking',
    addProblem: '＋ Add problem', newProblemPlaceholder: 'Your problem…',
    ...(b.ui || {}),
  };
  const fallbackJobs = b.groups.slice(0, 3).map(g => g.jobId);
  const groups = b.groups.map(g => `<div class="exr-group">
      <div class="exr-job">${esc(g.jobLabel)}</div>
      <ol class="exr-list" data-job="${esc(g.jobId)}">
        ${g.problems.slice(0, 5).map(p => `<li class="exr-row" data-id="${esc(p.id)}"><span class="exr-rank"></span><span class="exr-label">${esc(p.label)}</span><span class="exr-handle" aria-hidden="true">⠿</span></li>`).join('\n        ')}
      </ol>
      ${b.editable ? `<button type="button" class="exr-add">${esc(u.addProblem)}</button>` : ''}
    </div>`).join('\n    ');
  const css = `
  .exr { margin-top: 18px; max-width: 580px; }
  .exr-intro { font-family: var(--text); font-size: var(--fs-secondary); color: var(--ink-55); line-height: 1.6; margin-bottom: 24px; }
  .exr-group { margin-bottom: 26px; }
  .exr-job { font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-55); margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--rule); }
  .exr-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
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
  var saveBtn=root.querySelector('.exr-save'), statusEl=root.querySelector('.exr-status');
  var drag=null, dragList=null, dragGhost=null, dragPH=null, dragOffY=0, dragOrigStyle='';
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
    drag.classList.remove('dragging'); renum(dragList); drag=null; dragList=null; saveBtn.disabled=false; }
  root.addEventListener('pointerdown',down); document.addEventListener('pointermove',move); document.addEventListener('pointerup',up);
  // Phase A: show only the client's top-3 underserved jobs from Ex1 (fallback to a default triad).
  function topJobs(){ try{ var d=JSON.parse(localStorage.getItem('ws:${slug}:jtbd')||'[]'); if(d.length){ d.sort(function(a,b){ return (b.importance+(11-b.satisfaction))-(a.importance+(11-a.satisfaction)); }); return d.slice(0,3).map(function(x){ return x.id; }); } }catch(_){} return ${JSON.stringify(fallbackJobs)}; }
  function applyTop(){ var keep=topJobs(); Array.prototype.slice.call(root.querySelectorAll('.exr-group')).forEach(function(g){ var l=g.querySelector('.exr-list'); g.style.display = (l && keep.indexOf(l.getAttribute('data-job'))>=0) ? '' : 'none'; }); }
  saveBtn.addEventListener('click',function(){
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var rankings=lists().filter(function(l){ return l.closest('.exr-group').style.display!=='none'; }).map(function(l){ return {job:l.getAttribute('data-job'), order:rowsIn(l).map(function(r,i){ return {id:r.getAttribute('data-id'), label:(r.querySelector('.exr-label').textContent||'').trim(), rank:i+1}; })}; });
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'${esc(b.exerciseId)}',payload:{rankings:rankings}})})
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
    lbl.textContent=(lbl.textContent||'').replace(/\\s+/g,' ').trim(); saveBtn.disabled=false;
  }
  if(EDIT){
    root.addEventListener('dblclick',function(e){ var r=e.target.closest('.exr-row'); if(r) enterEditR(r); });
    root.addEventListener('keydown',function(e){ if(e.target.classList&&e.target.classList.contains('exr-label')&&e.key==='Enter'){ e.preventDefault(); e.target.blur(); } });
    root.addEventListener('blur',function(e){ if(e.target.classList&&e.target.classList.contains('exr-label')){ var r=e.target.closest('.exr-row'); if(r) exitEditR(r); } }, true);
    root.addEventListener('click',function(e){ var ab=e.target.closest('.exr-add'); if(!ab) return;
      var list=ab.closest('.exr-group').querySelector('.exr-list');
      var li=document.createElement('li'); li.className='exr-row'; li.setAttribute('data-id','custom-'+Date.now());
      li.innerHTML='<span class="exr-rank"></span><span class="exr-label" data-ph="'+PH+'"></span><span class="exr-handle" aria-hidden="true">⠿</span>';
      list.appendChild(li); renum(list); saveBtn.disabled=false; enterEditR(li);
    });
  }
  lists().forEach(renum); applyTop();
  window.addEventListener('ws:jtbd-changed', applyTop);
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exr-intro">${b.intro}</p>` : ''}
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

export function exerciseChips(b: ExerciseChipsBlock, slug: string): string {
  const root = `exc-${esc(b.exerciseId)}`;
  const u = {
    egPrefix: ' — e.g. ', addPlaceholder: 'Add your own…', addBtn: 'Add',
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', save: 'Save',
    ...(b.ui || {}),
  };
  const qs = b.questions.map(q => `<div class="exc-q" data-q="${esc(q.id)}"${q.singleSelect ? ' data-single="1"' : ''}>
      <div class="exc-q-h">${esc(q.q)}${q.example ? `<span class="exc-q-ex">${esc(u.egPrefix)}${esc(q.example)}</span>` : ''}</div>
      <div class="exc-chips">
        ${q.options.map(o => `<button type="button" class="exc-chip">${esc(o)}</button>`).join('\n        ')}
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
  var saveBtn=root.querySelector('.exc-save'), statusEl=root.querySelector('.exc-status');
  function touch(){ saveBtn.disabled=false; }
  root.addEventListener('click',function(e){
    var c=e.target.closest('.exc-chip'); if(c){ var cq=c.closest('.exc-q'); if(cq && cq.getAttribute('data-single')){ Array.prototype.slice.call(cq.querySelectorAll('.exc-chip')).forEach(function(ch){ ch.classList.remove('on'); }); c.classList.add('on'); } else { c.classList.toggle('on'); } touch(); return; }
    var add=e.target.closest('.exc-add-btn'); if(add){ var box=add.closest('.exc-add'); var inp=box.querySelector('.exc-inp'); var v=(inp.value||'').trim(); if(v){ var chips=add.closest('.exc-q').querySelector('.exc-chips'); var nb=document.createElement('button'); nb.type='button'; nb.className='exc-chip on'; nb.textContent=v; chips.appendChild(nb); inp.value=''; touch(); } }
  });
  root.addEventListener('keydown',function(e){ if(e.key==='Enter' && e.target.classList.contains('exc-inp')){ e.preventDefault(); e.target.parentNode.querySelector('.exc-add-btn').click(); } });
  saveBtn.addEventListener('click',function(){
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var cep=Array.prototype.slice.call(root.querySelectorAll('.exc-q')).map(function(q){
      return { q:q.getAttribute('data-q'), picks:Array.prototype.slice.call(q.querySelectorAll('.exc-chip.on')).map(function(c){ return c.textContent; }) };
    });
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'${esc(b.exerciseId)}',payload:{cep:cep}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.saveFail)}; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent=${JSON.stringify(u.saveFailNet)}; saveBtn.disabled=false; });
  });
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exc-intro">${b.intro}</p>` : ''}
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

export function exerciseSolutions(b: ExerciseSolutionsBlock, slug: string): string {
  const root = `exs-${esc(b.exerciseId)}`;
  const u = {
    saving: 'saving…', saved: '✓ Saved — thank you', saveFail: 'Save failed',
    saveFailNet: 'Save failed — check connection', save: 'Save',
    notePlaceholder: 'What do you do about this today?',
    ...(b.ui || {}),
  };
  const fallbackJobs = b.jobs.slice(0, 3).map(j => j.id);
  const rows = b.jobs.map(j =>
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
  var saveBtn=root.querySelector('.exs-save'), statusEl=root.querySelector('.exs-status');
  root.addEventListener('input',function(e){ if(e.target.classList.contains('exs-ta')) saveBtn.disabled=false; });
  // Phase A: show only the client's top-3 underserved jobs from Ex1 (fallback triad).
  function topJobs(){ try{ var d=JSON.parse(localStorage.getItem('ws:${slug}:jtbd')||'[]'); if(d.length){ d.sort(function(a,b){ return (b.importance+(11-b.satisfaction))-(a.importance+(11-a.satisfaction)); }); return d.slice(0,3).map(function(x){ return x.id; }); } }catch(_){} return ${JSON.stringify(fallbackJobs)}; }
  function applyTop(){ var keep=topJobs(); Array.prototype.slice.call(root.querySelectorAll('.exs-row')).forEach(function(r){ r.style.display = keep.indexOf(r.getAttribute('data-id'))>=0 ? '' : 'none'; }); }
  applyTop(); window.addEventListener('ws:jtbd-changed', applyTop);
  saveBtn.addEventListener('click',function(){
    saveBtn.disabled=true; statusEl.textContent=${JSON.stringify(u.saving)};
    var ans=Array.prototype.slice.call(root.querySelectorAll('.exs-row')).filter(function(r){ return r.style.display!=='none'; }).map(function(r){ return {id:r.getAttribute('data-id'), text:(r.querySelector('.exs-ta').value||'').trim()}; });
    fetch('/w/${slug}/exercise/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exercise:'${esc(b.exerciseId)}',payload:{solutions:ans}})})
      .then(function(r){ return r.json(); })
      .then(function(j){ statusEl.textContent=j.ok?${JSON.stringify(u.saved)}:${JSON.stringify(u.saveFail)}; saveBtn.disabled=!j.ok; })
      .catch(function(){ statusEl.textContent=${JSON.stringify(u.saveFailNet)}; saveBtn.disabled=false; });
  });
})();`;
  return `<section id="${root}">
  ${sectionNum(b.sectionNum)}
  <h2>${esc(b.heading)}</h2>
  ${b.intro ? `<p class="exs-intro">${b.intro}</p>` : ''}
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

export function docFooter(b: DocFooterBlock): string {
  return `<div class="doc-footer">
  <span>${esc(b.left)}</span>
  <span>${esc(b.right)}</span>
</div>`;
}
