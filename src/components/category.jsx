import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

const PLACEHOLDER_GRADIENTS = [
  "from-amber-200 via-brand-amber to-amber-500",
  "from-orange-100 via-brand-cream to-brand-amber",
  "from-yellow-100 via-amber-300 to-orange-400",
  "from-brand-cream via-amber-200 to-amber-400",
];

const CategoryCard = ({ category, index }) => {
  const CardWrapper = category.slug ? Link : "div";
  const cardProps = category.slug ? { href: `/shop/${category.slug}` } : {};
  const parentName = category.parent?.name;
  const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
  const hasImage = Boolean(category?.image);

  return (
    <CardWrapper
      {...cardProps}
      className="group relative block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article className="relative overflow-hidden rounded-3xl bg-brand-white shadow-md ring-1 ring-black/5 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-brand-amber/15 group-hover:ring-brand-amber/30">
        <div className="relative aspect-[3/4] overflow-hidden">
          {hasImage ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
            >
              <span className="text-5xl font-black text-brand-white/90 drop-shadow-sm">
                {category.name?.charAt(0) || "?"}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-amber/0 via-transparent to-brand-amber/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {parentName && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-gray shadow-sm backdrop-blur-sm">
              {parentName}
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
              <h3 className="text-lg font-bold leading-tight text-brand-white drop-shadow-md md:text-xl">
                {category.name}
              </h3>

              <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-amber opacity-0 transition-all duration-500 group-hover:opacity-100">
                <span>Shop now</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-500 group-hover:border-brand-amber/50" />
      </article>
    </CardWrapper>
  );
};

const CategoriesSection = ({ categories = [] }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream via-brand-white to-brand-cream py-16 md:py-20">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-amber/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-amber/25 bg-brand-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-amber shadow-sm backdrop-blur-sm">
            <Sparkles size={14} />
            Shop By Category
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Find Your{" "}
            <span className="bg-gradient-to-r from-brand-amber via-amber-500 to-brand-amber bg-clip-text text-transparent">
              Style
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-brand-gray md:text-base">
            Curated collections designed for every mood and occasion — tap a
            category to start exploring.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-amber/30 bg-brand-white/60 px-6 py-12 text-center backdrop-blur-sm">
            <p className="text-sm text-brand-gray">
              Subcategories will appear here once added under Men or Women in the
              admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
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
