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
      <div className="relative w-full">
        {/* Main Hero Container with Multi-Slide Transition & Mobile Touch Swipe */}
        <div
          className="relative w-full aspect-[1376/768] overflow-hidden bg-neutral-900 group select-none touch-pan-y"
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

          {/* Directional Scrim: Darker at the bottom-left for high text readability, transparent across center & right to leave images & models fully visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent sm:bg-gradient-to-r sm:from-black/75 sm:via-black/20 sm:to-transparent pointer-events-none z-[2]" />

          {/* Hero Content: Placed at lower-left, card removed so image is fully visible */}
          <div className="absolute left-6 sm:left-12 md:left-16 bottom-8 sm:bottom-12 md:bottom-14 max-w-[85%] sm:max-w-lg md:max-w-xl text-left pointer-events-auto z-[3]">
            {activeSlide?.subtitle && (
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#fdd835] drop-shadow-md mb-1.5 sm:mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#fdd835] fill-[#fdd835]" />
                <span>{activeSlide.subtitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#fdd835] fill-[#fdd835]" />
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] drop-shadow-lg mb-3 sm:mb-5">
              {activeSlide?.title || "UP TO 50% OFF"}
            </h1>
            <Link
              href={resolveHref(activeSlide)}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-[#fdd835] hover:bg-yellow-400 text-black text-xs sm:text-sm font-black tracking-wider uppercase rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {activeSlide?.ctaText || "SHOP NOW"}
            </Link>
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
          <div className="w-full flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#fdd835]">
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
