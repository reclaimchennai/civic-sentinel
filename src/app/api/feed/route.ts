import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type FeedRow = {
  id: string;
  user_id: string;
  action_type: string;
  action_data: Record<string, unknown>;
  created_at: string;
  author_session_id: string;
  liked: boolean;
  like_count: number;
};

const ALLOWED_SCOPES = new Set(["following", "trending", "nearby"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "trending";
  if (!ALLOWED_SCOPES.has(scope)) {
    return NextResponse.json({ error: `scope must be one of: ${[...ALLOWED_SCOPES].join(", ")}` }, { status: 400 });
  }
  const limit = Math.min(Number(searchParams.get("limit") ?? 30), 100);

  const session = await auth();
  const me = session?.user?.id ? await ensureProfile(session.user.id) : null;

  if (scope === "following" && !me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params: unknown[] = [me?.id ?? null, limit];
  let where: string;
  if (scope === "following") {
    where = `af.user_id IN (SELECT following_id FROM follows WHERE follower_id = $1)`;
  } else {
    // For trending and nearby (no location proxy in activity_feed yet) we
    // just return the latest activity globally and let the client sort
    // by like count for the trending pill.
    where = "TRUE";
  }

  const result = await query<FeedRow>(
    `SELECT
       af.id, af.user_id, af.action_type, af.action_data, af.created_at,
       p.user_id AS author_session_id,
       EXISTS (SELECT 1 FROM feed_likes l WHERE l.activity_id = af.id AND l.user_id = $1) AS liked,
       (SELECT COUNT(*)::int FROM feed_likes l WHERE l.activity_id = af.id) AS like_count
     FROM activity_feed af
     JOIN profiles p ON p.id = af.user_id
     WHERE ${where}
     ORDER BY af.created_at DESC
     LIMIT $2`,
    params
  );

  return NextResponse.json(
    result.rows.map((r) => ({
      id: r.id,
      authorId: r.author_session_id,
      actionType: r.action_type,
      actionData: r.action_data,
      createdAt: r.created_at,
      likes: r.like_count,
      liked: r.liked,
    }))
  );
}
