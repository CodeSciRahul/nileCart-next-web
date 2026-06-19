/** Map navigation API departments for header links. */
export const mapNavDepartments = (departments = []) =>
  departments.map((dept) => ({
    key: dept.department || dept.slug,
    label: dept.label || dept.department,
    slug: dept.slug || dept.department,
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

/** Resolve category image from API (string URL or stored image object). */
export const getCategoryImageSrc = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
};
