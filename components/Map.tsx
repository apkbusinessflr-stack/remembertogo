'use client';
import maplibregl, { GeoJSONSource, Map as MLMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

type Place = { id: number; name: string; lat: number; lng: number; visited?: boolean };
type Props = { places: Place[]; center?: [number, number]; zoom?: number; cluster?: boolean };

export default function Map({ places, center=[-9.1,38.7], zoom=5, cluster=true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center, zoom
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    mapRef.current = map;

    const onLoad = () => {
      map.addSource('places', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        ...(cluster ? { cluster: true, clusterMaxZoom: 12, clusterRadius: 40 } : {})
      });
      if (cluster) {
        map.addLayer({ id:'clusters', type:'circle', source:'places', filter:['has','point_count'],
          paint:{'circle-radius':['step',['get','point_count'],14,10,18,30,24], 'circle-color':'#60a5fa'} });
        map.addLayer({ id:'cluster-count', type:'symbol', source:'places', filter:['has','point_count'],
          layout:{'text-field':['get','point_count_abbreviated'],'text-size':12} });
      }
      map.addLayer({ id:'places', type:'circle', source:'places', filter: cluster?['!', ['has','point_count']]:undefined,
        paint:{'circle-radius':6,'circle-stroke-width':1,'circle-stroke-color':'#ffffff','circle-color':['case',['==',['get','visited'],true],'#34d399','#60a5fa']} });
    };
    map.on('load', onLoad);

    return () => { map.off('load', onLoad); map.remove(); mapRef.current = null; };
  }, [cluster, center[0], center[1], zoom]);

  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    const src = map.getSource('places') as GeoJSONSource | undefined;
    if (!src) return;
    const fc = { type:'FeatureCollection', features: places.map(p => ({ type:'Feature', geometry:{ type:'Point', coordinates:[p.lng,p.lat] }, properties:{ id:p.id, name:p.name, visited:!!p.visited } }))};
    src.setData(fc as any);
  }, [places]);

  return <div ref={ref} className="w-full h-[420px] rounded-2xl overflow-hidden border border-white/10" />;
}
