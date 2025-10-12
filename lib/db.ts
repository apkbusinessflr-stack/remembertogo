// lib/db.ts
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";

// Ασφαλές: κόψε αμέσως αν λείπει URL
if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const sql = neon(env.DATABASE_URL);
