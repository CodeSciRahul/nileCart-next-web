import { apiClient } from "../util/api.js";

export const getAddresses = () => apiClient.get("/addresses");

export const createAddress = (address) =>
  apiClient.post("/addresses", address);
