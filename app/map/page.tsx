export const dynamic = "force-dynamic"; // προαιρετικό, για να μη cache-άρει στο build

import Map from "@/components/Map";

export default function MapPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">Map</h1>
      <Map center={[23.7275, 37.9838]} zoom={5} />
    </main>
  );
}
