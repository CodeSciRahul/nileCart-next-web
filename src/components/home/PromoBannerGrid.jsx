import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const PROMO_TILES = [
  {
    title: "Under ₹999",
    eyebrow: "Budget Trendy",
    tag: "STREET EDIT",
    href: "/shop/women",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Vacation Edit",
    eyebrow: "Resort & Beach",
    tag: "NEW SEASON",
    href: "/collections",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Party & Club",
    eyebrow: "Glam & Chic",
    tag: "UP TO 60% OFF",
    href: "/shop/women",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PromoBannerGrid() {
  return (
    <section className="py-3 md:py-4">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {PROMO_TILES.map((tile, idx) => (
            <Link
              key={tile.title + idx}
              href={tile.href}
              className="group relative block overflow-hidden rounded-none bg-zinc-900 aspect-[16/9] sm:aspect-[4/5] md:aspect-[3/4]"
            >
              <OptimizedImage
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:opacity-90"
                aria-hidden
              />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                <span className="inline-block rounded-none bg-brand-amber px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black">
                  {tile.tag}
                </span>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-zinc-300">
                  {tile.eyebrow}
                </p>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white group-hover:text-brand-amber transition">
                  {tile.title}
                </h3>
                <span className="mt-2 inline-flex items-center text-xs font-bold uppercase tracking-wider text-white underline underline-offset-4 group-hover:text-brand-amber">
                  Shop Now &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
