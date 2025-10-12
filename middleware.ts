// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_req: NextRequest) {
  // Προς το παρόν δεν κάνουμε auth gate εδώ για να μην μπλοκάρει ο build.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"], // ή ακόμη και [] αν θες να το απενεργοποιήσεις εντελώς
};
