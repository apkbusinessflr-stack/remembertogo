"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // αν δεν το έβαλες global
import * as maplibregl from "maplibre-gl";
import { clientEnv } from "@/lib/env";

type Props = {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
};

export default function Map({ center = [23.7275, 37.9838], zoom = 5 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);

  // Πάρε το token από το clientEnv
  const token = clientEnv.NEXT_PUBLIC_MAPTILER_KEY;
 
  useEffect(() => {
    // Αν δεν υπάρχει token, μην αρχικοποιείς, μόνο εμφάνισε μήνυμα
    if (!token) return;

    if (containerRef.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${token}`,
        center,
        zoom,
        attributionControl: true
      });

      mapRef.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
      mapRef.current.on("load", () => setReady(true));
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token, center, zoom]);

  if (!token) {
    return (
      <div className="rounded-xl border p-4 bg-yellow-50 text-yellow-900">
        <div className="font-semibold mb-1">Map token λείπει</div>
        <div className="text-sm">
          Βάλε στο Vercel το <code>NEXT_PUBLIC_MAPTILER_KEY</code> (ή <code>MAP_TOKEN</code>) και κάνε redeploy.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="h-[480px] w-full rounded-xl overflow-hidden border" />
      <div className="text-xs text-neutral-500">
        {ready ? "Map ready" : "Loading map…"}
      </div>
    </div>
  );
}
