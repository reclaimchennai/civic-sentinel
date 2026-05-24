import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

async function authed() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return ensureProfile(session.user.id);
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await authed();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const exists = await query<{ id: string }>(`SELECT id FROM reports WHERE id = $1`, [id]);
  if (exists.rowCount === 0) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const inserted = await query<{ id: string }>(
    `INSERT INTO report_endorsements (report_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (report_id, user_id) DO NOTHING
     RETURNING id`,
    [id, profile.id]
  );
  return NextResponse.json({ endorsed: true, alreadyEndorsed: inserted.rowCount === 0 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await authed();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deleted = await query(
    `DELETE FROM report_endorsements WHERE report_id = $1 AND user_id = $2`,
    [id, profile.id]
  );
  return NextResponse.json({ endorsed: false, wasEndorsed: (deleted.rowCount ?? 0) > 0 });
}
