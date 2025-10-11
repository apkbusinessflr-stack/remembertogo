// lib/db.ts
import { neon } from "@neondatabase/serverless";
// If you use Drizzle:
import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "@/drizzle/schema"; // optional

import { env } from "./env";

const sql = neon(env.DATABASE_URL, { fetchOptions: { cache: "no-store" } });
// export const db = drizzle(sql, { schema }); // with schema
export const db = drizzle(sql); // without schema

// Example safe param query
export async function getUserPlaces(userId: string) {
  return db.execute(
    // parameterized; drizzle/neon handles escaping
    `SELECT id, title, lat, lng FROM places WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
}
