import "./globals.css";
export const metadata = {
  title: "Mappamou — Global Travel Map",
  description: "Track places you've visited worldwide. Share your map. Light social. Ads-ready.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};
import ConsentBanner from "@/components/ConsentBanner";
export default function RootLayout({ children }:{ children:React.ReactNode }){
  return (<html lang="en"><body><div className="container py-6">
    <header className="flex items-center justify-between mb-6"><a className="text-xl font-bold" href="/">Mappamou</a>
      <nav className="flex items-center gap-3 text-sm"><a href="/lists/portugal-beaches">Lists</a><a href="/map">My Map</a><a href="/feed">Feed</a><a className="badge" href="/u/mitsos">@mitsos</a></nav>
    </header>{children}<footer className="mt-10 text-xs opacity-70">© {new Date().getFullYear()} Mappamou • Map data © OSM</footer>
  </div><ConsentBanner/></body></html>);
}
