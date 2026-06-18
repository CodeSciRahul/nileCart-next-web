"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { addCartItem, updateCartItem } from "../services/cartService.js";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ productId, variantSku }) =>
      addCartItem(productId, variantSku),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showSuccessToast("Item added to bag");
      router.refresh();
    },
    meta: {
      errorMessage: "Could not add item to bag.",
    },
  });
};

export const useUpdateCartItem = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess: () => {
      router.refresh();
    },
    meta: {
      errorMessage: "Could not update bag.",
    },
  });
};
