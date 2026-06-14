import { apiClient } from "../util/api.js";

export const getCategoryTree = () =>
  apiClient.get("/categories", { params: { tree: "true" } });
