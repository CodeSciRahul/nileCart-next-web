import { apiClient } from "../util/api.js";

export const getCategoryTree = () =>
  apiClient.get("/categories", { params: { tree: "true" } });

export const getCategoryNavigation = () =>
  apiClient.get("/categories", { params: { navigation: "true", navOnly: "true" } });
