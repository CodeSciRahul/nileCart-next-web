import { cache } from "react";
import { serverGet } from "../serverApi.js";

export const fetchCategory = () =>
  serverGet("/categories?navOnly=true", {
    revalidate: 300,
    tags: ["categories"],
  });

export const fetchSubCategories = () =>
  serverGet("/categories?subcategoriesOnly=true&navOnly=true", {
    revalidate: 300,
    tags: ["categories"],
  });

export const fetchCategoryTree = () =>
  serverGet("/categories?tree=true", {
    revalidate: 300,
    tags: ["categories"],
  });

export const fetchCategoryBySlug = cache(async (slug) =>
  serverGet(`/categories/${slug}`, {
    revalidate: 300,
    tags: [`category:${slug}`, "categories"],
  })
);
