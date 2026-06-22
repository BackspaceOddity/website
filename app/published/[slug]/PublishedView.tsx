'use client';
/*
 * Public render of a published Landing Builder page (BSO-658).
 * Mirrors BuilderApp.renderCanvas() EXACTLY — the `page bt-page` wrapper plus
 * one BT_COMPONENTS[type] per block — but with no editor chrome and the edit
 * context turned off (e:{on:false}), so every section renders as plain output.
 */
import React from 'react';
import { BT_COMPONENTS } from '../../builder/blocks/realpages';

type Block = { id: string; type: string; props: any };

export default function PublishedView({ blocks }: { blocks: Block[] }) {
  return (
    <div className="page bt-page">
      {blocks.map((b) => {
        const Comp = (BT_COMPONENTS as any)[b.type];
        if (!Comp) return null;
        return <Comp key={b.id} {...b.props} e={{ on: false }} />;
      })}
    </div>
  );
}
