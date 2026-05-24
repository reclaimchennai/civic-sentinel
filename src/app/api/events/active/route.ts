import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  starts_at: string;
  ends_at: string;
  multiplier: string;
  target_reports: number;
  current_reports: number;
  is_active: boolean;
};

type RewardRow = { event_id: string; threshold: number; reward_description: string };

export async function GET() {
  const events = await query<EventRow>(
    `SELECT id, title, description, icon, starts_at, ends_at, multiplier,
            target_reports, current_reports, is_active
     FROM events
     WHERE is_active AND ends_at > NOW()
     ORDER BY ends_at ASC`
  );

  if (events.rows.length === 0) return NextResponse.json([]);

  const rewards = await query<RewardRow>(
    `SELECT event_id, threshold, reward_description
     FROM event_rewards
     WHERE event_id = ANY($1::uuid[])
     ORDER BY threshold ASC`,
    [events.rows.map((e) => e.id)]
  );

  const rewardsByEvent = rewards.rows.reduce<Record<string, { threshold: number; reward: string }[]>>(
    (acc, r) => {
      (acc[r.event_id] ??= []).push({ threshold: r.threshold, reward: r.reward_description });
      return acc;
    },
    {}
  );

  return NextResponse.json(
    events.rows.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      icon: e.icon,
      startDate: e.starts_at,
      endDate: e.ends_at,
      multiplier: Number(e.multiplier),
      targetReports: e.target_reports,
      currentReports: e.current_reports,
      rewards: rewardsByEvent[e.id] ?? [],
      isActive: e.is_active,
    }))
  );
}
