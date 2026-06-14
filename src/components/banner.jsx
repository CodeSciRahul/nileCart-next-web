"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    title: "Summer Collection 2026",
    subtitle: "Up To 70% OFF",
    description:
      "Discover trendy dresses, co-ords and accessories crafted for modern women.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200",
  },
  {
    title: "Golden Edit",
    subtitle: "Buy 2 Get 1 Free",
    description:
      "Fresh styles designed to make every day feel special.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200",
  },
  {
    title: "New Arrivals",
    subtitle: "Just Dropped",
    description:
      "Explore this week's most loved fashion pieces.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[650px]">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ${
              current === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-brand-amber/40 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-xl text-white">
                  <span className="inline-block px-4 py-2 rounded-full bg-brand-amber/30 backdrop-blur-md text-sm font-medium border border-brand-amber">
                    ✨ Exclusive Fashion Sale
                  </span>

                  <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
                    {banner.title}
                  </h1>

                  <h2 className="text-brand-cream text-3xl md:text-5xl font-bold mt-3">
                    {banner.subtitle}
                  </h2>

                  <p className="mt-6 text-lg text-brand-cream">
                    {banner.description}
                  </p>

                  <div className="flex gap-4 mt-8">
                    <button className="bg-brand-amber hover:bg-brand-amber/90 text-foreground px-8 py-4 rounded-full font-semibold transition">
                      Shop Now
                    </button>

                    <button className="border border-white px-8 py-4 rounded-full hover:bg-brand-white hover:text-foreground transition">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md p-3 rounded-full text-white"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md p-3 rounded-full text-white"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 ${
                current === index
                  ? "w-10 h-3 bg-brand-amber rounded-full"
                  : "w-3 h-3 bg-white/60 rounded-full"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
