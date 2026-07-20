import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { showErrorToast } from "./toast.js";

const shouldShowErrorToast = (meta, error) => {
  if (meta?.errorToast === false) return false;
  if (typeof meta?.errorToast === "function") return meta.errorToast(error);
  return true;
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!shouldShowErrorToast(query.meta, error)) return;
      showErrorToast(error, query.meta?.errorMessage);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!shouldShowErrorToast(mutation.meta, error)) return;
      showErrorToast(error, mutation.meta?.errorMessage);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
