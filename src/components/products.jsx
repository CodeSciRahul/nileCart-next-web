"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/productCard";
import Reveal from "@/components/motion/Reveal";
import NilescartLoader from "@/components/ui/NilescartLoader";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { RefreshCw, ChevronRight, PackageOpen, ArrowDown } from "lucide-react";

const GENDERS = [
  { id: "all", label: "All Pieces" },
  { id: "unisex", label: "Unisex" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
];

const Products = ({
  products = [],
  title = "FOR YOU",
  eyebrow,
  ctaHref = "/shop/all",
  ctaLabel = "View All",
  showGenderFilter = true,
}) => {
  const [activeGender, setActiveGender] = useState("all");
  const [extraProducts, setExtraProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(products.length >= 12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingFilter, setIsSwitchingFilter] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const displayedProducts =
    activeGender === "all"
      ? extraProducts.length > 0
        ? [...products, ...extraProducts]
        : products
      : filteredProducts ?? [];

  // Handle switching gender categories
  const handleGenderChange = async (id) => {
    if (id === activeGender) return;
    setActiveGender(id);
    setPage(1);

    if (id === "all") {
      setFilteredProducts(null);
      setExtraProducts([]);
      setHasMore(products.length >= 12);
      return;
    }

    setIsSwitchingFilter(true);
    setHasMore(true);

    try {
      const url = `/api/products?gender=${encodeURIComponent(id)}&limit=12&page=1&sort=-createdAt`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data?.products) ? data.products : [];
        setFilteredProducts(items);
        const totalPages = data?.pagination?.pages || 1;
        setTotalCount(data?.pagination?.total ?? null);
        setHasMore(items.length >= 12 && 1 < totalPages);
      }
    } catch {
      // API error tolerance
    } finally {
      setIsSwitchingFilter(false);
    }
  };

  // Infinite Scroll loader
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isSwitchingFilter) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const url =
        activeGender === "all"
          ? `/api/products?limit=12&page=${nextPage}&sort=-createdAt`
          : `/api/products?gender=${encodeURIComponent(activeGender)}&limit=12&page=${nextPage}&sort=-createdAt`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const newProducts = Array.isArray(data?.products) ? data.products : [];

        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          if (activeGender === "all") {
            setExtraProducts((prev) => {
              const currentAll = [...products, ...prev];
              const existingIds = new Set(currentAll.map((p) => p._id || p.slug));
              const uniqueAdditions = newProducts.filter(
                (p) => !existingIds.has(p._id || p.slug)
              );
              return [...prev, ...uniqueAdditions];
            });
          } else {
            setFilteredProducts((prev) => {
              const existingIds = new Set((prev || []).map((p) => p._id || p.slug));
              const uniqueAdditions = newProducts.filter(
                (p) => !existingIds.has(p._id || p.slug)
              );
              return [...(prev || []), ...uniqueAdditions];
            });
          }

          setPage(nextPage);
          const totalPages = data?.pagination?.pages || 1;
          setTotalCount(data?.pagination?.total ?? null);
          if (nextPage >= totalPages || newProducts.length < 12) {
            setHasMore(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeGender, page, isLoadingMore, hasMore, isSwitchingFilter, products]);

  // Hook for intersection observer sentinel
  const sentinelRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: isLoadingMore || isSwitchingFilter,
    enabled: hasMore && !isSwitchingFilter,
    rootMargin: "450px",
  });

  return (
    <section id="for-you-section" className="w-full bg-white py-6 md:py-10">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        {/* Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {title}
            </h2>
            {eyebrow && (
              <span className="hidden sm:inline-block rounded-xs bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                {eyebrow}
              </span>
            )}
          </div>

          {showGenderFilter ? (
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-full text-xs font-bold tracking-wider uppercase self-start sm:self-auto">
              {GENDERS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleGenderChange(g.id)}
                  className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeGender === g.id
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          ) : (
            <Link
              href={ctaHref}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:opacity-70 transition"
            >
              <span>{ctaLabel}</span>
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {/* Active Filter Pill */}
        {activeGender !== "all" && (
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-neutral-600">
            <span>Filtering by:</span>
            <span className="bg-neutral-200 px-2 py-0.5 rounded text-black uppercase font-bold">
              {activeGender}
            </span>
            <button
              type="button"
              onClick={() => handleGenderChange("all")}
              className="underline text-black font-bold ml-2 flex items-center gap-1 cursor-pointer hover:opacity-70 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Show All</span>
            </button>
          </div>
        )}

        {/* Filter Switching Loader */}
        {isSwitchingFilter ? (
          <NilescartLoader text={`Finding ${activeGender} pieces...`} />
        ) : displayedProducts.length === 0 ? (
          <div className="py-12 sm:py-16 text-center border border-dashed border-neutral-200 rounded-xs bg-neutral-50/50 p-6">
            <PackageOpen className="mx-auto size-10 text-neutral-400 mb-2" />
            <p className="text-sm font-bold text-neutral-900">
              No {activeGender} pieces found
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Explore our full catalog or reset the filter
            </p>
            <button
              type="button"
              onClick={() => handleGenderChange("all")}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-full hover:bg-neutral-800 transition cursor-pointer"
            >
              Show All Pieces
            </button>
          </div>
        ) : (
          <>
            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
              {displayedProducts.map((product, index) => (
                <Reveal
                  key={product?._id || product?.slug || index}
                  delay={Math.min((index % 12) * 25, 150)}
                >
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="w-full h-8" aria-hidden />
            )}

            {/* Nilescart Animated Loader during Infinite Scroll */}
            {isLoadingMore && (
              <NilescartLoader text="Loading more contemporary pieces..." />
            )}

            {/* Manual Load More Button fallback if not currently loading */}
            {!isLoadingMore && hasMore && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-300 text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-[#fdd835] hover:border-black transition-all cursor-pointer shadow-xs"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>
                    Load More Pieces
                    {totalCount != null
                      ? ` (${totalCount - displayedProducts.length} remaining)`
                      : ""}
                  </span>
                </button>
              </div>
            )}

            {/* End of Catalog Notice */}
            {!hasMore && displayedProducts.length > 0 && (
              <div className="mt-12 text-center py-8 border-t border-neutral-100 select-none">
                <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-neutral-400">
                  ✦ You have viewed all {displayedProducts.length} pieces ✦
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Check back soon for new season arrivals
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
