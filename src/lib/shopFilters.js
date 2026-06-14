export const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "variants.0.price", label: "Price: Low to High" },
  { value: "-variants.0.price", label: "Price: High to Low" },
  { value: "-discountPercent", label: "Better Discount" },
];

export const parseShopFilters = (searchParams) => ({
  brand: splitCsv(searchParams.get("brand")),
  size: splitCsv(searchParams.get("size")),
  color: splitCsv(searchParams.get("color")),
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
  sort: searchParams.get("sort") || "-createdAt",
  page: Math.max(1, Number(searchParams.get("page")) || 1),
});

export const buildShopQueryParams = (filters) => {
  const params = {};

  if (filters.brand?.length) params.brand = filters.brand.join(",");
  if (filters.size?.length) params.size = filters.size.join(",");
  if (filters.color?.length) params.color = filters.color.join(",");
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.sort && filters.sort !== "-createdAt") params.sort = filters.sort;
  if (filters.page && filters.page > 1) params.page = String(filters.page);

  return params;
};

export const buildShopUrl = (slug, filters) => {
  const params = new URLSearchParams(buildShopQueryParams(filters));
  const query = params.toString();
  return query ? `/shop/${slug}?${query}` : `/shop/${slug}`;
};

export const toggleFilterValue = (values, value) => {
  const next = new Set(values);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return [...next];
};

const splitCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const hasActiveFilters = (filters) =>
  Boolean(
    filters.brand?.length ||
      filters.size?.length ||
      filters.color?.length ||
      filters.minPrice ||
      filters.maxPrice
  );
