#!/usr/bin/env node
/**
 * Scaffold a new interactive proposal page from the canon blueprint.
 *
 * Creates `lib/proposal-workspace/clients/<slug>.ts` pre-filled with the
 * canonical section structure (docHeader → 01 heardIt → 02 beforeAfter →
 * 03 narrative+bullets → 04 processFlow → 06 nextSteps → 07 discussion →
 * footer) and wires it into `clients/index.ts` (import + registry row).
 *
 * Content is placeholder TODOs — fill from the lead's transcript/notes,
 * never invent claims. Typography defaults (20px / weight 300) live in
 * styles.ts globally, so a new page inherits them automatically.
 *
 * Canon: AI-Native GTM/Client Proposal Agent/docs/interactive-proposal-canon.md
 *
 * Usage:
 *   node scripts/new-proposal.mjs <slug> "<Client Name>" "<For Person>"
 * Example:
 *   node scripts/new-proposal.mjs acme "Acme Co" "Jane Doe"
 *
 * Idempotent: refuses to overwrite an existing client file.
 * After scaffolding it prints the onboarding + deploy next steps.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(__dirname, '..');
const clientsDir = path.join(repo, 'lib', 'proposal-workspace', 'clients');

const [, , slug, clientName, forPerson] = process.argv;

if (!slug || !clientName) {
  console.error('Usage: node scripts/new-proposal.mjs <slug> "<Client Name>" "<For Person>"');
  process.exit(1);
}
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(`Bad slug "${slug}". Use lowercase letters, digits, dashes; start with a letter (e.g. "acme", "acme-co").`);
  process.exit(1);
}

const varName = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()) + 'Page';
const recipient = forPerson || clientName;
const filePath = path.join(clientsDir, `${slug}.ts`);

if (fs.existsSync(filePath)) {
  console.error(`Refusing to overwrite existing ${path.relative(repo, filePath)}. Pick a new slug or edit the file directly.`);
  process.exit(1);
}

/** The canon blueprint as a ready-to-edit ClientPage. Placeholders are TODOs. */
const template = `/**
 * ${clientName} — initial assessment (interactive proposal page).
 *
 * Scaffolded from the canon: AI-Native GTM/Client Proposal Agent/docs/interactive-proposal-canon.md
 *
 * FILL every TODO from the lead's transcript / notes — never invent claims
 * about the client. Cut any block that doesn't earn its place. The §05
 * "what stayed with us" credibility block is intentionally absent (filler).
 *
 * STATUS: DRAFT — pass ToV + Yegor review before onboarding + deploy.
 */

import type { ClientPage } from '../types';

export const ${varName}: ClientPage = {
  slug: '${slug}',
  title: '${clientName} — Initial Assessment',
  blocks: [
    {
      block: 'docHeader',
      label: 'Initial Assessment · ${clientName}',
      meta: 'Prepared by Backspace Oddity · for ${recipient}',
      version: 'Conceptual proposal', // canon: never "Draft"
      date: 'TODO month YYYY',
    },

    {
      block: 'heardIt',
      sectionNum: '01 — How we heard it',
      heading: 'The task, as we understood it',
      statement:
        'TODO one-line reframe of what is actually slowing them down (mirror, plain).',
      body: [
        'TODO 2-3 sentences restating their situation so they think "yes, exactly".',
      ],
      pills: ['TODO', 'TODO', 'TODO'],
    },

    { block: 'divider' },

    {
      block: 'beforeAfter',
      sectionNum: '02 — The core challenge',
      heading: 'TODO the core challenge in one line',
      intro: 'TODO one sentence framing the bottleneck, in their words.',
      before: {
        label: 'Today',
        core: 'TODO punchy state-of-pain (no trailing period)',
        body: 'TODO concrete walk-through of the manual/slow path today.',
      },
      after: {
        label: 'Where this goes',
        core: 'TODO punchy target state (no trailing period)',
        body: 'TODO what changes once the first workflow runs on its own.',
      },
      note:
        'TODO the thesis line — why this is the thing to fix first (renders dark).',
    },

    { block: 'divider' },

    {
      block: 'narrative',
      sectionNum: '03 — Where we’d start',
      heading: 'Our read on the first move',
      body: [
        'TODO short prose lead: the same way we work — take the one workflow that costs the most time and rebuild it with AI inside, so within weeks they run it without us.',
      ],
      bullets: [
        'TODO thesis 1 — complete thought (claim + why), not a fragment.',
        'TODO thesis 2 — the first build, named concretely.',
        'TODO thesis 3 — where they stay in the loop vs what runs on its own.',
      ],
      example:
        'TODO one concrete "the same engine also gives you X" line.',
    },

    { block: 'divider' },

    {
      block: 'processFlow',
      sectionNum: '04 — What it might look like', // canon: tentative, it's a hypothesis
      heading: 'TODO their workflow, automated',
      intro: 'A walk-through of the first build, on your actual process. We’d tailor this together.',
      steps: [
        { title: 'TODO step 1', desc: 'TODO' },
        { title: 'TODO step 2', desc: 'TODO' },
        {
          title: 'Decision',
          desc: 'Every case sorts itself into one of two paths.',
          branches: [
            { label: 'TODO clean path', body: 'TODO activates on its own.', primary: true },
            { label: 'TODO needs a look', body: 'TODO routes to you with the reason attached.' },
          ],
        },
        { title: 'TODO final step', desc: 'TODO' },
      ],
    },

    { block: 'divider' },

    {
      block: 'nextSteps',
      sectionNum: '06 — From our side',
      heading: 'What happens next',
      intro:
        'This is our read, not a proposal yet. The next step is a short call to discuss it together and agree where to actually start.',
      steps: [
        { title: 'You react to this read', desc: 'TODO tell us where it’s right and where it’s off — especially section 04.' },
        { title: 'We scope the first build', desc: 'TODO turn it into a concrete first project — what’s in, what "done" looks like.' },
        { title: 'Turn the pilot into a system', desc: 'TODO the bigger goals become a real next conversation, on solid ground.' },
      ],
    },

    {
      block: 'discussion',
      sectionNum: '07 — To align on',
      heading: 'Questions for our next call',
      intro: 'Add your own — this page is yours, and we’ll keep building on it as we go.',
      questions: [
        { q: 'TODO question 1?', note: 'TODO why it matters / what it unlocks.' },
        { q: 'TODO question 2?', note: 'TODO.' },
        { q: 'TODO question 3?', note: 'TODO.' },
      ],
    },

    {
      block: 'docFooter',
      left: 'Initial Assessment · Not a proposal',
      right: 'backspaceoddity.com',
    },
  ],
};
`;

fs.writeFileSync(filePath, template);

// --- wire into clients/index.ts (import + registry row) ---
const indexPath = path.join(clientsDir, 'index.ts');
let idx = fs.readFileSync(indexPath, 'utf8');

if (idx.includes(`'${slug}':`) || idx.includes(`from './${slug}'`)) {
  console.log(`\n✓ Created ${path.relative(repo, filePath)}`);
  console.log(`  (registry already references "${slug}" — left index.ts untouched.)`);
} else {
  // insert import after the last client import line
  const importLine = `import { ${varName} } from './${slug}';`;
  const importRe = /import \{[^}]+\} from '\.\/[^']+';\n(?![\s\S]*import \{[^}]+\} from '\.\/)/;
  idx = idx.replace(importRe, (m) => m + importLine + '\n');
  // insert registry row right after the opening brace of the clients record
  idx = idx.replace(
    /(export const clients: Record<string, ClientEntry> = \{\n)/,
    `$1  '${slug}': { page: ${varName} },\n`,
  );
  fs.writeFileSync(indexPath, idx);
  console.log(`\n✓ Created ${path.relative(repo, filePath)}`);
  console.log(`✓ Wired into clients/index.ts (import + registry row).`);
}

console.log(`\nNext steps:`);
console.log(`  1. Fill every TODO in clients/${slug}.ts from the lead's transcript/notes.`);
console.log(`  2. Review via Edit Mode on localhost; bake any Tweaks into styles.ts.`);
console.log(`  3. Onboard the workspace (access code + Supabase + Notion map):`);
console.log(`       node --env-file=.env.local scripts/add-workspace.mjs ${slug} "${clientName}" --notion=<deal-page-id>`);
console.log(`  4. Deploy + alias the subdomain (see canon §6 runbook — swap edit-mode dep, vercel deploy --prod, vercel alias set <deploy> ${slug}.backspaceoddity.com).`);
console.log(`  5. Draft the cover email (canon §7) — link = subdomain, access-code line; Yegor pastes the code.`);
console.log(``);
