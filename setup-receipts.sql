-- Receipts storage + history table for the auto-stock-update feature.
-- Run in Supabase SQL Editor.

-- 1. Storage bucket for receipt photos (public for simple read access).
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permissive storage policies (single-user app, no auth).
CREATE POLICY "Allow public read on receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts');

CREATE POLICY "Allow public upload on receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Allow public delete on receipts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'receipts');

-- 3. Receipts history table — records each scanned receipt + what was applied.
CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url text NOT NULL,
  parsed_items jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{material_id, material_name, grams_received}]
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on receipts" ON receipts FOR ALL USING (true) WITH CHECK (true);
