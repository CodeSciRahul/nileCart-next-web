import Link from "next/link";

export function BrandLogo({ className = "", compact = false }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
      aria-label="NileCart home"
    >
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-amber via-amber-400 to-brand-amber shadow-md shadow-brand-amber/25 ring-1 ring-brand-amber/30 transition-transform group-hover:scale-[1.02] ${
          compact ? "h-8 w-8" : "h-9 w-9 md:h-10 md:w-10"
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={compact ? "h-5 w-5" : "h-5 w-5 md:h-6 md:w-6"}
          aria-hidden
        >
          <path
            d="M8 22V10l8-4 8 4v12l-8 4-8-4Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            className="text-foreground/90"
          />
          <path
            d="M16 6v20M8 10l8 4 8-4M8 22l8-4 8 4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            className="text-foreground/70"
          />
        </svg>
      </span>

      {!compact && (
        <span className="hidden min-w-0 flex-col leading-none sm:flex">
          <span className="bg-gradient-to-r from-brand-amber via-amber-500 to-brand-amber bg-clip-text text-lg font-black tracking-tight text-transparent md:text-xl">
            NILECART
          </span>
          <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-brand-gray xl:block">
            Fashion Store
          </span>
        </span>
      )}
    </Link>
  );
}
