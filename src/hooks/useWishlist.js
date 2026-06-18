"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { getWishlist, toggleWishlist } from "../services/wishlistService.js";

export const useWishlist = () => {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: getWishlist,
    enabled: isAuthenticated && !loading,
    select: (data) => ({
      products: data?.products || [],
      count: data?.count ?? 0,
      productIds: new Set(
        (data?.products || []).map((product) => String(product._id))
      ),
    }),
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: toggleWishlist,
    onMutate: async () => {
      if (!isAuthenticated) return;
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
      showSuccessToast(
        data?.inWishlist ? "Added to wishlist" : "Removed from wishlist"
      );
    },
    onError: (error) => {
      if (error?.status === 401) {
        router.push("/auth");
      }
    },
    meta: {
      errorMessage: "Could not update wishlist.",
    },
  });
};
