"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ImagePlus } from "lucide-react";

export default function TrendingNowSection({ section = null, products = [] }) {
  if (section && section.isActive === false) return null;

  const title = section?.title || "TRENDING NOW (Set in Dashboard)";

  const rawItems = Array.isArray(section?.items) ? section.items : [];

  const items =
    rawItems.length > 0
      ? rawItems.map((it, idx) => ({
          id: it._id || `trend-${idx}`,
          title: it.title || it.caption || `Trend ${idx + 1} (Set in Dashboard)`,
          image:
            (typeof it.image === "string" ? it.image.trim() : it.image?.url?.trim()) ||
            null,
          link: it.link || "/shop/all",
        }))
      : [1, 2, 3, 4].map((i) => ({
          id: `trend-ph-${i}`,
          title: `Trend ${i} (Set in Dashboard)`,
          image: null,
          link: "/shop/all",
        }));

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-black text-center mb-5 md:mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {items.map((card) => (
            <Link
              key={card.id}
              href={card.link || "/shop/all"}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full aspect-[896/1200] overflow-hidden bg-neutral-100 transition-transform duration-300 group-hover:scale-[1.015]">
                {card.image ? (
                  <OptimizedImage
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover object-center select-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 p-4 text-center select-none">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-2">
                      <ImagePlus className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
                    </div>
                    <span className="text-[12px] font-bold text-neutral-800">
                      {card.title}
                    </span>
                    <span className="mt-2 text-[9px] text-neutral-400 font-medium border-t border-neutral-200 pt-1.5">
                      Upload Image in Dashboard
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-2.5 text-[13px] md:text-[14px] font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                {card.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
