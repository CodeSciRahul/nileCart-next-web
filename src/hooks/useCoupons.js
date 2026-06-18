"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys.js";
import { getActiveCoupons } from "../services/couponService.js";

export const useActiveCoupons = () =>
  useQuery({
    queryKey: queryKeys.coupons.active,
    queryFn: getActiveCoupons,
    select: (data) => data?.coupons || [],
  });
