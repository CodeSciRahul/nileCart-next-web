"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const DEFAULT_IMAGE = "/images/sections/nc_arrivals_banner_1794739158540.jpg";

export default function NewArrivalsBanner({ section = null }) {
  if (section && section.isActive === false) return null;

  const eyebrow = section?.subtitle || "NEW ARRIVALS";
  const title = section?.title || "FROM ₹390";
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
            alt={`${eyebrow} - ${title}`}
            fill
            sizes="100vw"
            className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.006]"
          />

          {/* Right-Side Content Lockup */}
          <div className="absolute inset-y-0 right-0 w-[55%] sm:w-[50%] flex flex-col items-start justify-center px-4 sm:px-10 lg:px-16 pointer-events-none">
            <span className="text-[10px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-neutral-800 drop-shadow-sm">
              {eyebrow}
            </span>
            <span className="mt-0.5 sm:mt-1 font-serif text-lg sm:text-3xl md:text-4xl lg:text-5xl leading-none text-neutral-900 drop-shadow-sm">
              {title.includes("₹") && title.toLowerCase().includes("from")
                ? "FROM"
                : ""}
            </span>
            <span className="mt-0.5 font-serif font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none tabular-nums text-black drop-shadow-sm">
              {title.includes("₹") && title.toLowerCase().includes("from")
                ? title.replace(/from/i, "").trim()
                : title}
            </span>
            <span className="mt-2.5 sm:mt-5 inline-flex items-center justify-center px-4 sm:px-8 py-1.5 sm:py-2.5 rounded-full text-[9px] sm:text-xs font-black uppercase tracking-[0.14em] shadow-md bg-[#fdd835] text-black group-hover:bg-yellow-400 transition-colors">
              {ctaText}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

