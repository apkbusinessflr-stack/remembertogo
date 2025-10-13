import postgres from "postgres";
import { env } from "@/lib/env";
export const sql = postgres(env.DATABASE_URL, { ssl: "require", max: 1, prepare: true });
