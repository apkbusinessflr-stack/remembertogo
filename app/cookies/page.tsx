// app/cookies/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie & Ads Policy • remembertogo" };

export default function Cookies() {
  return (
    <main className="space-y-4">
      <h1>Cookie & Ads Policy</h1>

      <section className="space-y-2">
        <h3>Types</h3>
        <p className="opacity-80 text-sm">
          We use the following categories of cookies and similar technologies:
        </p>
        <ul className="list-disc list-inside opacity-90 text-sm">
          <li><strong>Essential</strong> — security, fraud prevention, basic site functionality.</li>
          <li><strong>Analytics</strong> — aggregated usage insights to improve remembertogo.</li>
          <li>
            <strong>Advertising</strong> — Google AdSense. You can opt into{" "}
            <em>Non-Personalized Ads (NPA)</em>.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3>Manage Preferences</h3>
        <p className="opacity-80 text-sm">
          Use the consent banner to choose personalized ads or NPA. You can re-prompt by clearing
          site data (cookies/localStorage) in your browser settings.
        </p>
        <p className="opacity-80 text-sm">
          Browser-level ad personalization controls are also available in your Google Ads settings.
        </p>
      </section>

      <section className="space-y-2">
        <h3>Advertising Disclosure</h3>
        <p className="opacity-80 text-sm">
          We participate in Google AdSense. See our{" "}
          <a className="underline" href="/ads.txt">ads.txt</a> file for publisher details.
        </p>
      </section>
    </main>
  );
}
