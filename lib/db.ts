import { neon } from "@neondatabase/serverless";

// server-only var (υπάρχει μόνο στον Node runtime)
export const db = neon(process.env.DATABASE_URL!);
