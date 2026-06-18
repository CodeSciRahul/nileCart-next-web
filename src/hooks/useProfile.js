"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { queryKeys } from "../lib/queryKeys.js";
import { showSuccessToast } from "../lib/toast.js";
import {
  fetchProfile,
  updateUserProfile,
  deleteAccount,
} from "../services/authService.js";

export const useProfile = () =>
  useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
    select: (data) => data?.user,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      if (data?.user) {
        setUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      showSuccessToast("Profile updated successfully");
    },
    meta: {
      errorMessage: "Could not update profile.",
    },
  });
};

export const useDeleteAccount = () => {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      showSuccessToast("Your account has been deleted");
      await logout();
      router.push("/auth");
    },
    meta: {
      errorMessage: "Could not delete account.",
    },
  });
};
