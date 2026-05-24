-- Social layer on top of reports: downvotes, comments, sentiment reactions.
-- Upvotes already exist as `report_endorsements` (with sync trigger).
-- Idempotent: re-runnable.

BEGIN;

-- ============================================
-- DOWNVOTES (mirror of report_endorsements)
-- ============================================
CREATE TABLE IF NOT EXISTS report_downvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(report_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_report_downvotes_report ON report_downvotes(report_id);

ALTER TABLE reports ADD COLUMN IF NOT EXISTS downvote_count INT DEFAULT 0;

-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS report_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_report_comments_report ON report_comments(report_id, created_at DESC);

ALTER TABLE reports ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0;

-- ============================================
-- REACTIONS (single sentiment per user per report; upsert to change)
-- ============================================
CREATE TABLE IF NOT EXISTS report_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sentiment VARCHAR(10) NOT NULL CHECK (sentiment IN ('happy', 'neutral', 'angry')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(report_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_report_reactions_report ON report_reactions(report_id);

-- ============================================
-- TRIGGERS to keep cached counters in sync
-- ============================================
CREATE OR REPLACE FUNCTION sync_downvote_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports SET downvote_count = downvote_count + 1 WHERE id = NEW.report_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports SET downvote_count = GREATEST(downvote_count - 1, 0) WHERE id = OLD.report_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_downvote_count ON report_downvotes;
CREATE TRIGGER trg_downvote_count
  AFTER INSERT OR DELETE ON report_downvotes
  FOR EACH ROW EXECUTE FUNCTION sync_downvote_count();

CREATE OR REPLACE FUNCTION sync_comment_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports SET comment_count = comment_count + 1 WHERE id = NEW.report_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.report_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comment_count ON report_comments;
CREATE TRIGGER trg_comment_count
  AFTER INSERT OR DELETE ON report_comments
  FOR EACH ROW EXECUTE FUNCTION sync_comment_count();

-- ============================================
-- Convenience: spatial helper using PostGIS (already enabled in setup.sql)
-- ============================================
-- Existing reports already have lat/lng as FLOAT, so the "nearby" query
-- builds geography points on the fly:
--   WHERE ST_DWithin(
--     ST_MakePoint(r.lng, r.lat)::geography,
--     ST_MakePoint($user_lng, $user_lat)::geography,
--     $radius_meters)
-- No new column needed.

COMMIT;
