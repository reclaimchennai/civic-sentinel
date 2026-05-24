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
  created_at: string;
  endorsement_count: number;
  user_endorsed: boolean;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "approved";
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);

  const session = await auth();
  const profileId = session?.user?.id ? (await ensureProfile(session.user.id)).id : null;

  const result = await query<ReportRow>(
    `SELECT
       r.id, r.image_url, r.zone_name, r.area,
       cc.name AS category_name,
       csc.name AS sub_category_name,
       r.created_at, r.endorsement_count,
       EXISTS (
         SELECT 1 FROM report_endorsements re
         WHERE re.report_id = r.id AND re.user_id = $3
       ) AS user_endorsed
     FROM reports r
     LEFT JOIN complaint_sub_categories csc ON csc.id = r.sub_category_id
     LEFT JOIN complaint_categories cc ON cc.id = csc.category_id
     WHERE r.status = $1
     ORDER BY r.endorsement_count DESC, r.created_at DESC
     LIMIT $2`,
    [status, limit, profileId]
  );

  return NextResponse.json(
    result.rows.map((r) => ({
      id: r.id,
      imageUrl: r.image_url,
      zone: r.zone_name ?? r.area ?? "Unknown",
      category: r.sub_category_name ?? r.category_name ?? "Uncategorized",
      createdAt: r.created_at,
      endorsements: r.endorsement_count,
      userEndorsed: r.user_endorsed,
    }))
  );
}
