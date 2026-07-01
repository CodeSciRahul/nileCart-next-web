"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys.js";
import {
  getPaymentConfig,
  initializeCheckout,
  retryCheckout,
  verifyPayment,
} from "../services/paymentService.js";

export const usePaymentConfig = () =>
  useQuery({
    queryKey: queryKeys.payment.config,
    queryFn: getPaymentConfig,
    staleTime: 5 * 60 * 1000,
  });

export const useInitializeCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeCheckout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    meta: {
      errorMessage: "Could not start payment. Please try again.",
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
    meta: {
      errorMessage: "Payment verification failed. Contact support if you were charged.",
    },
  });
};

export const useRetryCheckout = () =>
  useMutation({
    mutationFn: retryCheckout,
    onSuccess: (data) => {
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    meta: {
      errorMessage: "Could not retry payment. Please try again.",
    },
  });
