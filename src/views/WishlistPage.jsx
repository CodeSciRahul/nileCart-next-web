"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import ProductCard from "@/components/ui/productCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";

const WishlistPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { data, isLoading, isError } = useWishlist();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-brand-gray">
        Loading your wishlist...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-brand-gray">
        Loading saved items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-red-600">
        Could not load your wishlist. Please try again later.
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          My Wishlist
        </h1>
        <p className="mt-1 text-sm text-brand-gray">
          {products.length > 0
            ? `${products.length} saved item${products.length === 1 ? "" : "s"}`
            : "Items you love will appear here"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-amber/30 bg-brand-cream/50 px-6 py-16 text-center">
          <Heart className="mx-auto mb-4 text-brand-amber" size={48} />
          <h2 className="text-lg font-semibold text-foreground">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-brand-gray">
            Tap the heart on any product to save it for later.
          </p>
          <Button
            asChild
            className="mt-6 bg-brand-amber text-brand-white hover:bg-brand-amber/90"
          >
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
