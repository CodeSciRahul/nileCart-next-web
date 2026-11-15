"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/productCard";
import Reveal from "@/components/motion/Reveal";
import { RefreshCw, ChevronRight } from "lucide-react";

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

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (activeGender === "all") return products;

    return products.filter((p) => {
      const g = (p.gender || "").toLowerCase();
      if (activeGender === "unisex") return g === "unisex" || p.tags?.includes("unisex");
      if (activeGender === "men") return g === "men" || g === "unisex";
      if (activeGender === "women") return g === "women" || g === "unisex";
      return true;
    });
  }, [products, activeGender]);

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
                  onClick={() => setActiveGender(g.id)}
                  className={`px-3.5 py-1 rounded-full transition-all ${
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
            <span className="bg-neutral-200 px-2 py-0.5 rounded text-black uppercase">
              {activeGender}
            </span>
            <button
              type="button"
              onClick={() => setActiveGender("all")}
              className="underline text-black font-bold ml-2 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Show All</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid (Matching Reference Screenshot 5) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product, index) => (
            <Reveal
              key={product?._id || product?.slug || index}
              delay={Math.min(index * 30, 150)}
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
