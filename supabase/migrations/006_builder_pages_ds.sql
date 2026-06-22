-- 006_builder_pages_ds.sql
-- Each page belongs to a design system (chosen at creation). 'bso' = Backspace
-- Oddity DS (8Figures + Brand Transformation are its instances); future: 'urembo'.
-- Idempotent; already applied to project cgfifhprwfyurusfbxlb on 2026-06-22 via
-- the Supabase migration API — this file version-controls that change.

alter table builder_pages add column if not exists ds text not null default 'bso';
update builder_pages set ds='bso' where ds is null or ds='';
