"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Fullscreen lightbox with keyboard nav, swipe, and pinch-to-zoom.
 */
export default function ProductLightbox({
  media = [],
  index = 0,
  open,
  onClose,
  onIndexChange,
  title = "Product image",
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const touchRef = useRef({ startX: 0, startY: 0, pin: null });
  const total = media.length;

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    resetZoom();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, index, resetZoom]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && total > 1) {
        onIndexChange((index - 1 + total) % total);
      }
      if (e.key === "ArrowRight" && total > 1) {
        onIndexChange((index + 1) % total);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, total, onClose, onIndexChange]);

  if (!open || !media[index]) return null;

  const item = media[index];

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current.pin = Math.hypot(dx, dy);
      return;
    }
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && touchRef.current.pin) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const next = Math.min(4, Math.max(1, dist / touchRef.current.pin));
      setScale(next);
      return;
    }
  };

  const onTouchEnd = (e) => {
    if (touchRef.current.pin) {
      touchRef.current.pin = null;
      return;
    }
    if (scale > 1.05) return;

    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    if (Math.abs(dx) < 50 || total < 2) return;
    if (dx > 0) onIndexChange((index - 1 + total) % total);
    else onIndexChange((index + 1) % total);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product image gallery"
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between px-4 py-3 text-brand-white">
        <p className="text-sm font-medium tabular-nums">
          {index + 1} / {total}
        </p>
        <div className="flex items-center gap-2">
          {scale > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/20 hover:bg-white/10"
            >
              Reset zoom
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="rounded-full p-2 text-white/90 transition hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {item.type === "video" ? (
          <video
            key={item.src}
            src={item.src}
            controls
            playsInline
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <img
            src={item.src}
            alt={`${title} ${index + 1}`}
            draggable={false}
            className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            }}
          />
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => onIndexChange((index - 1 + total) % total)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur-md transition hover:bg-white/25"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => onIndexChange((index + 1) % total)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur-md transition hover:bg-white/25"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {media.map((m, i) => (
            <button
              key={`${m.src}-${i}`}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-md ring-2 transition",
                i === index
                  ? "ring-brand-amber"
                  : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              {m.type === "video" ? (
                <div className="flex size-full items-center justify-center bg-neutral-800 text-[10px] text-white">
                  VIDEO
                </div>
              ) : (
                <img
                  src={m.src}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <p className="pb-4 text-center text-[11px] text-white/50">
        <ZoomIn className="mr-1 inline size-3" />
        Pinch to zoom · Swipe to navigate · Esc to close
      </p>
    </div>
  );
}
