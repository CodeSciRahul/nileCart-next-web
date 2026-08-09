import { getApiRewriteTarget } from "./src/lib/apiConfig.js";

/** Extra image hosts from env (comma-separated hostnames). */
function extraImageHosts() {
  const raw = process.env.NEXT_PUBLIC_IMAGE_HOSTS || "";
  return raw
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean)
    .map((hostname) => ({ protocol: "https", hostname }));
}

/**
 * Windows + DNS64/NAT64 (common on hotspots) resolves public S3 hosts to
 * `64:ff9b::…` addresses. Next.js 16 treats those as private and returns 400.
 * Safe to enable in development; opt-in for production via env if needed.
 */
const allowLocalIp =
  process.env.NODE_ENV === "development" ||
  process.env.IMAGES_ALLOW_LOCAL_IP === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 80, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowLocalIP: allowLocalIp,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img105.savana.com" },
      // Multi-level S3 hosts: bucket.s3.region.amazonaws.com (`*` = one label only)
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      ...extraImageHosts(),
    ],
  },
  async rewrites() {
    const apiTarget = getApiRewriteTarget();

    if (!apiTarget) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/product/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=120, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
