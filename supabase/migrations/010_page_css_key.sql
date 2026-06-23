-- BSO-682 canonical page model, increment 1: the stylesheet is a STORED property
-- of the page, not inferred by branchy code (debt #3 — config as data).
--
-- Before: the editor (activeDs) and the published route each re-derived the
-- stylesheet from `ds` + special-cases for the two built-in real pages
-- (p8fig/pbt). A DB copy of a built-in (the 8figures import) could not get the
-- right sheet, because css was code, not data.
--
-- After: every page carries its own css_key (draft) + published_css_key
-- (the pinned sheet at publish time). Additive + backward-compatible: readers
-- fall back to the old derivation when these are null.
--
-- Backfill reproduces the EXACT current resolution, so no rendered page changes.

alter table public.builder_pages add column if not exists css_key text;
alter table public.builder_pages add column if not exists published_css_key text;

-- Draft stylesheet: built-in real pages keep their own sheet; everything else
-- maps its design-system id to the stylesheet (bso→pbt, urembo→urembo, kos→kos, quiet→quiet).
update public.builder_pages
set css_key = coalesce(css_key, case
  when id = 'p8fig' or real_page = 'p8fig' then 'p8fig'
  when id = 'pbt'   or real_page = 'pbt'   then 'pbt'
  when ds = 'urembo' then 'urembo'
  when ds = 'kos'    then 'kos'
  when ds = 'quiet'  then 'quiet'
  else 'pbt'
end);

-- Published stylesheet: same rule, keyed off the published snapshot's real_page.
update public.builder_pages
set published_css_key = coalesce(published_css_key, case
  when published_real_page = 'p8fig' then 'p8fig'
  when published_real_page = 'pbt'   then 'pbt'
  when ds = 'urembo' then 'urembo'
  when ds = 'kos'    then 'kos'
  when ds = 'quiet'  then 'quiet'
  else 'pbt'
end)
where published is true;
