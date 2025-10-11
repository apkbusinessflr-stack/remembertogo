// app/api/_diag/db/route.ts
import { NextResponse } from "next/server";

// Αν έχεις ήδη Drizzle & Neon, κράτα αυτά τα imports.
// Προσαρμόσ' τα αν οι διαδρομές διαφέρουν στο repo σου.
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

// **Σημαντικό**: τρέχει σε Node runtime (όχι Edge), και πάντα δυναμικά.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function nowMs() {
  return Number(process.hrtime.bigint()) / 1e6; // high-resolution ms
}

export async function GET() {
  const t0 = nowMs();
  let pingMs = 0;
  let queryMs = 0;
  let err: any = null;

  try {
    const t1 = nowMs();
    await db.execute(sql`select 1 as x`);
    pingMs = nowMs() - t1;

    const t2 = nowMs();
    // Διάλεξα ένα απλό read. Αν δεν υπάρχει ο πίνακας 'places',
    // άλλαξέ το π.χ. σε `select now()` ή σε οποιονδήποτε υπάρχει.
    const r = await db.execute(sql`select count(*)::int as cnt from places`);
    queryMs = nowMs() - t2;

    const total = nowMs() - t0;
    return NextResponse.json({
      ok: true,
      timings_ms: { total, db_ping: pingMs, simple_query: queryMs },
      result: r.rows?.[0] ?? null,
      ts: new Date().toISOString()
    });
  } catch (e: any) {
    err = { message: e?.message ?? String(e) };
    const total = nowMs() - t0;
    return NextResponse.json(
      { ok: false, err, timings_ms: { total, db_ping: pingMs, simple_query: queryMs } },
      { status: 500 }
    );
  }
}
