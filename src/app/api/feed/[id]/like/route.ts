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
  const me = await ensureProfile(session.user.id);

  const inserted = await query<{ id: string }>(
    `INSERT INTO feed_likes (activity_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (activity_id, user_id) DO NOTHING
     RETURNING id`,
    [id, me.id]
  );
  return NextResponse.json({ liked: true, alreadyLiked: inserted.rowCount === 0 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const me = await ensureProfile(session.user.id);

  await query(`DELETE FROM feed_likes WHERE activity_id = $1 AND user_id = $2`, [id, me.id]);
  return NextResponse.json({ liked: false });
}
