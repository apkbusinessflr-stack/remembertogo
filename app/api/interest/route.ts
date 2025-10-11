import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";
import { sql } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const s = supabaseServer();
  const { data } = await s.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const b = await req.json().catch(() => ({} as any));
  const country = String(b.country_code || "").toUpperCase();
  const kind = b.kind ? String(b.kind) : null;

  if (!country || country.length !== 2) {
    return NextResponse.json({ error: "country_code required (ISO2)" }, { status: 400 });
  }

  const rows = await sql`
    insert into interest_votes (user_id, country_code, kind)
    values (${data.user.id}::uuid, ${country}, ${kind})
    on conflict (user_id, voted_on, country_code) do nothing
    returning 1
  `;
  return NextResponse.json({ ok: rows.length > 0 });
}
