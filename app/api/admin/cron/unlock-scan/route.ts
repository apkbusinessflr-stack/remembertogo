// app/api/admin/cron/unlock-scan/route.ts
import crypto from "node:crypto";
import { NextResponse, NextRequest } from "next/server";
import { env } from "@/lib/env";
// import { db } from "@/lib/db";

function verifySignature(req: NextRequest) {
  const sig = req.headers.get("x-cron-signature");
  if (!sig) return false;
  const body = "__constant__"; // ή timestamp header, ή raw body hash
  const h = crypto.createHmac("sha256", env.CRON_SECRET).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(h));
}

export async function POST(req: NextRequest) {
  if (!verifySignature(req)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  // await db.execute(`UPDATE scans SET locked = false WHERE locked = true`);
  return NextResponse.json({ ok: true });
}
