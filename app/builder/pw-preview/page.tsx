/**
 * Foundation proof for variant 2 — renders the REAL 8Figures proposal-workspace
 * blocks through the builder-local lite renderer + shared DS styles. No editing
 * chrome yet; this only verifies the existing block engine produces correct HTML
 * that we can later wrap with the builder's select/reorder/tweak shell.
 */
import { eightfiguresPage } from '../pw/eightfigures';
import { pwStyles, renderClientPageBlocks } from '../pw/render-lite';

export default function PwPreview() {
  const rendered = renderClientPageBlocks(eightfiguresPage);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pwStyles() }} />
      <div>
        {rendered.map((r, i) => (
          <div
            key={i}
            data-pw-block={r.block.block}
            dangerouslySetInnerHTML={{ __html: r.html }}
          />
        ))}
      </div>
    </>
  );
}
