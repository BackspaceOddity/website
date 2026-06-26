"use client";

// "Search query" blocks for the base screen — saved queries that render live
// results from the Selfies cascade (mirrors the KOS home query blocks under
// "Ask your graph").

import { Hypothesis, SEED, Status, pSuccess } from "../lib/cascade";

const STATUS_DOT: Record<Status, string> = {
  Validated: "var(--accent, #4A7C5E)",
  Active: "#C99A2E",
  Backlog: "var(--text-muted, #9A9A9A)",
  Denied: "#B33A3A",
};

function ResultRow({ h }: { h: Hypothesis }) {
  const p = pSuccess(h);
  return (
    <div style={S.row}>
      <span style={{ ...S.dot, background: STATUS_DOT[h.status] }} />
      <span style={S.subtype}>{h.subtype}</span>
      <span style={S.title}>{h.inPlainWords}</span>
      <span style={S.p}>{p === null ? "—" : `${p}%`}</span>
    </div>
  );
}

function QueryCard({
  kind,
  query,
  children,
}: {
  kind: "Query" | "Ask";
  query: string;
  children: React.ReactNode;
}) {
  return (
    <div style={S.card}>
      <div style={S.head}>
        <span style={S.kind}>{kind}</span>
        <span style={S.q}>{query}</span>
      </div>
      <div style={S.body}>{children}</div>
    </div>
  );
}

export default function QueryBlocks() {
  const testing = SEED.filter((h) => h.status === "Active");
  const moments = SEED.filter((h) => h.subtype === "Moment").sort(
    (a, b) => (pSuccess(b) ?? -1) - (pSuccess(a) ?? -1),
  );
  const next = [...SEED]
    .filter((h) => h.status === "Active" && pSuccess(h) !== null)
    .sort((a, b) => (pSuccess(b) ?? -1) - (pSuccess(a) ?? -1))[0];

  return (
    <div style={S.grid}>
      <QueryCard kind="Query" query="status:testing — what's live right now">
        {testing.map((h) => (
          <ResultRow key={h.id} h={h} />
        ))}
      </QueryCard>

      <QueryCard kind="Query" query="subtype:moment sort:p(success) desc">
        {moments.map((h) => (
          <ResultRow key={h.id} h={h} />
        ))}
      </QueryCard>

      <QueryCard kind="Ask" query="what should we test next?">
        {next ? (
          <div style={S.answer}>
            Highest open P(success) is{" "}
            <strong>{pSuccess(next)}%</strong> —{" "}
            <span style={S.answerSubtype}>{next.subtype}</span>{" "}
            <em>“{next.inPlainWords}”</em>. Queue an experiment against it.
          </div>
        ) : (
          <div style={S.answer}>Nothing testing — open a hypothesis first.</div>
        )}
      </QueryCard>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 14,
    margin: "8px 0 28px",
  },
  card: {
    border: "1px solid var(--border-default, #E5E3DC)",
    borderRadius: 12,
    background: "var(--bg-primary, #FAF9F6)",
    overflow: "hidden",
  },
  head: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 14px",
    borderBottom: "1px solid var(--border-default, #E5E3DC)",
  },
  kind: {
    fontFamily: "var(--font-jb-mono), monospace",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "var(--accent, #4A7C5E)",
    background: "var(--accent-soft, #E8F0EA)",
    padding: "2px 7px",
    borderRadius: 5,
  },
  q: {
    fontFamily: "var(--font-jb-mono), monospace",
    fontSize: 12,
    color: "var(--text-secondary, #6B6B6B)",
  },
  body: { padding: "6px 6px" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "7px 9px",
    borderRadius: 7,
  },
  dot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  subtype: {
    fontFamily: "var(--font-jb-mono), monospace",
    fontSize: 10,
    color: "var(--text-muted, #9A9A9A)",
    width: 72,
    flexShrink: 0,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  title: {
    flex: 1,
    fontSize: 13,
    color: "var(--text-primary, #1A1A1A)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  p: {
    fontFamily: "var(--font-jb-mono), monospace",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-primary, #1A1A1A)",
    fontVariantNumeric: "tabular-nums",
  },
  answer: {
    padding: "10px 9px",
    fontSize: 13,
    lineHeight: 1.5,
    color: "var(--text-secondary, #6B6B6B)",
  },
  answerSubtype: {
    fontFamily: "var(--font-jb-mono), monospace",
    fontSize: 11,
    textTransform: "uppercase",
    color: "var(--text-muted, #9A9A9A)",
  },
};
