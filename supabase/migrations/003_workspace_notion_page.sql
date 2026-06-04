-- BSO-586 — map each workspace to its Notion Deal page for the client-submission sync.
-- The /api/notion-sync route reads notion_page_id to know where to write.

ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS notion_page_id TEXT;

-- Urembo → "[Urembo Hub Ltd] AI Automation Scope" deal in the Community Sprints CS Deals DB.
UPDATE workspaces
  SET notion_page_id = '37240251-1cda-8198-8ea6-cc9f426f839e'
  WHERE slug = 'urembo';
