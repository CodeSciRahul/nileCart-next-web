import { Suspense } from "react";
import Header from "@/components/header";
import SearchPage from "@/components/search/SearchPage.jsx";

export const metadata = {
  title: "Search",
  description: "Search products at NileCart.",
};

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-brand-cream" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-3xl bg-brand-cream" />
        ))}
      </div>
    </div>
  );
}

export default function SearchRoutePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<SearchFallback />}>
        <SearchPage />
      </Suspense>
    </>
  );
}
