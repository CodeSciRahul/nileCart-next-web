import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";

const DEFAULT_TILES = [
  {
    name: "Accessories & Jewellery",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Autumn Tops & Knits",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pick Anything",
    slug: "all",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jackets & Outerwear",
    slug: "outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
  },
];

export default function CategoriesSection({ categories = [] }) {
  const items = Array.isArray(categories) && categories.length >= 4
    ? categories.slice(0, 4)
    : DEFAULT_TILES;

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {items.map((cat, idx) => {
            const imageSrc =
              (cat.image && typeof cat.image === "string"
                ? cat.image
                : getCategoryImageSrc(cat.image)) || DEFAULT_TILES[idx % DEFAULT_TILES.length].image;

            const href = cat.slug === "all" ? "/shop/all" : `/shop/${cat.slug || cat.key || "all"}`;
            const title = cat.name || cat.title || cat.label || "Collection";

            return (
              <Link
                key={cat._id || cat.slug || idx}
                href={href}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xs bg-[#f4a6b8]/20 shadow-xs transition-transform duration-300 group-hover:scale-[1.015]">
                  <OptimizedImage
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                <h3 className="mt-3 text-sm md:text-base font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                  {title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
