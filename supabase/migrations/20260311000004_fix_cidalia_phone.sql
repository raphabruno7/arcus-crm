-- Merge 5 Cidalia duplicates into 1 record

-- 1. Fix the KY online record (keep this one)
UPDATE contacts
SET phone = '+14158810113',
    name = 'Cidalia - KY Online',
    tags = ARRAY['Kundalini Yoga', 'Numerologia']
WHERE phone = '+5514158810113'
  AND name ILIKE '%cidalia%';

-- 2. Relink any deals from duplicate Cidalias to the kept record
UPDATE deals
SET contact_id = (
  SELECT id FROM contacts WHERE phone = '+14158810113' AND name ILIKE '%cidalia%' LIMIT 1
)
WHERE contact_id IN (
  SELECT id FROM contacts
  WHERE name ILIKE '%cidalia%'
    AND phone != '+14158810113'
);

-- 3. Delete duplicate Cidalia records
DELETE FROM contacts
WHERE name ILIKE '%cidalia%'
  AND phone != '+14158810113';
