"use client";

import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

const WishlistButton = ({
  productId,
  className,
  iconSize = 18,
  variant = "overlay",
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data } = useWishlist();
  const toggle = useToggleWishlist();

  if (!productId) return null;

  const inWishlist = data?.productIds?.has(String(productId));
  const isPending = toggle.isPending;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    toggle.mutate(productId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={inWishlist}
      className={cn(
        variant === "overlay" &&
          "rounded-full bg-brand-white/90 p-2 shadow-md backdrop-blur-md transition hover:scale-110",
        variant === "plain" &&
          "rounded-2xl border border-brand-amber/20 p-4 transition hover:border-brand-amber hover:bg-brand-cream",
        isPending && "opacity-70",
        className
      )}
    >
      {isPending ? (
        <Loader2 size={iconSize} className="animate-spin text-brand-amber" />
      ) : (
        <Heart
          size={iconSize}
          className={
            inWishlist
              ? "fill-brand-amber text-brand-amber"
              : "text-foreground"
          }
        />
      )}
    </button>
  );
};

export default WishlistButton;
