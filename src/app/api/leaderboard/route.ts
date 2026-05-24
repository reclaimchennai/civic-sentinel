import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type EntryRow = {
  user_id: string;
  current_points: number;
  total_points_earned: number;
  reports: number;
  zone: string | null;
  title: string;
};

type RisingRow = { user_id: string; points_gained: number; zone: string | null };

const TIMEFRAME_INTERVALS: Record<string, string | null> = {
  daily: "1 day",
  weekly: "7 days",
  monthly: "30 days",
  allTime: null,
};

function handleFor(userId: string): string {
  return "@" + userId.replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") ?? "allTime";
  const interval = TIMEFRAME_INTERVALS[timeframe] ?? null;

  // For timeframed views we rank by recent report count.
  // For all-time we rank by total_points_earned.
  const entries = interval
    ? await query<EntryRow>(
        `SELECT
           p.user_id,
           p.current_points,
           p.total_points_earned,
           COUNT(r.*)::int AS reports,
           z.name AS zone,
           p.title
         FROM profiles p
         LEFT JOIN reports r
           ON r.user_id = p.id AND r.created_at >= NOW() - $1::interval
         LEFT JOIN LATERAL (
           SELECT z.name FROM reports r2
           JOIN zones z ON z.id = r2.zone_id
           WHERE r2.user_id = p.id
           GROUP BY z.name
           ORDER BY COUNT(*) DESC
           LIMIT 1
         ) z ON true
         GROUP BY p.user_id, p.current_points, p.total_points_earned, z.name, p.title
         HAVING COUNT(r.*) > 0
         ORDER BY reports DESC, p.current_points DESC
         LIMIT 25`,
        [interval]
      )
    : await query<EntryRow>(
        `SELECT
           p.user_id,
           p.current_points,
           p.total_points_earned,
           (SELECT COUNT(*)::int FROM reports r WHERE r.user_id = p.id) AS reports,
           z.name AS zone,
           p.title
         FROM profiles p
         LEFT JOIN LATERAL (
           SELECT z.name FROM reports r2
           JOIN zones z ON z.id = r2.zone_id
           WHERE r2.user_id = p.id
           GROUP BY z.name
           ORDER BY COUNT(*) DESC
           LIMIT 1
         ) z ON true
         ORDER BY p.total_points_earned DESC
         LIMIT 25`
      );

  // Rising stars: top movers by reports in the last 7 days.
  const rising = await query<RisingRow>(
    `SELECT p.user_id,
            COUNT(r.*)::int * 25 AS points_gained,
            z.name AS zone
     FROM profiles p
     JOIN reports r ON r.user_id = p.id AND r.created_at >= NOW() - INTERVAL '7 days'
     LEFT JOIN LATERAL (
       SELECT z.name FROM reports r2
       JOIN zones z ON z.id = r2.zone_id
       WHERE r2.user_id = p.id
       GROUP BY z.name ORDER BY COUNT(*) DESC LIMIT 1
     ) z ON true
     GROUP BY p.user_id, z.name
     ORDER BY points_gained DESC
     LIMIT 3`
  );

  return NextResponse.json({
    entries: entries.rows.map((e, i) => ({
      rank: i + 1,
      handle: handleFor(e.user_id),
      points: timeframe === "allTime" ? e.total_points_earned : e.current_points,
      reports: e.reports,
      zone: e.zone,
      badge: e.title,
      avatar: "/avatars/default.png",
    })),
    risingStars: rising.rows.map((r) => ({
      handle: handleFor(r.user_id),
      zone: r.zone,
      pointsGained: r.points_gained,
      period: "This Week",
    })),
  });
}
