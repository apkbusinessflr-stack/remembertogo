import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

function now() { return Number(process.hrtime.bigint()) / 1e6; } // ms

export const dynamic = "force-dynamic"; // always run fresh (no static cache)

export async function GET(_req: NextRequest) {
  const t0 = now();
  let tDbConnect = 0, tPing = 0, tSimpleQuery = 0, err: any = null;

  try {
    // Neon + Drizzle χρησιμοποιούν HTTP pooling, οπότε το "connect" κοστίζει ελάχιστα σε warm.
    const t1 = now();
    // ping
    await db.execute(sql`select 1 as x`);
    tPing = now() - t1;

    const t2 = now();
    // απλό query: πόσες public places έχουμε (ή άλλα στατιστικά που έχεις)
    const res = await db.execute(sql`select count(*)::int as cnt from places`);
    tSimpleQuery = now() - t2;

  } catch (e: any) {
    err = { message: e?.message ?? String(e) };
  }

  const total = now() - t0;
  return NextResponse.json({
    ok: !err, err,
    timings_ms: {
      total, db_ping: tPing, simple_query: tSimpleQuery
    },
    ts: new Date().toISOString()
  });
}
