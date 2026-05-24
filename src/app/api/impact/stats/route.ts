import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type CategoryRow = { name: string; icon_slug: string; count: number };

export async function GET() {
  const [totals, perCategory, recent] = await Promise.all([
    query<{ total_reports: number; issues_resolved: number; active_citizens: number; zones_covered: number }>(
      `SELECT
         COUNT(*)::int AS total_reports,
         COUNT(*) FILTER (WHERE status = 'approved')::int AS issues_resolved,
         COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL)::int AS active_citizens,
         COUNT(DISTINCT zone_id) FILTER (WHERE zone_id IS NOT NULL)::int AS zones_covered
       FROM reports`
    ),
    query<CategoryRow>(
      `SELECT cc.name, cc.icon_slug, COUNT(r.*)::int AS count
       FROM reports r
       JOIN complaint_sub_categories csc ON csc.id = r.sub_category_id
       JOIN complaint_categories cc ON cc.id = csc.category_id
       GROUP BY cc.id, cc.name, cc.icon_slug
       ORDER BY count DESC
       LIMIT 6`
    ),
    query<{ created_at: string }>(
      `SELECT created_at FROM reports ORDER BY created_at DESC LIMIT 1`
    ),
  ]);

  const t = totals.rows[0];
  const resolutionRate =
    t.total_reports > 0 ? Math.round((t.issues_resolved / t.total_reports) * 100) : 0;

  // Weekly trend: count of reports per day for the last 7 days.
  const trend = await query<{ day: string; count: number }>(
    `SELECT to_char(d::date, 'YYYY-MM-DD') AS day,
            COALESCE(COUNT(r.*), 0)::int AS count
     FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') d
     LEFT JOIN reports r ON date_trunc('day', r.created_at) = d
     GROUP BY d
     ORDER BY d`
  );

  return NextResponse.json({
    totalReports: t.total_reports,
    issuesResolved: t.issues_resolved,
    activeCitizens: t.active_citizens,
    zonesCovered: t.zones_covered,
    resolutionRate,
    topCategories: perCategory.rows.map((r) => ({
      name: r.name,
      icon: r.icon_slug,
      count: r.count,
    })),
    recentMilestone: recent.rows[0]
      ? { title: "Latest report", reachedAt: recent.rows[0].created_at }
      : null,
    weeklyTrend: trend.rows.map((r) => r.count),
  });
}
