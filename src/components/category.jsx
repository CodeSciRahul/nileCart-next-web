import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";

const FALLBACK_CATEGORIES = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Co-ords",
    slug: "co-ords",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Tops & Blouses",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Jackets & Coats",
    slug: "jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sweatshirts",
    slug: "sweatshirts",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Knitwear",
    slug: "knitwear",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Loungewear & Lingerie",
    slug: "loungewear",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Jewellery",
    slug: "jewellery",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bags",
    slug: "bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "New",
    slug: "new-in",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    badge: "HOT",
  },
];

/** Four-pointed sparkle star icon matching Savana category cards */
const Sparkle = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`pointer-events-none absolute select-none text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] ${className}`}
    aria-hidden="true"
  >
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

const CategoryCard = ({ category }) => {
  const href = category.slug ? `/shop/${category.slug}` : "/collections";
  const imageSrc =
    (category.image && typeof category.image === "string"
      ? category.image
      : getCategoryImageSrc(category.image)) || FALLBACK_CATEGORIES[0].image;

  const displayName = (category.name || "").replace(/-/g, " ");

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-t-[32px] sm:rounded-t-[44px] md:rounded-t-[54px] rounded-b-xl sm:rounded-b-2xl border border-[#fed7c7]/80 bg-gradient-to-b from-[#f79579] via-[#fba990] via-30% via-[#fedacb] via-68% to-[#fff5ee] p-1.5 sm:p-2 md:p-2.5 pb-2 sm:pb-3 shadow-[0_3px_10px_rgba(247,150,120,0.10)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(247,150,120,0.22)] active:scale-98"
    >
      {/* Decorative Sparkles matching Savana UI */}
      <Sparkle className="top-[18%] right-[10%] h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 text-white/95" />
      <Sparkle className="top-[38%] left-[8%] h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 text-white/85" />
      <Sparkle className="top-[24%] left-[14%] h-1 w-1 sm:h-1.5 sm:w-1.5 text-white/60" />
      <Sparkle className="top-[58%] right-[8%] h-1 w-1 sm:h-1.5 sm:w-1.5 text-white/70" />

      {/* Optional Badge */}
      {category.badge && (
        <span className="absolute top-1.5 left-1.5 z-10 rounded-full bg-black/85 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
          {category.badge}
        </span>
      )}

      {/* Centered Product Image in Arch */}
      <div className="relative mt-1.5 sm:mt-2.5 flex w-full aspect-square items-center justify-center p-1">
        <div className="relative h-full w-full flex items-center justify-center">
          <OptimizedImage
            src={imageSrc}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, (max-width: 1280px) 12.5vw, 130px"
            className="object-contain rounded-lg sm:rounded-xl drop-shadow-[0_3px_6px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>
      </div>

      {/* Category Name Label at the Bottom */}
      <div className="mt-1 sm:mt-1.5 text-center">
        <span className="block text-[10px] sm:text-xs md:text-sm font-semibold tracking-tight text-[#111111] line-clamp-2 leading-tight capitalize transition-colors group-hover:text-black">
          {displayName}
        </span>
      </div>
    </Link>
  );
};

const CategoriesSection = ({ categories = [] }) => {
  const items =
    categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="bg-white py-4 md:py-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* Section Heading: HOT CATEGORIES */}
        <div className="mb-3 sm:mb-4 md:mb-6 text-center">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#111111]">
            HOT CATEGORIES
          </h2>
        </div>

        {/* Responsive Arched Cards Grid wrapping across screen sizes */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3 md:gap-3.5 lg:gap-4">
          {items.map((cat, idx) => (
            <CategoryCard
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

