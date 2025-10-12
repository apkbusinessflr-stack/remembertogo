"use client";


import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import { clientEnv } from "@/lib/env";


type Props = {
center?: [number, number]; // [lng, lat]
zoom?: number;
};


export default function Map({ center = [23.7275, 37.9838], zoom = 10 }: Props) {
const containerRef = useRef<HTMLDivElement | null>(null);
const mapRef = useRef<MapLibreMap | null>(null);
const [ready, setReady] = useState(false);


const token = clientEnv.NEXT_PUBLIC_MAPTILER_KEY;


useEffect(() => {
if (!containerRef.current) return;
if (!token) return;


const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${token}`;
const map = new maplibregl.Map({
container: containerRef.current,
style: styleUrl,
center,
zoom,
attributionControl: true,
});


map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
map.on("load", () => setReady(true));
map.on("error", (e) => console.error("[map] error", e?.error ?? e));


mapRef.current = map;
return () => {
mapRef.current?.remove();
mapRef.current = null;
};
}, [center[0], center[1], zoom, token]);


if (!token) {
return (
<div className="rounded-xl border p-4 bg-yellow-50 text-yellow-800">
Λείπει το <code>NEXT_PUBLIC_MAPTILER_KEY</code>. Βάλ’το στο Vercel (Preview/Production) και κάνε redeploy.
</div>
);
}


return (
<div className="space-y-2">
<div ref={containerRef} className="h-[70vh] w-full rounded-xl overflow-hidden border" />
<div className="text-xs text-neutral-500">{ready ? "Map ready" : "Loading map…"}</div>
</div>
);
}
