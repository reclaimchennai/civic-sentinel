import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, commentId } = await params;
  const profile = await ensureProfile(session.user.id);

  // Allow deletion by author, or by admin.
  const isAdmin = session.user.role === "admin";
  const result = await query(
    isAdmin
      ? `DELETE FROM report_comments WHERE id = $1 AND report_id = $2`
      : `DELETE FROM report_comments WHERE id = $1 AND report_id = $2 AND user_id = $3`,
    isAdmin ? [commentId, id] : [commentId, id, profile.id]
  );
  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: "Comment not found or not yours" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
