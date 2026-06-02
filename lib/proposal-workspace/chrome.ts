/**
 * Interactive Proposal Workspace — shared chrome (v1)
 *
 * Password gate, theme toggle, and a DEV-ONLY visual edit panel — extracted
 * from app/ajtbd-naming-brief/route.ts so every per-client page shares the
 * same gate + iteration tooling.
 *
 * The edit panel posts to localhost:8002/inbox and is gated behind
 * WS_EDIT_MODE=1 so it never renders on the client-facing production page.
 */

import crypto from 'crypto';

const BSO_LOGO_SVG = `<svg width="268" height="268" viewBox="0 0 268 268" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M267.18 133.339C267.18 157.332 260.58 176.783 256.42 176.783C252.26 176.783 252.116 157.332 252.116 133.339C252.116 109.345 252.26 89.8948 256.42 89.8948C260.58 89.8948 267.18 109.345 267.18 133.339Z" fill="#F5F2E9"/>
  <path d="M233.305 134.008C233.305 183.194 228.15 223.068 225.773 223.068C223.396 223.068 224.697 183.194 224.697 134.008C224.697 84.8212 223.396 44.9476 225.773 44.9476C228.15 44.9476 233.305 84.8212 233.305 134.008Z" fill="#F5F2E9"/>
  <path d="M201.543 133.5C201.543 197.683 197.464 249.713 195.087 249.713C192.71 249.713 192.935 197.683 192.935 133.5C192.935 69.3177 192.71 17.2875 195.087 17.2875C197.464 17.2875 201.543 69.3177 201.543 133.5Z" fill="#F5F2E9"/>
  <ellipse cx="159.024" cy="133.59" rx="11.8362" ry="133.59" fill="#F5F2E9"/>
  <path d="M128.375 133.313C128.375 204.393 125.569 262.015 116.061 262.015C106.552 262.015 93.9424 204.393 93.9424 133.313C93.9424 62.2321 106.552 4.60986 116.061 4.60986C125.569 4.60986 128.375 62.2321 128.375 133.313Z" fill="#F5F2E9"/>
  <path d="M75.3212 133.754C75.3212 190.438 70.2526 236.39 49.1561 236.39C28.0596 236.39 0 190.438 0 133.754C0 77.0693 28.0596 31.1174 49.1561 31.1174C70.2526 31.1174 75.3212 77.0693 75.3212 133.754Z" fill="#F5F2E9"/>
</svg>`;

/** Stable cookie token derived from the client's access key. Per-client salt
 *  keeps one client's cookie from unlocking another. */
export function token(accessKey: string, slug: string): string {
  return crypto.createHash('sha256').update(accessKey + ':pw:' + slug).digest('hex').slice(0, 40);
}

export function getCookie(req: Request, name: string): string {
  return (req.headers.get('cookie') || '')
    .split(';').map(s => s.trim())
    .find(s => s.startsWith(name + '='))
    ?.slice(name.length + 1) ?? '';
}

export const cookieName = (slug: string) => `pw-${slug}`;

/** Password splash — same two-panel DS layout as ajtbd. */
export function loginHtml(opts: { clientName: string; subtitle: string; actionPath: string; err?: boolean }): string {
  const { clientName, subtitle, actionPath, err = false } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Access Required</title>
<style>
  @font-face { font-family: 'GT Eesti Pro Text'; src: url('/fonts/GTEestiProText-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; }
  @font-face { font-family: 'GT Eesti Pro Text'; src: url('/fonts/GTEestiProText-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: 'GT Eesti Pro Text', system-ui, sans-serif; min-height: 100vh; display: flex; }
  .panel-left { flex: 1; position: relative; background: #060a06 url('/images/hero-bg-magenta-green.webp') center / cover no-repeat; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; }
  .logo { display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .logo svg { display: block; width: 140px; height: 140px; }
  .logo-name { font-family: 'GT Eesti Pro Text', system-ui, sans-serif; font-size: 28px; line-height: 1.2; color: #F5F2E9; font-weight: 500; text-align: center; }
  .panel-right { width: 520px; flex-shrink: 0; background: #FAF9F6; display: flex; flex-direction: column; justify-content: center; padding: 72px 64px; }
  .form-title { font-family: 'GT Eesti Pro Text', system-ui, sans-serif; font-size: 30px; font-weight: 400; color: #1A1A1A; line-height: 1.3; margin-bottom: 8px; }
  .form-sub { font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #9A9A9A; margin-bottom: 40px; }
  input[type="password"] { display: block; width: 100%; padding: 16px 18px; font-family: 'GT Eesti Pro Text', system-ui, sans-serif; font-size: 20px; background: #F1EFE9; border: 1.5px solid #E5E3DC; border-radius: 0; color: #1A1A1A; outline: none; margin-bottom: 14px; transition: border-color 0.12s, background 0.12s; -webkit-appearance: none; appearance: none; }
  input[type="password"]::placeholder { color: #9A9A9A; }
  input[type="password"]:focus { border-color: #1A1A1A; background: #FAF9F6; }
  button { display: block; width: 100%; padding: 18px 0; font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; background: #1A1A1A; color: #FAF9F6; border: none; cursor: pointer; transition: opacity 0.12s; }
  button:hover { opacity: 0.78; }
  .err { font-size: 14px; color: rgba(26, 26, 26, 0.50); margin-top: 14px; font-style: italic; }
  @media (max-width: 640px) { body { flex-direction: column; } .panel-left { flex: none; height: 220px; padding: 24px; justify-content: flex-end; } .panel-right { width: 100%; padding: 40px 24px 48px; } }
</style>
</head>
<body>
  <div class="panel-left">
    <div class="logo">${BSO_LOGO_SVG}<div class="logo-name">Backspace<br>Oddity</div></div>
  </div>
  <div class="panel-right">
    <p class="form-title">${esc(clientName)}</p>
    <p class="form-sub">${esc(subtitle)}</p>
    <form method="POST" action="${esc(actionPath)}">
      <input type="password" name="code" placeholder="Enter password" autofocus autocomplete="current-password">
      <button type="submit">Enter →</button>
      ${err ? '<p class="err">Incorrect password.</p>' : ''}
    </form>
  </div>
</body>
</html>`;
}

/** Inline <head> script that applies saved/system theme before paint. */
export const themeHeadScript = `<script>
  (function() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
  })();
</script>`;

/** Floating theme toggle button + handler (end of body). */
export const themeToggle = `<button class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">&#x25D0;</button>
<script>
  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
</script>`;

/** DEV-ONLY Edit Mode panel. Only injected when WS_EDIT_MODE=1, so it never
 *  appears on the client-facing production page. Canonical surface:
 *    - Visual edits → in-place corner PINS on the element (Figma/Miro model)
 *    - Copy + ToV edits → right-margin RAIL markers (Notion model)
 *    - markers collapse to a dot; hover = preview tooltip; click = card
 *    - each card carries its OWN "Send to Claude" / "Resolve" (per-comment)
 *    - ToV check → posts to inbox /tov-request; the CC session runs tov-lint
 *      and writes the verdict back; the browser polls /tov-poll and renders it
 *    - Tweaks panel (font sizes / line heights / weight+style) — live CSS vars
 *  Storage key namespaced per client slug. */
export function editModeScript(slug: string): string {
  return `<script>
(function () {
  var INBOX='http://localhost:8002/inbox', REQ='http://localhost:8002/tov-request', POLL='http://localhost:8002/tov-poll';
  var STORE='pw-${slug}-edit-threads';
  function load(){ try{ return JSON.parse(localStorage.getItem(STORE)||'{"threads":{}}'); }catch(e){ return {threads:{}}; } }
  function persist(d){ d.savedAt=new Date().toISOString(); localStorage.setItem(STORE,JSON.stringify(d)); }
  function mk(t){ return document.createElement(t); }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function cssSel(el){ if(el.id) return '#'+el.id; var path=[],n=el; while(n&&n!==document.body&&path.length<5){ if(n.id){path.unshift('#'+n.id);break;} var seg=n.tagName.toLowerCase(); var par=n.parentElement; if(par){ var same=Array.prototype.filter.call(par.children,function(c){return c.tagName===n.tagName;}); if(same.length>1) seg+=':nth-of-type('+(Array.prototype.indexOf.call(par.children,n)+1)+')'; } path.unshift(seg); n=par; } return path.join(' > '); }
  function findEl(t){ var sels=[t.selector,(t.element&&t.element.selector)]; for(var i=0;i<sels.length;i++){ if(!sels[i])continue; try{ var el=document.querySelector(sels[i]); if(el) return el; }catch(e){} } return null; }
  function langOf(s){ return /[\\u0400-\\u04FF]/.test(s||'') ? 'ru' : 'en'; }

  /* ── floating controls ── */
  var editBtn=mk('button'); editBtn.className='em-ui'; editBtn.innerHTML='&#9998; Edit';
  editBtn.style.cssText='position:fixed;top:14px;right:16px;z-index:10000;background:var(--paper);color:var(--ink-55);border:1px solid var(--rule-strong);border-radius:6px;padding:5px 12px;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 1px 6px rgba(0,0,0,.10);transition:all .12s;line-height:1;white-space:nowrap;';
  document.body.appendChild(editBtn);
  var ring=mk('div'); ring.className='em-ui'; ring.style.cssText='position:fixed;pointer-events:none;z-index:9995;display:none;outline:2px solid var(--em-ring);outline-offset:2px;background:transparent;border-radius:4px;'; document.body.appendChild(ring);
  var hl=mk('div'); hl.className='em-ui'; hl.style.cssText='position:fixed;pointer-events:none;z-index:9994;display:none;outline:2px dashed var(--em-ring);outline-offset:2px;border-radius:4px;'; document.body.appendChild(hl);
  var tip=mk('div'); tip.className='em-ui'; tip.style.cssText='position:fixed;z-index:10004;display:none;max-width:240px;background:var(--ink);color:var(--paper);border-radius:8px;padding:8px 10px;font-family:var(--text);font-size:12px;line-height:1.45;box-shadow:0 8px 28px rgba(0,0,0,.28);pointer-events:none;'; document.body.appendChild(tip);

  /* ── create dialog (Visual / Copy / ToV) ── */
  var dlg=mk('div'); dlg.className='em-ui'; dlg.style.cssText='position:fixed;z-index:10002;display:none;background:var(--paper);border:1.5px solid var(--rule-strong);border-radius:12px;padding:14px;width:320px;box-shadow:0 16px 48px rgba(0,0,0,.20);font-family:var(--text);';
  var MB='flex:1;border:none;border-radius:4px;padding:3px 0;font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;';
  dlg.innerHTML='<div style="display:flex;gap:4px;margin-bottom:10px;background:var(--paper-soft);border-radius:6px;padding:3px;"><button id="em-mode-v" style="'+MB+'background:var(--ink);color:var(--paper);">Visual</button><button id="em-mode-c" style="'+MB+'background:transparent;color:var(--ink-40);">Copy</button><button id="em-mode-t" style="'+MB+'background:transparent;color:var(--ink-40);">ToV</button></div><p id="em-lbl" style="font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-40);margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></p><div id="em-body"></div>';
  document.body.appendChild(dlg);

  /* ── expanded comment card (one open at a time) ── */
  var card=mk('div'); card.className='em-ui'; card.style.cssText='position:fixed;z-index:10003;display:none;width:308px;max-height:72vh;overflow-y:auto;background:var(--paper);border:1.5px solid var(--rule-strong);border-radius:12px;padding:14px;box-shadow:0 16px 48px rgba(0,0,0,.22);font-family:var(--text);';
  document.body.appendChild(card);

  function ours(el){ if(!el) return false; if(el.closest&&(el.closest('.em-ui')||el.closest('[data-em-marker]')||el.closest('.theme-toggle'))) return true; return [editBtn,ring,hl,tip,dlg,card,(typeof twPanel!=='undefined'?twPanel:null),(typeof twBtn!=='undefined'?twBtn:null)].some(function(n){ return n&&n.contains&&n.contains(el); }); }

  /* ── block → font-size token map (Tweaks-row highlight on hover) ── */
  function tokenForEl(el){ if(!el||!el.classList) return null; var t=el.tagName.toLowerCase(),c=el.classList;
    if(c.contains('statement')) return '--fs-statement';
    if(c.contains('ba-core')) return '--fs-ba-core';
    if(c.contains('section-num')) return '--fs-section-num';
    if(t==='h2') return '--fs-h2';
    if(el.closest&&el.closest('.ej-frame')) return '--fs-ej-frame';
    if(el.closest&&(el.closest('.ba-col')||el.closest('.comp-card')||el.closest('.criterion'))) return '--fs-secondary';
    if(el.closest&&el.closest('.check-list')) return '--fs-small';
    if(t==='p') return '--fs-body';
    return null; }
  var twLabelMap={'--fs-h2':'H2 HEADING','--fs-body':'BODY','--fs-statement':'PULL QUOTE','--fs-ba-core':'BEFORE/AFTER','--fs-ej-frame':'EMPHASIS','--fs-secondary':'SECONDARY','--fs-small':'SMALL','--fs-list-item':'LIST ITEM','--fs-section-num':'SECTION LABEL'};
  function twRowId(k){ return 'twrow-'+k.replace(/[^a-z0-9]/gi,'_'); }
  function highlightRow(key){ document.querySelectorAll('[id^="twrow-"]').forEach(function(r){ r.style.background='transparent'; r.style.boxShadow='none'; }); if(!key) return; var row=document.getElementById(twRowId(key)); if(row){ row.style.background='var(--paper-soft)'; row.style.boxShadow='inset 2px 0 0 var(--ink)'; } }

  /* ── picking ── */
  var active=false,pending=null,editMode='visual',copyId=null;
  function setMode(m){ editMode=m; var v=document.getElementById('em-mode-v'),c=document.getElementById('em-mode-c'),tt=document.getElementById('em-mode-t'); [['visual',v],['copy',c],['tov',tt]].forEach(function(p){ if(!p[1])return; var on=editMode===p[0]; p[1].style.background=on?'var(--ink)':'transparent'; p[1].style.color=on?'var(--paper)':'var(--ink-40)'; }); if(pending&&dlg.style.display!=='none') renderBody(); }
  function activate(){ active=true; editBtn.innerHTML='&#10005; Exit'; editBtn.style.background='var(--ink)'; editBtn.style.color='var(--paper)'; document.body.style.cursor='crosshair'; document.addEventListener('mouseover',onHover,true); document.addEventListener('mouseout',onUnhover,true); document.addEventListener('click',onPick,true); }
  function deactivate(){ active=false; editBtn.innerHTML='&#9998; Edit'; editBtn.style.background='var(--paper)'; editBtn.style.color='var(--ink-55)'; document.body.style.cursor=''; ring.style.display='none'; highlightRow(null); closeDlg(); document.removeEventListener('mouseover',onHover,true); document.removeEventListener('mouseout',onUnhover,true); document.removeEventListener('click',onPick,true); }
  editBtn.addEventListener('click',function(ev){ ev.stopPropagation(); active?deactivate():activate(); });
  function onHover(ev){ if(ours(ev.target)){ring.style.display='none';return;} var r=ev.target.getBoundingClientRect(); ring.style.top=r.top+'px'; ring.style.left=r.left+'px'; ring.style.width=r.width+'px'; ring.style.height=r.height+'px'; ring.style.display='block'; highlightRow(tokenForEl(ev.target)); }
  function onUnhover(){ ring.style.display='none'; }
  function onPick(ev){ if(ours(ev.target))return; ev.preventDefault(); ev.stopPropagation(); pending=ev.target; copyId=null; var r=ev.target.getBoundingClientRect(); var top=r.bottom+8; if(top+300>window.innerHeight) top=Math.max(8,r.top-300); var left=Math.min(ev.clientX,window.innerWidth-336); if(left<8)left=8; dlg.style.top=top+'px'; dlg.style.left=left+'px'; dlg.style.display='block'; var tag=pending.tagName.toLowerCase(); var cls=pending.classList[0]?'.'+pending.classList[0]:''; var tk=tokenForEl(pending); document.getElementById('em-lbl').textContent=(tk&&twLabelMap[tk]?twLabelMap[tk]+' · ':'')+tag+cls; renderBody(); }
  function closeDlg(){ dlg.style.display='none'; pending=null; copyId=null; }

  function renderBody(){ var body=document.getElementById('em-body'); if(!body)return; if(editMode==='visual') renderVisualBody(body); else if(editMode==='copy') renderCopyBody(body); else renderTovBody(body); }

  /* visual */
  function renderVisualBody(body){ body.innerHTML='<textarea id="em-ta" rows="3" placeholder="What layout/style change?" style="display:block;width:100%;box-sizing:border-box;border:1px solid var(--rule-strong);border-radius:6px;padding:9px 10px;font-family:var(--text);font-size:14px;line-height:1.5;resize:vertical;background:var(--surface);color:var(--ink);outline:none;"></textarea><div style="display:flex;gap:8px;margin-top:8px;"><button id="em-ok" style="flex:2;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:8px 0;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Save &#8629;</button><button id="em-cancel" style="flex:1;background:transparent;color:var(--ink-55);border:1px solid var(--rule-strong);border-radius:6px;padding:8px 0;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Cancel</button></div>'; var ta=document.getElementById('em-ta'); setTimeout(function(){ta.focus();},40); ta.onkeydown=function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();saveVisual();} if(e.key==='Escape')closeDlg(); }; document.getElementById('em-ok').onclick=function(ev){ev.stopPropagation();saveVisual();}; document.getElementById('em-cancel').onclick=function(ev){ev.stopPropagation();closeDlg();}; }
  function saveVisual(){ var ta=document.getElementById('em-ta'); if(!ta)return; var txt=ta.value.trim(); if(!txt){closeDlg();return;} var id='edit-'+Date.now(),d=load(); d.threads[id]={id:id,type:'visual',prompt:txt,selector:cssSel(pending),element:{tag:pending.tagName.toLowerCase(),className:pending.className||'',textContent:(pending.textContent||'').trim().slice(0,120),selector:cssSel(pending)},status:'pending',createdAt:new Date().toISOString()}; persist(d); closeDlg(); renderMarkers(); }

  /* copy — variant workflow (create → preview → choose) */
  function ensureCopyThread(){ var d=load(),sel=cssSel(pending); for(var k in d.threads){ if(d.threads[k].type==='copy'&&d.threads[k].selector===sel){ copyId=k; return d.threads[k]; } } var id='copy-'+Date.now(); d.threads[id]={id:id,type:'copy',selector:sel,element:{tag:pending.tagName.toLowerCase(),className:pending.className||'',selector:sel},sourceText:(pending.textContent||'').trim(),variants:[],activeIndex:-1,chosenIndex:null,status:'pending',createdAt:new Date().toISOString()}; persist(d); copyId=id; return d.threads[id]; }
  function getCopy(){ return load().threads[copyId]; }
  function updCopy(fn){ var d=load(); fn(d.threads[copyId]); persist(d); }
  function previewIndex(i){ var t=getCopy(); pending.textContent=(i<0?t.sourceText:t.variants[i]); updCopy(function(c){c.activeIndex=i;}); renderCopyBody(document.getElementById('em-body')); }
  function variantRow(i,text,tag,isActive,isChosen){ var s=(text||''); var snip=s.slice(0,64)+(s.length>64?'…':''); return '<div style="border-top:1px solid var(--rule);padding:7px 0;display:flex;gap:6px;align-items:flex-start;'+(isActive?'background:var(--paper-soft);':'')+'border-radius:4px;"><button data-prev="'+i+'" title="Preview on page" style="background:none;border:none;cursor:pointer;text-align:left;flex:1;padding:2px 4px;"><span style="font-family:var(--mono);font-size:8px;letter-spacing:.06em;color:'+(isChosen?'var(--ink)':'var(--ink-40)')+';">'+tag+(isChosen?' ✓ CHOSEN':'')+(isActive?' · previewing':'')+'</span><br><span style="font-family:var(--text);font-size:12px;color:var(--ink);line-height:1.4;">'+esc(snip)+'</span></button>'+(i>=0?'<button data-use="'+i+'" title="Approve this one" style="background:none;border:none;color:var(--ink-40);cursor:pointer;font-family:var(--mono);font-size:9px;padding:2px 4px;">use</button><button data-del="'+i+'" title="Remove" style="background:none;border:none;color:var(--ink-40);cursor:pointer;font-size:13px;padding:2px 4px;">×</button>':'')+'</div>'; }
  function renderCopyBody(body){ ensureCopyThread(); var t=getCopy(); var chips=variantRow(-1,t.sourceText,'SOURCE',t.activeIndex===-1,false); t.variants.forEach(function(v,i){ chips+=variantRow(i,v,'V'+(i+1),t.activeIndex===i,t.chosenIndex===i); }); body.innerHTML='<div style="max-height:150px;overflow-y:auto;margin-bottom:8px;">'+chips+'</div><textarea id="em-newv" rows="2" placeholder="Type a new copy variant…" style="display:block;width:100%;box-sizing:border-box;border:1px solid var(--rule-strong);border-radius:6px;padding:8px;font-family:var(--text);font-size:13px;line-height:1.45;resize:vertical;background:var(--surface);color:var(--ink);outline:none;"></textarea><div style="display:flex;gap:6px;margin-top:8px;"><button id="em-addv" style="flex:1;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">+ Add variant</button><button id="em-cdone" style="flex:1;background:transparent;color:var(--ink-55);border:1px solid var(--rule-strong);border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">Done</button></div>'; body.querySelectorAll('[data-prev]').forEach(function(b){ b.onclick=function(ev){ev.stopPropagation();previewIndex(Number(b.dataset.prev));}; }); body.querySelectorAll('[data-use]').forEach(function(b){ b.onclick=function(ev){ev.stopPropagation();var i=Number(b.dataset.use);updCopy(function(c){c.chosenIndex=i;});previewIndex(i);}; }); body.querySelectorAll('[data-del]').forEach(function(b){ b.onclick=function(ev){ev.stopPropagation();var i=Number(b.dataset.del);updCopy(function(c){c.variants.splice(i,1);if(c.chosenIndex===i)c.chosenIndex=null;else if(c.chosenIndex>i)c.chosenIndex--;c.activeIndex=-1;});pending.textContent=getCopy().sourceText;renderCopyBody(document.getElementById('em-body'));}; }); var nv=document.getElementById('em-newv'); document.getElementById('em-addv').onclick=function(ev){ ev.stopPropagation(); var txt=nv.value.trim(); if(!txt)return; updCopy(function(c){c.variants.push(txt);}); previewIndex(getCopy().variants.length-1); }; document.getElementById('em-cdone').onclick=function(ev){ ev.stopPropagation(); var t=getCopy(); if(t&&(!t.variants||!t.variants.length)){ var d=load(); delete d.threads[copyId]; persist(d); } closeDlg(); renderMarkers(); }; nv.onkeydown=function(e){ if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();document.getElementById('em-addv').click();} }; }

  /* tov */
  function renderTovBody(body){ var txt=(pending.textContent||'').trim(); var l=langOf(txt); body.innerHTML='<p style="font-family:var(--text);font-size:12px;font-style:italic;color:var(--ink-55);margin-bottom:8px;max-height:90px;overflow:auto;">“'+esc(txt.slice(0,260))+(txt.length>260?'…':'')+'”</p><p style="font-family:var(--mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-40);margin-bottom:8px;">Language: '+(l==='ru'?'Russian':'English')+' · ToV auto-detected</p><button id="em-tov-go" style="width:100%;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:9px 0;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">&#8594; Check against our ToV</button>'; document.getElementById('em-tov-go').onclick=function(ev){ ev.stopPropagation(); startTov(txt,l); }; }
  function startTov(txt,l){ if(!txt){closeDlg();return;} var sel=cssSel(pending); var id='tov-'+Date.now(); var th={id:id,type:'tov',selector:sel,element:{tag:pending.tagName.toLowerCase(),className:pending.className||'',textContent:txt.slice(0,120),selector:sel},text:txt,lang:l,tovStatus:'checking',status:'pending',createdAt:new Date().toISOString()}; var d=load(); d.threads[id]=th; persist(d); closeDlg(); renderMarkers(); fetch(REQ,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,selector:sel,lang:l,slug:'${slug}'})}).then(function(r){return r.json();}).then(function(j){ var dd=load(); if(dd.threads[id]){ dd.threads[id].reqId=j.id; persist(dd); } pollTov(id,j.id,0); }).catch(function(){ var dd=load(); if(dd.threads[id]){ dd.threads[id].tovStatus='error'; dd.threads[id].verdict='Inbox server offline — start inbox-server.py on :8002.'; persist(dd); renderMarkers(); } }); }
  function pollTov(id,reqId,n){ if(n>60) return; setTimeout(function(){ fetch(POLL+'?id='+encodeURIComponent(reqId)).then(function(r){return r.json();}).then(function(res){ if(res&&res.pending){ pollTov(id,reqId,n+1); return; } var d=load(); if(!d.threads[id])return; d.threads[id].tovStatus='done'; d.threads[id].verdict=res.verdict||''; d.threads[id].score=res.score; d.threads[id].suggestions=res.suggestions||[]; persist(d); renderMarkers(); if(cardId===id) openCard(id); }).catch(function(){ pollTov(id,reqId,n+1); }); }, 2500); }

  /* ── markers + inline highlight (Notion model) ──
     commented text gets an amber wash in the body; a comment BUBBLE sits in
     the margin (copy/tov) or on the element corner (visual), aligned to it.
     hover the bubble -> the wash intensifies so you see exactly which text. */
  var BUB='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 1 1 21 11.5z"/></svg>';
  var markerEls={}, hlEls={};
  function clearMarkers(){ var k; for(k in markerEls){ if(markerEls[k]&&markerEls[k].remove) markerEls[k].remove(); } for(k in hlEls){ if(hlEls[k]&&hlEls[k].remove) hlEls[k].remove(); } markerEls={}; hlEls={}; }
  function syncCounter(){}
  function setHl(id,on){ var h=hlEls[id]; if(!h)return; h.style.background=on?'rgba(214,168,84,.34)':'rgba(214,168,84,.15)'; h.style.boxShadow=on?'0 0 0 1px rgba(214,168,84,.55)':'none'; }
  function showTip(it){ var t=it.t; var txt = t.type==='visual'?t.prompt : t.type==='copy'?((t.chosenIndex!=null?t.variants[t.chosenIndex]:t.sourceText)||'') : (t.tovStatus==='checking'?'Checking against ToV…':(t.verdict||'')); tip.textContent=(txt||'').slice(0,180); var m=markerEls[it.id]; if(!m){tip.style.display='none';return;} var r=m.getBoundingClientRect(); var top=r.top; var left=r.left-250; if(left<8) left=r.right+8; tip.style.top=Math.max(8,Math.min(top,window.innerHeight-80))+'px'; tip.style.left=left+'px'; tip.style.display='block'; }
  function hideTip(){ tip.style.display='none'; }
  function renderMarkers(){ clearMarkers(); var threads=load().threads; var rail=[]; var items=Object.keys(threads).map(function(id){ var el=findEl(threads[id]); return {id:id,t:threads[id],el:el,rect:el?el.getBoundingClientRect():null}; }); items.sort(function(a,b){ return (a.rect?a.rect.top:0)-(b.rect?b.rect.top:0); }); items.forEach(function(it){ if(!it.rect) return; placeHighlight(it); placeMarker(it,rail); }); syncCounter(); }
  function placeHighlight(it){ var r=it.rect; var h=mk('div'); h.setAttribute('data-em-marker','1'); h.style.cssText='position:fixed;z-index:9993;pointer-events:none;border-radius:3px;top:'+(r.top-1)+'px;left:'+(r.left-2)+'px;width:'+(r.width+4)+'px;height:'+(r.height+2)+'px;background:rgba(214,168,84,.15);transition:background .12s,box-shadow .12s;'; document.body.appendChild(h); hlEls[it.id]=h; }
  function placeMarker(it,rail){ var t=it.t,r=it.rect,m=mk('div'); m.setAttribute('data-em-marker','1'); m.dataset.id=it.id; m.title=(t.type==='visual'?'Visual':t.type==='tov'?'Tone of voice':'Copy')+' comment — click to open';
    var base='position:fixed;z-index:9996;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 6px rgba(0,0,0,.24);';
    if(t.type==='visual'){ var top=Math.max(4,r.top-9),left=Math.min(window.innerWidth-28,r.right-9); m.style.cssText=base+'top:'+top+'px;left:'+left+'px;width:22px;height:22px;border-radius:50% 50% 50% 3px;background:var(--ink);color:var(--paper);border:2px solid var(--paper);'; m.innerHTML=BUB; }
    else { var y=r.top; rail.forEach(function(u){ if(Math.abs(y-u)<28) y=u+28; }); rail.push(y); y=Math.max(54,Math.min(window.innerHeight-32,y)); var badge=t.type==='tov'?(t.tovStatus==='checking'?'…':(t.tovStatus==='error'?'!':'✓')):''; m.style.cssText=base+'top:'+y+'px;right:12px;width:24px;height:24px;border-radius:50% 50% 3px 50%;background:var(--paper);color:var(--ink);border:1px solid var(--rule-strong);'; m.innerHTML=badge?('<span style="font-family:var(--mono);font-size:11px;line-height:1;">'+badge+'</span>'):BUB; }
    m.addEventListener('mouseenter',function(){ showTip(it); setHl(it.id,true); });
    m.addEventListener('mouseleave',function(){ hideTip(); setHl(it.id,false); });
    m.addEventListener('click',function(ev){ ev.stopPropagation(); openCard(it.id); });
    document.body.appendChild(m); markerEls[it.id]=m; }

  /* ── card ── */
  var cardId=null;
  function closeCard(){ card.style.display='none'; cardId=null; }
  function positionCard(t,rect){ if(t.type==='visual'&&rect){ var top=Math.min(rect.bottom+8,window.innerHeight-180); var left=Math.max(8,Math.min(rect.left,window.innerWidth-324)); card.style.top=top+'px'; card.style.left=left+'px'; card.style.right='auto'; } else { var ry=rect?Math.max(54,Math.min(rect.top,window.innerHeight-220)):80; card.style.top=ry+'px'; card.style.right='52px'; card.style.left='auto'; } }
  function cardHtml(t){ var time=t.createdAt?new Date(t.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):''; var lbl={visual:'VISUAL',copy:'COPY',tov:'TONE OF VOICE'}[t.type]||''; var head='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><span style="font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-40);">'+lbl+(time?(' · '+time):'')+'</span><button data-x style="background:none;border:none;color:var(--ink-40);cursor:pointer;font-size:15px;line-height:1;">&times;</button></div>'; var b='';
    if(t.type==='visual'){ var sn=(t.element&&t.element.textContent||'').slice(0,90); b=(sn?'<p style="font-family:var(--text);font-size:12px;font-style:italic;color:var(--ink-55);margin-bottom:6px;">“'+esc(sn)+'”</p>':'')+'<p style="font-size:13px;line-height:1.5;color:var(--ink);">'+esc(t.prompt||'')+'</p>'; }
    else if(t.type==='copy'){ var vs=t.variants||[]; var chosen=t.chosenIndex!=null?vs[t.chosenIndex]:null; b='<p style="font-family:var(--text);font-size:12px;font-style:italic;color:var(--ink-55);margin-bottom:6px;">“'+esc((t.sourceText||'').slice(0,90))+'”</p><p style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);margin-bottom:4px;">'+vs.length+' variant'+(vs.length===1?'':'s')+(chosen?' · chosen':'')+'</p>'+(chosen?'<p style="font-size:13px;line-height:1.5;color:var(--ink);">'+esc(chosen)+'</p>':''); }
    else { if(t.tovStatus==='checking'){ b='<p style="font-size:13px;color:var(--ink-55);">Checking against our ToV…</p>'; } else if(t.tovStatus==='error'){ b='<p style="font-size:13px;color:var(--ink);">'+esc(t.verdict||'Error')+'</p>'; } else { var sc=(t.score!=null)?(' · '+t.score+'/100'):''; b='<p style="font-family:var(--mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-40);margin-bottom:4px;">Verdict'+sc+'</p><p style="font-size:13px;line-height:1.5;color:var(--ink);margin-bottom:8px;">'+esc(t.verdict||'')+'</p>'; (t.suggestions||[]).forEach(function(s,i){ b+='<div style="border-top:1px solid var(--rule);padding:7px 0;">'+(s.from?'<p style="font-size:12px;color:var(--ink-55);text-decoration:line-through;line-height:1.4;">'+esc(s.from)+'</p>':'')+(s.to?'<p style="font-size:13px;color:var(--ink);line-height:1.45;">'+esc(s.to)+'</p>':'')+(s.why?'<p style="font-size:11px;color:var(--ink-40);margin-top:2px;line-height:1.4;">'+esc(s.why)+'</p>':'')+(s.to?'<button data-apply="'+i+'" style="margin-top:5px;background:none;border:1px solid var(--rule-strong);border-radius:5px;padding:3px 9px;font-family:var(--mono);font-size:9px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-55);cursor:pointer;">apply on page</button>':'')+'</div>'; }); } }
    var actions='<div style="display:flex;gap:6px;margin-top:10px;"><button data-send style="flex:2;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">&#8594; Send to Claude</button><button data-resolve style="flex:1;background:transparent;color:var(--ink-55);border:1px solid var(--rule-strong);border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">Resolve</button></div>';
    if(t.type==='tov'&&t.tovStatus==='checking') actions='';
    return head+b+actions; }
  function openCard(id){ var t=load().threads[id]; if(!t){closeCard();return;} cardId=id; var el=findEl(t); var rect=el?el.getBoundingClientRect():null; card.innerHTML=cardHtml(t); positionCard(t,rect); card.style.display='block'; wireCard(t,el); }
  function wireCard(t,el){ var x=card.querySelector('[data-x]'); if(x)x.onclick=function(ev){ev.stopPropagation();closeCard();}; card.querySelectorAll('[data-apply]').forEach(function(b){ b.onclick=function(ev){ ev.stopPropagation(); var s=(t.suggestions||[])[Number(b.dataset.apply)]; if(s&&s.to&&el){ el.textContent=s.to; flash(el); } }; }); var sd=card.querySelector('[data-send]'); if(sd)sd.onclick=function(ev){ev.stopPropagation();sendOne(t.id,sd);}; var rs=card.querySelector('[data-resolve]'); if(rs)rs.onclick=function(ev){ev.stopPropagation();resolveOne(t.id);}; }
  function sendOne(id,btn){ var d=load(); var t=d.threads[id]; if(!t)return; var payload={threads:{},source:'${slug}'}; payload.threads[id]=t; fetch(INBOX,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(){ var dd=load(); delete dd.threads[id]; persist(dd); closeCard(); renderMarkers(); }).catch(function(){ if(btn){ btn.textContent='✗ Server off'; setTimeout(function(){btn.innerHTML='&#8594; Send to Claude';},2000); } }); }
  function resolveOne(id){ var d=load(); delete d.threads[id]; persist(d); closeCard(); renderMarkers(); }
  function flash(el){ var prev=el.style.outline; el.style.outline='2px solid var(--ink)'; setTimeout(function(){el.style.outline=prev;},700); }

  document.getElementById('em-mode-v').addEventListener('click',function(ev){ ev.stopPropagation(); setMode('visual'); });
  document.getElementById('em-mode-c').addEventListener('click',function(ev){ ev.stopPropagation(); setMode('copy'); });
  document.getElementById('em-mode-t').addEventListener('click',function(ev){ ev.stopPropagation(); setMode('tov'); });
  document.addEventListener('keydown',function(ev){ if(ev.key!=='Escape')return; if(card.style.display!=='none')closeCard(); else if(dlg.style.display!=='none')closeDlg(); else if(active)deactivate(); });
  var raf=null; function onScroll(){ if(raf)return; raf=requestAnimationFrame(function(){ raf=null; renderMarkers(); if(cardId){ var t=load().threads[cardId]; if(t){ var el=findEl(t); positionCard(t,el?el.getBoundingClientRect():null); } } }); }
  window.addEventListener('scroll',onScroll,true); window.addEventListener('resize',onScroll);

  /* ── Tweaks panel — live CSS-var controls (font size + line height) ── */
  var TW_STORE='pw-${slug}-tweaks';
  var TW_STAGED='pw-${slug}-tweaks-staged';
  var SIZES=[
    {k:'--fs-h2',l:'H2 heading',d:42,min:24,max:64},
    {k:'--fs-body',l:'Body',d:22,min:14,max:32},
    {k:'--fs-statement',l:'Pull quote',d:22,min:14,max:40},
    {k:'--fs-ba-core',l:'Before/After',d:22,min:14,max:36},
    {k:'--fs-ej-frame',l:'Emphasis',d:26,min:16,max:44},
    {k:'--fs-secondary',l:'Secondary',d:15,min:11,max:24},
    {k:'--fs-small',l:'Small',d:16,min:11,max:22},
    {k:'--fs-list-item',l:'List item',d:19,min:12,max:28},
    {k:'--fs-section-num',l:'Section label',d:13,min:10,max:18}
  ];
  var LHS=[
    {k:'--lh-body',l:'Body line-height',d:150,min:120,max:220},
    {k:'--lh-heading',l:'Heading line-height',d:115,min:100,max:160},
    {k:'--lh-quote',l:'Quote line-height',d:150,min:120,max:200}
  ];
  function twLoad(){ try{ return JSON.parse(localStorage.getItem(TW_STORE)||'{}'); }catch(e){ return {}; } }
  var twSaved=twLoad();
  SIZES.forEach(function(s){ if(twSaved[s.k]!==undefined) document.documentElement.style.setProperty(s.k,twSaved[s.k]+'px'); });
  LHS.forEach(function(h){ if(twSaved[h.k]!==undefined) document.documentElement.style.setProperty(h.k,(twSaved[h.k]/100).toFixed(2)); });
  /* ── Weight & style tokens (real loaded faces: Regular 400 / Medium 500 / Bold 700, + italic) ── */
  var WSTYLE=[
    {l:'H2 heading',w:'--w-h2',s:'--st-h2',wd:400,sd:'normal'},
    {l:'Body',w:'--w-body',s:'--st-body',wd:400,sd:'normal'},
    {l:'Pull quote',w:'--w-statement',s:'--st-statement',wd:400,sd:'italic'},
    {l:'Before/After',w:'--w-ba-core',s:'--st-ba-core',wd:400,sd:'italic'},
    {l:'Emphasis',w:'--w-ej-frame',s:'--st-ej-frame',wd:400,sd:'italic'},
    {l:'List item',w:'--w-list-item',s:'--st-list-item',wd:500,sd:'normal'},
    {l:'Section label',w:'--w-section-num',s:'--st-section-num',wd:400,sd:'italic'}
  ];
  var WNAME={400:'Regular',500:'Medium',700:'Bold'}, WCYCLE={400:500,500:700,700:400};
  WSTYLE.forEach(function(o){ if(twSaved[o.w]!==undefined) document.documentElement.style.setProperty(o.w,twSaved[o.w]); if(twSaved[o.s]!==undefined) document.documentElement.style.setProperty(o.s,twSaved[o.s]); });
  var WOPTS=[['400|normal','Regular'],['500|normal','Medium'],['700|normal','Bold'],['400|italic','Italic']];
  function wsRow(o){ var cw=twSaved[o.w]!==undefined?twSaved[o.w]:o.wd; var cs=twSaved[o.s]!==undefined?twSaved[o.s]:o.sd; var cur=cw+'|'+cs; var sel=WOPTS.map(function(p){return '<option value="'+p[0]+'"'+(p[0]===cur?' selected':'')+'>'+p[1]+'</option>';}).join(''); return '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 6px;margin:0 -6px;border-bottom:1px solid var(--rule);"><span style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);min-width:80px;">'+o.l+'</span><select class="ws-sel" data-w="'+o.w+'" data-s="'+o.s+'" style="font-family:var(--mono);font-size:10px;border:1px solid var(--rule-strong);border-radius:4px;padding:4px 6px;background:var(--surface);color:var(--ink);cursor:pointer;">'+sel+'</select></div>'; }
  function twApplyPx(k,v){ document.documentElement.style.setProperty(k,v+'px'); var s=twLoad(); s[k]=Number(v); localStorage.setItem(TW_STORE,JSON.stringify(s)); }
  function twApplyLh(k,v){ document.documentElement.style.setProperty(k,(v/100).toFixed(2)); var s=twLoad(); s[k]=Number(v); localStorage.setItem(TW_STORE,JSON.stringify(s)); }
  function twStaged(){ try{ return JSON.parse(localStorage.getItem(TW_STAGED)||'{}'); }catch(e){ return {}; } }
  function twStageNow(){ localStorage.setItem(TW_STAGED, JSON.stringify(twLoad())); }
  function twStagedCount(){ return Object.keys(twStaged()).length; }
  function updateStagedInd(){ var el=document.getElementById('tw-staged-ind'); if(!el)return; var n=twStagedCount(); el.textContent=n?('staged: '+n+' value'+(n===1?'':'s')+' — ready for Claude'):'change sliders, then Save to stage'; el.style.color=n?'var(--ink)':'var(--ink-40)'; }
  function twRow(o,isLh){ var cur=twSaved[o.k]!==undefined?twSaved[o.k]:o.d; var sid='tw'+o.k.replace(/[^a-z0-9]/gi,'_'); return '<div id="'+twRowId(o.k)+'" style="display:flex;align-items:center;justify-content:space-between;padding:4px 6px;margin:0 -6px;border-radius:4px;border-bottom:1px solid var(--rule);transition:background .15s,box-shadow .15s;"><span style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);min-width:92px;">'+o.l+'</span><div style="display:flex;align-items:center;gap:5px;"><input type="range" data-lh="'+(isLh?1:0)+'" data-key="'+o.k+'" min="'+o.min+'" max="'+o.max+'" value="'+cur+'" style="width:66px;cursor:pointer;accent-color:var(--ink);"><span id="'+sid+'" style="font-family:var(--mono);font-size:9px;color:var(--ink-55);min-width:30px;text-align:right;">'+(isLh?(cur/100).toFixed(2):cur+'px')+'</span></div></div>'; }
  function twLabel(t){ return '<p style="font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);margin:14px 0 6px;padding-bottom:4px;border-bottom:1.5px solid var(--ink);">'+t+'</p>'; }
  var twPanel=mk('div'); twPanel.className='em-ui'; twPanel.style.cssText='position:fixed;bottom:74px;right:24px;z-index:9998;display:none;background:var(--paper);border:1.5px solid var(--rule-strong);border-radius:10px;padding:14px 16px;width:250px;max-height:80vh;overflow-y:auto;box-shadow:0 4px 24px rgba(0,0,0,.16);';
  twPanel.innerHTML=twLabel('Font sizes')+SIZES.map(function(s){return twRow(s,false);}).join('')+twLabel('Line heights')+LHS.map(function(h){return twRow(h,true);}).join('')+twLabel('Weight & style')+WSTYLE.map(wsRow).join('')+'<p id="tw-staged-ind" style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);margin:14px 0 6px;"></p><div style="display:flex;gap:6px;"><button id="tw-stage" style="flex:1;background:var(--surface);color:var(--ink);border:1.5px solid var(--ink);border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Save</button><button id="tw-reset" style="flex:1;background:transparent;border:1px solid var(--rule-strong);border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-55);cursor:pointer;">Reset</button></div><button id="tw-save" style="display:block;width:100%;margin-top:6px;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:8px 0;font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">&#8594; Save to Claude</button>';
  document.body.appendChild(twPanel);
  twPanel.querySelectorAll('input[type="range"]').forEach(function(inp){ inp.addEventListener('input',function(){ var sid='tw'+inp.dataset.key.replace(/[^a-z0-9]/gi,'_'),sp=document.getElementById(sid); if(inp.dataset.lh==='1'){ if(sp)sp.textContent=(inp.value/100).toFixed(2); twApplyLh(inp.dataset.key,inp.value); } else { if(sp)sp.textContent=inp.value+'px'; twApplyPx(inp.dataset.key,inp.value); } }); });
  twPanel.querySelectorAll('.ws-sel').forEach(function(sel){ sel.addEventListener('change',function(ev){ ev.stopPropagation(); var p=sel.value.split('|'),w=p[0],st=p[1]; document.documentElement.style.setProperty(sel.dataset.w,w); document.documentElement.style.setProperty(sel.dataset.s,st); var d=twLoad(); d[sel.dataset.w]=Number(w); d[sel.dataset.s]=st; localStorage.setItem(TW_STORE,JSON.stringify(d)); }); });
  updateStagedInd();
  document.getElementById('tw-stage').addEventListener('click',function(ev){ ev.stopPropagation(); twStageNow(); updateStagedInd(); var b=document.getElementById('tw-stage'),o=b.textContent; b.textContent='✓ Saved'; b.style.background='var(--ink)'; b.style.color='var(--paper)'; setTimeout(function(){b.textContent=o;b.style.background='var(--surface)';b.style.color='var(--ink)';},1200); });
  document.getElementById('tw-reset').addEventListener('click',function(ev){ ev.stopPropagation(); localStorage.removeItem(TW_STORE); localStorage.removeItem(TW_STAGED); SIZES.forEach(function(s){ document.documentElement.style.setProperty(s.k,s.d+'px'); }); LHS.forEach(function(h){ document.documentElement.style.setProperty(h.k,(h.d/100).toFixed(2)); }); WSTYLE.forEach(function(o){ document.documentElement.style.setProperty(o.w,o.wd); document.documentElement.style.setProperty(o.s,o.sd); }); twPanel.remove(); twBtn.remove(); });
  document.getElementById('tw-save').addEventListener('click',function(ev){ ev.stopPropagation(); var b=document.getElementById('tw-save'); var vals=twStagedCount()?twStaged():twLoad(); if(!Object.keys(vals).length){ b.textContent='— nothing to send'; setTimeout(function(){b.innerHTML='&#8594; Save to Claude';},1400); return; } fetch(INBOX,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'font-tweaks',source:'${slug}',values:vals,savedAt:new Date().toISOString()})}).then(function(){ localStorage.removeItem(TW_STAGED); updateStagedInd(); b.textContent='✓ Sent batch!'; setTimeout(function(){b.innerHTML='&#8594; Save to Claude';},2000); }).catch(function(){ b.textContent='✗ Server off'; setTimeout(function(){b.innerHTML='&#8594; Save to Claude';},2500); }); });
  var twBtn=mk('button'); twBtn.className='em-ui'; twBtn.textContent='Aa'; twBtn.title='Tweaks — font size & line height'; twBtn.style.cssText='position:fixed;bottom:24px;right:70px;z-index:9999;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--rule-strong);background:var(--paper);color:var(--ink);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.10);font-family:var(--display);line-height:1;';
  twBtn.addEventListener('click',function(){ twPanel.style.display=twPanel.style.display==='none'?'block':'none'; });
  document.body.appendChild(twBtn);

  renderMarkers();
}());
</script>`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
