"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ImagePlus } from "lucide-react";

export default function BestSellersBanner({ section = null }) {
  if (section && section.isActive === false) return null;

  const headline = section?.title || "Hot right now. Best Sellers. (Set in Dashboard)";
  const price = section?.subtitle || "FROM ₹390 (Set in Dashboard)";
  const ctaText = section?.ctaText || "SHOP NOW";
  const href = section?.ctaLink || "/shop/all";
  const imageSrc =
    (typeof section?.image === "string" ? section.image.trim() : section?.image?.url?.trim()) ||
    null;

  return (
    <section className="w-full py-2 md:py-3 bg-white">
      <div className="w-full">
        <Link
          href={href}
          className="relative block w-full aspect-[1376/768] overflow-hidden group cursor-pointer bg-neutral-100"
        >
          {imageSrc ? (
            <OptimizedImage
              src={imageSrc}
              alt={headline}
              fill
              sizes="100vw"
              className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.008]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-start sm:justify-center px-6 sm:px-12 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 select-none">
              <div className="flex flex-col items-start sm:items-center text-left sm:text-center text-neutral-500 max-w-sm">
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mb-2">
                  <ImagePlus className="w-6 h-6 text-neutral-400 stroke-[1.5]" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Best Sellers Banner Image Not Set
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Upload banner image in Dashboard &rarr; Home Sections
                </p>
              </div>
            </div>
          )}

          {/* Right-Half Editorial Headline Lockup */}
          <div className="absolute inset-y-0 right-0 w-[55%] sm:w-[50%] flex flex-col items-center justify-center text-center px-3 sm:px-8 pointer-events-none">
            <p className="font-serif text-xs sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-neutral-900 drop-shadow-sm">
              {headline}
            </p>
            <p className="mt-1 sm:mt-2 font-serif font-black text-2xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none tabular-nums text-black drop-shadow-sm">
              {price}
            </p>
            <span className="mt-2.5 sm:mt-5 inline-flex items-center justify-center px-4 sm:px-8 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-xs font-black uppercase tracking-[0.14em] shadow-md bg-[#fdd835] text-black group-hover:bg-yellow-400 transition-colors">
              {ctaText}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
