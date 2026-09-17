import Link from "next/link";
import ProductCard from "@/components/ui/productCard";
import Reveal from "@/components/motion/Reveal";

const Products = ({
  products = [],
  title = "New arrivals",
  eyebrow = "Just in",
  description = "Fresh drops from the Nilescart edit — ready to wear, ready to ship.",
  ctaHref = "/collections",
  ctaLabel = "View all collections",
}) => {
  if (!products.length) {
    return (
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center text-brand-gray sm:px-6">
          No products available right now.
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray md:text-base">
              {description}
            </p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex shrink-0 items-center border border-foreground/20 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand-amber hover:bg-brand-amber/15"
          >
            {ctaLabel}
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product, index) => (
            <Reveal
              key={product?._id || index}
              delay={Math.min(index * 40, 200)}
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
