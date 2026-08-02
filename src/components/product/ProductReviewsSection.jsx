import { Star } from "lucide-react";

function Stars({ value = 0, size = 14 }) {
  const rating = Math.round(Number(value) || 0);
  return (
    <div className="flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? "currentColor" : "none"}
          className={
            star <= rating ? "text-brand-amber" : "text-brand-amber/25"
          }
        />
      ))}
    </div>
  );
}

export default function ProductReviewsSection({ product, reviews = [] }) {
  const average = Number(product?.rating?.average) || 0;
  const count = Number(product?.rating?.count) || 0;

  return (
    <section
      id="reviews"
      className="scroll-mt-28 border-t border-brand-amber/15 py-12 sm:py-16"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">
            Ratings & reviews
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Customer Reviews
          </h2>
        </div>

        <div className="flex items-center gap-3 border border-brand-amber/20 bg-brand-cream/40 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Star size={20} fill="currentColor" className="text-brand-amber" />
            <span className="text-2xl font-black tabular-nums">
              {average.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-brand-gray">
            <p className="font-semibold text-foreground">
              {count} {count === 1 ? "rating" : "ratings"}
            </p>
            <p>Verified buyers</p>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="border border-brand-amber/20 bg-brand-white p-5 transition hover:border-brand-amber/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center bg-brand-cream text-sm font-bold text-foreground ring-1 ring-brand-amber/25">
                    {review?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      {review?.user?.name || "Customer"}
                    </h4>
                    {review?.isVerifiedPurchase && (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <Stars value={review.rating} />
              </div>

              {review.title && (
                <h5 className="mt-4 text-sm font-bold tracking-tight">
                  {review.title}
                </h5>
              )}
              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                  {review.comment}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-brand-amber/30 bg-brand-cream/20 px-6 py-14 text-center">
          <h3 className="text-lg font-bold">No reviews yet</h3>
          <p className="mt-2 text-sm text-brand-gray">
            Be the first to share your experience with this product.
          </p>
        </div>
      )}
    </section>
  );
}
