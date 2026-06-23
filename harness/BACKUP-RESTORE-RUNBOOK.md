# Kern (Landing Builder) — backup & restore runbook

**BSO-673.** Status of the audit's D4 gap: the restore *procedure* below is written; the
one thing still needing a human is **confirming the Supabase backup tier** (only visible in
the dashboard, Yegor's access). Do that before real client data lives in these tables.

## What needs protecting

All builder state is in Supabase project `cgfifhprwfyurusfbxlb` (bso-proposals), in three tables:

| Table | Holds | Loss impact |
|---|---|---|
| `builder_pages` | every page — draft (`blocks`/`styles`/`ds`) **and** its published snapshot (`published_*`) | a deleted/clobbered row loses both the draft and the live page |
| `builder_exercise_responses` | client workshop answers (matrix/rank/chips/solutions/lock/notes), append-only | lost client input — not regenerable |
| `builder_templates` | shared saved sections | re-creatable by hand, low impact |

## Step 0 — confirm the backup tier (Yegor, one-time)

Supabase dashboard → project `cgfifhprwfyurusfbxlb` → **Database → Backups**.

- **Free / Pro without PITR:** only **daily** logical backups, ~7-day retention. A restore
  loses up to 24h and is **whole-project** (you cannot restore one table).
- **Pro + PITR add-on:** point-in-time recovery to any second within the retention window
  (2–28 days). This is what you want once real client data is in.

Recorded (observed in dashboard 2026-06-23): `TIER: Pro | RETENTION: daily, 7 days | PITR: NO (off)`.
To enable PITR the project must first move to compute ≥ Small (paid), then the PITR add-on:
7 days = $100/mo, 14 days = $200/mo, 28 days = $400/mo (+ the compute upsize). So PITR is a
real monthly spend, not a free toggle — deferred until the first real client (see Step 0 reco).

**Recommendation:** before onboarding a real client, enable PITR (Pro add-on). Workshop
responses are not regenerable, so a 24h daily-only window is the real exposure.

## Step 1 — restore a single deleted / clobbered page

A page row was deleted or its blocks overwritten.

- **With PITR:** dashboard → Backups → Restore → pick a timestamp *just before* the bad
  write. Note: PITR restores the **whole project** to that point — coordinate (any writes
  after that timestamp are lost). For a single-row recovery without a full rollback, prefer
  Step 1b.
- **1b — surgical single-row recover (no full rollback):** if you have any recent SQL dump
  or a PITR *branch*, spin a restore into a Supabase **branch**, then copy just the one row
  out and UPSERT it back into production:
  ```sql
  -- on the restored branch: grab the good row
  select * from builder_pages where id = '<page-id>';
  -- on production: re-insert it (service-role / SQL editor)
  insert into builder_pages (id, title, tab, blocks, styles, real_page, archived,
    updated_at, updated_by, slug, published, published_blocks, published_styles,
    published_real_page, published_title, published_at, published_by, ds)
  values (...)  -- from the restored row
  on conflict (id) do update set blocks = excluded.blocks, styles = excluded.styles,
    published_blocks = excluded.published_blocks, published_styles = excluded.published_styles,
    published = excluded.published, slug = excluded.slug, ds = excluded.ds;
  ```

## Step 2 — recover lost exercise responses

`builder_exercise_responses` is **append-only**, so loss only happens via a table-wide
delete or a project-level incident. Recover the same way (PITR/branch → copy rows back):
```sql
insert into builder_exercise_responses (id, page_slug, exercise, payload, created_at)
select id, page_slug, exercise, payload, created_at
from <restored-branch>.public.builder_exercise_responses
on conflict (id) do nothing;   -- idempotent; never overwrite a survivor
```

## Step 3 — rebuild the schema from scratch (worst case)

If the project is gone, a fresh Supabase project + `supabase/migrations/` reproduces the
schema (this is what BSO-665 fixed — `003b` baseline + `008` RLS make the migration set
self-sufficient). Data still has to come from a backup; migrations rebuild structure only.

## Blast radius summary

- **Single bad edit** → Step 1b (surgical), no downtime.
- **Table-wide delete** → Step 2 (append-only, copy back).
- **Project loss** → Step 3 (migrations rebuild structure) + latest backup (data).
- **PITR off** → max 24h data loss on any of the above. Close this before real clients.
