"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function MapPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Χάρτης</h1>
      <Map />
    </main>
  );
}
