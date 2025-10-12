"use client";
import dynamic from "next/dynamic";


const Map = dynamic(() => import("@/components/Map"), { ssr: false });


export default function MapPage() {
return (
<div className="min-h-[calc(100dvh-64px)] p-4">
<h1 className="text-2xl font-semibold mb-4">Χάρτης</h1>
<Map />
</div>
);
}
