"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowUp } from "lucide-react";
import ProductCard from "@/components/ui/productCard";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination.jsx";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll.js";
import { getProducts } from "@/services/productService.js";

export default function StoreProductsSection({
  initialProducts = [],
  initialPagination = { page: 1, pages: 1, total: 0 },
  sellerId,
  storeName = "this store",
}) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState("infinite"); // "infinite" | "pages"

  const handleLoadMore = async () => {
    if (!sellerId || isLoadingMore || pagination.page >= pagination.pages) return;
    setIsLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const res = await getProducts({ seller: sellerId, page: nextPage, limit: 24 });
      const newItems = res?.products || [];
      const nextPagination = res?.pagination || {
        page: nextPage,
        pages: pagination.pages,
        total: pagination.total,
      };

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => String(p._id)));
        const filtered = newItems.filter((p) => !existingIds.has(String(p._id)));
        return [...prev, ...filtered];
      });
      setPagination(nextPagination);
    } catch {
      // silently handle
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (!sellerId || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await getProducts({ seller: sellerId, page: newPage, limit: 24 });
      setProducts(res?.products || []);
      setPagination(
        res?.pagination || { page: newPage, pages: pagination.pages, total: pagination.total }
      );
      window.scrollTo({ top: 200, behavior: "smooth" });
    } catch {
      // silently handle
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sentinelRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: pagination.page < pagination.pages,
    isLoading: isLoadingMore,
    enabled: viewMode === "infinite" && pagination.page < pagination.pages,
  });

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-brand-amber/30 bg-brand-cream/20 px-6 py-16 text-center">
        <p className="font-bold">No products listed yet</p>
        <p className="mt-2 text-sm text-brand-gray">
          Check back soon for new arrivals from {storeName}.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex bg-brand-amber px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header controls: items count & view mode toggle */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-brand-gray">
          Showing <span className="font-bold text-foreground">{products.length}</span> of{" "}
          <span className="font-bold text-foreground">{pagination.total}</span> products
        </p>

        {pagination.pages > 1 && (
          <div className="hidden sm:inline-flex items-center p-0.5 rounded-lg border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setViewMode("infinite")}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === "infinite"
                  ? "bg-black text-[#fdd835] shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              ∞ Feed
            </button>
            <button
              type="button"
              onClick={() => setViewMode("pages")}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === "pages"
                  ? "bg-black text-[#fdd835] shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Pages
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>

      {/* View Mode: Pages -> Traditional pagination */}
      {viewMode === "pages" && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          disabled={isLoadingMore}
          onPageChange={handlePageChange}
          className="mt-10"
        />
      )}

      {/* View Mode: Infinite Scroll -> Sentinel and Load More */}
      {viewMode === "infinite" && (
        <div className="mt-10">
          <div ref={sentinelRef} className="h-6" aria-hidden />

          {isLoadingMore && (
            <div className="flex flex-col items-center justify-center py-6 text-neutral-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
              <span className="text-xs font-semibold tracking-wide">
                Loading more store products...
              </span>
            </div>
          )}

          {!isLoadingMore && pagination.page < pagination.pages && (
            <div className="text-center py-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleLoadMore}
                className="px-6 border-neutral-300 font-bold hover:bg-black hover:text-[#fdd835] transition-colors"
              >
                Load More Products ({pagination.total - products.length} remaining)
              </Button>
            </div>
          )}

          {pagination.page >= pagination.pages && products.length > 0 && (
            <div className="mt-8 border-t border-neutral-200 py-8 text-center space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-neutral-500">
                You&apos;ve viewed all {pagination.total} products from this store
              </p>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-[#fdd835] transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" /> Back to top
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
