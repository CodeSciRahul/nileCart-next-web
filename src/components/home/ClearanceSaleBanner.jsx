"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const DEFAULT_IMAGE = "/images/sections/nc_clearance_banner_1794739159508.jpg";

export default function ClearanceSaleBanner({ section = null }) {
  if (section && section.isActive === false) return null;

  const eyebrow = section?.subtitle || "YOUR FAVORITES, FOR A LIMITED TIME!";
  const title = section?.title || "LAST CHANCES 20–60% OFF";
  const ctaText = section?.ctaText || "SHOP NOW";
  const href = section?.ctaLink || "/shop/all";
  const imageSrc =
    (typeof section?.image === "string" ? section.image : section?.image?.url) ||
    DEFAULT_IMAGE;

  return (
    <section className="w-full py-3 md:py-4 bg-white">
      <div className="w-full">
        <Link
          href={href}
          className="relative block w-full aspect-[2.6/1] sm:aspect-[4.4/1] overflow-hidden group cursor-pointer bg-neutral-100"
        >
          <OptimizedImage
            src={imageSrc}
            alt={`${eyebrow} - ${title}`}
            fill
            sizes="100vw"
            className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.006]"
          />

          {/* Centered Editorial Sale Lockup */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <span className="text-[9px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-neutral-900 drop-shadow-sm">
              {eyebrow}
            </span>

            <div className="mt-1 sm:mt-2 flex items-center justify-center gap-2 sm:gap-4 text-neutral-950 drop-shadow-sm">
              {title.toLowerCase().includes("last") && (
                <div className="hidden sm:flex flex-col items-end text-[11px] md:text-sm font-serif font-bold leading-tight uppercase">
                  <span>LAST</span>
                  <span>CHANCES</span>
                </div>
              )}
              <span className="font-serif font-black text-2xl sm:text-5xl md:text-6xl tracking-tight leading-none tabular-nums">
                {title.toLowerCase().includes("last chances")
                  ? title.replace(/last chances/i, "").trim() || "20–60% OFF"
                  : title}
              </span>
            </div>

            <span className="mt-2 sm:mt-3.5 inline-flex items-center justify-center px-5 sm:px-7 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.14em] shadow-sm bg-black text-white group-hover:bg-neutral-800 transition-colors">
              {ctaText}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

