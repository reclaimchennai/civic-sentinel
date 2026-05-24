import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/auth";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type ChallengeRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  type: "daily" | "weekly" | "seasonal";
  target: number;
  reward_points: number;
  bonus_reward: string | null;
  ends_at: string;
  progress: number | null;
  status: "active" | "completed" | "claimed" | "expired" | null;
};

export async function GET() {
  const session = await auth();
  const profileId = session?.user?.id ? (await ensureProfile(session.user.id)).id : null;

  const result = await query<ChallengeRow>(
    `SELECT
       c.id, c.title, c.description, c.icon, c.type, c.target,
       c.reward_points, c.bonus_reward, c.ends_at,
       ucp.progress, ucp.status
     FROM challenges c
     LEFT JOIN user_challenge_progress ucp
       ON ucp.challenge_id = c.id AND ucp.user_id = $1
     WHERE c.is_active AND c.ends_at > NOW()
     ORDER BY c.type, c.ends_at ASC`,
    [profileId]
  );

  const toEntry = (c: ChallengeRow) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    type: c.type,
    target: c.target,
    progress: c.progress ?? 0,
    reward: c.reward_points,
    bonusReward: c.bonus_reward ?? undefined,
    expiresAt: c.ends_at,
    status: c.status ?? "active",
    icon: c.icon,
  });

  return NextResponse.json({
    daily: result.rows.filter((r) => r.type === "daily").map(toEntry),
    weekly: result.rows.filter((r) => r.type === "weekly").map(toEntry),
    seasonal: result.rows.filter((r) => r.type === "seasonal").map(toEntry),
  });
}
