import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type GuildRow = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  member_count: number;
  max_members: number;
  total_points: number;
  level: number;
  primary_zone: string | null;
  tags: string[];
  challenge_title: string | null;
  challenge_progress: number | null;
  challenge_target: number | null;
};

export async function GET() {
  const result = await query<GuildRow>(
    `SELECT
       g.id, g.name, g.description, g.icon, g.max_members, g.total_points,
       g.level, g.primary_zone, g.tags,
       COALESCE(mc.member_count, 0)::int AS member_count,
       gc.title AS challenge_title,
       gc.progress AS challenge_progress,
       gc.target AS challenge_target
     FROM guilds g
     LEFT JOIN (
       SELECT guild_id, COUNT(*)::int AS member_count
       FROM guild_memberships GROUP BY guild_id
     ) mc ON mc.guild_id = g.id
     LEFT JOIN LATERAL (
       SELECT title, progress, target
       FROM guild_challenges
       WHERE guild_id = g.id AND is_active AND ends_at > NOW()
       ORDER BY ends_at ASC LIMIT 1
     ) gc ON true
     ORDER BY g.total_points DESC`
  );

  return NextResponse.json(
    result.rows.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      icon: g.icon,
      memberCount: g.member_count,
      maxMembers: g.max_members,
      totalPoints: g.total_points,
      level: g.level,
      zone: g.primary_zone,
      tags: g.tags ?? [],
      currentChallenge: g.challenge_title
        ? {
            title: g.challenge_title,
            progress: g.challenge_progress ?? 0,
            target: g.challenge_target ?? 0,
          }
        : null,
    }))
  );
}
