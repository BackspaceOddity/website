/*
 * Merz feature hotspots (BSO-680) — the whole prototype is marked with pulsing
 * round "buttons". Each sits on a real feature with a short label beside it;
 * clicking one pops a scenario card explaining what you can do / press there.
 *
 * Not a linear tour: all hotspots are visible at once and persist while you
 * explore. A toggle pill shows/hides them.
 *
 * The "it grows itself" hotspot carries an action button that runs the REAL
 * window.__mutateRaw mutation path (honest demonstration — only the atoms are
 * pre-authored; no model runs live, nothing claims to).
 *
 * Anchors resolve live by CSS selector or visible-text match and are re-scanned
 * on an interval, so hotspots follow the UI as you navigate between views and
 * simply disappear when their target isn't on screen.
 */
(function () {
  'use strict';
  if (window.__merzHotspotsLoaded) return;
  window.__merzHotspotsLoaded = true;

  var ACCENT = '#4A7C5E';
  var ifrDone = false;
  var shown = true;
  var openId = null;

  /* ---- the IFR demonstration (graph grows itself) ---- */
  function ifr(btn) {
    try {
      if (!ifrDone && typeof window.__mutateRaw === 'function') {
        var raw = window.__RAW_NODES || [];
        var a1 = (raw[0] || {}).id || 'home-space';
        var a2 = (raw[1] || raw[0] || {}).id || a1;
        var mk = function (id, title, body) {
          return { id: id, raw: '---\ntitle: ' + title + '\ntype: note\n---\n\n' + body, path: 'merz/' + id + '.md', scope: 'workspace' };
        };
        window.__mutateRaw(function (arr) {
          arr.push(mk('merz-atom-a', 'A pattern worth keeping', 'Atomized from your capture. Relates to [[' + a1 + ']].'));
          arr.push(mk('merz-atom-b', 'The decision behind it', 'A second atom from the same note, linked to [[' + a2 + ']].'));
        }, 'Merz: captured note → 2 atoms');
        ifrDone = true;
        if (typeof window.__showToast === 'function') window.__showToast('You didn’t link these — Merz did.');
      }
      if (btn) { btn.textContent = 'Done ✓ — two atoms wired in'; btn.disabled = true; btn.style.opacity = '.7'; }
    } catch (e) { /* never break on the demo step */ }
  }

  /* ---- the hotspots ---- */
  var SPOTS = [
    { id: 'inbox', text: 'inbox', sel: '.sb-item', label: 'Capture inbox',
      title: 'Capture inbox',
      body: 'Every raw thought, link or clipped quote lands here first — no folder to pick, no tags. Click “Inbox” in the sidebar to see what’s waiting.' },
    { id: 'triage', text: 'captures to triage', label: 'Review & promote',
      title: 'Review, then promote',
      body: 'Merz proposes how each capture breaks into atoms and connects. Hit “resolve in inbox →” to approve or edit before anything enters your graph.' },
    { id: 'search', text: 'search', sel: '.sb-search', label: 'Ask by meaning',
      title: 'Ask in plain words',
      body: 'Type a question the way you’d say it — “what did we decide about pricing?” Merz answers by meaning, not exact words, and cites the nodes it used.' },
    { id: 'grow', sel: '.gas', label: 'It grows itself',
      title: 'Watch the graph grow',
      body: 'A captured note becomes atoms that wire themselves into what you already know — you don’t sort or link anything. Press below and watch the count move.',
      action: { label: '▶ Capture a note', run: ifr } },
    { id: 'client', text: 'lumina', sel: '.sb-item', label: 'Open a workspace',
      title: 'Jump into a client',
      body: 'Each client, project or person is a node. Click one to open it, read its notes, and follow its connections out into the rest of the graph.' },
    { id: 'overall', text: 'overall', label: 'See the whole graph',
      title: 'Zoom out',
      body: 'Switch from “Today” to “Overall” to step back and see how everything connects — clusters, hubs, and the threads between them.' },
    { id: 'types', text: 'nodes by type', label: 'Browse by type',
      title: 'Browse by type',
      body: 'Projects, decisions, people, learnings — every atom has a type. Click a type to see everything of that kind across the whole graph at once.' },
  ];

  /* ---- anchor resolution ---- */
  function bySel(s) { try { return s ? document.querySelector(s) : null; } catch (e) { return null; } }
  function byText(needle) {
    if (!needle) return null;
    var all = document.querySelectorAll('a,button,li,div,span,h1,h2,h3');
    var best = null, bestLen = 1e9, t = needle.toLowerCase();
    for (var i = 0; i < all.length; i++) {
      var el = all[i], txt = (el.textContent || '').trim().toLowerCase();
      if (txt.indexOf(t) !== -1 && txt.length < bestLen && el.offsetParent !== null) { best = el; bestLen = txt.length; }
    }
    return best;
  }
  function resolve(spot) { return spot.text ? (byText(spot.text) || bySel(spot.sel)) : bySel(spot.sel); }
  function vw() { return window.innerWidth || document.documentElement.clientWidth || 9999; }
  function vh() { return window.innerHeight || document.documentElement.clientHeight || 9999; }
  function inView(r) { return r && r.bottom > 8 && r.top < vh() - 8 && r.right > 8 && r.left < vw() - 8; }

  /* ---- styles ---- */
  function injectStyle() {
    if (document.getElementById('mz-hs-style')) return;
    var s = document.createElement('style');
    s.id = 'mz-hs-style';
    s.textContent =
      '.mz-hs{position:fixed;z-index:99990;display:flex;align-items:center;gap:8px;pointer-events:none;transition:top .25s ease,left .25s ease}' +
      '.mz-hs-dot{width:18px;height:18px;border-radius:50%;background:' + ACCENT + ';cursor:pointer;pointer-events:auto;flex:none;' +
      'box-shadow:0 0 0 0 rgba(74,124,94,.5),0 2px 6px rgba(0,0,0,.18);animation:mzhp 1.9s infinite;border:2px solid #fff}' +
      '.mz-hs-dot:hover{transform:scale(1.18)}' +
      '@keyframes mzhp{0%{box-shadow:0 0 0 0 rgba(74,124,94,.5),0 2px 6px rgba(0,0,0,.18)}70%{box-shadow:0 0 0 13px rgba(74,124,94,0),0 2px 6px rgba(0,0,0,.18)}100%{box-shadow:0 0 0 0 rgba(74,124,94,0),0 2px 6px rgba(0,0,0,.18)}}' +
      '.mz-hs-lbl{pointer-events:auto;cursor:pointer;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.04em;' +
      'background:rgba(251,250,247,.95);color:#1A1A1A;border:1px solid #E5E3DC;border-radius:999px;padding:3px 10px;white-space:nowrap;' +
      'box-shadow:0 2px 8px -3px rgba(20,22,20,.25)}' +
      '.mz-hs.left{flex-direction:row-reverse}' +
      '.mz-hs-pop{position:fixed;z-index:99996;width:320px;max-width:calc(100vw - 24px);background:#FBFAF7;color:#1A1A1A;' +
      'border:1px solid #E5E3DC;border-radius:14px;padding:18px 18px 16px;box-shadow:0 24px 60px -24px rgba(20,22,20,.45);' +
      'font-family:Inter,-apple-system,system-ui,sans-serif}' +
      '.mz-hs-pop h4{font-family:"ABC Schengen Cyrillic","ABC Schengen",Inter,sans-serif;font-weight:500;font-size:17px;line-height:1.2;letter-spacing:-.01em;margin:0 0 7px}' +
      '.mz-hs-pop p{font-size:13.5px;line-height:1.55;color:#4A4A48;margin:0}' +
      '.mz-hs-pop .mz-hs-eye{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:' + ACCENT + ';margin:0 0 6px}' +
      '.mz-hs-pop .mz-hs-act{margin-top:14px;background:' + ACCENT + ';color:#fff;border:0;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;padding:9px 16px;font-family:inherit}' +
      '.mz-hs-pop .mz-hs-act:hover{background:#3C684E}' +
      '.mz-hs-pop .mz-hs-x{position:absolute;top:10px;right:12px;border:0;background:none;color:#9A9A95;font-size:18px;cursor:pointer;line-height:1}' +
      '.mz-hs-pop .mz-hs-x:hover{color:#1A1A1A}' +
      '.mz-hs-toggle{position:fixed;right:20px;bottom:20px;z-index:99995;background:' + ACCENT + ';color:#fff;border:0;border-radius:999px;' +
      'font-family:Inter,sans-serif;font-size:13px;font-weight:500;cursor:pointer;padding:11px 18px;box-shadow:0 8px 24px -8px rgba(74,124,94,.6);display:flex;align-items:center;gap:8px}' +
      '.mz-hs-toggle:hover{background:#3C684E}' +
      '.mz-hs-toggle .mz-hs-tdot{width:8px;height:8px;border-radius:50%;background:#fff;animation:mzhp2 1.9s infinite}' +
      '@keyframes mzhp2{0%,100%{opacity:1}50%{opacity:.4}}';
    document.head.appendChild(s);
  }

  /* ---- DOM ---- */
  var layerBuilt = false, pop = null, toggle = null;
  function el(tag, cls) { var d = document.createElement(tag); if (cls) d.className = cls; return d; }

  function build() {
    if (layerBuilt) return;
    layerBuilt = true;
    injectStyle();
    SPOTS.forEach(function (spot) {
      var wrap = el('div', 'mz-hs'); wrap.style.display = 'none';
      var dot = el('div', 'mz-hs-dot');
      var lbl = el('div', 'mz-hs-lbl'); lbl.textContent = spot.label;
      wrap.appendChild(dot); wrap.appendChild(lbl);
      var open = function (e) { e.stopPropagation(); openPop(spot, dot); };
      dot.onclick = open; lbl.onclick = open;
      spot._wrap = wrap; document.body.appendChild(wrap);
    });
    toggle = el('button', 'mz-hs-toggle');
    toggle.innerHTML = '<span class="mz-hs-tdot"></span>Explore features';
    toggle.onclick = function () { shown = !shown; if (shown) SPOTS.forEach(function (s) { s._dismissed = false; }); else closePop(); sync(); toggle.childNodes[1].nodeValue = shown ? 'Hide hotspots' : 'Explore features'; };
    document.body.appendChild(toggle);
    document.addEventListener('click', function () { closePop(); });
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    setInterval(sync, 500);
  }

  function sync() {
    if (!layerBuilt) return;
    SPOTS.forEach(function (spot) {
      var w = spot._wrap; if (!w) return;
      if (!shown || spot._dismissed) { w.style.display = 'none'; return; }
      var anchor = resolve(spot);
      var r = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
      if (r && inView(r)) {
        var labelRight = r.right + 200 > vw(); // flip label to the left near screen edge
        w.classList.toggle('left', labelRight);
        w.style.display = 'flex';
        w.style.top = (r.top + r.height / 2 - 9) + 'px';
        w.style.left = labelRight ? 'auto' : (r.right - 9) + 'px';
        w.style.right = labelRight ? (vw() - r.left - 9) + 'px' : 'auto';
        spot._dotX = labelRight ? r.left : r.right;
        spot._dotY = r.top + r.height / 2;
      } else { w.style.display = 'none'; if (openId === spot.id) closePop(); }
    });
    if (openId) positionPop();
  }

  function openPop(spot, dot) {
    closePop();
    openId = spot.id;
    pop = el('div', 'mz-hs-pop');
    pop.onclick = function (e) { e.stopPropagation(); };
    var html = '<button class="mz-hs-x">×</button><p class="mz-hs-eye">Feature</p><h4></h4><p class="mz-hs-body"></p>';
    pop.innerHTML = html;
    pop.querySelector('h4').textContent = spot.title;
    pop.querySelector('.mz-hs-body').textContent = spot.body;
    // × dismisses the whole hotspot (dot + label), so the user can clear the
    // marks one by one and then play with a clean UI. Clicking outside just
    // closes the card and leaves the dot in place.
    pop.querySelector('.mz-hs-x').onclick = function (e) { e.stopPropagation(); spot._dismissed = true; if (spot._wrap) spot._wrap.style.display = 'none'; closePop(); };
    if (spot.action) {
      var b = el('button', 'mz-hs-act'); b.textContent = spot.action.label;
      b.onclick = function (e) { e.stopPropagation(); spot.action.run(b); };
      pop.appendChild(b);
    }
    document.body.appendChild(pop);
    positionPop();
  }
  function positionPop() {
    if (!pop || !openId) return;
    var spot = SPOTS.filter(function (s) { return s.id === openId; })[0];
    if (!spot || spot._dotX == null) return;
    var pr = pop.getBoundingClientRect();
    var top = spot._dotY + 16, left = spot._dotX - 20;
    if (top + pr.height > vh() - 12) top = Math.max(12, spot._dotY - pr.height - 16);
    left = Math.min(Math.max(12, left), vw() - pr.width - 12);
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
  }
  function closePop() { if (pop && pop.parentNode) pop.parentNode.removeChild(pop); pop = null; openId = null; }

  /* ---- boot ---- */
  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (document.querySelector('.sb-item') || typeof window.__mutateRaw === 'function' || tries > 60) {
        clearInterval(iv); build(); sync();
      }
    }, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
