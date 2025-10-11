import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export const supabaseServer = () =>
  createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon",
    { cookies, headers }
  );
