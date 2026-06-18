"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys.js";
import { getMyOrders } from "../services/orderService.js";

export const useMyOrders = (params = {}) =>
  useQuery({
    queryKey: queryKeys.orders(params),
    queryFn: () => getMyOrders(params),
  });
