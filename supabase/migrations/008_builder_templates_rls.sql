-- 008_builder_templates_rls.sql
-- BSO-663 (P0): `builder_templates` shipped with Row-Level Security OFF — migration 005
-- created it without `enable row level security`. The `public` schema is auto-exposed by
-- PostgREST to the `anon` role (whose key ships in the client bundle), so anyone with the
-- project URL could read/write every row via /rest/v1/builder_templates — a template-
-- poisoning vector (anon writes a row, an editor later inserts it onto a page).
--
-- Fix: enable RLS + deny-all anon policies (mirrors 007). The server uses the service-role
-- key, which bypasses RLS, so application behaviour is unchanged. Idempotent.
-- Applied to project cgfifhprwfyurusfbxlb on 2026-06-23; this file version-controls it.

alter table public.builder_templates enable row level security;

do $$ begin
  create policy "no_public_read_builder_templates" on public.builder_templates
    for select to anon using (false);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "no_public_write_builder_templates" on public.builder_templates
    for all to anon using (false);
exception when duplicate_object then null; end $$;
