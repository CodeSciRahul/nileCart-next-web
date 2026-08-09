import { fetchProducts } from "@/lib/data/products";
import { fetchCategoryTree } from "@/lib/data/category";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

async function collectProductEntries() {
  const entries = [];
  let page = 1;
  let pages = 1;

  while (page <= pages && page <= 40) {
    try {
      const data = await fetchProducts({ page, limit: 50 });
      const products = data?.products || [];
      pages = Number(data?.pagination?.pages) || 1;

      for (const product of products) {
        if (!product?.slug) continue;
        entries.push({
          url: `${getSiteUrl()}/product/${product.slug}`,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    } catch {
      break;
    }
    page += 1;
  }

  return entries;
}

function flattenCategories(nodes = [], acc = []) {
  for (const node of nodes) {
    if (node?.slug) {
      acc.push({
        url: `${getSiteUrl()}/shop/${node.slug}`,
        lastModified: node.updatedAt ? new Date(node.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    if (node?.children?.length) {
      flattenCategories(node.children, acc);
    }
  }
  return acc;
}

async function collectCategoryEntries() {
  try {
    const data = await fetchCategoryTree();
    const tree = data?.categories || data?.tree || [];
    return flattenCategories(Array.isArray(tree) ? tree : []);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const base = getSiteUrl();

  const staticEntries = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  const [products, categories] = await Promise.all([
    collectProductEntries(),
    collectCategoryEntries(),
  ]);

  return [...staticEntries, ...categories, ...products];
}
