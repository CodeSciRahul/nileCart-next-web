"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

function HeroSlide({ banner, priority = false }) {
  const href = resolveHref(banner);
  const ctaText = banner?.ctaText || "Shop Now";
  const desktopImage =
    resolveBannerImage(banner?.image) || FALLBACK_HERO;
  const mobileImage =
    resolveBannerImage(banner?.mobileImage) || desktopImage;
  const headline =
    banner?.title || "Fresh Drops & Trending Fits";
  const support =
    banner?.description ||
    "Curated fast-fashion styles, everyday essentials, and new season arrivals.";

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={desktopImage}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          quality={85}
          className="hero-ken-burns hidden object-cover md:block"
        />
        <OptimizedImage
          src={mobileImage}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          quality={80}
          className="hero-ken-burns object-cover md:hidden"
        />
        {/* Soft legibility wash */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/75 md:via-black/35 md:to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] flex h-full items-end md:items-center">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-16 sm:px-6 md:pb-12 md:pt-12">
          <div className="max-w-xl text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
              ⚡ Up to 70% Off • Live Now
            </span>

            <h1 className="hero-enter-copy mt-3 font-display text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
              {headline}
            </h1>

            <p className="hero-enter-copy mt-2 line-clamp-2 max-w-md text-xs leading-relaxed text-white/85 sm:text-sm">
              {support}
            </p>

            <div className="hero-enter-cta mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href={href}
                className="inline-flex items-center justify-center rounded-none bg-brand-amber px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:brightness-110 active:scale-95"
              >
                {ctaText}
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center rounded-none border border-white/60 bg-black/30 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
              >
                Explore All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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
  const active = current % effectiveSlides.length;

  useEffect(() => {
    if (effectiveSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [effectiveSlides.length]);

  return (
    <section className="relative overflow-hidden bg-brand-ink">
      <div className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px]">
        {effectiveSlides.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={active !== index}
          >
            <HeroSlide banner={banner} priority={index === 0} />
          </div>
        ))}

        {/* Brand mark corner — reinforces identity without cluttering hero budget */}
        <div className="pointer-events-none absolute right-5 top-6 hidden opacity-90 sm:right-8 sm:top-8 md:block">
          <Image
            src="/brand/nilescart_icon_dark.webp"
            alt=""
            width={72}
            height={54}
            className="h-10 w-auto opacity-80"
            priority
          />
        </div>

        {effectiveSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrent((prev) => prev + effectiveSlides.length - 1)
              }
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-brand-white/30 bg-brand-ink/30 p-2.5 text-brand-white backdrop-blur-sm transition hover:bg-brand-ink/50 sm:left-5"
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => setCurrent((prev) => prev + 1)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-brand-white/30 bg-brand-ink/30 p-2.5 text-brand-white backdrop-blur-sm transition hover:bg-brand-ink/50 sm:right-5"
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>
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
          </>
        )}
      </div>
    </section>
  );
};

export default Banner;
