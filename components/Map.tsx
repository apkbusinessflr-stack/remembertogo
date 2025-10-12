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
      type:
