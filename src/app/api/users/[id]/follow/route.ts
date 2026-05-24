import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

// `id` is the target user's session.user.id (NextAuth provider sub).
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: targetSessionId } = await params;
  if (targetSessionId === session.user.id) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const me = await ensureProfile(session.user.id);
  const target = await query<{ id: string }>(
    `SELECT id FROM profiles WHERE user_id = $1`,
    [targetSessionId]
  );
  if (target.rowCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await query<{ id: string }>(
    `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT (follower_id, following_id) DO NOTHING
     RETURNING id`,
    [me.id, target.rows[0].id]
  );
  return NextResponse.json({ following: true, alreadyFollowing: result.rowCount === 0 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: targetSessionId } = await params;
  const me = await ensureProfile(session.user.id);
  const target = await query<{ id: string }>(
    `SELECT id FROM profiles WHERE user_id = $1`,
    [targetSessionId]
  );
  if (target.rowCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await query(
    `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [me.id, target.rows[0].id]
  );
  return NextResponse.json({ following: false, wasFollowing: (result.rowCount ?? 0) > 0 });
}
