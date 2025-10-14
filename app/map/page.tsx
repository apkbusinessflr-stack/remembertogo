// app/map/page.tsx
import dynamic from "next/dynamic";
import { places } from "@/lib/db";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MyMap() {
  return (
    <main className="space-y-6">
      <h1>My Map</h1>
      <div className="card">
        <Map
          places={places.map((p) => ({
            id: p.id,
            name: p.name,
            lat: p.lat,
            lng: p.lng,
            visited: Math.random() > 0.5
          }))}
        />
      </div>
    </main>
  );
}
