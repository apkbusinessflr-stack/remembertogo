// app/lists/[slug]/page.tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import ShareCardButton from "@/components/ShareCardButton";
import { getList, getPlacesByIds } from "@/lib/db";
import { notFound } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const list = getList(params.slug);
  return {
    title: `${list ? list.title : "List"} • remembertogo`,
    description: list
      ? `Explore ${list.title} on remembertogo.`
      : "Explore a travel list on remembertogo.",
  };
}

export default function ListPage({ params }: Props) {
  const list = getList(params.slug);
  if (!list) return notFound();

  const items = getPlacesByIds(list.places);
  const visited = 1;
  const total = items.length;

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>{list.title}</h1>
        <div className="badge">Progress: {visited}/{total}</div>
      </div>

      <Map
        places={items.map((p) => ({
          id: p.id,
          name: p.name,
          lat: p.lat,
          lng: p.lng,
        }))}
      />

      <div className="grid md:grid-cols-[1fr,320px] gap-4">
        <div className="card">
          <h3>Places</h3>
          <ul className="mt-3 space-y-3">
            {items.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs opacity-70">
                    {p.tags?.join(" • ")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="btn" href={`/place/${p.slug}`}>
                    Open
                  </Link>
                  <button className="btn">I went</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3>Share your progress</h3>
            <p className="text-sm opacity-80 mb-3">
              Generate an image and share anywhere.
            </p>
            <ShareCardButton
              listName={list.title}
              visited={visited}
              total={total}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
