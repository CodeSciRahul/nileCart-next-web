"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DepartmentCategoryNav } from "@/components/DepartmentCategoryNav.jsx";

const POPOVER_MAX_WIDTH = 720;
const VIEWPORT_PAD = 16;

function clampPopoverLeft(triggerLeft, triggerWidth, panelWidth) {
  const vw = window.innerWidth;
  const preferred = triggerLeft;
  const maxLeft = Math.max(VIEWPORT_PAD, vw - panelWidth - VIEWPORT_PAD);
  const centered = triggerLeft + triggerWidth / 2 - panelWidth / 2;

  // Prefer left-align under the trigger; fall back to centered when it fits.
  let left = preferred;
  if (preferred + panelWidth > vw - VIEWPORT_PAD) {
    left = Math.min(Math.max(centered, VIEWPORT_PAD), maxLeft);
  }
  if (left < VIEWPORT_PAD) left = VIEWPORT_PAD;
  if (left > maxLeft) left = maxLeft;
  return left;
}

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
  const panelRef = useRef(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!isActive || !triggerRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const measured =
        panelRef.current?.offsetWidth ||
        Math.min(POPOVER_MAX_WIDTH, window.innerWidth - VIEWPORT_PAD * 2);

      setPosition({
        top: rect.bottom,
        left: clampPopoverLeft(rect.left, rect.width, measured),
        width: Math.min(POPOVER_MAX_WIDTH, window.innerWidth - VIEWPORT_PAD * 2),
      });
    };

    updatePosition();
    // Re-measure after paint so real panel width clamps correctly
    const raf = requestAnimationFrame(updatePosition);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isActive, isLoading, deptNav.categories?.length]);

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
        className="fixed z-[200] pt-2"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
        onMouseEnter={onOpen}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={panelRef}
          className="animate-in fade-in slide-in-from-top-1 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl duration-150"
        >
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
