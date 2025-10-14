import Map from "@/components/Map"; import { places } from "@/lib/db";
export default function MyMap(){ return (<main className="space-y-6"><h1>My Map</h1><div className="card"><Map places={places.map(p=>({id:p.id,name:p.name,lat:p.lat,lng:p.lng,visited:Math.random()>0.5}))} /></div></main>); }
