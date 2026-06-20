import { apiClient } from "../util/api.js";

export const getProducts = (params = {}) =>
  apiClient.get("/products", { params });

export const searchProducts = (params = {}) =>
  apiClient.get("/products/search", { params });

export const getProductBySlug = (slug) => apiClient.get(`/products/${slug}`);
