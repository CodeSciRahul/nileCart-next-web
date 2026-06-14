import { Star } from "lucide-react";

export default function ProductReviewsSection({ product, reviews = [] }) {
  return (
    <section className="mt-20 pt-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star fill="currentColor" className="text-yellow-500" size={20} />
              <span className="text-lg font-semibold">
                {product?.rating?.average}
              </span>
            </div>
            <span className="text-brand-gray">
              Based on {product?.rating?.count} reviews
            </span>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-2xl border bg-brand-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream font-semibold text-brand-amber">
                    {review?.user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review?.user?.name}</h4>
                    {review?.isVerifiedPurchase && (
                      <span className="text-xs text-green-600">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= review.rating ? "currentColor" : "none"}
                      className={
                        star <= review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <h5 className="mt-4 font-semibold">{review.title}</h5>
              <p className="mt-2 text-brand-gray">{review.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 py-12 text-center">
          <h3 className="text-lg font-semibold">No Reviews Yet</h3>
          <p className="mt-2 text-brand-gray">
            Be the first customer to review this product.
          </p>
        </div>
      )}
    </section>
  );
}
