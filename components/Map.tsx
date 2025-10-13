"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { clientEnv } from "@/lib/env";

export default function Map() {
  const container = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!container.current) return;

    const key = clientEnv.NEXT_PUBLIC_MAPTILER_KEY;
    if (!key) {
      setError("Λείπει το NEXT_PUBLIC_MAPTILER_KEY");
      return;
    }

    const map = new maplibregl.Map({
      container: container.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
      center: [23.7275, 37.9838],
      zoom: 6
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      try {
        // αρχικό fetch χωρίς bbox (π.χ. limit=50)
        const res = await fetch("/api/places?limit=50");
        const js = await res.json();
        if (!js.ok) throw new Error(js.error || "failed");

        const features = js.items.map((p: any) => ({
          type: "Feature",
          properties: { id: p.id, title: p.title },
          geometry: { type: "Point", coordinates: [p.lng, p.lat] }
        }));

        map.addSource("places", {
          type: "geojson",
          data: { type: "FeatureCollection", features },
          cluster: true,
          clusterRadius: 40
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "places",
          filter: ["has", "point_count"],
          paint: { "circle-color": "#2563eb", "circle-radius": 18, "circle-opacity": 0.8 }
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "places",
          filter: ["has", "point_count"],
          layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
          paint: { "text-color": "#fff" }
        });

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "places",
          filter: ["!", ["has", "point_count"]],
          paint: { "circle-color": "#10b981", "circle-radius": 6, "circle-stroke-width": 1, "circle-stroke-color": "#064e3b" }
        });

        map.on("click", "unclustered-point", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const [x, y] = (f.geometry as any).coordinates;
          new maplibregl.Popup().setLngLat([x, y]).setHTML(`<div style="font: 12px sans-serif">${f.properties?.title || "Place"}</div>`).addTo(map);
        });

        map.on("moveend", async () => {
          const b = map.getBounds().toArray().flat() as unknown as LngLatBoundsLike & number[];
          const bbox = `${b[0]},${b[1]},${b[2]},${b[3]}`;
          const r = await fetch(`/api/places?limit=200&bbox=${encodeURIComponent(bbox)}`);
          const j = await r.json();
          if (!j.ok) return;
          const feats = j.items.map((p: any) => ({
            type: "Feature",
            properties: { id: p.id, title: p.title },
            geometry: { type: "Point", coordinates: [p.lng, p.lat] }
          }));
          const src = map.getSource("places") as maplibregl.GeoJSONSource;
          src.setData({ type: "FeatureCollection", features: feats });
        });
      } catch (err: any) {
        setError(String(err?.message || err));
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div className="space-y-2">
      {error && <div className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
      <div ref={container} className="h-[70vh] w-full rounded-xl border" />
    </div>
  );
}
