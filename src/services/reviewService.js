import { apiClient } from "../util/api.js";

export const getProductReviews = (productId, params = {}) =>
  apiClient.get(`/reviews/product/${productId}`, { params });

export const getReviewEligibility = (productId) =>
  apiClient.get(`/reviews/product/${productId}/eligibility`);

export const createReview = (payload) => apiClient.post("/reviews", payload);

export const updateReview = (reviewId, payload) =>
  apiClient.put(`/reviews/${reviewId}`, payload);

export const deleteReview = (reviewId) =>
  apiClient.delete(`/reviews/${reviewId}`);
