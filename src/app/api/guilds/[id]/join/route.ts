import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const profile = await ensureProfile(session.user.id);

  const guild = await query<{ max_members: number; member_count: number }>(
    `SELECT g.max_members,
            (SELECT COUNT(*) FROM guild_memberships WHERE guild_id = g.id)::int AS member_count
     FROM guilds g WHERE g.id = $1`,
    [id]
  );
  if (guild.rowCount === 0) {
    return NextResponse.json({ error: "Guild not found" }, { status: 404 });
  }
  if (guild.rows[0].member_count >= guild.rows[0].max_members) {
    return NextResponse.json({ error: "Guild is full" }, { status: 409 });
  }

  // Default role 'member'; leader/officer roles are assigned through admin actions.
  await query(
    `INSERT INTO guild_memberships (guild_id, user_id, role)
     VALUES ($1, $2, 'member')
     ON CONFLICT (guild_id, user_id) DO NOTHING`,
    [id, profile.id]
  );
  // Reflect the membership on the profile row for convenience.
  await query(`UPDATE profiles SET guild_id = $1 WHERE id = $2`, [id, profile.id]);

  return NextResponse.json({ joined: true });
}
