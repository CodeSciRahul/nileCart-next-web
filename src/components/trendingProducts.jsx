
import { Heart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Floral Summer Dress",
    price: 1499,
    originalPrice: 2499,
    rating: 4.8,
    image:
      "https://img105.savana.com/v1/51fd5601c16b49e99a1ed4d35bf76f33_w360.webp",
  },
  {
    id: 2,
    title: "Casual Amber Top",
    price: 999,
    originalPrice: 1699,
    rating: 4.7,
    image:
      "https://img105.savana.com/v1/2e2992df39904be6be0b37fa12f49855_w360.webp",
  },
  {
    id: 3,
    title: "Wide Leg Bottom",
    price: 1299,
    originalPrice: 1999,
    rating: 4.9,
    image:
      "https://img105.savana.com/v1/d8eece4486724969bded3da88b84098a_w360.webp",
  },
  {
    id: 4,
    title: "Premium Hand Bag",
    price: 1799,
    originalPrice: 2999,
    rating: 4.8,
    image:
      "https://img105.savana.com/v1/c4d729bdfaa14786986463f4880b655a_w360.webp",
  },
];

const TrendingProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-white via-brand-cream/40 to-brand-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="text-brand-amber font-semibold tracking-[4px] uppercase">
            Fashion Picks
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-black text-foreground">
            Trending Products
          </h2>

          <p className="mt-4 text-brand-gray max-w-2xl mx-auto">
            Discover the most loved styles curated specially for modern women.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                  group
                  bg-brand-white
                  rounded-[28px]
                  overflow-hidden
                  shadow-lg
                  hover:shadow-2xl
                  transition-all
                  duration-500
                  hover:-translate-y-2
                "
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="
                      h-[320px]
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                />

                {/* Trending Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-amber text-foreground text-xs px-3 py-2 rounded-full font-semibold">
                    🔥 Trending
                  </span>
                </div>

                {/* Wishlist */}
                <button
                  className="
                      absolute
                      top-4
                      right-4
                      h-10
                      w-10
                      rounded-full
                      bg-brand-white/90
                      backdrop-blur-md
                      flex
                      items-center
                      justify-center
                      shadow-md
                      hover:bg-brand-amber
                      hover:text-foreground
                      transition
                    "
                >
                  <Heart size={18} />
                </button>

                {/* Hover Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/40
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition
                  "
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1 text-brand-amber mb-2">
                  <Star size={15} fill="currentColor" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>

                <h3 className="font-semibold text-foreground line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-brand-amber">
                    ₹{product.price}
                  </span>

                  <span className="text-brand-gray line-through text-sm">
                    ₹{product.originalPrice}
                  </span>
                </div>

                <button
                  className="
                      w-full
                      mt-4
                      bg-gradient-to-r
                      from-brand-amber
                      to-amber-400
                      text-foreground
                      py-3
                      rounded-full
                      font-semibold
                      opacity-0
                      group-hover:opacity-100
                      transition-all
                      duration-300
                    "
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <button
            className="
                px-10
                py-4
                rounded-full
                bg-brand-white
                border-2
                border-brand-amber/30
                text-brand-amber
                font-semibold
                hover:bg-brand-amber
                hover:text-foreground
                transition
              "
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
