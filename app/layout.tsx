// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata: Metadata = {
  title: { default: "remembertogo — Global Travel Map", template: "%s • remembertogo" },
  description: "Track places you've visited worldwide. Share your map.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { type: "website", siteName: "remembertogo", url: "/" },
  twitter: { card: "summary_large_image" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // e.g. "ca-pub-5077568341465757"

  return (
    <html lang="en">
      <body>
        {/* Respect NPA before AdSense loads */}
        <Script id="ads-npa-flag" strategy="beforeInteractive">
          {`
            try {
              var s = (typeof window !== 'undefined') && window.localStorage && localStorage.getItem('consent_status');
              if (s === 'npa') {
                (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
              }
            } catch(e) {}
          `}
        </Script>

        {/* Load AdSense only if client id is configured */}
        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}

        {/* Site-wide JSON-LD */}
        <Script id="site-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "remembertogo",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
          })}
        </Script>

        {/* Skip link for a11y */}
        <a href="#main" className="visually-hidden focus:not-sr-only">Skip to content</a>

        <div className="container py-6">
          <header className="flex items-center justify-between mb-6">
            <Link className="text-xl font-bold" href="/">remembertogo</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/lists/portugal-beaches">Lists</Link>
              <Link href="/map">My Map</Link>
              <Link href="/feed">Feed</Link>
              <Link className="badge" href="/u/mitsos">@mitsos</Link>
            </nav>
          </header>

          <main id="main">{children}</main>

          <footer className="mt-10 text-xs opacity-70">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                © {new Date().getFullYear()} remembertogo • Map data © OpenStreetMap contributors
              </div>
              <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 not-prose">
                <Link href="/countries" className="no-underline hover:underline">Countries</Link>
                <Link href="/privacy" className="no-underline hover:underline">Privacy</Link>
                <Link href="/terms" className="no-underline hover:underline">Terms</Link>
                <Link href="/cookies" className="no-underline hover:underline">Cookies</Link>
                <Link href="/licensing" className="no-underline hover:underline">Licensing</Link>
                <Link href="/contact" className="no-underline hover:underline">Contact</Link>
                <Link href="/report" className="no-underline hover:underline">Report</Link>
              </nav>
            </div>
          </footer>
        </div>

        <ConsentBanner />
      </body>
    </html>
  );
}
