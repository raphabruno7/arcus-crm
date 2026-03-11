-- Allow each deal to override the board's default currency
ALTER TABLE deals ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT NULL;
