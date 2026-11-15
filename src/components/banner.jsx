"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80";

function resolveHref(banner) {
  return banner?.ctaHref || banner?.ctaLink || "/shop/all";
}

function resolveBannerImage(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

const Banner = ({ banners = [] }) => {
  const slides = Array.isArray(banners)
    ? banners.filter(
        (b) =>
          resolveBannerImage(b?.image) ||
          resolveBannerImage(b?.mobileImage)
      )
    : [];

  const effectiveSlides =
    slides.length > 0
      ? slides
      : [
          {
            title: "UP TO 50% OFF",
            subtitle: "WARM UP YOUR WARDROBE",
            ctaText: "SHOP NOW",
            ctaLink: "/shop/all",
            image: FALLBACK_HERO,
          },
        ];

  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const active = current % effectiveSlides.length;
  const activeSlide = effectiveSlides[active];

  useEffect(() => {
    if (effectiveSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % effectiveSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [effectiveSlides.length]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (diffX > 40) {
      setCurrent((prev) =>
        prev === 0 ? effectiveSlides.length - 1 : prev - 1
      );
    } else if (diffX < -40) {
      setCurrent((prev) => (prev + 1) % effectiveSlides.length);
    }
    setTouchStartX(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* Main Hero Container with Multi-Slide Transition & Mobile Touch Swipe */}
        <div
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.35/1] overflow-hidden bg-neutral-900 group select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {effectiveSlides.map((banner, index) => {
            const img =
              resolveBannerImage(banner.image) ||
              resolveBannerImage(banner.mobileImage) ||
              FALLBACK_HERO;

            return (
              <div
                key={banner._id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  active === index ? "opacity-100 z-[1]" : "opacity-0 pointer-events-none z-0"
                }`}
                aria-hidden={active !== index}
              >
                <OptimizedImage
                  src={img}
                  alt={banner.title || "Hero campaign"}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="w-full h-full object-cover object-center select-none"
                />
              </div>
            );
          })}

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-[2]" />

          {/* Central Hanging Luxury Tag matching Savana Layout */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-3 z-[3]">
            <div className="bg-white/95 backdrop-blur-md px-4 sm:px-10 py-3 sm:py-7 rounded-xl sm:rounded-2xl border-2 border-[#d4af37]/70 shadow-2xl flex flex-col items-center text-center max-w-[240px] sm:max-w-sm pointer-events-auto transition-transform hover:scale-102">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-black tracking-[0.2em] uppercase text-neutral-800">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b38b4c] fill-[#b38b4c]" />
                <span>{activeSlide?.subtitle || "WARM UP YOUR WARDROBE"}</span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b38b4c] fill-[#b38b4c]" />
              </div>
              <div className="text-xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight mt-0.5 sm:mt-1 mb-2 sm:mb-3">
                {activeSlide?.title || "UP TO 50% OFF"}
              </div>
              <Link
                href={resolveHref(activeSlide)}
                className="px-4 sm:px-8 py-1.5 sm:py-2 bg-gradient-to-r from-[#fef5db] via-[#faebca] to-[#f5dfb3] text-neutral-900 text-[10px] sm:text-sm font-extrabold rounded-full border border-[#d4af37] shadow-md hover:brightness-105 transition-all tracking-wider uppercase active:scale-95"
              >
                {activeSlide?.ctaText || "SHOP NOW"}
              </Link>
            </div>
          </div>

          {/* Left & Right Navigation Arrows */}
          {effectiveSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrent((prev) =>
                    prev === 0 ? effectiveSlides.length - 1 : prev - 1
                  )
                }
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white/85 hover:bg-white text-neutral-900 rounded-full flex items-center justify-center transition-all shadow-md z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrent((prev) => (prev + 1) % effectiveSlides.length)
                }
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white/85 hover:bg-white text-neutral-900 rounded-full flex items-center justify-center transition-all shadow-md z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Carousel Indicator Dots */}
          {effectiveSlides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {effectiveSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    active === idx
                      ? "w-6 bg-white shadow-xs"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Black Day Sale Member Banner Strip matching Screenshot 5 */}
        <Link
          href="/shop/all"
          className="w-full bg-black py-2.5 sm:py-3 px-4 text-center block cursor-pointer select-none transition-colors hover:bg-neutral-950"
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#fdd835]">
            <span>★ DAY SALE MEMBER PRICES ★</span>
            <span className="hidden sm:inline text-white">UP TO 50% OFF + 3X POINTS</span>
            <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] text-white">
              CODE: NILES20
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Banner;
