/**
 * BSO-586 — Instant sync of client submissions → their Notion Deal page.
 *
 * Triggered by a Supabase Database Webhook on INSERT into exercise_responses.
 * Flow: webhook → look up the workspace's notion_page_id → read the latest
 * response per exercise → upsert a single idempotent "Client submissions"
 * section in the Deal page (replace, never duplicate).
 *
 * Notion stays a view layer: the page route only writes Supabase; this server
 * route is the one-directional Supabase→Notion projection. Token is server-only.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const NOTION = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const SECTION_HEADING = 'Client submissions';

function nh(token: string) {
  return { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json' };
}

const txt = (s: string) => ({ type: 'text' as const, text: { content: s.slice(0, 1900) } });
const h2 = (s: string) => ({ object: 'block', type: 'heading_2', heading_2: { rich_text: [txt(s)] } });
const h3 = (s: string) => ({ object: 'block', type: 'heading_3', heading_3: { rich_text: [txt(s)] } });
const para = (s: string) => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: [txt(s)] } });
const bullet = (s: string) => ({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [txt(s)] } });

/** Render one exercise payload into Notion blocks. */
function renderExercise(exercise: string, payload: Record<string, unknown>): object[] {
  const blocks: object[] = [];
  if (exercise === 'client-questions') {
    const qs = (payload.questions as string[]) ?? [];
    blocks.push(h3('Questions the client added'));
    if (qs.length) qs.forEach((q) => blocks.push(bullet(q)));
    else blocks.push(para('—'));
  } else if (exercise === 'jtbd-matrix') {
    const items = (payload.placements as Array<Record<string, unknown>>) ?? [];
    blocks.push(h3('Importance × satisfaction (their rating)'));
    items.forEach((p) => {
      const c = p.comment ? ` — “${p.comment}”` : '';
      const audio = p.hasAudio ? ' [voice note]' : '';
      blocks.push(bullet(`${p.label}: importance ${p.importance}/10 · handled ${p.satisfaction}/10${c}${audio}`));
    });
  } else if (exercise === 'problem-rank') {
    blocks.push(h3('Problem ranking (most painful first)'));
    const groups = (payload.groups as Array<Record<string, unknown>>) ?? [];
    groups.forEach((g) => {
      blocks.push(bullet(`${g.jobLabel}: ${((g.order as string[]) ?? []).join(' → ')}`));
    });
  } else if (exercise === 'current-solutions') {
    blocks.push(h3('What they do today'));
    const ans = (payload.answers as Record<string, string>) ?? {};
    Object.entries(ans).forEach(([k, v]) => v && blocks.push(bullet(`${k}: ${v}`)));
  } else if (exercise === 'entry-points') {
    blocks.push(h3('Category entry points'));
    const picks = (payload.picks as Record<string, string[]>) ?? {};
    Object.entries(picks).forEach(([k, v]) => blocks.push(bullet(`${k}: ${(v ?? []).join(', ')}`)));
  } else {
    blocks.push(h3(exercise));
    blocks.push(para(JSON.stringify(payload).slice(0, 1900)));
  }
  return blocks;
}

export async function POST(req: Request) {
  // Shared gate — the Supabase webhook sends this header.
  const gate = process.env['WS_SYNC_SECRET'];
  if (gate && req.headers.get('x-sync-secret') !== gate) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const token = process.env.NOTION_TOKEN;
  if (!token || !supabase) {
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* allow manual trigger with empty body */ }
  // Supabase webhook shape: { type, table, record: {...} }. Fall back to ?slug=.
  const record = (body.record as Record<string, unknown>) ?? {};
  const url = new URL(req.url);
  const slug = String(record.slug ?? url.searchParams.get('slug') ?? '');
  if (!slug) return NextResponse.json({ error: 'no slug' }, { status: 400 });

  // 1. resolve the target Notion page
  const { data: ws } = await supabase
    .from('workspaces').select('notion_page_id').eq('slug', slug).maybeSingle();
  const pageId = ws?.notion_page_id as string | undefined;
  if (!pageId) return NextResponse.json({ ok: true, skipped: 'no notion_page_id for slug' });

  // 2. latest response per exercise for this slug
  const { data: rows } = await supabase
    .from('exercise_responses')
    .select('exercise,payload,created_at')
    .eq('slug', slug)
    .order('created_at', { ascending: false });
  const latest = new Map<string, Record<string, unknown>>();
  for (const r of rows ?? []) if (!latest.has(r.exercise)) latest.set(r.exercise, r.payload);

  // 3. build the section blocks
  const children: object[] = [
    h2(SECTION_HEADING),
    para(`Synced from the live workspace · last updated ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC`),
  ];
  const order = ['client-questions', 'jtbd-matrix', 'problem-rank', 'entry-points', 'current-solutions'];
  const keys = [...latest.keys()].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  for (const ex of keys) children.push(...renderExercise(ex, latest.get(ex)!));
  if (keys.length === 0) children.push(para('No submissions yet.'));

  // 4. idempotent upsert: delete the previous section (heading + everything after it), then append fresh
  const listed = await fetch(`${NOTION}/blocks/${pageId}/children?page_size=100`, { headers: nh(token) });
  if (!listed.ok) return NextResponse.json({ error: 'notion list failed', status: listed.status }, { status: 502 });
  const existing = (await listed.json()).results as Array<Record<string, unknown>>;
  const idx = existing.findIndex((b) =>
    b.type === 'heading_2' &&
    (((b.heading_2 as Record<string, unknown>)?.rich_text as Array<Record<string, unknown>>) ?? [])
      .map((t) => t.plain_text).join('').trim() === SECTION_HEADING);
  if (idx >= 0) {
    // delete the heading and all blocks after it (our section lives at the bottom)
    for (const b of existing.slice(idx)) {
      await fetch(`${NOTION}/blocks/${b.id}`, { method: 'DELETE', headers: nh(token) });
    }
  }
  // Notion append caps at 100 children/call
  for (let i = 0; i < children.length; i += 90) {
    const chunk = children.slice(i, i + 90);
    const app = await fetch(`${NOTION}/blocks/${pageId}/children`, {
      method: 'PATCH', headers: nh(token), body: JSON.stringify({ children: chunk }),
    });
    if (!app.ok) return NextResponse.json({ error: 'notion append failed', status: app.status, detail: await app.text() }, { status: 502 });
  }

  return NextResponse.json({ ok: true, slug, pageId, exercises: keys });
}
