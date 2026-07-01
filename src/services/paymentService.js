import { apiClient } from "../util/api.js";

export const getPaymentConfig = () => apiClient.get("/payments/config");

export const initializeCheckout = ({ addressId }) =>
  apiClient.post("/payments/checkout", { addressId });

export const verifyPayment = ({ txRef, transactionId, status }) =>
  apiClient.get("/payments/verify", {
    params: {
      tx_ref: txRef,
      ...(transactionId && { transaction_id: transactionId }),
      ...(status && { status }),
    },
  });

export const retryCheckout = (orderId) =>
  apiClient.post(`/payments/retry/${orderId}`);
