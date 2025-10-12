"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, LngLatLike, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import { clientEnv } from "@/lib/env";

type Place = {
  id: string;
  title: string;
  description: string | null;
  lat: number;
  lng: number;
  country_code: string | null;
};

type Props = { center?: [number, number]; zoom?: number };

export default function Map({ center = [23.7275, 37.9838], zoom = 10 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const token = clientEnv.NEXT_PUBLIC_MAPTILER_KEY;

  useEffect(() => {
    if (!containerRef.current || !token) return;

    const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${token}`;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center,
      zoom,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", async () => {
      setReady(true);
      await loadPlaces(map);
      map.on("moveend", () => loadPlaces(map));
    });

    map.on("error", (e) => console.error("[map] error", (e as any)?.error ?? e));

    mapRef.current = map;
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center[0], center[1], zoom, token]);

  if (!token) {
    return (
      <div className="rounded-xl border p-4 bg-yellow-50 text-yellow-800">
        Λείπει το <code>NEXT_PUBLIC_MAPTILER_KEY</code>.
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

async function loadPlaces(map: MapLibreMap) {
  const bbox = map.getBounds();
  const q = new URLSearchParams({
    limit: "200",
    bbox: `${bbox.getWest()},${bbox.getSouth()},${bbox.getEast()},${bbox.getNorth()}`,
  });
  const res = await fetch(`/api/places?${q.toString()}`, { cache: "no-store" });
  const json = await res.json();
  if (!json?.ok) return;
  const items: Place[] = json.items || [];
  const fc = toGeoJSON(items);

  const srcId = "places-src";
  const layerCluster = "places-cluster";
  const layerClusterCount = "places-cluster-count";
  const layerUnclustered = "places-unclustered";

  if (!map.getSource(srcId)) {
    map.addSource(srcId, {
      type: "geojson",
      data: fc,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 40,
    });

    map.addLayer({
      id: layerCluster,
      type: "circle",
      source: srcId,
      filter: ["has", "point_count"],
      paint: {
        "circle-radius": ["step", ["get", "point_count"], 12, 50, 16, 150, 20],
        "circle-color": ["step", ["get", "point_count"], "#7aa2ff", 50, "#3b82f6", 150, "#1d4ed8"],
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 1,
      },
    });

    map.addLayer({
      id: layerClusterCount,
      type: "symbol",
      source: srcId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-size": 12,
      },
      paint: { "text-color": "#fff" },
    });

    map.addLayer({
      id: layerUnclustered,
      type: "circle",
      source: srcId,
      filter: ["!has", "point_count"],
      paint: {
        "circle-radius": 6,
        "circle-color": "#ef4444",
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 1,
      },
    });

    map.on("click", layerUnclustered, (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const coords =
        f.geometry.type === "Point" ? (f.geometry.coordinates as [number, number]) : [0, 0];
      const { title, description } = (f.properties || {}) as any;
      new maplibregl.Popup({ closeButton: true })
        .setLngLat(coords as LngLatLike)
        .setHTML(
          `<div style="max-width:220px">
             <div style="font-weight:600;margin-bottom:4px">${escapeHtml(title || "(untitled)")}</div>
             <div style="font-size:12px;opacity:0.8">${escapeHtml(description || "")}</div>
           </div>`
        )
        .addTo(map);
    });

    map.on("click", layerCluster, (e) => {
      const src = map.getSource(srcId) as GeoJSONSource;
      const f = e.features?.[0];
      if (!f) return;
      const clusterId = (f.properties as any)["cluster_id"];
      src.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || typeof zoom !== "number") return; // ✅ guard για types
        const [x, y] = (f.geometry as any).coordinates as [number, number];
        map.easeTo({ center: [x, y], zoom });
      });
    });
  } else {
    const src = map.getSource(srcId) as GeoJSONSource;
    src.setData(fc);
  }
}

function toGeoJSON(items: Place[]): GeoJSON.FeatureCollection<GeoJSON.Point, any> {
  return {
    type: "FeatureCollection",
    features: items.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        title: p.title,
        description: p.description,
        country: p.country_code,
      },
    })),
  };
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
