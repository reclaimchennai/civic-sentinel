-- Triggers + schema adjustments for streak/points/endorsement automation.
-- Idempotent: drops and recreates functions/triggers each run.

BEGIN;

-- ============================================
-- reports.user_id: store NextAuth session.user.id directly
-- ============================================
-- profiles.user_id was widened to TEXT in gamification_migration.sql.
-- reports.user_id must match so we can write the auth ID from the client
-- and look up the profile in triggers without UUID coercion.
ALTER TABLE reports ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- ============================================
-- Streak update on report submission
-- ============================================
CREATE OR REPLACE FUNCTION update_streak_on_report() RETURNS TRIGGER AS $$
DECLARE
  v_profile_id UUID;
  v_last DATE;
  v_streak INT;
BEGIN
  IF NEW.user_id IS NULL THEN RETURN NEW; END IF;

  SELECT id, last_active_date, current_streak
    INTO v_profile_id, v_last, v_streak
  FROM profiles
  WHERE user_id = NEW.user_id;

  IF v_profile_id IS NULL THEN RETURN NEW; END IF;

  IF v_last = CURRENT_DATE THEN
    -- already counted today
    RETURN NEW;
  END IF;

  IF v_last = CURRENT_DATE - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  UPDATE profiles
  SET current_streak  = v_streak,
      longest_streak  = GREATEST(COALESCE(longest_streak, 0), v_streak),
      last_active_date = CURRENT_DATE
  WHERE id = v_profile_id;

  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_streak ON reports;
CREATE TRIGGER trg_update_streak
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION update_streak_on_report();

-- ============================================
-- Award points when a report flips to 'approved'
-- ============================================
CREATE OR REPLACE FUNCTION award_points_on_approval() RETURNS TRIGGER AS $$
DECLARE
  v_profile_id UUID;
  v_points INT := 25;
BEGIN
  IF NEW.status = 'approved' AND COALESCE(OLD.status, '') <> 'approved'
     AND NEW.user_id IS NOT NULL THEN
    SELECT id INTO v_profile_id FROM profiles WHERE user_id = NEW.user_id;
    IF v_profile_id IS NOT NULL THEN
      UPDATE profiles
      SET current_points       = current_points + v_points,
          total_points_earned  = total_points_earned + v_points
      WHERE id = v_profile_id;
    END IF;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_award_points ON reports;
CREATE TRIGGER trg_award_points
  AFTER UPDATE OF status ON reports
  FOR EACH ROW EXECUTE FUNCTION award_points_on_approval();

-- ============================================
-- Keep reports.endorsement_count + profiles.total_endorsements in sync
-- ============================================
CREATE OR REPLACE FUNCTION sync_endorsement_counts() RETURNS TRIGGER AS $$
DECLARE
  v_report_owner_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports SET endorsement_count = endorsement_count + 1
    WHERE id = NEW.report_id;
    SELECT (SELECT id FROM profiles WHERE user_id = r.user_id)
      INTO v_report_owner_id
    FROM reports r WHERE r.id = NEW.report_id;
    IF v_report_owner_id IS NOT NULL THEN
      UPDATE profiles SET total_endorsements = total_endorsements + 1
      WHERE id = v_report_owner_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports SET endorsement_count = GREATEST(endorsement_count - 1, 0)
    WHERE id = OLD.report_id;
    SELECT (SELECT id FROM profiles WHERE user_id = r.user_id)
      INTO v_report_owner_id
    FROM reports r WHERE r.id = OLD.report_id;
    IF v_report_owner_id IS NOT NULL THEN
      UPDATE profiles SET total_endorsements = GREATEST(total_endorsements - 1, 0)
      WHERE id = v_report_owner_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_endorsement_count ON report_endorsements;
CREATE TRIGGER trg_endorsement_count
  AFTER INSERT OR DELETE ON report_endorsements
  FOR EACH ROW EXECUTE FUNCTION sync_endorsement_counts();

COMMIT;
