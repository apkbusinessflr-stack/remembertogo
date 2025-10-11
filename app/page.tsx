import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-6">
      <section className="card">
        <h1 className="text-3xl font-semibold">
          Explore & unlock the world on <span className="badge">MapQuest</span>
        </h1>
        <p className="mt-2 opacity-80">Mark beaches, hikes, waterfalls & viewpoints. Countries unlock based on community interest.</p>
        <div className="mt-4 flex gap-3">
          <Link className="btn" href="/map">Open Map</Link>
          <Link className="btn" href="/admin">Admin</Link>
          <Link className="btn" href="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}
