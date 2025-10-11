// lib/db.ts
import { neon } from "@neondatabase/serverless";

// Ασφαλές: κόψε αμέσως αν λείπει URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const sql = neon(process.env.DATABASE_URL);
