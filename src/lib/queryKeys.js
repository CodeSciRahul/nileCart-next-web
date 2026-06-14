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
  addresses: ["addresses"],
  profile: ["profile"],
};
