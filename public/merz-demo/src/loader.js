// Loader — turns Claude-Code-style FS reads `[{path, content}]` into the
// `[{id, raw, path, scope}]` shape the rest of the app consumes.
//
// Single source of truth for ID resolution. Today's data/nodes.v2.js is
// already in `[{id, raw}]` form (no path), so we run it through the same
// loader with a synthetic `:legacy:<id>` path — that way every node has a
// path field downstream and the prototype's data layer matches what the
// real loader will produce against the user's vault.
//
// Once Claude Code is wired in, the call site becomes:
//   const fsReads = await readDir('~/Cursor/Home space/Backspace Oddity/');
//   window.__RAW_NODES = window.KOSLoader.loadNodes(fsReads);
// — no other changes needed; parser/buildGraph already accept {id, raw}.

(function () {
  const PERSONAL_PATH_PREFIXES = [
    'personal/', 'private/', 'journal/', 'diary/',
    // Vaults the user explicitly marks as personal — anything outside the
    // BSO root is personal by default per the 2026-04-21 decision.
  ];

  function loadNodes(reads, opts) {
    opts = opts || {};
    const workRoot = (opts.workRoot || '').replace(/\/+$/, '');
    const out = [];
    const seenIds = new Set();
    const errors = [];

    for (const read of reads) {
      const path = read.path || '';
      const raw = read.content != null ? read.content : (read.raw || '');
      if (!raw) {
        errors.push({ path, kind: 'empty', message: 'empty content' });
        continue;
      }
      const fmId = peekFrontmatterId(raw);
      const baseId = fmId || slugFromPath(path) || hashId(raw);
      const id = uniquify(baseId, seenIds);
      seenIds.add(id);

      const scope = inferScope(path, raw, workRoot);

      out.push({
        id,
        raw,
        path: path || (':legacy:' + id),
        scope,
        // `_fmId` flag — was the id self-declared in frontmatter? If not,
        // a future edit that changes the filename would also change the id;
        // useful info for the diff engine when it decides "rename file vs
        // patch frontmatter".
        _idSource: fmId ? 'frontmatter' : (slugFromPath(path) ? 'filename' : 'hash'),
      });
    }

    return { nodes: out, errors };
  }

  // Cheap pre-parser — pulls just the `id:` line out of frontmatter without
  // running the full YAML parser. Avoids a circular dep with parser.jsx.
  function peekFrontmatterId(raw) {
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) return null;
    const idLine = m[1].match(/^[ \t]*id\s*:\s*(.+)$/m);
    if (!idLine) return null;
    let v = idLine[1].trim();
    // Strip optional quotes.
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    // Strip trailing comment.
    v = v.replace(/\s+#.*$/, '').trim();
    return v || null;
  }

  function slugFromPath(path) {
    if (!path) return null;
    const base = path.split('/').pop() || '';
    const noExt = base.replace(/\.(md|markdown|mdx)$/i, '');
    if (!noExt) return null;
    return noExt
      .toLowerCase()
      .replace(/['"`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || null;
  }

  // Stable djb2 over content — used only when there's neither frontmatter id
  // nor a usable filename. Prefixed so it can never collide with a real id.
  function hashId(raw) {
    let h = 5381;
    for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) | 0;
    return 'node-' + (h >>> 0).toString(36);
  }

  function uniquify(id, seen) {
    if (!seen.has(id)) return id;
    let i = 2;
    while (seen.has(id + '-' + i)) i++;
    return id + '-' + i;
  }

  // Personal-by-default outside the work root. The exact policy is fluid
  // (see CONTEXT.md §14.2) — we keep it isolated here so it can change
  // without touching consumer code.
  function inferScope(path, raw, workRoot) {
    // Frontmatter override always wins — even for legacy/synthetic paths,
    // personal-scope.js nodes carry explicit `scope: personal` / `private: true`
    // and must keep their tag through normalizeLegacyRaw.
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (m) {
      const yaml = m[1];
      if (/^[ \t]*scope\s*:\s*personal\b/m.test(yaml)) return 'personal';
      if (/^[ \t]*private\s*:\s*(true|yes)\b/im.test(yaml)) return 'personal';
    }
    if (!path || path.startsWith(':legacy:')) return 'work';
    if (workRoot && path.startsWith(workRoot + '/')) return 'work';
    const lower = path.toLowerCase();
    for (const pref of PERSONAL_PATH_PREFIXES) {
      if (lower.startsWith(pref) || lower.includes('/' + pref)) return 'personal';
    }
    return 'work';
  }

  // Convenience: rebuild __RAW_NODES from a `[{path, content}]` array. The
  // current entry point in Knowledge OS.html is `data/nodes.v2.js` (which
  // sets `window.__RAW_NODES = [{id, raw}]` directly) — that file gets
  // rewritten to call this function once the migration lands. For now we
  // keep both paths working.
  function installFromReads(reads, opts) {
    const { nodes, errors } = loadNodes(reads, opts);
    window.__RAW_NODES = nodes;
    if (errors.length) {
      console.warn('[KOSLoader] errors during load:', errors);
    }
    return { nodes, errors };
  }

  // If a previous load step left a legacy `[{id, raw}]` array on
  // window.__RAW_NODES (current case for nodes.v2.js), normalize it in-place
  // so every node has `path` and `scope`. Idempotent.
  function normalizeLegacyRaw() {
    const arr = window.__RAW_NODES;
    if (!Array.isArray(arr) || !arr.length) return;
    if (arr[0].path && arr[0].scope) return; // already normalized
    const reads = arr.map(n => ({
      path: n.path || (':legacy:' + n.id),
      content: n.raw,
    }));
    const { nodes } = loadNodes(reads);
    // Preserve any `scope` already set on the legacy entry (personal-scope.js
    // injects nodes with explicit `scope: 'personal'` already).
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].scope) nodes[i].scope = arr[i].scope;
    }
    window.__RAW_NODES = nodes;
  }

  window.KOSLoader = {
    loadNodes,
    installFromReads,
    normalizeLegacyRaw,
    // Exposed for tests & for the diff engine (14.3) which needs the same
    // slug rules to compute target paths for newly-created nodes.
    _internals: { peekFrontmatterId, slugFromPath, hashId, inferScope },
  };
})();
