"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { createAddress } from "../services/addressService.js";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
      showSuccessToast("Address saved successfully");
      router.refresh();
    },
    meta: {
      errorMessage: "Could not save address.",
    },
  });
};
