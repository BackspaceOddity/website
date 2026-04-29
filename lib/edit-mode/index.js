'use client';

// src/context.tsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var EditModeContext = createContext(null);
function EditModeProvider({ children, basePath = "", apiPath = "/api/save-draft" }) {
  const [mode, setMode] = useState("off");
  const [threads, setThreads] = useState({});
  const [activePopupId, setActivePopupId] = useState(null);
  const [visualEdits, setVisualEdits] = useState([]);
  const isEditing = mode === "text";
  const isVisualMode = mode === "visual";
  const apiUrl = `${basePath}${apiPath}`;
  useEffect(() => {
    fetch(apiUrl).then((r) => r.ok ? r.json() : null).then((data) => {
      if (data?.threads) setThreads(data.threads);
    }).catch(() => {
    });
  }, [apiUrl]);
  const toggleTextMode = useCallback(() => setMode((m) => m === "text" ? "off" : "text"), []);
  const toggleVisualMode = useCallback(() => {
    setMode((m) => m === "visual" ? "off" : "visual");
    setActivePopupId(null);
  }, []);
  const openPopup = useCallback((id, sourceText) => {
    setThreads((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: { id, sourceText, activeText: sourceText, variants: [], archived: [], status: "open" } };
    });
    setActivePopupId(id);
  }, []);
  const closePopup = useCallback(() => setActivePopupId(null), []);
  const addVariant = useCallback((id, text) => {
    setThreads((prev) => {
      const t = prev[id];
      if (!t) return prev;
      return { ...prev, [id]: { ...t, variants: [...t.variants, text.trim()] } };
    });
  }, []);
  const swapVariant = useCallback((id, variantIndex) => {
    setThreads((prev) => {
      const t = prev[id];
      if (!t) return prev;
      const newVariants = [...t.variants];
      const swappedText = newVariants.splice(variantIndex, 1)[0];
      if (t.activeText !== t.sourceText) newVariants.push(t.activeText);
      return { ...prev, [id]: { ...t, activeText: swappedText, variants: newVariants } };
    });
  }, []);
  const swapSource = useCallback((id) => {
    setThreads((prev) => {
      const t = prev[id];
      if (!t || t.activeText === t.sourceText) return prev;
      return { ...prev, [id]: { ...t, activeText: t.sourceText, variants: [...t.variants, t.activeText] } };
    });
  }, []);
  const approveThread = useCallback((id) => {
    setThreads((prev) => {
      const t = prev[id];
      if (!t) return prev;
      return { ...prev, [id]: { ...t, status: "approved", archived: [...t.archived, ...t.variants], variants: [] } };
    });
    setActivePopupId(null);
  }, []);
  const reopenThread = useCallback((id) => {
    setThreads((prev) => {
      const t = prev[id];
      if (!t) return prev;
      return { ...prev, [id]: { ...t, status: "open", variants: [...t.archived], archived: [] } };
    });
  }, []);
  const removeVariant = useCallback((id, variantIndex) => {
    setThreads((prev) => {
      const t = prev[id];
      if (!t) return prev;
      return { ...prev, [id]: { ...t, variants: t.variants.filter((_, i) => i !== variantIndex) } };
    });
  }, []);
  const getActiveText = useCallback((id, sourceText) => {
    const t = threads[id];
    return t ? t.activeText : sourceText;
  }, [threads]);
  const pendingCount = Object.values(threads).filter((t) => t.status === "open" && (t.variants.length > 0 || t.activeText !== t.sourceText)).length;
  const approvedCount = Object.values(threads).filter((t) => t.status === "approved").length;
  const addVisualEdit = useCallback((edit) => {
    const request = {
      id: `ve-${Date.now()}`,
      ...edit,
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setVisualEdits((prev) => [...prev, request]);
  }, []);
  const removeVisualEdit = useCallback((id) => {
    setVisualEdits((prev) => prev.filter((e) => e.id !== id));
  }, []);
  const updateVisualEdit = useCallback((id, prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setVisualEdits((prev) => prev.map((e) => e.id === id ? { ...e, prompt: trimmed } : e));
  }, []);
  const saveAll = useCallback(async () => {
    const payload = { threads, visualEdits };
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setVisualEdits([]);
        return true;
      }
      return false;
    } catch {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      return false;
    }
  }, [threads, visualEdits, apiUrl]);
  return /* @__PURE__ */ jsx(EditModeContext.Provider, { value: {
    mode,
    isEditing,
    isVisualMode,
    toggleTextMode,
    toggleVisualMode,
    threads,
    activePopupId,
    openPopup,
    closePopup,
    addVariant,
    swapVariant,
    swapSource,
    approveThread,
    reopenThread,
    removeVariant,
    getActiveText,
    pendingCount,
    approvedCount,
    visualEdits,
    addVisualEdit,
    removeVisualEdit,
    updateVisualEdit,
    saveAll
  }, children });
}
function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used within EditModeProvider");
  return ctx;
}

// src/EditableText.tsx
import { useRef as useRef2 } from "react";

// src/ThreadPopup.tsx
import { useState as useState2, useEffect as useEffect2, useRef } from "react";
import { createPortal } from "react-dom";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function ThreadPopup({ anchorEl, threadId, sourceText }) {
  const {
    threads,
    closePopup,
    addVariant,
    swapVariant,
    swapSource,
    approveThread,
    reopenThread,
    removeVariant
  } = useEditMode();
  const thread = threads[threadId];
  const [inputText, setInputText] = useState2("");
  const [showArchived, setShowArchived] = useState2(false);
  const [pos, setPos] = useState2({ top: 0, left: 0 });
  const popupRef = useRef(null);
  const inputRef = useRef(null);
  useEffect2(() => {
    const rect = anchorEl.getBoundingClientRect();
    const popupWidth = 400;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow > 300 ? rect.bottom + 8 : Math.max(16, rect.top - 400);
    const left = Math.min(Math.max(16, rect.left), window.innerWidth - popupWidth - 16);
    setPos({ top, left });
  }, [anchorEl]);
  useEffect2(() => {
    const handler = (e) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closePopup]);
  useEffect2(() => {
    let active = true;
    const handler = (e) => {
      if (!active) return;
      if (popupRef.current && !popupRef.current.contains(e.target) && !anchorEl.contains(e.target)) {
        closePopup();
      }
    };
    const timer = setTimeout(() => window.addEventListener("mousedown", handler), 10);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener("mousedown", handler);
    };
  }, [closePopup, anchorEl]);
  if (!thread) return null;
  const isActiveSource = thread.activeText === thread.sourceText;
  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    addVariant(threadId, trimmed);
    setInputText("");
    inputRef.current?.focus();
  };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6b7280"
  };
  const swapBtnStyle = {
    background: "#f3f4f6",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    padding: "3px 8px",
    fontSize: 12,
    color: "#4b5563",
    display: "flex",
    alignItems: "center",
    gap: 4
  };
  const removeBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#d1d5db",
    fontSize: 14,
    padding: "2px 4px",
    lineHeight: 1
  };
  const rowStyle = { padding: "12px 16px", borderBottom: "1px solid #f3f4f6" };
  const rowHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  };
  const textStyle = { margin: 0, lineHeight: 1.5 };
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: popupRef,
        style: {
          position: "fixed",
          top: pos.top,
          left: pos.left,
          zIndex: 1e4,
          width: 400,
          maxHeight: "70vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 12px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 14,
          color: "#1f2937"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "14px 16px 10px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }, children: [
            /* @__PURE__ */ jsx2("span", { style: { fontWeight: 600, fontSize: 13 }, children: thread.status === "approved" ? "\u2705 Approved" : "Text variants" }),
            /* @__PURE__ */ jsx2("button", { onClick: closePopup, style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: 16,
              padding: "2px 6px"
            }, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: rowStyle, children: [
            /* @__PURE__ */ jsxs("div", { style: rowHeader, children: [
              /* @__PURE__ */ jsx2("span", { style: labelStyle, children: "Current ver." }),
              !isActiveSource && /* @__PURE__ */ jsx2("button", { onClick: () => swapSource(threadId), title: "Swap source back", style: swapBtnStyle, children: "\u2190\u2192" })
            ] }),
            /* @__PURE__ */ jsxs("p", { style: {
              ...textStyle,
              color: isActiveSource ? "#111827" : "#9ca3af",
              fontWeight: isActiveSource ? 500 : 400
            }, children: [
              thread.sourceText,
              isActiveSource && /* @__PURE__ */ jsx2("span", { style: { marginLeft: 8, fontSize: 11, color: "#22c55e", fontWeight: 600 }, children: "\u25CF Active" })
            ] })
          ] }),
          !isActiveSource && /* @__PURE__ */ jsxs("div", { style: { ...rowStyle, background: "#f0fdf4" }, children: [
            /* @__PURE__ */ jsx2("div", { style: rowHeader, children: /* @__PURE__ */ jsx2("span", { style: { ...labelStyle, color: "#16a34a" }, children: "\u25CF Active on page" }) }),
            /* @__PURE__ */ jsx2("p", { style: { ...textStyle, fontWeight: 500 }, children: thread.activeText })
          ] }),
          thread.variants.map((variant, i) => /* @__PURE__ */ jsxs("div", { style: rowStyle, children: [
            /* @__PURE__ */ jsxs("div", { style: rowHeader, children: [
              /* @__PURE__ */ jsxs("span", { style: labelStyle, children: [
                "Option ",
                i + 1
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4 }, children: [
                /* @__PURE__ */ jsx2("button", { onClick: () => swapVariant(threadId, i), title: "Use this on page", style: swapBtnStyle, children: "\u2190\u2192" }),
                /* @__PURE__ */ jsx2("button", { onClick: () => removeVariant(threadId, i), title: "Remove", style: removeBtnStyle, children: "\u2715" })
              ] })
            ] }),
            /* @__PURE__ */ jsx2("p", { style: textStyle, children: variant })
          ] }, i)),
          thread.archived.length > 0 && /* @__PURE__ */ jsxs("div", { style: { padding: "8px 16px", borderBottom: "1px solid #f3f4f6" }, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowArchived((v) => !v),
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: 12,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                },
                children: [
                  showArchived ? "\u25BE" : "\u25B8",
                  " Archived (",
                  thread.archived.length,
                  ")"
                ]
              }
            ),
            showArchived && thread.archived.map((text, i) => /* @__PURE__ */ jsx2("div", { style: {
              padding: "8px 0",
              color: "#9ca3af",
              fontSize: 13,
              borderBottom: i < thread.archived.length - 1 ? "1px solid #f9fafb" : "none"
            }, children: text }, i))
          ] }),
          thread.status === "open" && /* @__PURE__ */ jsx2("div", { style: rowStyle, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsx2(
              "input",
              {
                ref: inputRef,
                value: inputText,
                onChange: (e) => setInputText(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleAdd();
                },
                placeholder: "Add a variant\u2026",
                style: {
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: 13,
                  background: "#f9fafb"
                },
                onFocus: (e) => {
                  e.currentTarget.style.borderColor = "#93c5fd";
                },
                onBlur: (e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }
              }
            ),
            /* @__PURE__ */ jsx2(
              "button",
              {
                onClick: handleAdd,
                disabled: !inputText.trim(),
                style: {
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: inputText.trim() ? "#3b82f6" : "#e5e7eb",
                  color: inputText.trim() ? "#fff" : "#9ca3af",
                  cursor: inputText.trim() ? "pointer" : "not-allowed",
                  fontSize: 13,
                  fontWeight: 600
                },
                children: "Add"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx2("div", { style: { padding: "12px 16px" }, children: thread.status === "open" ? /* @__PURE__ */ jsx2(
            "button",
            {
              onClick: () => approveThread(threadId),
              disabled: thread.activeText === thread.sourceText && thread.variants.length === 0,
              style: {
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "none",
                background: "#22c55e",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                opacity: thread.activeText === thread.sourceText && thread.variants.length === 0 ? 0.4 : 1
              },
              children: "\u2713 Approve"
            }
          ) : /* @__PURE__ */ jsx2(
            "button",
            {
              onClick: () => reopenThread(threadId),
              style: {
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#4b5563",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600
              },
              children: "Reopen"
            }
          ) })
        ]
      }
    ),
    document.body
  );
}

// src/EditableText.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function EditableText({ id, children }) {
  const { isEditing, threads, openPopup, activePopupId, getActiveText } = useEditMode();
  const ref = useRef2(null);
  const displayText = getActiveText(id, children);
  const thread = threads[id];
  const hasActivity = thread && (thread.variants.length > 0 || thread.activeText !== thread.sourceText);
  const isApproved = thread?.status === "approved";
  const isPopupOpen = activePopupId === id;
  if (!isEditing) {
    return /* @__PURE__ */ jsx3(Fragment, { children: displayText });
  }
  const borderBottom = isApproved ? "2px solid #22c55e" : hasActivity ? "2px solid #f59e0b" : "1.5px dashed #60a5fa";
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    /* @__PURE__ */ jsx3(
      "span",
      {
        ref,
        "data-edit-id": id,
        onClick: () => openPopup(id, children),
        style: {
          borderBottom,
          borderRadius: "2px",
          cursor: "pointer",
          outline: "none",
          display: "inline",
          background: isPopupOpen ? "rgba(96,165,250,0.08)" : "transparent",
          transition: "background 0.15s"
        },
        children: displayText
      }
    ),
    isPopupOpen && ref.current && /* @__PURE__ */ jsx3(ThreadPopup, { anchorEl: ref.current, threadId: id, sourceText: children })
  ] });
}

// src/EditToolbar.tsx
import { useEffect as useEffect3, useState as useState3 } from "react";
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var C = {
  bg: "#FAF9F6",
  bgSecondary: "#F1EFE9",
  bgTertiary: "#E8E5DD",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9A9A9A",
  borderDefault: "#E5E3DC",
  borderStrong: "#CFCCC2",
  accent: "#4A7C5E",
  accentSoft: "#E8F0EA",
  accentHover: "#3D6A4E",
  accentBorder: "#C4D8C9"
};
var FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
var FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
function EditToolbar() {
  const {
    mode,
    toggleTextMode,
    toggleVisualMode,
    pendingCount,
    approvedCount,
    visualEdits,
    saveAll
  } = useEditMode();
  const [visible, setVisible] = useState3(false);
  const [saving, setSaving] = useState3(false);
  const [toast, setToast] = useState3(
    null
  );
  useEffect3(() => {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host.endsWith(".local");
    const params = new URLSearchParams(window.location.search);
    if (params.has("noedit")) setVisible(false);
    else if (params.has("edit")) setVisible(true);
    else setVisible(isLocal);
  }, []);
  useEffect3(() => {
    if (!visible || mode === "off") return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const el = document.activeElement;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el && el.isContentEditable) {
        return;
      }
      e.preventDefault();
      if (mode === "visual") toggleVisualMode();
      else if (mode === "text") toggleTextMode();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, mode, toggleVisualMode, toggleTextMode]);
  if (!visible) return null;
  async function handleSave() {
    const veCount2 = visualEdits.filter((e) => e.status === "pending").length;
    const total = pendingCount + approvedCount + veCount2;
    setSaving(true);
    setToast(null);
    const ok = await saveAll();
    setSaving(false);
    setToast({ kind: ok ? "saved" : "copied", n: total });
    setTimeout(() => setToast(null), 4e3);
  }
  const threadTotal = pendingCount + approvedCount;
  const veCount = visualEdits.filter((e) => e.status === "pending").length;
  const hasChanges = threadTotal > 0 || veCount > 0;
  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid transparent",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: FONT_SANS,
    fontWeight: 500,
    transition: "all 0.12s",
    whiteSpace: "nowrap"
  };
  const modeBtn = (active) => ({
    ...btnBase,
    background: active ? C.accent : "transparent",
    color: active ? "#FFFFFF" : C.textSecondary,
    borderColor: active ? C.accent : C.borderDefault
  });
  const counterStyle = {
    fontFamily: FONT_MONO,
    fontSize: 11,
    color: C.textSecondary,
    letterSpacing: "0.04em"
  };
  return /* @__PURE__ */ jsxs3(Fragment2, { children: [
    /* @__PURE__ */ jsxs3(
      "div",
      {
        "data-edit-toolbar": "true",
        style: {
          position: "fixed",
          // Sits above the host-app's own bottom-center chrome (e.g.
          // tldraw's toolbar in bso-canvas, ~52px tall + gap). 80px puts
          // our pill cleanly above it without overlap.
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.bg,
          color: C.textPrimary,
          padding: "8px 14px",
          borderRadius: 999,
          boxShadow: "0 8px 28px -6px rgba(26, 26, 26, 0.16), 0 0 0 1px " + C.borderDefault,
          fontFamily: FONT_SANS,
          fontSize: 13,
          whiteSpace: "nowrap"
        },
        children: [
          /* @__PURE__ */ jsx4(
            "span",
            {
              style: {
                fontFamily: FONT_MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.textMuted,
                fontWeight: 500,
                paddingRight: 4
              },
              children: "EDIT"
            }
          ),
          /* @__PURE__ */ jsx4("button", { onClick: toggleTextMode, style: modeBtn(mode === "text"), children: "Text" }),
          /* @__PURE__ */ jsx4("button", { onClick: toggleVisualMode, style: modeBtn(mode === "visual"), children: "Visual" }),
          hasChanges && /* @__PURE__ */ jsx4("div", { style: { width: 1, height: 20, background: C.borderDefault, margin: "0 2px" } }),
          pendingCount > 0 && /* @__PURE__ */ jsxs3("span", { style: counterStyle, children: [
            pendingCount,
            " open"
          ] }),
          approvedCount > 0 && /* @__PURE__ */ jsxs3("span", { style: counterStyle, children: [
            approvedCount,
            " approved"
          ] }),
          veCount > 0 && /* @__PURE__ */ jsxs3("span", { style: counterStyle, children: [
            veCount,
            " visual"
          ] }),
          hasChanges && /* @__PURE__ */ jsx4(
            "button",
            {
              onClick: handleSave,
              disabled: saving,
              style: {
                ...btnBase,
                background: C.accent,
                color: "#FFFFFF",
                borderColor: C.accent,
                opacity: saving ? 0.6 : 1
              },
              children: saving ? "Saving\u2026" : `Send to Claude`
            }
          )
        ]
      }
    ),
    toast && /* @__PURE__ */ jsxs3(
      "div",
      {
        style: {
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10002,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.bg,
          color: C.textPrimary,
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid " + (toast.kind === "error" ? "#E4C9C1" : C.accentBorder),
          boxShadow: "0 12px 40px -8px rgba(26, 26, 26, 0.16)",
          fontFamily: FONT_SANS,
          fontSize: 14,
          maxWidth: 500,
          animation: "bsoToastIn 0.25s ease-out"
        },
        children: [
          /* @__PURE__ */ jsx4(
            "div",
            {
              style: {
                width: 24,
                height: 24,
                borderRadius: 999,
                background: C.accent,
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0
              },
              children: "\u2713"
            }
          ),
          /* @__PURE__ */ jsxs3("div", { style: { lineHeight: "20px" }, children: [
            /* @__PURE__ */ jsxs3("div", { style: { fontWeight: 500, color: C.textPrimary }, children: [
              toast.kind === "saved" && `${toast.n} edit${toast.n === 1 ? "" : "s"} saved for Claude`,
              toast.kind === "copied" && `${toast.n} edit${toast.n === 1 ? "" : "s"} copied to clipboard`,
              toast.kind === "error" && "Save failed"
            ] }),
            /* @__PURE__ */ jsxs3(
              "div",
              {
                style: {
                  fontSize: 12,
                  color: C.textSecondary,
                  fontFamily: FONT_MONO,
                  marginTop: 2
                },
                children: [
                  toast.kind === "saved" && "written to _edit-threads.json \xB7 ask Claude to read it",
                  toast.kind === "copied" && "paste into Claude prompt",
                  toast.kind === "error" && "check console"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}

// src/VisualEditPicker.tsx
import { useState as useState4, useCallback as useCallback2, useRef as useRef3, useEffect as useEffect4 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var C2 = {
  bg: "#FAF9F6",
  bgSecondary: "#F1EFE9",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9A9A9A",
  borderDefault: "#E5E3DC",
  borderStrong: "#CFCCC2",
  accent: "#4A7C5E",
  accentSoft: "#E8F0EA",
  accentHover: "#3D6A4E",
  accentBorder: "#C4D8C9",
  danger: "#A04A3C"
};
var FONT_SANS2 = "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
var FONT_MONO2 = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
function VisualEditPicker() {
  const { isVisualMode, addVisualEdit, visualEdits, removeVisualEdit, updateVisualEdit } = useEditMode();
  const [hoveredRect, setHoveredRect] = useState4(null);
  const [selectedEl, setSelectedEl] = useState4(null);
  const [selectedRect, setSelectedRect] = useState4(null);
  const [prompt, setPrompt] = useState4("");
  const [flash, setFlash] = useState4("");
  const [editingId, setEditingId] = useState4(null);
  const [editingText, setEditingText] = useState4("");
  const [spaceHeld, setSpaceHeld] = useState4(false);
  const inputRef = useRef3(null);
  const editInputRef = useRef3(null);
  const overlayRef = useRef3(null);
  useEffect4(() => {
    if (!isVisualMode) return;
    const onDown = (e) => {
      if (e.code !== "Space") return;
      const el = document.activeElement;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el && el.isContentEditable) return;
      e.preventDefault();
      setSpaceHeld(true);
    };
    const onUp = (e) => {
      if (e.code === "Space") setSpaceHeld(false);
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
    };
  }, [isVisualMode]);
  const autosize = useCallback2((el, max = 180) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, []);
  useEffect4(() => {
    autosize(inputRef.current);
  }, [prompt, autosize]);
  useEffect4(() => {
    autosize(editInputRef.current);
  }, [editingText, autosize]);
  const getUnderlyingEl = useCallback2((x, y) => {
    const overlay = overlayRef.current;
    if (!overlay) return null;
    overlay.style.display = "none";
    const el = document.elementFromPoint(x, y);
    overlay.style.display = "block";
    return el;
  }, []);
  const handleOverlayMove = useCallback2(
    (e) => {
      if (selectedEl) return;
      const el = getUnderlyingEl(e.clientX, e.clientY);
      if (!el || el.closest("[data-visual-picker]") || el.closest("[data-edit-toolbar]")) {
        setHoveredRect(null);
        return;
      }
      setHoveredRect(el.getBoundingClientRect());
    },
    [selectedEl, getUnderlyingEl]
  );
  const handleOverlayClick = useCallback2(
    (e) => {
      if (selectedEl) return;
      const el = getUnderlyingEl(e.clientX, e.clientY);
      if (!el || el.closest("[data-visual-picker]") || el.closest("[data-edit-toolbar]")) return;
      setSelectedEl(el);
      setSelectedRect(el.getBoundingClientRect());
      setHoveredRect(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [selectedEl, getUnderlyingEl]
  );
  const handleOverlayLeave = useCallback2(() => {
    setHoveredRect(null);
  }, []);
  const captureContext = useCallback2((el) => {
    let component = "";
    let current = el;
    while (current) {
      if (current.dataset?.component) {
        component = current.dataset.component;
        break;
      }
      current = current.parentElement;
    }
    const selectorParts = [];
    let node = el;
    while (node && node !== document.body && selectorParts.length < 5) {
      let sel = node.tagName.toLowerCase();
      if (node.id) sel += `#${node.id}`;
      else if (node.className && typeof node.className === "string") {
        const cls = node.className.split(/\s+/).filter((c) => c && !c.startsWith("__")).slice(0, 3);
        if (cls.length) sel += "." + cls.join(".");
      }
      selectorParts.unshift(sel);
      node = node.parentElement;
    }
    const computed = window.getComputedStyle(el);
    const styles = {};
    const props = [
      "color",
      "background-color",
      "font-size",
      "font-weight",
      "padding",
      "margin",
      "border-radius",
      "display",
      "gap",
      "width",
      "height",
      "max-width"
    ];
    for (const prop of props) {
      const val = computed.getPropertyValue(prop);
      if (val && val !== "rgba(0, 0, 0, 0)" && val !== "0px" && val !== "normal" && val !== "none") {
        styles[prop] = val;
      }
    }
    return {
      component,
      tag: el.tagName.toLowerCase(),
      className: (typeof el.className === "string" ? el.className : "").trim().slice(0, 300),
      textContent: (el.textContent || "").trim().slice(0, 200),
      selector: selectorParts.join(" > "),
      styles
    };
  }, []);
  const handleSubmit = () => {
    if (!selectedEl || !prompt.trim()) return;
    addVisualEdit({ prompt: prompt.trim(), element: captureContext(selectedEl) });
    setFlash("Saved");
    setTimeout(() => setFlash(""), 2e3);
    setSelectedEl(null);
    setSelectedRect(null);
    setPrompt("");
  };
  const cancelSelection = () => {
    setSelectedEl(null);
    setSelectedRect(null);
    setPrompt("");
  };
  const startEditing = (id, currentPrompt) => {
    setEditingId(id);
    setEditingText(currentPrompt);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };
  const saveEditing = () => {
    if (!editingId) return;
    updateVisualEdit(editingId, editingText);
    setEditingId(null);
    setEditingText("");
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };
  if (!isVisualMode) return null;
  const pendingEdits = visualEdits.filter((e) => e.status === "pending");
  const makeKeyHandler = (onSubmit, onCancel) => (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    }
  };
  const textareaBaseStyle = {
    flex: 1,
    padding: "8px 12px",
    border: `1px solid ${C2.borderDefault}`,
    borderRadius: 8,
    outline: "none",
    fontSize: 14,
    lineHeight: "20px",
    fontFamily: FONT_SANS2,
    background: C2.bg,
    color: C2.textPrimary,
    resize: "none",
    minHeight: 36,
    maxHeight: 180,
    overflow: "auto"
  };
  const btnPrimary = (enabled) => ({
    height: 36,
    padding: "0 16px",
    borderRadius: 8,
    border: `1px solid ${enabled ? C2.accent : C2.borderDefault}`,
    background: enabled ? C2.accent : C2.bgSecondary,
    color: enabled ? "#FFFFFF" : C2.textMuted,
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: FONT_SANS2,
    whiteSpace: "nowrap"
  });
  const btnSecondary = {
    height: 36,
    width: 36,
    padding: 0,
    borderRadius: 8,
    border: `1px solid ${C2.borderDefault}`,
    background: "transparent",
    color: C2.textSecondary,
    cursor: "pointer",
    fontSize: 14,
    fontFamily: FONT_MONO2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  };
  return createPortal2(
    /* @__PURE__ */ jsxs4("div", { "data-visual-picker": "true", children: [
      !selectedEl && !spaceHeld && /* @__PURE__ */ jsx5(
        "div",
        {
          ref: overlayRef,
          onMouseMove: handleOverlayMove,
          onClick: handleOverlayClick,
          onMouseLeave: handleOverlayLeave,
          style: {
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            cursor: "crosshair",
            background: "transparent"
          }
        }
      ),
      spaceHeld && !selectedEl && /* @__PURE__ */ jsx5(
        "div",
        {
          style: {
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9998,
            padding: "6px 12px",
            borderRadius: 999,
            background: C2.accentSoft,
            color: C2.accentHover,
            border: `1px solid ${C2.accentBorder}`,
            fontFamily: FONT_MONO2,
            fontSize: 11,
            letterSpacing: "0.08em",
            pointerEvents: "none"
          },
          children: "pan mode \xB7 release Space to pick"
        }
      ),
      hoveredRect && !selectedEl && /* @__PURE__ */ jsx5(
        "div",
        {
          style: {
            position: "fixed",
            top: hoveredRect.top - 2,
            left: hoveredRect.left - 2,
            width: hoveredRect.width + 4,
            height: hoveredRect.height + 4,
            border: `2px solid ${C2.accent}`,
            borderRadius: 6,
            pointerEvents: "none",
            zIndex: 1e4,
            transition: "top 0.06s, left 0.06s, width 0.06s, height 0.06s",
            boxShadow: `0 0 0 4px ${C2.accentSoft}`
          }
        }
      ),
      selectedRect && /* @__PURE__ */ jsx5(
        "div",
        {
          style: {
            position: "fixed",
            top: selectedRect.top - 2,
            left: selectedRect.left - 2,
            width: selectedRect.width + 4,
            height: selectedRect.height + 4,
            border: `2px solid ${C2.accent}`,
            borderRadius: 6,
            background: "rgba(74, 124, 94, 0.06)",
            pointerEvents: "none",
            zIndex: 1e4
          }
        }
      ),
      selectedEl && selectedRect && /* @__PURE__ */ jsxs4(
        "div",
        {
          style: {
            position: "fixed",
            top: Math.min(selectedRect.bottom + 10, window.innerHeight - 200),
            left: Math.max(16, Math.min(selectedRect.left, window.innerWidth - 520)),
            zIndex: 10001,
            width: 500,
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            background: C2.bg,
            padding: 12,
            borderRadius: 12,
            border: `1px solid ${C2.borderDefault}`,
            boxShadow: "0 12px 40px -8px rgba(26, 26, 26, 0.16)",
            fontFamily: FONT_SANS2
          },
          children: [
            /* @__PURE__ */ jsx5(
              "textarea",
              {
                ref: inputRef,
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                onKeyDown: makeKeyHandler(handleSubmit, cancelSelection),
                placeholder: "Describe the change\u2026 (Shift+Enter for new line)",
                rows: 1,
                style: textareaBaseStyle,
                onFocus: (e) => {
                  e.currentTarget.style.borderColor = C2.accent;
                },
                onBlur: (e) => {
                  e.currentTarget.style.borderColor = C2.borderDefault;
                }
              }
            ),
            /* @__PURE__ */ jsx5("button", { onClick: handleSubmit, disabled: !prompt.trim(), style: btnPrimary(!!prompt.trim()), children: "Send" }),
            /* @__PURE__ */ jsx5("button", { onClick: cancelSelection, style: btnSecondary, title: "Cancel (Esc)", children: "\xD7" })
          ]
        }
      ),
      pendingEdits.length > 0 && !selectedEl && /* @__PURE__ */ jsxs4(
        "div",
        {
          style: {
            position: "fixed",
            top: 80,
            right: 20,
            zIndex: 1e4,
            background: C2.bg,
            borderRadius: 12,
            padding: 16,
            border: `1px solid ${C2.borderDefault}`,
            boxShadow: "0 8px 32px -8px rgba(26, 26, 26, 0.12)",
            fontFamily: FONT_SANS2,
            fontSize: 13,
            width: 360,
            maxWidth: "calc(100vw - 40px)",
            maxHeight: "60vh",
            overflowY: "auto"
          },
          children: [
            /* @__PURE__ */ jsxs4(
              "div",
              {
                style: {
                  fontFamily: FONT_MONO2,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: C2.textMuted,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginBottom: 12
                },
                children: [
                  "Visual edits \xB7 ",
                  pendingEdits.length
                ]
              }
            ),
            pendingEdits.map((edit, i) => {
              const isEditing = editingId === edit.id;
              return /* @__PURE__ */ jsxs4(
                "div",
                {
                  style: {
                    padding: "10px 0",
                    borderTop: i === 0 ? "none" : `1px solid ${C2.borderDefault}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                  },
                  children: [
                    /* @__PURE__ */ jsxs4(
                      "div",
                      {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: 8
                        },
                        children: [
                          /* @__PURE__ */ jsxs4(
                            "div",
                            {
                              style: {
                                fontFamily: FONT_MONO2,
                                fontSize: 11,
                                color: C2.textMuted,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1
                              },
                              children: [
                                edit.element.component || edit.element.tag,
                                " \u2192",
                                " ",
                                edit.element.textContent.slice(0, 40),
                                edit.element.textContent.length > 40 ? "\u2026" : ""
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 4, flexShrink: 0 }, children: [
                            !isEditing && /* @__PURE__ */ jsx5(
                              "button",
                              {
                                onClick: () => startEditing(edit.id, edit.prompt),
                                style: {
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: C2.textMuted,
                                  fontSize: 12,
                                  padding: "2px 4px",
                                  fontFamily: FONT_MONO2
                                },
                                title: "Edit",
                                children: "\u270E"
                              }
                            ),
                            /* @__PURE__ */ jsx5(
                              "button",
                              {
                                onClick: () => removeVisualEdit(edit.id),
                                style: {
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: C2.textMuted,
                                  fontSize: 14,
                                  padding: "2px 4px",
                                  fontFamily: FONT_MONO2
                                },
                                title: "Delete",
                                children: "\xD7"
                              }
                            )
                          ] })
                        ]
                      }
                    ),
                    isEditing ? /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 6, alignItems: "flex-end" }, children: [
                      /* @__PURE__ */ jsx5(
                        "textarea",
                        {
                          ref: editInputRef,
                          value: editingText,
                          onChange: (e) => setEditingText(e.target.value),
                          onKeyDown: makeKeyHandler(saveEditing, cancelEditing),
                          rows: 1,
                          style: {
                            ...textareaBaseStyle,
                            fontSize: 13,
                            lineHeight: "20px",
                            minHeight: 32
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx5(
                        "button",
                        {
                          onClick: saveEditing,
                          disabled: !editingText.trim(),
                          style: {
                            ...btnPrimary(!!editingText.trim()),
                            height: 32,
                            padding: "0 12px",
                            fontSize: 12
                          },
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ jsx5(
                        "button",
                        {
                          onClick: cancelEditing,
                          style: {
                            ...btnSecondary,
                            height: 32,
                            width: 32,
                            fontSize: 13
                          },
                          title: "Cancel (Esc)",
                          children: "\xD7"
                        }
                      )
                    ] }) : /* @__PURE__ */ jsx5(
                      "div",
                      {
                        style: {
                          color: C2.textPrimary,
                          fontSize: 13,
                          lineHeight: "20px",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word"
                        },
                        children: edit.prompt
                      }
                    )
                  ]
                },
                edit.id
              );
            })
          ]
        }
      ),
      flash && /* @__PURE__ */ jsxs4(
        "div",
        {
          style: {
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10002,
            background: C2.accentSoft,
            color: C2.accentHover,
            border: `1px solid ${C2.accentBorder}`,
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: FONT_MONO2,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 500,
            boxShadow: "0 4px 16px -2px rgba(26, 26, 26, 0.12)"
          },
          children: [
            "\u2713 ",
            flash
          ]
        }
      )
    ] }),
    document.body
  );
}
export {
  EditModeProvider,
  EditToolbar,
  EditableText,
  VisualEditPicker,
  useEditMode
};
//# sourceMappingURL=index.js.map