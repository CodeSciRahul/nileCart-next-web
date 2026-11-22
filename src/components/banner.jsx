"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";

function resolveHref(banner, section) {
  return (
    banner?.ctaHref ||
    banner?.ctaLink ||
    banner?.link ||
    section?.ctaLink ||
    section?.link ||
    "/shop/all"
  );
}

function resolveBannerImage(image) {
  if (!image) return null;
  if (typeof image === "string") return image.trim() || null;
  return image.url || null;
}

const Banner = ({ banners = [], section = null }) => {
  const slides = Array.isArray(banners)
    ? banners.filter(
        (b) =>
          resolveBannerImage(b?.image) ||
          resolveBannerImage(b?.mobileImage) ||
          b?.ctaLink ||
          b?.ctaHref
      )
    : [];

  const defaultSlide = {
    ctaLink: section?.ctaLink || "/shop/all",
    image:
      (typeof section?.image === "string" ? section.image : section?.image?.url) ||
      null,
  };

  const effectiveSlides =
    slides.length > 0
      ? slides
      : [defaultSlide];

  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const active = current % effectiveSlides.length;

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

  if (section && section.isActive === false) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full">
        {/* Main Hero Container with Edge-to-Edge Uncropped Frame & Touch Swipe */}
        <div
          className="relative w-full aspect-[1376/768] overflow-hidden bg-neutral-900 group select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {effectiveSlides.map((banner, index) => {
            const img =
              resolveBannerImage(banner.image) ||
              resolveBannerImage(banner.mobileImage);

            const href = resolveHref(banner, section);

            return (
              <div
                key={banner._id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  active === index ? "opacity-100 z-[1]" : "opacity-0 pointer-events-none z-0"
                }`}
                aria-hidden={active !== index}
              >
                <Link
                  href={href}
                  className="relative block w-full h-full cursor-pointer select-none"
                  aria-label="Hero banner link"
                >
                  {img ? (
                    <OptimizedImage
                      src={img}
                      alt="Hero banner"
                      fill
                      sizes="100vw"
                      priority={index === 0}
                      className="w-full h-full object-cover object-center select-none"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-400 p-6 text-center select-none">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-3 shadow-inner">
                        <ImagePlus className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-300 stroke-[1.5]" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                        Hero Banner Image Not Set
                      </p>
                      <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 max-w-sm">
                        Upload banner image in Dashboard &rarr; Banners. Click anywhere to test redirect link ({href}).
                      </p>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}

          {/* Left & Right Navigation Arrows */}
          {effectiveSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent((prev) =>
                    prev === 0 ? effectiveSlides.length - 1 : prev - 1
                  );
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white/85 hover:bg-white text-neutral-900 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent((prev) => (prev + 1) % effectiveSlides.length);
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white/85 hover:bg-white text-neutral-900 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Carousel Indicator Dots */}
          {effectiveSlides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 pointer-events-auto">
              {effectiveSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrent(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
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

        {/* Black Day Sale Member Banner Strip */}
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
