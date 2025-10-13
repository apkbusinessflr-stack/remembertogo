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
  created_at: string;
};

export type ListPlacesParams = {
  country?: string | null;
  limit?: number;
  cursor?: string | null;
  bbox?: [number, number, number, number] | null;
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

  const minLng = params.bbox ? params.bbox[0] : null;
  const minLat = params.bbox ? params.bbox[1] : null;
  const maxLng = params.bbox ? params.bbox[2] : null;
  const maxLat = params.bbox ? params.bbox[3] : null;

  const result = await (sql as any)`
    SELECT id, owner, title, description, country_code, lat, lng, is_public, created_at
    FROM places
    WHERE is_public = true
      AND (${country}::text IS NULL OR country_code = ${country})
      AND (${minLat}::float8 IS NULL OR lat BETWEEN ${minLat} AND ${maxLat})
      AND (${minLng}::float8 IS NULL OR lng BETWEEN ${minLng} AND ${maxLng})
      AND (${c ? c.createdAt : null}::timestamptz IS NULL
           OR (created_at, id) < (${c ? c.createdAt : null}::timestamptz, ${c ? c.id : null}))
    ORDER BY created_at DESC, id DESC
    LIMIT ${limit + 1}
  `;

  const rows: PlaceRow[] = Array.isArray(result) ? (result as PlaceRow[]) : [];
  const items = rows.slice(0, Math.min(limit, rows.length));
  let nextCursor: string | null = null;

  if (rows.length > limit && items.length > 0) {
    const last = items[items.length - 1]!;
    nextCursor = Buffer.from(`${last.created_at}|${last.id}`, "utf8").toString("base64");
  }

  return { items, nextCursor };
}
