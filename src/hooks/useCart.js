"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { addCartItem, getCart, updateCartItem } from "../services/cartService.js";

export const useCart = () => {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: isAuthenticated && !loading,
    select: (data) => data?.itemCount ?? 0,
  });
};

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
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      router.refresh();
    },
    meta: {
      errorMessage: "Could not update bag.",
    },
  });
};
