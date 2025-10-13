import postgres from "postgres";
import { env } from "@/lib/env";

// Neon serverless-friendly client
export const sql = postgres(env.DATABASE_URL, {
  ssl: "require",
  max: 1,          // serverless: μικρό pool
  prepare: true    // βελτιώνει repeated queries
});
