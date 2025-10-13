import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: any = null;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const rawCode = String(body?.country_code || "").trim();
  if (rawCode.length !== 2) return NextResponse.json({ ok: false, error: "invalid_country_code" }, { status: 400 });
  const country = rawCode.toUpperCase();
  const note = body?.note ? String(body.note).slice(0, 500) : null;

  const supabase = createSupabaseServerClient();
  const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } as any }));
  const voterId = sessionData?.session?.user?.id ?? null;

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "0.0.0.0";
  const userAgent = req.headers.get("user-agent") || "";

  try {
    await (sql as any)`
      INSERT INTO interest_votes (voter_id, country_code, ip_hash, user_agent, note)
      VALUES (${voterId}, ${country}, md5(${ip}), ${userAgent}, ${note})
    `;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[api/interest] insert failed:", err);
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: String(err?.message || err) }, { status: 500 });
  }
}
