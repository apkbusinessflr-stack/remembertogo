import { NextResponse } from "next/server";

// Μιλάμε με DB; κράτα Node runtime. Για απλό ping δεν πειράζει, αλλά το κρατάμε ίδιο.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
