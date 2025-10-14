// app/feed/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Feed • remembertogo" };

type Item = { type: string; user: string; text: string };

export default async function Feed() {
  let items: Item[] = [
    // fallback in case API fails
    { type: "visited", user: "alex", text: "visited Praia da Ursa" },
    { type: "new_tip", user: "maria", text: "added a tip on Praia da Marinha" },
  ];

  try {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
    const res = await fetch(`${base}/api/feed`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = (await res.json()) as { items?: Item[] };
      if (Array.isArray(json.items)) items = json.items;
    }
  } catch {
    // ignore and use fallback
  }

  return (
    <main className="space-y-6">
      <h1>Feed</h1>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="card text-sm">
            <span className="badge">{it.type}</span> {it.user} — {it.text}
          </div>
        ))}
      </div>
    </main>
  );
}
