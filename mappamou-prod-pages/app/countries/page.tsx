import { countries } from "@/lib/catalog";
export const metadata = { title: "Countries" };
export default function Countries() {
  return (
    <main className="space-y-4">
      <h1>Countries</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {countries.map(c => (
          <a key={c.code} className="card no-underline" href={`/countries/${c.code.toLowerCase()}`}>
            <div className="text-lg font-semibold">{c.name}</div>
            <div className="opacity-70 text-sm">{c.code}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
