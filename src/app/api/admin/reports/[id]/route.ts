import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["approve", "reject", "undo"]);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  let body: { action?: string } = {};
  try {
    body = (await req.json()) as { action?: string };
  } catch {
    return NextResponse.json({ error: "Body must be JSON with { action }" }, { status: 400 });
  }
  const action = body.action;
  if (!action || !ALLOWED.has(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${[...ALLOWED].join(", ")}` },
      { status: 400 }
    );
  }

  const newStatus =
    action === "approve" ? "approved" : action === "reject" ? "rejected" : "pending";

  const result = await query<{ id: string; status: string }>(
    `UPDATE reports SET status = $1 WHERE id = $2 RETURNING id, status`,
    [newStatus, id]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  return NextResponse.json({ id: result.rows[0].id, status: result.rows[0].status });
}
