import { apiClient } from "../util/api.js";

export const getProductReviews = (productId) =>
  apiClient.get(`/reviews/product/${productId}`);
