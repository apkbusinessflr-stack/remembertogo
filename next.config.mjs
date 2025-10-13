/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverSourceMaps: true },
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }] },
  async headers() {
    return [{ source: "/(.*)", headers: [{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }] }];
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false }
};
export default nextConfig;
