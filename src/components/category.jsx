import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import Reveal from "@/components/motion/Reveal";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";

const CategoryTile = ({ category, index, featured = false }) => {
  const href = category.slug ? `/shop/${category.slug}` : "/collections";
  const imageSrc = getCategoryImageSrc(category.image);

  return (
    <Reveal
      as="div"
      delay={Math.min(index * 70, 280)}
      className={featured ? "md:col-span-2 md:row-span-2" : ""}
    >
      <Link
        href={href}
        className="group relative block h-full min-h-[280px] overflow-hidden bg-brand-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 md:min-h-[320px]"
      >
        {imageSrc ? (
          <OptimizedImage
            src={imageSrc}
            alt={category.name}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 50vw, 25vw"
            }
            className="img-zoom object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-sand to-brand-cream" />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/15 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-amber">
            Shop
          </p>
          <h3
            className={`mt-1.5 font-display font-bold tracking-tight text-brand-white ${
              featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl"
            }`}
          >
            {category.name}
          </h3>
          <span className="mt-3 inline-block text-sm font-medium text-brand-white/85 underline-offset-4 transition group-hover:underline">
            Explore
          </span>
        </div>
      </Link>
    </Reveal>
  );
};

const CategoriesSection = ({ categories = [] }) => {
  const list = (categories || []).slice(0, 7);

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-xl md:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
            Categories
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Shop the rooms
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray md:text-base">
            Clean edits by category — find the silhouette, then make it yours.
          </p>
        </Reveal>

        {list.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm text-brand-gray">
              Categories will appear here once they are published.
            </p>
            <Link
              href="/collections"
              className="mt-4 inline-block text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Browse collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {list.map((category, index) => (
              <CategoryTile
                key={category._id || `${category.name}-${index}`}
                category={category}
                index={index}
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
