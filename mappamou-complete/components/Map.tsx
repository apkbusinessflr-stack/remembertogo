'use client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

type Place={id:number;name:string;lat:number;lng:number;visited?:boolean;tags?:string[]};

export default function Map({ places, center=[-9.1,38.7], zoom=6 }:{ places:Place[]; center?:[number,number]; zoom?:number; }){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const map=new maplibregl.Map({ container:ref.current, style:'https://demotiles.maplibre.org/style.json', center, zoom });
    map.addControl(new maplibregl.NavigationControl({visualizePitch:true}));
    map.on('load',()=>{
      map.addSource('places',{ type:'geojson', data:{ type:'FeatureCollection', features:places.map(p=>({
        type:'Feature', geometry:{ type:'Point', coordinates:[p.lng,p.lat] }, properties:{ id:p.id, name:p.name, visited:!!p.visited }
      }))}});
      map.addLayer({ id:'places', type:'circle', source:'places', paint:{
        'circle-radius':5, 'circle-color':['case',['==',['get','visited'],true],'#34d399','#60a5fa'], 'circle-stroke-color':'#0b1020','circle-stroke-width':1
      }});
    });
    return ()=>map.remove();
  },[places,center.toString(),zoom]);
  return <div ref={ref} className="w-full h-[420px] rounded-2xl overflow-hidden border border-white/10" />;
}
