'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, {
  Map as MlMap,
  LngLatLike,
  CircleLayerSpecification,
  SymbolLayerSpecification,
  GeoJSONSourceSpecification,
  ExpressionSpecification,
  MapLayerMouseEvent, // <-- σωστός τύπος event για click σε layer
} from 'maplibre-gl';

// ids: string|number για να μην “σκάει” σε demos/tests
type PlaceInput = {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  visited?: boolean;
};

type Props = {
  places: PlaceInput[];
  center?: LngLatLike; // default: Αθήνα
  zoom?: number;       // default: 12
  cluster?: boolean;   // default: false
};

export default function Map({ places, center, zoom, cluster = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MlMap | null>(null);
  const [loaded, setLoaded] = useState(false);

  const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;

  useEffect(() => {
    if (!ref.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: ref.current,
      style: styleUrl,
      center: center ?? [23.7275, 37.9838],
      zoom: zoom ?? 12,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.on('load', () => setLoaded(true));

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      setLoaded(false);
    };
  }, [center, zoom, styleUrl]);

  const sourceData: GeoJSONSourceSpecification = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: places.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: { id: String(p.id), name: p.name, visited: Boolean(p.visited) },
      })),
    },
    cluster,
    clusterRadius: 40,
  };

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const map = mapRef.current;

    // Source
    if (map.getSource('places')) {
      (map.getSource('places') as any).setData(sourceData.data);
    } else {
      map.addSource('places', sourceData);
    }

    // Colors by visited
    const visitedColorExpr: ExpressionSpecification = [
      'case',
      ['==', ['get', 'visited'], true],
      '#4ade80',
      '#ef4444',
    ];

    const unclusteredLayer: CircleLayerSpecification = {
      id: 'places-unclustered',
      type: 'circle',
      source: 'places',
      filter: ['!', ['has', 'point_count']], // NOT cluster
      paint: {
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
        'circle-color': visitedColorExpr as any,
      },
    };

    const clustersLayer: CircleLayerSpecification = {
      id: 'places-clusters',
      type: 'circle',
      source: 'places',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#93c5fd', 10, '#60a5fa', 50, '#3b82f6',
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          14, 10, 18, 50, 24,
        ],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
      },
    };

    const clusterCountLayer: SymbolLayerSpecification = {
      id: 'places-cluster-count',
      type: 'symbol',
      source: 'places',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['to-string', ['get', 'point_count']],
        'text-size': 12,
      },
      paint: { 'text-color': '#111827' },
    };

    const ensureLayer = (layer: CircleLayerSpecification | SymbolLayerSpecification) => {
      if (map.getLayer(layer.id)) map.removeLayer(layer.id);
      map.addLayer(layer);
    };

    if (cluster) {
      ensureLayer(clustersLayer);
      ensureLayer(clusterCountLayer);
    } else {
      if (map.getLayer('places-clusters')) map.removeLayer('places-clusters');
      if (map.getLayer('places-cluster-count')) map.removeLayer('places-cluster-count');
    }
    ensureLayer(unclusteredLayer);

    // ✅ Σωστός τύπος event (ΧΩΡΙΣ EventData)
    const clickHandler = (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      const name = (f?.properties as any)?.name as string | undefined;
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${name ?? 'Place'}</strong>`)
        .addTo(map);
    };
    map.on('click', 'places-unclustered', clickHandler);

    return () => {
      map.off('click', 'places-unclustered', clickHandler);
    };
  }, [loaded, cluster, JSON.stringify(places)]);

  return <div ref={ref} className="h-[480px] w-full rounded-2xl overflow-hidden border border-white/20" />;
}
