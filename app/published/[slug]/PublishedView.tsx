'use client';
/*
 * Public render of a published Landing Builder page (BSO-658).
 * Mirrors BuilderApp.renderCanvas() EXACTLY — the `page bt-page` wrapper plus
 * one BT_COMPONENTS[type] per block — but with no editor chrome and the edit
 * context turned off (e:{on:false}), so every section renders as plain output.
 */
import React from 'react';
import { BT_COMPONENTS } from '../../builder/blocks/realpages';
import { btVarStyle } from '../../builder/btVars';

type Block = { id: string; type: string; props: any };

export default function PublishedView({ blocks, styles, slug, seed }: { blocks: Block[]; styles?: any; slug?: string; seed?: any }) {
  // _ctx carries the published slug to interactive blocks (exercises) so client
  // answers post to the right page; _seed carries their prior submissions for
  // restore. Static blocks ignore both.
  const ctx = { slug };
  return (
    <div className="page bt-page" style={btVarStyle(styles?.bt)}>
      {blocks.map((b) => {
        const Comp = (BT_COMPONENTS as any)[b.type];
        if (!Comp) return null;
        return <Comp key={b.id} {...b.props} e={{ on: false }} _ctx={ctx} _seed={seed} />;
      })}
    </div>
  );
}
