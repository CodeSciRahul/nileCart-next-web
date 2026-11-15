"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Camera } from "lucide-react";

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.compact] Icon that navigates to /search
 * @param {boolean} [props.alwaysExpanded] Kept for drawer callers; input is always shown
 */
export function HeaderSearch({
  className = "",
  compact = false,
  alwaysExpanded: _alwaysExpanded = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery =
    pathname === "/search" ? searchParams.get("q") || "" : null;

  const [query, setQuery] = useState(() => urlQuery ?? "");
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (urlQuery !== null && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => router.push("/search")}
        className={`rounded-full p-2 text-black transition hover:bg-neutral-100 ${className}`}
        aria-label="Search products"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`group relative flex w-full max-w-md items-center rounded-full border border-neutral-300 bg-white py-1 pl-4 pr-1.5 shadow-xs transition-colors hover:border-neutral-400 focus-within:border-black ${className}`}
      role="search"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tops 🔥"
        className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 outline-none placeholder:text-neutral-500 font-normal"
        aria-label="Search products"
      />
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => router.push("/search")}
          className="p-1 text-neutral-500 hover:text-black transition-colors"
          title="Search by image"
          aria-label="Search by image"
        >
          <Camera className="w-4 h-4" />
        </button>
        <button
          type="submit"
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
          aria-label="Submit search"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </form>
  );
}
