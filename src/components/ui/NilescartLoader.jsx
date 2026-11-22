"use client";

export default function NilescartLoader({ text = "Loading contemporary pieces..." }) {
  const letters = "nilescart".split("");

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 select-none" role="status" aria-live="polite">
      {/* Animated Brand Wordmark with Staggered Wave */}
      <div className="inline-flex items-center gap-[1px] sm:gap-0.5">
        {letters.map((char, i) => (
          <span
            key={i}
            className="text-2xl sm:text-3xl font-black lowercase tracking-tight inline-block animate-nilescart-wave"
            style={{
              animationDelay: `${i * 85}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Shimmer Ambient Bar */}
      <div className="relative mt-3 w-28 sm:w-36 h-1 bg-neutral-200 overflow-hidden rounded-full">
        <div className="absolute inset-y-0 w-14 bg-black rounded-full animate-nilescart-bar" />
      </div>

      {/* Subtitle / Status */}
      {text && (
        <p className="mt-2.5 text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-neutral-400">
          {text}
        </p>
      )}
    </div>
  );
}

