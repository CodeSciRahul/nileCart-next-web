import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";

const FALLBACK_CATEGORIES = [
  {
    name: "New In",
    slug: "new-in",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    badge: "HOT",
  },
  {
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Tops & Tees",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Co-Ords",
    slug: "co-ords",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Denim",
    slug: "denim",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bags & Accs",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sale 80% Off",
    slug: "sale",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
    badge: "SALE",
  },
];

const CategoryCircle = ({ category }) => {
  const href = category.slug ? `/shop/${category.slug}` : "/collections";
  const imageSrc =
    (category.image && typeof category.image === "string"
      ? category.image
      : getCategoryImageSrc(category.image)) || FALLBACK_CATEGORIES[0].image;

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1.5 shrink-0 transition-transform hover:scale-105 active:scale-95"
    >
      <div className="relative">
        <div className="relative h-18 w-18 sm:h-20 sm:w-20 md:h-22 md:w-22 overflow-hidden rounded-full p-[2.5px] bg-gradient-to-tr from-brand-amber via-brand-amber/40 to-brand-amber ring-2 ring-transparent transition group-hover:ring-brand-amber/60">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            <OptimizedImage
              src={imageSrc}
              alt={category.name}
              fill
              sizes="90px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        </div>

        {category.badge && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-brand-amber px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black shadow-sm">
            {category.badge}
          </span>
        )}
      </div>

      <span className="max-w-[76px] sm:max-w-[88px] truncate text-center text-xs font-semibold tracking-tight text-foreground transition group-hover:text-brand-amber">
        {category.name}
      </span>
    </Link>
  );
};

const CategoriesSection = ({ categories = [] }) => {
  const items =
    categories && categories.length > 0
      ? categories.slice(0, 8)
      : FALLBACK_CATEGORIES;

  return (
    <section className="border-b border-border/40 bg-white py-4 md:py-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex items-center justify-between pb-3 sm:hidden">
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            Explore Categories
          </span>
          <Link
            href="/collections"
            className="text-[11px] font-semibold text-brand-amber hover:underline"
          >
            All &rarr;
          </Link>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar py-1">
          {items.map((cat, idx) => (
            <CategoryCircle
              key={cat._id || cat.slug || `${cat.name}-${idx}`}
              category={cat}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
