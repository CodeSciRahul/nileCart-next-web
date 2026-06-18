import { apiClient } from "../util/api.js";

export const getWishlist = () => apiClient.get("/wishlist");

export const toggleWishlist = (productId) =>
  apiClient.post("/wishlist/toggle", { productId });
