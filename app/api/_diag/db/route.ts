// (src/)app/api/_diag/db/route.ts
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const nowMs = () => Number(process.hrtime.bigint()) / 1e6;

export async function GET() {
  const t0 = nowMs();
  let pingMs = 0, queryMs = 0;

  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      return NextResponse.json({ ok: false, error: "Missing DATABASE_URL" }, { status: 500 });
    }
    const sql = neon(url);

    // ping
    const t1 = nowMs();
    await sql`select 1 as x`;
    pingMs = nowMs() - t1;

    // απλό read (αν δεν υπάρχει places, άλλαξέ το σε `select now() as now`)
    const t2 = nowMs();
    const rows = await sql`select count(*)::int as cnt from public.places`;
    queryMs = nowMs() - t2;

    return NextResponse.json({
      ok: true,
      timings_ms: { total: nowMs() - t0, db_ping: pingMs, simple_query: queryMs },
      result: rows?.[0] ?? null,
      ts: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e), timings_ms: { total: nowMs() - t0, db_ping: pingMs, simple_query: queryMs } },
      { status: 500 }
    );
  }
}
