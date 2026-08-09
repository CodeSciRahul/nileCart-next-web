import { cache } from "react";
import { serverGet } from "@/lib/serverApi.js";

export const fetchSellerBySlug = cache(async (slug) =>
  serverGet(`/sellers/${slug}`, {
    revalidate: 300,
    tags: [`seller:${slug}`, "sellers"],
  })
);

export async function fetchSellerProducts(sellerId, params = {}) {
  const searchParams = new URLSearchParams({
    seller: String(sellerId),
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });
  return serverGet(`/products?${searchParams.toString()}`, {
    revalidate: 120,
    tags: [`seller-products:${sellerId}`, "products"],
  });
}
