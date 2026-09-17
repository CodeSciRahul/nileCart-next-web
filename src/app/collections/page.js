import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import Reveal from "@/components/motion/Reveal";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { fetchSubCategories } from "@/lib/data/category";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Collections",
  description: `Explore ${SITE.name} collections and departments — shop by category.`,
  path: "/collections",
});

export default async function CollectionsPage() {
  let categories = [];
  try {
    const data = await fetchSubCategories();
    categories = data?.categories || [];
  } catch {
    categories = [];
  }

  return (
    <MarketingShell>
      <section className="border-b border-border atmosphere-panel py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-amber">
            Collections
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            nilescart
            <span className="mt-2 block font-display text-2xl font-semibold text-brand-gray sm:text-3xl">
              Shop landing
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-gray md:text-base">
            Start with a department or dive into a category — every path leads
            to live product inventory.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Departments
            </h2>
          </Reveal>
          <ul className="mt-8 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENT_ORDER.map((key, index) => (
              <li key={key}>
                <Reveal delay={Math.min(index * 40, 200)}>
                  <Link
                    href={`/shop/${key}`}
                    className="group flex items-baseline justify-between border-t border-foreground/10 py-5 transition hover:border-brand-amber"
                  >
                    <span className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      {DEPARTMENT_LABELS[key]}
                    </span>
                    <span className="text-sm text-brand-stone group-hover:text-brand-amber">
                      Open →
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Categories
            </h2>
            <p className="mt-2 text-sm text-brand-gray">
              Live categories from the catalog.
            </p>
          </Reveal>

          {categories.length === 0 ? (
            <p className="text-sm text-brand-gray">
              Categories will appear here once published.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {categories.slice(0, 16).map((category, index) => {
                const imageSrc = getCategoryImageSrc(category.image);
                const href = category.slug
                  ? `/shop/${category.slug}`
                  : "/search";
                return (
                  <Reveal
                    key={category._id || index}
                    delay={Math.min(index * 35, 210)}
                  >
                    <Link
                      href={href}
                      className="group relative block aspect-[3/4] overflow-hidden bg-brand-sand"
                    >
                      {imageSrc ? (
                        <OptimizedImage
                          src={imageSrc}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="img-zoom object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-brand-ink/65 to-transparent"
                        aria-hidden
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="font-display text-lg font-semibold text-brand-white">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MarketingShell>
  );
}
