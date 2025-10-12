import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CntRow = { cnt: number };

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      return NextResponse.json({ ok: false, error: "Missing DATABASE_URL" }, { status: 500 });
    }

    const sql = neon(url);

    const rows = await sql<CntRow>`select count(*)::int as cnt from public.places`;
    const count = rows[0]?.cnt ?? 0;  // <-- ασφαλές, δεν σκάει αν δεν γυρίσει γραμμή

    return NextResponse.json({ ok: true, count, ts: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
