"use client";

import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const DEFAULT_OFFERS = [
  {
    id: "offer-1",
    image: "/images/sections/nc_offer_accessories_1794739159471.jpg",
    caption: "Accessories & Jewellery",
    kicker: "STARTING AT",
    price: "₹90",
    theme: "light-top",
    link: "/shop/accessories",
  },
  {
    id: "offer-2",
    image: "/images/sections/nc_offer_knitwear_1794739159667.jpg",
    caption: "Autumn Tops & Knits",
    kicker: "FROM",
    price: "₹590",
    theme: "photo-center",
    link: "/shop/tops",
  },
  {
    id: "offer-3",
    image: "/images/sections/nc_offer_essentials_1794739160477.jpg",
    caption: "Pick Anything",
    kicker: "UNDER",
    price: "₹690",
    theme: "light-top",
    link: "/shop/all",
  },
  {
    id: "offer-4",
    image: "/images/sections/nc_offer_outerwear_1794739160684.jpg",
    caption: "Jackets & Outerwear",
    kicker: "FROM",
    price: "₹890",
    theme: "photo-center",
    link: "/shop/outerwear",
  },
];

export default function SpecialOffersSection({ section = null }) {
  if (section && section.isActive === false) return null;

  const title = section?.title || "SPECIAL OFFER";
  const items =
    Array.isArray(section?.items) && section.items.length > 0
      ? section.items.map((it, idx) => ({
          id: it._id || `offer-${idx}`,
          image:
            typeof it.image === "string"
              ? it.image
              : it.image?.url || DEFAULT_OFFERS[idx % DEFAULT_OFFERS.length].image,
          caption: it.caption || it.title || DEFAULT_OFFERS[idx % DEFAULT_OFFERS.length].caption,
          kicker: it.kicker || DEFAULT_OFFERS[idx % DEFAULT_OFFERS.length].kicker,
          price: it.price || DEFAULT_OFFERS[idx % DEFAULT_OFFERS.length].price,
          theme: idx % 2 === 1 ? "photo-center" : "light-top",
          link: it.link || DEFAULT_OFFERS[idx % DEFAULT_OFFERS.length].link,
        }))
      : DEFAULT_OFFERS;

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
                <OptimizedImage
                  src={tile.image}
                  alt={tile.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="w-full h-full object-cover object-center select-none"
                />

                {/* Contrast Gradient / Scrim + Crisp Price Point Typography */}
                {tile.theme === "photo-center" ? (
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
                )}
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

