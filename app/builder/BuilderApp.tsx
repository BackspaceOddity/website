// @ts-nocheck
'use client';
/* eslint-disable */
/* Ported verbatim from the Claude Design export "Landing Builder.dc.html" (BSO-658).
   Faithful import: only the Claude Design runtime coupling was swapped for React 19
   (base class, mount, window.claude.complete → /api/builder/generate, asset URLs).
   Design choices (ABC Schengen / Inter / JetBrains Mono / GT Eesti, palette, layout) untouched. */
import React from 'react';
import { BT_COMPONENTS, BT_PAGES, BT_TYPE_NAMES, BT_SECTIONS } from './blocks/realpages';
import { UREMBO_SECTIONS } from './blocks/urembo';
import { btVarStyle, ROLE_VARS } from './btVars';

// Default proposal design-system for a NEW page (BSO-658). The two real pages
// (p8fig / pbt) ship their own stylesheet; a blank page needs one too so any
// real `bt:` section the user assembles renders styled. `pbt` is the fuller
// brand-transformation system (superset of section types) — the canonical
// proposal DS. The two stylesheets share `bt-` class names and define :root
// vars + `body:has(.bt-page)`, so they CANNOT both be loaded at once — a new
// page picks ONE (pbt) and every section renders in that DS's visual language.
const DEFAULT_PAGE_DS = 'pbt';

// ---------- Design-system registry (BSO-658 Phase 1) ----------
// A page belongs to ONE design system, chosen at creation and persisted on the
// `ds` column of builder_pages (default 'bso'). 8Figures + Brand Transformation
// are the SAME system ('bso' = Backspace Oddity DS) shown as different per-page
// instances — NOT separate systems. Urembo Hub is a genuinely different DS,
// registered here as a placeholder until its sections + CSS are ported (Phase 2).
//   id      — registry/DB identifier stored on `ds`
//   name    — human label for the chooser + Tweaks header
//   cssKey  — stylesheet served at /builder-css/<cssKey>.css (null = none yet)
//   sections— Library "Sections" tab source for pages on this DS
// Adding a 3rd system = one entry here.
const DESIGN_SYSTEMS = [
  { id: 'bso',    name: 'Backspace Oddity', cssKey: 'pbt',    sections: BT_SECTIONS },
  { id: 'urembo', name: 'Green light',      cssKey: 'urembo', sections: UREMBO_SECTIONS },
  { id: 'kos',    name: 'Knowledge OS',     cssKey: 'kos',    sections: BT_SECTIONS },
  { id: 'quiet',  name: 'Quiet (Merz)',     cssKey: 'quiet',  sections: BT_SECTIONS },
];
const DEFAULT_DS_ID = 'bso';
// Resolve a DS id -> registry entry (fallback to the default 'bso' system).
function getDs(id){ return DESIGN_SYSTEMS.find(d => d.id === id) || DESIGN_SYSTEMS.find(d => d.id === DEFAULT_DS_ID); }
// A "real" DS block belongs to either the bt: (Backspace Oddity) or ub: (Urembo) DS.
// Both render through BT_COMPONENTS + the .bt-page wrapper, so the builder gates them
// the same way (BSO-658 Pass 1 — Urembo port).
function isDsType(t){ const s=String(t||''); return s.indexOf('bt:')===0 || s.indexOf('ub:')===0; }

// Human labels + representative on-canvas selector per bt design-system role.
// The selector seeds the panel's "current value" via getComputedStyle.
const BT_ROLE_META = {
  h1:      { label: 'Heading 1',  sel: '.bt-hero__title' },
  h2:      { label: 'Heading 2',  sel: '.bt-h2' },
  lead:    { label: 'Lead',       sel: '.bt-sublabel, .bt-phase__name' },
  card:    { label: 'Card title', sel: '.bt-ep__name, .bt-proj__title' },
  body:    { label: 'Body',       sel: '.bt-intro' },
  eyebrow: { label: 'Eyebrow',    sel: '.bt-eyebrow' },
  button:  { label: 'Button',     sel: '.bt-pill, .bt-cta-link' },
};
// Display metadata per overridable field: label, unit suffix, input kind.
const BT_FIELD_META = {
  fontSize:      { label: 'Font size',      unit: 'px',  step: 1 },
  lineHeight:    { label: 'Line height',    unit: '',    step: 0.05 },
  fontWeight:    { label: 'Font weight',    unit: '',    step: 100, weights: [300, 400, 500, 600, 700] },
  letterSpacing: { label: 'Letter spacing', unit: 'em',  step: 0.01 },
  fontFamily:    { label: 'Font family',    unit: '',    text: true },
};

class BuilderApp extends React.Component {
  constructor(props){
    super(props);
    this.DEFAULT_STYLES = {
      label:    {family:'mono',   size:11, lh:1.4,  weight:500, tracking:0.14, upper:true},
      heading:  {family:'display',size:42, lh:1.15, weight:600, tracking:-0.02,upper:false},
      statement:{family:'display',size:22, lh:1.3,  weight:500, tracking:-0.01,upper:false},
      body:     {family:'text',   size:20, lh:1.5,  weight:400, tracking:0,    upper:false},
      list:     {family:'text',   size:19, lh:1.5,  weight:400, tracking:0,    upper:false},
    };
    this.ROLES_BY_TYPE = {
      hero:['label','heading'], statement:['label','heading','body'],
      twocol:['label','statement','body'], casestudy:['label','heading','body'],
      projectgrid:['label','heading','statement','body'], footer:['label','heading','body'],
      custom:['label','heading','body'],
    };
    this.TEMPLATES = [
      {type:'hero',        name:'Hero well',     desc:'Dark forest well · grain gradient · big statement'},
      {type:'statement',   name:'Statement',     desc:'Large editorial statement on cream'},
      {type:'twocol',      name:'Two-column copy',desc:'Lede + two body columns'},
      {type:'casestudy',   name:'Case study',    desc:'Image well + title + metric'},
      {type:'projectgrid', name:'Project grid',  desc:'Grid of project tiles'},
      {type:'footer',      name:'Footer',        desc:'Contact · office · lockup'},
    ];
    this.PAGES = [
      {id:'p8fig', tab:'bso', name:'8FIGURES — Brand Sprint', img:'magenta-green', owner:'Yegor', edited:'just now', status:'Draft', real:'p8fig'},
      {id:'pbt', tab:'bso', name:'Brand transformation', img:'terracotta', owner:'Anna', edited:'just now', status:'Draft', real:'pbt'},
    ];
    this.ARCHETYPES = [
      {id:'landing',  name:'Landing page',   desc:'Hero · statement · proof · footer', recipe:['hero','statement','twocol','projectgrid','footer'], img:'magenta-green'},
      {id:'proposal', name:'Client proposal',desc:'Hero · approach · case study · footer', recipe:['hero','twocol','casestudy','footer'], img:'emerald'},
      {id:'casepage', name:'Case study',     desc:'Hero · case study · statement', recipe:['hero','casestudy','statement','footer'], img:'terracotta'},
      {id:'blank',    name:'Blank',          desc:'Start from an empty canvas', recipe:[], img:'warm'},
    ];
    this.state = {
      screen:'boot', theme:'light', loginEmail:'', loginPw:'', loginBusy:false, loginErr:'', loginMode:'password',
      dashTab:'bso', dashView:'rows', dashPageIdx:0,
      editorLayout:'lr', tweaksStyle:'stacked',
      newPageOpen:false, newPageStep:1, newPageArche:null, newPageName:'', newPageDsId:DEFAULT_DS_ID,
      pageTitle:'', pageTab:'bso', blocks:[], styles:this.clone(this.DEFAULT_STYLES), pages:this.PAGES.slice(),
      selectedId:null, selectedRole:null, editMode:true, libraryOpen:true, tweaksOpen:true, libW:248, tweaksW:248, dsRole:'heading',
      askPrompt:'', askState:'idle', askResult:null, customTemplates:[], savedTemplates:[], libTab:'sections', draggingAsset:null, assets:[{id:'a1',name:'Magenta · green',val:'magenta-green'},{id:'a2',name:'Terracotta',val:'terracotta'},{id:'a3',name:'Emerald',val:'emerald'},{id:'a4',name:'Warm',val:'warm'}],
      locked:false, lockOwner:'Marnix', versionsOpen:false, versions:[],
      variationsOpen:false, menuOpen:false, draggingType:null, dragIndex:null, dropAt:null,
      libPicked:null, insertIndex:null, gapHover:null,
      toast:null, canvasZoom:1, previewVersionId:null, imgTarget:null, currentPage:null, analyticsPage:null, analyticsFrom:'dashboard', deployPage:null, deployFrom:'dashboard', deploySubdomain:'', deployStatus:'idle', deployLogs:[], deployStage:0, deployHost:'', deployUrl:'',
      realPage:null, pageDs:null, pageDsId:DEFAULT_DS_ID, saveState:'saved', lastSavedBy:null, tip:null, libOpen:null, libExpanded:{}, tweakExpanded:{},
      btStyles:{}, roleDefaults:{},
      claudeEdit:null, claudeEditPick:null, claudeEditHover:null,
    };
    this.uid = 0;
    this.fileInput = null;
  }
  componentDidMount(){
    this._bindEsc();
    // Tab-close safety net for the debounced auto-save (BSO-664): flush a pending
    // dirty edit on unload. keepalive on the PUT lets the request finish after navigation.
    this._onBeforeUnload=()=>{ if(this.state.saveState==='dirty') this.savePage(); };
    if(typeof window!=='undefined') window.addEventListener('beforeunload', this._onBeforeUnload);
    try{ const raw = localStorage.getItem('bso_ds_styles'); if(raw){ this.dsStyles = JSON.parse(raw); } }catch(e){}
    // Seed the pages list from the last-good snapshot so a transient /api/builder/pages
    // hiccup (e.g. an intermittent 401 from an expiring cookie) can NEVER blank the
    // dashboard — loadPages refreshes it on success. (BSO-658 disappearing-pages.)
    try{ const pc = JSON.parse(localStorage.getItem('bso_pages_cache')||'null'); if(Array.isArray(pc) && pc.length){ this.setState({pages:pc}); } }catch(e){}
    // Deploy / Analytics open in their own tab via ?screen=…&page=… — parse it here.
    let pend=null;
    try{ const q=new URLSearchParams(window.location.search); const scr=q.get('screen'); if(scr==='deploy'||scr==='analytics'){ const pid=q.get('page'); const pg=this.PAGES.find(p=>p.id===pid)||{id:pid||'cur', name:decodeURIComponent(q.get('name')||'Page'), status:'Draft'}; const from=q.get('from')||'dashboard'; pend={scr,pg,from}; } }catch(e){}
    // Restore an existing session. Initial screen is 'boot' (a quiet splash) so a
    // signed-in user never sees the login form flash on reload — /me decides the real
    // screen here: authed -> restore the view, not-authed/error -> login.
    fetch('/api/builder/me/').then(r=>r.json()).then(d=>{
      if(d && d.authed){
        this.setState(s=> ({loginEmail:d.email||s.loginEmail}), ()=>{ if(pend){ if(pend.scr==='deploy') this.openDeploy(pend.pg,pend.from); else this.openAnalytics(pend.pg,pend.from); } });
        this.loadSavedTemplates();
        // loadPages then restores the open page from ?p=<id> (reload returns you to the
        // page you had open, not the dashboard). If pend already drove deploy/analytics,
        // don't override that view.
        this.loadPages(()=>{ if(!pend) this.restoreOpenPage(); });
      } else {
        this.setState({screen:'login'});
      }
    }).catch(()=>{ this.setState({screen:'login'}); });
    // Focus/visibility refetch + light background poll — refresh live without a manual
    // reload (the "most SaaS" lightweight path). Handles stored on the instance so
    // componentWillUnmount can remove every one.
    this._onFocus=()=>this.refreshLive();
    this._onVis=()=>this.refreshLive();
    if(typeof window!=='undefined'){ window.addEventListener('focus', this._onFocus); document.addEventListener('visibilitychange', this._onVis); this._liveT=setInterval(()=>this.refreshLive(), 25000); }
  }
  // After loadPages has populated this.state.pages, restore the page named in ?p=<id>.
  // Open the FULL page row (not a bare id) so title/tab/ds are correct before the
  // per-page GET resolves; if no/unknown ?p, fall back to the dashboard.
  restoreOpenPage(){
    if(typeof window==='undefined'){ this.setState({screen:'dashboard'}); return; }
    let pid=null; try{ pid=new URLSearchParams(window.location.search).get('p'); }catch(e){}
    const pg = pid && (this.state.pages||[]).find(p=>String(p.id)===String(pid));
    if(pg){ this.openPage(pg); } else { this.setState({screen:'dashboard'}); }
  }
  // Re-fetch on window focus / tab becomes visible / background poll. Runs ONLY when
  // the tab is actually visible. Quiet by design — no toast spam on each poll.
  refreshLive(){
    if(typeof document!=='undefined' && document.visibilityState!=='visible') return;
    // Keep the session fresh; if it lapsed, no-op rather than yanking the user mid-edit.
    fetch('/api/builder/me/').then(r=>r.json()).then(d=>{
      if(!(d && d.authed)) return; // session lapsed — do nothing disruptive
      if(this.state.screen==='dashboard'){ this.loadPages(); return; }
      if(this.state.screen==='editor'){
        const rp=this.state.realPage; if(!rp) return;
        // SAFETY-CRITICAL: only overwrite the editor's blocks/styles when the page is
        // 'saved'. If 'dirty'/'saving'/'loading', a refetch would clobber the user's
        // unsaved edits — we already had one data-loss incident here; do not reintroduce.
        if(this.state.saveState!=='saved') return;
        fetch('/api/builder/pages/'+encodeURIComponent(rp)+'/').then(r=>r.json()).then(d2=>{
          if(this.state.realPage!==rp) return;           // navigated away mid-fetch
          if(this.state.saveState!=='saved') return;     // user started editing mid-fetch — re-check the guard
          if(d2 && d2.saved && d2.page && Array.isArray(d2.page.blocks)){
            const savedStyles=d2.page.styles?this.clone(d2.page.styles):this.state.styles;
            this.setState({blocks:this.clone(d2.page.blocks), styles:savedStyles, btStyles:(savedStyles&&savedStyles.bt)?this.clone(savedStyles.bt):{}, lastSavedBy:d2.page.updated_by||this.state.lastSavedBy});
          }
        }).catch(()=>{});
      }
    }).catch(()=>{});
  }
  // Load the shared saved-template library (BSO-658). Best-effort — failure leaves an empty Saved tab.
  loadSavedTemplates(){
    fetch('/api/builder/templates/').then(r=>r.json()).then(d=>{
      if(d && Array.isArray(d.templates)) this.setState({savedTemplates:d.templates});
    }).catch(()=>{});
  }
  // Pretty "edited" label from an ISO timestamp.
  agoLabel(iso){
    if(!iso) return 'just now';
    const t=new Date(iso).getTime(); if(isNaN(t)) return 'just now';
    const s=Math.max(0, Math.floor((Date.now()-t)/1000));
    if(s<60) return 'just now'; const m=Math.floor(s/60); if(m<60) return m+'m ago';
    const hh=Math.floor(m/60); if(hh<24) return hh+'h ago'; const dd=Math.floor(hh/24); return dd+'d ago';
  }
  // DB-backed dashboard list (BSO-658). The two built-in real pages (p8fig/pbt) carry
  // rich metadata in this.PAGES (img/owner); DB-only pages get sane defaults. Merge on
  // id so real pages keep their styling and any saved page (incl. ones created from a
  // template) shows up and survives reload. Best-effort: a fetch failure leaves the
  // hardcoded PAGES so the dashboard is never empty.
  loadPages(done){
    const after=()=>{ if(typeof done==='function') done(); };
    fetch('/api/builder/pages/').then(r=>r.json()).then(d=>{
      if(!d || !Array.isArray(d.pages)){ after(); return; }
      const meta={}; this.PAGES.forEach(p=>{ meta[p.id]=p; });
      const imgs=['magenta-green','terracotta','emerald','warm'];
      const merged=d.pages.filter(row=>!row.archived).map(row=>{
        const base=meta[row.id];
        if(base) return {...base, name:row.title||base.name, tab:row.tab||base.tab, ds:row.ds||'bso', edited:this.agoLabel(row.updated_at)};
        return {
          id:row.id, tab:row.tab||'bso', name:row.title||'Untitled page',
          img:imgs[this.hashStr(row.id)%imgs.length],
          owner:(row.updated_by||'').split('@')[0]||'You', edited:this.agoLabel(row.updated_at),
          status:'Draft', real:row.real_page||row.id, ds:row.ds||'bso',
        };
      });
      // Keep any built-in real page that has no DB row yet (defensive — both ship rows).
      this.PAGES.forEach(p=>{ if(!merged.some(m=>m.id===p.id)) merged.push(p); });
      // Cache the good list so a later transient failure can fall back to it (BSO-658).
      try{ localStorage.setItem('bso_pages_cache', JSON.stringify(merged)); }catch(e){}
      this.setState({pages:merged}, after);
    }).catch(after);
  }
  // Open the deploy / analytics screen in a fresh browser tab (action, not a panel toggle).
  openInTab(scr, pg, from){ if(typeof window==='undefined') return; const id=encodeURIComponent((pg&&pg.id)||'cur'); const name=encodeURIComponent((pg&&pg.name)||''); const f=from?('&from='+encodeURIComponent(from)):''; window.open('/builder/?screen='+scr+'&page='+id+'&name='+name+f, '_blank', 'noopener'); }
  // Editor topbar "Deploy ↗": deploy the page currently open in the editor. For a real
  // page the publish API keys off the DB row id, which equals this.state.realPage — so the
  // deploy tab MUST carry that id, not the synthetic 'cur' (which has no DB row → 404).
  openDeployFromEditor(){
    const rp=this.state.realPage;
    if(!rp){ this.toast('Save this page before publishing.'); return; }
    this.openInTab('deploy', {id:rp, name:this.state.pageTitle||'Page', status:'Draft'}, 'editor');
  }
  componentWillUnmount(){ if(this._ro){ this._ro.disconnect(); } if(this._dep){ this._dep.forEach(clearTimeout); } if(this._onKey){ window.removeEventListener('keydown', this._onKey); } if(this._onBeforeUnload){ window.removeEventListener('beforeunload', this._onBeforeUnload); } if(this._onFocus){ window.removeEventListener('focus', this._onFocus); } if(this._onVis){ document.removeEventListener('visibilitychange', this._onVis); } if(this._liveT){ clearInterval(this._liveT); this._liveT=null; } }
  // Esc clears an armed gap / picked tile (BSO-658).
  _bindEsc(){ if(this._onKey) return; this._onKey=(e)=>{ if(e.key==='Escape'){ if(this.state.claudeEditPick && !this.state.claudeEdit){ this.cancelClaudeEditPick(); return; } this.clearArm(); } }; if(typeof window!=='undefined') window.addEventListener('keydown', this._onKey); }
  resizeBar(which){ const h=React.createElement; return h('div',{onMouseDown:e=>this.startResize(e,which), title:'Drag to resize', style:{flex:'0 0 7px', cursor:'col-resize', display:'flex', alignItems:'stretch', justifyContent:'center', background:'var(--surface)', zIndex:6}}, h('div',{style:{width:1, background:'var(--rule)'}})); }
  startResize(e, which){ e.preventDefault(); const startX=e.clientX; const key=which==='lib'?'libW':'tweaksW'; const startW=this.state[key]; const lr=this.state.editorLayout==='lr'; const dir=(which==='lib')?(lr?1:-1):(lr?-1:1); const move=ev=>{ let w=startW+dir*(ev.clientX-startX); w=Math.max(168,Math.min(480,w)); this.setState({[key]:w}); }; const up=()=>{ window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up); document.body.style.cursor=''; document.body.style.userSelect=''; }; window.addEventListener('mousemove',move); window.addEventListener('mouseup',up); document.body.style.cursor='col-resize'; document.body.style.userSelect='none'; }
  onCanvasRef = (el)=>{ this._canvasEl=el; if(el){ this.measureCanvas(); if(!this._ro){ this._ro=new ResizeObserver(()=>this.measureCanvas()); } this._ro.disconnect(); this._ro.observe(el); } };
  measureCanvas(){ if(!this._canvasEl) return; const w=this._canvasEl.clientWidth; const z=Math.max(0.22, Math.min(1, (w-64)/1160)); if(Math.abs(z-(this.state.canvasZoom||1))>0.004){ this.setState({canvasZoom:z}); } }
  clone(o){ return JSON.parse(JSON.stringify(o)); }
  nid(p){ this.uid++; return (p||'b')+'_'+Date.now().toString(36)+'_'+this.uid; }
  grad(name){ return '/builder-assets/gradient-'+name+'.jpg'; }
  imgUrl(v){ if(!v) return this.grad('magenta-green'); return /^(https?:|blob:|data:|uploads\/|assets\/)/.test(v) ? v : this.grad(v); }
  setBlockImg(id,val){ this.setState(s=>({blocks:s.blocks.map(b=> b.id===id ? {...b, props:{...b.props, img:val}} : b)})); }
  setTileImg(id,i,val){ this.setState(s=>({blocks:s.blocks.map(b=>{ if(b.id!==id) return b; const tiles=b.props.tiles.map((t,j)=> j===i?{...t,img:val}:t); return {...b, props:{...b.props, tiles}}; })})); }
  uploadAsset(e){ const f=e.target.files&&e.target.files[0]; if(!f) return; const url=URL.createObjectURL(f); this.setState(s=>({assets:[...s.assets, {id:this.nid('a'), name:(f.name||'Upload').replace(/\.[^.]+$/,''), val:url}]})); this.toast('Image added to library'); e.target.value=''; }
  deleteAsset(id){ this.setState(s=>({assets:s.assets.filter(a=>a.id!==id)})); this.toast('Image removed from library'); }
  slugify(s){ return (String(s||'page')).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,32) || 'page'; }
  openDeploy(p, from){ this.setState({screen:'deploy', deployPage:p, deployFrom:from||'dashboard', deploySubdomain:this.slugify(p.name), deployStatus:'idle', deployLogs:[], deployStage:0, deployHost:'', deployUrl:'', deployStale:false});
    // BSO-670: surface whether the draft has changed since the last publish, so the
    // user knows the live page is stale and needs a republish.
    if(p && p.id && p.id!=='cur'){ fetch('/api/builder/pages/'+encodeURIComponent(p.id)+'/').then(r=>r.json()).then(d=>{ const pub=d&&d.published_at; const stale=pub && d.updated_at && new Date(d.updated_at).getTime() > new Date(pub).getTime(); this.setState({deployStale:!!stale}); }).catch(()=>{}); }
  }
  nowTime(){ const d=new Date(), z=n=>String(n).padStart(2,'0'); return z(d.getHours())+':'+z(d.getMinutes())+':'+z(d.getSeconds()); }
  pushLog(text, ok){ this.setState(s=>({deployLogs:[...s.deployLogs, {t:this.nowTime(), text, ok:!!ok}]}), ()=>{ if(this._logEl) this._logEl.scrollTop=this._logEl.scrollHeight; }); }
  // Real publish pipeline (BSO-658). POSTs the saved blocks to the publish API,
  // then verifies the public route actually serves before flipping to "live".
  async startDeploy(){
    if(this.state.deployStatus==='running') return;
    const slug=this.state.deploySubdomain||'';
    const p=this.state.deployPage;
    if(!slug){ this.toast('Enter an address first'); return; }
    if(!p || !p.id){ this.toast('No page to publish'); return; }
    const host='kern.backspaceoddity.com/published/'+slug;
    this.setState({deployStatus:'running', deployLogs:[], deployStage:1, deployHost:host, deployUrl:''});
    // Stage 1 \u2014 Snapshot
    this.pushLog('Snapshotting current saved blocks\u2026', true);
    // Stage 2 \u2014 Validate
    this.setState({deployStage:2});
    this.pushLog('Validating address '+slug+'\u2026');
    // Stage 3 \u2014 Publish
    this.setState({deployStage:3});
    let data;
    try{
      const res=await fetch('/api/builder/pages/'+encodeURIComponent(p.id)+'/publish', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug})});
      data=await res.json().catch(()=>({}));
      if(!res.ok){
        const msg=res.status===409? 'Address already taken \u2014 pick another' : (data && data.error) || ('publish failed ('+res.status+')');
        this.pushLog(msg, false);
        this.setState({deployStatus:'failed'});
        this.toast(msg);
        return;
      }
    }catch(err){
      this.pushLog('Publish request failed \u2014 '+(err&&err.message||'network error'), false);
      this.setState({deployStatus:'failed'});
      this.toast('Publish failed');
      return;
    }
    this.pushLog('Published \u2014 '+data.url, true);
    // Stage 4 \u2014 Live: verify the public route actually serves before claiming live.
    this.setState({deployStage:4});
    try{
      const check=await fetch(data.url, {cache:'no-store'});
      if(!check.ok) throw new Error('GET '+data.url+' \u2192 '+check.status);
    }catch(err){
      this.pushLog('Live check failed \u2014 '+(err&&err.message||'unreachable'), false);
      this.setState({deployStatus:'failed'});
      this.toast('Published, but live check failed');
      return;
    }
    const liveUrl='https://kern.backspaceoddity.com'+data.url;
    this.pushLog('Live at '+liveUrl, true);
    this.setState({deployStatus:'live', deployUrl:liveUrl});
    this.toast('Published to '+data.url);
  }
  // Back from the deploy screen. When deploy was opened from the editor it lives in its
  // own tab (no editor mounted here), so closing the tab returns to the originating editor;
  // if this tab can't be closed (or deploy was reached in-app), fall back to the screen state.
  backFromDeploy(){
    // Deploy always opens in its OWN tab (openInTab → window.open). 'Back' closes that tab,
    // returning to the editor/dashboard tab that opened it. window.open uses `noopener`, so
    // window.opener is null — the old gate never fired and it fell through to screen:'editor'
    // in THIS tab, which never loaded the page → a blank canvas (the reported "empty page"
    // bug). Close the tab; if the browser blocks close, land on the dashboard (populated),
    // NEVER the editor.
    if(typeof window!=='undefined'){
      try{ history.replaceState(null,'','/builder'); }catch(e){}
      try{ window.close(); }catch(e){}
    }
    this.setState({screen:'dashboard', realPage:null, deployPage:null, selectedId:null, selectedRole:null});
  }
  renderDeploy(){
    const h=React.createElement; const p=this.state.deployPage; if(!p) return null;
    const SCH="'ABC Schengen','Inter',system-ui,sans-serif"; const MONO="'JetBrains Mono',monospace";
    const st=this.state.deployStatus; const slug=this.state.deploySubdomain||'page'; const host='kern.backspaceoddity.com/published/'+slug; const liveUrl=this.state.deployUrl||('https://'+host); const stage=this.state.deployStage;
    const bmap={idle:['Not deployed','var(--muted)'], running:['Deploying\u2026','var(--ink)'], live:['Live','#1CAA00'], failed:['Failed','#FF2A00']}; const bm=bmap[st]||bmap.idle;
    const badge=h('span',{style:{display:'inline-flex', alignItems:'center', gap:7, fontFamily:MONO, fontSize:'11px', letterSpacing:'.06em', textTransform:'uppercase', color:bm[1], border:'1px solid '+bm[1], borderRadius:999, padding:'5px 11px'}}, h('span',{style:{width:7,height:7,borderRadius:99, background:bm[1], animation:st==='running'?'bsoblink 1.2s infinite':'none'}}), bm[0]);
    const stages=['Snapshot','Validate','Publish','Live'];
    return h('div',{className:'bso-scroll', style:{height:'100%', overflowY:'auto', background:'var(--paper)'}},
      h('div',{style:{maxWidth:920, margin:'0 auto', padding:'34px 32px 72px'}},
        h('button',{onClick:()=>this.backFromDeploy(), style:{background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'13px', fontFamily:'inherit', padding:0, marginBottom:18}}, '\u2190 '+(this.state.deployFrom==='editor'?'Back to editor':'All pages')),
        h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16, marginBottom:26, flexWrap:'wrap'}},
          h('div',null, h('div',{style:this.mono({marginBottom:10})}, 'Deploy'), h('h1',{style:{margin:0, fontSize:'34px', fontWeight:700, letterSpacing:'-0.02em', fontFamily:SCH}}, p.name)), badge),
        h('div',{style:{border:'1px solid var(--rule)', borderRadius:12, background:'var(--surface)', padding:'18px 20px', marginBottom:18}},
          h('div',{style:this.mono({fontSize:'10px', marginBottom:12})}, 'Public address'),
          h('div',{style:{display:'flex', alignItems:'center', gap:0, flexWrap:'wrap'}},
            h('span',{style:{padding:'10px 12px', border:'1px solid var(--rule2)', borderRadius:'8px 0 0 8px', borderRight:'none', background:'var(--soft)', color:'var(--muted)', fontFamily:MONO, fontSize:'14px'}}, 'kern.backspaceoddity.com/published/'),
            h('input',{value:this.state.deploySubdomain, disabled:st==='running', onChange:e=>this.setState({deploySubdomain:this.slugify(e.target.value)}), style:{width:170, padding:'10px 12px', borderRadius:'0 8px 8px 0', border:'1px solid var(--rule2)', background:'var(--paper)', color:'var(--ink)', fontFamily:MONO, fontSize:'14px'}}),
            h('div',{style:{flex:1, minWidth:12}}),
            st==='live' && h('a',{href:liveUrl, target:'_blank', rel:'noreferrer', style:{padding:'10px 16px', borderRadius:8, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit', textDecoration:'none', marginRight:10}}, 'Visit site \u2192'),
            h('button',{onClick:()=>this.startDeploy(), disabled:st==='running', style:{padding:'10px 20px', borderRadius:8, border:'1px solid var(--ink)', background:st==='running'?'var(--muted)':'var(--ink)', color:'var(--paper)', cursor:st==='running'?'default':'pointer', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit'}}, st==='running'?'Publishing\u2026':(st==='live'?'Republish':(st==='failed'?'Retry':'Publish now')))),
          h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:12, lineHeight:1.45}}, st==='live'? ('Live at '+liveUrl) : (st==='failed'? 'Publish did not complete — see the log below.' : 'Publishes the saved blocks to a public page at kern.backspaceoddity.com/published/. Nothing goes live until you press Publish.'))),
        this.state.deployStale && h('div',{style:{border:'1px solid #C2913F', background:'rgba(194,145,63,.10)', color:'#8a6a2a', borderRadius:10, padding:'11px 14px', marginBottom:18, fontSize:'12.5px', lineHeight:1.45}}, 'Draft has unsaved changes since the last publish — press Republish to update the live page.'),
        h('div',{style:{display:'flex', gap:8, marginBottom:18}}, stages.map((sl,i)=>{ const idx=i+1; const done=stage>idx||st==='live'; const active=stage===idx&&st==='running'; return h('div',{key:i, style:{flex:1, padding:'10px 12px', borderRadius:9, border:'1px solid '+((done||active)?'var(--ink)':'var(--rule)'), background:(done||active)?'var(--paper)':'transparent', display:'flex', alignItems:'center', gap:8}}, h('span',{style:{width:7,height:7,borderRadius:99, background:(done||active)?'var(--ink)':'var(--rule2)', animation:active?'bsoblink 1.2s infinite':'none'}}), h('span',{style:{fontSize:'12.5px', fontWeight:500, color:(done||active)?'var(--ink)':'var(--muted)'}}, sl)); })),
        h('div',{style:{borderRadius:12, overflow:'hidden', border:'1px solid var(--rule)'}},
          h('div',{style:{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#011C00', borderBottom:'1px solid rgba(253,251,244,.12)'}},
            h('span',{style:{fontFamily:MONO, fontSize:'10.5px', letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(253,251,244,.55)'}}, 'Deploy log'),
            h('span',{style:{fontFamily:MONO, fontSize:'10.5px', color:'rgba(253,251,244,.4)'}}, host)),
          h('div',{ref:el=>{this._logEl=el;}, style:{background:'#011C00', color:'#FDFBF4', padding:'14px 16px', height:300, overflowY:'auto', fontFamily:MONO, fontSize:'12.5px', lineHeight:1.7}},
            this.state.deployLogs.length===0 ? h('div',{style:{color:'rgba(253,251,244,.4)'}}, '$ awaiting publish \u2014 press Publish now to go live') :
            this.state.deployLogs.map((l,i)=> h('div',{key:i, style:{marginBottom:3, color: l.ok?'#7CFF8F':'rgba(253,251,244,.92)'}}, h('span',{style:{color:'rgba(253,251,244,.36)', marginRight:12}}, l.t), (l.ok?'\u2713 ':'')+l.text)),
            st==='running' && h('div',{style:{color:'rgba(253,251,244,.5)'}}, h('span',{style:{animation:'bsoblink 1s infinite'}}, '\u2588'))))));
  }
  imgDrop(applyFn){ return { onDragOver:e=>{ if(this.state.draggingAsset){ e.preventDefault(); } }, onDrop:e=>{ if(this.state.draggingAsset){ e.preventDefault(); e.stopPropagation(); applyFn(this.state.draggingAsset); this.setState({draggingAsset:null}); this.toast('Image applied'); } } }; }
  armReplace(target){ this.setState({imgTarget:target, libraryOpen:true, libTab:'assets'}); this.toast('Pick an image from Brand assets'); }
  applyAssetToTarget(val){ const t=this.state.imgTarget; if(!t) return false; if(t.kind==='tile'){ this.setTileImg(t.blockId, t.tileIndex, val); } else { this.setBlockImg(t.blockId, val); } this.setState({imgTarget:null}); this.toast('Image replaced'); return true; }
  replaceBtn(target){ const h=React.createElement; if(!(this.state.editMode && !this.state.locked && !this.state.previewVersionId)) return null; const t=this.state.imgTarget; const armed=t && t.blockId===target.blockId && t.tileIndex===target.tileIndex && t.kind===target.kind; return h('button',{onClick:e=>{ e.stopPropagation(); this.armReplace(target); }, 'data-tip':'Replace from library', style:{position:'absolute', bottom:8, right:8, zIndex:7, padding:'5px 11px', borderRadius:7, border:'1px solid rgba(255,255,255,.55)', background:armed?'#F2F2F0':'rgba(1,28,0,.74)', color:armed?'#011C00':'#F2F2F0', cursor:'pointer', fontSize:'11px', fontWeight:600, fontFamily:"'Inter',system-ui,sans-serif"}}, armed?'Choose an image \u2192':'Replace image'); }
  toast(msg){ this.setState({toast:msg}); clearTimeout(this._tt); this._tt=setTimeout(()=>this.setState({toast:null}), 3200); }
  roleName(r){ return ({label:'Label',heading:'Heading',statement:'Statement',body:'Body',list:'List'})[r]||r; }
  typeName(t){ if(isDsType(t)) return BT_TYPE_NAMES[t]||t.slice(3); return ({hero:'Hero well',statement:'Statement',twocol:'Two-column',casestudy:'Case study',projectgrid:'Project grid',footer:'Footer',custom:'Custom block',ai:'AI block'})[t]||t; }
  hashStr(s){ let h=2166136261; s=String(s); for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return Math.abs(h); }
  arnd(p,key,a,b){ return a + (this.hashStr(p.id+'#'+key) % (b-a+1)); }
  fmtDur(s){ const m=Math.floor(s/60), r=s%60; return m>0? m+'m '+r+'s' : r+'s'; }
  openAnalytics(p, from){ this.setState({screen:'analytics', analyticsPage:p, analyticsFrom:from||'dashboard'}); }
  analyticsFor(p){
    const visits=this.arnd(p,'visits',210,1340);
    const uniques=Math.round(visits*(0.55+this.arnd(p,'uniq',5,34)/100));
    const sec=this.arnd(p,'time',52,214), depth=this.arnd(p,'depth',46,93), completion=this.arnd(p,'compl',16,61), responses=this.arnd(p,'resp',3,9);
    const labels=(p.recipe&&p.recipe.length?p.recipe:['hero','statement','twocol','projectgrid','footer']).map(t=>this.typeName(t));
    let cur=100; const funnel=labels.map((l,i)=>{ if(i>0) cur=Math.max(20, cur-this.arnd(p,'f'+i,6,22)); return {label:l, pct:i===0?100:cur}; });
    const days=Array.from({length:14}).map((_,i)=> this.arnd(p,'day'+i,4,Math.round(visits/9)+6));
    const names=['Lieke','Marnix','Sanne','Tom','Anonymous','Anonymous','Wouter','Fenna'];
    const whens=['Today 14:22','Today 11:08','Yesterday 19:40','Yesterday 09:15','Mar 14','Mar 12','Mar 11','Mar 09'];
    const devices=['Desktop','Mobile','Desktop','Tablet','Mobile','Desktop'];
    const sessions=Array.from({length:6}).map((_,i)=>({ who:names[this.hashStr(p.id+'n'+i)%names.length], when:whens[i%whens.length], dur:this.arnd(p,'sd'+i,18,260), depth:this.arnd(p,'sdp'+i,22,100), device:devices[this.hashStr(p.id+'dv'+i)%devices.length] }));
    const ans=['A brand our team is proud to stand behind — and numbers to match.','Fewer tools, one coherent story across product and marketing.','Doubling qualified pipeline without doubling spend.','Something that finally feels like us.'];
    const respList=Array.from({length:Math.min(4,responses)}).map((_,i)=>({ who:names[this.hashStr(p.id+'r'+i)%4], when:whens[(i+2)%whens.length], text:ans[i%ans.length] }));
    return {visits, uniques, sec, depth, completion, responses, funnel, days, sessions, q:'What would success look like for you in 12 months?', respList};
  }
  renderAnalytics(){
    const h=React.createElement; const p=this.state.analyticsPage; if(!p) return null; const a=this.analyticsFor(p);
    const SCH="'ABC Schengen','Inter',system-ui,sans-serif";
    const kpi=(label,val,sub)=> h('div',{style:{border:'1px solid var(--rule)', borderRadius:12, padding:'16px 16px 18px', background:'var(--surface)'}},
      h('div',{style:this.mono({fontSize:'10px', marginBottom:12})}, label),
      h('div',{style:{fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', fontFamily:SCH, lineHeight:1}}, val),
      sub && h('div',{style:{fontSize:'12px', color:'var(--muted)', marginTop:7}}, sub));
    const card=(title, body)=> h('div',{style:{border:'1px solid var(--rule)', borderRadius:12, padding:'18px 20px', background:'var(--surface)'}},
      h('div',{style:this.mono({fontSize:'10px', marginBottom:16})}, title), body);
    return h('div',{className:'bso-scroll', style:{height:'100%', overflowY:'auto', background:'var(--paper)'}},
      h('div',{style:{maxWidth:1080, margin:'0 auto', padding:'34px 32px 72px'}},
        h('button',{onClick:()=>this.setState({screen:this.state.analyticsFrom||'dashboard'}), style:{background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'13px', fontFamily:'inherit', padding:0, marginBottom:18}}, '← '+(this.state.analyticsFrom==='editor'?'Back to editor':'All pages')),
        h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16, marginBottom:28}},
          h('div',null,
            h('div',{style:this.mono({marginBottom:10})}, 'Analytics'),
            h('h1',{style:{margin:0, fontSize:'34px', fontWeight:700, letterSpacing:'-0.02em', fontFamily:SCH}}, p.name),
            h('div',{style:{fontSize:'14px', color:'var(--muted)', marginTop:8}}, 'Last 14 days · live client interactions')),
          this.pill(p.status||'Published','')),
        h('div',{style:{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:14}},
          kpi('Visits', a.visits.toLocaleString(), '+'+this.arnd(p,'gr',6,38)+'% vs prev period'),
          kpi('Unique visitors', a.uniques.toLocaleString(), null),
          kpi('Avg. time on page', this.fmtDur(a.sec), null)),
        h('div',{style:{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24}},
          kpi('Avg. scroll depth', a.depth+'%', 'how far they read'),
          kpi('Completion rate', a.completion+'%', 'reached the end'),
          kpi('Responses left', String(a.responses), 'answered prompts')),
        h('div',{style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20}},
          card('How deep they read', h('div',{style:{display:'flex', flexDirection:'column', gap:13}},
            a.funnel.map((f,i)=> h('div',{key:i},
              h('div',{style:{display:'flex', justifyContent:'space-between', marginBottom:6}}, h('span',{style:{fontSize:'13px', fontWeight:500}}, f.label), h('span',{style:this.mono({fontSize:'10px', color:'var(--ink)'})}, f.pct+'%')),
              h('div',{style:{height:8, borderRadius:99, background:'var(--soft)', overflow:'hidden'}}, h('div',{style:{height:'100%', width:f.pct+'%', background:'var(--ink)', borderRadius:99}})))))),
          card('Visits over time', h('div',null,
            h('div',{style:{display:'flex', alignItems:'flex-end', gap:4, height:130}},
              a.days.map((d,i)=>{ const max=Math.max.apply(null,a.days); return h('div',{key:i, style:{flex:1, height:Math.max(4,Math.round(d/max*120))+'px', background: i===a.days.length-1?'var(--ink)':'var(--rule2)', borderRadius:'3px 3px 0 0'}}); })),
            h('div',{style:{display:'flex', justifyContent:'space-between', marginTop:10}}, h('span',{style:this.mono({fontSize:'9.5px'})}, '14 days ago'), h('span',{style:this.mono({fontSize:'9.5px'})}, 'Today'))))),
        h('div',{style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}},
          card('Recent sessions', h('div',{style:{display:'flex', flexDirection:'column'}},
            a.sessions.map((s,i)=> h('div',{key:i, style:{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderTop:i>0?'1px solid var(--rule)':'none'}},
              h('div',null, h('div',{style:{fontSize:'13.5px', fontWeight:500}}, s.who), h('div',{style:this.mono({fontSize:'9.5px', marginTop:3})}, s.when+' · '+s.device)),
              h('div',{style:{textAlign:'right'}}, h('div',{style:{fontSize:'13px', fontWeight:600, fontFamily:SCH}}, this.fmtDur(s.dur)), h('div',{style:this.mono({fontSize:'9.5px', marginTop:3})}, s.depth+'% read')))))),
          card('What clients left', h('div',null,
            h('div',{style:{fontSize:'13px', fontWeight:500, marginBottom:14, paddingBottom:14, borderBottom:'1px solid var(--rule)'}}, '“'+a.q+'”'),
            h('div',{style:{display:'flex', flexDirection:'column', gap:14}},
              a.respList.map((r,i)=> h('div',{key:i},
                h('div',{style:{fontSize:'14px', lineHeight:1.5, color:'var(--ink)'}}, '“'+r.text+'”'),
                h('div',{style:this.mono({fontSize:'9.5px', marginTop:6})}, r.who+' · '+r.when))))))))); 
  }

  defaults(type){
    const m = {
      hero:{label:'Brand transformation', heading:'We live in a world where everything works, but nothing matters.', cta:'Book a call', img:'magenta-green'},
      statement:{label:'Our belief', heading:'Build ventures that taste like something — that feel like something, that mean something.', body:'Where efficiency killed imagination and curiosity, we are here to fix that — to make at least some of it feel human.'},
      twocol:{label:'Approach', lede:'We don\u2019t consult, we collaborate.', colA:'We roll up our sleeves, join the band, and help companies find their rhythm — where vision, product, and brand start to play in tune.', colB:'Our work connects product, marketing, brand, and experience into one coherent system: a living engine linking what you stand for with what customers experience.'},
      casestudy:{label:'Selected work', title:'Rebrand: from RealtimeBoard to Miro', lede:'A living engine that links what the company stands for with what its customers actually experience.', metricValue:'3.4\u00d7', metricLabel:'sign-up lift', img:'emerald'},
      projectgrid:{label:'Recent', heading:'Selected work', tiles:[{title:'Sidekick Browser', lede:'Product Hunt #1', img:'terracotta'},{title:'Maroo', lede:'Brand system', img:'warm'},{title:'Wayfund', lede:'Product + site', img:'emerald'}]},
      footer:{label:'Get in touch', heading:'Let\u2019s make some of it feel human.', contact:'start@backspaceoddity.com', office:'Vijzelstraat 68-78, 1017 ES Amsterdam', nav:'Work · About · Contact'},
      custom:{label:'New block', heading:'A block proposed by Claude.', body:'Generated copy lives here.'},
      ai:{prompt:'', state:'idle', error:''},
    };
    return this.clone(m[type] || m.custom);
  }
  placeholders(type){
    const m = {
      hero:{label:'Eyebrow', heading:'Your headline goes here', cta:'Call to action', img:'magenta-green'},
      statement:{label:'Section label', heading:'A short, bold statement goes here.', body:'Supporting copy placeholder — replace with your own.'},
      twocol:{label:'Section label', lede:'Lede sentence placeholder.', colA:'First column body placeholder.', colB:'Second column body placeholder.'},
      casestudy:{label:'Section label', title:'Case study title', lede:'One-line summary placeholder.', metricValue:'00×', metricLabel:'metric label', img:'emerald'},
      projectgrid:{label:'Section label', heading:'Section heading', tiles:[{title:'Item one', lede:'Subtitle', img:'terracotta'},{title:'Item two', lede:'Subtitle', img:'warm'},{title:'Item three', lede:'Subtitle', img:'emerald'}]},
      footer:{label:'Section label', heading:'Closing line goes here.', contact:'email@example.com', office:'Address placeholder', nav:'Link · Link · Link'},
      custom:{label:'New block', heading:'Headline placeholder', body:'Body placeholder.'},
    };
    return this.clone(m[type] || m.custom);
  }
  makeBlock(type, extra){
    return Object.assign({id:this.nid(), type, bg: type==='hero'?'forest':'paper', pad:'M', props:this.defaults(type), overrides:{}}, extra||{});
  }
  buildPage(recipe){ return (recipe||[]).map(t=> this.makeBlock(t)); }

  // ---------- navigation ----------
  // Delete/archive persist to the DB so the change survives reload now that the
  // dashboard list is DB-backed (BSO-658). Optimistic local update first, then API.
  deletePage(id){ this.setState(s=>({pages:(s.pages||[]).filter(p=>p.id!==id)})); this.toast('Page deleted');
    fetch('/api/builder/pages/?id='+encodeURIComponent(id), {method:'DELETE'}).catch(()=>{}); }
  archivePage(id){ this.setState(s=>({pages:(s.pages||[]).map(p=>p.id===id?{...p, archived:true}:p)})); this.toast('Page archived');
    fetch('/api/builder/pages/'+encodeURIComponent(id)+'/', {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({archived:true})}).catch(()=>{}); }
  // Inject the active real page's stylesheet (8Figures + brand-transformation ship
  // different CSS under shared bt- class names, so only one loads at a time).
  injectPageCss(cssId){
    if(typeof document==='undefined') return;
    // A DS with no stylesheet yet (cssKey:null, e.g. Urembo placeholder) injects
    // nothing — remove any prior link so we fall back to the neutral builder base.
    if(!cssId){ this.clearPageCss(); return; }
    let link=document.getElementById('bso-page-css');
    if(!link){ link=document.createElement('link'); link.id='bso-page-css'; link.rel='stylesheet'; document.head.appendChild(link); }
    link.href='/builder-css/'+cssId+'.css';
  }
  clearPageCss(){ if(typeof document==='undefined') return; const l=document.getElementById('bso-page-css'); if(l) l.parentNode.removeChild(l); }
  // The design-system whose stylesheet is active for the open page: a real page
  // keys off its row id (= realPage); any other page uses pageDs (set to the
  // default proposal DS on create). Drives the canvas `bt-page` wrapper + the
  // Library Sections tab so real `bt:` sections render styled on ANY page.
  // The registry id of the design system the OPEN page belongs to. Built-in real
  // pages (p8fig/pbt) are both instances of the Backspace Oddity DS → 'bso'.
  // Every other page carries its chosen `ds` id in state.pageDsId.
  activeDsId(){ const rp=this.state.realPage; if(rp && BT_PAGES[rp]) return 'bso'; return this.state.pageDsId||DEFAULT_DS_ID; }
  // The cssKey (stylesheet id) active for the open page. A built-in real page keys
  // off its own per-instance stylesheet (p8fig/pbt); any other page resolves its
  // DS's cssKey from the registry (may be null → no stylesheet, e.g. Urembo).
  activeDs(){ const rp=this.state.realPage; if(rp && BT_PAGES[rp]) return BT_PAGES[rp].css; return getDs(this.activeDsId()).cssKey; }
  // Persist the open page in the URL so a reload returns you to it (not the dashboard).
  syncUrlForPage(p){ if(typeof window==='undefined') return; const id=(p&&(p.id||p.real))||''; try{ history.replaceState(null, '', '/builder?p='+encodeURIComponent(id)); }catch(e){} }
  openPage(p){
    // Opening another page must not let a pending debounced save from the OUTGOING
    // page fire AFTER we've switched — savePage() reads this.state.realPage at fire
    // time, so a stale timer would write the previous page's content under the newly
    // opened page's id and clobber it (the urembo-hub data-loss, BSO-658). Flush the
    // old page's dirty edits first, then kill the timer — same discipline as backToDash().
    if(this.state.saveState==='dirty' && this.state.realPage){ this.savePage(); }
    if(this._saveT){ clearTimeout(this._saveT); this._saveT=null; }
    if(p && p.real && BT_PAGES[p.real]){
      const def=BT_PAGES[p.real]; this.injectPageCss(def.css);
      const cur=this.clone(def.blocks);
      this.setState({screen:'editor', realPage:p.real, pageDs:null, pageDsId:'bso', pageTitle:p.name, pageTab:p.tab, currentPage:p, blocks:cur,
        styles:this.dsStyles?this.clone(this.dsStyles):this.clone(this.DEFAULT_STYLES),
        btStyles:{}, roleDefaults:{},
        selectedId:null, selectedRole:null, editMode:true, locked:false, versionsOpen:false, previewVersionId:null, imgTarget:null,
        saveState:'loading',
        versions:[{id:'v3', label:'Current draft', when:'Just now', author:'You', current:true, blocks:this.clone(cur)}]});
      // Load a previously-saved version of this page, if any.
      fetch('/api/builder/pages/'+encodeURIComponent(p.real)+'/').then(r=>r.json()).then(d=>{
        if(this.state.realPage!==p.real) return; // navigated away
        if(d && d.saved && d.page && Array.isArray(d.page.blocks) && d.page.blocks.length){
          const savedStyles=d.page.styles?this.clone(d.page.styles):this.state.styles;
          this.setState({blocks:this.clone(d.page.blocks), styles:savedStyles, btStyles:(savedStyles&&savedStyles.bt)?this.clone(savedStyles.bt):{}, roleDefaults:{}, selectedRole:null, saveState:'saved', lastSavedBy:d.page.updated_by||null});
        } else { this.setState({saveState:'saved'}); }
      }).catch(()=>this.setState({saveState:'saved'}));
      this.syncUrlForPage(p);
      return;
    }
    // DB-backed page that is NOT a built-in real page (e.g. created from a template).
    // Key persistence off its own id: set realPage=id so markDirty/savePage target it,
    // and load its saved blocks/styles from the DB so a reload restores content (BSO-658).
    if(p && p.id && !BT_PAGES[p.id]){
      // Resolve the page's DS from the list row's ds (if present) -> registry cssKey.
      const dsId0=p.ds||DEFAULT_DS_ID; const css0=getDs(dsId0).cssKey;
      this.injectPageCss(css0);
      this.setState({screen:'editor', realPage:p.id, pageDs:css0, pageDsId:dsId0, pageTitle:p.name, pageTab:p.tab||'bso', currentPage:p,
        blocks:[], styles:this.dsStyles?this.clone(this.dsStyles):this.clone(this.DEFAULT_STYLES), btStyles:{}, roleDefaults:{},
        selectedId:null, selectedRole:null, editMode:true, locked:false, versionsOpen:false, previewVersionId:null, imgTarget:null,
        saveState:'loading',
        versions:[{id:'v1', label:'Current draft', when:'Just now', author:'You', current:true, blocks:[]}]});
      fetch('/api/builder/pages/'+encodeURIComponent(p.id)+'/').then(r=>r.json()).then(d=>{
        if(this.state.realPage!==p.id) return; // navigated away
        if(d && d.saved && d.page){
          const savedStyles=d.page.styles?this.clone(d.page.styles):this.state.styles;
          const savedBlocks=Array.isArray(d.page.blocks)?this.clone(d.page.blocks):[];
          // The DB row is the source of truth for the page's DS — re-inject its CSS.
          const dsId=d.page.ds||dsId0; const cssId=getDs(dsId).cssKey; this.injectPageCss(cssId);
          this.setState({blocks:savedBlocks, styles:savedStyles, btStyles:(savedStyles&&savedStyles.bt)?this.clone(savedStyles.bt):{}, roleDefaults:{}, pageTitle:d.page.title||p.name, pageDs:cssId, pageDsId:dsId, selectedRole:null, saveState:'saved', lastSavedBy:d.page.updated_by||null,
            versions:[{id:'v1', label:'Current draft', when:'Just now', author:'You', current:true, blocks:this.clone(savedBlocks)}]});
        } else { this.setState({saveState:'saved'}); }
      }).catch(()=>this.setState({saveState:'saved'}));
      this.syncUrlForPage(p);
      return;
    }
    // Non-real page: still load a proposal DS stylesheet so any real `bt:` section
    // the user assembles from the Sections tab renders styled (BSO-658).
    this.injectPageCss(DEFAULT_PAGE_DS);
    const styles = this.dsStyles ? this.clone(this.dsStyles) : this.clone(this.DEFAULT_STYLES);
    const cur=this.buildPage(p.recipe);
    const v2=this.clone(cur); const hv2=v2.find(b=>b.type==='hero'); if(hv2){ hv2.props.heading='Uncover hidden growth levers.'; hv2.props.label='Backspace Oddity'; hv2.props.cta='Get in touch'; hv2.props.img='terracotta'; }
    const v1=this.clone(cur).filter(b=>b.type==='hero'||b.type==='footer'); const hv1=v1.find(b=>b.type==='hero'); if(hv1){ hv1.props.heading='A new home for Backspace Oddity.'; hv1.props.img='emerald'; }
    this.setState({screen:'editor', realPage:null, pageDs:DEFAULT_PAGE_DS, pageTitle:p.name, pageTab:p.tab, currentPage:p, blocks:cur, styles,
      selectedId:null, selectedRole:null, editMode:true, locked:false, versionsOpen:false, previewVersionId:null, imgTarget:null,
      versions:[
        {id:'v3', label:'Current draft', when:'Just now', author:'You', current:true, blocks:this.clone(cur)},
        {id:'v2', label:'Hero copy revision', when:p.edited, author:p.owner, blocks:v2},
        {id:'v1', label:'Initial layout', when:'Earlier', author:p.owner, blocks:v1},
      ]});
    this.syncUrlForPage(p);
  }
  backToDash(){ if(this.state.saveState==='dirty'){ this.savePage(); } else if(this._saveT){ clearTimeout(this._saveT); this._saveT=null; } this.clearPageCss(); if(typeof window!=='undefined'){ try{ history.replaceState(null, '', '/builder'); }catch(e){} } this.setState({screen:'dashboard', realPage:null, pageDs:null, selectedId:null, selectedRole:null, previewVersionId:null, imgTarget:null}); }
  // ---------- persistence ----------
  // Mark the page changed and schedule a debounced save (real pages only).
  markDirty(){ if(!this.state.realPage) return; this.setState({saveState:'dirty'}); if(this._saveT) clearTimeout(this._saveT); this._saveT=setTimeout(()=>this.savePage(), 1400); }
  // Flip the Save button to "unsaved" on the first touch of editing (before the blur/commit).
  markDirtyLabel(){ if(this.state.realPage && this.state.saveState!=='saving' && this.state.saveState!=='dirty') this.setState({saveState:'dirty'}); }
  savePage(){
    const id=this.state.realPage; if(!id) return; if(this._saveT){ clearTimeout(this._saveT); this._saveT=null; }
    this.setState({saveState:'saving'});
    fetch('/api/builder/pages/'+encodeURIComponent(id)+'/', {method:'PUT', keepalive:true, headers:{'Content-Type':'application/json'},
      body:JSON.stringify({title:this.state.pageTitle, tab:this.state.pageTab, blocks:this.state.blocks, styles:this.state.styles, realPage:id, ds:this.activeDsId()})})
      .then(r=>r.json()).then(d=>{ if(d&&d.ok){ this.setState({saveState:'saved', lastSavedBy:d.updated_by||null}); } else { this.setState({saveState:'error'}); this.toast('Save failed'); } })
      .catch(()=>{ this.setState({saveState:'error'}); this.toast('Save failed'); });
  }
  saveLabel(){ const s=this.state.saveState; return s==='saving'?'Saving…':s==='dirty'?'Save changes':s==='error'?'Retry save':s==='loading'?'Loading…':'Saved ✓'; }
  // Fresh, collision-free page id (never p8fig/pbt). Used to CREATE a DB row at
  // creation time so the page persists, lists, and survives reload (BSO-658).
  newPageId(){
    const rnd = (typeof crypto!=='undefined' && crypto.randomUUID) ? crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10);
    return 'page-'+rnd;
  }
  createFromTemplate(){
    const a = this.state.newPageArche; if(!a) return;
    // Bind the new page to the chosen design system (registry id -> cssKey). A DS
    // with no stylesheet yet (Urembo) injects nothing; its sections come later.
    const dsId = this.state.newPageDsId || DEFAULT_DS_ID;
    const cssId = getDs(dsId).cssKey;
    this.injectPageCss(cssId);
    const styles = this.dsStyles ? this.clone(this.dsStyles) : this.clone(this.DEFAULT_STYLES);
    const id = this.newPageId();
    const title = (this.state.newPageName && this.state.newPageName.trim()) || 'Untitled page';
    const tab = this.state.dashTab || 'bso';
    const blocks = this.buildPage(a.recipe);
    // Treat the new page as a DB-backed real page: realPage=id wires markDirty/savePage
    // to it so every subsequent edit auto-saves to this row.
    this.setState({screen:'editor', realPage:id, pageDs:cssId, pageDsId:dsId, newPageOpen:false, newPageName:'', newPageArche:null, newPageDsId:DEFAULT_DS_ID,
      pageTitle:title, pageTab:tab, currentPage:{id, name:title, tab, real:id, status:'Draft', ds:dsId},
      blocks, styles, btStyles:(styles&&styles.bt)?this.clone(styles.bt):{}, roleDefaults:{},
      selectedId:null, selectedRole:null, editMode:true, locked:false, saveState:'saving', previewVersionId:null, imgTarget:null,
      versions:[{id:'v1', label:'Created from '+a.name, when:'Just now', author:'You', current:true, blocks:this.clone(blocks)}]});
    // Persist the initial row NOW (create-on-create), not only on first edit.
    fetch('/api/builder/pages/'+encodeURIComponent(id)+'/', {method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({title, tab, blocks, styles, realPage:id, ds:dsId})})
      .then(r=>r.json()).then(d=>{
        if(this.state.realPage!==id) return;
        if(d && d.ok){ this.setState({saveState:'saved', lastSavedBy:d.updated_by||null}); this.loadPages(); }
        else { this.setState({saveState:'error'}); this.toast('Could not create page'); }
      })
      .catch(()=>{ if(this.state.realPage===id){ this.setState({saveState:'error'}); this.toast('Could not create page'); } });
  }

  // ---------- block ops ----------
  selectBlock(id){ this.setState({selectedId:id, selectedRole:null}); }
  selectText(id, role){ this.setState({selectedId:id, selectedRole:role}); }
  commitText(id, key, text){ this.setState(s=>({blocks:s.blocks.map(b=> b.id===id ? {...b, props:{...b.props,[key]:text}} : b)})); this.markDirty(); }
  commitTile(id, idx, key, text){ this.setState(s=>({blocks:s.blocks.map(b=>{ if(b.id!==id) return b; const tiles=b.props.tiles.map((t,i)=> i===idx?{...t,[key]:text}:t); return {...b, props:{...b.props, tiles}}; })})); this.markDirty(); }
  moveBlock(id, dir){
    this.setState(s=>{ const arr=[...s.blocks]; const i=arr.findIndex(b=>b.id===id); const j=i+dir; if(j<0||j>=arr.length) return {}; const t=arr[i]; arr[i]=arr[j]; arr[j]=t; return {blocks:arr}; });
    this.markDirty();
  }
  duplicateBlock(id){ this.setState(s=>{ const i=s.blocks.findIndex(b=>b.id===id); const copy=this.clone(s.blocks[i]); copy.id=this.nid(); const arr=[...s.blocks]; arr.splice(i+1,0,copy); return {blocks:arr, selectedId:copy.id}; }); this.markDirty(); }
  deleteBlock(id){ this.setState(s=>({blocks:s.blocks.filter(b=>b.id!==id), selectedId:null, selectedRole:null})); this.markDirty(); }
  setBlockProp(id, key, val){ this.setState(s=>({blocks:s.blocks.map(b=> b.id===id ? {...b,[key]:val} : b)})); }

  insertAt(index, block){ this.setState(s=>{ const arr=[...s.blocks]; arr.splice(index,0,block); return {blocks:arr, selectedId:block.id, selectedRole:null, dropAt:null, draggingType:null, dragIndex:null}; }); this.markDirty(); }
  // ---------- explicit two-step insert (BSO-658) ----------
  // Clicking a leaf library tile no longer inserts; it SELECTS the tile (libPicked)
  // and reveals an "Add to canvas" button. The token uniquely identifies the tile so
  // only the selected one shows the button. `build` lazily makes the block on add.
  pickTile(token, build, name){ this.setState(s=> s.libPicked && s.libPicked.token===token ? {libPicked:null} : {libPicked:{token, build, name}}); }
  isPicked(token){ const p=this.state.libPicked; return !!(p && p.token===token); }
  // Perform the actual insert — at the armed gap if one is set, else append. Clears arm+pick.
  addPicked(build, name){
    const idx = this.state.insertIndex!=null ? this.state.insertIndex : this.state.blocks.length;
    const block = build(); if(!block) return;
    this.insertAt(idx, block); this.toast((name||'Section')+' added');
    this.setState({libPicked:null, insertIndex:null});
  }
  // Arm a between-section gap as the insert position; open the Library so a tile can be picked.
  armGap(index){ this.setState(s=> s.insertIndex===index ? {insertIndex:null} : {insertIndex:index, libraryOpen:true}); }
  // Dev-only debug surface for verification (no behavioral effect).
  _dbg(){ if(typeof window!=='undefined'){ window.__builderInsertIndex=this.state.insertIndex; window.__builderBlockCount=this.state.blocks.length; } }
  clearArm(){ if(this.state.insertIndex!=null || this.state.libPicked) this.setState({insertIndex:null, libPicked:null}); }
  onDrop(index){
    const {draggingType, dragIndex} = this.state;
    if(draggingType){
      if(draggingType.startsWith('saved:')){ const b=this.savedInstance(draggingType.slice(6)); if(b) this.insertAt(index, b); return; }
      const blank=draggingType.startsWith('blank:'); const realType=blank?draggingType.slice(6):draggingType; this.insertAt(index, draggingType.startsWith('custom:') ? this.customInstance(draggingType) : (blank?this.makeBlock(realType,{props:this.placeholders(realType), bg:'paper'}):this.makeBlock(realType))); return; }
    if(dragIndex!=null){ this.setState(s=>{ const arr=[...s.blocks]; const [m]=arr.splice(dragIndex,1); let to=index; if(dragIndex<index) to=index-1; arr.splice(to,0,m); return {blocks:arr, dragIndex:null, dropAt:null}; }); }
  }
  customInstance(key){ const t=this.state.customTemplates.find(x=>x.key===key); if(!t) return this.makeBlock('custom'); const b=this.makeBlock('custom'); b.props=this.clone(t.props); b.bg=t.bg||'paper'; return b; }
  // ---------- saved template library (BSO-658) ----------
  // Save the currently-selected section as a reusable template in the shared library.
  saveBlockToLibrary(inst){
    if(!inst) return;
    const def=this.typeName(inst.type)||'Section';
    const name=(typeof window!=='undefined') ? window.prompt('Name this template', def) : def;
    if(name===null) return; // user cancelled
    const payload={ name:(name&&name.trim())||def, type:inst.type, props:this.clone(inst.props||{}), bg:inst.bg||null };
    fetch('/api/builder/templates/', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
      .then(r=>r.json()).then(d=>{
        if(d && d.template){ this.setState(s=>({savedTemplates:[d.template, ...(s.savedTemplates||[])]})); this.toast('Saved to library'); }
        else { this.toast('Save failed'); }
      }).catch(()=>this.toast('Save failed'));
  }
  // Build a fresh canvas block from a saved template (mirror of customInstance / insertBtVariation).
  savedInstance(id){
    const t=(this.state.savedTemplates||[]).find(x=>x.id===id); if(!t) return null;
    const isBt = isDsType(t.type);
    if(isBt) return { id:this.nid('bt'), type:t.type, props:this.clone(t.props||{}), real:true };
    return this.makeBlock(t.type, { props:this.clone(t.props||{}), bg:t.bg||'paper' });
  }
  insertSavedTemplate(id){
    const b=this.savedInstance(id); if(!b) return;
    const t=(this.state.savedTemplates||[]).find(x=>x.id===id);
    this.insertAt(this.state.blocks.length, b); this.toast(((t&&t.name)||'Section')+' added');
  }
  deleteSavedTemplate(id){
    this.setState(s=>({savedTemplates:(s.savedTemplates||[]).filter(t=>t.id!==id)}));
    fetch('/api/builder/templates/?id='+encodeURIComponent(id), {method:'DELETE'}).catch(()=>{});
  }
  // Thumbnail for a saved template — bt sections via thumbFill, synthetic blocks via a static blockInner render.
  savedThumb(t, hh, zoom){
    const h=React.createElement;
    if(isDsType(t.type)) return this.thumbFill(t.type, t.props||{}, hh||80, zoom||0.185);
    const inst={id:'__saved-'+t.id, type:t.type, bg:t.bg||'paper', pad:'M', props:this.clone(t.props||{}), overrides:{}};
    const forest=inst.bg==='forest'; const fg=forest?'#FDFBF4':'#011C00';
    const bg=forest?'#011C00':'transparent';
    return h('div',{style:{width:'100%', height:hh||80, overflow:'hidden', background:forest?'#011C00':'#F2F2F0'}},
      h('div',{style:{width:1100, zoom:zoom||0.069, pointerEvents:'none', background:bg, color:fg, backgroundImage:(forest&&inst.type==='hero')?'url('+this.imgUrl(inst.props.img||'magenta-green')+')':'none', backgroundSize:'cover', backgroundPosition:'center'}},
        forest && inst.type==='hero' && h('div',{style:{position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.55))', pointerEvents:'none'}}),
        h('div',{style:{position:'relative', zIndex:2, padding:this.blockPad(inst)}}, this.blockInner(inst, fg))));
  }

  // ---------- style semantics ----------
  effective(inst, role){ return Object.assign({}, this.state.styles[role], (inst.overrides&&inst.overrides[role])||{}); }
  hasOverride(inst, role){ return !!(inst && inst.overrides && inst.overrides[role]); }
  setRoleProp(prop, val){
    const {selectedId, selectedRole} = this.state; if(!selectedId||!selectedRole) return;
    this.setState(s=>({blocks:s.blocks.map(b=>{ if(b.id!==selectedId) return b; const cur=Object.assign({}, s.styles[selectedRole], (b.overrides&&b.overrides[selectedRole])||{}); cur[prop]=val; return {...b, overrides:{...b.overrides,[selectedRole]:cur}}; })}));
  }
  resetOverride(){ const {selectedId, selectedRole}=this.state; this.setState(s=>({blocks:s.blocks.map(b=>{ if(b.id!==selectedId) return b; const o={...b.overrides}; delete o[selectedRole]; return {...b, overrides:o}; })})); }
  setDSProp(role, prop, val){ this.setState(s=>{ const styles=Object.assign({}, s.styles, {[role]:Object.assign({}, s.styles[role], {[prop]:val})}); this.dsStyles=this.clone(styles); try{ localStorage.setItem('bso_ds_styles', JSON.stringify(styles)); }catch(e){} return {styles}; }); }
  updateStyle(scope){
    const {selectedId, selectedRole, blocks} = this.state;
    const inst = blocks.find(b=>b.id===selectedId); if(!inst) return;
    const val = this.effective(inst, selectedRole);
    const styles = Object.assign({}, this.state.styles, {[selectedRole]:val});
    const cleared = blocks.map(b=>{ if(b.overrides&&b.overrides[selectedRole]){ const o={...b.overrides}; delete o[selectedRole]; return {...b, overrides:o}; } return b; });
    const count = cleared.filter(b=> (this.ROLES_BY_TYPE[b.type]||[]).indexOf(selectedRole)>=0).length;
    this.setState({styles, blocks:cleared});
    if(scope==='ds'){ this.dsStyles=this.clone(styles); try{ localStorage.setItem('bso_ds_styles', JSON.stringify(styles)); }catch(e){} }
    this.toast(this.roleName(selectedRole)+' style updated — '+count+' instance'+(count!==1?'s':'')+' '+(scope==='ds'?'across the design system':'on this page'));
  }

  // ---------- ask claude ----------
  // ---------- on-canvas AI block (BSO-658) ----------
  // Update one prop on a single AI block in place (prompt text, state, error).
  setAiProp(id, key, val){ this.setState(s=>({blocks:s.blocks.map(b=> b.id===id ? {...b, props:{...b.props, [key]:val}} : b)})); }
  // Generate from an on-canvas AI block: same prompt + complete() path as the
  // old sidebar, but on success REPLACE the AI block in place (same index) with
  // the drafted custom section. Loading/error states live on the block itself.
  async generateAiBlock(inst){
    const p = String((inst.props&&inst.props.prompt)||'').trim(); if(!p) return;
    this.setAiProp(inst.id, 'state', 'thinking'); this.setAiProp(inst.id, 'error', '');
    const prompt = 'You are a section generator for a Backspace Oddity landing-page builder. The brand voice is editorial, confident, writerly, uses em-dashes, sentence case, no emoji, no exclamation marks. Given this request: "'+p+'", return ONLY a JSON object (no prose, no code fences) with keys: "label" (short uppercase-ish kicker, 1-3 words), "heading" (one editorial sentence), "body" (1-2 sentences), "bg" (one of "paper","soft","forest"). Keep it on-brand.';
    let result;
    try{
      const raw = await this.complete(prompt);
      const txt = String(raw||'');
      const s=txt.indexOf('{'), e=txt.lastIndexOf('}');
      const obj = JSON.parse(txt.slice(s, e+1));
      result = {label:obj.label||'New block', heading:obj.heading||'', body:obj.body||'', bg:(['paper','soft','forest'].indexOf(obj.bg)>=0?obj.bg:'paper')};
    }catch(err){
      // Mark error on the block — keep the prompt so the user can retry.
      this.setAiProp(inst.id, 'state', 'idle');
      this.setAiProp(inst.id, 'error', 'Generation failed — try again.');
      return;
    }
    // Replace the AI block in place with the drafted custom section.
    const b=this.makeBlock('custom'); b.bg=result.bg; b.props={label:result.label, heading:result.heading, body:result.body};
    this.setState(s=>{ const arr=s.blocks.map(x=> x.id===inst.id ? b : x); return {blocks:arr, selectedId:b.id, selectedRole:null}; });
    this.markDirty(); this.toast('Block drafted by Claude');
  }

  // ---------- versions ----------
  saveVersion(){ const v={id:this.nid('v'), label:'Manual save', when:'Just now', author:'You', current:true, blocks:this.clone(this.state.blocks)}; this.setState(s=>({versions:[v, ...s.versions.map(x=>({...x,current:false}))], previewVersionId:null})); this.toast('Version saved'); }
  previewVersion(v){ this.setState({previewVersionId: v.current?null:v.id, selectedId:null, selectedRole:null}); }
  restoreVersion(id){ const ver=this.state.versions.find(v=>v.id===id); this.setState(s=>({blocks: ver&&ver.blocks?this.clone(ver.blocks):s.blocks, previewVersionId:null, versionsOpen:false, selectedId:null, selectedRole:null, versions:s.versions.map(x=>({...x,current:x.id===id}))})); this.toast('Restored: '+(ver?ver.label:'version')); }
  renderPreviewBanner(){
    const h=React.createElement; const v=this.state.versions.find(x=>x.id===this.state.previewVersionId); if(!v) return null;
    return h('div',{style:{position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', zIndex:46, background:'var(--ink)', color:'var(--paper)', borderRadius:10, padding:'9px 12px 9px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'var(--shadow)', animation:'bsofade .3s both'}},
      h('span',{style:{fontSize:'13.5px'}}, 'Previewing ', h('strong',null, v.label), ' \u00b7 '+v.when),
      h('button',{onClick:()=>this.restoreVersion(v.id), style:{padding:'5px 12px', borderRadius:7, border:'none', background:'var(--paper)', color:'var(--ink)', cursor:'pointer', fontSize:'12.5px', fontWeight:600, fontFamily:'inherit'}}, 'Restore this version'),
      h('button',{onClick:()=>this.setState({previewVersionId:null}), style:{padding:'5px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,.3)', background:'transparent', color:'var(--paper)', cursor:'pointer', fontSize:'12.5px', fontFamily:'inherit'}}, 'Back to current'));
  }

  // ============================================================ render
  renderVals(){ return { app: this.renderApp() }; }

  renderApp(){
    const h=React.createElement, F=React.Fragment;
    const {screen, theme} = this.state;
    // Boot splash — shown until /me resolves, so a signed-in user never sees the login
    // form flash on reload. Quiet centered wordmark on var(--paper); no form, no spinner.
    if(screen==='boot'){
      const logo = h('svg',{viewBox:'0 0 80 80', width:30, height:30, fill:'currentColor', style:{display:'block'}},
        h('ellipse',{cx:14.718,cy:40,rx:14.718,ry:30.732}), h('ellipse',{cx:33.283,cy:40,rx:10.31,ry:38.537}),
        h('ellipse',{cx:47.615,cy:40,rx:3.544,ry:40}), h('ellipse',{cx:59.5,cy:40,rx:5,ry:32}), h('ellipse',{cx:72,cy:40,rx:3.3,ry:18}));
      return h('div',{'data-theme':theme, style:{height:'100vh', overflow:'hidden', background:'var(--paper)', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center'}},
        h('div',{style:{display:'flex', alignItems:'center', gap:12, color:'var(--ink)'}}, logo,
          h('div',{style:{lineHeight:1}},
            h('div',{style:{fontWeight:700, fontSize:'15px', letterSpacing:'-0.01em'}}, 'Backspace Oddity'),
            h('div',{style:this.mono({fontSize:'9.5px', marginTop:3})}, 'Landing builder'))));
    }
    if(screen==='login') return h('div',{'data-theme':theme, style:{height:'100vh', overflow:'hidden', background:'var(--paper)', color:'var(--ink)'}}, this.renderLogin(), this.state.toast && this.renderToast());
    return h('div', {'data-theme':theme,
        onMouseOver:e=>{ const t=e.target&&e.target.closest&&e.target.closest('[data-tip]'); if(!t) return; const txt=t.getAttribute('data-tip'); if(!txt){ return; } const r=t.getBoundingClientRect(); this.showTip(txt, Math.round(r.left+r.width/2), Math.round(r.bottom+7)); },
        onMouseOut:e=>{ const t=e.target&&e.target.closest&&e.target.closest('[data-tip]'); if(t) this.hideTip(); },
        style:{height:'100vh', display:'flex', flexDirection:'column', background:'var(--paper)', color:'var(--ink)', overflow:'hidden'}},
      this.renderTopbar(),
      h('div', {style:{flex:1, minHeight:0, position:'relative'}},
        screen==='dashboard' ? this.renderDashboard() : screen==='analytics' ? this.renderAnalytics() : screen==='deploy' ? this.renderDeploy() : this.renderEditor()
      ),
      this.state.newPageOpen && this.renderNewPage(),
      this.state.variationsOpen && this.renderVariations(),
      this.renderTip(),
      this.state.claudeEditPick && this.renderClaudeEditPickHint(),
      this.state.claudeEdit && this.renderClaudeEdit(),
      this.state.toast && this.renderToast(),
    );
  }
  // Tooltip on a fixed layer — never clipped by the topbar's scroll container.
  showTip(text, x, y){ if(this._tipT) clearTimeout(this._tipT); this._tipT=setTimeout(()=>this.setState({tip:{text, x, y}}), 140); }
  hideTip(){ if(this._tipT){ clearTimeout(this._tipT); this._tipT=null; } if(this.state.tip) this.setState({tip:null}); }
  renderTip(){ const h=React.createElement; const t=this.state.tip; if(!t) return null;
    return h('div',{style:{position:'fixed', left:t.x, top:t.y, transform:'translateX(-50%)', zIndex:200, background:'#011C00', color:'#F2F2F0', fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase', padding:'4px 7px', borderRadius:5, whiteSpace:'nowrap', pointerEvents:'none', boxShadow:'0 4px 14px rgba(1,28,0,.22)'}}, t.text);
  }

  // ---------- shared atoms ----------
  mono(extra){ return Object.assign({fontFamily:"'JetBrains Mono','IBM Plex Mono',monospace", fontSize:'11px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--faint)'}, extra||{}); }
  iconBtn(label, onClick, opts){ const h=React.createElement; opts=opts||{}; return h('button',{onClick, title:opts.title, disabled:opts.disabled, style:{width:opts.w||28, height:28, border:'1px solid var(--rule2)', background:opts.active?'var(--ink)':'var(--surface)', color:opts.active?'var(--paper)':'var(--ink)', borderRadius:6, cursor:opts.disabled?'default':'pointer', opacity:opts.disabled?0.4:1, fontSize:opts.fs||13, lineHeight:1, fontFamily:"'IBM Plex Mono',monospace", display:'inline-flex', alignItems:'center', justifyContent:'center', padding:0}}, label); }
  pill(text, tone){ const h=React.createElement; const map={Published:'var(--ink)',Draft:'var(--muted)',Archived:'var(--faint)'}; return h('span',{style:Object.assign(this.mono(),{color:map[text]||'var(--muted)', border:'1px solid var(--rule2)', borderRadius:999, padding:'3px 9px', fontSize:'10px'})}, text); }
  seg(opts, value, onChange, extra){ const h=React.createElement; return h('div',{style:Object.assign({display:'inline-flex', border:'1px solid var(--rule2)', borderRadius:7, overflow:'hidden', background:'var(--surface)'}, extra||{})}, opts.map(o=>{ const v=typeof o==='object'?o.v:o; const lab=typeof o==='object'?o.l:o; const on=v===value; return h('button',{key:String(v), onClick:()=>onChange(v), style:{padding:'6px 11px', border:'none', background:on?'var(--ink)':'transparent', color:on?'var(--paper)':'var(--muted)', cursor:'pointer', fontSize:'12px', fontWeight:on?600:500, fontFamily:'inherit', letterSpacing:'0', whiteSpace:'nowrap'}}, lab); })); }

  // ---------- login ----------
  doLogin(){
    if(this.state.loginBusy) return;
    const email=this.state.loginEmail, mode=this.state.loginMode;
    if(!/.+@.+\..+/.test(email)){ this.setState({loginErr:'Enter a valid work email.'}); return; }
    if(mode==='password' && !this.state.loginPw){ this.setState({loginErr:'Enter your password.'}); return; }
    this.setState({loginBusy:true, loginErr:''});
    fetch('/api/builder/login/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email, password:this.state.loginPw, mode})})
      .then(async r=>{ const j=await r.json().catch(()=>({}));
        if(r.ok && j.magic){ this.setState({loginBusy:false, loginErr:''}); this.toast('Magic link sent — check your email.'); }
        else if(r.ok){ this.setState({loginBusy:false, loginPw:'', screen:'dashboard'}); this.loadPages(); this.loadSavedTemplates(); }
        else { this.setState({loginBusy:false, loginErr: j.error || 'Sign-in failed.'}); }
      })
      .catch(()=>this.setState({loginBusy:false, loginErr:'Network error — try again.'}));
  }
  renderLogin(){
    const h=React.createElement; const SCH="'ABC Schengen','Inter',system-ui,sans-serif"; const GTD="'GT Eesti Pro Display','Inter',system-ui,sans-serif";
    const logo = h('svg',{viewBox:'0 0 80 80', width:30, height:30, fill:'currentColor', style:{display:'block'}},
      h('ellipse',{cx:14.718,cy:40,rx:14.718,ry:30.732}), h('ellipse',{cx:33.283,cy:40,rx:10.31,ry:38.537}),
      h('ellipse',{cx:47.615,cy:40,rx:3.544,ry:40}), h('ellipse',{cx:59.5,cy:40,rx:5,ry:32}), h('ellipse',{cx:72,cy:40,rx:3.3,ry:18}));
    const field=(label, node)=> h('div',{style:{marginBottom:16}}, h('div',{style:this.mono({fontSize:'10px', marginBottom:8})}, label), node);
    const inputStyle={width:'100%', padding:'12px 13px', borderRadius:9, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', fontSize:'14.5px', fontFamily:'inherit', outline:'none'};
    const onKey=e=>{ if(e.key==='Enter') this.doLogin(); };
    return h('div',{style:{height:'100%', display:'flex'}},
      // brand well
      h('div',{style:{flex:'1 1 52%', position:'relative', background:'#011C00', color:'#FDFBF4', backgroundImage:'url('+this.grad('magenta-green')+')', backgroundSize:'cover', backgroundPosition:'center', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 52px', overflow:'hidden'}},
        h('div',{style:{position:'absolute', inset:0, background:'linear-gradient(150deg, rgba(1,28,0,.42), rgba(1,28,0,.72))', pointerEvents:'none'}}),
        h('div',{style:{position:'relative', display:'flex', alignItems:'center', gap:12}}, logo, h('div',{style:{fontFamily:SCH, fontWeight:600, fontSize:'17px', letterSpacing:'-0.01em'}}, 'Backspace Oddity')),
        h('div',{style:{position:'relative', maxWidth:480}},
          h('div',{style:this.mono({color:'rgba(253,251,244,.65)', marginBottom:22})}, 'Landing builder'),
          h('h1',{style:{fontFamily:GTD, fontWeight:400, fontSize:'46px', lineHeight:1.08, letterSpacing:'-0.01em', margin:0}}, 'We live in a world where everything works, but nothing matters.'),
          h('p',{style:{fontFamily:"'GT Eesti Pro Text','Inter',system-ui,sans-serif", fontSize:'17px', lineHeight:1.5, color:'rgba(253,251,244,.78)', marginTop:22, maxWidth:430}}, 'Assemble client landing and proposal pages from our own section system \u2014 then publish them where they belong.')),
        h('div',{style:{position:'relative', fontFamily:"'GT Eesti Pro Text','Inter',system-ui,sans-serif", fontSize:'14px', color:'rgba(253,251,244,.6)'}}, 'Vijzelstraat 68-78, 1017 ES Amsterdam')),
      // form
      h('div',{style:{flex:'1 1 48%', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px', background:'var(--paper)'}},
        h('div',{style:{width:'100%', maxWidth:360}},
          h('div',{style:{fontFamily:SCH, fontWeight:700, fontSize:'27px', letterSpacing:'-0.02em', marginBottom:8}}, 'Sign in'),
          h('div',{style:{fontSize:'14px', color:'var(--muted)', marginBottom:28, lineHeight:1.45}}, 'Use your Backspace Oddity workspace account.'),
          field('Work email', h('input',{type:'email', value:this.state.loginEmail, placeholder:'you@backspaceoddity.com', onChange:e=>this.setState({loginEmail:e.target.value, loginErr:''}), onKeyDown:onKey, autoFocus:true, style:inputStyle})),
          this.state.loginMode==='password' && field('Password', h('input',{type:'password', value:this.state.loginPw, placeholder:'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', onChange:e=>this.setState({loginPw:e.target.value, loginErr:''}), onKeyDown:onKey, style:inputStyle})),
          this.state.loginErr && h('div',{style:{fontSize:'12.5px', color:'#C0392B', marginTop:-6, marginBottom:14}}, this.state.loginErr),
          h('button',{onClick:()=>this.doLogin(), disabled:this.state.loginBusy, style:{width:'100%', padding:'13px', borderRadius:9, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:this.state.loginBusy?'default':'pointer', fontSize:'14.5px', fontWeight:600, fontFamily:'inherit', opacity:this.state.loginBusy?0.7:1}}, this.state.loginBusy?'Signing in\u2026':'Sign in'),
          h('div',{style:{display:'flex', alignItems:'center', gap:12, margin:'20px 0'}}, h('div',{style:{flex:1, height:1, background:'var(--rule)'}}), h('span',{style:this.mono({fontSize:'9.5px'})}, 'or'), h('div',{style:{flex:1, height:1, background:'var(--rule)'}})),
          h('button',{onClick:()=>this.setState({loginMode:this.state.loginMode==='password'?'magic':'password', loginErr:''}), style:{width:'100%', padding:'12px', borderRadius:9, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', cursor:'pointer', fontSize:'13.5px', fontWeight:500, fontFamily:'inherit'}}, this.state.loginMode==='password'?'Email me a magic link instead':'Use a password instead'),
          h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:24, lineHeight:1.5}}, 'Need access? Ask a workspace admin, or write to ', h('span',{style:{color:'var(--ink)', fontWeight:500}}, 'start@backspaceoddity.com'), '.'))));
  }

  // ---------- topbar ----------
  renderTopbar(){
    const h=React.createElement; const {screen} = this.state;
    const logo = h('svg',{viewBox:'0 0 80 80', width:22, height:22, fill:'currentColor', style:{display:'block'}},
      h('ellipse',{cx:14.718,cy:40,rx:14.718,ry:30.732}), h('ellipse',{cx:33.283,cy:40,rx:10.31,ry:38.537}),
      h('ellipse',{cx:47.615,cy:40,rx:3.544,ry:40}), h('ellipse',{cx:59.5,cy:40,rx:5,ry:32}), h('ellipse',{cx:72,cy:40,rx:3.3,ry:18}));
    return h('div',{className:'bso-topbar', style:{height:56, flex:'0 0 56px', borderBottom:'1px solid var(--rule)', background:'var(--surface)', display:'flex', alignItems:'center', padding:'0 16px', gap:7, zIndex:30}},
      h('div',{style:{display:'flex', alignItems:'center', gap:10, color:'var(--ink)'}}, logo,
        h('div',{style:{lineHeight:1}},
          h('div',{style:{fontWeight:700, fontSize:'14px', letterSpacing:'-0.01em'}}, 'Backspace Oddity'),
          h('div',{style:this.mono({fontSize:'9.5px', marginTop:2})}, 'Landing builder'))),
      screen==='editor' && h('div',{style:{display:'flex', alignItems:'center', gap:10, marginLeft:8, paddingLeft:14, borderLeft:'1px solid var(--rule)'}},
        h('button',{onClick:()=>this.backToDash(), style:{background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'13px', fontFamily:'inherit', padding:0}}, '\u2190 All pages'),
        h('span',{style:{fontSize:'14px', fontWeight:600, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, this.state.pageTitle),
        this.pill(this.state.pageTab==='bso'?'BSO':'Community', '')),
      h('div',{style:{flex:1}}),
      screen==='editor' && this.state.locked && h('div',{style:Object.assign(this.mono(),{color:'#FF6647', display:'flex', alignItems:'center', gap:6})}, h('span',{style:{width:6,height:6,borderRadius:99,background:'#FF6647',display:'inline-block'}}), 'Locked'),
      screen==='editor' && h('button',{onClick:()=>this.setState({editMode:!this.state.editMode}), style:this.topBtn(this.state.editMode && !this.state.locked)}, this.state.editMode?'Edit mode: on':'Edit mode: off'),
      screen==='editor' && h('button',{onClick:()=>this.setState({libraryOpen:!this.state.libraryOpen}), style:this.topBtn(this.state.libraryOpen)}, 'Library'),
      screen==='editor' && h('button',{onClick:()=>this.setState({tweaksOpen:!this.state.tweaksOpen}), style:this.topBtn(this.state.tweaksOpen)}, 'Tweaks'),
      screen==='editor' && h('button',{onClick:()=>this.setState({versionsOpen:!this.state.versionsOpen}), style:this.topBtn(this.state.versionsOpen)}, 'History'),
      screen==='editor' && this.state.realPage && h('button',{onClick:()=>this.savePage(), 'data-tip':this.state.lastSavedBy?('Last saved by '+this.state.lastSavedBy):'Save page', style:Object.assign(this.actBtn(this.state.saveState!=='saved'), this.state.saveState==='error'?{borderColor:'#C0392B', color:'#C0392B', background:'var(--surface)'}:{}), disabled:this.state.saveState==='saving'}, this.saveLabel()),
      screen==='editor' && h('button',{onClick:()=>this.openInTab('analytics', this.state.currentPage||{id:'cur', name:this.state.pageTitle, status:'Draft'}), 'data-tip':'Open analytics in a new tab', style:this.actBtn(false)}, 'Analytics ↗'),
      screen==='editor' && h('button',{onClick:()=>this.openDeployFromEditor(), 'data-tip':'Open deploy in a new tab', style:this.actBtn(false)}, 'Deploy ↗'),
      screen==='editor' && h('button',{onClick:()=>this.setState({locked:!this.state.locked}), style:this.topBtn(false)}, this.state.locked?'Take over':'Simulate lock'),
      h('button',{onClick:()=>this.setState({variationsOpen:true}), style:this.topBtn(false)}, 'Variations'),
      h('button',{onClick:()=>this.setState({theme:this.state.theme==='light'?'dark':'light'}), style:this.topBtn(false), title:'Toggle builder theme'}, this.state.theme==='light'?'Dark':'Light'),
      screen==='dashboard' && h('button',{onClick:()=>this.setState({newPageOpen:true, newPageStep:1, newPageArche:null, newPageName:'', newPageDsId:DEFAULT_DS_ID}), style:Object.assign(this.topBtn(false),{background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)', fontWeight:600})}, '+ New page'),
    );
  }
  topBtn(active){ return {height:26, flex:'0 0 auto', padding:'0 10px', display:'inline-flex', alignItems:'center', border:'1px solid '+(active?'var(--ink)':'var(--rule)'), borderRadius:6, background:active?'var(--ink)':'transparent', color:active?'var(--paper)':'var(--muted)', cursor:'pointer', fontSize:'11px', fontWeight:500, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.02em', whiteSpace:'nowrap', transition:'border-color .12s, color .12s, background .12s'}; }
  // Action button — triggers/opens something (not a panel toggle). Always solid, never a muted "off" state.
  actBtn(filled){ return {height:26, flex:'0 0 auto', padding:'0 11px', display:'inline-flex', alignItems:'center', gap:4, border:'1px solid var(--ink)', borderRadius:6, background:filled?'var(--ink)':'var(--surface)', color:filled?'var(--paper)':'var(--ink)', cursor:'pointer', fontSize:'11px', fontWeight:600, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.02em', whiteSpace:'nowrap', boxShadow:'0 1px 2px rgba(1,28,0,.08)'}; }

  // ---------- dashboard ----------
  renderDashboard(){
    const h=React.createElement; const {dashTab, dashView, dashPageIdx} = this.state;
    const all = (this.state.pages||[]).filter(p=>p.tab===dashTab && !p.archived);
    const per = dashView==='rows'?6:8; const pages=Math.ceil(all.length/per)||1; const slice=all.slice(dashPageIdx*per,(dashPageIdx+1)*per);
    // Tabs are DATA-DRIVEN: bso + community always, plus any other tab a page actually
    // uses (e.g. 'product' from the Merz pages). A hardcoded tab list hid pages created
    // under a new tab — they existed in the DB but had no tab to show under. (BSO-658.)
    const TAB_LABELS = { bso:'BSO', community:'Community Sprints', product:'Product' };
    const tabName = (k)=> TAB_LABELS[k] || (String(k||'').charAt(0).toUpperCase()+String(k||'').slice(1));
    const tabKeys = Array.from(new Set(['bso','community', ...(this.state.pages||[]).filter(p=>!p.archived).map(p=>p.tab||'bso')]));
    return h('div',{className:'bso-scroll', style:{height:'100%', overflowY:'auto', background:'var(--paper)'}},
      h('div',{style:{maxWidth:1080, margin:'0 auto', padding:'40px 32px 64px'}},
        h('div',{style:{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16}},
          h('div',null,
            h('div',{style:this.mono({marginBottom:10})}, 'Workspace'),
            h('h1',{style:{margin:0, fontSize:'42px', fontWeight:700, letterSpacing:'-0.025em', lineHeight:1.05, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, 'Pages'),
            h('div',{style:{fontSize:'15px', color:'var(--muted)', marginTop:8}}, all.length+' pages · '+tabName(dashTab))),
          h('div',{style:{display:'flex', gap:10, alignItems:'center'}},
            this.seg([{v:'rows',l:'Rows'},{v:'gallery',l:'Grid'}], dashView, v=>this.setState({dashView:v})),
            h('button',{onClick:()=>this.setState({newPageOpen:true, newPageStep:1, newPageArche:null, newPageName:'', newPageDsId:DEFAULT_DS_ID}), style:{padding:'9px 16px', border:'1px solid var(--ink)', borderRadius:8, background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit'}}, 'New page from template'))),
        // tabs
        h('div',{style:{display:'flex', gap:24, borderBottom:'1px solid var(--rule)', marginBottom:24}},
          tabKeys.map((k)=> h('button',{key:k, onClick:()=>this.setState({dashTab:k, dashPageIdx:0}), style:{padding:'0 0 12px', background:'none', border:'none', borderBottom:'2px solid '+(dashTab===k?'var(--ink)':'transparent'), marginBottom:-1, cursor:'pointer', fontSize:'15px', fontWeight:dashTab===k?600:500, color:dashTab===k?'var(--ink)':'var(--muted)', fontFamily:'inherit'}}, tabName(k)))),
        dashView==='rows' ? this.renderRows(slice) : this.renderGallery(slice),
        pages>1 && h('div',{style:{display:'flex', gap:8, justifyContent:'center', marginTop:32}},
          Array.from({length:pages}).map((_,i)=> h('button',{key:i, onClick:()=>this.setState({dashPageIdx:i}), style:{width:34, height:34, borderRadius:8, border:'1px solid var(--rule2)', background:i===dashPageIdx?'var(--ink)':'var(--surface)', color:i===dashPageIdx?'var(--paper)':'var(--muted)', cursor:'pointer', fontFamily:"'IBM Plex Mono',monospace", fontSize:'12px'}}, i+1)))
      ));
  }
  thumb(img, w, hh){ const h=React.createElement; return h('div',{style:{width:w, height:hh, borderRadius:8, background:'#011C00', backgroundImage:'url('+this.grad(img)+')', backgroundSize:'cover', backgroundPosition:'center', flex:'0 0 auto'}}); }
  renderRows(slice){
    const h=React.createElement;
    return h('div',{style:{border:'1px solid var(--rule)', borderRadius:12, overflow:'hidden', background:'var(--surface)'}},
      h('div',{style:{display:'grid', gridTemplateColumns:'1fr 104px 96px 84px 300px', gap:16, padding:'11px 18px', borderBottom:'1px solid var(--rule)', background:'var(--soft)'}},
        ['Page','Owner','Edited','Status',''].map((c,i)=> h('div',{key:i, style:this.mono({fontSize:'10px'})}, c))),
      slice.map((p,idx)=> h('div',{key:p.id, onClick:()=>this.openPage(p), style:{display:'grid', gridTemplateColumns:'1fr 104px 96px 84px 300px', gap:16, padding:'14px 18px', alignItems:'center', borderBottom:idx<slice.length-1?'1px solid var(--rule)':'none', cursor:'pointer'}, onMouseEnter:e=>e.currentTarget.style.background='var(--soft)', onMouseLeave:e=>e.currentTarget.style.background='transparent'},
        h('div',{style:{display:'flex', alignItems:'center', gap:14, minWidth:0}}, this.thumb(p.img, 52, 36),
          h('div',{style:{minWidth:0}}, h('div',{style:{fontSize:'15px', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, p.name),
            h('div',{style:this.mono({fontSize:'10px', marginTop:3, textTransform:'none', letterSpacing:0})}, '/'+p.id))),
        h('div',{style:{fontSize:'14px', color:'var(--muted)'}}, p.owner),
        h('div',{style:{fontSize:'14px', color:'var(--muted)'}}, p.edited),
        h('div',null, this.pill(p.status,'')),
        h('div',{style:{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:7}},
          h('button',{onClick:e=>{e.stopPropagation(); this.archivePage(p.id);}, 'data-tip':'Archive', title:'Archive', style:{width:28, height:28, padding:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'1px solid var(--rule2)', background:'transparent', color:'var(--muted)', cursor:'pointer'}}, this.rowIcon('archive','currentColor')),
          h('button',{onClick:e=>{e.stopPropagation(); if(typeof window!=='undefined' && window.confirm('Delete this page?')) this.deletePage(p.id);}, 'data-tip':'Delete', title:'Delete', style:{width:28, height:28, padding:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'1px solid var(--rule2)', background:'transparent', color:'#C0392B', cursor:'pointer'}}, this.rowIcon('delete','currentColor')),
          h('button',{onClick:e=>{e.stopPropagation(); this.openInTab('analytics', p);}, 'data-tip':'Analytics (new tab)', title:'Analytics', style:{width:28, height:28, padding:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', cursor:'pointer'}}, this.rowIcon('analytics','currentColor')),
          h('button',{onClick:e=>{e.stopPropagation(); this.openInTab('deploy', p);}, 'data-tip':'Deploy (new tab)', style:{padding:'6px 12px', borderRadius:6, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'11.5px', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:5}}, 'Deploy', h('span',{style:{fontSize:'10px'}}, '↗'))))));
  }
  renderGallery(slice){
    const h=React.createElement;
    return h('div',{style:{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14}},
      slice.map((p,idx)=> h('div',{key:p.id, onClick:()=>this.openPage(p), style:{border:'1px solid var(--rule)', borderRadius:12, overflow:'hidden', background:'var(--surface)', cursor:'pointer', transition:'transform .2s'}, onMouseEnter:e=>e.currentTarget.style.transform='translateY(-3px)', onMouseLeave:e=>e.currentTarget.style.transform='none'},
        h('div',{style:{height:96, background:'#011C00', backgroundImage:'url('+this.grad(p.img)+')', backgroundSize:'cover', backgroundPosition:'center'}}),
        h('div',{style:{padding:'11px 12px 13px'}},
          h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10}},
            h('div',{style:{fontSize:'13.5px', fontWeight:600, lineHeight:1.25, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, p.name), this.pill(p.status,'')),
          h('div',{style:{display:'flex', gap:10, marginTop:9}},
            h('span',{style:this.mono({fontSize:'9.5px'})}, p.owner), h('span',{style:this.mono({fontSize:'9.5px'})}, p.edited))))));
  }

  // ---------- editor ----------
  renderEditor(){
    const h=React.createElement; const {editorLayout, libraryOpen, tweaksOpen} = this.state;
    const lib = this.renderLibrary();
    const tweaks = this.renderTweaks();
    const canvas = this.renderCanvas();
    const cols = editorLayout==='lr'
      ? [libraryOpen&&lib, canvas, tweaksOpen&&tweaks]
      : [tweaksOpen&&tweaks, canvas, libraryOpen&&lib];
    return h('div',{style:{height:'100%', display:'flex', minHeight:0, position:'relative'}},
      this.state.locked && this.renderLockBanner(),
      this.state.previewVersionId && this.renderPreviewBanner(),
      cols.filter(Boolean).map((c,i)=>h(React.Fragment,{key:i}, c)),
      this.renderTplHover(),
      this.state.versionsOpen && this.renderVersions());
  }
  renderTplHover(){
    const h=React.createElement; const ht=this.state.hoverTpl; if(!ht) return null;
    const vh=(typeof window!=='undefined'?window.innerHeight:900);
    if(ht.real){
      const top=Math.max(64, Math.min(ht.top, vh-340));
      return h('div',{style:{position:'fixed', top, left:ht.left, zIndex:60, width:340, background:'var(--surface)', border:'1px solid var(--rule)', borderRadius:12, boxShadow:'var(--shadow)', overflow:'hidden', pointerEvents:'none', animation:'bsofade .12s both'}},
        this.realPreview(ht.btType, ht.props, 0.30, 300),
        h('div',{style:{padding:'9px 12px', fontSize:'13px', fontWeight:600, borderTop:'1px solid var(--rule)', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, ht.name));
    }
    const top=Math.max(64, Math.min(ht.top, vh-220));
    return h('div',{style:{position:'fixed', top, left:ht.left, zIndex:60, width:248, background:'var(--surface)', border:'1px solid var(--rule)', borderRadius:12, boxShadow:'var(--shadow)', padding:12, pointerEvents:'none', animation:'bsofade .12s both'}},
      this.miniPreview(ht.type, ht.bg, '100%', 132),
      h('div',{style:{fontSize:'13px', fontWeight:600, marginTop:9, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, ht.name),
      ht.desc && h('div',{style:{fontSize:'11.5px', color:'var(--muted)', marginTop:3, lineHeight:1.4}}, ht.desc));
  }
  renderLockBanner(){
    const h=React.createElement;
    return h('div',{style:{position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', zIndex:40, background:'var(--ink)', color:'var(--paper)', borderRadius:10, padding:'10px 16px', display:'flex', alignItems:'center', gap:14, boxShadow:'var(--shadow)', animation:'bsofade .3s both'}},
      h('span',{style:{width:7,height:7,borderRadius:99,background:'#FF6647', animation:'bsoblink 1.4s infinite'}}),
      h('span',{style:{fontSize:'13.5px'}}, h('strong',null, this.state.lockOwner), ' is editing this page — it\u2019s read-only for you.'),
      h('button',{onClick:()=>this.setState({locked:false}), style:{padding:'5px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,.3)', background:'transparent', color:'var(--paper)', cursor:'pointer', fontSize:'12.5px', fontFamily:'inherit'}}, 'Take over'),
      h('button',{onClick:()=>this.setState({locked:false}), style:{padding:'5px 12px', borderRadius:7, border:'none', background:'var(--paper)', color:'var(--ink)', cursor:'pointer', fontSize:'12.5px', fontWeight:600, fontFamily:'inherit'}}, 'Request access'));
  }

  libTabIcon(kind, on){
    const h=React.createElement; const c=on?'var(--paper)':'var(--muted)';
    const svg=kids=>h('svg',{width:15,height:15,viewBox:'0 0 16 16',fill:'none',stroke:c,strokeWidth:1.4,strokeLinecap:'round',strokeLinejoin:'round'},kids);
    if(kind==='sections') return svg([h('rect',{key:1,x:2.5,y:2.5,width:11,height:11,rx:1.6}),h('line',{key:2,x1:5,y1:6,x2:11,y2:6}),h('line',{key:3,x1:5,y1:8.3,x2:11,y2:8.3}),h('line',{key:4,x1:5,y1:10.6,x2:9,y2:10.6})]);
    if(kind==='layouts') return svg([h('rect',{key:1,x:2.5,y:2.5,width:11,height:11,rx:1.6,strokeDasharray:'2.3 1.8'}),h('line',{key:2,x1:5,y1:6.4,x2:11,y2:6.4,strokeDasharray:'2 1.7'}),h('line',{key:3,x1:5,y1:9.4,x2:9,y2:9.4,strokeDasharray:'2 1.7'})]);
    if(kind==='saved') return svg([h('path',{key:1,d:'M4 2.6 H12 a0.6 0.6 0 0 1 0.6 0.6 V13.4 L8 10.4 L3.4 13.4 V3.2 a0.6 0.6 0 0 1 0.6 -0.6 Z'})]);
    return svg([h('rect',{key:1,x:2.5,y:3,width:11,height:10,rx:1.6}),h('circle',{key:2,cx:6,cy:6.4,r:1.1}),h('path',{key:3,d:'M3.4 12 L6.8 8.6 L9.3 11 L11 9.4 L12.6 11'})]);
  }
  rowIcon(kind, c){
    const h=React.createElement;
    const svg=kids=>h('svg',{width:15,height:15,viewBox:'0 0 16 16',fill:'none',stroke:c,strokeWidth:1.4,strokeLinecap:'round',strokeLinejoin:'round'},kids);
    if(kind==='archive') return svg([h('rect',{key:1,x:2.3,y:3,width:11.4,height:2.6,rx:0.6}),h('path',{key:2,d:'M3.3 5.6 V12.6 a0.6 0.6 0 0 0 0.6 0.6 H12.1 a0.6 0.6 0 0 0 0.6 -0.6 V5.6'}),h('line',{key:3,x1:6.4,y1:8.3,x2:9.6,y2:8.3})]);
    if(kind==='delete') return svg([h('line',{key:1,x1:3,y1:4.4,x2:13,y2:4.4}),h('path',{key:2,d:'M5.2 4.4 V3.3 a0.6 0.6 0 0 1 0.6 -0.6 H10.2 a0.6 0.6 0 0 1 0.6 0.6 V4.4'}),h('path',{key:3,d:'M4.4 4.4 L5 13 a0.6 0.6 0 0 0 0.6 0.6 H10.4 a0.6 0.6 0 0 0 0.6 -0.6 L11.6 4.4'}),h('line',{key:4,x1:6.6,y1:6.6,x2:6.8,y2:11.2}),h('line',{key:5,x1:9.4,y1:6.6,x2:9.2,y2:11.2})]);
    return svg([h('line',{key:1,x1:3,y1:13,x2:13,y2:13}),h('rect',{key:2,x:3.4,y:8.4,width:2.4,height:3.6,rx:0.5}),h('rect',{key:3,x:6.8,y:5.6,width:2.4,height:6.4,rx:0.5}),h('rect',{key:4,x:10.2,y:3.4,width:2.4,height:8.6,rx:0.5})]);
  }
  // ---------- library panel ----------
  renderLibrary(){
    const h=React.createElement; const side=this.state.editorLayout==='lr'?'right':'left';
    const border = side==='right'?{borderRight:'1px solid var(--rule)'}:{borderLeft:'1px solid var(--rule)'};
    return h('div',{className:'bso-scroll', style:Object.assign({width:this.state.libW, flex:'0 0 '+this.state.libW+'px', background:'var(--surface)', overflowY:'auto', height:'100%'}, border)},
      h('div',{style:{padding:'18px 18px 12px', position:'sticky', top:0, background:'var(--surface)', borderBottom:'1px solid var(--rule)', zIndex:2}},
        h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}},
          h('div',{style:this.mono()}, 'Library'),
          h('button',{onClick:()=>this.setState({libraryOpen:false}), style:{background:'none',border:'none',cursor:'pointer',color:'var(--faint)',fontSize:'16px',padding:0}}, '\u00d7')),
        h('div',{style:{display:'flex', gap:5}}, [['sections','Sections'],['layouts','Layouts'],['saved','Saved'],['assets','Assets']].map(p=>{ const k=p[0]; const on=this.state.libTab===k; return h('button',{key:k, 'data-tip':p[1], title:p[1], onClick:()=>this.setState({libTab:k}), style:{flex:1, minWidth:0, height:30, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'1px solid '+(on?'var(--ink)':'var(--rule)'), background:on?'var(--ink)':'transparent', cursor:'pointer', transition:'border-color .12s, background .12s'}}, this.libTabIcon(k,on)); }))),
      this.state.libTab==='assets' ? this.renderAssets()
      : this.state.libTab==='saved' ? this.renderSaved()
      : this.state.libTab==='layouts' ? h('div',{style:{padding:'12px 14px'}},
          h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:12, lineHeight:1.4}}, 'Structure only, placeholder text — for designing freely. Drag onto the canvas.'),
          h('div',{style:{display:'flex', flexDirection:'column', gap:10}},
            this.TEMPLATES.map(t=> h('div',{key:t.type, style:{display:'flex', alignItems:'flex-start', gap:5}},
              h('span',{style:{flex:'0 0 auto', width:16}}),
              this.layoutTile(t.type, t.name, t.desc)))),
          this.renderAsk())
      : this.renderBtSections());
  }
  // ---------- real-page sections: type -> variations ----------
  toggleLibType(t){ this.setState(s=>{ const e=Object.assign({}, s.libExpanded); if(e[t]) delete e[t]; else e[t]=true; return {libExpanded:e}; }); }
  // Keynote-style outline: a delicate disclosure triangle per multi-variation
  // type; variations expand inline, indented to the right — all on one screen.
  // Shared wide-tile shell — used by BOTH the Sections tab (typeTile) and the
  // Layouts tab (layoutTile) so the two can't drift. `thumb` is the rendered
  // preview element on top; `extra` carries hover/drag handlers + cursor.
  // `add` (optional) = {token, build, name}. When present the tile becomes a
  // two-step leaf-insert tile: clicking SELECTS it (revealing an Add-to-canvas
  // overlay) instead of inserting; the overlay button performs the insert.
  tileShell(thumb, name, multiCount, onClick, extra, add){
    const h=React.createElement; const picked = add && this.isPicked(add.token);
    const click = add ? (e=>{ if(e&&e.stopPropagation) e.stopPropagation(); this.pickTile(add.token, add.build, add.name||name); }) : onClick;
    return h('div', Object.assign({ onClick:click,
        style:{flex:1, minWidth:0, border:'1px solid '+(picked?'var(--ink)':'var(--rule2)'), borderRadius:9, overflow:'hidden', cursor:(extra&&extra.cursor)||'pointer', background:'var(--surface)', transition:'border-color .12s', boxShadow:picked?'0 0 0 1px var(--ink)':'none'}}, extra&&extra.props),
      h('div',{style:{position:'relative'}},
        thumb,
        multiCount && h('div',{style:{position:'absolute', top:6, right:6, background:'rgba(1,28,0,.82)', color:'#F2F2F0', fontSize:'9px', fontWeight:600, fontFamily:"'JetBrains Mono',monospace", borderRadius:4, padding:'1px 5px', lineHeight:1.4}}, multiCount),
        picked && h('div',{style:{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(1,28,0,.34)'}},
          h('button',{onClick:e=>{ e.stopPropagation(); this.addPicked(add.build, add.name||name); },
            style:{background:'var(--ink)', color:'#F2F2F0', border:'none', borderRadius:99, padding:'12px 24px', fontSize:'15px', fontWeight:600, cursor:'pointer', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif", boxShadow:'0 2px 10px rgba(0,0,0,.3)'}}, '+ Add to canvas'))),
      h('div',{style:{padding:'8px 11px 9px', fontSize:'12px', fontWeight:600, color:'var(--ink)', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, name));
  }
  // ---------- Saved tab (BSO-658) ----------
  renderSaved(){
    const h=React.createElement; const list=this.state.savedTemplates||[];
    return h('div',{style:{padding:'14px 16px'}},
      h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:12, lineHeight:1.4}}, 'Sections you saved. Drag onto the canvas or click to add.'),
      list.length===0
        ? h('div',{style:{fontSize:'12px', color:'var(--faint)', lineHeight:1.5, padding:'8px 2px'}}, 'No saved templates yet — click the ☆ save button on any section to add it here.')
        : h('div',{style:{display:'flex', flexDirection:'column', gap:10}}, list.map(t=>h('div',{key:t.id}, this.savedTile(t)))));
  }
  // A saved-template tile: same wide-tile shell as Sections/Layouts, draggable + click-to-insert, with a delete affordance.
  savedTile(t){
    const h=React.createElement;
    const thumb=h('div',{style:{position:'relative'}},
      this.savedThumb(t, 80, 0.185),
      h('button',{onClick:e=>{e.stopPropagation(); this.deleteSavedTemplate(t.id);}, 'data-tip':'Delete template',
        style:{position:'absolute', top:6, right:6, zIndex:3, width:20, height:20, borderRadius:99, border:'none', background:'rgba(1,28,0,.66)', color:'#F2F2F0', cursor:'pointer', fontSize:'12px', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', padding:0}}, '×'));
    return this.tileShell(thumb, t.name, null, null, {
      cursor:'grab',
      props:{
        draggable:true, title:t.name,
        onDragStart:e=>{ this.setState({draggingType:'saved:'+t.id}); e.dataTransfer.effectAllowed='copy'; },
        onDragEnd:()=>this.setState({draggingType:null, dropAt:null}),
        onMouseEnter:e=>{ if(!this.isPicked('saved:'+t.id)) e.currentTarget.style.borderColor='var(--ink)'; },
        onMouseLeave:e=>{ if(!this.isPicked('saved:'+t.id)) e.currentTarget.style.borderColor='var(--rule2)'; },
      }}, {token:'saved:'+t.id, build:()=>this.savedInstance(t.id), name:t.name});
  }
  typeTile(sec, props, name, multiCount, onClick, add){
    const tok = add && add.token;
    return this.tileShell(this.thumbFill(sec.type, props, 80, 0.185), name, multiCount, onClick, {
      props:{
        onMouseEnter:e=>{ if(!(tok&&this.isPicked(tok))) e.currentTarget.style.borderColor='var(--ink)'; const r=e.currentTarget.getBoundingClientRect(); this.setState({hoverTpl:{real:true, btType:sec.type, props, name, top:r.top, left:r.right+12}}); },
        onMouseLeave:e=>{ if(!(tok&&this.isPicked(tok))) e.currentTarget.style.borderColor='var(--rule2)'; this.setState({hoverTpl:null}); },
      }}, add);
  }
  // Layouts tab: same wide-tile shell, but the thumbnail is a real render of a
  // synthetic structural block, and the tile is draggable onto the canvas.
  layoutTile(typeKey, name, desc){
    const h=React.createElement;
    return this.tileShell(this.synthThumb(typeKey, 80, 0.185), name, null, null, {
      cursor:'grab',
      props:{
        draggable:true, title:desc,
        onDragStart:e=>{ this.setState({draggingType:'blank:'+typeKey}); e.dataTransfer.effectAllowed='copy'; },
        onDragEnd:()=>this.setState({draggingType:null, dropAt:null}),
        onMouseEnter:e=>{ if(!this.isPicked('layout:'+typeKey)) e.currentTarget.style.borderColor='var(--ink)'; const r=e.currentTarget.getBoundingClientRect(); this.setState({hoverTpl:{type:typeKey, name, desc, bg:'paper', top:r.top, left:r.right+12}}); },
        onMouseLeave:e=>{ if(!this.isPicked('layout:'+typeKey)) e.currentTarget.style.borderColor='var(--rule2)'; this.setState({hoverTpl:null}); },
      }}, {token:'layout:'+typeKey, build:()=>this.makeBlock(typeKey,{props:this.placeholders(typeKey), bg:'paper'}), name});
  }
  // Width-filling scaled thumbnail of a synthetic structural block (placeholder
  // copy) — the Layouts-tab counterpart to thumbFill. Renders the same canvas
  // body (blockInner) used on the real canvas, statically (pointer-events off).
  synthThumb(type, hh, zoom){
    const h=React.createElement;
    const inst={id:'__thumb-'+type, type, bg:type==='hero'?'forest':'paper', pad:'M', props:this.placeholders(type), overrides:{}};
    const forest=inst.bg==='forest'; const fg=forest?'#FDFBF4':'#011C00';
    const heroImg=forest&&type==='hero';
    const bg=forest?'#011C00':'transparent';
    // For the forest hero, the image (+gradient overlay) lives on the OUTER
    // height:hh container so it fills the whole tile regardless of how short the
    // scaled content is. The inner scaled div stays transparent and just carries
    // the headline/CTA on top. Non-image layouts keep their plain paper bg.
    return h('div',{style:{position:'relative', width:'100%', height:hh, overflow:'hidden', background:forest?'#011C00':'#F2F2F0', backgroundImage:heroImg?'url('+this.imgUrl(inst.props.img||'magenta-green')+')':'none', backgroundSize:'cover', backgroundPosition:'center'}},
      heroImg && h('div',{style:{position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.55))', pointerEvents:'none'}}),
      h('div',{style:{position:'relative', zIndex:2, width:1100, zoom:zoom||0.069, pointerEvents:'none', background:heroImg?'transparent':bg, color:fg}},
        h('div',{style:{position:'relative', zIndex:2, padding:this.blockPad(inst)}}, this.blockInner(inst, fg))));
  }
  renderBtSections(){
    const h=React.createElement; const exp=this.state.libExpanded||{};
    // Sections are bound to the OPEN page's design system (registry). A DS with no
    // sections yet (Urembo placeholder) shows an empty-state pointing at Layouts.
    const ds=getDs(this.activeDsId()); const sections=ds.sections||[];
    if(!sections.length){
      return h('div',{style:{padding:'14px 16px'}},
        h('div',{style:{fontSize:'13px', fontWeight:600, color:'var(--ink)', marginBottom:8, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, ds.name+' sections are being ported'),
        h('div',{style:{fontSize:'12px', color:'var(--muted)', lineHeight:1.5}}, 'This design system has no real sections yet — use the Layouts tab for structural placeholders for now.'));
    }
    return h('div',{style:{padding:'12px 14px'}},
      h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:12, lineHeight:1.4}}, 'Real sections from this page’s design system. Open the ▸ to see variations — hover to preview.'),
      h('div',{style:{display:'flex', flexDirection:'column', gap:10}},
        sections.map(sec=>{
          const first=sec.variations[0]; const multi=sec.variations.length>1; const open=!!exp[sec.type];
          return h('div',{key:sec.type},
            h('div',{style:{display:'flex', alignItems:'flex-start', gap:5}},
              multi ? h('button',{onClick:e=>{e.stopPropagation(); this.toggleLibType(sec.type);}, 'data-tip':open?'Collapse':'Show variations',
                  style:{flex:'0 0 auto', width:16, height:34, display:'inline-flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', padding:0}},
                  h('span',{style:{display:'inline-block', transform:open?'rotate(90deg)':'none', transition:'transform .14s', fontSize:'10px'}}, '▶'))
                : h('span',{style:{flex:'0 0 auto', width:16}}),
              this.typeTile(sec, first.props, sec.name+(multi?' · '+sec.variations.length+' variations':''), multi?sec.variations.length:null, multi?(()=>this.toggleLibType(sec.type)):null, multi?null:{token:'bt:'+sec.type+':'+first.id, build:()=>({id:this.nid('bt'), type:sec.type, props:this.clone(first.props), real:true}), name:sec.name}) ),
            open && h('div',{style:{marginLeft:20, marginTop:8, display:'flex', flexDirection:'column', gap:8}},
              sec.variations.map((v,i)=> h('div',{key:v.id, style:{display:'flex', alignItems:'center', gap:8}},
                h('span',{style:{flex:'0 0 auto', width:11, textAlign:'right', fontSize:'10px', color:'var(--faint)', fontFamily:"'JetBrains Mono',monospace"}}, i+1),
                h('div',{style:{flex:1, minWidth:0}}, this.btVarCard(sec.type, v))))));
        })));
  }
  // Width-filling scaled thumbnail of a real section (for the type tile).
  thumbFill(type, props, hh, zoom){
    const h=React.createElement; const Comp=BT_COMPONENTS[type]; if(!Comp) return null;
    return h('div',{style:{width:'100%', height:hh, overflow:'hidden', background:'#F2F2F0'}},
      h('div',{className:'page bt-page', style:{width:1100, zoom:zoom||0.069, pointerEvents:'none'}}, h(Comp, props)));
  }
  btVarCard(type, v){
    const h=React.createElement; const tok='btvar:'+type+':'+v.id; const picked=this.isPicked(tok);
    const build=()=>({id:this.nid('bt'), type, props:this.clone(v.props), real:true});
    return h('div',{key:v.id, onClick:e=>{ if(e&&e.stopPropagation) e.stopPropagation(); this.pickTile(tok, build, v.name); },
      onMouseEnter:e=>{ if(!picked) e.currentTarget.style.borderColor='var(--ink)'; const r=e.currentTarget.getBoundingClientRect(); this.setState({hoverTpl:{real:true, btType:type, props:v.props, name:v.name, top:r.top, left:r.right+12}}); },
      onMouseLeave:e=>{ if(!picked) e.currentTarget.style.borderColor='var(--rule2)'; this.setState({hoverTpl:null}); },
      style:{border:'1px solid '+(picked?'var(--ink)':'var(--rule2)'), borderRadius:7, overflow:'hidden', cursor:'pointer', background:'var(--surface)', transition:'border-color .12s', boxShadow:picked?'0 0 0 1px var(--ink)':'none'}},
      h('div',{style:{position:'relative'}},
        this.thumbFill(type, v.props, 64, 0.148),
        picked && h('div',{style:{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(1,28,0,.34)'}},
          h('button',{onClick:e=>{ e.stopPropagation(); this.addPicked(build, v.name); },
            style:{background:'var(--ink)', color:'#F2F2F0', border:'none', borderRadius:99, padding:'12px 24px', fontSize:'15px', fontWeight:600, cursor:'pointer', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif", boxShadow:'0 2px 10px rgba(0,0,0,.3)'}}, '+ Add to canvas'))),
      h('div',{style:{padding:'6px 9px 7px', fontSize:'10.5px', fontWeight:600, color:'var(--ink)'}}, v.name));
  }
  // Scaled, real render of a bt section (exact content) for previews.
  realPreview(type, props, scale, maxH){
    const h=React.createElement; const Comp=BT_COMPONENTS[type]; if(!Comp) return null;
    return h('div',{style:{width:'100%', height:maxH, overflow:'hidden', background:'#F2F2F0'}},
      h('div',{className:'page bt-page', style:{width:1100, zoom:scale, pointerEvents:'none'}}, h(Comp, props)));
  }
  insertBtVariation(type, v){
    const b={id:this.nid('bt'), type, props:this.clone(v.props), real:true};
    this.insertAt(this.state.blocks.length, b); this.toast(v.name+' added');
  }
  renderAssets(){
    const h=React.createElement; const inst=this.state.blocks.find(b=>b.id===this.state.selectedId);
    const canApply = inst && (inst.type==='hero'||inst.type==='casestudy');
    return h('div',{style:{padding:'14px 16px'}},
      h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginBottom:12, lineHeight:1.4}}, canApply? 'Click to apply to the selected '+this.typeName(inst.type)+', or drag onto any image area.' : 'Drag an image onto any image area on the canvas \u2014 hero, case study or a project tile.'),
      h('div',{style:{display:'flex', flexDirection:'column', gap:10, alignItems:'center'}},
        this.state.assets.map(a=> h('div',{key:a.id, draggable:true,
          onDragStart:e=>{ this.setState({draggingAsset:a.val}); e.dataTransfer.effectAllowed='copy'; },
          onDragEnd:()=>this.setState({draggingAsset:null}),
          onClick:()=>{ if(this.applyAssetToTarget(a.val)) return; if(canApply){ this.setBlockImg(inst.id, a.val); this.toast('Image applied to '+this.typeName(inst.type)); } else { this.toast('Select a hero or case-study block, or drag onto an image'); } },
          style:{position:'relative', width:152, maxWidth:'100%', display:'flex', flexDirection:'column', cursor:'grab', borderRadius:9, overflow:'hidden', border:'1px solid var(--rule2)', background:'var(--paper)'}},
          h('button',{onClick:e=>{e.stopPropagation(); this.deleteAsset(a.id);}, style:{position:'absolute', top:6, right:6, zIndex:3, width:20, height:20, borderRadius:99, border:'none', background:'rgba(1,28,0,.66)', color:'#F2F2F0', cursor:'pointer', fontSize:'12px', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', padding:0}}, '×'),
          h('div',{style:{height:90, flex:'0 0 auto', background:'#011C00', backgroundImage:'url('+this.imgUrl(a.val)+')', backgroundSize:'cover', backgroundPosition:'center'}}),
          h('div',{style:{flex:'0 0 auto', padding:'6px 8px', fontSize:'10.5px', color:'var(--muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}, a.name))),
        h('label',{style:{cursor:'pointer', width:152, maxWidth:'100%', borderRadius:9, border:'1px dashed var(--rule2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:110, color:'var(--muted)', fontSize:'11.5px', textAlign:'center', gap:3, padding:8}},
          h('span',{style:{fontSize:'18px', lineHeight:1}}, '+'),
          h('span',null, 'Upload image'),
          h('input',{type:'file', accept:'image/*', style:{display:'none'}, onChange:e=>this.uploadAsset(e)}))));
  }
  libCard(typeKey, name, desc, custom, bg, blank){
    const h=React.createElement; const isCustom=String(typeKey).startsWith('custom:');
    const mk=()=> isCustom?this.customInstance(typeKey):(blank?this.makeBlock(typeKey,{props:this.placeholders(typeKey), bg:'paper'}):this.makeBlock(typeKey));
    const tok='card:'+(blank?'blank-':'')+typeKey; const picked=this.isPicked(tok);
    return h('div',{key:(blank?'blank-':'')+typeKey, draggable:true, title:desc,
        onDragStart:e=>{ this.setState({draggingType:(blank?'blank:':'')+typeKey}); e.dataTransfer.effectAllowed='copy'; },
        onDragEnd:()=>this.setState({draggingType:null, dropAt:null}),
        onClick:e=>{ if(e&&e.stopPropagation) e.stopPropagation(); this.pickTile(tok, mk, name); },
        style:{position:'relative', border:'1px '+(blank?'dashed':'solid')+' '+(picked?'var(--ink)':'var(--rule2)'), borderRadius:7, padding:4, width:152, maxWidth:'100%', margin:'0 auto 8px', cursor:'grab', background:blank?'transparent':'var(--paper)', transition:'border-color .15s, transform .1s', boxShadow:picked?'0 0 0 1px var(--ink)':'none'},
        onMouseEnter:e=>{ if(!picked) e.currentTarget.style.borderColor='var(--ink)'; const r=e.currentTarget.getBoundingClientRect(); this.setState({hoverTpl:{type:isCustom?'custom':typeKey, name, desc, bg, top:r.top, left:r.right+12}}); },
        onMouseLeave:e=>{ if(!picked) e.currentTarget.style.borderColor='var(--rule2)'; this.setState({hoverTpl:null}); }},
      h('div',{style:{position:'relative'}},
        h('div',{style:{display:'flex', flexDirection:'column', gap:5}},
          this.miniPreview(isCustom?'custom':typeKey, bg, '100%', 90),
          h('div',{style:{fontSize:'11px', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', textAlign:'center', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, name)),
        picked && h('div',{style:{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(1,28,0,.34)', borderRadius:5}},
          h('button',{onClick:e=>{ e.stopPropagation(); this.addPicked(mk, name); },
            style:{background:'var(--ink)', color:'#F2F2F0', border:'none', borderRadius:99, padding:'12px 24px', fontSize:'15px', fontWeight:600, cursor:'pointer', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif", boxShadow:'0 2px 10px rgba(0,0,0,.3)'}}, '+ Add to canvas'))),
    );
  }
  miniPreview(type, bg, w, hh){
    const h=React.createElement; const forest=type==='hero'||bg==='forest';
    const base={width:w||44, height:hh||34, borderRadius:6, flex:'0 0 auto', padding:w?'10px 12px':5, display:'flex', flexDirection:'column', gap:w?5:3, justifyContent:'center', overflow:'hidden', border:'1px solid var(--rule2)'};
    const bar=(w,c)=>h('div',{style:{height:3, width:w, borderRadius:2, background:c}});
    if(forest) return h('div',{style:Object.assign({},base,{background:'#011C00', backgroundImage:type==='hero'?'url('+this.grad('magenta-green')+')':'none', backgroundSize:'cover'})}, bar('70%','rgba(253,251,244,.9)'), bar('45%','rgba(253,251,244,.5)'));
    if(type==='twocol') return h('div',{style:Object.assign({},base,{flexDirection:'row', gap:4, alignItems:'stretch', background:'var(--paper)'})}, h('div',{style:{flex:1, display:'flex', flexDirection:'column', gap:3, justifyContent:'center'}}, bar('80%','var(--rule2)'), bar('60%','var(--rule)')), h('div',{style:{flex:1, display:'flex', flexDirection:'column', gap:3, justifyContent:'center'}}, bar('80%','var(--rule2)'), bar('60%','var(--rule)')));
    if(type==='projectgrid') return h('div',{style:Object.assign({},base,{flexDirection:'row', gap:3, alignItems:'stretch', background:'var(--paper)'})}, [0,1,2].map(i=>h('div',{key:i, style:{flex:1, borderRadius:3, background:'#011C00'}})));
    if(type==='casestudy') return h('div',{style:Object.assign({},base,{flexDirection:'row', gap:4, alignItems:'stretch', background:'var(--paper)'})}, h('div',{style:{width:14, borderRadius:3, background:'#011C00'}}), h('div',{style:{flex:1, display:'flex', flexDirection:'column', gap:3, justifyContent:'center'}}, bar('90%','var(--rule2)'), bar('55%','var(--rule)')));
    return h('div',{style:Object.assign({},base,{background:'var(--paper)'})}, bar('85%','var(--rule2)'), bar('55%','var(--rule)'));
  }
  // Sidebar entry for the AI block — a single library tile (no inline prompt).
  // Clicking or dragging it drops an 'ai' prompt block onto the canvas, where
  // the prompt textarea + Generate button now live (BSO-658).
  renderAsk(){
    const h=React.createElement;
    const thumb=h('div',{style:{position:'relative', width:'100%', height:80, overflow:'hidden', background:'#011C00', display:'flex', alignItems:'center', justifyContent:'center'}},
      h('div',{style:{width:7,height:7,borderRadius:99,background:'#FDFBF4',position:'absolute',top:10,left:10}}),
      h('div',{style:{fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(253,251,244,.85)'}}, '✦ Ask Claude'));
    return h('div',{style:{marginTop:16}},
      this.tileShell(thumb, 'Ask Claude for a new block', null,
        ()=>{ this.insertAt(this.state.blocks.length, this.makeBlock('ai')); this.toast('AI block added — describe your section'); },
        { cursor:'grab',
          props:{
            draggable:true, title:'Describe a section, Claude drafts it',
            onDragStart:e=>{ this.setState({draggingType:'ai'}); e.dataTransfer.effectAllowed='copy'; },
            onDragEnd:()=>this.setState({draggingType:null, dropAt:null}),
            onMouseEnter:e=>{ e.currentTarget.style.borderColor='var(--ink)'; },
            onMouseLeave:e=>{ e.currentTarget.style.borderColor='var(--rule2)'; },
          }}),
      h('div',{style:{fontSize:'11.5px', color:'var(--muted)', marginTop:7, lineHeight:1.35, padding:'0 2px'}}, 'Describe a section, Claude drafts it.'));
  }

  // ---------- canvas ----------
  renderCanvas(){
    const h=React.createElement; const pver=this.state.previewVersionId && this.state.versions.find(v=>v.id===this.state.previewVersionId);
    const blocks = pver && pver.blocks ? pver.blocks : this.state.blocks; const edit=this.state.editMode && !this.state.locked && !pver;
    // A page is in DS mode (bt-page wrapper + DS-role click handling) whenever a
    // proposal stylesheet is loaded — a real page OR a new page with a default DS.
    const ds=!!this.activeDs();
    return h('div',{className:'bso-scroll', ref:this.onCanvasRef, onClick:(ev)=>{ if(!edit) return; if(this.state.claudeEditPick) return; /* pick mode owns clicks */ const t=ev.target; if(t&&t.closest&&t.closest('[data-role]')) return; /* keep role just picked from a bt text click */ this.setState({selectedId:null, selectedRole:null}); },
      style:{flex:1, minWidth:0, overflowY:'auto', height:'100%', background:'var(--soft)', padding:'34px 0 120px'}},
      h('div',{style:{width:1160, margin:'0 auto', zoom:this.state.canvasZoom, background:'#F2F2F0', color:'#011C00', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow)', minHeight:300}},
        blocks.length===0 ? this.emptyCanvas() :
        h('div',{className:ds?'page bt-page':undefined,
            style:ds?btVarStyle(this.state.btStyles):undefined,
            onClickCapture:(ds&&edit)? (ev=>{ if(this.state.claudeEditPick) return; /* pick mode owns clicks */ const t=ev.target; const r=t&&t.closest&&t.closest('[data-role]'); if(r&&r.dataset&&r.dataset.role) this.selectBtRole(r.dataset.role); }) : undefined},
          [ edit && h(React.Fragment,{key:'dz0'}, this.dropzone(0)) ].concat(
            blocks.map((b,i)=> h(React.Fragment,{key:b.id}, this.renderBlock(b,i), edit && this.dropzone(i+1)))))));
  }
  emptyCanvas(){
    const h=React.createElement;
    return h('div',{onDragOver:e=>{e.preventDefault();}, onDrop:e=>{e.preventDefault(); this.onDrop(0);},
      style:{padding:'80px 40px', textAlign:'center', minHeight:340, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, border:'2px dashed '+(this.state.draggingType?'#011C00':'rgba(1,28,0,.18)'), margin:18, borderRadius:12, background:this.state.draggingType?'rgba(1,28,0,.03)':'transparent'}},
      h('div',{style:{fontFamily:"'IBM Plex Mono',monospace", fontSize:'11px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(1,28,0,.4)'}}, 'Empty page'),
      h('div',{style:{fontSize:'22px', fontWeight:600, letterSpacing:'-0.01em', maxWidth:420}}, 'Drag a section from the library, or ask Claude to draft one.'));
  }
  dropzone(index){
    const h=React.createElement;
    const dragActive=this.state.dropAt===index && (this.state.draggingType||this.state.dragIndex!=null);
    const armed=this.state.insertIndex===index;
    const hovered=this.state.gapHover===index;
    // Expanded when: a drag is hovering, this gap is armed, or the pointer is over it.
    const open = dragActive || armed || hovered;
    return h('div',{
        onMouseEnter:()=>{ if(this.state.gapHover!==index) this.setState({gapHover:index}); },
        onMouseLeave:()=>{ if(this.state.gapHover===index) this.setState({gapHover:null}); },
        onDragOver:e=>{e.preventDefault(); if(this.state.dropAt!==index) this.setState({dropAt:index});},
        onDragLeave:()=>{ if(this.state.dropAt===index) this.setState({dropAt:null}); },
        onDrop:e=>{e.preventDefault(); this.onDrop(index); this.setState({insertIndex:null, libPicked:null});},
      style:{height:18, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:5}},
      // Always-mounted overlay that fades in on hover/arm/drag (constant gap height -> no
      // layout reflow -> smooth, no jitter). The pill overflows the 18px strip as a child,
      // so hovering it does not fire the parent's mouseLeave.
      h('div',{style:{position:'absolute', left:'5%', right:'5%', top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'center', justifyContent:'center', opacity:open?1:0, transition:'opacity .18s ease', pointerEvents:open?'auto':'none'}},
        dragActive
          // Solid drop indicator while dragging a tile over this gap.
          ? h('div',{style:{height:3, background:'#011C00', width:'100%', borderRadius:99, position:'relative'}},
              h('div',{style:{position:'absolute', left:-1, top:-3.5, width:10, height:10, borderRadius:99, background:'#011C00'}}))
          // Otherwise: dashed line + "+ Insert section" pill (armed = highlighted).
          // The pill sits on a solid surface-colored "notch" (zIndex 1) that masks the
          // dashed line AND any block-frame border crossing this gap, so the pill reads
          // crisp and centered instead of colliding messily with the outlines behind it.
          : h(React.Fragment, null,
              h('div',{style:{position:'absolute', left:0, right:0, top:'50%', borderTop:'1.5px dashed '+(armed?'#011C00':'var(--rule)'), zIndex:0}}),
              h('div',{style:{position:'relative', zIndex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'4px 8px', background:'var(--surface)', borderRadius:99}},
                h('button',{onClick:e=>{ e.stopPropagation(); this.armGap(index); },
                  style:{position:'relative', display:'inline-flex', alignItems:'center', gap:8, background:armed?'var(--ink)':'var(--surface)', color:armed?'#F2F2F0':'var(--ink)', border:'1px solid '+(armed?'var(--ink)':'var(--rule)'), borderRadius:99, padding:'8px 18px', fontSize:'14px', fontWeight:600, cursor:'pointer', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif", boxShadow:'0 2px 9px rgba(0,0,0,.13)'}},
                  h('span',{style:{display:'inline-flex', alignItems:'center', justifyContent:'center', width:17, height:17, borderRadius:99, border:'1.5px solid '+(armed?'#F2F2F0':'var(--ink)'), fontSize:'13px', lineHeight:1}}, '+'),
                  'Insert section')))));
  }

  // ---------- one block ----------
  textStyle(role, inst, color){
    const s=this.effective(inst, role);
    const fam = s.family==='mono' ? "'JetBrains Mono',monospace" : (s.family==='text' ? "'GT Eesti Pro Text','Inter',system-ui,sans-serif" : "'GT Eesti Pro Display','Inter',system-ui,sans-serif");
    return {fontFamily:fam, fontSize:s.size+'px', lineHeight:s.lh, fontWeight:s.weight, letterSpacing:s.tracking+'em', textTransform:s.upper?'uppercase':'none', margin:0, color:color||'inherit'};
  }
  ed(inst, key, role, color, extra){
    const h=React.createElement; const can=this.state.editMode && !this.state.locked && !this.state.previewVersionId;
    const sel=this.state.selectedId===inst.id && this.state.selectedRole===role;
    return h('div',{contentEditable:can, suppressContentEditableWarning:true,
      onClick:e=>{ if(can){ e.stopPropagation(); this.selectText(inst.id, role);} },
      onFocus:()=>this.selectText(inst.id, role),
      onBlur:e=>this.commitText(inst.id, key, e.currentTarget.innerText),
      style:Object.assign({}, this.textStyle(role, inst, color), {outline:'none', cursor:can?'text':'default', borderRadius:3, boxShadow:(sel&&can)?'0 0 0 2px '+(color==='#FDFBF4'?'rgba(253,251,244,.6)':'rgba(1,28,0,.4)'):'none', transition:'box-shadow .12s'}, extra||{})}, inst.props[key]);
  }
  blockPad(inst){ const m={S:'40px 56px', M:'72px 64px', L:'104px 72px'}; return m[inst.pad]||m.M; }
  // Set a (possibly nested, dot-pathed) text field on a bt block's props.
  setBtText(id, path, value){
    this.setState(s=>({blocks:s.blocks.map(b=>{
      if(b.id!==id) return b;
      const props=this.clone(b.props); const keys=path.split('.'); let o=props;
      for(let i=0;i<keys.length-1;i++){ o=o[keys[i]]; if(o==null) return b; }
      o[keys[keys.length-1]]=value; return {...b, props};
    })}));
    this.markDirty();
  }
  // ---------- bt type-style editor (BSO-658 Phase B) ----------
  // Select a design-system role for the Tweaks type editor and seed the panel's
  // display values from the live computed style of a representative element, so the
  // controls show the real starting numbers. Seeds go to roleDefaults (NOT btStyles)
  // — only user edits land in btStyles, so an untouched field stays "inherit".
  selectBtRole(role){
    if(!ROLE_VARS[role]){ return; }
    this.setState(s=>{
      const seeds=Object.assign({}, s.roleDefaults[role]);
      if(typeof window!=='undefined'){
        const meta=BT_ROLE_META[role]; let el=null;
        try{ if(meta && meta.sel) el=document.querySelector('.bt-page '+meta.sel.split(',').join(', .bt-page ')); }catch(e){}
        if(el){
          const cs=getComputedStyle(el); const fields=ROLE_VARS[role];
          if(fields.fontSize && seeds.fontSize===undefined) seeds.fontSize=cs.fontSize;
          if(fields.lineHeight && seeds.lineHeight===undefined){ const lh=cs.lineHeight; const fs=parseFloat(cs.fontSize)||16; seeds.lineHeight=(lh==='normal')?'1.2':(Math.round((parseFloat(lh)/fs)*100)/100+''); }
          if(fields.fontWeight && seeds.fontWeight===undefined) seeds.fontWeight=cs.fontWeight;
          if(fields.letterSpacing && seeds.letterSpacing===undefined){ const ls=cs.letterSpacing; const fs=parseFloat(cs.fontSize)||16; seeds.letterSpacing=(ls==='normal')?'0':(Math.round((parseFloat(ls)/fs)*1000)/1000+''); }
          if(fields.fontFamily && seeds.fontFamily===undefined) seeds.fontFamily=cs.fontFamily;
        }
      }
      const te={[role]:true}; // single-expand: opening a role collapses any other open role
      return {selectedRole:role, selectedId:null, tweakExpanded:te, roleDefaults:Object.assign({}, s.roleDefaults, {[role]:seeds})};
    });
    // scroll the newly-expanded role into view (panel is a separate scroll container)
    if(typeof window!=='undefined'){ requestAnimationFrame(()=>{ try{ const el=document.querySelector('[data-tweak-role="'+role+'"]'); if(el&&el.scrollIntoView) el.scrollIntoView({block:'nearest', behavior:'smooth'}); }catch(e){} }); }
  }
  // Toggle a role's inline property disclosure (mirrors toggleLibType). Seeds computed defaults on first open.
  toggleTweakRole(role){
    if(!ROLE_VARS[role]){ return; }
    const willOpen=!(this.state.tweakExpanded||{})[role];
    if(willOpen){ this.selectBtRole(role); return; }
    this.setState(s=>{ const te=Object.assign({}, s.tweakExpanded); delete te[role]; return {tweakExpanded:te}; });
  }
  // Write one field's override into btStyles (immutably), mirror into styles.bt so it
  // persists through the existing PUT, and schedule the debounced save. Live apply is
  // automatic: the .bt-page wrapper spreads btVarStyle(btStyles) on every render.
  setBtVar(role, field, value){
    this.setState(s=>{
      const roleObj=Object.assign({}, s.btStyles[role]);
      if(value===''||value===null||value===undefined){ delete roleObj[field]; }
      else { roleObj[field]=value; }
      const btStyles=Object.assign({}, s.btStyles, {[role]:roleObj});
      const styles=Object.assign({}, s.styles, {bt:btStyles});
      return {btStyles, styles};
    }, ()=>this.markDirty());
  }
  // Reads the rendered section's own corner radius so the editor chrome (outline +
  // tag) follows its shape instead of a square box that the rounded corners eat.
  secRadius(el){ const sec=el && el.parentElement && el.parentElement.firstElementChild; if(!sec || typeof window==='undefined') return 0; return Math.round(parseFloat(getComputedStyle(sec).borderTopLeftRadius)||0); }
  // Real-page section: render the actual bt- component, with inline text editing
  // and a light selection chrome. The outline never intercepts clicks (text stays
  // editable); the section tag is the selection handle; links don't navigate in edit.
  renderBtBlock(inst, index){
    const h=React.createElement; const Comp=BT_COMPONENTS[inst.type]; if(!Comp) return null;
    const edit=this.state.editMode && !this.state.locked && !this.state.previewVersionId;
    const sel=this.state.selectedId===inst.id;
    // Editor-chrome colour follows the section's real background. bt:hero/leverages/final
    // are dark only in the BSO (gradient) DS; in the light DSs (kos / quiet) they are
    // light, so dark-chrome (near-white) would be invisible on them.
    const lightDs = (() => { try { return this.activeDsId() === 'kos' || this.activeDsId() === 'quiet'; } catch { return false; } })();
    const dark= lightDs ? 0 : ({'bt:hero':1,'bt:leverages':1,'bt:final':1,'ub:discussion':1,'ub:discussionLock':1})[inst.type];
    const line= dark?'rgba(253,251,244,.30)':'rgba(1,28,0,.12)';
    const tagBg= dark?'rgba(253,251,244,.16)':'rgba(1,28,0,.07)'; const tagFg= dark?'rgba(253,251,244,.78)':'rgba(1,28,0,.5)';
    const props=Object.assign({key:'c'}, inst.props);
    if(edit) props.e={on:true, set:(k,v)=>this.setBtText(inst.id,k,v), touch:()=>this.markDirtyLabel()};
    const pick=edit?this.claudeEditPickProps(inst, index):null;
    return h('div',{style:Object.assign({position:'relative'}, pick?{cursor:pick.cursor}:{}),
        onClickCapture: pick? pick.onClickCapture : (edit? (ev=>{ const t=ev.target; const a=t&&t.closest&&t.closest('a,button'); if(a) ev.preventDefault(); }) : undefined),
        onMouseMoveCapture: pick? pick.onMouseMoveCapture : undefined,
        onMouseLeave: pick? pick.onMouseLeave : undefined},
      h(Comp, props),
      pick && this.claudeEditPickOverlay(inst),
      // section-shape outline (rounded, follows the real corner radius)
      edit && h('div',{key:'o', ref:el=>{ if(el) el.style.borderRadius=this.secRadius(el)+'px'; }, style:{position:'absolute', inset:0, zIndex:6, pointerEvents:'none', boxShadow:'inset 0 0 0 '+(sel?'2px #011C00':'1px '+line)}}),
      // block-bounds dashed frame — only for rounded sections (BSO DS), where it shows
      // the true extent over the rounded outline. Flat sections (kos/quiet) rely on the
      // delicate solid inset outline above — no dashed frame.
      edit && h('div',{key:'r', ref:el=>{ if(el) el.style.display=this.secRadius(el)>1?'block':'none'; }, style:{position:'absolute', inset:0, zIndex:6, pointerEvents:'none', border:'1px dashed '+(dark?'rgba(253,251,244,.30)':'rgba(1,28,0,.22)')}}),
      // type tag at the rectangular corner — solid chip, readable on any background
      edit && h('div',{key:'t', onClick:e=>{e.stopPropagation(); this.selectBlock(inst.id);}, 'data-tip':'Select section', style:{position:'absolute', top:0, left:0, zIndex:8, cursor:'pointer', padding:'3px 8px', fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', background:'var(--surface)', color:'var(--muted)', border:'1px solid var(--rule2)', borderRadius:5}}, this.typeName(inst.type)),
      edit && sel && h('div',{key:'tb'}, this.blockToolbar(inst, index)));
  }
  // On-canvas AI prompt block: where the user now types the prompt (relocated
  // from the sidebar, BSO-658). Generate runs generateAiBlock → replace-in-place.
  renderAiBlock(inst, index){
    const h=React.createElement; const sel=this.state.selectedId===inst.id;
    const edit=this.state.editMode && !this.state.locked && !this.state.previewVersionId;
    const prompt=String((inst.props&&inst.props.prompt)||'');
    const aiState=(inst.props&&inst.props.state)||'idle';
    const error=(inst.props&&inst.props.error)||'';
    const thinking=aiState==='thinking';
    return h('div',{onClick:e=>{ if(!edit) return; e.stopPropagation(); this.selectBlock(inst.id);},
        style:{position:'relative', background:'#011C00', color:'#FDFBF4', cursor:edit?'pointer':'default'}},
      edit && sel && h('div',{style:{position:'absolute', inset:0, boxShadow:'inset 0 0 0 2px #FDFBF4', pointerEvents:'none', zIndex:6}}),
      edit && h('div',{style:{position:'absolute', top:0, left:0, zIndex:7, padding:'3px 8px', fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', background:'rgba(253,251,244,.16)', color:'rgba(253,251,244,.78)', borderBottomRightRadius:7, pointerEvents:'none'}}, 'AI block'),
      edit && sel && h('div',{style:{position:'absolute', top:10, right:10, zIndex:8},
        }, h('button',{onClick:e=>{e.stopPropagation(); this.deleteBlock(inst.id);}, 'data-tip':'Delete', style:{width:28, height:28, border:'1px solid rgba(253,251,244,.3)', background:'rgba(253,251,244,.08)', color:'#FDFBF4', borderRadius:6, cursor:'pointer', fontSize:'13px'}}, '×')),
      h('div',{onClick:e=>e.stopPropagation(), style:{maxWidth:680, margin:'0 auto', padding:'72px 40px 80px', textAlign:'center'}},
        h('div',{style:{display:'inline-flex', alignItems:'center', gap:8, fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(253,251,244,.6)', marginBottom:18}},
          h('span',{style:{width:7,height:7,borderRadius:99,background:'#FDFBF4'}}), '✦ Ask Claude for a new block'),
        h('div',{style:{fontSize:'21px', fontWeight:600, lineHeight:1.25, letterSpacing:'-0.01em', marginBottom:22, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, 'Describe a section — Claude drafts it in the BSO voice.'),
        h('textarea',{value:prompt, disabled:thinking,
          onChange:e=>this.setAiProp(inst.id, 'prompt', e.target.value),
          onClick:e=>e.stopPropagation(),
          placeholder:'e.g. a pricing section with three plans, editorial tone', rows:3,
          style:{width:'100%', resize:'vertical', border:'1px solid rgba(253,251,244,.28)', borderRadius:9, padding:'12px 14px', fontFamily:'inherit', fontSize:'14px', background:'rgba(253,251,244,.06)', color:'#FDFBF4', lineHeight:1.5, outline:'none'}}),
        error && h('div',{style:{marginTop:10, fontSize:'12.5px', color:'#FFB4A8', textAlign:'left'}}, error),
        h('button',{onClick:e=>{e.stopPropagation(); this.generateAiBlock(inst);}, disabled:thinking||!prompt.trim(),
          style:{marginTop:14, width:'100%', padding:'12px', borderRadius:9, border:'none', background:'#FDFBF4', color:'#011C00', cursor:thinking?'default':'pointer', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit', opacity:(!prompt.trim()&&!thinking)?0.5:1}},
          thinking ? h('span',{style:{display:'inline-flex',alignItems:'center',gap:8}}, h('span',{style:{width:13,height:13,border:'2px solid #011C00',borderTopColor:'transparent',borderRadius:99,display:'inline-block',animation:'bsospin .7s linear infinite'}}), 'Drafting…') : 'Generate block')));
  }
  renderBlock(inst, index){
    if(isDsType(inst.type)) return this.renderBtBlock(inst, index);
    if(inst.type==='ai') return this.renderAiBlock(inst, index);
    const h=React.createElement; const sel=this.state.selectedId===inst.id;
    const forest=inst.bg==='forest'; const fg= forest?'#FDFBF4':'#011C00';
    const bg = forest? '#011C00' : (inst.bg==='soft'?'#E8E8E6':'transparent');
    const edit=this.state.editMode && !this.state.locked && !this.state.previewVersionId;
    const pick=edit?this.claudeEditPickProps(inst, index):null;
    const wrapStyle={position:'relative', background:bg, color:fg, backgroundImage:(forest&&inst.type==='hero')?'url('+this.imgUrl(inst.props.img||'magenta-green')+')':'none', backgroundSize:'cover', backgroundPosition:'center', cursor:pick?pick.cursor:(edit?'pointer':'default')};
    return h('div',Object.assign({onClick:e=>{ if(!edit) return; if(pick) return; e.stopPropagation(); this.selectBlock(inst.id);}, style:wrapStyle,
        onClickCapture: pick?pick.onClickCapture:undefined, onMouseMoveCapture: pick?pick.onMouseMoveCapture:undefined, onMouseLeave: pick?pick.onMouseLeave:undefined}, inst.type==='hero'?this.imgDrop(v=>this.setBlockImg(inst.id,v)):{}),
      pick && this.claudeEditPickOverlay(inst),
      edit && !sel && h('div',{style:{position:'absolute', inset:0, boxShadow:'inset 0 0 0 1px '+(forest?'rgba(253,251,244,.22)':'rgba(1,28,0,.12)'), pointerEvents:'none', zIndex:6}}),
      edit && sel && h('div',{style:{position:'absolute', inset:0, boxShadow:'inset 0 0 0 2px #011C00', pointerEvents:'none', zIndex:6, mixBlendMode: forest?'difference':'normal'}}),
      edit && h('div',{style:{position:'absolute', top:0, left:0, zIndex:7, padding:'3px 8px', fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', background: forest?'rgba(253,251,244,.16)':'rgba(1,28,0,.07)', color: forest?'rgba(253,251,244,.75)':'rgba(1,28,0,.5)', borderBottomRightRadius:7, pointerEvents:'none'}}, this.typeName(inst.type)),
      forest && inst.type==='hero' && h('div',{style:{position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.55))', pointerEvents:'none'}}),
      inst.type==='hero' && this.replaceBtn({blockId:inst.id, kind:'block'}),
      edit && sel && this.blockToolbar(inst, index),
      h('div',{style:{position:'relative', zIndex:2, padding:this.blockPad(inst)}}, this.blockInner(inst, fg)));
  }
  blockToolbar(inst, index){
    const h=React.createElement; const n=this.state.blocks.length;
    const wrap={position:'absolute', top:10, right:10, zIndex:8, display:'flex', gap:5, padding:5, borderRadius:9, background:'#FAFAF8', border:'1px solid rgba(1,28,0,.18)', boxShadow:'0 6px 20px rgba(1,28,0,.14)'};
    const b=(lab,fn,opts)=>h('button',{onClick:e=>{e.stopPropagation(); fn();}, disabled:opts&&opts.dis, 'data-tip':opts&&opts.t, draggable:opts&&opts.drag, onDragStart:opts&&opts.drag?(e=>{this.setState({dragIndex:index}); e.dataTransfer.effectAllowed='move';}):undefined, onDragEnd:opts&&opts.drag?(()=>this.setState({dragIndex:null,dropAt:null})):undefined,
      style:{width:28, height:28, border:'1px solid rgba(1,28,0,.18)', background:'#fff', color:'#011C00', borderRadius:6, cursor:(opts&&opts.dis)?'default':(opts&&opts.drag?'grab':'pointer'), opacity:(opts&&opts.dis)?0.35:1, fontSize:'13px', fontFamily:"'IBM Plex Mono',monospace", display:'inline-flex', alignItems:'center', justifyContent:'center', padding:0}}, lab);
    return h('div',{style:wrap},
      b('\u2630', ()=>{}, {drag:true, t:'Drag to reorder'}),
      b('\u2191', ()=>this.moveBlock(inst.id,-1), {dis:index===0, t:'Move up'}),
      b('\u2193', ()=>this.moveBlock(inst.id,1), {dis:index===n-1, t:'Move down'}),
      b('\u29C9', ()=>this.duplicateBlock(inst.id), {t:'Duplicate'}),
      b('\u2606', ()=>this.saveBlockToLibrary(inst), {t:'Save to library'}),
      b('\u2726', ()=>this.openClaudeEdit(inst, index), {t:'Edit with Claude Code'}),
      b('\u00d7', ()=>this.deleteBlock(inst.id), {t:'Delete'}));
  }

  // ---------- Edit-with-Claude-Code (BSO-658) ----------
  // Sends a block + an instruction to the local Claude Code inbox (:8014),
  // mirroring the canonical Edit Mode wire format ({threads:{[id]:thread}}).
  // When pick mode is armed for THIS block, return capture-phase handlers that
  // highlight the hovered element and capture the click — without firing inline
  // editing, link navigation, or the canvas-level Tweaks role-select.
  claudeEditPickProps(inst, index){
    const p=this.state.claudeEditPick;
    if(!p || !p.inst || p.inst.id!==inst.id) return null;
    return {
      cursor:'crosshair',
      onMouseMoveCapture:(ev)=>{ let el=ev.target; if(el&&el.nodeType===3) el=el.parentElement; const r=el&&el.getBoundingClientRect?el.getBoundingClientRect():null; const root=ev.currentTarget.getBoundingClientRect(); const z=this.state.canvasZoom||1; /* getBoundingClientRect returns post-zoom px; the overlay lives INSIDE the zoom:canvasZoom canvas so it gets scaled again — divide by z so the highlight lines up with the element at any zoom (no-op at z=1). */ if(r) this.setState({claudeEditHover:{top:(r.top-root.top)/z, left:(r.left-root.left)/z, width:r.width/z, height:r.height/z}}); },
      onMouseLeave:()=>{ if(this.state.claudeEditHover) this.setState({claudeEditHover:null}); },
      onClickCapture:(ev)=>this.pickClaudeEditElement(ev, inst, index),
    };
  }
  // Highlight overlay rendered inside the armed block's wrapper.
  claudeEditPickOverlay(inst){
    const p=this.state.claudeEditPick; if(!p || !p.inst || p.inst.id!==inst.id) return null;
    const hv=this.state.claudeEditHover; if(!hv) return null;
    return React.createElement('div',{key:'cep', style:{position:'absolute', top:hv.top, left:hv.left, width:hv.width, height:hv.height, zIndex:9, pointerEvents:'none', boxShadow:'0 0 0 2px #011C00, 0 0 0 6px rgba(1,28,0,.18)', borderRadius:4, background:'rgba(1,28,0,.04)'}});
  }
  // ✦ now arms ELEMENT-PICK mode: select a specific element inside the section,
  // then describe how to fix THAT element (falls back to whole-section editing).
  openClaudeEdit(inst, index){ this.setState({claudeEditPick:{inst, index}, claudeEditHover:null, claudeEdit:null}); }
  cancelClaudeEditPick(){ this.setState({claudeEditPick:null, claudeEditHover:null}); }
  // Whole-section fallback — open the popup with no element scope (original behavior).
  openClaudeEditWhole(){ const p=this.state.claudeEditPick; if(!p) return; this.setState({claudeEdit:{inst:p.inst, index:p.index, prompt:'', element:null}, claudeEditPick:null, claudeEditHover:null}); }
  closeClaudeEdit(){ this.setState({claudeEdit:null}); }
  // Build a compact, reliable descriptor for the picked element, scoped to the block root.
  // Returns {role, text, selector} — a Claude Code session uses role+text+selector to find it.
  describePickedElement(el, blockRoot){
    if(!el || !blockRoot) return null;
    const tag=(el.tagName||'').toLowerCase();
    const role=(el.dataset && el.dataset.role) ? el.dataset.role : tag;
    let text=''; try{ text=(el.textContent||'').replace(/\s+/g,' ').trim(); }catch(e){}
    if(text.length>160) text=text.slice(0,157)+'…';
    // Selector path within the block: prefer a data-role anchor, else an nth-of-type chain.
    let selector='';
    try{
      if(el.dataset && el.dataset.role){
        const same=Array.prototype.filter.call(blockRoot.querySelectorAll('[data-role="'+el.dataset.role+'"]'), n=>true);
        const idx=same.indexOf(el);
        selector='[data-role="'+el.dataset.role+'"]'+(same.length>1?(':nth-of-type-of-role('+(idx+1)+')'):'');
      } else {
        const parts=[]; let node=el;
        while(node && node!==blockRoot && node.nodeType===1){
          const t=node.tagName.toLowerCase(); let n=1, sib=node;
          while((sib=sib.previousElementSibling)){ if(sib.tagName===node.tagName) n++; }
          parts.unshift(t+':nth-of-type('+n+')'); node=node.parentElement;
        }
        selector=parts.join(' > ');
      }
    }catch(e){ selector=role; }
    return {role, text, selector};
  }
  // Capture a click inside the armed block: identify the element, open the scoped popup.
  pickClaudeEditElement(ev, inst, index){
    ev.preventDefault(); ev.stopPropagation();
    const blockRoot=ev.currentTarget; let el=ev.target;
    // walk up to the nearest meaningful element (skip bare text nodes / pure wrappers)
    if(el && el.nodeType===3) el=el.parentElement;
    const desc=this.describePickedElement(el, blockRoot);
    this.setState({claudeEdit:{inst, index, prompt:'', element:desc}, claudeEditPick:null, claudeEditHover:null});
  }
  sendClaudeEdit(){
    const ce=this.state.claudeEdit; if(!ce) return;
    const text=(ce.prompt||'').trim();
    if(!text){ this.toast('Describe the change first'); return; }
    const id='blockedit-'+Date.now();
    const thread={
      id, type:'block-edit', prompt:text,
      blockType:ce.inst.type, blockIndex:ce.index, blockId:ce.inst.id,
      pageId:(this.state.realPage || this.state.pageTitle || 'builder-page'),
      pageName:(this.state.pageTitle || 'Untitled page'),
      status:'pending', createdAt:new Date().toISOString(),
    };
    if(ce.element){ thread.elementRole=ce.element.role; thread.elementText=ce.element.text; thread.elementSelector=ce.element.selector; }
    fetch('http://localhost:8014/inbox', {method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({threads:{[id]:thread}, source:'builder'})})
      .then(r=>{ if(!r.ok) throw new Error('bad status'); this.toast('Sent to Claude Code'); this.closeClaudeEdit(); })
      .catch(()=>this.toast('Claude Code inbox not reachable (run it locally)'));
  }
  // Fixed top-center pill shown while pick mode is armed.
  renderClaudeEditPickHint(){
    const h=React.createElement; const p=this.state.claudeEditPick; if(!p || this.state.claudeEdit) return null;
    const btn=(lab,fn,primary)=>h('button',{onClick:e=>{e.stopPropagation(); fn();},
      style:{padding:'6px 12px', borderRadius:7, border:'1px solid '+(primary?'rgba(253,251,244,.0)':'rgba(253,251,244,.35)'), background:primary?'#FDFBF4':'transparent', color:primary?'#011C00':'#FDFBF4', fontSize:'12.5px', fontWeight:600, cursor:'pointer', fontFamily:"'Inter',system-ui,sans-serif"}}, lab);
    return h('div',{style:{position:'fixed', top:64, left:'50%', transform:'translateX(-50%)', zIndex:95, display:'flex', alignItems:'center', gap:12, padding:'9px 12px 9px 16px', borderRadius:11, background:'#011C00', color:'#FDFBF4', boxShadow:'0 14px 44px rgba(1,28,0,.4)', fontFamily:"'Inter',system-ui,sans-serif"}},
      h('span',{style:{fontSize:'13px', fontWeight:500}}, '✦ Click the element in this section you want Claude to change'),
      btn('Edit whole section', ()=>this.openClaudeEditWhole(), false),
      btn('Cancel', ()=>this.cancelClaudeEditPick(), false));
  }
  renderClaudeEdit(){
    const h=React.createElement; const ce=this.state.claudeEdit; if(!ce) return null;
    const stop=e=>e.stopPropagation();
    return h('div',{onClick:()=>this.closeClaudeEdit(),
        style:{position:'fixed', inset:0, zIndex:90, background:'rgba(1,28,0,.32)', display:'flex', alignItems:'center', justifyContent:'center', padding:20}},
      h('div',{onClick:stop,
          style:{width:'min(460px, 92vw)', maxHeight:'88vh', overflow:'auto', background:'var(--surface,#fff)', color:'var(--ink,#011C00)', borderRadius:14, border:'1px solid rgba(1,28,0,.16)', boxShadow:'0 24px 70px rgba(1,28,0,.3)', padding:'22px 22px 18px'}},
        h('div',{style:{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6}},
          h('div',{style:{fontSize:'17px', fontWeight:700, letterSpacing:'-0.01em', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, ce.element ? 'Edit this element with Claude Code' : 'Edit this section with Claude Code'),
          h('button',{onClick:()=>this.closeClaudeEdit(), 'aria-label':'Close',
            style:{width:28, height:28, border:'1px solid rgba(1,28,0,.18)', background:'#fff', borderRadius:6, cursor:'pointer', fontSize:'15px', lineHeight:1, color:'#011C00'}}, '\u00d7')),
        // context line \u2014 which element (or whole section) Claude will change
        ce.element
          ? h('div',{style:{display:'flex', alignItems:'baseline', gap:8, marginBottom:14, padding:'8px 10px', borderRadius:8, background:'rgba(1,28,0,.05)', border:'1px solid rgba(1,28,0,.1)'}},
              h('span',{style:{fontSize:'10px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted,rgba(1,28,0,.55))', fontFamily:"'JetBrains Mono',monospace", flexShrink:0}}, this.roleName(ce.element.role)||ce.element.role),
              h('span',{style:{fontSize:'13px', color:'var(--ink,#011C00)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}, ce.element.text ? '\u2018'+ce.element.text+'\u2019' : '(no text)'))
          : h('div',{style:{fontSize:'12px', color:'var(--muted,rgba(1,28,0,.55))', marginBottom:14}},
              'Whole section \u00b7 '+(ce.inst.type||'section')+' \u00b7 block '+(ce.index+1)),
        h('textarea',{autoFocus:true, value:ce.prompt,
          onChange:e=>{ const v=e.target.value; this.setState(s=>({claudeEdit:s.claudeEdit?{...s.claudeEdit, prompt:v}:null})); },
          onKeyDown:e=>{ if((e.metaKey||e.ctrlKey)&&e.key==='Enter') this.sendClaudeEdit(); },
          placeholder:"Describe the change \u2014 e.g. 'make the headline punchier', 'add a third column'",
          style:{width:'100%', minHeight:120, resize:'vertical', boxSizing:'border-box', padding:'12px 14px', borderRadius:10, border:'1px solid rgba(1,28,0,.2)', fontSize:'14px', lineHeight:1.45, fontFamily:"'Inter',system-ui,sans-serif", outline:'none', color:'#011C00', background:'#fff'}}),
        h('div',{style:{display:'flex', gap:10, justifyContent:'flex-end', marginTop:16}},
          h('button',{onClick:()=>this.closeClaudeEdit(),
            style:{padding:'10px 16px', borderRadius:9, border:'1px solid rgba(1,28,0,.2)', background:'#fff', color:'#011C00', fontSize:'14px', fontWeight:600, cursor:'pointer'}}, 'Cancel'),
          h('button',{onClick:()=>this.sendClaudeEdit(),
            style:{padding:'10px 18px', borderRadius:9, border:'1px solid var(--ink,#011C00)', background:'var(--ink,#011C00)', color:'var(--paper,#F2F2F0)', fontSize:'14px', fontWeight:600, cursor:'pointer'}}, 'Send to Claude Code'))));
  }
  blockInner(inst, fg){
    const h=React.createElement; const t=inst.type; const muted= fg==='#FDFBF4'?'rgba(253,251,244,.6)':'rgba(1,28,0,.55)';
    const wrap=(children, max)=>h('div',{style:{maxWidth:max||860, margin:'0 auto'}}, children);
    if(t==='hero') return wrap(h('div',null,
      this.ed(inst,'label','label', muted, {marginBottom:20}),
      this.ed(inst,'heading','heading', fg, {maxWidth:760}),
      h('div',{style:{marginTop:28, display:'inline-block'}}, h('span',{contentEditable:this.state.editMode&&!this.state.locked&&!this.state.previewVersionId, suppressContentEditableWarning:true, onClick:e=>{if(this.state.editMode){e.stopPropagation(); this.selectText(inst.id,'label');}}, onBlur:e=>this.commitText(inst.id,'cta',e.currentTarget.innerText), style:{display:'inline-block', padding:'11px 22px', border:'1px solid '+(fg==='#FDFBF4'?'rgba(253,251,244,.5)':'rgba(1,28,0,.4)'), borderRadius:999, fontSize:'15px', fontWeight:600, outline:'none'}}, inst.props.cta))), 820);
    if(t==='statement') return wrap(h('div',null,
      this.ed(inst,'label','label', muted, {marginBottom:18}),
      this.ed(inst,'heading','heading', fg),
      this.ed(inst,'body','body', fg, {marginTop:24, maxWidth:680, color:muted})));
    if(t==='twocol') return wrap(h('div',null,
      this.ed(inst,'label','label', muted, {marginBottom:18}),
      this.ed(inst,'lede','statement', fg, {maxWidth:620, marginBottom:36}),
      h('div',{style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48}},
        this.ed(inst,'colA','body', fg), this.ed(inst,'colB','body', fg))), 920);
    if(t==='casestudy') return wrap(h('div',{style:{display:'grid', gridTemplateColumns:'minmax(0,360px) 1fr', gap:56, alignItems:'center'}},
      h('div',Object.assign({style:{position:'relative', aspectRatio:'4/5', borderRadius:12, background:'#011C00', backgroundImage:'url('+this.imgUrl(inst.props.img||'emerald')+')', backgroundSize:'cover', backgroundPosition:'center', overflow:'hidden'}}, this.imgDrop(v=>this.setBlockImg(inst.id,v))), this.replaceBtn({blockId:inst.id, kind:'block'})),
      h('div',null,
        this.ed(inst,'label','label', muted, {marginBottom:18}),
        this.ed(inst,'title','heading', fg),
        this.ed(inst,'lede','body', fg, {marginTop:18, color:muted}),
        h('div',{style:{marginTop:30, display:'flex', alignItems:'baseline', gap:14, paddingTop:22, borderTop:'1px solid '+(fg==='#FDFBF4'?'rgba(253,251,244,.2)':'rgba(1,28,0,.15)')}},
          this.ed(inst,'metricValue','heading', fg, {fontSize:'52px', lineHeight:1}),
          this.ed(inst,'metricLabel','label', muted)))), 980);
    if(t==='projectgrid') return wrap(h('div',null,
      h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:30}},
        h('div',null, this.ed(inst,'label','label', muted, {marginBottom:14}), this.ed(inst,'heading','heading', fg))),
      h('div',{style:{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}},
        (inst.props.tiles||[]).map((tile,i)=>h('div',{key:i},
          h('div',Object.assign({style:{position:'relative', aspectRatio:'4/5', borderRadius:12, background:'#011C00', backgroundImage:'url('+this.imgUrl(tile.img)+')', backgroundSize:'cover', backgroundPosition:'center', marginBottom:14, overflow:'hidden'}}, this.imgDrop(v=>this.setTileImg(inst.id,i,v))), this.replaceBtn({blockId:inst.id, kind:'tile', tileIndex:i})),
          h('div',{contentEditable:this.state.editMode&&!this.state.locked&&!this.state.previewVersionId, suppressContentEditableWarning:true, onClick:e=>{if(this.state.editMode){e.stopPropagation(); this.selectText(inst.id,'statement');}}, onBlur:e=>this.commitTile(inst.id,i,'title',e.currentTarget.innerText), style:Object.assign(this.textStyle('statement',inst,fg),{outline:'none'})}, tile.title),
          h('div',{contentEditable:this.state.editMode&&!this.state.locked&&!this.state.previewVersionId, suppressContentEditableWarning:true, onClick:e=>{if(this.state.editMode){e.stopPropagation(); this.selectText(inst.id,'body');}}, onBlur:e=>this.commitTile(inst.id,i,'lede',e.currentTarget.innerText), style:Object.assign(this.textStyle('body',inst,muted),{outline:'none', marginTop:5, fontSize:'16px'})}, tile.lede))))), 1000);
    if(t==='footer') return wrap(h('div',null,
      this.ed(inst,'heading','heading', fg, {maxWidth:620}),
      h('div',{style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, marginTop:40, paddingTop:30, borderTop:'1px solid '+(fg==='#FDFBF4'?'rgba(253,251,244,.2)':'rgba(1,28,0,.15)')}},
        h('div',null, h('div',{style:Object.assign(this.textStyle('label',inst,muted),{marginBottom:10})},'Contact'), this.ed(inst,'contact','body', fg), this.ed(inst,'office','body', muted, {fontSize:'16px', marginTop:6})),
        h('div',null, h('div',{style:Object.assign(this.textStyle('label',inst,muted),{marginBottom:10})},'Index'), this.ed(inst,'nav','body', fg)))), 900);
    // custom
    return wrap(h('div',null,
      this.ed(inst,'label','label', muted, {marginBottom:18}),
      this.ed(inst,'heading','heading', fg),
      inst.props.body && this.ed(inst,'body','body', fg, {marginTop:20, color:muted, maxWidth:680})));
  }

  // ---------- tweaks ----------
  renderTweaks(){
    const h=React.createElement; const side=this.state.editorLayout==='lr';
    const border = side?{borderLeft:'1px solid var(--rule)'}:{borderRight:'1px solid var(--rule)'};
    // Real page \u2192 the bt type-style editor (per-role design-system overrides).
    if(this.state.realPage){
      return h('div',{className:'bso-scroll', style:Object.assign({width:this.state.tweaksW, flex:'0 0 '+this.state.tweaksW+'px', background:'var(--surface)', overflowY:'auto', height:'100%'}, border)},
        h('div',{style:{padding:'18px 18px 14px', position:'sticky', top:0, background:'var(--surface)', borderBottom:'1px solid var(--rule)', zIndex:2}},
          h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'center'}},
            h('div',{style:this.mono()}, 'Tweaks'),
            h('button',{onClick:()=>this.setState({tweaksOpen:false}), title:'Collapse', style:{background:'none',border:'none',cursor:'pointer',color:'var(--faint)',fontSize:'16px',padding:0,lineHeight:1}}, '\u00d7')),
          h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:9}}, 'Type styles \u2014 live design system')),
        this.btTweaksBody());
    }
    const inst=this.state.blocks.find(b=>b.id===this.state.selectedId);
    const role=this.state.selectedRole;
    return h('div',{className:'bso-scroll', style:Object.assign({width:this.state.tweaksW, flex:'0 0 '+this.state.tweaksW+'px', background:'var(--surface)', overflowY:'auto', height:'100%'}, border)},
      h('div',{style:{padding:'18px 18px 14px', position:'sticky', top:0, background:'var(--surface)', borderBottom:'1px solid var(--rule)', zIndex:2}},
        h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'center'}},
          h('div',{style:this.mono()}, 'Tweaks'),
          h('button',{onClick:()=>this.setState({tweaksOpen:false}), title:'Collapse', style:{background:'none',border:'none',cursor:'pointer',color:'var(--faint)',fontSize:'16px',padding:0,lineHeight:1}}, '\u00d7')),
        h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:9}}, inst? (role? 'Editing '+this.roleName(role)+' style' : 'Section selected') : ('Bound to '+getDs(this.activeDsId()).name+' DS'))),
      !inst ? this.tweaksEmpty() : this.tweaksBody(inst, role));
  }
  // bt type-style editor body \u2014 inline accordion: each role row toggles its
  // property controls open in place (mirrors renderBtSections / toggleLibType).
  btTweaksBody(){
    const h=React.createElement; const exp=this.state.tweakExpanded||{};
    const roles=Object.keys(ROLE_VARS).filter(r=>BT_ROLE_META[r]);
    return h('div',{style:{padding:'14px 0 40px'}},
      h('div',{style:{padding:'2px 20px 14px', fontSize:'12.5px', color:'var(--muted)', lineHeight:1.5}}, 'Click any text on the page to edit its type style \u2014 or pick a role below.'),
      roles.map(r=>{
        const open=!!exp[r]; const nFields=Object.keys(ROLE_VARS[r]).length;
        return h('div',{key:r, 'data-tweak-role':r, style:{borderTop:'1px solid var(--rule)'}},
          h('button',{onClick:()=>this.toggleTweakRole(r), 'data-tip':open?'Collapse':'Show properties',
            style:{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', background:open?'var(--paper)':'none', border:'none', cursor:'pointer', textAlign:'left'}},
            h('span',{style:{display:'flex', alignItems:'center', gap:9}},
              h('span',{style:{display:'inline-block', width:9, transform:open?'rotate(90deg)':'none', transition:'transform .14s', fontSize:'10px', color:'var(--faint)'}}, '\u25b6'),
              h('span',{style:{fontSize:'13px', fontWeight:600, color:'var(--ink)', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, BT_ROLE_META[r].label)),
            h('span',{style:this.mono({textTransform:'none', letterSpacing:0, fontSize:'10.5px'})}, nFields+' field'+(nFields!==1?'s':''))),
          open && this.btRoleControls(r));
      }));
  }
  // The inline property controls for one role, indented under its row.
  btRoleControls(role){
    const h=React.createElement;
    const fields=ROLE_VARS[role]; const cur=Object.assign({}, this.state.roleDefaults[role], this.state.btStyles[role]);
    const ctl=(field)=>{
      const m=BT_FIELD_META[field]; const raw=cur[field]; const num=parseFloat(raw);
      if(field==='fontFamily'){
        return h('input',{type:'text', value:(raw!=null?String(raw):''), placeholder:'inherit', onChange:e=>this.setBtVar(role,'fontFamily',e.target.value), style:{width:'100%', padding:'8px 10px', border:'1px solid var(--rule2)', borderRadius:7, background:'var(--paper)', color:'var(--ink)', fontFamily:'inherit', fontSize:'12.5px'}});
      }
      if(field==='fontWeight'){
        const wv=(raw!=null && raw!=='')?String(Math.round(num)||raw):'';
        return h('select',{value:wv, onChange:e=>this.setBtVar(role,'fontWeight',e.target.value), style:{width:'100%', padding:'8px 10px', border:'1px solid var(--rule2)', borderRadius:7, background:'var(--paper)', color:'var(--ink)', fontFamily:'inherit', fontSize:'12.5px'}},
          [h('option',{key:'_',value:''},'inherit')].concat(m.weights.map(w=>h('option',{key:w,value:String(w)},String(w)))));
      }
      const display=isNaN(num)?'':String(num);
      return h('div',{style:{display:'flex', alignItems:'center', gap:8}},
        h('input',{type:'number', step:m.step, value:display, placeholder:'\u2014', onChange:e=>{ const v=e.target.value; this.setBtVar(role, field, v===''?'':(v+m.unit)); }, style:{flex:1, padding:'8px 10px', border:'1px solid var(--rule2)', borderRadius:7, background:'var(--paper)', color:'var(--ink)', fontFamily:'inherit', fontSize:'12.5px'}}),
        m.unit? h('span',{style:this.mono({textTransform:'none', letterSpacing:0, fontSize:'11px'})}, m.unit):null);
    };
    return h('div',{style:{padding:'4px 20px 16px 41px', background:'var(--paper)', borderBottom:'1px solid var(--rule)'}},
      Object.keys(fields).map(field=> h('div',{key:field, style:{marginBottom:14}},
        h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:7}}, BT_FIELD_META[field].label), ctl(field))),
      Object.keys(this.state.btStyles[role]||{}).length? h('button',{onClick:()=>{ const s=Object.assign({}, this.state.btStyles); delete s[role]; const styles=Object.assign({}, this.state.styles, {bt:s}); this.setState({btStyles:s, styles}, ()=>this.markDirty()); }, style:{width:'100%', padding:'8px', border:'1px solid var(--rule2)', borderRadius:7, background:'var(--surface)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', fontFamily:'inherit'}}, 'Reset '+(BT_ROLE_META[role]?BT_ROLE_META[role].label:role)+' to default') : null);
  }
  tweaksEmpty(){
    const h=React.createElement;
    return h('div',{style:{padding:'0 0 8px', color:'var(--muted)'}},
      h('div',{style:{padding:'14px 18px 2px'}},
        h('div',{style:{fontSize:'12px', lineHeight:1.5, color:'var(--muted)'}}, 'Edit the Backspace Oddity type styles below \u2014 applies across the page. Click a section on the canvas to override one instance.')),
      h('div',{style:{marginTop:18, paddingTop:8, borderTop:'1px solid var(--rule)', textAlign:'left'}},
        h('div',{style:this.mono({margin:'0 18px 6px'})}, 'Type styles — live DS'),
        ['heading','statement','body','label','list'].map(r=>{
          const s=this.state.styles[r]; const open=this.state.dsRole===r;
          return h('div',{key:r, style:{borderBottom:'1px solid var(--rule)'}},
            h('button',{onClick:()=>this.setState({dsRole:open?null:r}), style:{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 18px', background:'none', border:'none', cursor:'pointer', textAlign:'left'}},
              h('span',{style:{display:'flex', alignItems:'center', gap:8}}, h('span',{style:{color:'var(--faint)', fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', width:8, display:'inline-block'}}, open?'-':'+'), h('span',{style:{fontSize:'13px', fontWeight:600, color:'var(--ink)', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, this.roleName(r))),
              h('span',{style:this.mono({textTransform:'none', letterSpacing:0, fontSize:'10.5px'})}, s.size+'/'+s.lh+' '+s.weight)),
            open && h('div',{style:{padding:'2px 18px 12px'}},
              this.row('Family', this.seg([{v:'display',l:'Display'},{v:'text',l:'Text'},{v:'mono',l:'Mono'}], s.family, v=>this.setDSProp(r,'family',v))),
              this.row('Size', this.sliderCtl(s.size, 11, 96, 1, v=>this.setDSProp(r,'size',v), s.size+'px')),
              this.row('Line height', this.sliderCtl(s.lh, 0.85, 1.8, 0.05, v=>this.setDSProp(r,'lh',Math.round(v*100)/100), s.lh.toFixed(2))),
              this.row('Weight', this.seg([{v:400,l:'400'},{v:500,l:'500'},{v:600,l:'600'},{v:700,l:'700'},{v:800,l:'800'}], s.weight, v=>this.setDSProp(r,'weight',v))),
              this.row('Uppercase', this.seg([{v:false,l:'Off'},{v:true,l:'On'}], !!s.upper, v=>this.setDSProp(r,'upper',v)))));
        })));
  }
  tweaksBody(inst, role){
    const h=React.createElement; const compact=this.state.tweaksStyle==='compact';
    const eff = role? this.effective(inst, role) : null;
    return h('div',{style:{padding:'8px 0 40px'}},
      role && this.section('Type — '+this.roleName(role), [
        this.row('Family', this.seg([{v:'display',l:'Display'},{v:'text',l:'Text'},{v:'mono',l:'Mono'}], eff.family, v=>this.setRoleProp('family',v)), compact),
        this.row('Size', this.sliderCtl(eff.size, 11, 96, 1, v=>this.setRoleProp('size',v), eff.size+'px'), compact),
        this.row('Line height', this.sliderCtl(eff.lh, 0.85, 1.8, 0.05, v=>this.setRoleProp('lh',Math.round(v*100)/100), eff.lh.toFixed(2)), compact),
        this.row('Weight', this.seg([{v:400,l:'400'},{v:500,l:'500'},{v:600,l:'600'},{v:700,l:'700'},{v:800,l:'800'}], eff.weight, v=>this.setRoleProp('weight',v)), compact),
        this.row('Tracking', this.sliderCtl(eff.tracking, -0.05, 0.2, 0.005, v=>this.setRoleProp('tracking',Math.round(v*1000)/1000), eff.tracking.toFixed(3)+'em'), compact),
        this.row('Uppercase', this.seg([{v:false,l:'Off'},{v:true,l:'On'}], !!eff.upper, v=>this.setRoleProp('upper',v)), compact),
      ]),
      role && this.updateStyleRow(inst, role),
      this.section('Section', [
        this.row('Background', this.seg([{v:'paper',l:'Paper'},{v:'soft',l:'Soft'},{v:'forest',l:'Forest'}], inst.bg, v=>this.setBlockProp(inst.id,'bg',v)), compact),
        this.row('Padding', this.seg([{v:'S',l:'S'},{v:'M',l:'M'},{v:'L',l:'L'}], inst.pad, v=>this.setBlockProp(inst.id,'pad',v)), compact),
      ]),
      !role && h('div',{style:{padding:'4px 20px 0', fontSize:'12.5px', color:'var(--muted)', lineHeight:1.5}}, 'Click a piece of text in this section to edit its type style and push the change to every instance.'));
  }
  updateStyleRow(inst, role){
    const h=React.createElement; const changed=this.hasOverride(inst, role);
    return h('div',{style:{margin:'4px 18px 18px', borderRadius:10, border:'1px solid '+(changed?'var(--ink)':'var(--rule2)'), background:changed?'var(--paper)':'transparent', padding:'13px', transition:'border-color .2s'}},
      h('div',{style:{display:'flex', alignItems:'center', gap:8}},
        h('span',{style:{width:7,height:7,borderRadius:99,background:changed?'#FF6647':'var(--rule2)'}}),
        h('div',{style:{fontSize:'13px', fontWeight:600, color:'var(--ink)', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, changed?'Local override':'Matches DS style')),
      h('div',{style:{fontSize:'12px', color:'var(--muted)', marginTop:6, lineHeight:1.45}}, changed? 'This instance differs from the shared '+this.roleName(role)+' style. Push it to update everywhere.' : 'Editing above creates a local override you can push to all instances.'),
      changed && h('div',{style:{marginTop:11}},
        h('div',{style:this.mono({marginBottom:8})}, 'Update this style — scope'),
        h('div',{style:{display:'flex', gap:7}},
          h('button',{onClick:()=>this.updateStyle('page'), style:{flex:1, padding:'9px', borderRadius:7, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'12px', fontWeight:600, fontFamily:'inherit'}}, 'This page'),
          h('button',{onClick:()=>this.updateStyle('ds'), style:{flex:1, padding:'9px', borderRadius:7, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', cursor:'pointer', fontSize:'12px', fontWeight:600, fontFamily:'inherit'}}, 'Whole design system')),
        h('button',{onClick:()=>this.resetOverride(), style:{marginTop:7, width:'100%', padding:'7px', border:'none', background:'transparent', color:'var(--faint)', cursor:'pointer', fontSize:'11.5px', fontFamily:'inherit'}}, 'Reset to DS style')));
  }
  section(title, rows){
    const h=React.createElement;
    return h('div',{style:{padding:'14px 18px 8px', borderBottom:'1px solid var(--rule)'}},
      h('div',{style:this.mono({marginBottom:14})}, title),
      rows);
  }
  row(label, control, compact){
    const h=React.createElement;
    if(compact) return h('div',{style:{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:14, minHeight:30}},
      h('div',{style:{fontSize:'12.5px', color:'var(--muted)', flex:'0 0 auto'}}, label), h('div',{style:{flex:'0 1 auto', display:'flex', justifyContent:'flex-end'}}, control));
    return h('div',{style:{marginBottom:16}},
      h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:7}}, label), control);
  }
  sliderCtl(value, min, max, step, onChange, readout){
    const h=React.createElement;
    return h('div',{style:{display:'flex', alignItems:'center', gap:10, minWidth:150}},
      h('input',{type:'range', min:min, max:max, step:step, value:value, onChange:e=>onChange(parseFloat(e.target.value)), style:{flex:1, accentColor:'#011C00', height:4, cursor:'pointer'}}),
      h('span',{style:Object.assign(this.mono({textTransform:'none', letterSpacing:0, color:'var(--ink)'}),{fontSize:'11px', minWidth:46, textAlign:'right'})}, readout));
  }

  // ---------- versions drawer ----------
  renderVersions(){
    const h=React.createElement;
    return h('div',{style:{position:'absolute', top:0, right:0, bottom:0, width:340, background:'var(--surface)', borderLeft:'1px solid var(--rule)', zIndex:45, boxShadow:'-12px 0 40px rgba(0,0,0,.12)', display:'flex', flexDirection:'column', animation:'bsofade .25s both'}},
      h('div',{style:{padding:'18px 20px', borderBottom:'1px solid var(--rule)', display:'flex', justifyContent:'space-between', alignItems:'center'}},
        h('div',null, h('div',{style:this.mono()}, 'Version history'), h('div',{style:{fontSize:'15px', fontWeight:600, marginTop:6, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, this.state.pageTitle)),
        h('button',{onClick:()=>this.setState({versionsOpen:false}), style:{background:'none', border:'none', cursor:'pointer', color:'var(--faint)', fontSize:'20px'}}, '\u00d7')),
      h('div',{style:{padding:'14px 16px'}},
        h('button',{onClick:()=>this.saveVersion(), style:{width:'100%', padding:'10px', borderRadius:8, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'inherit', marginBottom:14}}, 'Save current as version'),
        this.state.versions.map(v=>{ const viewing=this.state.previewVersionId===v.id || (!this.state.previewVersionId && v.current); return h('div',{key:v.id, onClick:()=>this.previewVersion(v), style:{padding:'13px 14px', borderRadius:10, border:'1px solid '+(viewing?'var(--ink)':'var(--rule)'), marginBottom:9, background:viewing?'var(--paper)':'transparent', cursor:'pointer', boxShadow:viewing?'inset 0 0 0 1px var(--ink)':'none'}},
          h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}},
            h('div',{style:{fontSize:'13.5px', fontWeight:600, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, v.label), v.current ? h('span',{style:this.mono({fontSize:'9.5px', color:'var(--ink)'})}, 'Current') : (viewing && h('span',{style:this.mono({fontSize:'9.5px', color:'var(--ink)'})}, 'Viewing'))),
          h('div',{style:{display:'flex', gap:12, marginTop:7}}, h('span',{style:this.mono({fontSize:'10px'})}, v.author), h('span',{style:this.mono({fontSize:'10px'})}, v.when)),
          !v.current && h('button',{onClick:e=>{e.stopPropagation(); this.restoreVersion(v.id);}, style:{marginTop:10, padding:'6px 12px', borderRadius:6, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', cursor:'pointer', fontSize:'12px', fontFamily:'inherit'}}, 'Restore')); })));
  }

  // ---------- new page modal ----------
  renderNewPage(){
    const h=React.createElement; const {newPageArche, newPageName, newPageDsId}=this.state;
    return h('div',{onClick:()=>this.setState({newPageOpen:false}), style:{position:'absolute', inset:0, zIndex:60, background:'rgba(1,28,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'bsofade .2s both'}},
      h('div',{onClick:e=>e.stopPropagation(), style:{width:720, maxWidth:'100%', maxHeight:'90%', overflow:'auto', background:'var(--surface)', borderRadius:16, border:'1px solid var(--rule)', boxShadow:'var(--shadow)'}},
        h('div',{style:{padding:'22px 26px 18px', borderBottom:'1px solid var(--rule)'}},
          h('div',{style:this.mono({marginBottom:10})}, 'New page'),
          h('div',{style:{fontSize:'26px', fontWeight:700, letterSpacing:'-0.02em', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, 'Pick a starting template')),
        h('div',{style:{padding:'22px 26px'}},
          h('div',{style:{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}},
            this.ARCHETYPES.map(a=>{ const on=newPageArche&&newPageArche.id===a.id; return h('div',{key:a.id, onClick:()=>this.setState({newPageArche:a}), style:{border:'1px solid '+(on?'var(--ink)':'var(--rule2)'), borderRadius:12, overflow:'hidden', cursor:'pointer', background:'var(--paper)', boxShadow:on?'0 0 0 2px var(--ink)':'none', transition:'box-shadow .15s'}},
              h('div',{style:{height:96, background:'#011C00', backgroundImage:a.id==='blank'?'none':'url('+this.grad(a.img)+')', backgroundSize:'cover', backgroundPosition:'center', display:'flex', alignItems:'center', justifyContent:'center'}}, a.id==='blank'&&h('span',{style:this.mono({color:'rgba(253,251,244,.5)'})}, 'Blank')),
              h('div',{style:{padding:'13px 15px'}}, h('div',{style:{fontSize:'15px', fontWeight:600, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, a.name), h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:4}}, a.desc))); })),
          h('div',{style:{marginTop:22}},
            h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:7}}, 'Design system'),
            h('div',{style:{display:'flex', gap:10, flexWrap:'wrap'}},
              DESIGN_SYSTEMS.map(d=>{ const on=newPageDsId===d.id; const empty=!d.sections.length; return h('button',{key:d.id, 'data-ds':d.id, onClick:()=>this.setState({newPageDsId:d.id}),
                style:{flex:'1 1 180px', textAlign:'left', padding:'12px 14px', borderRadius:10, border:'1px solid '+(on?'var(--ink)':'var(--rule2)'), background:on?'var(--ink)':'var(--paper)', color:on?'var(--paper)':'var(--ink)', cursor:'pointer', boxShadow:on?'0 0 0 1px var(--ink)':'none', fontFamily:'inherit', transition:'border-color .12s, background .12s'}},
                h('div',{style:{fontSize:'14px', fontWeight:600, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, d.name),
                h('div',{style:{fontSize:'11.5px', marginTop:3, color:on?'rgba(242,242,240,.75)':'var(--muted)'}}, empty? 'sections coming soon' : d.sections.length+' section types')); }))),
          h('div',{style:{marginTop:22}},
            h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:7}}, 'Page name'),
            h('input',{value:newPageName, onChange:e=>this.setState({newPageName:e.target.value}), placeholder:'e.g. Q3 partnership proposal', style:{width:'100%', padding:'11px 13px', borderRadius:9, border:'1px solid var(--rule2)', background:'var(--paper)', color:'var(--ink)', fontSize:'15px', fontFamily:'inherit'}}))),
        h('div',{style:{padding:'16px 26px', borderTop:'1px solid var(--rule)', display:'flex', justifyContent:'flex-end', gap:10}},
          h('button',{onClick:()=>this.setState({newPageOpen:false}), style:{padding:'10px 18px', borderRadius:8, border:'1px solid var(--rule2)', background:'transparent', color:'var(--ink)', cursor:'pointer', fontSize:'13.5px', fontFamily:'inherit'}}, 'Cancel'),
          h('button',{onClick:()=>this.createFromTemplate(), disabled:!newPageArche, style:{padding:'10px 20px', borderRadius:8, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:newPageArche?'pointer':'default', opacity:newPageArche?1:0.45, fontSize:'13.5px', fontWeight:600, fontFamily:'inherit'}}, 'Create & open editor'))));
  }

  // ---------- variations popover ----------
  renderVariations(){
    const h=React.createElement;
    const block=(title, desc, ctrl)=>h('div',{style:{padding:'16px 0', borderBottom:'1px solid var(--rule)'}},
      h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'center', gap:16}},
        h('div',null, h('div',{style:{fontSize:'14px', fontWeight:600, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, title), h('div',{style:{fontSize:'12px', color:'var(--muted)', marginTop:3}}, desc)), ctrl));
    return h('div',{onClick:()=>this.setState({variationsOpen:false}), style:{position:'absolute', inset:0, zIndex:60, background:'rgba(1,28,0,.4)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'70px 24px', animation:'bsofade .2s both'}},
      h('div',{onClick:e=>e.stopPropagation(), style:{width:480, maxWidth:'100%', background:'var(--surface)', borderRadius:16, border:'1px solid var(--rule)', boxShadow:'var(--shadow)', overflow:'hidden'}},
        h('div',{style:{padding:'20px 24px 14px', borderBottom:'1px solid var(--rule)', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}},
          h('div',null, h('div',{style:this.mono({marginBottom:9})}, 'Exploration'), h('div',{style:{fontSize:'21px', fontWeight:700, letterSpacing:'-0.01em', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, 'Variations'), h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:6, maxWidth:340, lineHeight:1.45}}, 'Flip the layouts you asked to explore. Each toggle re-renders the live prototype.')),
          h('button',{onClick:()=>this.setState({variationsOpen:false}), style:{background:'none', border:'none', cursor:'pointer', color:'var(--faint)', fontSize:'20px'}}, '\u00d7')),
        h('div',{style:{padding:'4px 24px 18px'}},
          block('Start screen', 'Dense rows vs. visual gallery', this.seg([{v:'rows',l:'Rows'},{v:'gallery',l:'Grid'}], this.state.dashView, v=>this.setState({dashView:v}))),
          block('Editor layout', 'Library + tweaks placement', this.seg([{v:'lr',l:'Lib left'},{v:'rl',l:'Lib right'}], this.state.editorLayout, v=>this.setState({editorLayout:v}))),
          block('Tweaks panel', 'Roomy stacked vs. compact rows', this.seg([{v:'stacked',l:'Roomy'},{v:'compact',l:'Compact'}], this.state.tweaksStyle, v=>this.setState({tweaksStyle:v}))),
          block('Builder theme', 'Light or dark chrome', this.seg([{v:'light',l:'Light'},{v:'dark',l:'Dark'}], this.state.theme, v=>this.setState({theme:v})))),
        h('div',{style:{padding:'14px 24px', borderTop:'1px solid var(--rule)', display:'flex', justifyContent:'flex-end'}},
          h('button',{onClick:()=>this.setState({variationsOpen:false}), style:{padding:'9px 18px', borderRadius:8, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'inherit'}}, 'Done'))));
  }

  renderToast(){
    const h=React.createElement;
    return h('div',{style:{position:'absolute', bottom:22, left:'50%', transform:'translateX(-50%)', zIndex:70, background:'var(--ink)', color:'var(--paper)', padding:'11px 18px', borderRadius:10, fontSize:'13px', boxShadow:'0 10px 40px rgba(0,0,0,.25)', animation:'bsofade .25s both', maxWidth:480, textAlign:'center'}}, this.state.toast);
  }

  async complete(prompt){
    const r = await fetch('/api/builder/generate', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt})});
    const j = await r.json();
    return (j && j.text) || '';
  }
  render(){ this._dbg(); return React.createElement('div', {style:{height:'100vh', overflow:'hidden'}}, this.renderApp()); }

}

export default BuilderApp;
