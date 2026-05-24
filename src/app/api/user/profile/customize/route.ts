import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type CustomizePayload = {
  title?: string;
  avatarFrame?: string;
  showcaseBadges?: string[];
};

const TITLE_MAX = 100;
const AVATAR_FRAME_MAX = 50;
const SHOWCASE_MAX = 5;

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await ensureProfile(session.user.id);

  let body: CustomizePayload;
  try {
    body = (await req.json()) as CustomizePayload;
  } catch {
    return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (body.title !== undefined) {
    const t = body.title.trim();
    if (t.length < 1 || t.length > TITLE_MAX) {
      return NextResponse.json({ error: `title must be 1-${TITLE_MAX} chars` }, { status: 400 });
    }
    params.push(t);
    setClauses.push(`title = $${params.length}`);
  }

  if (body.avatarFrame !== undefined) {
    const f = body.avatarFrame.trim();
    if (f.length < 1 || f.length > AVATAR_FRAME_MAX) {
      return NextResponse.json({ error: `avatarFrame must be 1-${AVATAR_FRAME_MAX} chars` }, { status: 400 });
    }
    params.push(f);
    setClauses.push(`avatar_frame = $${params.length}`);
  }

  if (body.showcaseBadges !== undefined) {
    if (!Array.isArray(body.showcaseBadges) || body.showcaseBadges.some((b) => typeof b !== "string")) {
      return NextResponse.json({ error: "showcaseBadges must be an array of strings" }, { status: 400 });
    }
    if (body.showcaseBadges.length > SHOWCASE_MAX) {
      return NextResponse.json({ error: `showcaseBadges may not exceed ${SHOWCASE_MAX} entries` }, { status: 400 });
    }
    params.push(body.showcaseBadges);
    setClauses.push(`showcase_badges = $${params.length}`);
  }

  if (setClauses.length === 0) {
    return NextResponse.json({ error: "No supported fields provided" }, { status: 400 });
  }

  params.push(me.id);
  const result = await query<{ title: string; avatar_frame: string; showcase_badges: string[] }>(
    `UPDATE profiles SET ${setClauses.join(", ")}
     WHERE id = $${params.length}
     RETURNING title, avatar_frame, showcase_badges`,
    params
  );

  const updated = result.rows[0];
  return NextResponse.json({
    title: updated.title,
    avatarFrame: updated.avatar_frame,
    showcaseBadges: updated.showcase_badges,
  });
}
