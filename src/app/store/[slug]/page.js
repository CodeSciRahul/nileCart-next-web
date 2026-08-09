import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ui/productCard";
import OptimizedImage from "@/components/ui/OptimizedImage";
import JsonLd from "@/components/seo/JsonLd";
import {
  fetchSellerBySlug,
  fetchSellerProducts,
} from "@/lib/data/sellers";
import { buildPageMetadata, breadcrumbJsonLd, truncateMeta } from "@/lib/seo";
import {
  BadgeCheck,
  MapPin,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const data = await fetchSellerBySlug(slug);
    const seller = data?.seller;
    if (!seller) {
      return { title: "Store", robots: { index: false, follow: false } };
    }
    return buildPageMetadata({
      title: `${seller.storeName} Store`,
      description: truncateMeta(
        seller.description ||
          `Shop products from ${seller.storeName} on Nilescart.`
      ),
      path: `/store/${slug}`,
    });
  } catch {
    return { title: "Store" };
  }
}

export default async function StorePage({ params }) {
  const { slug } = await params;

  let seller;
  let products = [];

  try {
    const sellerData = await fetchSellerBySlug(slug);
    seller = sellerData?.seller;
    if (!seller) notFound();

    const productsData = await fetchSellerProducts(seller._id, {
      limit: 24,
    });
    products = productsData?.products || [];
  } catch (error) {
    if (error?.status === 404) notFound();
    throw error;
  }

  const logoUrl =
    typeof seller.logo === "string" ? seller.logo : seller.logo?.url;
  const ratingAvg = Number(seller.rating?.average) || 0;
  const ratingCount = Number(seller.rating?.count) || 0;
  const location = [seller.address?.city, seller.address?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex min-h-screen flex-col bg-brand-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: seller.storeName, path: `/store/${slug}` },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="border-b border-brand-amber/15 bg-linear-to-b from-brand-cream/60 to-brand-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <nav className="mb-6 text-xs text-brand-gray" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span className="mx-1.5">/</span>
              <span className="font-medium text-foreground">Store</span>
            </nav>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative size-20 shrink-0 overflow-hidden border border-brand-amber/25 bg-[#FFECB3] sm:size-24">
                {logoUrl ? (
                  <OptimizedImage
                    src={logoUrl}
                    alt={`${seller.storeName} logo`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-3xl font-black">
                    {seller.storeName.charAt(0).toUpperCase()}
                  </span>
                )}
                {seller.approvalStatus === "Approved" && (
                  <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-emerald-600 text-brand-white ring-2 ring-brand-white">
                    <BadgeCheck size={16} />
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                    {seller.storeName}
                  </h1>
                  {seller.approvalStatus === "Approved" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                      <ShieldCheck size={12} />
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 bg-brand-cream/80 px-2 py-0.5 font-bold ring-1 ring-brand-amber/25">
                    <Star
                      size={13}
                      fill="currentColor"
                      className="text-brand-amber"
                    />
                    {ratingAvg > 0 ? ratingAvg.toFixed(1) : "New"}
                  </span>
                  <span className="text-brand-gray">
                    {ratingCount} ratings · {products.length} products
                  </span>
                </div>

                {location && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-gray">
                    <MapPin size={12} className="text-brand-amber" />
                    {location}
                  </p>
                )}

                {seller.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-gray">
                    {seller.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <Store size={18} className="text-brand-amber" />
            <h2 className="text-xl font-black tracking-tight">
              Products from this store
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-brand-amber/30 bg-brand-cream/20 px-6 py-16 text-center">
              <p className="font-bold">No products listed yet</p>
              <p className="mt-2 text-sm text-brand-gray">
                Check back soon for new arrivals from {seller.storeName}.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex bg-brand-amber px-5 py-2.5 text-xs font-bold uppercase tracking-wide"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
