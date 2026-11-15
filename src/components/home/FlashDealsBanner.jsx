import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const DEFAULT_TRENDING = [
  {
    id: "trend-1",
    title: "Holiday Sparkles",
    slug: "sparkle-knit-top",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "trend-2",
    title: "Elegance Defined",
    slug: "minimal-slip-dress",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "trend-3",
    title: "Formal Co-ords",
    slug: "tailored-co-ord",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "trend-4",
    title: "Back to Burgundy",
    slug: "burgundy-tailored-coat",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
  },
];

export default function FlashDealsBanner({ items = [], title = "TRENDING NOW" }) {
  const displayItems =
    Array.isArray(items) && items.length >= 4 ? items.slice(0, 4) : DEFAULT_TRENDING;

  return (
    <section className="w-full bg-white py-8 md:py-12 border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
          {displayItems.map((item, idx) => {
            const imageSrc =
              (item.image && typeof item.image === "string"
                ? item.image
                : item.image?.url || item.images?.[0]?.url || item.images?.[0]) ||
              DEFAULT_TRENDING[idx % DEFAULT_TRENDING.length].image;

            const cardTitle = item.title || item.name || "Trending Look";
            const href = item.slug ? `/product/${item.slug}` : "/shop/all";

            return (
              <Link
                key={item._id || item.id || idx}
                href={href}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xs bg-neutral-100 shadow-xs transition-transform duration-300 group-hover:scale-[1.015]">
                  <OptimizedImage
                    src={imageSrc}
                    alt={cardTitle}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-sm md:text-base font-bold text-neutral-900 group-hover:text-black transition-colors text-center">
                  {cardTitle}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
