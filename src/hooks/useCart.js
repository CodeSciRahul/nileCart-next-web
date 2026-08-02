"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { AUTH_ACTIONS } from "../lib/authActions.js";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/cartService.js";

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
  const { requireAuth } = useAuthGate();

  return useMutation({
    mutationFn: ({ productId, variantSku, quantity = 1 }) =>
      addCartItem(productId, variantSku, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showSuccessToast("Item added to bag");
      router.refresh();
    },
    onError: (error, variables) => {
      if (error?.status === 401) {
        requireAuth({
          action: AUTH_ACTIONS.ADD_TO_CART,
          payload: variables,
          onSuccess: () =>
            addCartItem(
              variables.productId,
              variables.variantSku,
              variables.quantity || 1
            ).then(() => {
              queryClient.invalidateQueries({ queryKey: queryKeys.cart });
              showSuccessToast("Item added to bag");
              router.refresh();
            }),
        });
      }
    },
    meta: {
      errorMessage: "Could not add item to bag.",
      errorToast: (error) => error?.status !== 401,
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

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (itemId) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      router.refresh();
    },
    meta: {
      errorMessage: "Could not remove item.",
    },
  });
};
