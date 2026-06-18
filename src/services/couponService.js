import { apiClient } from "../util/api.js";

export const validateCoupon = (code, orderAmount) =>
  apiClient.post("/coupons/validate", { code, orderAmount });

export const applyCouponToCart = (code) =>
  apiClient.post("/cart/coupon", { code });

export const removeCartCoupon = () => apiClient.delete("/cart/coupon");

export const getActiveCoupons = () => apiClient.get("/coupons/active");
