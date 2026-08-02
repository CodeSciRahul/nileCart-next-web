import Header from "@/components/header";
import Footer from "@/components/Footer";
import Banner from "@/components/banner";
import CategoriesSection from "@/components/category";
import Products from "@/components/products";
import { fetchProducts } from "@/lib/data/products";
import { fetchSubCategories } from "@/lib/data/category";
import { fetchHome, getHeroBanners } from "@/lib/data/home";

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
  const [home, { products = [] }, { categories = [] }] = await Promise.all([
    fetchHome(),
    fetchProducts(),
    fetchSubCategories(),
  ]);

  const heroBanners = await getHeroBanners(home);

  return (
    <div className="flex min-h-screen flex-col">
      <Header announcement={home?.announcement || null} />
      <Banner banners={heroBanners} />
      <CategoriesSection categories={categories} />
      <Products products={products} />
      <Footer />
    </div>
  );
}
