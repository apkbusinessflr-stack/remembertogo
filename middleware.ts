// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { adminEmails } from "@/lib/env";

/**
 * Edge-safe JWT payload decode (χωρίς Buffer, δουλεύει στην Edge Runtime).
 * Δεν επαληθεύει υπογραφή — διαβάζει μόνο claims για authorization gate.
 */
function decodeJwt<T = any>(jwt: string): T | null {
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;

    const b64url = parts[1];
    const base = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (base.length % 4)) % 4);
    const s = base + pad;

    const bin = atob(s);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ["/admin/:path*"], // φιλτράρουμε μόνο admin routes
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // 1) Αν δεν έχουμε καθόλου adminEmails, άσε να περάσει (fail-open για αρχική φάση)
  if (!adminEmails.length) {
    return NextResponse.next();
  }

  // 2) Πάρε το Supabase access token cookie ("sb-access-token")
  const access = req.cookies.get("sb-access-token")?.value;
  if (!access) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("redirectTo", url.pathname + url.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3) Διάβασε το email από τα claims
  type Claims = { email?: string; exp?: number };
  const claims = decodeJwt<Claims>(access);
  const email = claims?.email?.toLowerCase();

  // 4) Έλεγχος λήξης
  if (claims?.exp && Date.now() / 1000 > claims.exp) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("redirectTo", url.pathname + url.search);
    return NextResponse.redirect(loginUrl);
  }

  // 5) Άδεια μόνο αν email ∈ ADMIN_EMAILS
  if (!email || !adminEmails.includes(email)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}
