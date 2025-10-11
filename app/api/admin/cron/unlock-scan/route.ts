import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { env } from "../../../../lib/env";
import { sql } from "../../../../lib/db";

// απλή εξουσιοδότηση για cron: αν δεν έχεις CRON_SECRET -> επιτρέπεται (πρώτη φάση prod)
function authorized(req: NextRequest) {
  if (!env.CRON_SECRET) return true;
  const provided =
    req.headers.get("x-cron-signature") ||
    req.nextUrl.searchParams.get("sig") ||
    "";
  if (!provided) return false;
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
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const threshold = 25; // ψήφοι
  const windowDays = 30; // μέρες

  await sql`
    insert into country_unlocks (country_code, unlocked_at, score, state)
    select v.country_code, now(), count(*)::int, 'unlocked'
    from interest_votes v
    where voted_on >= now() - interval '${windowDays} days'
    group by v.country_code
    having count(*) >= ${threshold}
    on conflict (country_code) do update set
      score = excluded.score,
      state = excluded.state,
      unlocked_at = excluded.unlocked_at
  `;

  return NextResponse.json({ ok: true });
}
