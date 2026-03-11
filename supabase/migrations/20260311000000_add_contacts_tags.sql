-- Add tags array column to contacts (same pattern as deals.tags)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Index for tag-based filtering (GIN supports @> "contains" operator)
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN (tags);
