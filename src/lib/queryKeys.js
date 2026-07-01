export const queryKeys = {
  products: {
    all: ["products"],
    list: (params) => ["products", "list", params],
    detail: (slug) => ["products", "detail", slug],
  },
  reviews: {
    byProduct: (productId) => ["reviews", productId],
  },
  cart: ["cart"],
  wishlist: ["wishlist"],
  addresses: ["addresses"],
  profile: ["profile"],
  orders: (params) => ["orders", params],
  payment: {
    config: ["payment", "config"],
  },
  coupons: {
    active: ["coupons", "active"],
  },
};
