import { apiClient } from "../util/api.js";

export const getCart = () => apiClient.get("/cart");

export const addCartItem = (productId, variantSku) =>
  apiClient.post("/cart/items", { productId, variantSku });
