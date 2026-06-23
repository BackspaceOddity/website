// Diff engine — produces serializable patch payloads alongside in-memory
// mutations. See CONTEXT.md §14.3.
//
// Today the prototype mutates `__RAW_NODES` directly via `mutateRaw`. That's
// fine for a single-user demo, but when Claude Code becomes the writer the
// flow has to be:
//
//   user action ──► UI computes diff ──► optimistic mutateRaw (so the view
//                                        updates instantly)
//                       │
//                       └──► recordDiff(diff)  ──► queue ──► [Apply all]
//                                                            ↓
//                                                      Claude Code patches
//                                                      files on disk
//
// This module produces the diff. It does NOT mutate anything. The call site
// is responsible for applying the optimistic in-memory change AND for
// `recordDiff(diff)`. Keeping these two paths separate lets us swap the
// writer (in-memory → disk) without touching call sites.
//
// Diff shape (serializable, sendable to a CLI):
//
//   {
//     id: 'diff-<uuid>',          // queue key
//     kind: 'create' | 'edit',    // top-level intent (display label)
//     summary: 'Promote ¶ → idea-foo',   // human-readable, for UI list
//     create?: [{ path, content }],     // whole-file writes
//     edit?:   [{ path, search, replace }],  // string-replace patches
//                                            // search is verbatim; must
//                                            // appear exactly once in the
//                                            // current file content.
//     meta: { sourceId?, targetId?, kind, at }
//   }

(function () {
  let _seq = 0;
  function makeDiffId() {
    _seq += 1;
    return 'diff-' + Date.now().toString(36) + '-' + _seq.toString(36);
  }

  // For nodes loaded from a real path, `path` is set. For legacy/synthetic
  // nodes (`:legacy:<id>`) we don't have a real disk location yet — fall
  // back to a plausible BSO vault path so the diff is at least readable.
  // This will be replaced once 14.1 bridge is removed.
  function pathFor(node) {
    if (node && node.path && !node.path.startsWith(':legacy:')) return node.path;
    return 'data/' + (node && node.id ? node.id : 'untitled') + '.md';
  }

  // diffForCreateNode — promote-to-node, capture-approve, decision-approve.
  //   args: { id, content, sourceNode?, sourceSearch?, sourceReplace?, summary? }
  // If sourceNode + sourceSearch + sourceReplace are provided, the source
  // body is patched too (e.g. paragraph → wikilink).
  function diffForCreateNode(args) {
    const { id, content, sourceNode, sourceSearch, sourceReplace, summary } = args;
    const targetPath = 'data/' + id + '.md';
    const out = {
      id: makeDiffId(),
      kind: 'create',
      summary: summary || ('Create ' + id),
      create: [{ path: targetPath, content }],
      meta: { targetId: id, sourceId: sourceNode && sourceNode.id, kind: 'create', at: Date.now() },
    };
    if (sourceNode && sourceSearch && sourceReplace !== undefined) {
      out.edit = [{
        path: pathFor(sourceNode),
        search: sourceSearch,
        replace: sourceReplace,
      }];
    }
    return out;
  }

  // diffForEditRaw — inline rename, frontmatter patch, body edit.
  //   args: { node, oldRaw, newRaw, summary? }
  // Computes a minimal verbatim search/replace by trimming common
  // prefix/suffix lines. The result is human-readable in a diff viewer
  // (small hunks, not whole-file diffs).
  function diffForEditRaw(args) {
    const { node, oldRaw, newRaw, summary } = args;
    if (oldRaw === newRaw) return null;
    const { search, replace } = minimalReplace(oldRaw, newRaw);
    return {
      id: makeDiffId(),
      kind: 'edit',
      summary: summary || ('Edit ' + node.id),
      edit: [{ path: pathFor(node), search, replace }],
      meta: { targetId: node.id, kind: 'edit', at: Date.now() },
    };
  }

  // Trim shared prefix/suffix line ranges so the patch shows only the
  // changed hunk. Falls back to full-file if the match would be ambiguous.
  function minimalReplace(oldRaw, newRaw) {
    const oldLines = oldRaw.split('\n');
    const newLines = newRaw.split('\n');
    let pre = 0;
    while (pre < oldLines.length && pre < newLines.length && oldLines[pre] === newLines[pre]) pre++;
    let suf = 0;
    while (
      suf < (oldLines.length - pre) &&
      suf < (newLines.length - pre) &&
      oldLines[oldLines.length - 1 - suf] === newLines[newLines.length - 1 - suf]
    ) suf++;
    const oldHunk = oldLines.slice(pre, oldLines.length - suf).join('\n');
    const newHunk = newLines.slice(pre, newLines.length - suf).join('\n');
    // Verify uniqueness — if the hunk appears more than once in the source,
    // widen until unique (or fall back to full-file).
    if (oldHunk && countOccurrences(oldRaw, oldHunk) === 1) {
      return { search: oldHunk, replace: newHunk };
    }
    return { search: oldRaw, replace: newRaw };
  }

  function countOccurrences(haystack, needle) {
    if (!needle) return 0;
    let n = 0, i = 0;
    while ((i = haystack.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
    return n;
  }

  // ===== Queue =====
  // Append-only log of recorded diffs. UI subscribes via addDiffListener.
  const _queue = [];
  const _listeners = new Set();
  function recordDiff(diff) {
    if (!diff) return null;
    _queue.push(diff);
    _listeners.forEach(fn => { try { fn(_queue); } catch (e) { console.error(e); } });
    return diff;
  }
  function getDiffs() { return _queue.slice(); }
  function clearDiffs() {
    _queue.length = 0;
    _listeners.forEach(fn => { try { fn(_queue); } catch (e) { console.error(e); } });
  }
  function removeDiff(id) {
    const idx = _queue.findIndex(d => d.id === id);
    if (idx < 0) return;
    _queue.splice(idx, 1);
    _listeners.forEach(fn => { try { fn(_queue); } catch (e) { console.error(e); } });
  }
  function addDiffListener(fn) { _listeners.add(fn); return () => _listeners.delete(fn); }

  window.KOSDiff = {
    diffForCreateNode,
    diffForEditRaw,
    recordDiff,
    getDiffs,
    clearDiffs,
    removeDiff,
    addDiffListener,
    _internals: { minimalReplace, pathFor },
  };
})();
