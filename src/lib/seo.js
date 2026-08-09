import { SITE, absoluteUrl, getSiteUrl } from "@/lib/site";
import { getProductImageUrl } from "@/lib/productHelpers";
import { formatMoney } from "@/lib/currency";

export function truncateMeta(text, max = 160) {
  if (!text || typeof text !== "string") return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

export function buildCanonical(pathname) {
  return absoluteUrl(pathname);
}

/** Shared metadata defaults for public marketing pages. */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  images,
  type = "website",
  noIndex = false,
  keywords,
  absoluteTitle = false,
}) {
  const desc = truncateMeta(description || SITE.description);
  const url = absoluteUrl(path);
  const ogImages = images?.length
    ? images.map((img) =>
        typeof img === "string"
          ? { url: img.startsWith("http") ? img : absoluteUrl(img) }
          : {
              ...img,
              url: img.url?.startsWith("http")
                ? img.url
                : absoluteUrl(img.url || "/"),
            }
      )
    : undefined;

  const resolvedTitle = absoluteTitle
    ? { absolute: title }
    : title;

  return {
    title: resolvedTitle,
    description: desc,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: typeof title === "string" ? title : SITE.name,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title: typeof title === "string" ? title : SITE.name,
      description: desc,
      ...(ogImages ? { images: ogImages.map((i) => i.url) } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: getSiteUrl(),
    logo: absoluteUrl("/icon"),
    sameAs: [],
    description: SITE.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getSiteUrl()}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function productJsonLd(product) {
  if (!product) return null;

  const imageUrl = getProductImageUrl(product);
  const images = (product.images || [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
  const price =
    product.price ?? product.variants?.[0]?.price ?? product.variants?.[0]?.mrp;
  const currency = product.currency || "INR";
  const availability =
    Number(product.totalStock ?? product.variants?.[0]?.stock ?? 1) > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const brandName =
    (typeof product.brand === "object" ? product.brand?.name : product.brand) ||
    product.seller?.storeName ||
    SITE.name;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: truncateMeta(product.description || product.title, 5000),
    sku: product.variants?.[0]?.sku || product._id,
    url: absoluteUrl(`/product/${product.slug}`),
    image: images.length ? images : imageUrl ? [imageUrl] : undefined,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: currency,
      price: Number(price) || 0,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: product.seller?.storeName || SITE.name,
      },
    },
  };

  const ratingAvg = Number(product.rating?.average ?? product.rating);
  const ratingCount = Number(product.rating?.count ?? product.ratingCount);

  if (ratingAvg > 0 && ratingCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAvg,
      reviewCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

export function formatProductPriceLabel(product) {
  const price =
    product?.price ?? product?.variants?.[0]?.price ?? product?.variants?.[0]?.mrp;
  const currency = product?.currency || "INR";
  if (price == null) return null;
  return formatMoney(price, currency);
}
