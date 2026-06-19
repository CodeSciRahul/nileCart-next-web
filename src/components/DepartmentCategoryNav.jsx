import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

function PopoverSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-3 animate-pulse">
          <div className="h-4 w-24 rounded bg-brand-cream" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-brand-cream/80" />
            <div className="h-3 w-4/5 rounded bg-brand-cream/80" />
            <div className="h-3 w-3/5 rounded bg-brand-cream/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PopoverNav({
  categories,
  departmentLabel,
  departmentSlug,
  onNavigate,
}) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-brand-amber/15 bg-gradient-to-r from-brand-cream/80 via-brand-white to-brand-cream/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-amber/20 text-brand-amber">
            <Sparkles size={15} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gray">
              Shop by category
            </p>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {departmentLabel}
            </h3>
          </div>
        </div>
      </div>

      <div className="max-h-[min(68vh,520px)] overflow-y-auto px-5 py-4">
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <section
              key={category._id}
              className="group/section min-w-0"
            >
              <Link
                href={`/shop/${category.slug}`}
                onClick={onNavigate}
                className="mb-2.5 flex items-center gap-1.5 border-b border-brand-amber/25 pb-2 transition-colors hover:border-brand-amber"
              >
                <span className="text-sm font-bold uppercase tracking-wide text-foreground transition-colors group-hover/section:text-brand-amber">
                  {category.name}
                </span>
                <ChevronRight
                  size={14}
                  className="shrink-0 text-brand-amber opacity-0 transition-all group-hover/section:translate-x-0.5 group-hover/section:opacity-100"
                />
              </Link>

              {category.subcategories?.length > 0 ? (
                <ul className="space-y-0.5">
                  {category.subcategories.map((sub) => (
                    <li key={sub._id}>
                      <Link
                        href={`/shop/${sub.slug}`}
                        onClick={onNavigate}
                        className="group/link flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-normal text-brand-gray transition-all hover:bg-brand-cream hover:pl-3 hover:text-foreground"
                      >
                        <span>{sub.name}</span>
                        <ChevronRight
                          size={12}
                          className="shrink-0 text-brand-amber opacity-0 transition-all group-hover/link:translate-x-0.5 group-hover/link:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2.5 text-xs text-brand-gray/80">
                  Browse all {category.name.toLowerCase()}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="border-t border-brand-amber/15 bg-brand-cream/30 px-5 py-3.5">
        <Link
          href={`/shop/${departmentSlug}`}
          onClick={onNavigate}
          className="group/cta inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand-amber"
        >
          View all {departmentLabel.toLowerCase()}
          <ArrowRight
            size={15}
            className="transition-transform group-hover/cta:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}

function MobileNav({
  categories,
  departmentLabel,
  departmentSlug,
  onNavigate,
}) {
  return (
    <div className="space-y-5 px-5 py-2">
      {categories.map((category) => (
        <section
          key={category._id}
          className="overflow-hidden rounded-xl border border-brand-amber/15 bg-brand-cream/30"
        >
          <Link
            href={`/shop/${category.slug}`}
            onClick={onNavigate}
            className="flex items-center justify-between border-b border-brand-amber/10 bg-brand-white/60 px-4 py-3"
          >
            <span className="text-base font-bold text-foreground">{category.name}</span>
            <ChevronRight size={16} className="text-brand-amber" />
          </Link>

          {category.subcategories?.length > 0 && (
            <ul className="divide-y divide-brand-amber/10">
              {category.subcategories.map((sub) => (
                <li key={sub._id}>
                  <Link
                    href={`/shop/${sub.slug}`}
                    onClick={onNavigate}
                    className="flex items-center justify-between px-4 py-3 text-sm text-brand-gray transition-colors hover:bg-brand-white hover:text-foreground"
                  >
                    {sub.name}
                    <ChevronRight size={14} className="text-brand-amber/70" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <Link
        href={`/shop/${departmentSlug}`}
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-4 py-3 text-sm font-semibold text-foreground"
      >
        View all {departmentLabel.toLowerCase()}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export function DepartmentCategoryNav({
  categories = [],
  departmentLabel,
  departmentSlug,
  onNavigate,
  variant = "popover",
  isLoading = false,
}) {
  const isMobile = variant === "mobile";

  if (isLoading) {
    return isMobile ? (
      <p className="px-5 py-4 text-sm text-brand-gray">Loading categories...</p>
    ) : (
      <div className="p-5">
        <PopoverSkeleton />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div
        className={
          isMobile
            ? "px-5 py-6 text-center"
            : "flex flex-col items-center justify-center px-8 py-10 text-center"
        }
      >
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-brand-amber">
          <Sparkles size={20} />
        </span>
        <p className="text-sm font-medium text-foreground">Categories coming soon</p>
        <p className="mt-1 max-w-xs text-sm text-brand-gray">
          We&apos;re curating collections for {departmentLabel}. Check back shortly.
        </p>
        <Link
          href={`/shop/${departmentSlug}`}
          onClick={onNavigate}
          className="mt-4 text-sm font-semibold text-brand-amber hover:underline"
        >
          Browse {departmentLabel.toLowerCase()}
        </Link>
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileNav
        categories={categories}
        departmentLabel={departmentLabel}
        departmentSlug={departmentSlug}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <PopoverNav
      categories={categories}
      departmentLabel={departmentLabel}
      departmentSlug={departmentSlug}
      onNavigate={onNavigate}
    />
  );
}
