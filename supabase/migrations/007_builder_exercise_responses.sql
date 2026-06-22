-- 007_builder_exercise_responses.sql
-- Client responses to interactive exercise blocks on PUBLISHED builder pages.
-- Each row = one client submission of one exercise on one published page.
-- payload is exercise-specific JSON (matrix placements, rankings, chip picks,
-- free-text solutions, and — for the matrix — voice notes as data URLs).
--
-- Append-only: a re-submit writes a new row, never overwrites. The chronology
-- is the signal (mirrors the /w `exercise_responses` model, BSO-583).
--
-- Writes always go through the server with the service-role key (RLS bypassed);
-- the public endpoint validates that page_slug is a published builder page before
-- inserting. Policies below are defence-in-depth — no public read/write.
--
-- Idempotent. Apply to project cgfifhprwfyurusfbxlb (bso-proposals).

CREATE TABLE IF NOT EXISTS builder_exercise_responses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug   TEXT        NOT NULL,        -- the published page's slug
  exercise    TEXT        NOT NULL,        -- exercise block's exerciseId
  payload     JSONB       NOT NULL,        -- exercise-specific structured answer
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS builder_exercise_responses_slug_idx
  ON builder_exercise_responses (page_slug, exercise, created_at DESC);

ALTER TABLE builder_exercise_responses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "no_public_read_builder_responses" ON builder_exercise_responses
    FOR SELECT TO anon USING (FALSE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "no_public_write_builder_responses" ON builder_exercise_responses
    FOR ALL TO anon USING (FALSE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
