// app/place/[slug]/page.tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import TipComposer from "@/components/TipComposer";
import TipList from "@/components/TipList";
import PhotoGrid from "@/components/PhotoGrid";
import { getPlace } from "@/lib/db";
import { placeSchema } from "@/lib/seo";
import { notFound } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const place = getPlace(params.slug);
  if (!place) return { title: "Place not found • remembertogo" };
  return {
    title: `${place.name} • remembertogo`,
    description: `Discover ${place.name} in ${place.country} on remembertogo.`,
  };
}

export default function PlacePage({ params }: Props) {
  const place = getPlace(params.slug);
  if (!place) return notFound();

  const schema = placeSchema(place);

  return (
    <main className="space-y-6">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex items-center justify-between">
        <h1>{place.name}</h1>
        <div className="badge">{place.country}</div>
      </div>

      <Map
        places={[{ id: place.id, name: place.name, lat: place.lat, lng: place.lng }]}
        center={[place.lng, place.lat]}
        zoom={10}
      />

      <div className="grid md:grid-cols-[1fr,320px] gap-4">
        <div className="card space-y-4">
          <h3>Tips</h3>
          <TipComposer placeId={place.id} />
          <TipList
            tips={[
              { user: "alex", body: "Arrive early; short steep trail.", date: "2025-09-15" },
            ]}
          />
          <h3>Photos</h3>
          <PhotoGrid photos={[]} />
        </div>

        <div className="space-y-4">
          <div className="card text-sm opacity-80">
            <div>Tags: {place.tags?.join(" • ") || "—"}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
