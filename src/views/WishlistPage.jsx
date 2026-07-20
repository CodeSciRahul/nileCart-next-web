"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/ui/productCard";
import { Button } from "@/components/ui/button";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { AUTH_ACTIONS } from "@/lib/authActions";

const WishlistPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const { data, isLoading, isError, refetch } = useWishlist();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-brand-gray">
        Loading your wishlist...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthRequiredState
        action={AUTH_ACTIONS.VIEW_WISHLIST}
        onAuthenticated={() => refetch()}
      />
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
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-amber/30 bg-brand-cream/30 px-6 py-16 text-center">
          <Heart className="mb-4 size-12 text-brand-amber" />
          <h2 className="text-lg font-semibold text-foreground">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-brand-gray">
            Tap the heart on products you love to save them here.
          </p>
          <Button asChild className="mt-6 bg-brand-amber text-foreground hover:bg-brand-amber/90">
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
