-- BSO-682 canonical page model, increment 2: publish = pin a VERSION, not duplicate columns.
--
-- Before: a published page copied its draft into a parallel set of published_* columns
-- on the same row (representation #3 in the architecture assessment). No history, no
-- rollback, no provenance — "the published version" was just the last copy.
--
-- After: a page_versions table holds immutable snapshots; builder_pages.published_version_id
-- points at the pinned published snapshot. Additive + safe: the publish route dual-writes
-- (versions table AND the legacy published_* columns), and the render route reads the
-- version first and falls back to published_* — so live pages never break during transition.
--
-- Backfill snapshots each currently-published page's published_* into a version row and
-- pins it, so the live pages immediately render from the new path.

create table if not exists public.builder_page_versions (
  id          uuid primary key default gen_random_uuid(),
  page_id     text not null,
  label       text,
  blocks      jsonb not null default '[]'::jsonb,
  styles      jsonb,
  css_key     text,
  real_page   text,
  title       text,
  created_at  timestamptz not null default now(),
  created_by  text
);

create index if not exists builder_page_versions_page_idx
  on public.builder_page_versions (page_id, created_at desc);

alter table public.builder_pages add column if not exists published_version_id uuid;

with ins as (
  insert into public.builder_page_versions
    (page_id, label, blocks, styles, css_key, real_page, title, created_at, created_by)
  select id, 'Published (backfill)',
         coalesce(published_blocks, '[]'::jsonb), published_styles, published_css_key,
         published_real_page, published_title,
         coalesce(published_at, now()), coalesce(published_by, 'backfill')
  from public.builder_pages
  where published is true and published_version_id is null
  returning id as version_id, page_id
)
update public.builder_pages p
set published_version_id = ins.version_id
from ins
where ins.page_id = p.id;
