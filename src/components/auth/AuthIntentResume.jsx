"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/queryKeys";
import { addCartItem } from "@/services/cartService";
import { toggleWishlist } from "@/services/wishlistService";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

/**
 * Resumes serializable auth intents after a full-page /auth round-trip.
 * Register new action handlers here as features grow.
 */
export default function AuthIntentResume() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    const handler = async (event) => {
      if (handledRef.current) return;
      const intent = event.detail;
      if (!intent?.actionId) return;
      handledRef.current = true;

      try {
        switch (intent.actionId) {
          case "ADD_TO_CART":
          case "BUY_NOW": {
            const { productId, variantSku } = intent.payload || {};
            if (productId && variantSku) {
              await addCartItem(productId, variantSku);
              await queryClient.invalidateQueries({ queryKey: queryKeys.cart });
              showSuccessToast("Item added to bag");
              router.refresh();
              if (intent.actionId === "BUY_NOW") {
                router.push("/checkout/bag");
              }
            }
            break;
          }
          case "WISHLIST": {
            const { productId } = intent.payload || {};
            if (productId) {
              const data = await toggleWishlist(productId);
              await queryClient.invalidateQueries({
                queryKey: queryKeys.wishlist,
              });
              showSuccessToast(
                data?.inWishlist ? "Added to wishlist" : "Removed from wishlist"
              );
            }
            break;
          }
          case "VIEW_WISHLIST":
            router.push("/wishlist");
            break;
          case "VIEW_BAG":
          case "CHECKOUT":
            router.push("/checkout/bag");
            break;
          case "VIEW_ACCOUNT":
            router.push("/account/profile");
            break;
          case "ORDER_HISTORY":
            router.push("/account/orders");
            break;
          default:
            break;
        }
      } catch (err) {
        showErrorToast(err, "Could not complete your action. Please try again.");
      } finally {
        // Allow a later intent in the same session after a short delay
        setTimeout(() => {
          handledRef.current = false;
        }, 1500);
      }
    };

    window.addEventListener("nilecart:auth-intent", handler);
    return () => window.removeEventListener("nilecart:auth-intent", handler);
  }, [queryClient, router]);

  return null;
}
