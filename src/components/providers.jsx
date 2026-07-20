"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGateProvider } from "@/context/AuthGateContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGateProvider>
          {children}
          <Toaster />
        </AuthGateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
