import Map from '@/components/Map';

const demo = [
  { id: 1, name: 'Praia da Ursa', lat: 38.799, lng: -9.485, visited: true },
  { id: 2, name: 'Praia da Adraga', lat: 38.799, lng: -9.483 },
  { id: 3, name: 'Cascais', lat: 38.697, lng: -9.422 }
];

export default function MapPage() {
  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Global Map (demo)</h2>
        <Map places={demo} />
      </div>
    </main>
  );
}
