import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type Reward = { type: string; value: string; label: string; weight: number };

const REWARDS_BY_RARITY: Record<"bronze" | "silver" | "gold", Reward[]> = {
  bronze: [
    { type: "points", value: "25", label: "25 Points", weight: 60 },
    { type: "points", value: "50", label: "50 Points", weight: 30 },
    { type: "streak_shield", value: "1", label: "Streak Shield", weight: 10 },
  ],
  silver: [
    { type: "points", value: "75", label: "75 Points", weight: 50 },
    { type: "points", value: "150", label: "150 Points", weight: 30 },
    { type: "streak_shield", value: "2", label: "2x Streak Shield", weight: 15 },
    { type: "badge", value: "lucky_silver", label: "Lucky Silver Badge", weight: 5 },
  ],
  gold: [
    { type: "points", value: "200", label: "200 Points", weight: 40 },
    { type: "points", value: "500", label: "500 Points", weight: 30 },
    { type: "streak_shield", value: "3", label: "3x Streak Shield", weight: 20 },
    { type: "badge", value: "lucky_gold", label: "Lucky Gold Badge", weight: 10 },
  ],
};

function pickReward(rarity: "bronze" | "silver" | "gold"): Reward {
  const pool = REWARDS_BY_RARITY[rarity];
  const total = pool.reduce((s, r) => s + r.weight, 0);
  let n = Math.random() * total;
  for (const r of pool) {
    n -= r.weight;
    if (n <= 0) return r;
  }
  return pool[pool.length - 1];
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const profile = await ensureProfile(session.user.id);

  const box = await query<{ rarity: "bronze" | "silver" | "gold"; opened: boolean }>(
    `SELECT rarity, opened FROM user_mystery_boxes WHERE id = $1 AND user_id = $2`,
    [id, profile.id]
  );
  if (box.rowCount === 0) {
    return NextResponse.json({ error: "Box not found" }, { status: 404 });
  }
  if (box.rows[0].opened) {
    return NextResponse.json({ error: "Box already opened" }, { status: 409 });
  }

  const reward = pickReward(box.rows[0].rarity);

  await query(
    `UPDATE user_mystery_boxes
     SET opened = true,
         opened_at = NOW(),
         reward_type = $2,
         reward_value = $3,
         reward_label = $4
     WHERE id = $1`,
    [id, reward.type, reward.value, reward.label]
  );

  // Side effect: points rewards immediately credit the profile.
  if (reward.type === "points") {
    await query(
      `UPDATE profiles
       SET current_points = current_points + $1,
           total_points_earned = total_points_earned + $1
       WHERE id = $2`,
      [Number(reward.value), profile.id]
    );
  } else if (reward.type === "streak_shield") {
    await query(`UPDATE profiles SET streak_shields = streak_shields + $1 WHERE id = $2`, [
      Number(reward.value),
      profile.id,
    ]);
  }

  return NextResponse.json({
    opened: true,
    reward: {
      type: reward.type,
      value: reward.value,
      label: reward.label,
      rarity: box.rows[0].rarity === "gold" ? "rare" : box.rows[0].rarity === "silver" ? "uncommon" : "common",
    },
  });
}
