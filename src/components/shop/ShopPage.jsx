"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SlidersHorizontal, X, ArrowUp, Loader2, Grid, Rows } from "lucide-react";
import ShopFilters from "@/components/shop/ShopFilters.jsx";
import ProductCard from "@/components/ui/productCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Pagination } from "@/components/ui/pagination.jsx";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll.js";
import { getCategoryShop } from "@/services/shopService.js";
import {
  buildShopQueryParams,
  buildShopUrl,
  parseShopFilters,
  SORT_OPTIONS,
} from "@/lib/shopFilters.js";

export default function ShopPage({ slug }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseShopFilters(searchParams), [searchParams]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });
  const priceKey = `${filters.minPrice ?? ""}:${filters.maxPrice ?? ""}`;
  const [prevPriceKey, setPrevPriceKey] = useState(priceKey);

  if (priceKey !== prevPriceKey) {
    setPrevPriceKey(priceKey);
    setPriceDraft({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["shop", slug, filters],
    queryFn: () => getCategoryShop(slug, buildShopQueryParams(filters)),
    placeholderData: keepPreviousData,
    retry: false,
    meta: {
      errorToast: false,
    },
  });

  const category = data?.category;
  const children = data?.children || [];
  const facets = data?.facets || {
    brands: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 0 },
  };
  const products = data?.products || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const [viewMode, setViewMode] = useState("infinite"); // "infinite" | "pages"
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const prevCriteriaRef = useRef("");

  const filterCriteriaKey = useMemo(() => {
    return `${slug}:${filters.sort}:${filters.minPrice}:${filters.maxPrice}:${(filters.brand || []).join(",")}:${(filters.size || []).join(",")}:${(filters.color || []).join(",")}:${filters.isOnSale}:${filters.isTrending}`;
  }, [slug, filters]);

  useEffect(() => {
    if (!data?.products) return;

    if (prevCriteriaRef.current !== filterCriteriaKey || (filters.page || 1) <= 1) {
      prevCriteriaRef.current = filterCriteriaKey;
      setAccumulatedProducts(data.products);
    } else {
      setAccumulatedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newItems = data.products.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newItems];
      });
    }
  }, [data?.products, filterCriteriaKey, filters.page]);

  const updateFilters = (nextFilters) => {
    router.push(buildShopUrl(slug, nextFilters), { scroll: false });
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages && !isFetching) {
      updateFilters({ ...filters, page: (filters.page || 1) + 1 });
    }
  };

  const sentinelRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: pagination.page < pagination.pages,
    isLoading: isFetching,
    enabled: viewMode === "infinite" && pagination.page < pagination.pages,
  });

  const displayProducts = viewMode === "infinite" ? accumulatedProducts : products;

  const applyPriceFilter = () => {
    updateFilters({
      ...filters,
      minPrice: priceDraft.minPrice,
      maxPrice: priceDraft.maxPrice,
      page: 1,
    });
    setMobileFiltersOpen(false);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(category?.parent
      ? [{ label: category.parent.name, href: `/shop/${category.parent.slug}` }]
      : []),
    { label: category?.name || slug, href: `/shop/${slug}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/40 to-brand-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-brand-gray">
          {breadcrumbs.map((item, index) => (
            <span key={item.href} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-brand-amber">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-amber">
              Shop
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground md:text-4xl">
              {category?.name || "Products"}
            </h1>
            <p className="mt-2 text-sm text-brand-gray">
              {isLoading ? "Loading products..." : `${pagination.total} products found`}
              {isFetching && !isLoading ? " · Updating..." : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>

            <select
              value={filters.sort}
              onChange={(e) => updateFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="h-10 rounded-lg border border-brand-amber/20 bg-brand-white px-3 text-sm outline-none focus:border-brand-amber"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle: Infinite Scroll vs Traditional Pages */}
            <div className="hidden sm:inline-flex items-center p-0.5 rounded-lg border border-neutral-200 bg-white">
              <button
                type="button"
                onClick={() => setViewMode("infinite")}
                title="Continuous feed with infinite scroll"
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
                title="Structured page-by-page navigation"
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
        </div>

        {children.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={`/shop/${slug}`}
              className="rounded-full border border-brand-amber bg-brand-amber px-4 py-2 text-sm font-semibold text-foreground"
            >
              All {category?.name}
            </Link>
            {children.map((child) => (
              <Link
                key={child._id}
                href={`/shop/${child.slug}`}
                className="rounded-full border border-brand-amber/20 bg-brand-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand-amber hover:text-brand-amber"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-28">
              <ShopFilters
                facets={facets}
                filters={filters}
                onChange={updateFilters}
                priceDraft={priceDraft}
                onPriceDraftChange={setPriceDraft}
                onApplyPrice={applyPriceFilter}
              />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {isLoading ? (
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
                      updateFilters({ ...filters, page: nextPage });
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                  />
                )}

                {/* View Mode: Infinite Scroll -> Sentinel, Spinner, and End-of-List */}
                {viewMode === "infinite" && (
                  <div className="mt-10">
                    {/* Sentinel for IntersectionObserver */}
                    <div ref={sentinelRef} className="h-6" aria-hidden />

                    {/* Loading indicator when fetching next batch */}
                    {isFetching && (
                      <div className="flex flex-col items-center justify-center py-6 text-neutral-500 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                        <span className="text-xs font-semibold tracking-wide">
                          Loading more products...
                        </span>
                      </div>
                    )}

                    {/* Manual Load More button fallback */}
                    {!isFetching && pagination.page < pagination.pages && (
                      <div className="text-center py-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleLoadMore}
                          className="px-6 border-neutral-300 font-bold hover:bg-black hover:text-[#fdd835] transition-colors"
                        >
                          Load More Products ({pagination.total - displayProducts.length} remaining)
                        </Button>
                      </div>
                    )}

                    {/* End of results banner */}
                    {pagination.page >= pagination.pages && displayProducts.length > 0 && (
                      <div className="mt-8 border-t border-neutral-200 py-8 text-center space-y-2">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-500">
                          You&apos;ve viewed all {pagination.total} products in this collection
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
                  Try adjusting your filters or browse another category.
                </p>
                <Button
                  type="button"
                  className="mt-6"
                  onClick={() =>
                    updateFilters({
                      ...filters,
                      brand: [],
                      size: [],
                      color: [],
                      minPrice: "",
                      maxPrice: "",
                      page: 1,
                    })
                  }
                >
                  Clear filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-brand-white shadow-xl">
            <div className="flex items-center justify-between border-b border-brand-amber/20 px-5 py-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-foreground"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ShopFilters
                facets={facets}
                filters={filters}
                onChange={(nextFilters) => {
                  updateFilters(nextFilters);
                }}
                priceDraft={priceDraft}
                onPriceDraftChange={setPriceDraft}
                onApplyPrice={applyPriceFilter}
              />
            </div>
            <div className="border-t border-brand-amber/20 p-4">
              <Button type="button" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                Show {pagination.total} products
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
