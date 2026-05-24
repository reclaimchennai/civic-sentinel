import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

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
  endorsement_count: number;
};

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

  const result = await query<ReportRow>(
    `SELECT
       r.id, r.image_url, r.zone_name, r.area,
       cc.name AS category_name,
       csc.name AS sub_category_name,
       r.status, r.created_at, r.endorsement_count
     FROM reports r
     LEFT JOIN complaint_sub_categories csc ON csc.id = r.sub_category_id
     LEFT JOIN complaint_categories cc ON cc.id = csc.category_id
     WHERE r.status = $1
     ORDER BY r.created_at DESC
     LIMIT $2`,
    [status, limit]
  );

  return NextResponse.json(
    result.rows.map((r) => ({
      id: r.id,
      imageUrl: r.image_url,
      zone: r.zone_name ?? r.area ?? "Unknown",
      category: r.sub_category_name ?? r.category_name ?? "Uncategorized",
      description: r.sub_category_name ?? r.category_name ?? "",
      status: r.status,
      createdAt: r.created_at,
      endorsements: r.endorsement_count,
    }))
  );
}
