// components/Map.tsx
"use client";
import { useEffect, useRef } from "react";
import maplibregl, { Map as MLMap, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Place = { id: number; name: string; lat: number; lng: number; visited?: boolean };

type Props = {
  places: Place[];
  center?: [number, number];
  zoom?: number;
};

export default function Map({
  places,
  center = [-9.1, 38.7],
  zoom = 6,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center,
      zoom,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    map.on("load", () => {
      // Create source & layer
      map.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "places",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "case",
            ["==", ["get", "visited"], true],
            "#34d399", // emerald for visited
            "#60a5fa", // blue for not visited
          ],
          "circle-stroke-color": "#0b1020",
          "circle-stroke-width": 1,
        },
      });

      // Click popup
      map.on("click", "places", (e) => {
        const f = e.features?.[0];
        const props = f?.properties as any;
        if (!f || !props) return;

        const [lng, lat] = (f.geometry as any).coordinates as [number, number];
        new Popup({ closeButton: false })
          .setLngLat([lng, lat])
          .setHTML(
            `<div style="font: 500 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
               ${escapeHtml(props.name || "Place")}
             </div>`
          )
          .addTo(map);
      });

      map.on("mouseenter", "places", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "places", () => (map.getCanvas().style.cursor = ""));
    });

    // Resize observer to keep map responsive
    const ro = new ResizeObserver(() => {
      try {
        map.resize();
      } catch {}
    });
    ro.observe(ref.current);

    return () => {
      ro.disconnect();
      try {
        map.remove();
      } catch {}
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data when places change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const src: any = map.getSource("places");
    if (src) {
      const fc = {
        type: "FeatureCollection" as const,
        features: places.map((p) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
          properties: { id: p.id, name: p.name, visited: !!p.visited },
        })),
      };
      try {
        src.setData(fc);
      } catch {}
    }
  }, [JSON.stringify(places)]);

  // Update view when center/zoom props change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    try {
      map.jumpTo({ center, zoom });
    } catch {}
  }, [center[0], center[1], zoom]);

  return (
    <div
      ref={ref}
      className="w-full h-[420px] rounded-2xl overflow-hidden border border-white/10"
    />
  );
}

/* ---- utils ---- */
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
