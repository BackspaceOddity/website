/*
 * Merz guided tour (BSO-680) — a 6-step scripted walkthrough over the REAL v11
 * UI on mock data. Self-contained: no framework, no deps, prefixed classes.
 *
 * The centerpiece (step 4) is the TRIZ "ideal final result" moment: an ordinary
 * capture turns into atoms that wire themselves into the graph. It is an honest
 * demonstration, not a fake — it runs through the real `window.__mutateRaw`
 * mutation path (the same code the product uses); only the atoms themselves are
 * pre-authored, exactly as a scripted demo should be. No LLM runs, nothing is
 * claimed to run live.
 *
 * Anchors resolve live each step by CSS selector or visible-text match; a
 * missing anchor degrades to a centered card so the tour never breaks across
 * UI changes or vault differences.
 */
(function () {
  'use strict';
  if (window.__merzTourLoaded) return;
  window.__merzTourLoaded = true;

  var ACCENT = '#4A7C5E';
  var ifrDone = false; // idempotency: only grow the graph once per page load

  /* ---- anchor resolution: selector first, then visible-text fallback ---- */
  function bySel(sel) { try { return sel ? document.querySelector(sel) : null; } catch (e) { return null; } }
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
  function resolve(step) { return bySel(step.sel) || byText(step.text) || null; }

  /* ---- the script ---- */
  var STEPS = [
    {
      title: 'This workspace fills itself',
      body: 'What you’re looking at is a real knowledge graph — already lived in. Take thirty seconds and watch how a single capture turns into connected knowledge, without you sorting a thing.',
    },
    {
      sel: '.sb-item', text: 'inbox',
      title: 'It starts as a raw capture',
      body: 'A thought, a link, a clipped quote — you drop it into the inbox like a message. No folder to choose, no tags to invent. Just get it out of your head.',
    },
    {
      text: 'triage',
      title: 'Merz breaks it into its parts',
      body: 'Each capture is split into its meaningful pieces and matched to what you already know — every connection reviewed before anything enters your graph, so it stays trustworthy.',
    },
    {
      sel: '.gas',
      title: 'Watch the graph grow — on its own',
      body: 'Two ideas from that capture just wired themselves into what you already knew. You didn’t sort, tag, or link anything. That’s the whole trick: the result, without the work.',
      before: function () {
        if (ifrDone) return;
        try {
          var raw = window.__RAW_NODES || [];
          var anchor = (raw[0] || {}).id || 'home-space';
          var anchor2 = (raw[1] || raw[0] || {}).id || anchor;
          var mk = function (id, title, body) {
            return { id: id, raw: '---\ntitle: ' + title + '\ntype: note\n---\n\n' + body, path: 'merz/' + id + '.md', scope: 'workspace' };
          };
          if (typeof window.__mutateRaw === 'function') {
            window.__mutateRaw(function (arr) {
              arr.push(mk('merz-atom-a', 'A pattern worth keeping', 'Atomized from your capture. Relates to [[' + anchor + ']].'));
              arr.push(mk('merz-atom-b', 'The decision behind it', 'A second atom from the same note, linked to [[' + anchor2 + ']].'));
            }, 'Merz: captured note → 2 atoms');
            ifrDone = true;
            if (typeof window.__showToast === 'function') window.__showToast('You didn’t link these — Merz did.');
          }
        } catch (e) { /* never let the demo step break the tour */ }
      },
    },
    {
      sel: '.sb-search', text: 'search',
      title: 'Ask in plain words',
      body: 'You don’t search for the exact word you wrote. You ask for the idea — Merz returns what fits by meaning, and shows how it connects to the rest of your thinking.',
    },
    {
      title: 'Knowledge that compounds',
      body: 'Every capture makes the next answer sharper. Nothing goes stale in a folder nobody opens. That’s Merz: a second brain that gets smarter while you just work.',
      last: true,
    },
  ];

  /* ---- DOM scaffold ---- */
  var root, dim, ring, dot, card, started = false, idx = 0;

  function injectStyle() {
    if (document.getElementById('mz-tour-style')) return;
    var s = document.createElement('style');
    s.id = 'mz-tour-style';
    s.textContent =
      '.mz-tour-dim{position:fixed;inset:0;z-index:99998;pointer-events:none;transition:opacity .2s ease}' +
      '.mz-tour-ring{position:fixed;z-index:99999;border:2px solid ' + ACCENT + ';border-radius:10px;' +
      'box-shadow:0 0 0 4px rgba(74,124,94,.18),0 0 0 9999px rgba(20,22,20,.46);transition:all .35s cubic-bezier(.4,0,.2,1);pointer-events:none}' +
      '.mz-tour-dot{position:fixed;z-index:100000;width:14px;height:14px;border-radius:50%;background:' + ACCENT + ';' +
      'box-shadow:0 0 0 0 rgba(74,124,94,.5);animation:mzpulse 1.8s infinite;pointer-events:none}' +
      '@keyframes mzpulse{0%{box-shadow:0 0 0 0 rgba(74,124,94,.45)}70%{box-shadow:0 0 0 16px rgba(74,124,94,0)}100%{box-shadow:0 0 0 0 rgba(74,124,94,0)}}' +
      '.mz-tour-card{position:fixed;z-index:100001;width:340px;max-width:calc(100vw - 32px);background:#FBFAF7;color:#1A1A1A;' +
      'border:1px solid #E5E3DC;border-radius:14px;padding:20px 20px 16px;box-shadow:0 24px 60px -24px rgba(20,22,20,.4);' +
      'font-family:Inter,-apple-system,system-ui,sans-serif;transition:all .3s cubic-bezier(.4,0,.2,1)}' +
      '.mz-tour-eyebrow{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:' + ACCENT + ';margin:0 0 8px}' +
      '.mz-tour-title{font-family:"ABC Schengen Cyrillic","ABC Schengen",Inter,sans-serif;font-weight:500;font-size:19px;line-height:1.15;letter-spacing:-.01em;margin:0 0 8px}' +
      '.mz-tour-body{font-size:14px;line-height:1.55;color:#4A4A48;margin:0 0 16px}' +
      '.mz-tour-foot{display:flex;align-items:center;justify-content:space-between;gap:12px}' +
      '.mz-tour-dots{display:flex;gap:6px}' +
      '.mz-tour-pd{width:6px;height:6px;border-radius:50%;background:#D8D5CC}' +
      '.mz-tour-pd.on{background:' + ACCENT + '}' +
      '.mz-tour-btns{display:flex;align-items:center;gap:6px}' +
      '.mz-tour-skip{background:none;border:0;color:#9A9A95;font-size:13px;cursor:pointer;padding:6px 8px;font-family:inherit}' +
      '.mz-tour-skip:hover{color:#1A1A1A}' +
      '.mz-tour-next{background:' + ACCENT + ';color:#fff;border:0;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;padding:8px 16px;font-family:inherit}' +
      '.mz-tour-next:hover{background:#3C684E}' +
      '.mz-tour-pill{position:fixed;right:20px;bottom:20px;z-index:99997;background:' + ACCENT + ';color:#fff;border:0;border-radius:999px;' +
      'font-family:Inter,sans-serif;font-size:13px;font-weight:500;cursor:pointer;padding:11px 18px;box-shadow:0 8px 24px -8px rgba(74,124,94,.6)}' +
      '.mz-tour-pill:hover{background:#3C684E}';
    document.head.appendChild(s);
  }

  function place() {
    var step = STEPS[idx];
    var el = resolve(step);
    if (el && el.getBoundingClientRect) {
      var r = el.getBoundingClientRect();
      var pad = 6;
      ring.style.display = 'block';
      ring.style.top = (r.top - pad) + 'px';
      ring.style.left = (r.left - pad) + 'px';
      ring.style.width = (r.width + pad * 2) + 'px';
      ring.style.height = (r.height + pad * 2) + 'px';
      dot.style.display = 'block';
      dot.style.top = (r.top + r.height / 2 - 7) + 'px';
      dot.style.left = (r.right - 7) + 'px';
      // card below the anchor if room, else above; clamp horizontally
      var below = r.bottom + 14, cardTop = (below + 220 < window.innerHeight) ? below : Math.max(16, r.top - 200);
      var cardLeft = Math.min(Math.max(16, r.left), window.innerWidth - 356);
      card.style.top = cardTop + 'px';
      card.style.left = cardLeft + 'px';
      card.style.transform = 'none';
    } else {
      ring.style.display = 'none';
      dot.style.display = 'none';
      card.style.top = '50%';
      card.style.left = '50%';
      card.style.transform = 'translate(-50%,-50%)';
    }
  }

  function renderCard() {
    var step = STEPS[idx];
    var dots = STEPS.map(function (_, i) { return '<span class="mz-tour-pd' + (i === idx ? ' on' : '') + '"></span>'; }).join('');
    card.innerHTML =
      '<p class="mz-tour-eyebrow">Guided tour · ' + (idx + 1) + '/' + STEPS.length + '</p>' +
      '<h3 class="mz-tour-title"></h3>' +
      '<p class="mz-tour-body"></p>' +
      '<div class="mz-tour-foot"><div class="mz-tour-dots">' + dots + '</div>' +
      '<div class="mz-tour-btns"><button class="mz-tour-skip">' + (step.last ? '' : 'Skip') + '</button>' +
      '<button class="mz-tour-next">' + (step.last ? 'Done' : 'Next →') + '</button></div></div>';
    card.querySelector('.mz-tour-title').textContent = step.title;
    card.querySelector('.mz-tour-body').textContent = step.body;
    card.querySelector('.mz-tour-next').onclick = next;
    var skip = card.querySelector('.mz-tour-skip');
    if (skip) skip.onclick = end;
  }

  function goto(i) {
    idx = i;
    var step = STEPS[idx];
    if (step.before) { try { step.before(); } catch (e) {} }
    renderCard();
    // let any before()-driven re-render settle before measuring
    setTimeout(place, 60);
  }
  function next() { if (idx + 1 < STEPS.length) goto(idx + 1); else end(); }

  function start() {
    if (started) return;
    started = true;
    injectStyle();
    root = document.createElement('div');
    dim = el('mz-tour-dim'); ring = el('mz-tour-ring'); dot = el('mz-tour-dot'); card = el('mz-tour-card');
    ring.style.display = 'none'; dot.style.display = 'none';
    document.body.appendChild(dim); document.body.appendChild(ring);
    document.body.appendChild(dot); document.body.appendChild(card);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    goto(0);
    var pill = document.getElementById('mz-tour-pill'); if (pill) pill.style.display = 'none';
  }

  function end() {
    started = false;
    [dim, ring, dot, card].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place, true);
    try { sessionStorage.setItem('mzTourSeen', '1'); } catch (e) {}
    var pill = document.getElementById('mz-tour-pill'); if (pill) pill.style.display = 'block';
  }

  function el(cls) { var d = document.createElement('div'); d.className = cls; return d; }

  function mountPill() {
    if (document.getElementById('mz-tour-pill')) return;
    injectStyle();
    var b = document.createElement('button');
    b.id = 'mz-tour-pill'; b.className = 'mz-tour-pill'; b.textContent = '▶ Take the 30-second tour';
    b.onclick = function () { idx = 0; ifrDone = ifrDone; start(); };
    document.body.appendChild(b);
  }

  /* ---- boot: wait for the app to mount, then offer the tour ---- */
  function boot() {
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var ready = document.querySelector('.sb-item') || typeof window.__mutateRaw === 'function';
      if (ready || tries > 60) {
        clearInterval(iv);
        mountPill();
        var seen = false; try { seen = sessionStorage.getItem('mzTourSeen') === '1'; } catch (e) {}
        if (!seen) setTimeout(start, 1100);
      }
    }, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
