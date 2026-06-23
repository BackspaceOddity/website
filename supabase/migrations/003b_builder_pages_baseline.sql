-- 003b_builder_pages_baseline.sql
-- BSO-665 (migration drift): `builder_pages` was created + RLS-enabled out-of-band —
-- migrations 004 and 006 only ALTER it (ADD COLUMN IF NOT EXISTS), and no file ever
-- CREATEd the table or enabled its RLS, so a fresh DB rebuilt from supabase/migrations/
-- would fail at 004 (ALTER of a non-existent table). This baseline captures the table
-- as it existed BEFORE 004/006, sorted before them, so a clean rebuild reproduces
-- production: 003b creates it → 004 adds publish columns → 006 adds `ds`.
--
-- Idempotent (IF NOT EXISTS / guarded policies). NOT re-applied to the already-correct
-- live project cgfifhprwfyurusfbxlb — it is a fresh-rebuild reconciliation baseline; the
-- live table + its RLS already exist. See BSO-665.

create table if not exists public.builder_pages (
  id          text primary key,
  title       text,
  tab         text,
  blocks      jsonb       not null default '[]'::jsonb,
  styles      jsonb,
  real_page   text,
  archived    boolean     not null default false,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Server-only access via the service-role key (bypasses RLS); RLS-on with deny-all
-- anon policies = defence-in-depth, matching 007. No browser reads this table directly.
alter table public.builder_pages enable row level security;

do $$ begin
  create policy "no_public_read_builder_pages" on public.builder_pages
    for select to anon using (false);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "no_public_write_builder_pages" on public.builder_pages
    for all to anon using (false);
exception when duplicate_object then null; end $$;
