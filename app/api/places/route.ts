import { NextResponse } from "next/server";
import { listPublicPlaces } from "@/lib/db-queries";
import { allow } from "@/lib/rate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseBBox(v: string | null): [number, number, number, number] | null {
  if (!v) return null;
  const parts = v.split(",").map((x) => Number(x.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return null;
  const [minLng, minLat, maxLng, maxLat] =
    parts as [number, number, number, number];
  if (minLng < -180 || maxLng > 180 || minLat < -90 || maxLat > 90) return null;
  if (minLng > maxLng || minLat > maxLat) return null;
  return [minLng, minLat, maxLng, maxLat];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ip = (req.headers.get("x-forwarded-for") || "anon").split(",")[0].trim();
  if (!allow(ip, 60, 1)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit") ?? 50), 200));
  const country = url.searchParams.get("country");
  const cursor = url.searchParams.get("cursor");
  const bbox = parseBBox(url.searchParams.get("bbox"));

  try {
    const { items, nextCursor } = await listPublicPlaces({ country, limit, cursor, bbox });
    return NextResponse.json({ ok: true, count: items.length, nextCursor, items });
  } catch (err) {
    console.error("[api/places] failed", err);
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
