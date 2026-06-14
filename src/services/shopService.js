import { apiClient } from "../util/api.js";

export const getCategoryShop = (slug, params = {}) =>
  apiClient.get(`/categories/${slug}/shop`, { params });
