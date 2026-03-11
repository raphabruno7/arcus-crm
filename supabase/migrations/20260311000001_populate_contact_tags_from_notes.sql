-- Populate tags for existing contacts based on notes field.
-- Each contact imported from WhatsApp segments has its segment name in notes.

UPDATE contacts
SET tags = ARRAY[notes]
WHERE notes IS NOT NULL
  AND notes != ''
  AND (tags IS NULL OR tags = '{}');
