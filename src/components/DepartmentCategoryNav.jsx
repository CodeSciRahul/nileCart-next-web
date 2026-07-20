import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

function PopoverSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-3 animate-pulse">
          <div className="h-3.5 w-28 rounded bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-neutral-100" />
            <div className="h-3 w-4/5 rounded bg-neutral-100" />
            <div className="h-3 w-3/5 rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mega-menu style: clear columns, high-contrast text (Meesho / Myntra / Flipkart). */
function PopoverNav({
  categories,
  departmentLabel,
  departmentSlug,
  onNavigate,
}) {
  return (
    <div className="flex flex-col bg-white text-[#282c3f]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Shop by category
          </p>
          <h3 className="text-base font-bold tracking-tight text-[#282c3f]">
            {departmentLabel}
          </h3>
        </div>
        <Link
          href={`/shop/${departmentSlug}`}
          onClick={onNavigate}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-amber px-3 py-1.5 text-xs font-bold text-[#282c3f] transition hover:bg-brand-amber/90"
        >
          View all
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="max-h-[min(70vh,480px)] overflow-y-auto px-5 py-5">
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <section key={category._id} className="min-w-0">
              <Link
                href={`/shop/${category.slug}`}
                onClick={onNavigate}
                className="mb-2.5 block border-b border-neutral-200 pb-2 text-[13px] font-bold uppercase tracking-wide text-[#282c3f] transition-colors hover:text-brand-amber"
              >
                {category.name}
              </Link>

              {category.subcategories?.length > 0 ? (
                <ul className="space-y-0.5">
                  {category.subcategories.map((sub) => (
                    <li key={sub._id}>
                      <Link
                        href={`/shop/${sub.slug}`}
                        onClick={onNavigate}
                        className="block rounded-md px-0 py-1.5 text-sm font-medium text-[#696e79] transition-colors hover:bg-neutral-50 hover:pl-1.5 hover:text-[#282c3f]"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500">
                  Browse all {category.name.toLowerCase()}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-3">
        <Link
          href={`/shop/${departmentSlug}`}
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#282c3f] transition-colors hover:text-brand-amber"
        >
          View all {departmentLabel.toLowerCase()}
          <ArrowRight size={14} />
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
    <div className="space-y-4 px-5 py-2">
      {categories.map((category) => (
        <section
          key={category._id}
          className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
        >
          <Link
            href={`/shop/${category.slug}`}
            onClick={onNavigate}
            className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3"
          >
            <span className="text-base font-bold text-[#282c3f]">{category.name}</span>
            <ChevronRight size={16} className="text-brand-amber" />
          </Link>

          {category.subcategories?.length > 0 && (
            <ul className="divide-y divide-neutral-100">
              {category.subcategories.map((sub) => (
                <li key={sub._id}>
                  <Link
                    href={`/shop/${sub.slug}`}
                    onClick={onNavigate}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-[#696e79] transition-colors hover:bg-neutral-50 hover:text-[#282c3f]"
                  >
                    {sub.name}
                    <ChevronRight size={14} className="text-neutral-400" />
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
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-amber px-4 py-3 text-sm font-bold text-[#282c3f]"
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
      <p className="px-5 py-4 text-sm text-neutral-500">Loading categories...</p>
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
        <p className="text-sm font-semibold text-[#282c3f]">Categories coming soon</p>
        <p className="mt-1 max-w-xs text-sm text-[#696e79]">
          We&apos;re curating collections for {departmentLabel}. Check back shortly.
        </p>
        <Link
          href={`/shop/${departmentSlug}`}
          onClick={onNavigate}
          className="mt-4 text-sm font-bold text-brand-amber hover:underline"
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
