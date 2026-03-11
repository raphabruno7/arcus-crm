-- Mark existing WhatsApp-imported contacts with source = 'WHATSAPP'
UPDATE contacts
SET source = 'WHATSAPP'
WHERE source IS NULL
  AND notes IS NOT NULL
  AND notes != '';
