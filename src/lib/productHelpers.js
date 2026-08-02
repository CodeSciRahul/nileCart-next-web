export function getProductImageUrl(product) {
  const image = product?.images?.[0];

  if (!image) return null;
  if (typeof image === "string") return image;

  return image.url || null;
}

export function getProductImageUrls(product) {
  const images = product?.images || [];
  return images
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);
}
