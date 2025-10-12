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
    // timingSafeEqual απαιτεί ίδιου μήκους buffers — αν όχι, θα πετάξει.
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // ✅ exactOptionalPropertyTypes-safe (χρησιμοποιούμε ?? για defaults)
  const threshold = Number(env.INTEREST_THRESHOLD ?? "25");     // ελάχιστες ψήφοι στο παράθυρο
  const windowDays = Number(env.INTEREST_WINDOW_DAYS ?? "30");  // μέρες παραθύρου

  // ✅ Neon-friendly / πλήρως παραμετροποιημένο: make_interval(days => $1)
  // Αποφεύγουμε το '... interval '${windowDays} days'' string concat.
  try {
    await (sql as any)`
      INSERT INTO country_unlocks (country_code, unlocked_at, score, state)
      SELECT v.country_code, now(), v.total, 'unlocked'
      FROM (
        SELECT country_code, COUNT(*)::int AS total
        FROM interest_votes
        WHERE voted_on >= now() - make_interval(days => ${windowDays})
        GROUP BY country_code
      ) AS v
      WHERE v.total >= ${threshold}
      ON CONFLICT (country_code) DO UPDATE SET
        unlocked_at = EXCLUDED.unlocked_at,
        score       = EXCLUDED.score,
        state       = EXCLUDED.state
    `;
  } catch (err) {
    // Καλύτερο log για troubleshooting (δες Vercel Function Logs)
    console.error("[cron/unlock-scan] SQL failed:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", message: String((err as any)?.message || err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
