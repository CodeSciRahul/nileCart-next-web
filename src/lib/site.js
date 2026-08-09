const trimTrailingSlash = (value) =>
  typeof value === "string" ? value.trim().replace(/\/$/, "") : "";

/**
 * Canonical site origin for metadata, sitemap, and OG URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://nilescart.com).
 */
export function getSiteUrl() {
  const fromEnv =
    trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL) ||
    trimTrailingSlash(process.env.SITE_URL);

  if (fromEnv) return fromEnv;

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export const SITE = {
  name: "Nilescart",
  shortName: "Nilescart",
  tagline: "Fashion Store",
  description:
    "Shop fashion at Nilescart — dresses, tops, accessories and more. Anniversary sale with free shipping above ₹999.",
  locale: "en_IN",
  twitterHandle: "@nilescart",
};

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
