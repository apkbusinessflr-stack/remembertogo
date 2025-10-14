// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy • remembertogo" };

export default function Privacy() {
  return (
    <main className="space-y-4">
      <h1>Privacy Policy</h1>
      <p className="opacity-80 text-sm">Last updated: 2025-10-14</p>

      <section className="space-y-2">
        <h3>What we collect</h3>
        <p className="opacity-80 text-sm">
          We collect minimal analytics, server logs, and user-generated content (tips/photos). We do
          not sell personal data.
        </p>
      </section>

      <section className="space-y-2">
        <h3>Ads & Cookies</h3>
        <p className="opacity-80 text-sm">
          We use Google AdSense for advertising. You can choose non-personalized ads (NPA) via the
          consent banner. See our <a className="underline" href="/cookies">Cookie & Ads Policy</a>.
        </p>
      </section>

      <section className="space-y-2">
        <h3>Your rights</h3>
        <p className="opacity-80 text-sm">
          You can request access or deletion of data via the{" "}
          <a className="underline" href="/contact">Contact</a> page. We respond within 30 days.
        </p>
      </section>

      <section className="space-y-2">
        <h3>Data retention</h3>
        <p className="opacity-80 text-sm">
          Tips/photos and logs are retained as long as needed to operate remembertogo or until a
          deletion request is processed.
        </p>
      </section>
    </main>
  );
}
