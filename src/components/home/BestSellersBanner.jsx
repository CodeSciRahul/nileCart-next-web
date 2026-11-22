"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const DEFAULT_IMAGE = "/images/sections/nc_bestsellers_banner_1794739158566.jpg";

export default function BestSellersBanner({ section = null }) {
  if (section && section.isActive === false) return null;

  const headline = section?.title || "Hot right now. Best Sellers.";
  const price = section?.subtitle || "FROM ₹390";
  const ctaText = section?.ctaText || "SHOP NOW";
  const href = section?.ctaLink || "/shop/all";
  const imageSrc =
    (typeof section?.image === "string" ? section.image : section?.image?.url) ||
    DEFAULT_IMAGE;

  return (
    <section className="w-full py-2 md:py-3 bg-white">
      <div className="w-full">
        <Link
          href={href}
          className="relative block w-full aspect-[1376/768] overflow-hidden group cursor-pointer bg-neutral-100"
        >
          <OptimizedImage
            src={imageSrc}
            alt={headline}
            fill
            sizes="100vw"
            className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.008]"
          />

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

