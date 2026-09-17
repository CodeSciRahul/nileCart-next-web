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
  const ctaText = banner?.ctaText || "Shop the edit";
  const desktopImage =
    resolveBannerImage(banner?.image) || FALLBACK_HERO;
  const mobileImage =
    resolveBannerImage(banner?.mobileImage) || desktopImage;
  const headline =
    banner?.title || "Fashion, edited for everyday";
  const support =
    banner?.description ||
    "Editorial pieces and everyday essentials — curated under one brand.";

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
        {/* Soft legibility wash — not a badge/chip overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/35 to-brand-ink/20 md:bg-gradient-to-r md:from-brand-ink/70 md:via-brand-ink/35 md:to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] flex h-full items-end md:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:px-10 md:pb-20 md:pt-24">
          <div className="max-w-2xl text-brand-white">
            <p className="hero-enter-brand font-display text-[clamp(2.75rem,10vw,6.5rem)] font-extrabold leading-[0.92] tracking-tight">
              nilescart
            </p>

            <h1 className="hero-enter-copy mt-5 max-w-lg font-display text-xl font-semibold leading-snug text-brand-white/95 sm:text-2xl md:text-[1.65rem]">
              {headline}
            </h1>

            <p className="hero-enter-copy mt-3 max-w-md text-sm leading-relaxed text-brand-white/80 sm:text-base">
              {support}
            </p>

            <div className="hero-enter-cta mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={href}
                className="inline-flex items-center justify-center bg-brand-amber px-7 py-3.5 text-sm font-semibold tracking-wide text-brand-ink transition hover:brightness-105"
              >
                {ctaText}
              </Link>
              <Link
                href="/lookbook"
                className="inline-flex items-center justify-center border border-brand-white/55 px-7 py-3.5 text-sm font-semibold tracking-wide text-brand-white transition hover:bg-brand-white/10"
              >
                View lookbook
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
            title: "Fashion, edited for everyday",
            description:
              "Editorial pieces and everyday essentials — curated under one brand.",
            ctaText: "Explore collections",
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
    }, 6500);
    return () => clearInterval(timer);
  }, [effectiveSlides.length]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-brand-ink md:min-h-[88vh]">
      <div className="relative h-[100svh] md:h-[88vh]">
        {effectiveSlides.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
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
