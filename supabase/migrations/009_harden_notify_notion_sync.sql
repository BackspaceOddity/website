-- BSO-672 — harden public.notify_notion_sync() (pre-existing /w Notion-sync trigger fn).
--
-- Observed live (2026-06-23) on project cgfifhprwfyurusfbxlb:
--   • SECURITY DEFINER = true
--   • search_path = null (mutable)  → advisor function_search_path_mutable
--   • EXECUTE granted to anon AND authenticated  → advisor anon_security_definer_function_executable
--   • the function is invoked by trigger on_exercise_response_insert ON public.exercise_responses
--     (INSERT). Triggers run the function regardless of the caller's EXECUTE privilege, so
--     revoking direct-RPC EXECUTE does NOT break the legit insert→trigger→POST-to-Notion path.
--
-- This migration does NOT touch the function body. The hardcoded x-sync-secret literal still
-- lives in the body — rotating it requires changing the receiving endpoint's config too, so that
-- is handled separately by the /w owners (tracked on BSO-672).

-- NOTE: revoking from anon/authenticated alone is NOT enough — Postgres grants EXECUTE to
-- PUBLIC by default, and anon/authenticated inherit it. Must revoke from PUBLIC too, otherwise
-- the ACL keeps `=X/postgres` (the PUBLIC grant) and the roles can still call it via RPC.
revoke execute on function public.notify_notion_sync() from public, anon, authenticated;

alter function public.notify_notion_sync() set search_path = public, pg_temp;
