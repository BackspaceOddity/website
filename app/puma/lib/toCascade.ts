// Adapter: our Runbook cascade model (cascade.ts) -> the shape the KOS
// CascadeSankey block consumes ({ cascade initiative node, nodes map }).

import { DIRECTION, Hypothesis, Status, Subtype } from "./cascade";

type KosStatus = "testing" | "confirmed" | "denied" | "pending";

const STATUS_MAP: Record<Status, KosStatus> = {
  Validated: "confirmed",
  Active: "testing",
  Denied: "denied",
  Backlog: "pending",
};

// Subtype -> the small category-entry-point badge on each card.
const CEP_MAP: Record<Subtype, string> = {
  JTBD: "job-to-be-done",
  Moment: "moment-shift",
  Audience: "audience-shift",
  Problems: "problem-shift",
  Competitive: "rules-shift",
  Hook: "product-hook",
  Promise: "product-promise",
  Conflict: "product-conflict",
  World: "product-world",
  Character: "product-character",
};

export interface KosNode {
  id: string;
  title: string;
  type: string;
  fm: Record<string, unknown>;
}

// Evidence nodes (the Step-2 experiments from the Runbook) so the right
// column reads as a live cascade, not an empty stub.
const EVIDENCE: KosNode[] = [
  { id: "exp-reveal", title: "The Reveal — TikTok", type: "experiment", fm: {} },
  { id: "exp-carousel", title: "Static Carousel — Reddit + IG", type: "experiment", fm: {} },
  { id: "exp-pov", title: "POV Double — TikTok (denied · form)", type: "experiment", fm: {} },
  { id: "learn-moment", title: "Discovered Moment from comments", type: "learning", fm: {} },
];

// Which hypothesis cites which evidence.
const EVIDENCE_FOR: Record<string, string[]> = {
  h1: ["[[exp-reveal]]", "[[exp-carousel]]"], // Hook
  cf1: ["[[exp-pov]]"], // Conflict
  m1: ["[[learn-moment]]"], // primary Moment
};

export function toCascade(items: Hypothesis[]) {
  const hypNodes: KosNode[] = items.map((h) => ({
    id: h.id,
    title: h.inPlainWords,
    type: "hypothesis",
    fm: {
      confidence: h.evidence / 10, // 0..1
      risk_score: h.opportunity, // 1..10 — opportunity proxy
      status: STATUS_MAP[h.status],
      category_entry_point: CEP_MAP[h.subtype],
      evidence_for: EVIDENCE_FOR[h.id] || [],
      author: "Masha",
      owner: "Emily",
    },
  }));

  const cascade: KosNode = {
    id: `direction-${DIRECTION.name.toLowerCase()}`,
    title: DIRECTION.name,
    type: "initiative",
    fm: {
      status: "active",
      owner: "Emily",
      hypotheses: items.map((h) => `[[${h.id}]]`),
      stage: DIRECTION.stage,
    },
  };

  const nodes: Record<string, KosNode> = {};
  for (const n of [...hypNodes, ...EVIDENCE]) nodes[n.id] = n;

  return { cascade, nodes };
}
