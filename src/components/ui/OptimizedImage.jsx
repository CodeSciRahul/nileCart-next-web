"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const isRemoteUrl = (src) =>
  typeof src === "string" && /^https?:\/\//i.test(src);

/**
 * In local/dev, Next's image optimizer often fails on S3 (DNS64/NAT64 →
 * private-IP blocks, upstream timeouts). Serve remote URLs directly there.
 * Production still uses `/_next/image` optimization.
 */
const shouldSkipOptimizer = (src, forced) => {
  if (forced) return true;
  if (process.env.NEXT_PUBLIC_IMAGES_UNOPTIMIZED === "true") return true;
  if (process.env.NODE_ENV === "development" && isRemoteUrl(src)) return true;
  return false;
};

/**
 * Production next/image wrapper with an unoptimized fallback path.
 */
export default function OptimizedImage({
  src,
  alt = "",
  fill = false,
  width,
  height,
  sizes,
  className,
  priority = false,
  loading,
  quality = 75,
  unoptimized: unoptimizedProp = false,
  onError,
  ...rest
}) {
  const [unoptimized, setUnoptimized] = useState(() =>
    shouldSkipOptimizer(src, unoptimizedProp)
  );
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center bg-[#FFECB3] text-brand-gray",
          fill && "absolute inset-0",
          className
        )}
        aria-hidden={!alt}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
      />
    );
  }

  const handleError = (event) => {
    if (!unoptimized) {
      setUnoptimized(true);
      return;
    }
    setFailed(true);
    onError?.(event);
  };

  const common = {
    ...rest,
    src,
    alt: alt || "",
    // Avoid Next.js warning when CSS constrains only one dimension.
    className: cn(!fill && "h-auto w-auto", className),
    quality,
    priority,
    unoptimized,
    onError: handleError,
  };

  if (fill) {
    return (
      <Image
        {...common}
        alt={alt || ""}
        fill
        sizes={sizes || "100vw"}
        loading={priority ? undefined : loading || "lazy"}
      />
    );
  }

  return (
    <Image
      {...common}
      alt={alt || ""}
      width={width || 800}
      height={height || 800}
      sizes={sizes}
      loading={priority ? undefined : loading || "lazy"}
    />
  );
}
