-- One-way workshop — client exercise responses.
-- Each row = one client's submission for one exercise on their workspace page.
-- payload is exercise-specific JSON (matrix positions, rankings, voice refs, etc.).
--
-- The accumulating record per client = the input the proposal agent reads back
-- (compounding knowledge). Append-only: a re-submit writes a new row, never
-- overwrites — the chronology is the signal.

CREATE TABLE IF NOT EXISTS exercise_responses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL REFERENCES workspaces(slug) ON DELETE CASCADE,
  exercise    TEXT        NOT NULL,        -- 'jtbd-matrix' | 'problem-rank' | 'current-solutions' | 'entry-points'
  payload     JSONB       NOT NULL,        -- exercise-specific structured answer
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exercise_responses_slug_idx
  ON exercise_responses (slug, exercise, created_at DESC);

-- Server always uses the service-role key (bypasses RLS); policies are
-- defence-in-depth only — no public read/write.
ALTER TABLE exercise_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no_public_read_responses" ON exercise_responses
  FOR SELECT TO anon USING (FALSE);

CREATE POLICY "no_public_write_responses" ON exercise_responses
  FOR ALL TO anon USING (FALSE);
