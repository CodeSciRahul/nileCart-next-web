import { apiClient } from "../util/api.js";

export const placeOrder = ({ addressId, paymentMethod = "cod" }) =>
  apiClient.post("/orders", { addressId, paymentMethod });

export const getMyOrders = (params = {}) =>
  apiClient.get("/orders", { params });
