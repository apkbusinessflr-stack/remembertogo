// app/api/interest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";

/**
 * Δέχεται POST JSON: { country_code: "GR", note?: string }
 * - Καταγράφει ενδιαφέρον στο interest_votes (με hashed IP)
 * - Χρησιμοποιεί Supabase session αν υπάρχει (voter_id)
 */
export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const rawCode = String(body?.country_code || "").trim();
  if (rawCode.length !== 2) {
    return NextResponse.json({ ok: false, error: "invalid_country_code" }, { status: 400 });
  }
  const country = rawCode.toUpperCase();
  const note = body?.note ? String(body.note).slice(0, 500) : null;

  // Supabase session (αν υπάρχει)
  const supabase = createSupabaseServerClient();
  const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } as any }));
  const voterId = sessionData?.session?.user?.id ?? null;

  // Basic ελάχιστο rate/trace info
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "0.0.0.0";
  const userAgent = req.headers.get("user-agent") || "";

  try {
    await (sql as any)`
      INSERT INTO interest_votes (voter_id, country_code, ip_hash, user_agent, note)
      VALUES (${voterId}, ${country}, md5(${ip}), ${userAgent}, ${note})
    `;
  } catch (err: any) {
    console.error("[api/interest] insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", message: String(err?.message || err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
