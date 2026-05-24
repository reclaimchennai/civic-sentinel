import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["up", "down", "clear"]);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const profile = await ensureProfile(session.user.id);

  let body: { value?: string } = {};
  try {
    body = (await req.json()) as { value?: string };
  } catch {
    return NextResponse.json({ error: "Body must be JSON with { value: 'up' | 'down' | 'clear' }" }, { status: 400 });
  }
  if (!body.value || !ALLOWED.has(body.value)) {
    return NextResponse.json({ error: `value must be one of: ${[...ALLOWED].join(", ")}` }, { status: 400 });
  }

  const exists = await query<{ id: string }>(`SELECT id FROM reports WHERE id = $1`, [id]);
  if (exists.rowCount === 0) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Idempotent: votes are mutually exclusive; switching direction removes the opposite.
  if (body.value === "up") {
    await query(`DELETE FROM report_downvotes WHERE report_id = $1 AND user_id = $2`, [id, profile.id]);
    await query(
      `INSERT INTO report_endorsements (report_id, user_id) VALUES ($1, $2)
       ON CONFLICT (report_id, user_id) DO NOTHING`,
      [id, profile.id]
    );
  } else if (body.value === "down") {
    await query(`DELETE FROM report_endorsements WHERE report_id = $1 AND user_id = $2`, [id, profile.id]);
    await query(
      `INSERT INTO report_downvotes (report_id, user_id) VALUES ($1, $2)
       ON CONFLICT (report_id, user_id) DO NOTHING`,
      [id, profile.id]
    );
  } else {
    await query(`DELETE FROM report_endorsements WHERE report_id = $1 AND user_id = $2`, [id, profile.id]);
    await query(`DELETE FROM report_downvotes WHERE report_id = $1 AND user_id = $2`, [id, profile.id]);
  }

  const totals = await query<{ up: number; down: number }>(
    `SELECT endorsement_count::int AS up, downvote_count::int AS down FROM reports WHERE id = $1`,
    [id]
  );
  return NextResponse.json({ value: body.value, counts: totals.rows[0] });
}
