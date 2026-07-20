/**
 * Catalog of account-protected actions with contextual copy.
 * Extend this map as new gated features are added.
 */

import {
  Heart,
  ShoppingBag,
  Package,
  MapPin,
  Star,
  MessageCircle,
  Tag,
  User,
  Bell,
  Store,
  CreditCard,
  ClipboardList,
} from "lucide-react";

/** @typedef {'prompt' | 'inline'} AuthGateMode */

/**
 * @typedef {Object} AuthActionConfig
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} benefits
 * @property {string} primaryLabel
 * @property {string} secondaryLabel
 * @property {import('lucide-react').LucideIcon} icon
 */

/** @type {Record<string, AuthActionConfig>} */
export const AUTH_ACTIONS = {
  ADD_TO_CART: {
    id: "ADD_TO_CART",
    title: "Sign in to add to bag",
    description:
      "Save this item to your bag and check out whenever you’re ready.",
    benefits: [
      "Sync your bag across devices",
      "Faster checkout with saved details",
      "Track orders in one place",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: ShoppingBag,
  },
  BUY_NOW: {
    id: "BUY_NOW",
    title: "Sign in to buy now",
    description: "Complete your purchase securely with a quick email sign-in.",
    benefits: [
      "Secure passwordless checkout",
      "Order updates by email",
      "Easy returns & support",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: CreditCard,
  },
  WISHLIST: {
    id: "WISHLIST",
    title: "Sign in to save favorites",
    description: "Keep looks you love and revisit them anytime.",
    benefits: [
      "Save unlimited favorites",
      "Get alerts on price drops",
      "Share your wishlist later",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: Heart,
  },
  VIEW_WISHLIST: {
    id: "VIEW_WISHLIST",
    title: "Sign in to view wishlist",
    description: "Your saved items are waiting — sign in to see them.",
    benefits: [
      "Access saved favorites",
      "Move items to bag in one tap",
      "Pick up where you left off",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: Heart,
  },
  VIEW_BAG: {
    id: "VIEW_BAG",
    title: "Sign in to view your bag",
    description: "Your bag is linked to your account for a seamless checkout.",
    benefits: [
      "See items you’ve added",
      "Apply coupons at checkout",
      "Checkout in fewer steps",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: ShoppingBag,
  },
  CHECKOUT: {
    id: "CHECKOUT",
    title: "Sign in to checkout",
    description: "A quick sign-in keeps your order and delivery details safe.",
    benefits: [
      "Secure payment experience",
      "Saved addresses for next time",
      "Real-time order tracking",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: Package,
  },
  PLACE_ORDER: {
    id: "PLACE_ORDER",
    title: "Sign in to place order",
    description: "Confirm your identity to place this order securely.",
    benefits: [
      "Protected checkout",
      "Order confirmation by email",
      "Easy order history access",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Cancel",
    icon: Package,
  },
  SAVE_ADDRESS: {
    id: "SAVE_ADDRESS",
    title: "Sign in to save address",
    description: "Store delivery addresses for faster future checkouts.",
    benefits: [
      "Reuse addresses next time",
      "Fewer checkout steps",
      "Accurate delivery details",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Cancel",
    icon: MapPin,
  },
  APPLY_COUPON: {
    id: "APPLY_COUPON",
    title: "Sign in to use coupons",
    description: "Coupons are linked to your account so savings stay yours.",
    benefits: [
      "Unlock member-only deals",
      "Apply offers at checkout",
      "Track coupon usage",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: Tag,
  },
  REVIEW: {
    id: "REVIEW",
    title: "Sign in to leave a review",
    description: "Share your experience to help other shoppers decide.",
    benefits: [
      "Rate products you’ve bought",
      "Help the community",
      "Build your shopper profile",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Cancel",
    icon: Star,
  },
  ASK_QUESTION: {
    id: "ASK_QUESTION",
    title: "Sign in to ask a question",
    description: "Get answers from sellers and other shoppers.",
    benefits: [
      "Ask product questions",
      "Get notified of replies",
      "Shop with more confidence",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Cancel",
    icon: MessageCircle,
  },
  FOLLOW_SELLER: {
    id: "FOLLOW_SELLER",
    title: "Sign in to follow seller",
    description: "Follow stores to discover new drops and offers.",
    benefits: [
      "Get updates from sellers you love",
      "Personalized recommendations",
      "Never miss a restock",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: Store,
  },
  VIEW_ACCOUNT: {
    id: "VIEW_ACCOUNT",
    title: "Sign in to your account",
    description: "Manage profile, orders, addresses, and more in one place.",
    benefits: [
      "Track and manage orders",
      "Update profile & preferences",
      "Secure account controls",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: User,
  },
  ORDER_HISTORY: {
    id: "ORDER_HISTORY",
    title: "Sign in to view orders",
    description: "Your order history is private and tied to your account.",
    benefits: [
      "Track deliveries",
      "Reorder favorites",
      "Download invoices",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: ClipboardList,
  },
  NOTIFICATIONS: {
    id: "NOTIFICATIONS",
    title: "Sign in for notifications",
    description: "Get order updates, offers, and alerts just for you.",
    benefits: [
      "Order & shipping alerts",
      "Personalized offers",
      "Price-drop reminders",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: Bell,
  },
  SELLER_DASHBOARD: {
    id: "SELLER_DASHBOARD",
    title: "Sign in to seller dashboard",
    description: "Seller tools are available only to authenticated accounts.",
    benefits: [
      "Manage listings & inventory",
      "Track sales & payouts",
      "Secure seller access",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Cancel",
    icon: Store,
  },
  GENERIC: {
    id: "GENERIC",
    title: "Sign in to continue",
    description: "Create a free account or sign in to unlock this feature.",
    benefits: [
      "Secure passwordless access",
      "Personalized shopping",
      "Faster checkout next time",
    ],
    primaryLabel: "Continue with Login",
    secondaryLabel: "Continue browsing",
    icon: User,
  },
};

/**
 * @param {string | AuthActionConfig} actionOrId
 * @returns {AuthActionConfig}
 */
export function resolveAuthAction(actionOrId) {
  if (!actionOrId) return AUTH_ACTIONS.GENERIC;
  if (typeof actionOrId === "string") {
    return AUTH_ACTIONS[actionOrId] || AUTH_ACTIONS.GENERIC;
  }
  return {
    ...AUTH_ACTIONS.GENERIC,
    ...actionOrId,
    id: actionOrId.id || AUTH_ACTIONS.GENERIC.id,
  };
}
