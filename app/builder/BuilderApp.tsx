// @ts-nocheck
'use client';
/* eslint-disable */
/* Ported verbatim from the Claude Design export "Landing Builder.dc.html" (BSO-658).
   Faithful import: only the Claude Design runtime coupling was swapped for React 19
   (base class, mount, window.claude.complete → /api/builder/generate, asset URLs).
   Design choices (ABC Schengen / Inter / JetBrains Mono / GT Eesti, palette, layout) untouched. */
import React from 'react';
import { BT_COMPONENTS, BT_PAGES, BT_TYPE_NAMES } from './blocks/realpages';

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
      screen:'login', theme:'light', loginEmail:'', loginPw:'', loginBusy:false, loginErr:'', loginMode:'password',
      dashTab:'bso', dashView:'rows', dashPageIdx:0,
      editorLayout:'lr', tweaksStyle:'stacked',
      newPageOpen:false, newPageStep:1, newPageArche:null, newPageName:'',
      pageTitle:'', pageTab:'bso', blocks:[], styles:this.clone(this.DEFAULT_STYLES), pages:this.PAGES.slice(),
      selectedId:null, selectedRole:null, editMode:true, libraryOpen:true, tweaksOpen:true, libW:188, tweaksW:248, dsRole:'heading',
      askPrompt:'', askState:'idle', askResult:null, customTemplates:[], libTab:'sections', draggingAsset:null, assets:[{id:'a1',name:'Magenta · green',val:'magenta-green'},{id:'a2',name:'Terracotta',val:'terracotta'},{id:'a3',name:'Emerald',val:'emerald'},{id:'a4',name:'Warm',val:'warm'}],
      locked:false, lockOwner:'Marnix', versionsOpen:false, versions:[],
      variationsOpen:false, menuOpen:false, draggingType:null, dragIndex:null, dropAt:null,
      toast:null, canvasZoom:1, previewVersionId:null, imgTarget:null, currentPage:null, analyticsPage:null, analyticsFrom:'dashboard', deployPage:null, deployFrom:'dashboard', deploySubdomain:'', deployStatus:'idle', deployLogs:[], deployStage:0, deployHost:'',
    };
    this.uid = 0;
    this.fileInput = null;
  }
  componentDidMount(){
    try{ const raw = localStorage.getItem('bso_ds_styles'); if(raw){ this.dsStyles = JSON.parse(raw); } }catch(e){}
    // Restore an existing session — skip the login screen if already signed in.
    fetch('/api/builder/me/').then(r=>r.json()).then(d=>{
      if(d && d.authed){ this.setState(s=> s.screen==='login' ? {screen:'dashboard', loginEmail:d.email||s.loginEmail} : {}); }
    }).catch(()=>{});
  }
  componentWillUnmount(){ if(this._ro){ this._ro.disconnect(); } if(this._dep){ this._dep.forEach(clearTimeout); } }
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
  openDeploy(p, from){ this.setState({screen:'deploy', deployPage:p, deployFrom:from||'dashboard', deploySubdomain:this.slugify(p.name), deployStatus:'idle', deployLogs:[], deployStage:0, deployHost:''}); }
  nowTime(){ const d=new Date(), z=n=>String(n).padStart(2,'0'); return z(d.getHours())+':'+z(d.getMinutes())+':'+z(d.getSeconds()); }
  pushLog(text, ok){ this.setState(s=>({deployLogs:[...s.deployLogs, {t:this.nowTime(), text, ok:!!ok}]}), ()=>{ if(this._logEl) this._logEl.scrollTop=this._logEl.scrollHeight; }); }
  startDeploy(){ if(this.state.deployStatus==='running') return; if(this._dep) this._dep.forEach(clearTimeout); this._dep=[]; const sub=this.state.deploySubdomain||'page'; const host=sub+'.backspaceoddity.com'; const p=this.state.deployPage; const nb=(p&&p.recipe&&p.recipe.length)||5; const steps=[ {s:1,text:'agent: picking up deploy job for '+host}, {s:1,text:'snapshotting page \u2014 '+nb+' blocks, 4 brand assets'}, {s:1,text:'resolving Backspace Oddity design tokens'}, {s:2,text:'building static bundle \u2014 next build && next export'}, {s:2,text:'optimising images \u2014 generating .webp at 1\u00d7/2\u00d7'}, {s:2,text:'inlining GT Eesti + ABC Schengen font faces'}, {s:3,text:'provisioning subdomain '+host}, {s:3,text:'issuing TLS certificate via Let\u2019s Encrypt'}, {s:3,text:'uploading 38 files to edge CDN'}, {s:4,text:'running smoke checks \u2014 GET / \u2192 200 OK'}, {s:4,text:'deploy complete \u2014 live at https://'+host, ok:true} ]; this.setState({deployStatus:'running', deployLogs:[], deployStage:1, deployHost:host}); let delay=300; steps.forEach((stp,i)=>{ const tm=setTimeout(()=>{ this.pushLog(stp.text, stp.ok); this.setState({deployStage:stp.s}); if(i===steps.length-1){ this.setState({deployStatus:'live'}); this.toast('Deployed to '+host); } }, delay); this._dep.push(tm); delay += 600 + (i%3)*250; }); }
  renderDeploy(){
    const h=React.createElement; const p=this.state.deployPage; if(!p) return null;
    const SCH="'ABC Schengen','Inter',system-ui,sans-serif"; const MONO="'JetBrains Mono',monospace";
    const st=this.state.deployStatus; const host=(this.state.deploySubdomain||'page')+'.backspaceoddity.com'; const stage=this.state.deployStage;
    const bmap={idle:['Not deployed','var(--muted)'], running:['Deploying\u2026','var(--ink)'], live:['Live','#1CAA00'], failed:['Failed','#FF2A00']}; const bm=bmap[st]||bmap.idle;
    const badge=h('span',{style:{display:'inline-flex', alignItems:'center', gap:7, fontFamily:MONO, fontSize:'11px', letterSpacing:'.06em', textTransform:'uppercase', color:bm[1], border:'1px solid '+bm[1], borderRadius:999, padding:'5px 11px'}}, h('span',{style:{width:7,height:7,borderRadius:99, background:bm[1], animation:st==='running'?'bsoblink 1.2s infinite':'none'}}), bm[0]);
    const stages=['Snapshot','Build','Provision','Live'];
    return h('div',{className:'bso-scroll', style:{height:'100%', overflowY:'auto', background:'var(--paper)'}},
      h('div',{style:{maxWidth:920, margin:'0 auto', padding:'34px 32px 72px'}},
        h('button',{onClick:()=>this.setState({screen:this.state.deployFrom||'dashboard'}), style:{background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:'13px', fontFamily:'inherit', padding:0, marginBottom:18}}, '\u2190 '+(this.state.deployFrom==='editor'?'Back to editor':'All pages')),
        h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16, marginBottom:26, flexWrap:'wrap'}},
          h('div',null, h('div',{style:this.mono({marginBottom:10})}, 'Deploy'), h('h1',{style:{margin:0, fontSize:'34px', fontWeight:700, letterSpacing:'-0.02em', fontFamily:SCH}}, p.name)), badge),
        h('div',{style:{border:'1px solid var(--rule)', borderRadius:12, background:'var(--surface)', padding:'18px 20px', marginBottom:18}},
          h('div',{style:this.mono({fontSize:'10px', marginBottom:12})}, 'Target subdomain'),
          h('div',{style:{display:'flex', alignItems:'center', gap:0, flexWrap:'wrap'}},
            h('input',{value:this.state.deploySubdomain, disabled:st==='running', onChange:e=>this.setState({deploySubdomain:this.slugify(e.target.value)}), style:{width:190, padding:'10px 12px', borderRadius:'8px 0 0 8px', border:'1px solid var(--rule2)', borderRight:'none', background:'var(--paper)', color:'var(--ink)', fontFamily:MONO, fontSize:'14px'}}),
            h('span',{style:{padding:'10px 12px', border:'1px solid var(--rule2)', borderRadius:'0 8px 8px 0', background:'var(--soft)', color:'var(--muted)', fontFamily:MONO, fontSize:'14px'}}, '.backspaceoddity.com'),
            h('div',{style:{flex:1, minWidth:12}}),
            st==='live' && h('a',{href:'https://'+host, target:'_blank', rel:'noreferrer', style:{padding:'10px 16px', borderRadius:8, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit', textDecoration:'none', marginRight:10}}, 'Visit site \u2192'),
            h('button',{onClick:()=>this.startDeploy(), disabled:st==='running', style:{padding:'10px 20px', borderRadius:8, border:'1px solid var(--ink)', background:st==='running'?'var(--muted)':'var(--ink)', color:'var(--paper)', cursor:st==='running'?'default':'pointer', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit'}}, st==='running'?'Deploying\u2026':(st==='live'?'Redeploy':'Deploy now'))),
          h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:12, lineHeight:1.45}}, st==='live'? ('Live at https://'+host) : 'An agent builds the page in the Backspace Oddity design system and publishes it to the edge. Nothing is published until you run a deploy.')),
        h('div',{style:{display:'flex', gap:8, marginBottom:18}}, stages.map((sl,i)=>{ const idx=i+1; const done=stage>idx||st==='live'; const active=stage===idx&&st==='running'; return h('div',{key:i, style:{flex:1, padding:'10px 12px', borderRadius:9, border:'1px solid '+((done||active)?'var(--ink)':'var(--rule)'), background:(done||active)?'var(--paper)':'transparent', display:'flex', alignItems:'center', gap:8}}, h('span',{style:{width:7,height:7,borderRadius:99, background:(done||active)?'var(--ink)':'var(--rule2)', animation:active?'bsoblink 1.2s infinite':'none'}}), h('span',{style:{fontSize:'12.5px', fontWeight:500, color:(done||active)?'var(--ink)':'var(--muted)'}}, sl)); })),
        h('div',{style:{borderRadius:12, overflow:'hidden', border:'1px solid var(--rule)'}},
          h('div',{style:{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#011C00', borderBottom:'1px solid rgba(253,251,244,.12)'}},
            h('span',{style:{fontFamily:MONO, fontSize:'10.5px', letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(253,251,244,.55)'}}, 'Deploy log'),
            h('span',{style:{fontFamily:MONO, fontSize:'10.5px', color:'rgba(253,251,244,.4)'}}, host)),
          h('div',{ref:el=>{this._logEl=el;}, style:{background:'#011C00', color:'#FDFBF4', padding:'14px 16px', height:300, overflowY:'auto', fontFamily:MONO, fontSize:'12.5px', lineHeight:1.7}},
            this.state.deployLogs.length===0 ? h('div',{style:{color:'rgba(253,251,244,.4)'}}, '$ awaiting deploy \u2014 press Deploy now to start the agent') :
            this.state.deployLogs.map((l,i)=> h('div',{key:i, style:{marginBottom:3, color: l.ok?'#7CFF8F':'rgba(253,251,244,.92)'}}, h('span',{style:{color:'rgba(253,251,244,.36)', marginRight:12}}, l.t), (l.ok?'\u2713 ':'')+l.text)),
            st==='running' && h('div',{style:{color:'rgba(253,251,244,.5)'}}, h('span',{style:{animation:'bsoblink 1s infinite'}}, '\u2588'))))));
  }
  imgDrop(applyFn){ return { onDragOver:e=>{ if(this.state.draggingAsset){ e.preventDefault(); } }, onDrop:e=>{ if(this.state.draggingAsset){ e.preventDefault(); e.stopPropagation(); applyFn(this.state.draggingAsset); this.setState({draggingAsset:null}); this.toast('Image applied'); } } }; }
  armReplace(target){ this.setState({imgTarget:target, libraryOpen:true, libTab:'assets'}); this.toast('Pick an image from Brand assets'); }
  applyAssetToTarget(val){ const t=this.state.imgTarget; if(!t) return false; if(t.kind==='tile'){ this.setTileImg(t.blockId, t.tileIndex, val); } else { this.setBlockImg(t.blockId, val); } this.setState({imgTarget:null}); this.toast('Image replaced'); return true; }
  replaceBtn(target){ const h=React.createElement; if(!(this.state.editMode && !this.state.locked && !this.state.previewVersionId)) return null; const t=this.state.imgTarget; const armed=t && t.blockId===target.blockId && t.tileIndex===target.tileIndex && t.kind===target.kind; return h('button',{onClick:e=>{ e.stopPropagation(); this.armReplace(target); }, 'data-tip':'Replace from library', style:{position:'absolute', bottom:8, right:8, zIndex:7, padding:'5px 11px', borderRadius:7, border:'1px solid rgba(255,255,255,.55)', background:armed?'#F2F2F0':'rgba(1,28,0,.74)', color:armed?'#011C00':'#F2F2F0', cursor:'pointer', fontSize:'11px', fontWeight:600, fontFamily:"'Inter',system-ui,sans-serif"}}, armed?'Choose an image \u2192':'Replace image'); }
  toast(msg){ this.setState({toast:msg}); clearTimeout(this._tt); this._tt=setTimeout(()=>this.setState({toast:null}), 3200); }
  roleName(r){ return ({label:'Label',heading:'Heading',statement:'Statement',body:'Body',list:'List'})[r]||r; }
  typeName(t){ if(t&&t.indexOf('bt:')===0) return BT_TYPE_NAMES[t]||t.slice(3); return ({hero:'Hero well',statement:'Statement',twocol:'Two-column',casestudy:'Case study',projectgrid:'Project grid',footer:'Footer',custom:'Custom block'})[t]||t; }
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
  deletePage(id){ this.setState(s=>({pages:(s.pages||[]).filter(p=>p.id!==id)})); this.toast('Page deleted'); }
  archivePage(id){ this.setState(s=>({pages:(s.pages||[]).map(p=>p.id===id?{...p, archived:true}:p)})); this.toast('Page archived'); }
  // Inject the active real page's stylesheet (8Figures + brand-transformation ship
  // different CSS under shared bt- class names, so only one loads at a time).
  injectPageCss(cssId){
    if(typeof document==='undefined') return;
    let link=document.getElementById('bso-page-css');
    if(!link){ link=document.createElement('link'); link.id='bso-page-css'; link.rel='stylesheet'; document.head.appendChild(link); }
    link.href='/builder-css/'+cssId+'.css';
  }
  clearPageCss(){ if(typeof document==='undefined') return; const l=document.getElementById('bso-page-css'); if(l) l.parentNode.removeChild(l); }
  openPage(p){
    if(p && p.real && BT_PAGES[p.real]){
      const def=BT_PAGES[p.real]; this.injectPageCss(def.css);
      const cur=this.clone(def.blocks);
      this.setState({screen:'editor', realPage:p.real, pageTitle:p.name, pageTab:p.tab, currentPage:p, blocks:cur,
        styles:this.dsStyles?this.clone(this.dsStyles):this.clone(this.DEFAULT_STYLES),
        selectedId:null, selectedRole:null, editMode:true, locked:false, versionsOpen:false, previewVersionId:null, imgTarget:null,
        versions:[{id:'v3', label:'Current draft', when:'Just now', author:'You', current:true, blocks:this.clone(cur)}]});
      return;
    }
    this.clearPageCss();
    const styles = this.dsStyles ? this.clone(this.dsStyles) : this.clone(this.DEFAULT_STYLES);
    const cur=this.buildPage(p.recipe);
    const v2=this.clone(cur); const hv2=v2.find(b=>b.type==='hero'); if(hv2){ hv2.props.heading='Uncover hidden growth levers.'; hv2.props.label='Backspace Oddity'; hv2.props.cta='Get in touch'; hv2.props.img='terracotta'; }
    const v1=this.clone(cur).filter(b=>b.type==='hero'||b.type==='footer'); const hv1=v1.find(b=>b.type==='hero'); if(hv1){ hv1.props.heading='A new home for Backspace Oddity.'; hv1.props.img='emerald'; }
    this.setState({screen:'editor', realPage:null, pageTitle:p.name, pageTab:p.tab, currentPage:p, blocks:cur, styles,
      selectedId:null, selectedRole:null, editMode:true, locked:false, versionsOpen:false, previewVersionId:null, imgTarget:null,
      versions:[
        {id:'v3', label:'Current draft', when:'Just now', author:'You', current:true, blocks:this.clone(cur)},
        {id:'v2', label:'Hero copy revision', when:p.edited, author:p.owner, blocks:v2},
        {id:'v1', label:'Initial layout', when:'Earlier', author:p.owner, blocks:v1},
      ]});
  }
  backToDash(){ this.clearPageCss(); this.setState({screen:'dashboard', realPage:null, selectedId:null, selectedRole:null, previewVersionId:null, imgTarget:null}); }
  createFromTemplate(){
    const a = this.state.newPageArche; if(!a) return;
    this.clearPageCss();
    const styles = this.dsStyles ? this.clone(this.dsStyles) : this.clone(this.DEFAULT_STYLES);
    this.setState({screen:'editor', realPage:null, newPageOpen:false, pageTitle:this.state.newPageName||'Untitled page', pageTab:this.state.dashTab,
      blocks:this.buildPage(a.recipe), styles, selectedId:null, selectedRole:null, editMode:true, locked:false,
      versions:[{id:'v1', label:'Created from '+a.name, when:'Just now', author:'You', current:true}]});
  }

  // ---------- block ops ----------
  selectBlock(id){ this.setState({selectedId:id, selectedRole:null}); }
  selectText(id, role){ this.setState({selectedId:id, selectedRole:role}); }
  commitText(id, key, text){ this.setState(s=>({blocks:s.blocks.map(b=> b.id===id ? {...b, props:{...b.props,[key]:text}} : b)})); }
  commitTile(id, idx, key, text){ this.setState(s=>({blocks:s.blocks.map(b=>{ if(b.id!==id) return b; const tiles=b.props.tiles.map((t,i)=> i===idx?{...t,[key]:text}:t); return {...b, props:{...b.props, tiles}}; })})); }
  moveBlock(id, dir){
    this.setState(s=>{ const arr=[...s.blocks]; const i=arr.findIndex(b=>b.id===id); const j=i+dir; if(j<0||j>=arr.length) return {}; const t=arr[i]; arr[i]=arr[j]; arr[j]=t; return {blocks:arr}; });
  }
  duplicateBlock(id){ this.setState(s=>{ const i=s.blocks.findIndex(b=>b.id===id); const copy=this.clone(s.blocks[i]); copy.id=this.nid(); const arr=[...s.blocks]; arr.splice(i+1,0,copy); return {blocks:arr, selectedId:copy.id}; }); }
  deleteBlock(id){ this.setState(s=>({blocks:s.blocks.filter(b=>b.id!==id), selectedId:null, selectedRole:null})); }
  setBlockProp(id, key, val){ this.setState(s=>({blocks:s.blocks.map(b=> b.id===id ? {...b,[key]:val} : b)})); }

  insertAt(index, block){ this.setState(s=>{ const arr=[...s.blocks]; arr.splice(index,0,block); return {blocks:arr, selectedId:block.id, selectedRole:null, dropAt:null, draggingType:null, dragIndex:null}; }); }
  onDrop(index){
    const {draggingType, dragIndex} = this.state;
    if(draggingType){ const blank=draggingType.startsWith('blank:'); const realType=blank?draggingType.slice(6):draggingType; this.insertAt(index, draggingType.startsWith('custom:') ? this.customInstance(draggingType) : (blank?this.makeBlock(realType,{props:this.placeholders(realType), bg:'paper'}):this.makeBlock(realType))); return; }
    if(dragIndex!=null){ this.setState(s=>{ const arr=[...s.blocks]; const [m]=arr.splice(dragIndex,1); let to=index; if(dragIndex<index) to=index-1; arr.splice(to,0,m); return {blocks:arr, dragIndex:null, dropAt:null}; }); }
  }
  customInstance(key){ const t=this.state.customTemplates.find(x=>x.key===key); if(!t) return this.makeBlock('custom'); const b=this.makeBlock('custom'); b.props=this.clone(t.props); b.bg=t.bg||'paper'; return b; }

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
  async askClaude(){
    const p = this.state.askPrompt.trim(); if(!p) return;
    this.setState({askState:'thinking', askResult:null});
    const prompt = 'You are a section generator for a Backspace Oddity landing-page builder. The brand voice is editorial, confident, writerly, uses em-dashes, sentence case, no emoji, no exclamation marks. Given this request: "'+p+'", return ONLY a JSON object (no prose, no code fences) with keys: "label" (short uppercase-ish kicker, 1-3 words), "heading" (one editorial sentence), "body" (1-2 sentences), "bg" (one of "paper","soft","forest"). Keep it on-brand.';
    try{
      const raw = await this.complete(prompt);
      const txt = String(raw||'');
      const s=txt.indexOf('{'), e=txt.lastIndexOf('}');
      const obj = JSON.parse(txt.slice(s, e+1));
      this.setState({askState:'ready', askResult:{label:obj.label||'New block', heading:obj.heading||'', body:obj.body||'', bg:(['paper','soft','forest'].indexOf(obj.bg)>=0?obj.bg:'paper')}});
    }catch(err){
      this.setState({askState:'ready', askResult:{label:'New block', heading:'We build ventures that mean something — not just ones that work.', body:'A coherent system linking what you stand for with what your customers actually feel.', bg:'soft'}});
    }
  }
  addAskToCanvas(){
    const r=this.state.askResult; if(!r) return;
    const b=this.makeBlock('custom'); b.bg=r.bg; b.props={label:r.label, heading:r.heading, body:r.body};
    this.setState(s=>({blocks:[...s.blocks, b], selectedId:b.id, askState:'idle', askResult:null, askPrompt:''}));
    this.toast('Block added to canvas');
  }
  lockToLibrary(){
    const r=this.state.askResult; if(!r) return;
    const key='custom:'+this.nid('c');
    const tpl={key, type:'custom', name:r.label||'Custom block', desc:'Locked from Claude', props:{label:r.label, heading:r.heading, body:r.body}, bg:r.bg};
    this.setState(s=>({customTemplates:[...s.customTemplates, tpl], askState:'idle', askResult:null, askPrompt:''}));
    this.toast('Locked & added to library — now a reusable template');
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
    if(screen==='login') return h('div',{'data-theme':theme, style:{height:'100vh', overflow:'hidden', background:'var(--paper)', color:'var(--ink)'}}, this.renderLogin(), this.state.toast && this.renderToast());
    return h('div', {'data-theme':theme, style:{height:'100vh', display:'flex', flexDirection:'column', background:'var(--paper)', color:'var(--ink)', overflow:'hidden'}},
      this.renderTopbar(),
      h('div', {style:{flex:1, minHeight:0, position:'relative'}},
        screen==='dashboard' ? this.renderDashboard() : screen==='analytics' ? this.renderAnalytics() : screen==='deploy' ? this.renderDeploy() : this.renderEditor()
      ),
      this.state.newPageOpen && this.renderNewPage(),
      this.state.variationsOpen && this.renderVariations(),
      this.state.toast && this.renderToast(),
    );
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
        else if(r.ok){ this.setState({loginBusy:false, loginPw:'', screen:'dashboard'}); }
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
      screen==='editor' && h('button',{onClick:()=>this.openAnalytics(this.state.currentPage||{id:'cur', name:this.state.pageTitle, status:'Draft'}, 'editor'), style:this.topBtn(false)}, 'Analytics'),
      screen==='editor' && h('button',{onClick:()=>this.openDeploy(this.state.currentPage||{id:'cur', name:this.state.pageTitle, status:'Draft'}, 'editor'), style:Object.assign({}, this.topBtn(false), {background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)', fontWeight:600})}, 'Deploy'),
      screen==='editor' && h('button',{onClick:()=>this.setState({locked:!this.state.locked}), style:this.topBtn(false)}, this.state.locked?'Take over':'Simulate lock'),
      h('button',{onClick:()=>this.setState({variationsOpen:true}), style:this.topBtn(false)}, 'Variations'),
      h('button',{onClick:()=>this.setState({theme:this.state.theme==='light'?'dark':'light'}), style:this.topBtn(false), title:'Toggle builder theme'}, this.state.theme==='light'?'Dark':'Light'),
      screen==='dashboard' && h('button',{onClick:()=>this.setState({newPageOpen:true, newPageStep:1, newPageArche:null, newPageName:''}), style:Object.assign(this.topBtn(false),{background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)', fontWeight:600})}, '+ New page'),
    );
  }
  topBtn(active){ return {height:26, flex:'0 0 auto', padding:'0 10px', display:'inline-flex', alignItems:'center', border:'1px solid '+(active?'var(--ink)':'var(--rule)'), borderRadius:6, background:active?'var(--ink)':'transparent', color:active?'var(--paper)':'var(--muted)', cursor:'pointer', fontSize:'11px', fontWeight:500, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.02em', whiteSpace:'nowrap', transition:'border-color .12s, color .12s, background .12s'}; }

  // ---------- dashboard ----------
  renderDashboard(){
    const h=React.createElement; const {dashTab, dashView, dashPageIdx} = this.state;
    const all = (this.state.pages||[]).filter(p=>p.tab===dashTab && !p.archived);
    const per = dashView==='rows'?6:8; const pages=Math.ceil(all.length/per)||1; const slice=all.slice(dashPageIdx*per,(dashPageIdx+1)*per);
    return h('div',{className:'bso-scroll', style:{height:'100%', overflowY:'auto', background:'var(--paper)'}},
      h('div',{style:{maxWidth:1080, margin:'0 auto', padding:'40px 32px 64px'}},
        h('div',{style:{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16}},
          h('div',null,
            h('div',{style:this.mono({marginBottom:10})}, 'Workspace'),
            h('h1',{style:{margin:0, fontSize:'42px', fontWeight:700, letterSpacing:'-0.025em', lineHeight:1.05, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, 'Pages'),
            h('div',{style:{fontSize:'15px', color:'var(--muted)', marginTop:8}}, all.length+' pages · '+(dashTab==='bso'?'Backspace Oddity':'Community Sprints'))),
          h('div',{style:{display:'flex', gap:10, alignItems:'center'}},
            this.seg([{v:'rows',l:'Rows'},{v:'gallery',l:'Grid'}], dashView, v=>this.setState({dashView:v})),
            h('button',{onClick:()=>this.setState({newPageOpen:true, newPageStep:1, newPageArche:null, newPageName:''}), style:{padding:'9px 16px', border:'1px solid var(--ink)', borderRadius:8, background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'13.5px', fontWeight:600, fontFamily:'inherit'}}, 'New page from template'))),
        // tabs
        h('div',{style:{display:'flex', gap:24, borderBottom:'1px solid var(--rule)', marginBottom:24}},
          [['bso','BSO'],['community','Community Sprints']].map(([k,l])=> h('button',{key:k, onClick:()=>this.setState({dashTab:k, dashPageIdx:0}), style:{padding:'0 0 12px', background:'none', border:'none', borderBottom:'2px solid '+(dashTab===k?'var(--ink)':'transparent'), marginBottom:-1, cursor:'pointer', fontSize:'15px', fontWeight:dashTab===k?600:500, color:dashTab===k?'var(--ink)':'var(--muted)', fontFamily:'inherit'}}, l))),
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
          h('button',{onClick:e=>{e.stopPropagation(); this.openAnalytics(p);}, 'data-tip':'View analytics', title:'Analytics', style:{width:28, height:28, padding:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', cursor:'pointer'}}, this.rowIcon('analytics','currentColor')),
          h('button',{onClick:e=>{e.stopPropagation(); this.openDeploy(p);}, style:{padding:'6px 12px', borderRadius:6, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'11.5px', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap'}}, 'Deploy')))));
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
    const top=Math.max(64, Math.min(ht.top, (typeof window!=='undefined'?window.innerHeight:900)-220));
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
        h('div',{style:{display:'flex', gap:5}}, [['sections','Sections'],['layouts','Layouts'],['assets','Assets']].map(p=>{ const k=p[0]; const on=this.state.libTab===k; return h('button',{key:k, 'data-tip':p[1], title:p[1], onClick:()=>this.setState({libTab:k}), style:{flex:1, minWidth:0, height:30, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, border:'1px solid '+(on?'var(--ink)':'var(--rule)'), background:on?'var(--ink)':'transparent', cursor:'pointer', transition:'border-color .12s, background .12s'}}, this.libTabIcon(k,on)); }))),
      this.state.libTab==='assets' ? this.renderAssets()
      : this.state.libTab==='layouts' ? h('div',{style:{padding:'14px 16px'}},
          h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:12, lineHeight:1.4}}, 'Structure only, placeholder text — for designing freely. Drag onto the canvas.'),
          this.TEMPLATES.map(t=> this.libCard(t.type, t.name, t.desc, false, null, true)),
          this.renderAsk())
      : h('div',{style:{padding:'14px 16px'}},
          h('div',{style:{fontSize:'12px', color:'var(--muted)', marginBottom:12, lineHeight:1.4}}, 'Ready-made, with our copy. Drag onto the canvas or ask Claude.'),
          this.TEMPLATES.map(t=> this.libCard(t.type, t.name, t.desc, false)),
          this.state.customTemplates.length>0 && h('div',{style:this.mono({margin:'18px 2px 10px'})}, 'Locked by you'),
          this.state.customTemplates.map(t=> this.libCard(t.key, t.name, t.props.heading, true, t.bg)),
          this.renderAsk()));
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
    return h('div',{key:(blank?'blank-':'')+typeKey, draggable:true, title:desc,
        onDragStart:e=>{ this.setState({draggingType:(blank?'blank:':'')+typeKey}); e.dataTransfer.effectAllowed='copy'; },
        onDragEnd:()=>this.setState({draggingType:null, dropAt:null}),
        onClick:()=>{ this.insertAt(this.state.blocks.length, mk()); this.toast(name+' added'); },
        style:{border:'1px '+(blank?'dashed':'solid')+' var(--rule2)', borderRadius:7, padding:4, width:152, maxWidth:'100%', margin:'0 auto 8px', cursor:'grab', background:blank?'transparent':'var(--paper)', transition:'border-color .15s, transform .1s'},
        onMouseEnter:e=>{ e.currentTarget.style.borderColor='var(--ink)'; const r=e.currentTarget.getBoundingClientRect(); this.setState({hoverTpl:{type:isCustom?'custom':typeKey, name, desc, bg, top:r.top, left:r.right+12}}); },
        onMouseLeave:e=>{ e.currentTarget.style.borderColor='var(--rule2)'; this.setState({hoverTpl:null}); }},
      h('div',{style:{display:'flex', flexDirection:'column', gap:5}},
        this.miniPreview(isCustom?'custom':typeKey, bg, '100%', 90),
        h('div',{style:{fontSize:'11px', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', textAlign:'center', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, name)),
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
  renderAsk(){
    const h=React.createElement; const {askState, askResult, askPrompt}=this.state;
    return h('div',{style:{marginTop:16, border:'1px solid var(--rule2)', borderRadius:11, overflow:'hidden', background:'var(--paper)'}},
      h('div',{style:{padding:'12px 13px', borderBottom:'1px solid var(--rule)'}},
        h('div',{style:{display:'flex', alignItems:'center', gap:8}}, h('div',{style:{width:7,height:7,borderRadius:99,background:'var(--ink)'}}), h('div',{style:{fontSize:'13.5px', fontWeight:600, fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, 'Ask Claude for a new block')),
        h('div',{style:{fontSize:'11.5px', color:'var(--muted)', marginTop:5, lineHeight:1.35}}, 'Describe a section — Claude drafts it in the BSO voice.')),
      h('div',{style:{padding:'12px 13px'}},
        h('textarea',{value:askPrompt, onChange:e=>this.setState({askPrompt:e.target.value}), placeholder:'e.g. a pricing section with three plans, editorial tone', rows:3, style:{width:'100%', resize:'vertical', border:'1px solid var(--rule2)', borderRadius:8, padding:'9px 10px', fontFamily:'inherit', fontSize:'12.5px', background:'var(--surface)', color:'var(--ink)', lineHeight:1.4}}),
        h('button',{onClick:()=>this.askClaude(), disabled:askState==='thinking'||!askPrompt.trim(), style:{marginTop:8, width:'100%', padding:'9px', borderRadius:8, border:'none', background:'var(--ink)', color:'var(--paper)', cursor:askState==='thinking'?'default':'pointer', fontSize:'12.5px', fontWeight:600, fontFamily:'inherit', opacity:(!askPrompt.trim()&&askState!=='thinking')?0.5:1}},
          askState==='thinking' ? h('span',{style:{display:'inline-flex',alignItems:'center',gap:8}}, h('span',{style:{width:12,height:12,border:'2px solid var(--paper)',borderTopColor:'transparent',borderRadius:99,display:'inline-block',animation:'bsospin .7s linear infinite'}}), 'Drafting…') : 'Generate block'),
        askState==='ready' && askResult && h('div',{style:{marginTop:12, border:'1px solid var(--rule2)', borderRadius:9, overflow:'hidden'}},
          h('div',{style:{padding:'12px 12px', background:askResult.bg==='forest'?'#011C00':'var(--surface)', color:askResult.bg==='forest'?'#FDFBF4':'var(--ink)'}},
            h('div',{style:Object.assign(this.mono(),{color:askResult.bg==='forest'?'rgba(253,251,244,.6)':'var(--faint)', marginBottom:7})}, askResult.label),
            h('div',{style:{fontSize:'15px', fontWeight:600, lineHeight:1.2, letterSpacing:'-0.01em', fontFamily:"'ABC Schengen','Inter',system-ui,sans-serif"}}, askResult.heading),
            askResult.body && h('div',{style:{fontSize:'12.5px', marginTop:7, opacity:.8, lineHeight:1.45}}, askResult.body)),
          h('div',{style:{display:'flex', gap:7, padding:'9px'}},
            h('button',{onClick:()=>this.lockToLibrary(), style:{flex:1, padding:'8px', borderRadius:7, border:'1px solid var(--ink)', background:'var(--ink)', color:'var(--paper)', cursor:'pointer', fontSize:'11.5px', fontWeight:600, fontFamily:'inherit'}}, 'Lock & add to library'),
            h('button',{onClick:()=>this.addAskToCanvas(), style:{flex:1, padding:'8px', borderRadius:7, border:'1px solid var(--rule2)', background:'var(--surface)', color:'var(--ink)', cursor:'pointer', fontSize:'11.5px', fontWeight:500, fontFamily:'inherit'}}, 'Add to canvas')),
          h('button',{onClick:()=>this.setState({askState:'idle',askResult:null}), style:{width:'100%', padding:'7px', border:'none', borderTop:'1px solid var(--rule)', background:'transparent', color:'var(--faint)', cursor:'pointer', fontSize:'11px', fontFamily:'inherit'}}, 'Discard')))
    );
  }

  // ---------- canvas ----------
  renderCanvas(){
    const h=React.createElement; const pver=this.state.previewVersionId && this.state.versions.find(v=>v.id===this.state.previewVersionId);
    const blocks = pver && pver.blocks ? pver.blocks : this.state.blocks; const edit=this.state.editMode && !this.state.locked && !pver;
    return h('div',{className:'bso-scroll', ref:this.onCanvasRef, onClick:()=>{ if(edit) this.setState({selectedId:null, selectedRole:null}); },
      style:{flex:1, minWidth:0, overflowY:'auto', height:'100%', background:'var(--soft)', padding:'34px 0 120px'}},
      h('div',{style:{width:1160, margin:'0 auto', zoom:this.state.canvasZoom, background:'#F2F2F0', color:'#011C00', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow)', minHeight:300}},
        blocks.length===0 ? this.emptyCanvas() :
        h('div',{className:this.state.realPage?'page bt-page':undefined},
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
    const h=React.createElement; const active=this.state.dropAt===index && (this.state.draggingType||this.state.dragIndex!=null);
    return h('div',{onDragOver:e=>{e.preventDefault(); if(this.state.dropAt!==index) this.setState({dropAt:index});}, onDragLeave:()=>{ if(this.state.dropAt===index) this.setState({dropAt:null}); }, onDrop:e=>{e.preventDefault(); this.onDrop(index);},
      style:{height:active?34:8, transition:'height .12s', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:5}},
      active && h('div',{style:{height:3, background:'#011C00', width:'90%', borderRadius:99, position:'relative'}},
        h('div',{style:{position:'absolute', left:-1, top:-3.5, width:10, height:10, borderRadius:99, background:'#011C00'}})));
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
  }
  // Real-page section: render the actual bt- component, with inline text editing
  // and a light selection chrome. The outline never intercepts clicks (text stays
  // editable); the section tag is the selection handle; links don't navigate in edit.
  renderBtBlock(inst, index){
    const h=React.createElement; const Comp=BT_COMPONENTS[inst.type]; if(!Comp) return null;
    const edit=this.state.editMode && !this.state.locked && !this.state.previewVersionId;
    const sel=this.state.selectedId===inst.id;
    const dark=({'bt:hero':1,'bt:leverages':1,'bt:final':1})[inst.type];
    const line= dark?'rgba(253,251,244,.30)':'rgba(1,28,0,.12)';
    const tagBg= dark?'rgba(253,251,244,.16)':'rgba(1,28,0,.07)'; const tagFg= dark?'rgba(253,251,244,.78)':'rgba(1,28,0,.5)';
    const props=Object.assign({key:'c'}, inst.props);
    if(edit) props.e={on:true, set:(k,v)=>this.setBtText(inst.id,k,v)};
    return h('div',{style:{position:'relative'},
        onClickCapture: edit? (ev=>{ const t=ev.target; const a=t&&t.closest&&t.closest('a,button'); if(a) ev.preventDefault(); }) : undefined},
      h(Comp, props),
      edit && h('div',{key:'o', style:{position:'absolute', inset:0, zIndex:6, pointerEvents:'none', boxShadow:'inset 0 0 0 '+(sel?'2px #011C00':'1px '+line)}}),
      edit && h('div',{key:'t', onClick:e=>{e.stopPropagation(); this.selectBlock(inst.id);}, 'data-tip':'Select section', style:{position:'absolute', top:0, left:0, zIndex:8, cursor:'pointer', padding:'3px 8px', fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', background:tagBg, color:tagFg, borderBottomRightRadius:7}}, this.typeName(inst.type)),
      edit && sel && h('div',{key:'tb'}, this.blockToolbar(inst, index)));
  }
  renderBlock(inst, index){
    if(inst.type && inst.type.indexOf('bt:')===0) return this.renderBtBlock(inst, index);
    const h=React.createElement; const sel=this.state.selectedId===inst.id;
    const forest=inst.bg==='forest'; const fg= forest?'#FDFBF4':'#011C00';
    const bg = forest? '#011C00' : (inst.bg==='soft'?'#E8E8E6':'transparent');
    const edit=this.state.editMode && !this.state.locked && !this.state.previewVersionId;
    const wrapStyle={position:'relative', background:bg, color:fg, backgroundImage:(forest&&inst.type==='hero')?'url('+this.imgUrl(inst.props.img||'magenta-green')+')':'none', backgroundSize:'cover', backgroundPosition:'center', cursor:edit?'pointer':'default'};
    return h('div',Object.assign({onClick:e=>{ if(!edit) return; e.stopPropagation(); this.selectBlock(inst.id);}, style:wrapStyle}, inst.type==='hero'?this.imgDrop(v=>this.setBlockImg(inst.id,v)):{}),
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
      b('\u00d7', ()=>this.deleteBlock(inst.id), {t:'Delete'}));
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
    const inst=this.state.blocks.find(b=>b.id===this.state.selectedId);
    const role=this.state.selectedRole;
    return h('div',{className:'bso-scroll', style:Object.assign({width:this.state.tweaksW, flex:'0 0 '+this.state.tweaksW+'px', background:'var(--surface)', overflowY:'auto', height:'100%'}, border)},
      h('div',{style:{padding:'18px 18px 14px', position:'sticky', top:0, background:'var(--surface)', borderBottom:'1px solid var(--rule)', zIndex:2}},
        h('div',{style:{display:'flex', justifyContent:'space-between', alignItems:'center'}},
          h('div',{style:this.mono()}, 'Tweaks'),
          h('button',{onClick:()=>this.setState({tweaksOpen:false}), title:'Collapse', style:{background:'none',border:'none',cursor:'pointer',color:'var(--faint)',fontSize:'16px',padding:0,lineHeight:1}}, '\u00d7')),
        h('div',{style:{fontSize:'12.5px', color:'var(--muted)', marginTop:9}}, inst? (role? 'Editing '+this.roleName(role)+' style' : 'Section selected') : 'Bound to Backspace Oddity DS')),
      !inst ? this.tweaksEmpty() : this.tweaksBody(inst, role));
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
    const h=React.createElement; const {newPageArche, newPageName}=this.state;
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
  render(){ return React.createElement('div', {style:{height:'100vh', overflow:'hidden'}}, this.renderApp()); }

}

export default BuilderApp;
