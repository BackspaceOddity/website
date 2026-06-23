// MOCK DATA for the embeddable Knowledge OS demo (codename "Merz").
// A fictional startup founder's "second brain" — company: Lumina (B2B product analytics SaaS).
// Contains ZERO real internal data. Same node format as the real data/nodes.v2.js:
//   window.__RAW_NODES = [ { id, raw }, ... ]  where raw is full markdown w/ YAML frontmatter.

window.__RAW_NODES = [

// ───────────────────────── PEOPLE (type: person) ─────────────────────────
{ id: "person-maya-chen", raw: [
  "---","id: person-maya-chen","type: person","title: Maya Chen","tags: [team, founder]","status: active","domain: [company]","created: 2026-01-04","---","",
  "# Maya Chen","",
  "Co-founder and CEO of [[client-lumina]]. Owns product vision, fundraising, and key customer relationships. Previously a data PM at a larger analytics company, which is where the wedge idea for [[idea-self-serve-analytics]] came from.","",
  "Drives the [[project-series-a-raise]] and runs most [[methodology-customer-discovery]] interviews herself. Pairs with [[person-raj-patel]] on roadmap calls."
].join("\n") },

{ id: "person-raj-patel", raw: [
  "---","id: person-raj-patel","type: person","title: Raj Patel","tags: [team, founder, engineering]","status: active","domain: [company]","created: 2026-01-04","---","",
  "# Raj Patel","",
  "Co-founder and CTO of [[client-lumina]]. Owns architecture, the data pipeline, and hiring for engineering. Made the call in [[decision-event-pipeline-rebuild]] to move off the legacy ingestion stack.","",
  "Leads [[project-event-pipeline-v2]] and is the hiring manager behind [[decision-first-engineering-hire]]."
].join("\n") },

{ id: "person-elena-soto", raw: [
  "---","id: person-elena-soto","type: person","title: Elena Soto","tags: [team, design]","status: active","domain: [company]","created: 2026-02-10","---","",
  "# Elena Soto","",
  "Founding designer at [[client-lumina]]. Led the dashboard redesign in [[project-dashboard-redesign]] and owns the design system. Her usability findings fed [[learning-onboarding-friction]]."
].join("\n") },

{ id: "person-tom-becker", raw: [
  "---","id: person-tom-becker","type: person","title: Tom Becker","tags: [team, sales]","status: active","domain: [company]","created: 2026-03-01","---","",
  "# Tom Becker","",
  "First sales hire at [[client-lumina]]. Runs the [[playbook-founder-led-sales]] handoff and owns the [[deal-northwind-expansion]] account. Surfaced the churn signal captured in [[learning-champion-departure-risk]]."
].join("\n") },

{ id: "person-investor-dana-kim", raw: [
  "---","id: person-investor-dana-kim","type: person","title: Dana Kim","tags: [investor]","status: active","domain: [fundraising]","created: 2026-02-20","---","",
  "# Dana Kim","",
  "Partner at a seed-stage fund focused on dev tools and data infrastructure. Warm intro target for [[project-series-a-raise]]; met at the [[meeting-2026-04-22-investor-coffee]] coffee."
].join("\n") },

// ───────────────────────── CLIENT / COMPANY (type: client) ─────────────────────────
{ id: "client-lumina", raw: [
  "---","id: client-lumina","type: client","title: Lumina","tags: [company]","status: active","domain: [company]","created: 2026-01-01",
  "team: [person-maya-chen, person-raj-patel, person-elena-soto, person-tom-becker]","---","",
  "# Lumina","",
  "Lumina is a B2B product-analytics SaaS — self-serve event tracking and dashboards aimed at small product teams who find the incumbents too heavy and too expensive. Founded by [[person-maya-chen]] and [[person-raj-patel]].","",
  "The thesis is captured in [[idea-self-serve-analytics]]: product teams want answers in minutes, not a six-week data-warehouse project. Current focus is the [[project-series-a-raise]] and tightening activation per [[learning-onboarding-friction]]."
].join("\n") },

{ id: "client-northwind", raw: [
  "---","id: client-northwind","type: client","title: Northwind Software","tags: [customer]","status: active","domain: [sales]","created: 2026-03-15","---","",
  "# Northwind Software","",
  "Mid-market customer of [[client-lumina]]. Champion-led adoption; expansion tracked in [[deal-northwind-expansion]]. Renewal at risk per [[learning-champion-departure-risk]]."
].join("\n") },

// ───────────────────────── PROJECTS (type: project) ─────────────────────────
{ id: "project-series-a-raise", raw: [
  "---","id: project-series-a-raise","type: project","title: Series A raise","tags: [fundraising]","status: active","domain: [fundraising]","created: 2026-02-15",
  "client: client-lumina","team: [person-maya-chen]","methodologies: [methodology-narrative-fundraising]",
  "deliverables: [artifact-pitch-deck, artifact-data-room]","---","",
  "# Series A raise","",
  "Raising a Series A to fund the move upmarket. Led by [[person-maya-chen]]. The narrative leans on the [[methodology-narrative-fundraising]] approach — lead with the category shift, not the feature list.","",
  "Key artifacts: [[artifact-pitch-deck]] and [[artifact-data-room]]. Decision on dilution captured in [[decision-raise-amount]]. First serious conversation was [[meeting-2026-04-22-investor-coffee]] with [[person-investor-dana-kim]]."
].join("\n") },

{ id: "project-event-pipeline-v2", raw: [
  "---","id: project-event-pipeline-v2","type: project","title: Event pipeline v2","tags: [engineering, infra]","status: active","domain: [engineering]","created: 2026-03-05",
  "client: client-lumina","team: [person-raj-patel]","methodologies: [methodology-riskiest-assumption-test]",
  "deliverables: [artifact-pipeline-arch-doc]","---","",
  "# Event pipeline v2","",
  "Rebuild of the ingestion pipeline to handle 10x event volume at lower cost. Owned by [[person-raj-patel]]. Triggered by [[decision-event-pipeline-rebuild]] after the legacy stack started dropping events under load.","",
  "Architecture is documented in [[artifact-pipeline-arch-doc]]. The team de-risked the throughput question first using [[methodology-riskiest-assumption-test]]."
].join("\n") },

{ id: "project-dashboard-redesign", raw: [
  "---","id: project-dashboard-redesign","type: project","title: Dashboard redesign","tags: [design, product]","status: completed","domain: [product]","created: 2026-02-01",
  "client: client-lumina","team: [person-elena-soto, person-maya-chen]","methodologies: [methodology-jobs-to-be-done]",
  "deliverables: [artifact-dashboard-spec]","---","",
  "# Dashboard redesign","",
  "Reworked the core dashboard around the jobs users actually hire Lumina for, framed via [[methodology-jobs-to-be-done]]. Led by [[person-elena-soto]].","",
  "Shipped the new layout in [[artifact-dashboard-spec]]. Usability testing during the project produced [[learning-onboarding-friction]], which reshaped the activation flow."
].join("\n") },

{ id: "project-activation-experiments", raw: [
  "---","id: project-activation-experiments","type: project","title: Activation experiments","tags: [growth, product]","status: active","domain: [growth]","created: 2026-04-01",
  "client: client-lumina","team: [person-maya-chen, person-elena-soto]","methodologies: [methodology-riskiest-assumption-test, methodology-north-star-metric]",
  "---","",
  "# Activation experiments","",
  "A series of small experiments to lift first-week activation, the [[methodology-north-star-metric]] for this quarter. Each test follows [[methodology-riskiest-assumption-test]]: state the assumption, run the cheapest test, decide.","",
  "Directly responds to [[learning-onboarding-friction]]. Owned jointly by [[person-maya-chen]] and [[person-elena-soto]]."
].join("\n") },

// ───────────────────────── DEALS (type: deal) ─────────────────────────
{ id: "deal-northwind-expansion", raw: [
  "---","id: deal-northwind-expansion","type: deal","title: Northwind expansion","tags: [sales]","status: active","domain: [sales]","created: 2026-04-10",
  "client: client-northwind","deal_stage: proposal","deal_type: expansion","phase_order: 2","team: [person-tom-becker]",
  "project: project-series-a-raise","---","",
  "# Northwind expansion","",
  "Expansion deal with [[client-northwind]] — moving from a single team to a company-wide seat plan. Owned by [[person-tom-becker]], currently at the proposal stage.","",
  "At risk because the original champion is leaving — see [[learning-champion-departure-risk]]. Closing this strengthens the revenue story for [[project-series-a-raise]]."
].join("\n") },

{ id: "deal-orbit-new-logo", raw: [
  "---","id: deal-orbit-new-logo","type: deal","title: Orbit Labs new logo","tags: [sales]","status: active","domain: [sales]","created: 2026-05-02",
  "deal_stage: discovery","deal_type: new-business","phase_order: 1","team: [person-tom-becker]","---","",
  "# Orbit Labs new logo","",
  "New-business deal in discovery, run by [[person-tom-becker]] using the [[playbook-founder-led-sales]] motion. A clean test of whether the [[methodology-jobs-to-be-done]] framing lands without a warm intro."
].join("\n") },

// ───────────────────────── MEETINGS (type: meeting) ─────────────────────────
{ id: "meeting-2026-04-22-investor-coffee", raw: [
  "---","id: meeting-2026-04-22-investor-coffee","type: meeting","title: Investor coffee — Dana Kim","tags: [fundraising]","status: active","domain: [fundraising]","created: 2026-04-22",
  "date: 2026-04-22","meeting_kind: intro","duration_minutes: 45","participants: [person-maya-chen, person-investor-dana-kim]",
  "client: client-lumina","---","",
  "# Investor coffee — Dana Kim","",
  "First conversation with [[person-investor-dana-kim]] ahead of [[project-series-a-raise]]. Strong signal on the category narrative; she asked for the [[artifact-data-room]] link.","",
  "Maya used the [[methodology-narrative-fundraising]] opener and it landed. Follow-up scheduled."
].join("\n") },

{ id: "meeting-2026-04-15-roadmap", raw: [
  "---","id: meeting-2026-04-15-roadmap","type: meeting","title: Q2 roadmap sync","tags: [product]","status: active","domain: [product]","created: 2026-04-15",
  "date: 2026-04-15","meeting_kind: internal","duration_minutes: 60","participants: [person-maya-chen, person-raj-patel, person-elena-soto]",
  "client: client-lumina","---","",
  "# Q2 roadmap sync","",
  "Aligned on Q2 priorities: ship [[project-event-pipeline-v2]], run [[project-activation-experiments]], and hold the line on scope. Output fed the dilution math in [[decision-raise-amount]]."
].join("\n") },

{ id: "meeting-2026-05-06-northwind-qbr", raw: [
  "---","id: meeting-2026-05-06-northwind-qbr","type: meeting","title: Northwind QBR","tags: [sales]","status: active","domain: [sales]","created: 2026-05-06",
  "date: 2026-05-06","meeting_kind: review","duration_minutes: 30","participants: [person-tom-becker]",
  "client: client-northwind","deal: deal-northwind-expansion","---","",
  "# Northwind QBR","",
  "Quarterly review with [[client-northwind]]. Surfaced that the champion is leaving — captured as [[learning-champion-departure-risk]]. Directly relevant to [[deal-northwind-expansion]]."
].join("\n") },

// ───────────────────────── DECISIONS (type: decision) ─────────────────────────
{ id: "decision-event-pipeline-rebuild", raw: [
  "---","id: decision-event-pipeline-rebuild","type: decision","title: Rebuild the event pipeline","tags: [engineering, architecture]","status: active","domain: [engineering]","created: 2026-03-04",
  "decided_on: 2026-03-04","builds_on: [learning-pipeline-dropped-events]","relates_to: [project-event-pipeline-v2]","---","",
  "# Rebuild the event pipeline","",
  "We will rebuild ingestion rather than patch the legacy stack. The dropped-event incidents (see [[learning-pipeline-dropped-events]]) are a symptom of an architecture that can't scale, not a tuning problem.","",
  "This decision spawned [[project-event-pipeline-v2]], owned by [[person-raj-patel]]. Embodied in [[artifact-pipeline-arch-doc]]."
].join("\n") },

{ id: "decision-raise-amount", raw: [
  "---","id: decision-raise-amount","type: decision","title: How much to raise","tags: [fundraising]","status: active","domain: [fundraising]","created: 2026-04-16",
  "decided_on: 2026-04-16","builds_on: [decision-move-upmarket]","relates_to: [project-series-a-raise]","---","",
  "# How much to raise","",
  "Raise enough for ~24 months of runway at the upmarket plan, not the maximum we could get. Bigger rounds buy dilution, not focus.","",
  "Builds on [[decision-move-upmarket]] and feeds the targets in [[project-series-a-raise]] and the [[artifact-pitch-deck]]."
].join("\n") },

{ id: "decision-move-upmarket", raw: [
  "---","id: decision-move-upmarket","type: decision","title: Move upmarket to mid-market teams","tags: [strategy]","status: active","domain: [strategy]","created: 2026-03-20",
  "decided_on: 2026-03-20","builds_on: [learning-smb-low-retention]","relates_to: [concept-ideal-customer-profile]","---","",
  "# Move upmarket to mid-market teams","",
  "Shift the [[concept-ideal-customer-profile]] from solo SMBs to 10–50-person product teams. SMB retention is structurally weak (see [[learning-smb-low-retention]]) while mid-market teams have the budget and the recurring need.","",
  "This is the strategic spine behind [[decision-raise-amount]] and [[deal-northwind-expansion]]."
].join("\n") },

{ id: "decision-usage-based-pricing", raw: [
  "---","id: decision-usage-based-pricing","type: decision","title: Add a usage-based tier","tags: [pricing]","status: active","domain: [pricing]","created: 2026-04-25",
  "decided_on: 2026-04-25","builds_on: [idea-usage-based-pricing]","relates_to: [concept-expansion-revenue]","---","",
  "# Add a usage-based tier","",
  "Introduce a seat + usage hybrid for the heaviest accounts, from [[idea-usage-based-pricing]]. The goal is [[concept-expansion-revenue]] without punishing small teams on the base plan.","",
  "Evidence is getting old — flagged for re-review in the inbox."
].join("\n") },

{ id: "decision-first-engineering-hire", raw: [
  "---","id: decision-first-engineering-hire","type: decision","title: When to make the first engineering hire","tags: [hiring]","status: active","domain: [hiring]","created: 2026-04-28",
  "decided_on: 2026-04-28","builds_on: [playbook-early-hiring]","relates_to: [project-event-pipeline-v2]","---","",
  "# When to make the first engineering hire","",
  "Hire the first engineer once [[project-event-pipeline-v2]] ships, not before — the rebuild is the best interview signal we have. Follows [[playbook-early-hiring]]. Hiring manager: [[person-raj-patel]].","",
  "Open question on timing remains in the review inbox."
].join("\n") },

// ───────────────────────── METHODOLOGIES (type: methodology) ─────────────────────────
{ id: "methodology-jobs-to-be-done", raw: [
  "---","id: methodology-jobs-to-be-done","type: methodology","title: Jobs to be Done","tags: [product, discovery]","status: active","domain: [product]","created: 2026-01-20","---","",
  "# Jobs to be Done","",
  "Frame the product around the job a customer hires it to do, not the features it has. Used to reframe the [[project-dashboard-redesign]] and to qualify [[deal-orbit-new-logo]].","",
  "Pairs well with [[methodology-customer-discovery]] upstream and [[methodology-north-star-metric]] downstream."
].join("\n") },

{ id: "methodology-customer-discovery", raw: [
  "---","id: methodology-customer-discovery","type: methodology","title: Customer discovery interviews","tags: [discovery, research]","status: active","domain: [product]","created: 2026-01-15","---","",
  "# Customer discovery interviews","",
  "Structured problem interviews that avoid pitching. [[person-maya-chen]] runs these weekly; they feed [[concept-ideal-customer-profile]] and surfaced [[learning-onboarding-friction]].","",
  "Feeds into [[methodology-jobs-to-be-done]] — interviews reveal the job, JTBD frames it."
].join("\n") },

{ id: "methodology-riskiest-assumption-test", raw: [
  "---","id: methodology-riskiest-assumption-test","type: methodology","title: Riskiest assumption test","tags: [product, experiments]","status: active","domain: [product]","created: 2026-02-05","---","",
  "# Riskiest assumption test","",
  "Before building, name the single assumption that, if wrong, kills the idea — then run the cheapest test of just that. Drives [[project-activation-experiments]] and de-risked throughput in [[project-event-pipeline-v2]].","",
  "Sits under the broader [[framework-build-measure-learn]] loop."
].join("\n") },

{ id: "methodology-narrative-fundraising", raw: [
  "---","id: methodology-narrative-fundraising","type: methodology","title: Narrative-led fundraising","tags: [fundraising]","status: active","domain: [fundraising]","created: 2026-03-18","---","",
  "# Narrative-led fundraising","",
  "Lead the raise with the category narrative — why now, why this shift — before any metrics. Used by [[person-maya-chen]] in [[meeting-2026-04-22-investor-coffee]] and structures the [[artifact-pitch-deck]].","",
  "Applied throughout [[project-series-a-raise]]."
].join("\n") },

{ id: "methodology-north-star-metric", raw: [
  "---","id: methodology-north-star-metric","type: methodology","title: North Star metric","tags: [growth, metrics]","status: active","domain: [growth]","created: 2026-02-12","---","",
  "# North Star metric","",
  "Pick one metric that best captures delivered value and orient the team around it. For this quarter it is first-week activation, which anchors [[project-activation-experiments]].","",
  "Relates to [[concept-expansion-revenue]] as a secondary, longer-horizon metric."
].join("\n") },

// ───────────────────────── FRAMEWORKS (type: framework) ─────────────────────────
{ id: "framework-build-measure-learn", raw: [
  "---","id: framework-build-measure-learn","type: framework","title: Build–Measure–Learn loop","tags: [product, lean]","status: active","domain: [product]","created: 2026-01-25","---","",
  "# Build–Measure–Learn loop","",
  "The core iteration loop: build the smallest thing, measure real behaviour, learn, repeat. [[methodology-riskiest-assumption-test]] is how we pick what to build next inside this loop.","",
  "Most of [[project-activation-experiments]] is one turn of this loop after another."
].join("\n") },

{ id: "framework-pirate-metrics", raw: [
  "---","id: framework-pirate-metrics","type: framework","title: Pirate metrics (AARRR)","tags: [growth, metrics]","status: active","domain: [growth]","created: 2026-02-28","---","",
  "# Pirate metrics (AARRR)","",
  "Acquisition, Activation, Retention, Referral, Revenue — the funnel stages we measure. Activation is the current weak link, which is why it is the [[methodology-north-star-metric]].","",
  "Retention weakness in the SMB segment is documented in [[learning-smb-low-retention]]."
].join("\n") },

// ───────────────────────── PLAYBOOKS (type: playbook) ─────────────────────────
{ id: "playbook-founder-led-sales", raw: [
  "---","id: playbook-founder-led-sales","type: playbook","title: Founder-led sales handoff","tags: [sales]","status: active","domain: [sales]","created: 2026-03-10","---","",
  "# Founder-led sales handoff","",
  "How to move deals from founder-run to a first sales hire without losing the discovery quality. Used by [[person-tom-becker]] on [[deal-orbit-new-logo]] and [[deal-northwind-expansion]].","",
  "Leans on [[methodology-jobs-to-be-done]] so the rep sells the job, not the demo."
].join("\n") },

{ id: "playbook-early-hiring", raw: [
  "---","id: playbook-early-hiring","type: playbook","title: Early-stage hiring","tags: [hiring]","status: active","domain: [hiring]","created: 2026-04-02","---","",
  "# Early-stage hiring","",
  "Principles for the first ten hires: hire for the gap that is on fire, use real work as the interview, and prefer range over specialization early. Informed [[decision-first-engineering-hire]]."
].join("\n") },

// ───────────────────────── CONCEPTS (type: concept) ─────────────────────────
{ id: "concept-ideal-customer-profile", raw: [
  "---","id: concept-ideal-customer-profile","type: concept","title: Ideal customer profile","tags: [strategy, sales]","status: active","domain: [strategy]","created: 2026-02-08","---","",
  "# Ideal customer profile","",
  "The ICP is now 10–50-person product teams with a dedicated PM, after [[decision-move-upmarket]]. Built from [[methodology-customer-discovery]] interviews.","",
  "Used to qualify [[deal-orbit-new-logo]] and target the [[project-series-a-raise]] narrative."
].join("\n") },

{ id: "concept-expansion-revenue", raw: [
  "---","id: concept-expansion-revenue","type: concept","title: Expansion revenue","tags: [growth, pricing]","status: active","domain: [growth]","created: 2026-04-20","---","",
  "# Expansion revenue","",
  "Revenue growth from existing accounts rather than new logos — the most efficient growth at this stage. The motivation behind [[decision-usage-based-pricing]] and [[deal-northwind-expansion]]."
].join("\n") },

{ id: "concept-activation", raw: [
  "---","id: concept-activation","type: concept","title: Activation","tags: [growth, product]","status: active","domain: [growth]","created: 2026-02-26","---","",
  "# Activation","",
  "The moment a new user first gets real value — for Lumina, seeing their first live dashboard. Weak activation is the funnel bottleneck in [[framework-pirate-metrics]] and the target of [[project-activation-experiments]]."
].join("\n") },

// ───────────────────────── IDEAS (type: idea) ─────────────────────────
{ id: "idea-self-serve-analytics", raw: [
  "---","id: idea-self-serve-analytics","type: idea","title: Self-serve analytics in minutes","tags: [product, thesis]","status: active","domain: [product]","created: 2026-01-02","---","",
  "# Self-serve analytics in minutes","",
  "The founding thesis of [[client-lumina]]: a product team should get a working dashboard in minutes, without a data engineer. The incumbents win on power but lose on time-to-value.","",
  "Everything downstream — [[concept-ideal-customer-profile]], [[methodology-north-star-metric]] on activation — traces back to this."
].join("\n") },

{ id: "idea-usage-based-pricing", raw: [
  "---","id: idea-usage-based-pricing","type: idea","title: Usage-based pricing tier","tags: [pricing]","status: active","domain: [pricing]","created: 2026-04-18","---","",
  "# Usage-based pricing tier","",
  "A seat + usage hybrid for power teams, sparked by a peer founder's expansion numbers. Became [[decision-usage-based-pricing]]; aims at [[concept-expansion-revenue]]."
].join("\n") },

{ id: "idea-in-app-templates", raw: [
  "---","id: idea-in-app-templates","type: idea","title: In-app dashboard templates","tags: [product, growth]","status: active","domain: [product]","created: 2026-05-01","---","",
  "# In-app dashboard templates","",
  "Ship starter dashboard templates so new users hit [[concept-activation]] faster. A candidate experiment for [[project-activation-experiments]]; directly answers [[learning-onboarding-friction]]."
].join("\n") },

{ id: "idea-weekly-digest-email", raw: [
  "---","id: idea-weekly-digest-email","type: idea","title: Weekly insight digest email","tags: [product, retention]","status: active","domain: [product]","created: 2026-05-04","---","",
  "# Weekly insight digest email","",
  "Auto-email each team a weekly summary of their key metrics to pull them back into the product — a retention lever in [[framework-pirate-metrics]]. Relates to [[learning-champion-departure-risk]]: a digest keeps value visible even when the champion leaves."
].join("\n") },

// ───────────────────────── LEARNINGS (type: learning) ─────────────────────────
{ id: "learning-onboarding-friction", raw: [
  "---","id: learning-onboarding-friction","type: learning","title: Onboarding friction at workspace setup","tags: [product, onboarding]","status: active","domain: [product]","severity: high","created: 2026-03-12","---","",
  "# Onboarding friction at workspace setup","",
  "Usability testing in [[project-dashboard-redesign]] showed users stall at workspace creation — too many choices before any value. Root cause of the [[concept-activation]] dip.","",
  "Drove [[project-activation-experiments]] and the [[idea-in-app-templates]] experiment."
].join("\n") },

{ id: "learning-pipeline-dropped-events", raw: [
  "---","id: learning-pipeline-dropped-events","type: learning","title: Legacy pipeline drops events under load","tags: [engineering, incident]","status: active","domain: [engineering]","severity: critical","created: 2026-03-02","---","",
  "# Legacy pipeline drops events under load","",
  "During a customer traffic spike the legacy ingestion stack silently dropped ~4% of events. Tuning didn't hold. This was the evidence behind [[decision-event-pipeline-rebuild]] and [[project-event-pipeline-v2]]."
].join("\n") },

{ id: "learning-smb-low-retention", raw: [
  "---","id: learning-smb-low-retention","type: learning","title: SMB segment retains poorly","tags: [growth, retention]","status: active","domain: [growth]","severity: high","created: 2026-03-16","---","",
  "# SMB segment retains poorly","",
  "Cohort analysis showed solo/SMB accounts churn fast — the need is real but not recurring enough. Evidence behind [[decision-move-upmarket]] and the retention story in [[framework-pirate-metrics]]."
].join("\n") },

{ id: "learning-champion-departure-risk", raw: [
  "---","id: learning-champion-departure-risk","type: learning","title: Single-champion accounts are fragile","tags: [sales, retention]","status: active","domain: [sales]","severity: high","created: 2026-05-06","---","",
  "# Single-champion accounts are fragile","",
  "[[client-northwind]] put renewal at risk the moment its champion left — no second stakeholder was bought in. Pattern flagged from [[meeting-2026-05-06-northwind-qbr]]; threatens [[deal-northwind-expansion]].","",
  "Motivates a multi-threading habit in [[playbook-founder-led-sales]] and the [[idea-weekly-digest-email]] retention lever."
].join("\n") },

// ───────────────────────── ARTIFACTS (type: artifact) ─────────────────────────
{ id: "artifact-pitch-deck", raw: [
  "---","id: artifact-pitch-deck","type: artifact","title: Series A pitch deck","tags: [fundraising]","status: active","domain: [fundraising]","artifact_kind: deck","date_started: 2026-04-01","date_closed: 2026-04-20",
  "project: project-series-a-raise","---","",
  "# Series A pitch deck","",
  "The deck for [[project-series-a-raise]], structured around [[methodology-narrative-fundraising]]. Shared with [[person-investor-dana-kim]] after [[meeting-2026-04-22-investor-coffee]]."
].join("\n") },

{ id: "artifact-data-room", raw: [
  "---","id: artifact-data-room","type: artifact","title: Investor data room","tags: [fundraising]","status: active","domain: [fundraising]","artifact_kind: doc","date_started: 2026-04-05",
  "project: project-series-a-raise","---","",
  "# Investor data room","",
  "Metrics, cohorts, and contracts packaged for diligence on [[project-series-a-raise]]. Requested by [[person-investor-dana-kim]]."
].join("\n") },

{ id: "artifact-pipeline-arch-doc", raw: [
  "---","id: artifact-pipeline-arch-doc","type: artifact","title: Pipeline v2 architecture doc","tags: [engineering]","status: active","domain: [engineering]","artifact_kind: doc","date_started: 2026-03-06",
  "project: project-event-pipeline-v2","---","",
  "# Pipeline v2 architecture doc","",
  "The design for [[project-event-pipeline-v2]], owned by [[person-raj-patel]]. Embodies [[decision-event-pipeline-rebuild]]."
].join("\n") },

{ id: "artifact-dashboard-spec", raw: [
  "---","id: artifact-dashboard-spec","type: artifact","title: Dashboard redesign spec","tags: [design, product]","status: completed","domain: [product]","artifact_kind: spec","date_started: 2026-02-02","date_closed: 2026-02-26",
  "project: project-dashboard-redesign","---","",
  "# Dashboard redesign spec","",
  "The shipped spec from [[project-dashboard-redesign]], authored by [[person-elena-soto]] and framed with [[methodology-jobs-to-be-done]]."
].join("\n") },

];
