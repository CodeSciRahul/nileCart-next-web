"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";

const ProductLightbox = dynamic(
  () => import("@/components/product/ProductLightbox"),
  { ssr: false }
);

/**
 * Premium PDP gallery: vertical thumbs (desktop), swipe (mobile),
 * hover zoom, lightbox, indicators, video support.
 */
export default function ProductGallery({ media = [], title = "Product" }) {
  const items = media.filter((m) => m?.src);
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const touchRef = useRef({ x: 0, y: 0 });
  const mainRef = useRef(null);

  const mediaKey = items.map((i) => i.src).join("|");
  const [prevMediaKey, setPrevMediaKey] = useState(mediaKey);
  if (mediaKey !== prevMediaKey) {
    setPrevMediaKey(mediaKey);
    setActive(0);
  }

  const safeIndex = items.length ? Math.min(active, items.length - 1) : 0;
  const current = items[safeIndex];

  const go = (dir) => {
    if (items.length < 2) return;
    setActive((prev) => (prev + dir + items.length) % items.length);
  };

  const onMouseMove = (e) => {
    if (!mainRef.current || current?.type === "video") return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const onTouchStart = (e) => {
    touchRef.current.x = e.touches[0].clientX;
    touchRef.current.y = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) go(-1);
    else go(1);
  };

  if (!items.length) {
    return (
      <div className="flex aspect-3/4 w-full items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {/* Desktop vertical thumbnails */}
      <div
        className="hidden max-h-[min(72vh,720px)] w-16 shrink-0 flex-col gap-2 overflow-y-auto overscroll-contain scroll-smooth lg:flex"
        role="tablist"
        aria-label="Product thumbnails"
      >
        {items.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            aria-label={`Thumbnail ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square w-full shrink-0 overflow-hidden border-2 bg-neutral-100 transition",
              i === safeIndex
                ? "border-black shadow-sm"
                : "border-transparent opacity-80 hover:opacity-100"
            )}
          >
            {item.type === "video" ? (
              <span className="flex size-full items-center justify-center bg-foreground/10">
                <Play size={14} className="text-foreground" />
              </span>
            ) : (
              <OptimizedImage
                src={item.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main stage */}
      <div className="relative min-w-0 flex-1">
        <div
          ref={mainRef}
          className="group relative aspect-3/4 w-full overflow-hidden border border-neutral-200 bg-neutral-100"
          onMouseEnter={() => current?.type !== "video" && setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {current?.type === "video" ? (
            <video
              key={current.src}
              src={current.src}
              controls
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <OptimizedImage
              src={current?.src}
              alt={`${title} — image ${safeIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={safeIndex === 0}
              quality={85}
              className={cn(
                "object-cover transition-transform duration-200 ease-out will-change-transform",
                zooming ? "scale-[1.85] cursor-zoom-in" : "scale-100"
              )}
              style={{ transformOrigin: origin }}
            />
          )}

          {/* Counter */}
          {items.length > 1 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-foreground/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
              {safeIndex + 1}/{items.length}
            </span>
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open fullscreen gallery"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-black shadow-sm ring-1 ring-neutral-300 transition hover:bg-black hover:text-white"
          >
            <Expand size={14} />
            View
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm ring-1 ring-neutral-200 transition hover:bg-black hover:text-white lg:flex"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm ring-1 ring-neutral-200 transition hover:bg-black hover:text-white lg:flex"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Mobile horizontal thumbs */}
        {items.length > 1 && (
          <div
            className="mt-3 flex gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 lg:hidden"
            role="tablist"
            aria-label="Product thumbnails"
          >
            {items.map((item, i) => (
              <button
                key={`m-${item.src}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === safeIndex}
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-[68px] w-[68px] shrink-0 overflow-hidden border-2 bg-neutral-100 transition",
                  i === safeIndex
                    ? "border-black"
                    : "border-transparent opacity-75"
                )}
              >
                {item.type === "video" ? (
                  <span className="flex size-full items-center justify-center">
                    <Play size={14} />
                  </span>
                ) : (
                  <OptimizedImage
                    src={item.src}
                    alt=""
                    fill
                    sizes="68px"
                    className="object-cover"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators (mobile) */}
        {items.length > 1 && items.length <= 8 && (
          <div className="mt-2 flex justify-center gap-1.5 lg:hidden">
            {items.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === safeIndex
                    ? "w-5 bg-black"
                    : "w-1.5 bg-neutral-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <ProductLightbox
        media={items}
        index={safeIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActive}
        title={title}
      />
    </div>
  );
}
