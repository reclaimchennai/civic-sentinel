-- Gamification Migration for Chennai Civic Sentinel
-- Run: docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/gamification_migration.sql

BEGIN;

-- ============================================
-- MISSIONS (Community-wide goals)
-- ============================================
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    target_reports INT NOT NULL,
    current_reports INT DEFAULT 0,
    reward_points INT DEFAULT 0,
    reward_badge VARCHAR(100),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mission_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contributions INT DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mission_id, user_id)
);

-- ============================================
-- CHALLENGES (Daily/Weekly/Seasonal individual tasks)
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'seasonal')),
    target INT NOT NULL,
    reward_points INT DEFAULT 0,
    bonus_reward VARCHAR(100),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    progress INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'claimed', 'expired')),
    completed_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    UNIQUE(user_id, challenge_id)
);

-- ============================================
-- EVENTS (Limited-time events with multipliers)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    multiplier DECIMAL(3,1) DEFAULT 1.0,
    target_reports INT NOT NULL,
    current_reports INT DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    threshold INT NOT NULL,
    reward_description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contributions INT DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- ============================================
-- GUILDS
-- ============================================
CREATE TABLE IF NOT EXISTS guilds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    max_members INT DEFAULT 30,
    total_points INT DEFAULT 0,
    level INT DEFAULT 1,
    primary_zone VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guild_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS guild_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    target INT NOT NULL,
    progress INT DEFAULT 0,
    reward_points INT DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guild_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guild_challenge_id UUID REFERENCES guild_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contributions INT DEFAULT 0,
    UNIQUE(guild_challenge_id, user_id)
);

-- ============================================
-- SOCIAL (Following, Feed, Likes)
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'report_filed', 'badge_earned', 'level_up', 'mayor_claimed', 'challenge_completed', 'guild_joined'
    action_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);

CREATE TABLE IF NOT EXISTS feed_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES activity_feed(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(activity_id, user_id)
);

-- ============================================
-- ENDORSEMENTS (Report community validation)
-- ============================================
CREATE TABLE IF NOT EXISTS report_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(report_id, user_id)
);

-- ============================================
-- MYSTERY BOXES
-- ============================================
CREATE TABLE IF NOT EXISTS user_mystery_boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('bronze', 'silver', 'gold')),
    opened BOOLEAN DEFAULT false,
    reward_type VARCHAR(20),
    reward_value TEXT,
    reward_label VARCHAR(200),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ
);

-- ============================================
-- STREAKS
-- ============================================
CREATE TABLE IF NOT EXISTS streak_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    streak_length INT NOT NULL,
    started_at DATE NOT NULL,
    ended_at DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER REWARDS (Redeemed items)
-- ============================================
-- Note: reward_id is INTEGER to match rewards_catalog.id (SERIAL).
CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reward_id INTEGER REFERENCES rewards_catalog(id) ON DELETE SET NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'expired'))
);

-- ============================================
-- REPORT TEMPLATES
-- ============================================
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    default_severity INT CHECK (default_severity BETWEEN 1 AND 5),
    default_notes TEXT,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ZONE OWNERSHIP
-- ============================================
CREATE TABLE IF NOT EXISTS zone_ownership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(100) NOT NULL UNIQUE,
    mayor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    mayor_points INT DEFAULT 0,
    total_reports INT DEFAULT 0,
    active_reporters INT DEFAULT 0,
    top_category VARCHAR(100),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zone_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(100) NOT NULL,
    challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    defender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenger_points INT DEFAULT 0,
    defender_points INT DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    winner_id UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HIDDEN ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- ALTER EXISTING TABLES
-- ============================================

-- NextAuth session IDs are arbitrary strings (provider sub, "demo-user-001", etc.),
-- not UUIDs. Widen profiles.user_id so we can store them verbatim.
ALTER TABLE profiles ALTER COLUMN user_id TYPE TEXT;

-- Icon columns originally sized for emoji (VARCHAR(10)). The UI now uses
-- Lucide icon NAMES (e.g. "CircleAlert"), some of which exceed 10 chars.
ALTER TABLE missions   ALTER COLUMN icon TYPE VARCHAR(50);
ALTER TABLE challenges ALTER COLUMN icon TYPE VARCHAR(50);
ALTER TABLE events     ALTER COLUMN icon TYPE VARCHAR(50);
ALTER TABLE guilds     ALTER COLUMN icon TYPE VARCHAR(50);

-- Add gamification fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_shields INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS title VARCHAR(100) DEFAULT 'Civic Guardian';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_frame VARCHAR(50) DEFAULT 'default';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS showcase_badges TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guild_id UUID REFERENCES guilds(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_endorsements INT DEFAULT 0;

-- Add gamification fields to reports
ALTER TABLE reports ADD COLUMN IF NOT EXISTS severity INT CHECK (severity BETWEEN 1 AND 5);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS endorsement_count INT DEFAULT 0;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL;

-- Add gamification fields to rewards_catalog
ALTER TABLE rewards_catalog ADD COLUMN IF NOT EXISTS stock INT;
ALTER TABLE rewards_catalog ADD COLUMN IF NOT EXISTS min_level INT DEFAULT 1;
ALTER TABLE rewards_catalog ADD COLUMN IF NOT EXISTS is_limited_edition BOOLEAN DEFAULT false;
ALTER TABLE rewards_catalog ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE rewards_catalog ADD COLUMN IF NOT EXISTS rarity VARCHAR(20) DEFAULT 'common';

COMMIT;
