"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DepartmentCategoryNav } from "@/components/DepartmentCategoryNav.jsx";

export function DepartmentNavItem({
  deptKey,
  label,
  shopHref,
  deptNav,
  isActive,
  isPinned,
  onOpen,
  onClose,
  onToggleClick,
  onNavigate,
  isLoading,
}) {
  const triggerRef = useRef(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!isActive || !triggerRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isActive]);

  const handleMouseLeave = () => {
    if (!isPinned) onClose();
  };

  const popover =
    isActive &&
    position &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        data-dept-popover=""
        className="fixed z-[200] -translate-x-1/2 pt-2"
        style={{ top: position.top, left: position.left }}
        onMouseEnter={onOpen}
        onMouseLeave={handleMouseLeave}
      >
        <div className="animate-in fade-in slide-in-from-top-1 w-[min(92vw,720px)] overflow-hidden rounded-2xl border border-brand-amber/20 bg-brand-white shadow-2xl shadow-brand-amber/10 backdrop-blur-md duration-200">
          <DepartmentCategoryNav
            categories={deptNav.categories}
            departmentLabel={label}
            departmentSlug={deptNav.slug || deptKey}
            onNavigate={onNavigate}
            variant="popover"
            isLoading={isLoading}
          />
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div
        ref={triggerRef}
        data-dept-nav=""
        className="relative shrink-0"
        onMouseEnter={onOpen}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={shopHref}
          onClick={onToggleClick}
          className={`flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-1.5 text-xs font-semibold tracking-wide transition lg:px-2 lg:text-sm ${
            isActive
              ? "bg-brand-amber text-foreground shadow-sm"
              : "text-foreground hover:bg-brand-cream hover:text-brand-amber"
          }`}
        >
          {label}
          <ChevronDown
            size={13}
            className={`shrink-0 transition-transform ${isActive ? "rotate-180" : ""}`}
          />
        </Link>
      </div>
      {popover}
    </>
  );
}
