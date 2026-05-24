import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

type GuildDetail = {
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

type MemberRow = {
  user_id: string;
  role: "leader" | "officer" | "member";
  current_points: number;
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const detail = await query<GuildDetail>(
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
       SELECT title, progress, target FROM guild_challenges
       WHERE guild_id = g.id AND is_active AND ends_at > NOW()
       ORDER BY ends_at ASC LIMIT 1
     ) gc ON true
     WHERE g.id = $1`,
    [id]
  );

  if (detail.rows.length === 0) {
    return NextResponse.json({ error: "Guild not found" }, { status: 404 });
  }

  const members = await query<MemberRow>(
    `SELECT p.user_id, gm.role, p.current_points
     FROM guild_memberships gm
     JOIN profiles p ON p.id = gm.user_id
     WHERE gm.guild_id = $1
     ORDER BY
       CASE gm.role WHEN 'leader' THEN 0 WHEN 'officer' THEN 1 ELSE 2 END,
       p.current_points DESC`,
    [id]
  );

  let isMember = false;
  const session = await auth();
  if (session?.user?.id) {
    const m = await query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM guild_memberships gm
         JOIN profiles p ON p.id = gm.user_id
         WHERE gm.guild_id = $1 AND p.user_id = $2
       ) AS exists`,
      [id, session.user.id]
    );
    isMember = m.rows[0]?.exists ?? false;
  }

  const g = detail.rows[0];
  return NextResponse.json({
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
    members: members.rows.map((m) => ({
      handle: "@" + m.user_id.replace(/[^A-Za-z0-9]/g, "").slice(0, 16),
      role: m.role,
      points: m.current_points,
    })),
    isMember,
  });
}
