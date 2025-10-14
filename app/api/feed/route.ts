// app/api/feed/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  // Demo public feed — cache briefly at the edge
  const body = {
    items: [
      { type: "visited", user: "alex", text: "visited Praia da Ursa" },
    ],
  };

  const res = NextResponse.json(body);
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
