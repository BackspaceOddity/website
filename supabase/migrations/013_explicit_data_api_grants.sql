-- Explicit Data API grants (Supabase change of 2026-10-30).
--
-- From 2026-10-30 Supabase no longer grants Data API access automatically to new
-- tables in `public`. Existing tables keep their grants, but a fresh project, a
-- preview branch or `supabase db reset` would recreate these tables with no
-- privileges and PostgREST would answer 42501 (permission denied).
--
-- Posture of this project (see 001 / 002): the server always uses the
-- service-role key; anon is denied by RLS policies; authenticated is unused.
-- So service_role gets full table access and anon / authenticated get no grants
-- here. Nothing is revoked: live tables keep what the old defaults gave them.
--
-- Numbered 013, not 004: the builder branches already use 004–012, so this file
-- sorts after them and the ON ALL TABLES grant also covers the builder tables
-- once those branches land. The default privileges cover any table a later
-- migration creates. Idempotent; never applied by this commit.

grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public
  grant usage, select on sequences to service_role;
