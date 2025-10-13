import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/env";
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
      remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: "", ...options, maxAge: 0 }); }
    },
    headers: { "X-Client-Info": "remembertogo/3" }
  });
}
export const supabaseServer = createSupabaseServerClient;
