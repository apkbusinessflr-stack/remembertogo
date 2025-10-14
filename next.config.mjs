// next.config.mjs
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=()" },
];

// Content Security Policy (prod-friendly; adjust if you add more vendors)
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.ggpht.com https://*.googleusercontent.com https://demotiles.maplibre.org;
  connect-src 'self' https://demotiles.maplibre.org;
  frame-src https://*.googlesyndication.com https://*.doubleclick.net;
`.replace(/\s{2,}/g, " ").trim();

export default {
  poweredByHeader: false,
  images: {
    // Allow remote images (map tiles, potential user content/CDNs)
    remotePatterns: [
      { protocol: "https", hostname: "demotiles.maplibre.org" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.ggpht.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          // Apply CSP (you can make this conditional on NODE_ENV if needed)
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};
