import Header from "@/components/header";
import Footer from "@/components/Footer";
import Banner from "@/components/banner";
import CategoriesSection from "@/components/category";
import TrendingProducts from "@/components/trendingProducts";
import Products from "@/components/products";
import { fetchProducts } from "@/lib/data/products";
import { fetchCategory, fetchSubCategories } from "@/lib/data/category";

export const metadata = {
  title: "NileCart — Fashion Store",
  description:
    "Shop trending dresses, tops, accessories and more. Anniversary sale with up to 80% off and free shipping above ₹999.",
  openGraph: {
    title: "NileCart — Fashion Store",
    description:
      "Shop trending dresses, tops, accessories and more at NileCart.",
    type: "website",
  },
};

export default async function HomePage() {
  const [{ products = [] }, { categories = [] }] = await Promise.all([
    fetchProducts(),
    fetchSubCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Banner />
      <CategoriesSection categories={categories} />
      <TrendingProducts />
      <Products products={products} />
      <Footer />
    </div>
  );
}
