import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { getProductImageUrl } from "@/lib/productHelpers";

const ProductCard = ({ product }) => {
  const imageUrl = getProductImageUrl(product);

  return (
    <Link
      href={`/product/${product?.slug}?cat=${product?.category?._id || ""}`}
      className="group block cursor-pointer overflow-hidden rounded-3xl bg-brand-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || ""}
          alt={product?.title || ""}
          className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {product?.discountPercent > 0 && (
          <div className="absolute top-4 left-4 rounded-full bg-brand-amber px-3 py-1 text-xs font-bold text-foreground">
            {product?.discountPercent}% OFF
          </div>
        )}

        <span
          className="absolute top-4 right-4 rounded-full bg-brand-white/90 p-2 shadow-md backdrop-blur-md"
          aria-hidden
        >
          <Heart size={18} />
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase text-brand-gray">
          {product?.category?.name}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-[48px] font-semibold text-foreground">
          {product?.title}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <Star size={14} fill="currentColor" className="text-brand-amber" />
          <span className="text-sm text-brand-gray">{product?.rating}</span>
          <span className="text-xs text-brand-gray/70">
            ({product?.ratingCount})
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-brand-amber">
            ₹{product?.price}
          </span>
          <span className="text-sm text-brand-gray line-through">
            ₹{product?.mrp}
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-green-600">
          Save ₹{product?.mrp - product?.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
