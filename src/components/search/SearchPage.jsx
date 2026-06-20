"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ProductCard from "@/components/ui/productCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { searchProducts } from "@/services/productService.js";
import { SORT_OPTIONS } from "@/lib/shopFilters.js";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const sort = searchParams.get("sort") || "-createdAt";

  const queryKey = useMemo(() => ["search", q, page, sort], [q, page, sort]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () => searchProducts({ q, page, limit: 12, sort }),
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const updateParams = (next) => {
    const params = new URLSearchParams();
    params.set("q", q);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    if (next.sort && next.sort !== "-createdAt") params.set("sort", next.sort);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

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
                  onClick={() => updateParams({ sort, page: pagination.page - 1 })}
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
                  onClick={() => updateParams({ sort, page: pagination.page + 1 })}
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
