import { auth } from "@/auth";
import { NextResponse } from "next/server";

type AdminSession = {
  user: { id: string; name?: string | null; email?: string | null; role?: string };
};

export async function requireAdmin(): Promise<
  { ok: true; session: AdminSession } | { ok: false; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, session: session as AdminSession };
}
