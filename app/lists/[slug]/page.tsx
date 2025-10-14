import Map from "@/components/Map";
import ShareCardButton from "@/components/ShareCardButton";
import { getList, getPlacesByIds } from "@/lib/db";
import { notFound } from "next/navigation";

export default function ListPage({ params }: { params: { slug: string } }) {
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

      <Map places={items.map(p => ({ id: p.id, name: p.name, lat: p.lat, lng: p.lng }))} />

      <div className="grid md:grid-cols-[1fr,320px] gap-4">
        <div className="card">
          <h3>Places</h3>
          <ul className="mt-3 space-y-3">
            {items.map(p => (
              <li key={p.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs opacity-70">{p.tags?.join(" • ")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a className="btn" href={`/place/${p.slug}`}>Open</a>
                  <button className="btn">I went</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3>Share your progress</h3>
            <p className="text-sm opacity-80 mb-3">Generate an image and share anywhere.</p>
            <ShareCardButton listName={list.title} visited={visited} total={total} />
          </div>
        </div>
      </div>
    </main>
  );
}
