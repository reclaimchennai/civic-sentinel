-- Add area column for reverse geocoded locality
ALTER TABLE reports ADD COLUMN IF NOT EXISTS area TEXT;

-- Ensure lat/lng are correct types (Already FLOAT, which is compatible with DECIMAL for this use case)
-- Ensure timestamp exists (created_at matches)
-- Ensure violation_type_id exists (sub_category_id matches)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS ward TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS zone_number INTEGER;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS zone_name TEXT;
