// Cascade engine — data model, rules, scoring, seed.
// Mirrors the Notion "Selfies PoC Runbook" mechanics: a Story Direction holds a
// tree of Hypotheses by Subtype; +child buttons inherit the Direction; P(success)
// = Evidence × Opportunity ranks them; a denied parent kills its branch.

export type Subtype =
  | "JTBD"
  | "Moment"
  | "Audience"
  | "Problems"
  | "Competitive"
  | "Hook"
  | "Promise"
  | "Conflict"
  | "World"
  | "Character";

export type Status = "Backlog" | "Active" | "Validated" | "Denied";

export const STATUS_CYCLE: Status[] = [
  "Backlog",
  "Active",
  "Validated",
  "Denied",
];

export interface Hypothesis {
  id: string;
  subtype: Subtype;
  parentId: string | null; // null = direct child of the Direction
  inPlainWords: string;
  evidence: number; // 0..10
  opportunity: number; // 0..10
  status: Status;
}

export interface Direction {
  name: string;
  stage: string;
}

// Block 1 = the cascade tested in order; Block 2 = the product layer.
const BLOCK_2: Subtype[] = ["Hook", "Promise", "Conflict", "World", "Character"];
export const blockOf = (s: Subtype): "B1" | "B2" =>
  BLOCK_2.includes(s) ? "B2" : "B1";

// Which child Subtypes a given Subtype can spawn. Root (Direction) → JTBD.
export const CHILD_TYPES: Record<Subtype, Subtype[]> = {
  JTBD: ["Moment"],
  Moment: ["Audience", "Moment"],
  Audience: ["Problems", "Hook", "Promise", "Conflict"],
  Problems: ["Competitive"],
  Competitive: [],
  Hook: [],
  Promise: [],
  Conflict: [],
  World: [],
  Character: [],
};
export const ROOT_CHILD_TYPES: Subtype[] = ["JTBD"];

// Subtype → KOS type-palette colour (from kos-v11.css :root --type-*).
export const SUBTYPE_COLOR: Record<Subtype, string> = {
  JTBD: "var(--type-methodology, #4A6B8B)",
  Moment: "var(--type-person, #5A8B7E)",
  Audience: "var(--type-project, #5A7A8B)",
  Problems: "var(--type-decision, #8B5A3C)",
  Competitive: "var(--type-deal, #8B6B50)",
  Hook: "var(--type-concept, #7A5C8B)",
  Promise: "var(--type-playbook, #5E8B6A)",
  Conflict: "var(--type-learning, #8B8050)",
  World: "var(--type-artifact, #8B7A5A)",
  Character: "var(--type-idea, #8B7A5A)",
};

// P(success) = Evidence × Opportunity (each 0..10 → 0..100, read as %).
// Unrated (either factor 0) → null.
export const pSuccess = (h: Hypothesis): number | null => {
  if (h.evidence <= 0 || h.opportunity <= 0) return null;
  return h.evidence * h.opportunity;
};

// "In plain words" → polished "Full Statement" (verb + object + clarifier),
// pulling the parent JTBD job into a Moment so the cascade reads natively.
export const fullStatement = (
  h: Hypothesis,
  byId: Map<string, Hypothesis>,
): string => {
  const raw = h.inPlainWords.trim();
  if (!raw) return "";
  const cap = raw.charAt(0).toUpperCase() + raw.slice(1);
  switch (h.subtype) {
    case "JTBD":
      return cap;
    case "Moment": {
      const job = h.parentId ? byId.get(h.parentId)?.inPlainWords.trim() : "";
      return job ? `${capFirst(job)} — ${lower(raw)}` : cap;
    }
    case "Audience":
      return `For ${lower(raw)}`;
    case "Problems":
      return `Underserved problem — ${lower(raw)}`;
    case "Competitive":
      return `Competitive landscape — ${lower(raw)}`;
    default:
      return `${h.subtype}: ${lower(raw)}`;
  }
};

const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// Stop rule: a denied ancestor kills the whole branch downstream.
export const isKilled = (
  h: Hypothesis,
  byId: Map<string, Hypothesis>,
): boolean => {
  let p = h.parentId ? byId.get(h.parentId) : undefined;
  while (p) {
    if (p.status === "Denied") return true;
    p = p.parentId ? byId.get(p.parentId) : undefined;
  }
  return false;
};

// Rank within Subtype group by P(success) desc — surfaces Primary vs Adjacent.
export const ranksBySubtype = (
  all: Hypothesis[],
): Map<string, { rank: number; of: number }> => {
  const groups = new Map<Subtype, Hypothesis[]>();
  for (const h of all) {
    const arr = groups.get(h.subtype) ?? [];
    arr.push(h);
    groups.set(h.subtype, arr);
  }
  const out = new Map<string, { rank: number; of: number }>();
  for (const [, arr] of groups) {
    const rated = [...arr].sort((a, b) => (pSuccess(b) ?? -1) - (pSuccess(a) ?? -1));
    rated.forEach((h, i) => out.set(h.id, { rank: i + 1, of: arr.length }));
  }
  return out;
};

export const newId = (): string =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `h_${Math.floor(Math.random() * 1e9).toString(36)}`;

export const DIRECTION: Direction = { name: "SELFIES", stage: "S3" };

// Seed — the "Selfies" case from the Runbook snapshot.
export const SEED: Hypothesis[] = [
  {
    id: "j1",
    subtype: "JTBD",
    parentId: null,
    inPlainWords: "confront identity dread while feeling lonely",
    evidence: 8,
    opportunity: 7,
    status: "Validated",
  },
  {
    id: "m1",
    subtype: "Moment",
    parentId: "j1",
    inPlainWords: "doomscrolling alone on a Sunday night",
    evidence: 8,
    opportunity: 8,
    status: "Validated",
  },
  {
    id: "m2",
    subtype: "Moment",
    parentId: "j1",
    inPlainWords: "a group watch on a Saturday night",
    evidence: 5,
    opportunity: 5,
    status: "Active",
  },
  {
    id: "a1",
    subtype: "Audience",
    parentId: "m1",
    inPlainWords: "teenage girls 14–19, horror-comedy fans",
    evidence: 7,
    opportunity: 8,
    status: "Validated",
  },
  {
    id: "p1",
    subtype: "Problems",
    parentId: "a1",
    inPlainWords:
      "no horror that is also funny enough to share without feeling cringe",
    evidence: 5,
    opportunity: 7,
    status: "Active",
  },
  {
    id: "c1",
    subtype: "Competitive",
    parentId: "p1",
    inPlainWords:
      "no recent title owns this cell (vs Us, M3GAN, Scream 2022, Fear Street)",
    evidence: 6,
    opportunity: 7,
    status: "Active",
  },
  {
    id: "h1",
    subtype: "Hook",
    parentId: "a1",
    inPlainWords: "a selfie that starts killing",
    evidence: 7,
    opportunity: 8,
    status: "Validated",
  },
  {
    id: "pr1",
    subtype: "Promise",
    parentId: "a1",
    inPlainWords: "your own phone becomes the monster",
    evidence: 6,
    opportunity: 7,
    status: "Validated",
  },
  {
    id: "cf1",
    subtype: "Conflict",
    parentId: "a1",
    inPlainWords: "POV double — you against your own selfie",
    evidence: 6,
    opportunity: 6,
    status: "Active",
  },
];
