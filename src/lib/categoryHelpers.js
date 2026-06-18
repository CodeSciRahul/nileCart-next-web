export const DEPARTMENTS = [
  { key: "men", label: "MEN" },
  { key: "women", label: "WOMEN" },
];

export const findDepartmentCategory = (tree, key) =>
  (tree || []).find(
    (cat) => cat.slug === key || cat.name?.toLowerCase() === key
  );

export const getDepartmentSubcategories = (tree, key) =>
  findDepartmentCategory(tree, key)?.children || [];

/** Flat list: keep only child categories (exclude top-level departments). */
export const getSubcategories = (categories) =>
  (categories || []).filter((category) => category.parent);
