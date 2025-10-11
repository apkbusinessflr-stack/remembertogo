// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { adminEmails } from "./lib/env"; // now exists

function decodeJwt<T = any>(jwt: string): T | null {
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  const auth = req.headers.get("authorization"); // "Bearer <JWT>"
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  const claims = token ? decodeJwt<any>(token) : null;

  const email: string | undefined = claims?.email ?? claims?.user_metadata?.email;
  const isExpired = claims?.exp && Date.now() / 1000 > claims.exp;

  if (!token || !claims || isExpired) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("redirectTo", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }

  if (!email || !adminEmails.map((e) => e.toLowerCase()).includes(email.toLowerCase())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
