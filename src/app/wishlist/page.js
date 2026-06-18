import Header from "@/components/header";
import WishlistPage from "@/views/WishlistPage";

export const metadata = {
  title: "Wishlist",
};

export default function Wishlist() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <WishlistPage />
    </div>
  );
}
