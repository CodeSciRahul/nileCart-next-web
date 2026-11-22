"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for infinite scrolling with IntersectionObserver.
 *
 * @param {Object} options
 * @param {Function} options.onLoadMore - Callback to trigger next page fetch
 * @param {boolean} options.hasMore - Whether more records exist
 * @param {boolean} options.isLoading - Whether a request is currently in flight
 * @param {boolean} [options.enabled=true] - Whether infinite scrolling is active
 * @param {string} [options.rootMargin="300px"] - Margin around root to trigger early
 * @param {number} [options.threshold=0.05] - Intersection ratio
 * @returns {React.RefObject} sentinelRef to attach to the sentinel element
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  enabled = true,
  rootMargin = "300px",
  threshold = 0.05,
}) {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = isLoading;
    hasMoreRef.current = hasMore;
  }, [isLoading, hasMore]);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMoreRef.current && !loadingRef.current && enabled) {
        onLoadMore();
      }
    },
    [onLoadMore, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, enabled, rootMargin, threshold]);

  return sentinelRef;
}

export default useInfiniteScroll;
