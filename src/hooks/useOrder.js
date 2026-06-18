"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { placeOrder } from "../services/orderService.js";

export const usePlaceOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      const order = data?.order;
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });

      showSuccessToast(
        order?.orderNumber
          ? `Order ${order.orderNumber} placed successfully!`
          : "Order placed successfully!"
      );

      if (order?._id) {
        const params = new URLSearchParams({
          orderId: order._id,
          ...(order.orderNumber && { orderNumber: order.orderNumber }),
        });
        router.push(`/checkout/success?${params.toString()}`);
        return;
      }

      router.push("/checkout/success");
    },
    meta: {
      errorMessage: "Could not place your order. Please try again.",
    },
  });
};
