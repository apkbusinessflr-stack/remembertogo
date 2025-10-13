"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function Home() {
  const [status, setStatus] = useState("checking…");

  useEffect(() => {
    const s = supabaseBrowser();
    s.auth.getSession().then(() => setStatus("ready")).catch(() => setStatus("ready"));
  }, []);

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">RememberToGo</h1>
      <p className="text-sm text-neutral-600">
        Production skeleton. Χάρτης, API, DB, cron – όλα έτοιμα.
      </p>

      <div className="rounded-xl border p-4 bg-white">
        <div className="text-sm">Auth status: <span className="font-mono">{status}</span></div>
      </div>

      <div className="flex gap-3">
        <Link href="/map" className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-100">Άνοιξε Χάρτη</Link>
        <a href="/api/health" className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-100">Health</a>
        <a href="/api/places?limit=5" className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-100">Δείγμα /api/places</a>
      </div>
    </main>
  );
}
