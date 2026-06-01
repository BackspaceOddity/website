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

/** DEV-ONLY visual edit panel. Only injected when WS_EDIT_MODE=1, so the
 *  "Edit" button never appears on the client-facing production page. Posts
 *  edits to the local inbox server for Claude to pick up (Visual Edits
 *  Protocol). Storage key is namespaced per client slug. */
export function editModeScript(slug: string): string {
  return `<script>
(function () {
  var INBOX = 'http://localhost:8002/inbox';
  var STORE = 'pw-${slug}-edit-threads';
  function load(){ try { return JSON.parse(localStorage.getItem(STORE) || '{"threads":{}}'); } catch(e){ return {threads:{}}; } }
  function persist(d){ d.savedAt = new Date().toISOString(); localStorage.setItem(STORE, JSON.stringify(d)); }
  function cssSel(el){ if(el.id) return '#'+el.id; var path=[],n=el; while(n&&n!==document.body&&path.length<4){ if(n.id){path.unshift('#'+n.id);break;} var seg=n.tagName.toLowerCase(); if(n.classList&&n.classList.length) seg+='.'+n.classList[0]; path.unshift(seg); n=n.parentElement; } return path.join(' > '); }
  function mk(t){ return document.createElement(t); }
  var editBtn = mk('button'); editBtn.innerHTML='&#9998; Edit';
  editBtn.style.cssText='position:fixed;top:14px;right:16px;z-index:10000;background:var(--paper);color:var(--ink-55);border:1px solid var(--rule-strong);border-radius:6px;padding:5px 12px;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 1px 6px rgba(0,0,0,.10);transition:all .12s;line-height:1;white-space:nowrap;';
  document.body.appendChild(editBtn);
  var badge=mk('span'); badge.style.cssText='position:fixed;top:8px;right:8px;z-index:10001;background:var(--ink);color:var(--paper);border-radius:50%;min-width:18px;height:18px;padding:0 3px;font-size:10px;font-weight:600;text-align:center;line-height:18px;display:none;pointer-events:none;font-family:var(--mono);'; document.body.appendChild(badge);
  var ring=mk('div'); ring.style.cssText='position:fixed;pointer-events:none;z-index:9997;display:none;outline:2px solid rgba(1,28,0,.35);outline-offset:2px;background:rgba(1,28,0,.03);border-radius:4px;'; document.body.appendChild(ring);
  var dlg=mk('div'); dlg.style.cssText='position:fixed;z-index:10002;display:none;background:var(--paper);border:1.5px solid var(--rule-strong);border-radius:12px;padding:14px;width:300px;box-shadow:0 16px 48px rgba(0,0,0,.20);font-family:var(--text);';
  var MODE_BTN='flex:1;border:none;border-radius:4px;padding:3px 0;font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;';
  dlg.innerHTML='<div style="display:flex;gap:4px;margin-bottom:10px;background:var(--paper-soft);border-radius:6px;padding:3px;"><button id="em-mode-v" style="'+MODE_BTN+'background:transparent;color:var(--ink-40);">Visual</button><button id="em-mode-c" style="'+MODE_BTN+'background:var(--ink);color:var(--paper);">Copy</button></div><p id="em-lbl" style="font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-40);margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></p><textarea id="em-ta" rows="3" style="display:block;width:100%;box-sizing:border-box;border:1px solid var(--rule-strong);border-radius:6px;padding:9px 10px;font-family:var(--text);font-size:14px;line-height:1.5;resize:vertical;background:var(--surface);color:var(--ink);outline:none;"></textarea><div style="display:flex;gap:8px;margin-top:8px;"><button id="em-ok" style="flex:2;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:8px 0;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Save &#8629;</button><button id="em-cancel" style="flex:1;background:transparent;color:var(--ink-55);border:1px solid var(--rule-strong);border-radius:6px;padding:8px 0;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Cancel</button></div>';
  document.body.appendChild(dlg);
  var side=mk('div'); side.style.cssText='position:fixed;z-index:9999;display:none;top:50px;right:16px;width:272px;max-height:calc(100vh - 80px);overflow-y:auto;background:var(--paper);border:1.5px solid var(--rule-strong);border-radius:12px;padding:12px 14px;box-shadow:0 16px 48px rgba(0,0,0,.20);font-family:var(--text);';
  side.innerHTML='<div style="display:flex;gap:6px;margin-bottom:10px;"><button id="em-clear" style="flex:1;background:transparent;color:var(--ink-40);border:1px solid var(--rule-strong);border-radius:6px;padding:5px 0;font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">Clear all</button><button id="em-send" style="flex:2;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:5px 12px;font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;">&#8594; Send to Claude</button></div><div id="em-list"></div>';
  document.body.appendChild(side);
  function ours(el){ return el&&(editBtn.contains(el)||badge.contains(el)||ring.contains(el)||dlg.contains(el)||side.contains(el)); }
  function syncBadge(){ var n=Object.keys(load().threads).length; badge.textContent=n; badge.style.display=n?'block':'none'; if(n&&active&&side.style.display==='none') side.style.display='block'; if(!n&&!active) side.style.display='none'; renderPanel(); }
  function renderPanel(){ var threads=load().threads,list=document.getElementById('em-list'),ids=Object.keys(threads); if(!ids.length){ list.innerHTML='<p style="font-family:var(--mono);font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-40);text-align:center;padding:16px 0;line-height:1.8;">No edits yet.<br>Click any element to comment.</p>'; return; } list.innerHTML=ids.map(function(id){ var t=threads[id],e=t.element; var snip=e.textContent.slice(0,52)+(e.textContent.length>52?'…':''); var time=new Date(t.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); return '<div style="border-top:1px solid var(--rule);padding:10px 0;"><p style="font-family:var(--mono);font-size:9px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-40);margin-bottom:4px;">'+e.tag+' · '+time+'</p>'+(snip?'<p style="font-family:var(--text);font-size:12px;color:var(--ink-55);margin-bottom:4px;line-height:1.4;font-style:italic;">“'+snip+'”</p>':'')+'<p style="font-family:var(--text);font-size:13px;line-height:1.5;color:var(--ink);">'+t.prompt+'</p><button data-rm="'+id+'" style="background:none;border:none;color:var(--ink-40);font-family:var(--mono);font-size:9px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;padding:4px 0;">× remove</button></div>'; }).join(''); list.querySelectorAll('[data-rm]').forEach(function(b){ b.addEventListener('click',function(ev){ ev.stopPropagation(); var d=load(); delete d.threads[b.dataset.rm]; persist(d); syncBadge(); }); }); }
  var active=false,pending=null,editMode='copy';
  function setMode(m){ editMode=m; var mv=document.getElementById('em-mode-v'),mc=document.getElementById('em-mode-c'); if(!mv||!mc)return; mv.style.background=m==='visual'?'var(--ink)':'transparent'; mv.style.color=m==='visual'?'var(--paper)':'var(--ink-40)'; mc.style.background=m==='copy'?'var(--ink)':'transparent'; mc.style.color=m==='copy'?'var(--paper)':'var(--ink-40)'; }
  function activate(){ active=true; editBtn.innerHTML='✕ Exit'; editBtn.style.background='var(--ink)'; editBtn.style.color='var(--paper)'; document.body.style.cursor='crosshair'; side.style.display='block'; renderPanel(); document.addEventListener('mouseover',onHover,true); document.addEventListener('mouseout',onUnhover,true); document.addEventListener('click',onPick,true); }
  function deactivate(){ active=false; editBtn.innerHTML='&#9998; Edit'; editBtn.style.background='var(--paper)'; editBtn.style.color='var(--ink-55)'; document.body.style.cursor=''; ring.style.display='none'; closeDlg(); document.removeEventListener('mouseover',onHover,true); document.removeEventListener('mouseout',onUnhover,true); document.removeEventListener('click',onPick,true); if(!Object.keys(load().threads).length) side.style.display='none'; }
  editBtn.addEventListener('click',function(ev){ ev.stopPropagation(); active?deactivate():activate(); });
  function onHover(ev){ if(ours(ev.target)){ring.style.display='none';return;} var r=ev.target.getBoundingClientRect(); ring.style.top=r.top+'px'; ring.style.left=r.left+'px'; ring.style.width=r.width+'px'; ring.style.height=r.height+'px'; ring.style.display='block'; }
  function onUnhover(){ ring.style.display='none'; }
  function onPick(ev){ if(ours(ev.target))return; ev.preventDefault(); ev.stopPropagation(); pending=ev.target; var r=ev.target.getBoundingClientRect(); var top=r.bottom+8; if(top+230>window.innerHeight) top=Math.max(8,r.top-240); var left=Math.min(ev.clientX,window.innerWidth-316); if(left<8)left=8; dlg.style.top=top+'px'; dlg.style.left=left+'px'; dlg.style.display='block'; var tag=ev.target.tagName.toLowerCase(); var cls=ev.target.classList[0]?'.'+ev.target.classList[0]:''; var text=ev.target.textContent.trim().slice(0,42); document.getElementById('em-lbl').textContent=tag+cls+': "'+text+'"'; var ta=document.getElementById('em-ta'); ta.value=''; ta.placeholder=editMode==='copy'?'What copy change?':'What layout/style change?'; setTimeout(function(){ta.focus();},40); ta.onkeydown=function(e){ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();saveEdit();} if(e.key==='Escape')closeDlg(); }; }
  function closeDlg(){ dlg.style.display='none'; pending=null; }
  function saveEdit(){ var ta=document.getElementById('em-ta'),txt=ta.value.trim(); if(!txt){closeDlg();return;} var id='edit-'+Date.now(),d=load(); d.threads[id]={id:id,type:editMode,prompt:txt,element:{tag:pending.tagName.toLowerCase(),className:pending.className||'',textContent:pending.textContent.trim().slice(0,100),selector:cssSel(pending)},status:'pending',createdAt:new Date().toISOString()}; persist(d); closeDlg(); syncBadge(); var prev=pending.style.outline; pending.style.outline='2px solid var(--ink)'; var el=pending; setTimeout(function(){el.style.outline=prev;},700); }
  document.getElementById('em-ok').addEventListener('click',function(ev){ev.stopPropagation();saveEdit();});
  document.getElementById('em-cancel').addEventListener('click',function(ev){ev.stopPropagation();closeDlg();});
  document.getElementById('em-send').addEventListener('click',function(ev){ ev.stopPropagation(); var b=document.getElementById('em-send'),data=load(); if(!Object.keys(data.threads).length){ b.textContent='— no edits'; setTimeout(function(){b.innerHTML='&#8594; Send to Claude';},1200); return; } data.source='${slug}'; fetch(INBOX,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(function(){ persist({threads:{}}); syncBadge(); b.textContent='✓ Sent!'; setTimeout(function(){b.innerHTML='&#8594; Send to Claude';},2000); }).catch(function(){ b.textContent='✗ Server off'; setTimeout(function(){b.innerHTML='&#8594; Send to Claude';},2500); }); });
  document.getElementById('em-clear').addEventListener('click',function(ev){ ev.stopPropagation(); if(confirm('Remove all pending edits?')){ persist({threads:{}}); syncBadge(); } });
  document.getElementById('em-mode-v').addEventListener('click',function(ev){ ev.stopPropagation(); setMode('visual'); });
  document.getElementById('em-mode-c').addEventListener('click',function(ev){ ev.stopPropagation(); setMode('copy'); });
  document.addEventListener('keydown',function(ev){ if(ev.key!=='Escape')return; if(dlg.style.display!=='none')closeDlg(); else if(active)deactivate(); });

  /* ── Tweaks panel — live CSS-var controls (font size + line height) ── */
  var TW_STORE='pw-${slug}-tweaks';
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
  function twApplyPx(k,v){ document.documentElement.style.setProperty(k,v+'px'); var s=twLoad(); s[k]=Number(v); localStorage.setItem(TW_STORE,JSON.stringify(s)); }
  function twApplyLh(k,v){ document.documentElement.style.setProperty(k,(v/100).toFixed(2)); var s=twLoad(); s[k]=Number(v); localStorage.setItem(TW_STORE,JSON.stringify(s)); }
  function twRow(o,isLh){ var cur=twSaved[o.k]!==undefined?twSaved[o.k]:o.d; var sid='tw'+o.k.replace(/[^a-z0-9]/gi,'_'); return '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--rule);"><span style="font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-40);min-width:92px;">'+o.l+'</span><div style="display:flex;align-items:center;gap:5px;"><input type="range" data-lh="'+(isLh?1:0)+'" data-key="'+o.k+'" min="'+o.min+'" max="'+o.max+'" value="'+cur+'" style="width:66px;cursor:pointer;accent-color:var(--ink);"><span id="'+sid+'" style="font-family:var(--mono);font-size:9px;color:var(--ink-55);min-width:30px;text-align:right;">'+(isLh?(cur/100).toFixed(2):cur+'px')+'</span></div></div>'; }
  function twLabel(t){ return '<p style="font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-40);margin:12px 0 4px;">'+t+'</p>'; }
  var twPanel=mk('div'); twPanel.style.cssText='position:fixed;bottom:74px;right:24px;z-index:9998;display:none;background:var(--paper);border:1.5px solid var(--rule-strong);border-radius:10px;padding:14px 16px;width:250px;max-height:80vh;overflow-y:auto;box-shadow:0 4px 24px rgba(0,0,0,.16);';
  twPanel.innerHTML=twLabel('Font sizes')+SIZES.map(function(s){return twRow(s,false);}).join('')+twLabel('Line heights')+LHS.map(function(h){return twRow(h,true);}).join('')+'<div style="display:flex;gap:6px;margin-top:14px;"><button id="tw-save" style="flex:2;background:var(--ink);color:var(--paper);border:none;border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">&#8594; Save to Claude</button><button id="tw-reset" style="flex:1;background:transparent;border:1px solid var(--rule-strong);border-radius:6px;padding:7px 0;font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-55);cursor:pointer;">Reset</button></div>';
  document.body.appendChild(twPanel);
  twPanel.querySelectorAll('input[type="range"]').forEach(function(inp){ inp.addEventListener('input',function(){ var sid='tw'+inp.dataset.key.replace(/[^a-z0-9]/gi,'_'),sp=document.getElementById(sid); if(inp.dataset.lh==='1'){ if(sp)sp.textContent=(inp.value/100).toFixed(2); twApplyLh(inp.dataset.key,inp.value); } else { if(sp)sp.textContent=inp.value+'px'; twApplyPx(inp.dataset.key,inp.value); } }); });
  document.getElementById('tw-reset').addEventListener('click',function(ev){ ev.stopPropagation(); localStorage.removeItem(TW_STORE); SIZES.forEach(function(s){ document.documentElement.style.setProperty(s.k,s.d+'px'); }); LHS.forEach(function(h){ document.documentElement.style.setProperty(h.k,(h.d/100).toFixed(2)); }); twPanel.remove(); twBtn.remove(); });
  document.getElementById('tw-save').addEventListener('click',function(ev){ ev.stopPropagation(); var b=document.getElementById('tw-save'); fetch(INBOX,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'font-tweaks',source:'${slug}',values:twLoad(),savedAt:new Date().toISOString()})}).then(function(){ b.textContent='✓ Sent!'; setTimeout(function(){b.innerHTML='&#8594; Save to Claude';},2000); }).catch(function(){ b.textContent='✗ Server off'; setTimeout(function(){b.innerHTML='&#8594; Save to Claude';},2500); }); });
  var twBtn=mk('button'); twBtn.textContent='Aa'; twBtn.title='Tweaks — font size & line height'; twBtn.style.cssText='position:fixed;bottom:24px;right:70px;z-index:9999;width:40px;height:40px;border-radius:50%;border:1.5px solid var(--rule-strong);background:var(--paper);color:var(--ink);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.10);font-family:var(--display);line-height:1;';
  twBtn.addEventListener('click',function(){ twPanel.style.display=twPanel.style.display==='none'?'block':'none'; });
  document.body.appendChild(twBtn);

  syncBadge();
}());
</script>`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
