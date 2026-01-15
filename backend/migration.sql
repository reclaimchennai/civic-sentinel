-- Add area column for reverse geocoded locality
ALTER TABLE reports ADD COLUMN IF NOT EXISTS area TEXT;

-- Ensure lat/lng are correct types (Already FLOAT, which is compatible with DECIMAL for this use case)
-- Ensure timestamp exists (created_at matches)
-- Ensure violation_type_id exists (sub_category_id matches)
