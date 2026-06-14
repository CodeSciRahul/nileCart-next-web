"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import ShopFilters from "@/components/shop/ShopFilters.jsx";
import ProductCard from "@/components/ui/productCard.jsx";
import { Button } from "@/components/ui/button.jsx";
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

  useEffect(() => {
    setPriceDraft({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [filters.minPrice, filters.maxPrice]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["shop", slug, filters],
    queryFn: () => getCategoryShop(slug, buildShopQueryParams(filters)),
    placeholderData: keepPreviousData,
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

  const updateFilters = (nextFilters) => {
    router.push(buildShopUrl(slug, nextFilters), { scroll: false });
  };

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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] animate-pulse rounded-3xl bg-brand-cream"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pagination.page <= 1}
                      onClick={() =>
                        updateFilters({ ...filters, page: pagination.page - 1 })
                      }
                    >
                      Previous
                    </Button>
                    <span className="px-3 text-sm text-brand-gray">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() =>
                        updateFilters({ ...filters, page: pagination.page + 1 })
                      }
                    >
                      Next
                    </Button>
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
