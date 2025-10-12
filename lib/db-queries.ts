// lib/db-queries.ts
import { sql } from "@/lib/db";

export type PlaceRow = {
  id: string;
  owner: string;
  title: string;
  description: string | null;
  country_code: string | null;
  lat: number;
  lng: number;
  is_public: boolean;
  created_at: string; // ISO
};

export type ListPlacesParams = {
  country?: string | null;
  limit?: number; // 1..200
  cursor?: string | null; // base64("<iso>|<id>")
  bbox?: [number, number, number, number] | null; // [minLng,minLat,maxLng,maxLat]
};

function decodeCursor(cursor: string | null): { createdAt: string; id: string } | null {
  if (!cursor) return null;
  try {
    const [createdAt, id] = Buffer.from(cursor, "base64").toString("utf8").split("|");
    if (!createdAt || !id) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

export async function listPublicPlaces(params: ListPlacesParams) {
  const limit = Math.max(1, Math.min(params.limit ?? 50, 200));
  const c = decodeCursor(params.cursor ?? null);
  const country = params.country?.toUpperCase() ?? null;
  const bbox = params.bbox ?? null;

  // WHERE κομμάτια
  const where = [sql`is_public = true`];
  if (country) where.push(sql`country_code = ${country}`);
  if (bbox) {
    const [minLng, minLat, maxLng, maxLat] = bbox;
    where.push(sql`lat BETWEEN ${minLat} AND ${maxLat}`);
    where.push(sql`lng BETWEEN ${minLng} AND ${maxLng}`);
  }
  if (c) {
    // keyset pagination (created_at,id)
    where.push(sql`(created_at, id) < (${c.createdAt}::timestamptz, ${c.id})`);
  }

  // ✅ ΣΩΣΤΟ generic: <PlaceRow> (όχι <PlaceRow[]>)
  const rows = await sql<PlaceRow>`
    SELECT id, owner, title, description, country_code, lat, lng, is_public, created_at
    FROM places
    WHERE ${sql.join(where, sql` AND `)}
    ORDER BY created_at DESC, id DESC
    LIMIT ${limit + 1}
  `;

  let nextCursor: string | null = null;
  let items = rows;
  if (rows.length > limit) {
    const last = rows[limit - 1];
    nextCursor = Buffer.from(`${last.created_at}|${last.id}`, "utf8").toString("base64");
    items = rows.slice(0, limit);
  }

  return { items, nextCursor };
}
