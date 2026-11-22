"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const DEFAULT_TRENDS = [
  {
    id: "trend-1",
    title: "Dark Romance",
    image: "/images/sections/nc_trend_romance_1794739161666.jpg",
    link: "/shop/all",
  },
  {
    id: "trend-2",
    title: "Faux Fur",
    image: "/images/sections/nc_trend_fauxfur_1794739161586.jpg",
    link: "/shop/outerwear",
  },
  {
    id: "trend-3",
    title: "Formal Co-ords",
    image: "/images/sections/nc_trend_coords_1794739162575.jpg",
    link: "/shop/suits",
  },
  {
    id: "trend-4",
    title: "Animal Print Everything",
    image: "/images/sections/nc_trend_animal_1794739188133.jpg",
    link: "/shop/all",
  },
];

export default function TrendingNowSection({ section = null, products = [] }) {
  if (section && section.isActive === false) return null;

  const title = section?.title || "TRENDING NOW";
  const items =
    Array.isArray(section?.items) && section.items.length > 0
      ? section.items.map((it, idx) => ({
          id: it._id || `trend-${idx}`,
          title: it.title || it.caption || DEFAULT_TRENDS[idx % DEFAULT_TRENDS.length].title,
          image:
            typeof it.image === "string"
              ? it.image
              : it.image?.url || DEFAULT_TRENDS[idx % DEFAULT_TRENDS.length].image,
          link: it.link || DEFAULT_TRENDS[idx % DEFAULT_TRENDS.length].link,
        }))
      : DEFAULT_TRENDS;

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
                <OptimizedImage
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="w-full h-full object-cover object-center select-none"
                />
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

