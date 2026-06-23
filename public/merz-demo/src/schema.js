// Schema validation — §14.12.
//
// Surface non-fatal vault inconsistencies: type-required-key gaps,
// malformed wikilinks in relation slots, status-vocabulary typos,
// dangling typed-relation pointers.
//
// We deliberately do NOT warn about "unknown frontmatter keys" — real
// vaults accumulate dozens of one-off keys (tool slugs, source URLs,
// per-engagement metadata) and a literal whitelist would scream every
// time someone adds a new node. We warn only when something looks
// *wrong* (broken pointer, malformed link, value outside its enum).

(function () {
  // Required FM keys per type. These are advisory — missing keys produce
  // a warning, not an error.
  const REQUIRED_BY_TYPE = {
    decision:    ['status'],
    hypothesis:  ['status', 'confidence'],
    deal:        ['client', 'status'],
    project:     ['client'],
    initiative:  ['client'],
    meeting:     ['date'],
    person:      [],
    client:      [],
    methodology: ['status'],
    artifact:    [],
    learning:    [],
  };

  // Allowed status vocabulary, by type. Helps catch typos
  // (`status: actve`) without forcing consumers to use enums.
  const STATUS_BY_TYPE = {
    decision:    ['active', 'superseded', 'rejected', 'parked'],
    hypothesis:  ['testing', 'validated', 'rejected', 'superseded', 'parked'],
    deal:        ['lead', 'qualified', 'proposal', 'won', 'lost', 'paused', 'active', 'closed'],
    project:     ['active', 'paused', 'archived', 'complete'],
    initiative:  ['active', 'paused', 'archived', 'complete'],
    methodology: ['active', 'draft', 'archived'],
    client:      ['active', 'inactive', 'archived', 'lead'],
  };

  // Keys whose values must be wikilink-shaped strings (or arrays of them).
  const WIKILINK_KEYS = new Set([
    'client', 'project', 'deal', 'methodologies', 'used_methodologies',
    'deliverables', 'team', 'participants', 'builds_on', 'relates_to',
    'supersedes', 'full_text', 'promoted_from', 'hypotheses',
  ]);

  function isWikilink(s) {
    if (typeof s !== 'string') return false;
    return /^\[\[[^\[\]]+\]\]$/.test(s.trim());
  }

  // Same parser as toLinkId, kept inline so this module has zero deps.
  function extractIdFromWikilink(s) {
    if (typeof s !== 'string') return null;
    const m = s.trim().match(/^\[\[(.+?)(?:\|.+?)?\]\]$/);
    if (!m) return null;
    return m[1].replace(/^.*\//, '').trim();
  }

  // Validate a single node against the schema. Returns an array of
  // { kind, message } warnings (empty if clean).
  function validateNode(node, allNodes) {
    const out = [];
    const fm = node.fm || {};
    const type = node.type;

    // Required keys
    const required = REQUIRED_BY_TYPE[type] || [];
    for (const k of required) {
      if (fm[k] == null || fm[k] === '') {
        out.push({ kind: 'missing-required', key: k, message: `Missing \`${k}\`` });
      }
    }

    // Status vocabulary
    if (fm.status && STATUS_BY_TYPE[type]) {
      const allowed = STATUS_BY_TYPE[type];
      if (!allowed.includes(String(fm.status).toLowerCase())) {
        const fix = closestMatch(String(fm.status).toLowerCase(), allowed);
        out.push({
          kind: 'unknown-status',
          key: 'status',
          fixSuggestion: fix || undefined,
          message: `Status \`${fm.status}\` not in {${allowed.join(', ')}}`,
        });
      }
    }

    // Wikilink-shaped keys: each value should parse as [[id]] and resolve
    for (const k of Object.keys(fm)) {
      if (!WIKILINK_KEYS.has(k)) continue;
      const v = fm[k];
      const arr = Array.isArray(v) ? v : [v];
      for (const item of arr) {
        if (item == null || item === '') continue;
        if (!isWikilink(item)) {
          out.push({
            kind: 'malformed-wikilink',
            key: k,
            message: `\`${k}\` value is not a wikilink: ${JSON.stringify(item).slice(0, 60)}`,
          });
          continue;
        }
        const id = extractIdFromWikilink(item);
        if (id && allNodes && !allNodes[id]) {
          out.push({
            kind: 'dangling-relation',
            key: k,
            message: `\`${k}\` → [[${id}]] (no such node)`,
          });
        }
      }
    }

    // Confidence sanity (hypothesis only)
    if (type === 'hypothesis' && fm.confidence != null) {
      const c = Number(fm.confidence);
      if (Number.isNaN(c) || c < 0 || c > 1) {
        out.push({ kind: 'bad-confidence', key: 'confidence', message: `\`confidence\` should be 0..1, got ${fm.confidence}` });
      }
    }

    return out;
  }

  // Validate all nodes; return [{ id, title, type, warnings: [...] }, ...]
  // sorted by warning count desc.
  function validateAll(nodes) {
    const list = [];
    for (const id of Object.keys(nodes)) {
      const n = nodes[id];
      const warnings = validateNode(n, nodes);
      if (warnings.length) {
        list.push({ id, title: n.title, type: n.type, warnings });
      }
    }
    list.sort((a, b) => b.warnings.length - a.warnings.length || a.id.localeCompare(b.id));
    return list;
  }

  // Levenshtein-based "did you mean" — closest allowed value to user input.
  // Returns null when the closest is too far (≥ half length), to avoid
  // suggesting nonsense for a totally unrelated typo.
  function closestMatch(input, candidates) {
    if (!input || !candidates || !candidates.length) return null;
    const s = String(input).toLowerCase();
    let best = null;
    let bestD = Infinity;
    for (const c of candidates) {
      const d = lev(s, c);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (bestD > Math.max(2, Math.floor(s.length / 2))) return null;
    if (bestD === 0) return null;
    return best;
  }
  function lev(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const v0 = new Array(b.length + 1).fill(0).map((_, i) => i);
    const v1 = new Array(b.length + 1).fill(0);
    for (let i = 0; i < a.length; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < b.length; j++) {
        const cost = a.charCodeAt(i) === b.charCodeAt(j) ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
    }
    return v1[b.length];
  }

  // Get warnings for a single (node, fm-key) pair — used by node-view to
  // inline a ⚠ next to specific frontmatter fields. Wraps validateNode
  // and filters by `field` derived from the message ('`status`' → 'status').
  function warningsForField(node, allNodes, key) {
    const all = validateNode(node, allNodes);
    return all.filter(w => {
      if (w.kind === 'missing-required' && w.message.includes('`' + key + '`')) return true;
      if (w.kind === 'unknown-status' && key === 'status') return true;
      if (w.kind === 'malformed-wikilink' && w.message.startsWith('`' + key + '`')) return true;
      if (w.kind === 'dangling-relation' && w.message.startsWith('`' + key + '`')) return true;
      if (w.kind === 'bad-confidence' && key === 'confidence') return true;
      return false;
    });
  }

  window.KOSSchema = { validateNode, validateAll, warningsForField, closestMatch, REQUIRED_BY_TYPE, STATUS_BY_TYPE, WIKILINK_KEYS };
})();
