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

  return serverGet(path);
}

export async function fetchProductBySlug(slug) {
  return serverGet(`/products/${slug}`);
}
