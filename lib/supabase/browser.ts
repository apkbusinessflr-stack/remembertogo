import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env";
export function supabaseBrowser(): SupabaseClient {
  const url = clientEnv.NEXT_PUBLIC_SUPABASE_URL || "http://localhost";
  const anon = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon";
  return createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true }, global: { headers: { "X-Client-Info": "remembertogo/3" } } });
}
