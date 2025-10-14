// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-8">
      {/* Hero */}
      <section className="card">
        <h1>
          Track your travels — share your <span className="badge">global map</span>
        </h1>
        <p className="mt-2 opacity-80">
          Mark beaches, hikes, waterfalls & viewpoints. Build and share your travel map.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn" href="/lists/portugal-beaches">
            Explore Portugal beaches
          </Link>
          <Link className="btn" href="/map">
            Open your map
          </Link>
          <Link className="btn" href="/feed">
            Community feed
          </Link>
        </div>
      </section>

      {/* Quick links */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3>Quick Lists</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/lists/portugal-beaches">Portugal • Beaches</Link>
            </li>
            <li>
              <Link href="/countries/gr">Greece hub</Link>
            </li>
            <li>
              <Link href="/categories/beaches?country=PT">Beaches in PT</Link>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>How it works</h3>
          <ol className="mt-2 text-sm list-decimal list-inside opacity-90 space-y-1">
            <li>Open a list and tick places you've visited</li>
            <li>Generate a progress share-card</li>
            <li>Optionally add a short tip or photo</li>
          </ol>
        </div>
      </section>

      {/* CTA strip */}
      <section className="card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm opacity-90">
          Ready to build your map? Start with Portugal beaches or jump straight to your map.
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn" href="/lists/portugal-beaches">
            Explore Portugal beaches
          </Link>
          <Link className="btn" href="/map">
            Open your map
          </Link>
        </div>
      </section>
    </main>
  );
}
