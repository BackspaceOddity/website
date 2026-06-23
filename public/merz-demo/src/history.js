// History stack for mutateRaw — §14.11 Undo/redo.
//
// Snapshots the entire __RAW_NODES array before/after each mutation.
// Cheap because raw entries are short markdown strings — a 1k-node vault
// is ~2MB per snapshot and we cap history at HISTORY_CAP entries.
//
// Cmd-Z pops `_undo`, restores the "before" snapshot, pushes onto `_redo`.
// Cmd-Shift-Z does the opposite. Any new mutation clears the redo stack.
//
// The mutation source records a label (e.g. "Promote ¶ → idea-foo") so
// the toast / status bar can show what just got reverted.

(function () {
  const HISTORY_CAP = 50;
  const _undo = [];
  const _redo = [];
  const _listeners = new Set();

  function snapshot() {
    // Deep clone — entries are { id, raw, path? } — strings only, so JSON
    // round-trip is correct and fast.
    return JSON.parse(JSON.stringify(window.__RAW_NODES || []));
  }

  function notify() {
    const state = { canUndo: _undo.length > 0, canRedo: _redo.length > 0,
      lastUndoLabel: _undo.length ? _undo[_undo.length - 1].label : null,
      lastRedoLabel: _redo.length ? _redo[_redo.length - 1].label : null };
    _listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
  }

  function record(label, beforeSnap) {
    _undo.push({ label: label || 'Edit', before: beforeSnap, after: snapshot() });
    if (_undo.length > HISTORY_CAP) _undo.shift();
    _redo.length = 0;
    notify();
  }

  function undo(applyRaw) {
    const entry = _undo.pop();
    if (!entry) return null;
    _redo.push(entry);
    applyRaw(entry.before);
    notify();
    return entry.label;
  }

  function redo(applyRaw) {
    const entry = _redo.pop();
    if (!entry) return null;
    _undo.push(entry);
    applyRaw(entry.after);
    notify();
    return entry.label;
  }

  function addListener(fn) { _listeners.add(fn); fn({
    canUndo: _undo.length > 0, canRedo: _redo.length > 0,
    lastUndoLabel: _undo.length ? _undo[_undo.length - 1].label : null,
    lastRedoLabel: _redo.length ? _redo[_redo.length - 1].label : null,
  }); return () => _listeners.delete(fn); }

  function getState() {
    return {
      canUndo: _undo.length > 0, canRedo: _redo.length > 0,
      undoCount: _undo.length, redoCount: _redo.length,
      lastUndoLabel: _undo.length ? _undo[_undo.length - 1].label : null,
      lastRedoLabel: _redo.length ? _redo[_redo.length - 1].label : null,
    };
  }

  window.KOSHistory = { snapshot, record, undo, redo, addListener, getState };
})();
