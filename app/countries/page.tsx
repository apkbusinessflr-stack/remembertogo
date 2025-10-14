// app/countries/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { countries } from "@/lib/catalog";

export const metadata: Metadata = { title: "Countries • remembertogo" };

export default function Countries() {
  const list = [...countries].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main className="space-y-4">
      <h1>Countries</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {list.map((c) => (
          <Link
            key={c.code}
            className="card no-underline"
            href={`/countries/${c.code.toLowerCase()}`}
          >
            <div className="text-lg font-semibold">{c.name}</div>
            <div className="opacity-70 text-sm">{c.code}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
