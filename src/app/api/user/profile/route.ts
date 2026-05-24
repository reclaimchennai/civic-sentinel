import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

import { LEVELS, getLevelFromPoints } from "@/lib/levels";

function levelFor(points: number) {
  const matched = getLevelFromPoints(points);
  const next = LEVELS.find((l) => l.tier === matched.tier + 1);
  return {
    level: matched.tier,
    title: matched.name,
    nextLevelPoints: next ? next.minPoints : matched.maxPoints,
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await ensureProfile(session.user.id);

  const [counts, mayor, guild, active] = await Promise.all([
    query<{ total: number; approved: number }>(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE status = 'approved')::int AS approved
       FROM reports WHERE user_id = $1`,
      [profile.id]
    ),
    query<{ zone_name: string }>(
      `SELECT zone_name FROM zone_ownership WHERE mayor_id = $1 LIMIT 1`,
      [profile.id]
    ),
    query<{ name: string }>(
      `SELECT g.name FROM guild_memberships gm
       JOIN guilds g ON g.id = gm.guild_id
       WHERE gm.user_id = $1 LIMIT 1`,
      [profile.id]
    ),
    query<{ active: number }>(
      `SELECT COUNT(*)::int AS active
       FROM user_challenge_progress ucp
       JOIN challenges c ON c.id = ucp.challenge_id
       WHERE ucp.user_id = $1 AND ucp.status = 'active' AND c.is_active AND c.ends_at > NOW()`,
      [profile.id]
    ),
  ]);

  const { level, title, nextLevelPoints } = levelFor(profile.current_points);
  const c = counts.rows[0];

  // Build weekly activity flags for the last 7 days
  const weekly = await query<{ day: string; reported: boolean }>(
    `SELECT to_char(d::date, 'YYYY-MM-DD') AS day,
            EXISTS (SELECT 1 FROM reports r WHERE r.user_id = $1 AND date_trunc('day', r.created_at) = d) AS reported
     FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') d
     ORDER BY d`,
    [profile.id]
  );

  return NextResponse.json({
    id: profile.id,
    name: session.user.name,
    email: session.user.email,
    level,
    points: profile.current_points,
    nextLevelPoints,
    reports: c.total,
    approved: c.approved,
    badges: [], // populated when the badges JSONB on profiles starts being written
    mayorship: mayor.rows[0]?.zone_name ?? "None",
    bio: "",
    joinedAt: profile.last_active_date ?? new Date().toISOString(),
    streak: {
      currentStreak: profile.current_streak,
      longestStreak: profile.longest_streak,
      lastActiveDate: profile.last_active_date ?? new Date().toISOString(),
      isAtRisk: false,
      streakShields: profile.streak_shields,
      weeklyActivity: weekly.rows.map((d) => d.reported),
    },
    title: profile.title ?? title,
    activeChallenges: active.rows[0].active,
    guildName: guild.rows[0]?.name ?? null,
    endorsements: profile.total_endorsements,
  });
}
