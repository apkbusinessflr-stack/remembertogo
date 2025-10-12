import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export function middleware(_req: NextRequest) {
// Προσωρινά ουδέτερο: δεν μπλοκάρει τίποτα μέχρι να βάλουμε admin gate στο Node runtime
return NextResponse.next();
}


export const config = {
matcher: [],
};
