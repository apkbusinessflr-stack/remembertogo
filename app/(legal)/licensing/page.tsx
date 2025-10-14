// app/(legal)/licensing/page.tsx
export const metadata = { title: "Licensing & Attributions" };

export default function Licensing() {
  return (
    <main className="space-y-4">
      <h1>Licensing & Attributions</h1>

      <section className="space-y-2">
        <h3>Maps & Data</h3>
        <p>
          © OpenStreetMap contributors — data available under the{" "}
          <a className="underline" href="https://www.openstreetmap.org/copyright">
            ODbL / Open Data Commons Open Database License
          </a>
          .
        </p>
        <p>
          Base map rendered via{" "}
          <a className="underline" href="https://maplibre.org/">
            MapLibre GL JS
          </a>{" "}
          (BSD-3-Clause).
        </p>
      </section>

      <section className="space-y-2">
        <h3>Images</h3>
        <p>
          User-submitted images are owned by their respective authors and are used according to
          the{" "}
          <a className="underline" href="/terms">
            Terms of Service
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h3>Logos & Trademarks</h3>
        <p>
          remembertogo™ and related marks are trademarks of their respective owner. All other
          trademarks are property of their respective owners.
        </p>
      </section>

      <section className="space-y-2">
        <h3>Third-Party Services</h3>
        <ul className="list-disc list-inside opacity-90 text-sm">
          <li>
            Google AdSense — subject to{" "}
            <a className="underline" href="https://www.google.com/adsense/new/policies/overview">
              Google Program Policies
            </a>
            .
          </li>
          <li>
            Map tiles / imagery may be provided by demo sources for development purposes only.
          </li>
        </ul>
      </section>
    </main>
  );
}
