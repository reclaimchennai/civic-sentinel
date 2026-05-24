-- Gamification Seed Data for Chennai Civic Sentinel
-- Run after gamification_migration.sql:
--   docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/gamification_seed.sql
-- Idempotent: uses ON CONFLICT to allow re-runs.

BEGIN;

-- ============================================
-- MISSIONS
-- ============================================
INSERT INTO missions (id, title, description, icon, target_reports, current_reports, reward_points, reward_badge, starts_at, ends_at, is_active) VALUES
('11111111-1111-1111-1111-000000000001', 'Clean Streets Week', 'Help Chennai achieve 500 street cleanliness reports this week', 'Brush', 500, 342, 0, 'Clean City Badge', NOW() - INTERVAL '3 days', NOW() + INTERVAL '2 days', true),
('11111111-1111-1111-1111-000000000002', 'Pothole Patrol', 'Document 200 road damage issues across the city', 'CircleAlert', 200, 156, 500, 'Road Warrior Badge', NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 days', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon,
  target_reports = EXCLUDED.target_reports, current_reports = EXCLUDED.current_reports,
  reward_points = EXCLUDED.reward_points, reward_badge = EXCLUDED.reward_badge,
  starts_at = EXCLUDED.starts_at, ends_at = EXCLUDED.ends_at, is_active = EXCLUDED.is_active;

-- ============================================
-- CHALLENGES (Daily / Weekly / Seasonal)
-- ============================================
INSERT INTO challenges (id, title, description, icon, type, target, reward_points, bonus_reward, starts_at, ends_at, is_active) VALUES
-- Daily
('22222222-2222-2222-2222-000000000001', 'Early Bird', 'Submit a report before 8 AM', 'Sunrise', 'daily', 1, 50, NULL, date_trunc('day', NOW()), date_trunc('day', NOW()) + INTERVAL '1 day', true),
('22222222-2222-2222-2222-000000000002', 'Double Trouble', 'Report 2 different violation types', 'CheckCheck', 'daily', 2, 75, NULL, date_trunc('day', NOW()), date_trunc('day', NOW()) + INTERVAL '1 day', true),
('22222222-2222-2222-2222-000000000003', 'Zone Explorer', 'File a report in a new zone', 'Map', 'daily', 1, 60, NULL, date_trunc('day', NOW()), date_trunc('day', NOW()) + INTERVAL '1 day', true),
-- Weekly
('22222222-2222-2222-2222-000000000004', 'Chennai Sweep', 'File reports in 3 different zones', 'Brush', 'weekly', 3, 200, 'Zone Explorer Badge', date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
('22222222-2222-2222-2222-000000000005', 'Pothole Hunter', 'Report 5 road-related violations', 'CircleAlert', 'weekly', 5, 250, NULL, date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
('22222222-2222-2222-2222-000000000006', 'Community Pillar', 'Get 10 endorsements on your reports', 'Handshake', 'weekly', 10, 300, 'Community Star Badge', date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
-- Seasonal
('22222222-2222-2222-2222-000000000007', 'Monsoon Watch', 'Report 15 drainage/flooding issues this season', 'CloudRain', 'seasonal', 15, 1000, 'Monsoon Warrior Badge', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon,
  type = EXCLUDED.type, target = EXCLUDED.target, reward_points = EXCLUDED.reward_points,
  bonus_reward = EXCLUDED.bonus_reward, starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at, is_active = EXCLUDED.is_active;

-- ============================================
-- EVENTS
-- ============================================
INSERT INTO events (id, title, description, icon, multiplier, target_reports, current_reports, starts_at, ends_at, is_active) VALUES
('33333333-3333-3333-3333-000000000001', 'Monsoon Readiness Drive', 'Help prepare Chennai for monsoon season by reporting drainage issues', 'CloudRain', 2.0, 1000, 634, NOW() - INTERVAL '3 days', NOW() + INTERVAL '3 days', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon,
  multiplier = EXCLUDED.multiplier, target_reports = EXCLUDED.target_reports,
  current_reports = EXCLUDED.current_reports, starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at, is_active = EXCLUDED.is_active;

INSERT INTO event_rewards (event_id, threshold, reward_description) VALUES
('33333333-3333-3333-3333-000000000001', 250, 'Monsoon Scout Badge'),
('33333333-3333-3333-3333-000000000001', 500, '2x Point Multiplier (24hr)'),
('33333333-3333-3333-3333-000000000001', 1000, 'Monsoon Warrior Badge + 500 Points')
ON CONFLICT DO NOTHING;

-- ============================================
-- GUILDS
-- ============================================
INSERT INTO guilds (id, name, description, icon, max_members, total_points, level, primary_zone, tags) VALUES
('44444444-4444-4444-4444-000000000001', 'T. Nagar Tigers', 'Keeping T. Nagar clean and safe since 2024', 'Cat', 30, 45200, 5, 'T. Nagar', ARRAY['Active', 'Top Ranked']),
('44444444-4444-4444-4444-000000000002', 'Adyar Avengers', 'Defending Adyar''s streets one report at a time', 'Bird', 25, 32100, 4, 'Adyar', ARRAY['Competitive', 'Rising']),
('44444444-4444-4444-4444-000000000003', 'Mylapore Monitors', 'Heritage area guardians preserving Mylapore', 'Landmark', 20, 28500, 3, 'Mylapore', ARRAY['Heritage Focus']),
('44444444-4444-4444-4444-000000000004', 'Anna Nagar Alliance', 'United for better infrastructure in Anna Nagar', 'TowerControl', 30, 38900, 4, 'Anna Nagar', ARRAY['Friendly', 'Active']),
('44444444-4444-4444-4444-000000000005', 'Velachery Vigilantes', 'Fighting flooding and civic issues in Velachery', 'Waves', 20, 19800, 2, 'Velachery', ARRAY['New', 'Drainage Focus'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon,
  max_members = EXCLUDED.max_members, total_points = EXCLUDED.total_points,
  level = EXCLUDED.level, primary_zone = EXCLUDED.primary_zone, tags = EXCLUDED.tags;

-- One active per-guild challenge each (so the UI cards show progress bars)
INSERT INTO guild_challenges (id, guild_id, title, target, progress, reward_points, starts_at, ends_at, is_active) VALUES
('55555555-5555-5555-5555-000000000001', '44444444-4444-4444-4444-000000000001', 'Report 50 violations this week', 50, 38, 500, date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
('55555555-5555-5555-5555-000000000002', '44444444-4444-4444-4444-000000000002', 'Cover all Adyar wards', 12, 7, 400, date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
('55555555-5555-5555-5555-000000000003', '44444444-4444-4444-4444-000000000003', 'Document 30 encroachment issues', 30, 22, 400, date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
('55555555-5555-5555-5555-000000000004', '44444444-4444-4444-4444-000000000004', 'Report 40 streetlight issues', 40, 15, 400, date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true),
('55555555-5555-5555-5555-000000000005', '44444444-4444-4444-4444-000000000005', 'Map all drainage blocks', 25, 8, 400, date_trunc('week', NOW()), date_trunc('week', NOW()) + INTERVAL '7 days', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, target = EXCLUDED.target, progress = EXCLUDED.progress,
  reward_points = EXCLUDED.reward_points, starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at, is_active = EXCLUDED.is_active;

COMMIT;
