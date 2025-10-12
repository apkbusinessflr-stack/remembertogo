// app/api/places/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Helpers: ασφαλές parsing & validation
 */
function parseNumber(v: string | null | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function inRange(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}

/**
 * Δέχεται string[] (π.χ. από query "w,s,e,n") ή πιθανό tuple με undefined
 * και επιστρέφει αυστηρό tuple [w,s,e,n] (numbers) ή null.
 */
function parseBBox(
  p: [number?, number?, number?, number?] | string[] | null,
): [number, number, number, number] | null {
  if (!p) return null;

  let vals: (number | null)[];

  // Περίπτωση query string -> string[]
  if (Array.isArray(p) && typeof p[0] === "string") {
    vals = (p as string[]).map((x) => parseNumber(x));
  } else {
    // Περίπτωση tuple με πιθανά undefined
    vals = (p as any[]).map((x) => (Number.isFinite(x) ? (x as number) : null));
  }

  if (vals.length !== 4 || vals.some((v) => v === null)) return null;

  const [w, s, e, n] = vals as [number, number, number, number];

  if (!inRange(w, -180, 180) || !inRange(e, -180, 180)) return null;
  if (!inRange(s, -90, 90) || !inRange(n, -90, 90)) return null;
  if (!(w < e && s < n)) return null;

  return [w, s, e, n];
}

/**
 * Σχήμα εισόδου για POST /places
 */
const PlaceInput = z.object({
  name: z.string().min(1).max(200),
  country_code: z.string().min(2).max(2).toUpperCase(),
  lat: z.number().gte(-90).lte(90),
  lng: z.number().gte(-180).lte(180),
  // optional fields αν υπάρχουν
  description: z.string().max(1000).optional(),
});

/**
 * GET /api/places?bbox=w,s,e,n
 * Επιστρέφει σημεία εντός bbox (μέγιστο 500 για προστασία).
 */
export async function GET(req: NextRequest) {
  try {
    const raw = (req.nextUrl.searchParams.get("bbox") ?? "")
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    const bbox = parseBBox(raw.length ? raw : null);
    if (!bbox) {
      return NextResponse.json(
        { error: "invalid_bbox", hint: "expected ?bbox=w,s,e,n" },
        { status: 400 },
      );
    }

    const [w, s, e, n] = bbox;

    // Προαιρετικό limit param (?limit=...)
    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = Math.max(
      1,
      Math.min(500, Number.isFinite(Number(limitParam)) ? Number(limitParam) : 100),
    );

    // Ασφαλές parametric query (Neon)
    const rows = await sql/*sql*/`
      SELECT id, name, country_code, lat, lng, description
      FROM places
      WHERE lng BETWEEN ${w} AND ${e}
        AND lat BETWEEN ${s} AND ${n}
      ORDER BY id DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({ ok: true, count: rows.length, data: rows }, { status: 200 });
  } catch (err) {
    console.error("GET /api/places error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

/**
 * POST /api/places
 * Απαιτεί authenticated χρήστη (Supabase) και δημιουργεί σημείο.
 */
export async function POST(req: NextRequest) {
  try {
    // Auth (server-side supabase)
    const sb = supabaseServer();
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Body validation
    const json = await req.json().catch(() => null);
    const parsed = PlaceInput.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_body", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, country_code, lat, lng, description } = parsed.data;

    // Εισαγωγή με επιστροφή
    const rows = await sql/*sql*/`
      INSERT INTO places (name, country_code, lat, lng, description, created_by)
      VALUES (${name}, ${country_code}, ${lat}, ${lng}, ${description ?? null}, ${user.email ?? null})
      RETURNING id, name, country_code, lat, lng, description
    `;

    return NextResponse.json({ ok: true, data: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/places error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

/**
 * Next.js route options
 * - Node runtime (ώστε Supabase server client/Neon να είναι άνετα)
 * - Force dynamic για να μην “κολλήσει” σε static optimization
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
