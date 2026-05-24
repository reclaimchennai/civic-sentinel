import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type CommentRow = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  edited_at: string | null;
  author_session_id: string;
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await query<CommentRow>(
    `SELECT c.id, c.user_id, c.body, c.created_at, c.edited_at, p.user_id AS author_session_id
     FROM report_comments c
     JOIN profiles p ON p.id = c.user_id
     WHERE c.report_id = $1
     ORDER BY c.created_at ASC`,
    [id]
  );
  return NextResponse.json(
    result.rows.map((c) => ({
      id: c.id,
      profileId: c.user_id,
      authorId: c.author_session_id,
      body: c.body,
      createdAt: c.created_at,
      editedAt: c.edited_at,
    }))
  );
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const profile = await ensureProfile(session.user.id);

  let body: { body?: string } = {};
  try {
    body = (await req.json()) as { body?: string };
  } catch {
    return NextResponse.json({ error: "Body must be JSON with { body: string }" }, { status: 400 });
  }
  const text = body.body?.trim();
  if (!text || text.length < 1 || text.length > 500) {
    return NextResponse.json({ error: "Comment must be 1-500 characters" }, { status: 400 });
  }

  const exists = await query<{ id: string }>(`SELECT id FROM reports WHERE id = $1`, [id]);
  if (exists.rowCount === 0) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const inserted = await query<{ id: string; created_at: string }>(
    `INSERT INTO report_comments (report_id, user_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, created_at`,
    [id, profile.id, text]
  );
  return NextResponse.json({
    id: inserted.rows[0].id,
    profileId: profile.id,
    authorId: session.user.id,
    body: text,
    createdAt: inserted.rows[0].created_at,
    editedAt: null,
  });
}
