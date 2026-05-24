import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/auth";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type BoxRow = {
  id: string;
  rarity: "bronze" | "silver" | "gold";
  earned_at: string;
  opened: boolean;
  reward_type: string | null;
  reward_value: string | null;
  reward_label: string | null;
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await ensureProfile(session.user.id);

  const result = await query<BoxRow>(
    `SELECT id, rarity, earned_at, opened, reward_type, reward_value, reward_label
     FROM user_mystery_boxes
     WHERE user_id = $1
     ORDER BY earned_at DESC`,
    [profile.id]
  );

  return NextResponse.json(
    result.rows.map((b) => ({
      id: b.id,
      rarity: b.rarity,
      earnedAt: b.earned_at,
      opened: b.opened,
      reward: b.opened && b.reward_type
        ? {
            type: b.reward_type,
            value: b.reward_value,
            label: b.reward_label,
            rarity: b.rarity === "gold" ? "rare" : b.rarity === "silver" ? "uncommon" : "common",
          }
        : undefined,
    }))
  );
}
