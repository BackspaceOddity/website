-- 005_builder_templates.sql
-- Shared template library for the Landing Builder: a saved section (its type +
-- props + bg) that any logged-in editor can re-insert onto any page.
-- Idempotent; already applied to project cgfifhprwfyurusfbxlb on 2026-06-22 via
-- the Supabase migration API — this file version-controls that change.

create table if not exists builder_templates (
  id text primary key,
  name text not null,
  type text not null,
  props jsonb not null,
  bg text,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists builder_templates_created_at_idx
  on builder_templates (created_at desc);
