"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ImagePlus } from "lucide-react";

export default function SpecialOffersSection({ section = null }) {
  if (section && section.isActive === false) return null;

  const title = section?.title || "SPECIAL OFFER (Set in Dashboard)";

  const rawItems = Array.isArray(section?.items) ? section.items : [];

  const items =
    rawItems.length > 0
      ? rawItems.map((it, idx) => ({
          id: it._id || `offer-${idx}`,
          image:
            (typeof it.image === "string" ? it.image.trim() : it.image?.url?.trim()) ||
            null,
          caption: it.caption || it.title || `Special Card ${idx + 1} (Set in Dashboard)`,
          kicker: it.kicker || "SPECIAL",
          price: it.price || "₹ —",
          theme: idx % 2 === 1 ? "photo-center" : "light-top",
          link: it.link || "/shop/all",
        }))
      : [1, 2, 3, 4].map((i) => ({
          id: `offer-ph-${i}`,
          image: null,
          caption: `Special Card ${i} (Set in Dashboard)`,
          kicker: "OFFER",
          price: "Set in Dashboard",
          theme: i % 2 === 0 ? "photo-center" : "light-top",
          link: "/shop/all",
        }));

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-[26px] font-black uppercase tracking-tight text-black text-center mb-5 md:mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {items.map((tile) => (
            <Link
              key={tile.id}
              href={tile.link || "/shop/all"}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full aspect-[896/1200] overflow-hidden bg-neutral-100 transition-transform duration-300 group-hover:scale-[1.015]">
                {tile.image ? (
                  <OptimizedImage
                    src={tile.image}
                    alt={tile.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover object-center select-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 p-4 text-center select-none">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-2">
                      <ImagePlus className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                      {tile.kicker}
                    </span>
                    <span className="font-sans font-black text-xl sm:text-2xl text-neutral-900 mt-1 leading-tight">
                      {tile.price}
                    </span>
                    <span className="mt-3 text-[9px] text-neutral-400 font-medium border-t border-neutral-200 pt-1.5">
                      Upload Card Image in Dashboard
                    </span>
                  </div>
                )}

                {/* Overlaid Typography when Image is present */}
                {tile.image &&
                  (tile.theme === "photo-center" ? (
                    <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center text-center px-2 select-none">
                      <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-white drop-shadow">
                        {tile.kicker}
                      </span>
                      <span className="mt-1 font-sans font-black text-3xl sm:text-4xl lg:text-[44px] text-white tracking-tight leading-none drop-shadow-md tabular-nums">
                        {tile.price}
                      </span>
                      <span className="mt-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white border-b border-white pb-0.5 drop-shadow">
                        SHOP NOW &gt;
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-x-0 top-0 h-[72%] flex flex-col items-center justify-center text-center px-2 select-none">
                      <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-neutral-800">
                        {tile.kicker}
                      </span>
                      <span className="mt-1 font-sans font-black text-3xl sm:text-4xl lg:text-[44px] tracking-tight leading-none tabular-nums text-black">
                        {tile.price}
                      </span>
                      <span className="mt-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-b pb-0.5 text-black border-black">
                        SHOP NOW &gt;
                      </span>
                    </div>
                  ))}
              </div>
              <h3 className="mt-2.5 text-[13px] md:text-[14px] font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                {tile.caption}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
