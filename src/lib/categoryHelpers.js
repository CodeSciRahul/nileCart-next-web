import { getCategoryNavigation } from "@/services/categoryService.js";

/** Map navigation API departments for header links. */
export const mapNavDepartments = (departments = []) =>
  departments.map((dept) => ({
    key: dept.slug,
    label: dept.label,
    slug: dept.slug,
    department: dept.department,
    categories: dept.categories || [],
  }));

export const findNavDepartment = (departments, key) =>
  (departments || []).find(
    (dept) => dept.slug === key || dept.department === key
  );

/** Resolve nav payload for a department key (men, women, …). */
export const getDepartmentNav = (departments, key, fallbackLabel) => {
  const match = findNavDepartment(departments, key);
  if (match) return match;

  return {
    key,
    label: fallbackLabel,
    slug: key,
    department: key,
    categories: [],
  };
};

/** Flat list: keep only child categories (exclude top-level departments). */
export const getSubcategories = (categories) =>
  (categories || []).filter((category) => category.parent);
