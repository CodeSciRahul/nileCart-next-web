import Link from "next/link";
import ProductCard from "@/components/ui/productCard";
import Reveal from "@/components/motion/Reveal";
import { ChevronRight } from "lucide-react";

const Products = ({
  products = [],
  title = "New Arrivals",
  eyebrow = "Just in",
  description,
  ctaHref = "/collections",
  ctaLabel = "View All",
}) => {
  if (!products.length) {
    return (
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-400">
          No products available right now.
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 md:py-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* Compact Savana-style Section Header */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between border-b border-border/40 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-brand-amber rounded-full" />
            <h2 className="font-display text-base sm:text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
              {title}
            </h2>
            {eyebrow && (
              <span className="hidden sm:inline-block rounded-none bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {eyebrow}
              </span>
            )}
          </div>

          <Link
            href={ctaHref}
            className="flex items-center gap-0.5 text-xs font-bold uppercase tracking-wider text-brand-amber hover:text-foreground transition group"
          >
            <span>{ctaLabel}</span>
            <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Dense Fast-Fashion Product Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
          {products.map((product, index) => (
            <Reveal
              key={product?._id || index}
              delay={Math.min(index * 30, 150)}
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
