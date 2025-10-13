// app/api/places/route.ts
import { NextResponse } from "next/server";
import { listPublicPlaces } from "@/lib/db-queries";
import { allow } from "@/lib/rate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getIP(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf && xf.length > 0) return xf.split(",")[0]!.trim();
  const xr = req.headers.get("x-real-ip");
  if (xr && xr.length > 0) return xr.trim();
  return "anon";
}

function parseBBox(v: string | null): [number, number, number, number] | null {
  if (!v) return null;
  const parts = v.split(",").map((x) => Number(x.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return null;
  const [minLng, minLat, maxLng, maxLat] = parts as [number, number, number, number];
  if (minLng < -180 || maxLng > 180 || minLat < -90 || maxLat > 90) return null;
  if (minLng > maxLng || minLat > maxLat) return null;
  return [minLng, minLat, maxLng, maxLat];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ip = getIP(req);

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
  } catch (err: any) {
    console.error("[api/places] failed", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", message: String(err?.message || err) },
      { status: 500 }
    );
  }
}
