/** PDP helpers — variant grouping, gallery, stock, pricing, delivery. */

export function formatRupee(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function normalizeImageUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

export function isVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes("/video/");
}

export function getDiscountPercent(price, mrp) {
  const p = Number(price);
  const m = Number(mrp);
  if (!Number.isFinite(p) || !Number.isFinite(m) || m <= p || m <= 0) return 0;
  return Math.round(((m - p) / m) * 100);
}

export function getSavings(price, mrp) {
  const p = Number(price);
  const m = Number(mrp);
  if (!Number.isFinite(p) || !Number.isFinite(m) || m <= p) return 0;
  return m - p;
}

/** Stock UI states for size chips. */
export function getStockState(stock) {
  const n = Number(stock) || 0;
  if (n <= 0) return { key: "oos", label: "Out of Stock", urgency: null };
  if (n <= 5)
    return {
      key: "low",
      label: "Low Stock",
      urgency: `Only ${n} left`,
    };
  return { key: "available", label: "In Stock", urgency: null };
}

/**
 * Unique colors from variants (by colorHex || color name).
 * Each entry keeps representative variants for that color.
 */
export function getColorOptions(variants = []) {
  const map = new Map();

  variants.forEach((variant) => {
    const key =
      (variant.colorHex || "").toLowerCase() ||
      (variant.color || "").toLowerCase() ||
      "default";

    if (!map.has(key)) {
      map.set(key, {
        key,
        color: variant.color || "Default",
        colorHex: variant.colorHex || "#d4d4d4",
        variants: [],
      });
    }
    map.get(key).variants.push(variant);
  });

  return Array.from(map.values());
}

export function getSizesForColor(colorOption) {
  return colorOption?.variants || [];
}

/** Prefer variant images, then product images, then fallback. */
export function getGalleryMedia(product, selectedVariant) {
  const fromVariant = (selectedVariant?.images || [])
    .map(normalizeImageUrl)
    .filter(Boolean);

  const fromProduct = (product?.images || [])
    .map(normalizeImageUrl)
    .filter(Boolean);

  const videos = (product?.videos || [])
    .map(normalizeImageUrl)
    .filter(Boolean);

  const urls = [...fromVariant, ...fromProduct, ...videos];
  const unique = [...new Set(urls)];

  if (unique.length === 0) {
    return [{ src: null, type: "image" }];
  }

  return unique.map((src) => ({
    src,
    type: isVideoUrl(src) ? "video" : "image",
  }));
}

/** Rough ETA based on a simple pincode heuristic (client-side demo). */
export function getEstimatedDelivery(pincode = "") {
  const base = new Date();
  const pin = String(pincode).replace(/\D/g, "");
  const metroHints = ["11", "12", "40", "56", "60", "70", "50", "38"];
  const isMetro =
    pin.length >= 2 && metroHints.some((h) => pin.startsWith(h));
  const daysMin = isMetro ? 2 : 4;
  const daysMax = isMetro ? 4 : 7;

  const format = (d) =>
    d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const min = new Date(base);
  min.setDate(min.getDate() + daysMin);
  const max = new Date(base);
  max.setDate(max.getDate() + daysMax);

  return {
    label: `${format(min)} – ${format(max)}`,
    daysMin,
    daysMax,
  };
}

export function pickInitialVariant(variants = []) {
  if (!variants.length) return null;
  const inStock = variants.find((v) => Number(v.stock) > 0);
  return inStock || variants[0];
}
