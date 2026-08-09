import { cache } from "react";
import { serverGet } from "../serverApi.js";

export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  const path = query ? `/products?${query}` : "/products";

  return serverGet(path, {
    revalidate: 120,
    tags: ["products"],
  });
}

/** Deduped across generateMetadata + page in the same request. */
export const fetchProductBySlug = cache(async (slug) => {
  return serverGet(`/products/${slug}`, {
    revalidate: 120,
    tags: [`product:${slug}`, "products"],
  });
});
