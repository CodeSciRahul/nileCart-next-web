"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Generate visible page numbers with ellipsis.
 */
function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= half + 1) {
    start = 2;
    end = Math.min(totalPages - 1, maxVisible - 1);
  } else if (currentPage >= totalPages - half) {
    start = Math.max(2, totalPages - (maxVisible - 2));
    end = totalPages - 1;
  }

  pages.push(1);
  if (start > 2) {
    pages.push("ellipsis-start");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);
  return pages;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = null,
  onPageChange,
  disabled = false,
  className = "",
  showSummary = true,
}) {
  const page = Math.max(1, Number(currentPage) || 1);
  const pages = Math.max(1, Number(totalPages) || 1);

  const pageNumbers = useMemo(() => getPageNumbers(page, pages), [page, pages]);

  if (pages <= 1 && !totalItems) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-6 select-none ${className}`}
    >
      {showSummary && totalItems != null && (
        <p className="text-xs sm:text-sm text-neutral-500 order-2 sm:order-1">
          Showing page <span className="font-bold text-black">{page}</span> of{" "}
          <span className="font-bold text-black">{pages}</span> (
          <span className="font-semibold text-black">{totalItems}</span> total items)
        </p>
      )}

      {pages > 1 && (
        <div className="flex items-center gap-1.5 order-1 sm:order-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || disabled}
            aria-label="Go to previous page"
            className="inline-flex items-center justify-center gap-1 h-9 px-3 text-xs sm:text-sm font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Desktop Numbered Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((p, idx) => {
              if (typeof p === "string") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-9 h-9 flex items-center justify-center text-neutral-400"
                    aria-hidden
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                );
              }

              const isCurrent = p === page;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  disabled={disabled}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`w-9 h-9 flex items-center justify-center text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                    isCurrent
                      ? "bg-black text-[#fdd835] shadow-xs"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Mobile Current Indicator */}
          <span className="sm:hidden px-3 text-xs font-bold text-neutral-800">
            {page} / {pages}
          </span>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages || disabled}
            aria-label="Go to next page"
            className="inline-flex items-center justify-center gap-1 h-9 px-3 text-xs sm:text-sm font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
}

export default Pagination;

