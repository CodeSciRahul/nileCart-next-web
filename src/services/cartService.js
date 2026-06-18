import { apiClient } from "../util/api.js";

export const getCart = () => apiClient.get("/cart");

export const addCartItem = (productId, variantSku) =>
  apiClient.post("/cart/items", { productId, variantSku });

export const updateCartItem = (itemId, quantity) =>
  apiClient.put(`/cart/items/${itemId}`, { quantity });
