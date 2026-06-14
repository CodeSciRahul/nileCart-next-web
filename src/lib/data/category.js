import { serverGet } from "../serverApi.js";

export const fetchCategory = () => serverGet("/categories?navOnly=true");

export const fetchCategoryTree = () => serverGet("/categories?tree=true");

export const fetchCategoryBySlug = (slug) => serverGet(`/categories/${slug}`);