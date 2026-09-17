"use client";

import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  createReview,
  getReviewEligibility,
  updateReview,
} from "@/services/reviewService";

function RatingPicker({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= display;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            className="rounded p-0.5 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star
              size={22}
              fill={active ? "currentColor" : "none"}
              className={active ? "text-brand-amber" : "text-brand-amber/30"}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ProductReviewComposer({
  productId,
  onReviewSaved,
}) {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { requireAuth } = useAuthGate();

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadEligibility = useCallback(async () => {
    if (!productId || !isAuthenticated) {
      setEligibility(null);
      return;
    }

    setEligibilityLoading(true);
    try {
      const data = await getReviewEligibility(productId);
      setEligibility(data);
      const existing = data?.existingReview;
      if (existing) {
        setRating(Number(existing.rating) || 0);
        setTitle(existing.title || "");
        setComment(existing.comment || "");
      } else {
        setRating(0);
        setTitle("");
        setComment("");
      }
    } catch (error) {
      setEligibility(null);
      if (error?.status !== 401) {
        showErrorToast(error);
      }
    } finally {
      setEligibilityLoading(false);
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    loadEligibility();
  }, [authLoading, loadEligibility]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      requireAuth({ action: AUTH_ACTIONS.REVIEW });
      return;
    }

    if (!rating) {
      showErrorToast(null, "Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
        orderId: eligibility?.orderId || undefined,
      };

      const wasExisting = Boolean(eligibility?.existingReview?._id);
      let savedReview;
      if (wasExisting) {
        const data = await updateReview(eligibility.existingReview._id, payload);
        savedReview = data?.review;
        showSuccessToast("Review updated");
      } else {
        const data = await createReview(payload);
        savedReview = data?.review;
        showSuccessToast("Review submitted");
      }

      const reviewForList = {
        ...(savedReview || {}),
        user: savedReview?.user?.name
          ? savedReview.user
          : {
              _id: user?._id,
              name: user?.name || "You",
              avatar: user?.avatar,
            },
        isVerifiedPurchase: true,
      };

      onReviewSaved?.(reviewForList, {
        isNew: !wasExisting,
        previousRating: wasExisting
          ? Number(eligibility.existingReview.rating) || 0
          : null,
      });
      await loadEligibility();
    } catch (error) {
      if (error?.status === 401) {
        requireAuth({ action: AUTH_ACTIONS.REVIEW });
      } else {
        showErrorToast(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (isAuthenticated && eligibilityLoading && !eligibility)) {
    return (
      <div className="mb-8 border border-brand-amber/20 bg-brand-cream/20 px-5 py-4 text-sm text-brand-gray">
        Checking review eligibility…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mb-8 flex flex-col gap-3 border border-brand-amber/20 bg-brand-cream/30 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">Write a review</p>
          <p className="mt-1 text-sm text-brand-gray">
            Sign in to leave a review after your order is delivered.
          </p>
        </div>
        <button
          type="button"
          onClick={() => requireAuth({ action: AUTH_ACTIONS.REVIEW })}
          className="shrink-0 bg-foreground px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-white transition hover:bg-foreground/90"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (!eligibility?.hasPurchased) {
    return (
      <div className="mb-8 border border-brand-amber/20 bg-brand-cream/20 px-5 py-5">
        <p className="text-sm font-bold text-foreground">Write a review</p>
        <p className="mt-1 text-sm text-brand-gray">
          Only customers who purchased and received this product can leave a
          review.
        </p>
      </div>
    );
  }

  const isEditing = Boolean(eligibility?.existingReview);

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 border border-brand-amber/20 bg-brand-cream/20 p-5 sm:p-6"
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">
          Verified purchase
        </p>
        <h3 className="mt-1 text-lg font-bold tracking-tight">
          {isEditing ? "Update your review" : "Share your experience"}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-gray">
            Your rating
          </label>
          <RatingPicker
            value={rating}
            onChange={setRating}
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="review-title"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-gray"
          >
            Title <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            id="review-title"
            type="text"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            placeholder="Sum up your experience"
            className="w-full border border-brand-amber/25 bg-brand-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-amber disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-gray"
          >
            Review <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            placeholder="What did you like or dislike?"
            className="w-full resize-y border border-brand-amber/25 bg-brand-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-amber disabled:opacity-60"
          />
          <p className="mt-1 text-right text-[11px] text-brand-gray">
            {comment.length}/1000
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !rating}
          className="bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-white transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving…"
            : isEditing
              ? "Update review"
              : "Submit review"}
        </button>
      </div>
    </form>
  );
}
