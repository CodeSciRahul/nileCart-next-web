"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function HeaderSearch({ className = "", compact = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pathname === "/search") {
      setQuery(searchParams.get("q") || "");
    }
  }, [pathname, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => router.push("/search")}
        className={`rounded-lg p-1.5 text-foreground transition hover:bg-brand-cream hover:text-brand-amber ${className}`}
        aria-label="Search products"
      >
        <Search size={22} />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`group flex w-full min-w-0 items-center gap-2 rounded-full border border-brand-amber/20 bg-brand-white/90 px-3 shadow-sm ring-1 ring-brand-amber/5 transition focus-within:border-brand-amber/50 focus-within:bg-brand-white focus-within:shadow-md focus-within:ring-brand-amber/15 sm:px-3.5 ${className}`}
      role="search"
    >
      <Search
        size={17}
        className="shrink-0 text-brand-amber/80 transition group-focus-within:text-brand-amber"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dresses, tops, bags..."
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-brand-gray/80"
        aria-label="Search products"
      />
    </form>
  );
}
