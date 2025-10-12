import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const nowMs = () => Number(process.hrtime.bigint()) / 1e6;

export async function GET() {
  const t0 = nowMs();
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return NextResponse.json({ ok: false, error: "Missing DATABASE_URL" }, { status: 500 });

    const sql = neon(url);

    const t1 = nowMs();
    await sql`select 1 as x`;
    const db_ping = nowMs() - t1;

    const t2 = nowMs();
    const rows = await sql`select count(*)::int as cnt from public.places`;
    const simple_query = nowMs() - t2;

    return NextResponse.json({
      ok: true,
      timings_ms: { total: nowMs() - t0, db_ping, simple_query },
      result: rows?.[0] ?? null,
      ts: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
