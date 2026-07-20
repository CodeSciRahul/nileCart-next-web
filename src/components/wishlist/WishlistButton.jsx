"use client";

import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { cn } from "@/lib/utils";

const WishlistButton = ({
  productId,
  className,
  iconSize = 18,
  variant = "overlay",
}) => {
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthGate();
  const { data } = useWishlist();
  const toggle = useToggleWishlist();

  if (!productId) return null;

  const inWishlist = data?.productIds?.has(String(productId));
  const isPending = toggle.isPending;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    const run = () => toggle.mutate(productId);

    if (isAuthenticated) {
      run();
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.WISHLIST,
      payload: { productId },
      onSuccess: run,
    });
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
