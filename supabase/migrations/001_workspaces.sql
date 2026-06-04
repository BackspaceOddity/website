-- Interactive Proposal Workspaces — client workspace registry
-- Run once in your Supabase project (SQL editor or supabase db push).
--
-- Each row = one client workspace (/w/<slug> or <slug>.backspaceoddity.com).
-- password is the RAW password string — the route handler derives the cookie
-- token via SHA256(password + ':pw:' + slug).slice(0,40), matching chrome.ts.
--
-- Pipeline auto-onboarding (M2/M3) inserts rows here when a new client is
-- activated. Yegor manually sets the password on the row; the pipeline
-- generates a random one and surfaces it via Slack/Notion.

CREATE TABLE IF NOT EXISTS workspaces (
  slug          TEXT        PRIMARY KEY,
  client_name   TEXT        NOT NULL,
  password      TEXT        NOT NULL DEFAULT '',
  active        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT
);

-- Row-level security: server always uses service-role key (bypasses RLS),
-- so these policies exist as defence-in-depth only.
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- No public reads — only service-role (server) can read.
CREATE POLICY "no_public_read" ON workspaces
  FOR SELECT TO anon USING (FALSE);

CREATE POLICY "no_public_write" ON workspaces
  FOR ALL TO anon USING (FALSE);

-- Seed: first real workspace.
-- Replace 'PASTE_PASSWORD_HERE' with the actual password, or leave empty
-- and set it after creation (the route serves ungated if password is empty,
-- matching the existing dev-convenience behaviour).
INSERT INTO workspaces (slug, client_name, password, notes)
VALUES (
  'urembo',
  'Urembo Hub — Initial Assessment',
  '',  -- set via Supabase dashboard or pipeline; empty = ungated
  'BSO-560 — Fatuma Dabassa. Covering email draft: Superhuman draft00fdc62aec6b7442.'
)
ON CONFLICT (slug) DO NOTHING;
