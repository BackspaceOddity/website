/**
 * Interactive Proposal Workspace — renderer (v1)
 *
 * Assembles a ClientPage data file into a full HTML document: shared DS +
 * theme chrome + (dev-only) edit panel + the ordered blocks.
 */

import type { Block, ClientPage } from './types';
import { styles } from './styles';
import { themeHeadScript, themeToggle, editModeScript } from './chrome';
import { savedQuestions, savedDiscussionLock, savedMatrixPlacements, type SavedResponses } from './responses';
import * as B from './blocks';

export function renderBlock(block: Block, slug: string, responses: SavedResponses = {}): string {
  switch (block.block) {
    case 'docHeader':      return B.docHeader(block);
    case 'divider':        return B.divider(block);
    case 'statement':      return B.statement(block);
    case 'heardIt':        return B.heardIt(block, slug);
    case 'beforeAfter':    return B.beforeAfter(block);
    case 'emphasisFrame':  return B.emphasisFrame(block);
    case 'narrative':      return B.narrative(block);
    case 'demo':           return B.demo(block);
    case 'processFlow':    return B.processFlow(block);
    case 'phases':         return B.phases(block);
    case 'whatStayed':     return B.whatStayed(block);
    case 'nextSteps':      return B.nextSteps(block);
    case 'discussion':     return B.discussion(block, slug, savedDiscussionLock(responses) ?? undefined);
    case 'clientInput':    return B.clientInput(block, slug, savedQuestions(responses));
    case 'bookingEmbed':   return B.bookingEmbed(block, slug);
    case 'exerciseMatrix': return B.exerciseMatrix(block, slug, savedMatrixPlacements(responses, block.exerciseId));
    case 'exerciseRank':   return B.exerciseRank(block, slug);
    case 'exerciseChips':  return B.exerciseChips(block, slug);
    case 'exerciseSolutions': return B.exerciseSolutions(block, slug);
    case 'docFooter':      return B.docFooter(block);
    default: {
      // Exhaustiveness guard — a new Block variant must be handled above.
      const _never: never = block;
      return _never;
    }
  }
}

export function renderPage(
  page: ClientPage,
  opts: { editMode: boolean; responses?: SavedResponses },
): string {
  const body = page.blocks.map((b) => renderBlock(b, page.slug, opts.responses ?? {})).join('\n\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
${themeHeadScript}
<title>${escAttr(page.title)}</title>
<style>${styles}</style>
</head>
<body>

${body}

${themeToggle}
${opts.editMode ? editModeScript(page.slug) : ''}
</body>
</html>`;
}

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
