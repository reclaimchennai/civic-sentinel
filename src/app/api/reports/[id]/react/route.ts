import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["happy", "neutral", "angry"]);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const profile = await ensureProfile(session.user.id);

  let body: { sentiment?: string } = {};
  try {
    body = (await req.json()) as { sentiment?: string };
  } catch {
    return NextResponse.json({ error: "Body must be JSON with { sentiment }" }, { status: 400 });
  }
  if (!body.sentiment || !ALLOWED.has(body.sentiment)) {
    return NextResponse.json({ error: `sentiment must be one of: ${[...ALLOWED].join(", ")}` }, { status: 400 });
  }

  const exists = await query<{ id: string }>(`SELECT id FROM reports WHERE id = $1`, [id]);
  if (exists.rowCount === 0) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  await query(
    `INSERT INTO report_reactions (report_id, user_id, sentiment)
     VALUES ($1, $2, $3)
     ON CONFLICT (report_id, user_id)
     DO UPDATE SET sentiment = EXCLUDED.sentiment, updated_at = NOW()`,
    [id, profile.id, body.sentiment]
  );

  const counts = await query<{ happy: number; neutral: number; angry: number }>(
    `SELECT
       (SELECT COUNT(*)::int FROM report_reactions WHERE report_id = $1 AND sentiment = 'happy') AS happy,
       (SELECT COUNT(*)::int FROM report_reactions WHERE report_id = $1 AND sentiment = 'neutral') AS neutral,
       (SELECT COUNT(*)::int FROM report_reactions WHERE report_id = $1 AND sentiment = 'angry') AS angry`,
    [id]
  );
  return NextResponse.json({ sentiment: body.sentiment, counts: counts.rows[0] });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const profile = await ensureProfile(session.user.id);

  await query(`DELETE FROM report_reactions WHERE report_id = $1 AND user_id = $2`, [id, profile.id]);
  return NextResponse.json({ cleared: true });
}
