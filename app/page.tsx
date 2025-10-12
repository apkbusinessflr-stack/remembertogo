"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function Home() {
  const [status, setStatus] = useState("checking…");

  useEffect(() => {
    const s = supabaseBrowser();
    s.auth.getSession().then(() => setStatus("ready")).catch(() => setStatus("ready"));
  }, []);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">RememberToGo</h1>
      <p className="text-sm text-neutral-600">
        Production-ready minimal shell.
      </p>
      <div className="rounded-xl border p-4">
        <div className="text-sm">Status: <span className="font-mono">{status}</span></div>
      </div>
    </main>
  );
}
