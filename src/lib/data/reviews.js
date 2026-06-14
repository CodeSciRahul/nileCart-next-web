import { serverGet } from "../serverApi.js";

export async function fetchProductReviews(productId) {
  if (!productId) {
    return { reviews: [] };
  }

  return serverGet(`/reviews/product/${productId}`, { revalidate: 120 });
}
