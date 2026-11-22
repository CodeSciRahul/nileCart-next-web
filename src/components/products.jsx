"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/productCard";
import Reveal from "@/components/motion/Reveal";
import { RefreshCw, ChevronRight, Loader2, PackageOpen } from "lucide-react";

const GENDERS = [
  { id: "all", label: "All Pieces" },
  { id: "unisex", label: "Unisex" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
];

/** Comprehensive gender matcher checking product.gender, tags, category, and title */
function matchesGender(p, targetGender) {
  if (!p || targetGender === "all") return true;

  const g = (p.gender || "").toLowerCase();
  const tags = Array.isArray(p.tags)
    ? p.tags.map((t) => String(t).toLowerCase())
    : [];
  const catName =
    (typeof p.category === "object" ? p.category?.name : "")?.toLowerCase() ||
    "";
  const catSlug =
    (typeof p.category === "object" ? p.category?.slug : "")?.toLowerCase() ||
    "";
  const title = (p.title || "").toLowerCase();

  const isUnisex =
    g === "unisex" ||
    tags.includes("unisex") ||
    catName.includes("unisex") ||
    catSlug.includes("unisex") ||
    title.includes("unisex");

  if (targetGender === "unisex") {
    return isUnisex;
  }

  if (targetGender === "men") {
    const isMenExplicit =
      g === "men" ||
      tags.some((t) => ["men", "mens", "male"].includes(t)) ||
      /\bmen('s)?\b/i.test(catName) ||
      /\bmen('s)?\b/i.test(catSlug) ||
      /\bmen('s)?\b/i.test(title);

    return isMenExplicit || isUnisex;
  }

  if (targetGender === "women") {
    const isWomenExplicit =
      g === "women" ||
      tags.some((t) =>
        ["women", "womens", "female", "ladies"].includes(t)
      ) ||
      /\bwomen('s)?\b/i.test(catName) ||
      /\bwomen('s)?\b/i.test(catSlug) ||
      /\bwomen('s)?\b/i.test(title);

    return isWomenExplicit || isUnisex;
  }

  return true;
}

const Products = ({
  products = [],
  title = "FOR YOU",
  eyebrow,
  ctaHref = "/shop/all",
  ctaLabel = "View All",
  showGenderFilter = true,
}) => {
  const [activeGender, setActiveGender] = useState("all");
  const [genderCache, setGenderCache] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGenderChange = (id) => {
    setActiveGender(id);
    if (id !== "all" && !genderCache[id]) {
      setLoading(true);
      fetch(`/api/products?gender=${encodeURIComponent(id)}&limit=12`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.products) && data.products.length > 0) {
            setGenderCache((prev) => ({
              ...prev,
              [id]: data.products,
            }));
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const displayedProducts = useMemo(() => {
    if (activeGender === "all") return products;

    // 1. If backend returned dedicated products for this gender, prefer them
    if (genderCache[activeGender]?.length) {
      return genderCache[activeGender];
    }

    // 2. Otherwise filter initial products with comprehensive matcher
    return products.filter((p) => matchesGender(p, activeGender));
  }, [products, activeGender, genderCache]);

  if (!products.length) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 text-center text-xs text-neutral-400">
          No products available right now.
        </div>
      </section>
    );
  }

  return (
    <section id="for-you-section" className="w-full bg-white py-6 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
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
            {loading && (
              <span className="flex items-center gap-1 text-neutral-400 font-normal">
                <Loader2 size={12} className="animate-spin" />
                <span>Updating...</span>
              </span>
            )}
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

        {/* Product Cards Grid or Empty State */}
        {displayedProducts.length === 0 && !loading ? (
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            {displayedProducts.map((product, index) => (
              <Reveal
                key={product?._id || product?.slug || index}
                delay={Math.min(index * 30, 150)}
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
