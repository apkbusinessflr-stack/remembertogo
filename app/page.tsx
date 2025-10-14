export default function Home(){
  return (<main className="space-y-6">
    <section className="card"><h1>Track your travels — share your <span className="badge">global map</span></h1>
      <p className="mt-2 opacity-80">Mark beaches, hikes, waterfalls & viewpoints.</p>
      <div className="mt-4 flex gap-3"><a className="btn" href="/lists/portugal-beaches">Explore demo list</a><a className="btn" href="/map">Open My Map</a></div>
    </section>
  </main>);
}
