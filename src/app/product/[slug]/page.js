import { notFound } from "next/navigation";
import ProductDetailContent from "@/components/product/ProductDetailContent";
import { fetchProductBySlug, fetchProducts } from "@/lib/data/products";
import { fetchProductReviews } from "@/lib/data/reviews";
import { buildPageMetadata, truncateMeta } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const data = await fetchProductBySlug(slug);
    const product = data?.product;

    if (!product) {
      return {
        title: "Product Not Found",
        robots: { index: false, follow: false },
      };
    }

    const description = truncateMeta(
      product.description ||
        `Shop ${product.title} at Nilescart. Fast shipping and easy returns.`
    );

    return buildPageMetadata({
      title: product.title,
      description,
      path: `/product/${slug}`,
      type: "website",
      keywords: [
        product.title,
        product.brand?.name || product.brand,
        product.category?.name,
        "Nilescart",
        "fashion",
      ].filter(Boolean),
    });
  } catch {
    return {
      title: "Product",
      description: "Discover fashion products at Nilescart.",
    };
  }
}

export default async function ProductPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams?.cat;

  let product;
  let reviews = [];
  let similarProducts = [];

  try {
    const productData = await fetchProductBySlug(slug);
    product = productData?.product;

    if (!product) {
      notFound();
    }

    const [reviewsData, similarData] = await Promise.all([
      fetchProductReviews(product._id),
      fetchProducts(
        categoryId
          ? { category: categoryId, limit: 12 }
          : { limit: 12 }
      ),
    ]);

    reviews = reviewsData?.reviews || [];
    similarProducts = (similarData?.products || []).filter(
      (item) => item._id !== product._id
    );
  } catch (error) {
    if (error?.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <ProductDetailContent
      product={product}
      reviews={reviews}
      similarProducts={similarProducts}
    />
  );
}
