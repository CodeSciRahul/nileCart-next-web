"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import { createAddress, getAddresses } from "../services/addressService.js";

export const useAddresses = () =>
  useQuery({
    queryKey: queryKeys.addresses,
    queryFn: getAddresses,
    select: (data) => data?.addresses || [],
  });

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
