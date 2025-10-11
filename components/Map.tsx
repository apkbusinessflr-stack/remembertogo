'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, {
  Map as MlMap,
  LngLatLike,
  CircleLayerSpecification,
  SymbolLayerSpecification,
  GeoJSONSourceSpecification,
  ExpressionSpecification,
} from 'maplibre-gl';
// Αν δεν κάνεις global import του CSS, ξεκλείδωσε τη γραμμή:
// import 'maplibre-gl/dist/maplibre-gl.css';

type Place = {
  id: string;
  name: string;
  lng: number;
  lat: number;
  visited?: boolean;
};

type Props = {
  places: Place[];
  center?: LngLatLike;       // default: Αθήνα
  zoom?: number;             // default: 12
  cluster?: boolean;         // default: false
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
      center: center ?? [23.7275, 37.9838], // Αθήνα
      zoom: zoom ?? 12,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      setLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Φτιάξε GeoJSON από τα places
  const sourceData: GeoJSONSourceSpecification = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: places.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: { id: p.id, name: p.name, visited: Boolean(p.visited) },
      })),
    },
    cluster,                 // ενεργοποίησε clustering αν ζητηθεί
    clusterRadius: 40,       // px (όταν cluster = true)
  };

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const map = mapRef.current;

    // ── Source ───────────────────────────────────────────────────────────────
    if (map.getSource('places')) {
      (map.getSource('places') as any).setData(sourceData.data);
    } else {
      map.addSource('places', sourceData);
    }

    // ── Layers ───────────────────────────────────────────────────────────────
    // Χρώμα: visited => πράσινο, αλλιώς κόκκινο
    const visitedColorExpr: ExpressionSpecification = [
      'case',
      ['==', ['get', 'visited'], true],
      '#4ade80', // emerald-400
      '#ef4444', // red-500
    ];

    // Unclustered points (πάντα χρειαζόμαστε αυτό το layer)
    const unclusteredLayer: CircleLayerSpecification = {
      id: 'places-unclustered',
      type: 'circle',
      source: 'places',
      filter: ['!', ['has', 'point_count']], // ΟΧΙ '|': σωστό NOT για μη-cluster σημεία
      paint: {
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
        'circle-color': visitedColorExpr as any,
      },
    };

    // Προαιρετικά clusters (αν cluster=true)
    const clustersLayer: CircleLayerSpecification = {
      id: 'places-clusters',
      type: 'circle',
      source: 'places',
      filter: ['has', 'point_count'], // ΜΟΝΟ clusters
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#93c5fd', // <= 10
          10,
          '#60a5fa', // <= 50
          50,
          '#3b82f6', // > 50
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          14, 10,
          18, 50,
          24,
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
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#111827',
      },
    };

    // Προσθήκη/ενημέρωση layers με idempotent τρόπο
    function ensureLayer(layer: CircleLayerSpecification | SymbolLayerSpecification) {
      if (map.getLayer(layer.id)) map.removeLayer(layer.id);
      map.addLayer(layer);
    }

    if (cluster) {
      ensureLayer(clustersLayer);
      ensureLayer(clusterCountLayer);
    } else {
      if (map.getLayer('places-clusters')) map.removeLayer('places-clusters');
      if (map.getLayer('places-cluster-count')) map.removeLayer('places-cluster-count');
    }
    ensureLayer(unclusteredLayer);

    // Optional: click popup σε unclustered
    map.on('click', 'places-unclustered', (e) => {
      const f = e.features?.[0];
      const name = f?.properties?.name as string | undefined;
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${name ?? 'Place'}</strong>`)
        .addTo(map);
    });

    // καθάρισμα handlers όταν αλλάζει το dependency set
    return () => {
      if (!mapRef.current) return;
      const m = mapRef.current;
      m.off('click', 'places-unclustered', () => {});
    };
  }, [loaded, JSON.stringify(places), cluster]); // stringify για shallow compare σε places

  return <div ref={ref} className="h-[480px] w-full rounded-2xl overflow-hidden border border-white/20" />;
}
