import { serverGet } from "@/lib/serverApi.js";

export async function fetchSellerBySlug(slug) {
  return serverGet(`/sellers/${slug}`);
}

export async function fetchSellerProducts(sellerId, params = {}) {
  const searchParams = new URLSearchParams({
    seller: String(sellerId),
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });
  return serverGet(`/products?${searchParams.toString()}`);
}
