// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { env, adminEmails } from "./lib/env";

export async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);
  if (pathname.startsWith("/api/admin")) {
    // simple bearer or signature check for cron
    const sig = req.headers.get("x-cron-signature");
    if (pathname.includes("/cron/")) {
      if (!sig || sig !== env.CRON_SECRET) {
        return new NextResponse("Forbidden (cron)", { status: 403 });
      }
      return NextResponse.next();
    }
    // require authenticated admin for non-cron admin routes
    const email = req.headers.get("x-user-email"); // see server action below
    if (!email || !adminEmails.has(email.toLowerCase())) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
