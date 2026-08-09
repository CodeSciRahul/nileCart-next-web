"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";

function resolveHref(banner) {
  return banner?.ctaHref || banner?.ctaLink || null;
}

function resolveBannerImage(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

function BannerSlide({ banner, priority = false }) {
  const href = resolveHref(banner);
  const ctaText = banner.ctaText || "Shop Now";
  const desktopImage = resolveBannerImage(banner.image);
  const mobileImage =
    resolveBannerImage(banner.mobileImage) || desktopImage;

  const cta = href ? (
    <Link
      href={href}
      className="bg-brand-amber hover:bg-brand-amber/90 text-foreground px-8 py-4 rounded-full font-semibold transition"
    >
      {ctaText}
    </Link>
  ) : (
    <span className="bg-brand-amber text-foreground px-8 py-4 rounded-full font-semibold">
      {ctaText}
    </span>
  );

  return (
    <>
      {desktopImage && (
        <OptimizedImage
          src={desktopImage}
          alt={banner.title || "Banner"}
          fill
          sizes="100vw"
          priority={priority}
          quality={80}
          className="hidden object-cover md:block"
        />
      )}
      {mobileImage && (
        <OptimizedImage
          src={mobileImage}
          alt={banner.title || "Banner"}
          fill
          sizes="100vw"
          priority={priority}
          quality={80}
          className="object-cover md:hidden"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-brand-amber/40 to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-xl text-white">
            {banner.subtitle && (
              <span className="inline-block rounded-full border border-brand-amber bg-brand-amber/30 px-4 py-2 text-sm font-medium backdrop-blur-md">
                {banner.subtitle}
              </span>
            )}

            {banner.title && (
              <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
                {banner.title}
              </h1>
            )}

            {banner.description && (
              <p className="mt-6 text-lg text-brand-cream">{banner.description}</p>
            )}

            <div className="mt-8 flex gap-4">{cta}</div>
          </div>
        </div>
      </div>
    </>
  );
}

const Banner = ({ banners = [] }) => {
  const slides = Array.isArray(banners)
    ? banners.filter((b) => resolveBannerImage(b?.image) || resolveBannerImage(b?.mobileImage))
    : [];
  const [current, setCurrent] = useState(0);
  const active = slides.length ? current % slides.length : 0;

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const nextSlide = () => {
    setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrent((prev) => prev + Math.max(slides.length - 1, 0));
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[650px]">
        {slides.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-all duration-700 ${
              active === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <BannerSlide banner={banner} priority={index === 0} />
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-md"
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-md"
              aria-label="Next banner"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
              {slides.map((banner, index) => (
                <button
                  key={banner._id || index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  className={`transition-all duration-300 ${
                    active === index
                      ? "h-3 w-10 rounded-full bg-brand-amber"
                      : "h-3 w-3 rounded-full bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Banner;
