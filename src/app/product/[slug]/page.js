import { notFound } from "next/navigation";
import ProductDetailContent from "@/components/product/ProductDetailContent";
import { fetchProductBySlug, fetchProducts } from "@/lib/data/products";
import { fetchProductReviews } from "@/lib/data/reviews";
import { getProductImageUrl } from "@/lib/productHelpers";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  try {
    const data = await fetchProductBySlug(slug);
    const product = data?.product;

    if (!product) {
      return { title: "Product Not Found | LightCollection" };
    }

    const imageUrl = getProductImageUrl(product);
    const description =
      product.description?.slice(0, 160) ||
      `Shop ${product.title} at LightCollection.`;

    return {
      title: product.title,
      description,
      openGraph: {
        title: product.title,
        description,
        type: "website",
        ...(imageUrl ? { images: [{ url: imageUrl, alt: product.title }] } : {}),
      },
      twitter: {
        card: imageUrl ? "summary_large_image" : "summary",
        title: product.title,
        description,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
      alternates: {
        canonical: `/product/${slug}${
          resolvedSearchParams?.cat ? `?cat=${resolvedSearchParams.cat}` : ""
        }`,
      },
    };
  } catch {
    return {
      title: "Product | LightCollection",
      description: "Discover fashion products at LightCollection.",
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
      fetchProducts(categoryId ? { category: categoryId } : {}),
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
