// app/api/places/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";

const MAX_LIMIT = 500;

function inRange(n: number, a: number, b: number) {
  return Number.isFinite(n) && n >= a && n <= b;
}

function parseBbox(str: string) {
  const p = str.split(",").map((x) => Number(x.trim()));
  if (p.length !== 4 || p.some((v) => Number.isNaN(v))) return null;
  const [w, s, e, n] = p;
  // γεωγραφικά όρια + w<e, s<n
  if (!inRange(w, -180, 180) || !inRange(e, -180, 180)) return null;
  if (!inRange(s, -90, 90) || !inRange(n, -90, 90)) return null;
  if (!(w < e && s < n)) return null;
  return [w, s, e, n] as const;
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("bbox");
    if (!q) return NextResponse.json({ error: "bbox required" }, { status: 400 });

    const bbox = parseBbox(q);
    if (!bbox) return NextResponse.json({ error: "invalid bbox" }, { status: 400 });

    const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? MAX_LIMIT);
    const limit = Number.isFinite(limitParam)
      ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(limitParam)))
      : MAX_LIMIT;

    const [w, s, e, n] = bbox;

    const rows = await sql`
      select id, kind, title, country_code, lat, lng, created_at
      from places
      where lng between ${w} and ${e}
        and lat between ${s} and ${n}
        and is_public = true
      order by created_at desc
      limit ${limit}
    `;

    return NextResponse.json({ items: rows }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/places] failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const s = supabaseServer();
    const { data } = await s.auth.getUser();
    if (!data?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as
      | {
          kind?: string;
          title?: string;
          desc?: string;
          country_code?: string;
          lat?: number;
          lng?: number;
          is_public?: boolean;
        }
      | null;

    if (!body) {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    // Υποχρεωτικά πεδία
    const missing = ["kind", "title", "country_code", "lat", "lng"].filter(
      (k) => !(k in body!)
    );
    if (missing.length) {
      return NextResponse.json({ error: `missing ${missing.join(",")}` }, { status: 400 });
    }

    // Canonicalization + validation
    const kind = String(body.kind).trim(); // π.χ. "beach" | "hike" | ...
    const title = String(body.title).trim();
    const desc = String(body.desc ?? "").trim();
    const country_code = String(body.country_code).trim().toUpperCase();
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const is_public = body.is_public ?? true;

    if (title.length < 1 || title.length > 100) {
      return NextResponse.json({ error: "title length 1..100" }, { status: 400 });
    }
    if (desc.length > 500) {
      return NextResponse.json({ error: "desc max 500 chars" }, { status: 400 });
    }
    if (!/^[A-Z]{2}$/.test(country_code)) {
      return NextResponse.json({ error: "country_code must be ISO-3166-1 alpha-2" }, { status: 400 });
    }
    if (!inRange(lat, -90, 90) || !inRange(lng, -180, 180)) {
      return NextResponse.json({ error: "invalid lat/lng" }, { status: 400 });
    }

    // Εισαγωγή
    const rows = await sql`
      insert into places (owner, kind, title, description, country_code, lat, lng, is_public)
      values (
        ${data.user.id}::uuid,
        ${kind},
        ${title},
        ${desc},
        ${country_code},
        ${lat},
        ${lng},
        ${is_public}
      )
      returning id
    `;

    return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/places] failed:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
