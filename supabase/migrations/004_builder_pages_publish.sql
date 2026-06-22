-- 004_builder_pages_publish.sql
-- Adds the publish/deploy snapshot columns to builder_pages.
-- A published page keeps a frozen snapshot (published_*) so editing the draft
-- (blocks/styles) does NOT change the live page until the user re-publishes.
-- Idempotent: safe to re-run. Already applied to project cgfifhprwfyurusfbxlb
-- (bso-proposals) on 2026-06-22 via the Supabase migration API; this file
-- version-controls that change.

alter table builder_pages
  add column if not exists slug text,
  add column if not exists published boolean not null default false,
  add column if not exists published_blocks jsonb,
  add column if not exists published_styles jsonb,
  add column if not exists published_real_page text,
  add column if not exists published_title text,
  add column if not exists published_at timestamptz,
  add column if not exists published_by text;

-- A published slug must be unique across pages (only enforced while published,
-- so unpublished drafts can hold a null/duplicate slug freely).
create unique index if not exists builder_pages_slug_published_uniq
  on builder_pages (slug)
  where published = true and slug is not null;
