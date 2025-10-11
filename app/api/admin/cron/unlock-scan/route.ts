// app/api/admin/cron/unlock-scan/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { env } from "@/lib/env";

/**
 * Επαλήθευση HMAC υπογραφής:
 * - Σε Preview/Dev: επιτρέπουμε χωρίς υπογραφή (ευκολία για manual tests).
 * - Σε Production: απαιτείται x-cron-signature = HMAC_SHA256("unlock-scan", CRON_SECRET) σε hex.
 */
function isAuthorized(req: NextRequest) {
  const vercelEnv = process.env.VERCEL_ENV || process.env.NODE_ENV;
  const isProd = vercelEnv === "production";

  const provided =
    req.headers.get("x-cron-signature") ||
    req.nextUrl.searchParams.get("sig") ||
    "";

  if (!isProd) return true; // allow in dev/preview

  if (!env.CRON_SECRET || !provided) return false;

  const expected = crypto
    .createHmac("sha256", env.CRON_SECRET)
    .update("unlock-scan")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const threshold = Number(env.INTEREST_THRESHOLD || "25");     // ελάχιστες ψήφοι σε παράθυρο
  const windowDays = Number(env.INTEREST_WINDOW_DAYS || "30");  // μέρες παραθύρου

  // Ενιαίο statement (Neon-friendly): υπολόγισε score ανά χώρα στο χρονικό παράθυρο
  // κι ενημέρωσε/δημιούργησε εγγραφή στο country_unlocks.
  await sql`
    insert into country_unlocks (country_code, unlocked_at, score, state)
    select v.country_code, now(), v.total, 'unlocked'
    from (
      select country_code, count(*)::int as total
      from interest_votes
      where voted_on >= now() - interval '${windowDays} days'
      group by country_code
    ) as v
    where v.total >= ${threshold}
    on conflict (country_code) do update set
      unlocked_at = excluded.unlocked_at,
      score       = excluded.score,
      state       = excluded.state
  `;

  return NextResponse.json({ ok: true });
}
