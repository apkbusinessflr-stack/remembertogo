import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata: Metadata = {
  title: "Mappamou — Global Travel Map",
  description:
    "Track places you've visited worldwide. Share your map. Light social. Ads-ready.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // π.χ. "ca-pub-1234567890123456"

  return (
    <html lang="en">
      <body>
        {/* Φόρτωσε το AdSense script ΜΟΝΟ αν έχεις client id */}
        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5077568341465757`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}

        <div className="container py-6">
          <header className="flex items-center justify-between mb-6">
            <a className="text-xl font-bold" href="/">
              Mappamou
            </a>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/lists/portugal-beaches">Lists</a>
              <a href="/map">My Map</a>
              <a href="/feed">Feed</a>
              <a className="badge" href="/u/mitsos">
                @mitsos
              </a>
            </nav>
          </header>

          {children}

          <footer className="mt-10 text-xs opacity-70">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                © {new Date().getFullYear()} Mappamou • Map data © OpenStreetMap contributors
              </div>
              <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 not-prose">
                <a href="/countries" className="no-underline hover:underline">
                  Countries
                </a>
                <a href="/privacy" className="no-underline hover:underline">
                  Privacy
                </a>
                <a href="/terms" className="no-underline hover:underline">
                  Terms
                </a>
                <a href="/cookies" className="no-underline hover:underline">
                  Cookies
                </a>
                <a href="/licensing" className="no-underline hover:underline">
                  Licensing
                </a>
                <a href="/contact" className="no-underline hover:underline">
                  Contact
                </a>
                <a href="/report" className="no-underline hover:underline">
                  Report
                </a>
              </nav>
            </div>
          </footer>
        </div>

        <ConsentBanner />
      </body>
    </html>
  );
}
