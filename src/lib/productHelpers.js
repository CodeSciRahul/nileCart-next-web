export function getProductImageUrl(product) {
  const image = product?.images?.[0];

  if (!image) return null;
  if (typeof image === "string") return image;

  return image.url || null;
}
