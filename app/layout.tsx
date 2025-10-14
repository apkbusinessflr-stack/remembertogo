import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata = {
  title: { default: "remembertogo — Global Travel Map", template: "%s • remembertogo" },
  description: "Track places you've visited worldwide. Share your map.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { type: "website", siteName: "remembertogo", url: "/" },
  twitter: { card: "summary_large_image" }
} as const;


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // "ca-pub-..."

  return (
    <html lang="en">
      <body>
        {/* Αν ο χρήστης διάλεξε NPA, δήλωσε το ΠΡΙΝ φορτώσει το AdSense */}
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

        {/* Φόρτωσε το AdSense ΜΟΝΟ αν έχεις client id */}
        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5077568341465757`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}

        <div className="container py-6">
          {/* ...το υπόλοιπο layout σου (header, children, footer) */}
          {children}
        </div>

        <ConsentBanner />
      </body>
    </html>
  );
}
