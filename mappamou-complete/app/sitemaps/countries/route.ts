import { NextResponse } from "next/server"; export async function GET(){ const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"; const urls=[ base+"/", base+"/lists/portugal-beaches", base+"/place/praia-da-urca" ]; const xml=`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(u=>`<url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('')}
  </urlset>`; return new NextResponse(xml,{ status:200, headers:{"Content-Type":"application/xml"} }); }
