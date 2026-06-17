"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "../lib/toast.js";
import {
  applyCouponToCart,
  removeCartCoupon,
  validateCoupon,
} from "../services/couponService.js";

export const useValidateCoupon = () =>
  useMutation({
    mutationFn: ({ code, orderAmount }) => validateCoupon(code, orderAmount),
    meta: {
      errorMessage: "Could not validate coupon.",
    },
  });

export const useApplyCoupon = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ code }) => applyCouponToCart(code),
    onSuccess: () => {
      showSuccessToast("Coupon applied");
      router.refresh();
    },
    meta: {
      errorMessage: "Could not apply coupon.",
    },
  });
};

export const useRemoveCoupon = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: removeCartCoupon,
    onSuccess: () => {
      showSuccessToast("Coupon removed");
      router.refresh();
    },
    meta: {
      errorMessage: "Could not remove coupon.",
    },
  });
};
