// (src/)app/api/_diag/db/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const nowMs = () => Number(process.hrtime.bigint()) / 1e6;

export async function GET() {
  const t0 = nowMs();
  let pingMs = 0, queryMs = 0;

  try {
    const t1 = nowMs();
    await db.execute(sql`select 1 as x`);
    pingMs = nowMs() - t1;

    const t2 = nowMs();
    // Αν δεν υπάρχει ακόμα places, άλλαξέ το προσωρινά σε: select now() as now
    const r = await db.execute(sql`select count(*)::int as cnt from public.places`);
    queryMs = nowMs() - t2;

    return NextResponse.json({
      ok: true,
      timings_ms: { total: nowMs() - t0, db_ping: pingMs, simple_query: queryMs },
      result: r.rows?.[0] ?? null,
      ts: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e), timings_ms: { total: nowMs() - t0, db_ping: pingMs, simple_query: queryMs } },
      { status: 500 }
    );
  }
}
