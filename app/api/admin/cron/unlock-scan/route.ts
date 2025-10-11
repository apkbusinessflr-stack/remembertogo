import { NextResponse } from "next/server";

/**
 * Minimal cron endpoint: δεν κάνει έλεγχο HMAC προσωρινά,
 * απλά επιστρέφει 200 για να είναι πράσινο. Βάλε τη δουλειά σου εδώ.
 */
export async function POST() {
  // TODO: add actual job logic
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
}
