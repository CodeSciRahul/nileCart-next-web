import Link from "next/link";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";

const PLACEHOLDER_TONES = [
  "bg-amber-200 text-amber-800",
  "bg-orange-100 text-orange-800",
  "bg-yellow-100 text-yellow-800",
  "bg-brand-cream text-amber-700",
];

/** Discount-forward lines — Myntra-style value cues */
const OFFERS = [
  "40-70% OFF",
  "50-80% OFF",
  "30-60% OFF",
  "Min. 40% OFF",
  "Up to 60% OFF",
  "Flat 50% OFF",
];

/** Soft cream diamond pattern (brand-tinted, not a green clone) */
const CARD_PATTERN = {
  backgroundColor: "#FFF8E7",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 2 L26 14 L14 26 L2 14 Z' fill='none' stroke='%23E8D9A8' stroke-width='1'/%3E%3C/svg%3E")`,
  backgroundSize: "28px 28px",
};

const CategoryCard = ({ category, index }) => {
  const href = category.slug ? `/shop/${category.slug}` : undefined;
  const CardWrapper = href ? Link : "div";
  const cardProps = href ? { href } : {};
  const imageSrc = getCategoryImageSrc(category.image);
  const offer = category.offerLabel || OFFERS[index % OFFERS.length];
  const placeholderTone = PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length];

  return (
    <CardWrapper
      {...cardProps}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2"
    >
      <article
        className="flex h-full flex-col overflow-hidden rounded-sm transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
        style={CARD_PATTERN}
      >
        <div className="px-3 pt-3 sm:px-4 sm:pt-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-brand-white/40">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center ${placeholderTone}`}
              >
                <span className="text-3xl font-bold opacity-80">
                  {category.name?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center px-3 pb-4 pt-3 text-center sm:px-4 sm:pb-5">
          <h3 className="line-clamp-1 text-[13px] font-medium tracking-wide text-[#4a3728] sm:text-sm">
            {category.name}
          </h3>

          <p className="mt-1.5 text-base font-bold tracking-tight text-foreground sm:text-lg">
            {offer}
          </p>

          <span className="mt-1.5 text-[12px] font-medium text-[#5c4a3a] transition-colors group-hover:text-foreground">
            Shop Now
          </span>
        </div>
      </article>
    </CardWrapper>
  );
};

const CategoriesSection = ({ categories = [] }) => {
  return (
    <section className="bg-brand-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
            Browse & discover
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Shop by Category
          </h2>
          <div
            className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-brand-amber"
            aria-hidden
          />
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-gray">
            Handpicked collections with deals worth exploring
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed border-brand-amber/30 bg-brand-cream/40 px-6 py-12 text-center">
            <p className="text-sm text-brand-gray">
              Subcategories will appear here once added under Men or Women in the
              admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category._id || `${category.name}-${index}`}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
