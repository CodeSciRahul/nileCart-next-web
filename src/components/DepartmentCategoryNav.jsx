import Link from "next/link";

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
    return (
      <p className={`text-sm text-brand-gray ${isMobile ? "px-5 py-4" : "px-3 py-2"}`}>
        Loading categories...
      </p>
    );
  }

  if (categories.length === 0) {
    return (
      <p className={`text-sm text-brand-gray ${isMobile ? "px-5 py-4" : "px-3 py-2"}`}>
        No categories yet. Add them under {departmentLabel} in the admin panel.
      </p>
    );
  }

  return (
    <div
      className={
        isMobile
          ? "space-y-4 px-5 py-2"
          : "grid max-h-[70vh] gap-x-6 gap-y-4 overflow-y-auto sm:grid-cols-2"
      }
    >
      {categories.map((category) => (
        <section key={category._id} className="space-y-1.5">
          <Link
            href={`/shop/${category.slug}`}
            onClick={onNavigate}
            className={`block font-bold tracking-wide text-foreground transition hover:text-brand-amber ${
              isMobile ? "text-base" : "text-sm uppercase"
            }`}
          >
            {category.name}
          </Link>

          {category.subcategories?.length > 0 && (
            <ul className={`space-y-0.5 ${isMobile ? "pl-1 pt-1" : "pl-0 pt-1"}`}>
              {category.subcategories.map((sub) => (
                <li key={sub._id}>
                  <Link
                    href={`/shop/${sub.slug}`}
                    onClick={onNavigate}
                    className="block py-0.5 text-sm font-normal text-brand-gray transition hover:text-brand-amber"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {!isMobile && (
        <div className="col-span-full border-t border-brand-cream pt-3">
          <Link
            href={`/shop/${departmentSlug}`}
            onClick={onNavigate}
            className="text-sm font-semibold text-brand-amber hover:underline"
          >
            View all {departmentLabel.toLowerCase()}
          </Link>
        </div>
      )}
    </div>
  );
}
