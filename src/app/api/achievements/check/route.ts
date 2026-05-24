import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";
import { HIDDEN_ACHIEVEMENTS, type HiddenAchievement } from "@/lib/hiddenAchievements";

export const dynamic = "force-dynamic";

type Stats = {
  total_reports: number;
  approved_reports: number;
  rejected_reports: number;
  distinct_zones: number;
  distinct_categories: number;
  current_streak: number;
  longest_streak: number;
  reports_after_midnight: number;
  reports_at_sunrise: number;
};

function isFibonacci(n: number): boolean {
  if (n < 1) return false;
  const fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
  return fibs.includes(n);
}

function matches(achievement: HiddenAchievement, stats: Stats): boolean {
  switch (achievement.id) {
    case "midnight_warrior":
      return stats.reports_after_midnight >= 5;
    case "early_bird":
      return stats.reports_at_sunrise >= 3;
    case "fibonacci_filer":
      return isFibonacci(stats.total_reports);
    case "category_collector":
      return stats.distinct_categories >= 6;
    case "zone_nomad":
      return stats.distinct_zones >= 10;
    case "perfect_streak":
      return stats.longest_streak >= 7;
    case "century_club":
      return stats.total_reports >= 100;
    case "approval_ace":
      return stats.total_reports >= 20 && stats.approved_reports / stats.total_reports >= 0.95;
    default:
      return false;
  }
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await ensureProfile(session.user.id);

  const statsResult = await query<Stats>(
    `SELECT
       COUNT(*)::int AS total_reports,
       COUNT(*) FILTER (WHERE r.status = 'approved')::int AS approved_reports,
       COUNT(*) FILTER (WHERE r.status = 'rejected')::int AS rejected_reports,
       COUNT(DISTINCT r.zone_id)::int AS distinct_zones,
       COUNT(DISTINCT csc.category_id)::int AS distinct_categories,
       (SELECT current_streak FROM profiles WHERE id = $1) AS current_streak,
       (SELECT longest_streak FROM profiles WHERE id = $1) AS longest_streak,
       COUNT(*) FILTER (
         WHERE EXTRACT(HOUR FROM r.created_at AT TIME ZONE 'Asia/Kolkata') BETWEEN 0 AND 3
       )::int AS reports_after_midnight,
       COUNT(*) FILTER (
         WHERE EXTRACT(HOUR FROM r.created_at AT TIME ZONE 'Asia/Kolkata') BETWEEN 5 AND 7
       )::int AS reports_at_sunrise
     FROM reports r
     LEFT JOIN complaint_sub_categories csc ON csc.id = r.sub_category_id
     WHERE r.user_id = (SELECT user_id FROM profiles WHERE id = $1)`,
    [me.id]
  );
  const stats = statsResult.rows[0];

  const alreadyUnlocked = await query<{ achievement_id: string }>(
    `SELECT achievement_id FROM user_achievements WHERE user_id = $1`,
    [me.id]
  );
  const unlockedSet = new Set(alreadyUnlocked.rows.map((r) => r.achievement_id));

  const newlyUnlocked: HiddenAchievement[] = [];
  for (const ach of HIDDEN_ACHIEVEMENTS) {
    if (unlockedSet.has(ach.id)) continue;
    if (matches(ach, stats)) {
      await query(
        `INSERT INTO user_achievements (user_id, achievement_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, achievement_id) DO NOTHING`,
        [me.id, ach.id]
      );
      newlyUnlocked.push(ach);
    }
  }

  return NextResponse.json({
    stats,
    newlyUnlocked: newlyUnlocked.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      icon: a.icon,
      rarity: a.rarity,
      pointsReward: a.pointsReward,
    })),
    totalUnlocked: unlockedSet.size + newlyUnlocked.length,
  });
}
