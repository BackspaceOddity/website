/**
 * Builder-local lightweight renderer for proposal-workspace blocks.
 *
 * Mirrors lib/proposal-workspace/render.ts#renderBlock but:
 *   - passes EMPTY saved responses (builder shows default/empty block state),
 *     so it never imports the server-only responses.ts (fs/Supabase).
 *   - returns per-block HTML (no full <html> document, no theme/edit chrome).
 *
 * This is the foundation for variant 2: real, deterministic blocks rendered in
 * the builder, wrapped by the builder's own select/reorder/tweak chrome.
 */
import * as B from './blocks';
import { styles } from './styles';
import type { Block, ClientPage } from './types';

export function renderBlockLite(block: Block, slug: string): string {
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
    case 'discussion':     return B.discussion(block, slug);
    case 'clientInput':    return B.clientInput(block, slug);
    case 'bookingEmbed':   return B.bookingEmbed(block, slug);
    case 'exerciseMatrix': return B.exerciseMatrix(block, slug);
    case 'exerciseRank':   return B.exerciseRank(block, slug);
    case 'exerciseChips':  return B.exerciseChips(block, slug);
    case 'exerciseSolutions': return B.exerciseSolutions(block, slug);
    case 'docFooter':      return B.docFooter(block);
    default:               return '';
  }
}

export function pwStyles(): string {
  return styles;
}

export function renderClientPageBlocks(page: ClientPage): { block: Block; html: string }[] {
  return page.blocks.map((b) => ({ block: b, html: renderBlockLite(b, page.slug) }));
}
