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

  const mission = await query<{ id: string }>(
    `SELECT id FROM missions WHERE id = $1 AND is_active AND ends_at > NOW()`,
    [id]
  );
  if (mission.rowCount === 0) {
    return NextResponse.json({ error: "Mission not found or inactive" }, { status: 404 });
  }

  await query(
    `INSERT INTO mission_participants (mission_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (mission_id, user_id) DO NOTHING`,
    [id, profile.id]
  );
  return NextResponse.json({ joined: true });
}
