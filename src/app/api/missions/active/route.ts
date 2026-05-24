import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type MissionRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  current_reports: number;
  target_reports: number;
  participants: number;
  ends_at: string;
  reward_points: number;
  reward_badge: string | null;
};

export async function GET() {
  const result = await query<MissionRow>(
    `SELECT
       m.id,
       m.title,
       m.description,
       m.icon,
       m.current_reports,
       m.target_reports,
       COALESCE(p.participants, 0)::int AS participants,
       m.ends_at,
       m.reward_points,
       m.reward_badge
     FROM missions m
     LEFT JOIN (
       SELECT mission_id, COUNT(*)::int AS participants
       FROM mission_participants
       GROUP BY mission_id
     ) p ON p.mission_id = m.id
     WHERE m.is_active AND m.ends_at > NOW()
     ORDER BY m.ends_at ASC`
  );

  return NextResponse.json(
    result.rows.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      icon: m.icon,
      progress: m.current_reports,
      target: m.target_reports,
      participants: m.participants,
      endsAt: m.ends_at,
      reward:
        m.reward_points > 0 && m.reward_badge
          ? `${m.reward_points} Bonus Points + ${m.reward_badge}`
          : m.reward_badge ?? (m.reward_points > 0 ? `${m.reward_points} Bonus Points` : ""),
    }))
  );
}
