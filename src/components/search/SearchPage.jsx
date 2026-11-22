"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ArrowUp, Loader2 } from "lucide-react";
import ProductCard from "@/components/ui/productCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Pagination } from "@/components/ui/pagination.jsx";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll.js";
import { searchProducts } from "@/services/productService.js";
import { SORT_OPTIONS } from "@/lib/shopFilters.js";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const sort = searchParams.get("sort") || "-createdAt";

  const [viewMode, setViewMode] = useState("infinite"); // "infinite" | "pages"
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const prevSearchCriteriaRef = useRef("");

  const searchCriteriaKey = `${q}:${sort}`;

  const queryKey = useMemo(() => ["search", q, page, sort], [q, page, sort]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () => searchProducts({ q, page, limit: 12, sort }),
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  useEffect(() => {
    if (!data?.products) return;

    if (prevSearchCriteriaRef.current !== searchCriteriaKey || page <= 1) {
      prevSearchCriteriaRef.current = searchCriteriaKey;
      setAccumulatedProducts(data.products);
    } else {
      setAccumulatedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newItems = data.products.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newItems];
      });
    }
  }, [data?.products, searchCriteriaKey, page]);

  const updateParams = (next) => {
    const params = new URLSearchParams();
    params.set("q", q);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    if (next.sort && next.sort !== "-createdAt") params.set("sort", next.sort);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages && !isFetching) {
      updateParams({ sort, page: page + 1 });
    }
  };

  const sentinelRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: pagination.page < pagination.pages,
    isLoading: isFetching,
    enabled: viewMode === "infinite" && pagination.page < pagination.pages,
  });

  const displayProducts = viewMode === "infinite" ? accumulatedProducts : products;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/40 to-brand-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-brand-gray">
          <Link href="/" className="hover:text-brand-amber">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Search</span>
        </nav>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-amber">
              Search
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground md:text-4xl">
              {q ? `"${q}"` : "Find products"}
            </h1>
            <p className="mt-2 text-sm text-brand-gray">
              {!q
                ? "Enter a search term in the header to find products."
                : isLoading
                  ? "Searching..."
                  : `${pagination.total} result${pagination.total === 1 ? "" : "s"} found`}
              {isFetching && !isLoading ? " · Updating..." : ""}
            </p>
          </div>

          {q && (
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                className="h-10 rounded-lg border border-brand-amber/20 bg-brand-white px-3 text-sm outline-none focus:border-brand-amber"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle: Feed vs Pages */}
              <div className="hidden sm:inline-flex items-center p-0.5 rounded-lg border border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => setViewMode("infinite")}
                  title="Infinite scroll feed"
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all ${
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
                  title="Page navigation"
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                    viewMode === "pages"
                      ? "bg-black text-[#fdd835] shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Pages
                </button>
              </div>
            </div>
          )}
        </div>

        {!q ? (
          <div className="rounded-3xl border border-brand-amber/20 bg-brand-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">Start searching</h2>
            <p className="mt-2 text-brand-gray">
              Use the search bar in the header to look for dresses, tops, bags, and more.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 md:gap-x-3 md:gap-y-8 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2.5">
                <div className="aspect-[3/4] animate-pulse bg-brand-sand/60" />
                <div className="h-2.5 w-1/3 animate-pulse bg-brand-sand/50" />
                <div className="h-3 w-4/5 animate-pulse bg-brand-sand/40" />
                <div className="h-3 w-1/2 animate-pulse bg-brand-sand/50" />
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 md:gap-x-3 md:gap-y-8 xl:grid-cols-4">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* View Mode: Pages -> Traditional Pagination */}
            {viewMode === "pages" && pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                disabled={isFetching}
                onPageChange={(nextPage) => {
                  updateParams({ sort, page: nextPage });
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
              />
            )}

            {/* View Mode: Infinite Scroll -> Sentinel and Load More */}
            {viewMode === "infinite" && (
              <div className="mt-10">
                <div ref={sentinelRef} className="h-6" aria-hidden />

                {isFetching && (
                  <div className="flex flex-col items-center justify-center py-6 text-neutral-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                    <span className="text-xs font-semibold tracking-wide">
                      Searching more products...
                    </span>
                  </div>
                )}

                {!isFetching && pagination.page < pagination.pages && (
                  <div className="text-center py-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLoadMore}
                      className="px-6 border-neutral-300 font-bold hover:bg-black hover:text-[#fdd835] transition-colors"
                    >
                      Load More Results ({pagination.total - displayProducts.length} remaining)
                    </Button>
                  </div>
                )}

                {pagination.page >= pagination.pages && displayProducts.length > 0 && (
                  <div className="mt-8 border-t border-neutral-200 py-8 text-center space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-neutral-500">
                      All {pagination.total} matching products loaded
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
          </>
        ) : (
          <div className="rounded-3xl border border-brand-amber/20 bg-brand-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">No products found</h2>
            <p className="mt-2 text-brand-gray">
              Try a different keyword or browse our categories.
            </p>
            <Button type="button" className="mt-6" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

