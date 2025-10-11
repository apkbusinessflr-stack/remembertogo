import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const now = new Date();
    const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    since.setUTCDate(since.getUTCDate() - env.INTEREST_WINDOW_DAYS);

    const rows = await db`
      SELECT country_code, SUM(count)::int AS total
      FROM interest_counters
      WHERE day >= ${since.toISOString()}
      GROUP BY country_code
    ` as any;

    let unlocked = 0;
    for (const r of rows) {
      if ((r.total ?? 0) >= env.INTEREST_THRESHOLD) {
        await db`
          UPDATE countries
          SET approved = true, approved_at = NOW()
          WHERE code = ${r.country_code} AND (approved IS DISTINCT FROM true)
        `;
        unlocked++;
      }
    }
    return NextResponse.json({ ok: true, checked: rows.length, unlocked });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message ?? "unknown error" }, { status: 500 });
  }
}

export const GET = POST;
