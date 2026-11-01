"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80";

function resolveHref(banner) {
  return banner?.ctaHref || banner?.ctaLink || "/collections";
}

function resolveBannerImage(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

function HeroSlide({ banner, priority = false, isActive = false }) {
  const href = resolveHref(banner);
  const desktopImage =
    resolveBannerImage(banner?.image) || FALLBACK_HERO;
  const mobileImage =
    resolveBannerImage(banner?.mobileImage) || desktopImage;

  const imageContent = (
    <div className="relative h-full w-full overflow-hidden">
      <OptimizedImage
        src={desktopImage}
        alt={banner?.title || "Hero banner"}
        fill
        sizes="100vw"
        priority={priority}
        quality={85}
        className="hero-ken-burns hidden object-cover md:block"
      />
      <OptimizedImage
        src={mobileImage}
        alt={banner?.title || "Hero banner"}
        fill
        sizes="100vw"
        priority={priority}
        quality={80}
        className="hero-ken-burns object-cover md:hidden"
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        tabIndex={isActive ? 0 : -1}
        className="block h-full w-full cursor-pointer focus:outline-none"
        aria-label={banner?.title || "Explore banner"}
      >
        {imageContent}
      </Link>
    );
  }

  return imageContent;
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
            title: "Trending Fast-Fashion Edit",
            description:
              "Daily new drops, street styles, and weekend essentials.",
            ctaText: "Shop the Drop",
            ctaHref: "/collections",
            image: FALLBACK_HERO,
          },
        ];

  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const active = current % effectiveSlides.length;

  useEffect(() => {
    if (effectiveSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [effectiveSlides.length]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (diffX > 50) {
      // Swipe right -> previous slide
      setCurrent(
        (prev) => (prev + effectiveSlides.length - 1) % effectiveSlides.length
      );
    } else if (diffX < -50) {
      // Swipe left -> next slide
      setCurrent((prev) => (prev + 1) % effectiveSlides.length);
    }
    setTouchStartX(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-brand-ink">
      <div
        className="relative h-[calc(100vh-80px)] md:h-[calc(100vh-85px)] h-[calc(100dvh-80px)] md:h-[calc(100dvh-85px)] min-h-[500px] w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {effectiveSlides.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active === index
                ? "z-[1] opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            aria-hidden={active !== index}
          >
            <HeroSlide
              banner={banner}
              priority={index === 0}
              isActive={active === index}
            />
          </div>
        ))}

        {effectiveSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {effectiveSlides.map((banner, index) => (
              <button
                key={banner._id || index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-0.5 transition-all duration-500 ${
                  active === index
                    ? "w-10 bg-brand-amber"
                    : "w-5 bg-brand-white/45 hover:bg-brand-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;

