-- BSO-684 step 5/6: per-page "render the live route from the canonical DB row" flag.
-- Replaces the EIGHTFIGURES_FROM_DB env flag with a per-page boolean so the switch
-- (and instant rollback) is data the app reads at request time — no Vercel env change,
-- no redeploy to flip. Aligns with BSO-683 (deploy target as page data).
-- Default false → additive, inert: every existing page keeps rendering its code/legacy path.
alter table public.builder_pages
  add column if not exists render_from_db boolean not null default false;
