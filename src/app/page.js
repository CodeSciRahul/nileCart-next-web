import Header from "@/components/header";
import Banner from "@/components/banner";
import CategoriesSection from "@/components/category";
import TrendingProducts from "@/components/trendingProducts";
import Products from "@/components/products";
import { fetchProducts } from "@/lib/data/products";

export const metadata = {
  title: "LightCollection — Fashion Store",
  description:
    "Shop trending dresses, tops, accessories and more. Anniversary sale with up to 80% off and free shipping above ₹999.",
  openGraph: {
    title: "LightCollection — Fashion Store",
    description:
      "Shop trending dresses, tops, accessories and more at LightCollection.",
    type: "website",
  },
};

export default async function HomePage() {
  let products = [];

  try {
    const data = await fetchProducts();
    products = data?.products || [];
  } catch {
    products = [];
  }

  return (
    <div>
      <Header />
      <Banner />
      <CategoriesSection />
      <TrendingProducts />
      <Products products={products} />
    </div>
  );
}
