import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { ensureProfile } from "@/lib/ensureProfile";

export const dynamic = "force-dynamic";

type ReportRow = {
  id: string;
  image_url: string;
  zone_name: string | null;
  area: string | null;
  category_name: string | null;
  sub_category_name: string | null;
  status: string;
  created_at: string;
  lat: number;
  lng: number;
  endorsement_count: number;
  downvote_count: number;
  comment_count: number;
  user_endorsed: boolean;
  user_downvoted: boolean;
  user_reaction: "happy" | "neutral" | "angry" | null;
  happy_count: number;
  neutral_count: number;
  angry_count: number;
  author_user_id: string | null;
  distance_m: number | null;
};

const ALLOWED_SCOPES = new Set(["nearby", "city", "mine", "all"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "city";
  if (!ALLOWED_SCOPES.has(scope)) {
    return NextResponse.json({ error: `scope must be one of: ${[...ALLOWED_SCOPES].join(", ")}` }, { status: 400 });
  }
  const statusFilter = searchParams.get("status"); // null = any
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

  const session = await auth();
  const profileId = session?.user?.id ? (await ensureProfile(session.user.id)).id : null;

  if (scope === "mine" && !profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Build scope-specific WHERE + ORDER and parameter list.
  const params: unknown[] = [profileId, limit];
  let where = "";
  let orderBy = "r.created_at DESC";
  let distanceSelect = "NULL::float AS distance_m";

  if (scope === "nearby") {
    const latRaw = searchParams.get("lat");
    const lngRaw = searchParams.get("lng");
    if (latRaw === null || lngRaw === null) {
      return NextResponse.json({ error: "nearby scope requires lat & lng query params" }, { status: 400 });
    }
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    const radius = Math.min(Number(searchParams.get("radius") ?? 2000), 50_000);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: "nearby scope requires numeric lat (-90..90) & lng (-180..180)" }, { status: 400 });
    }
    params.push(lat, lng, radius);
    where = `ST_DWithin(
                ST_MakePoint(r.lng, r.lat)::geography,
                ST_MakePoint($4, $3)::geography,
                $5
              )`;
    distanceSelect = `ST_Distance(
                        ST_MakePoint(r.lng, r.lat)::geography,
                        ST_MakePoint($4, $3)::geography
                      )::float AS distance_m`;
    orderBy = "distance_m ASC, r.created_at DESC";
  } else if (scope === "city") {
    where = "TRUE";
  } else if (scope === "all") {
    where = "TRUE";
  } else if (scope === "mine") {
    where = "p_author.id = $1";
  }

  if (statusFilter) {
    params.push(statusFilter);
    where += ` AND r.status = $${params.length}`;
  } else if (scope !== "mine") {
    // Public scopes default to approved-only.
    where += " AND r.status = 'approved'";
  }

  const sql = `
    SELECT
      r.id, r.image_url, r.zone_name, r.area,
      cc.name AS category_name,
      csc.name AS sub_category_name,
      r.status, r.created_at, r.lat, r.lng,
      r.endorsement_count, r.downvote_count, r.comment_count,
      EXISTS (SELECT 1 FROM report_endorsements e WHERE e.report_id = r.id AND e.user_id = $1) AS user_endorsed,
      EXISTS (SELECT 1 FROM report_downvotes d WHERE d.report_id = r.id AND d.user_id = $1) AS user_downvoted,
      (SELECT sentiment FROM report_reactions WHERE report_id = r.id AND user_id = $1) AS user_reaction,
      (SELECT COUNT(*) FROM report_reactions WHERE report_id = r.id AND sentiment = 'happy')::int AS happy_count,
      (SELECT COUNT(*) FROM report_reactions WHERE report_id = r.id AND sentiment = 'neutral')::int AS neutral_count,
      (SELECT COUNT(*) FROM report_reactions WHERE report_id = r.id AND sentiment = 'angry')::int AS angry_count,
      p_author.user_id AS author_user_id,
      ${distanceSelect}
    FROM reports r
    LEFT JOIN profiles p_author ON p_author.user_id = r.user_id
    LEFT JOIN complaint_sub_categories csc ON csc.id = r.sub_category_id
    LEFT JOIN complaint_categories cc ON cc.id = csc.category_id
    WHERE ${where}
    ORDER BY ${orderBy}
    LIMIT $2
  `;

  const result = await query<ReportRow>(sql, params);

  return NextResponse.json(
    result.rows.map((r) => ({
      id: r.id,
      imageUrl: r.image_url,
      zone: r.zone_name ?? r.area ?? "Unknown",
      category: r.sub_category_name ?? r.category_name ?? "Uncategorized",
      status: r.status,
      createdAt: r.created_at,
      lat: r.lat,
      lng: r.lng,
      distanceMeters: r.distance_m,
      authorId: r.author_user_id,
      counts: {
        upvotes: r.endorsement_count,
        downvotes: r.downvote_count,
        comments: r.comment_count,
        happy: r.happy_count,
        neutral: r.neutral_count,
        angry: r.angry_count,
      },
      viewer: {
        upvoted: r.user_endorsed,
        downvoted: r.user_downvoted,
        reaction: r.user_reaction,
      },
    }))
  );
}
