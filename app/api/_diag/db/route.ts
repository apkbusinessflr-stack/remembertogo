import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const [row] = await sql`select count(*)::int as cnt from public.places`;
  return NextResponse.json({ ok: true, count: row.cnt });
}
