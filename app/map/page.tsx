// app/map/page.tsx
import Map from '@/components/Map';

type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  visited?: boolean;
};

const demo: Place[] = [
  { id: '1', name: 'Athens Center',  lat: 37.9838, lng: 23.7275, visited: true },
  { id: '2', name: 'Thessaloniki',   lat: 40.6401, lng: 22.9444, visited: false },
  { id: '3', name: 'Patras',         lat: 38.2466, lng: 21.7346, visited: false },
  { id: '4', name: 'Heraklion',      lat: 35.3387, lng: 25.1442, visited: true },
];

export default function MapPage() {
  return (
    <main className="p-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Global Map (demo)</h2>
        <Map places={demo} cluster />
      </div>
    </main>
  );
}
