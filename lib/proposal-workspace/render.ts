/**
 * Interactive Proposal Workspace — renderer (v1)
 *
 * Assembles a ClientPage data file into a full HTML document: shared DS +
 * theme chrome + (dev-only) edit panel + the ordered blocks.
 */

import type { Block, ClientPage } from './types';
import { styles } from './styles';
import { themeHeadScript, themeToggle, editModeScript } from './chrome';
import * as B from './blocks';

export function renderBlock(block: Block): string {
  switch (block.block) {
    case 'docHeader':     return B.docHeader(block);
    case 'divider':       return B.divider(block);
    case 'statement':     return B.statement(block);
    case 'heardIt':       return B.heardIt(block);
    case 'beforeAfter':   return B.beforeAfter(block);
    case 'emphasisFrame': return B.emphasisFrame(block);
    case 'narrative':     return B.narrative(block);
    case 'demo':          return B.demo(block);
    case 'whatStayed':    return B.whatStayed(block);
    case 'nextSteps':     return B.nextSteps(block);
    case 'discussion':    return B.discussion(block);
    case 'docFooter':     return B.docFooter(block);
    default: {
      // Exhaustiveness guard — a new Block variant must be handled above.
      const _never: never = block;
      return _never;
    }
  }
}

export function renderPage(page: ClientPage, opts: { editMode: boolean }): string {
  const body = page.blocks.map(renderBlock).join('\n\n');
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
