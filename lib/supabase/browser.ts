import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/lib/env";

export const supabaseBrowser = () => {
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL || !clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (typeof window !== "undefined") {
      console.warn("[supabase] Missing NEXT_PUBLIC_SUPABASE_* envs — using placeholders.");
    }
  }
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon"
  );
};
