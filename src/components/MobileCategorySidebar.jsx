"use client";

import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Dumbbell,
  Gem,
  Home,
  Shirt,
  Sparkles,
  Watch,
} from "lucide-react";
import { DEPARTMENT_LABELS, DEPARTMENT_ORDER } from "@/constant/index.js";
import { getDepartmentNav, getCategoryImageSrc } from "@/lib/categoryHelpers.js";

const DEPARTMENT_ICONS = {
  men: Shirt,
  women: Sparkles,
  kids: Baby,
  sports: Dumbbell,
  beauty: Gem,
  home: Home,
  accessories: Watch,
};

const TILE_GRADIENTS = [
  "from-brand-cream via-amber-100 to-brand-amber/40",
  "from-amber-50 via-brand-cream to-amber-200",
  "from-yellow-50 via-brand-cream to-brand-amber/50",
];

function CategoryTile({ item, index, onNavigate }) {
  const gradient = TILE_GRADIENTS[index % TILE_GRADIENTS.length];
  const initial = item.name?.charAt(0)?.toUpperCase() || "?";
  const imageSrc = getCategoryImageSrc(item.image);

  return (
    <Link
      href={`/shop/${item.slug}`}
      onClick={onNavigate}
      className="group flex flex-col items-center gap-2 rounded-xl p-2 transition-colors hover:bg-brand-cream/60 active:scale-[0.98]"
    >
      <div
        className={`flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${gradient} shadow-sm ring-1 ring-brand-amber/15 transition-transform group-hover:scale-105`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-brand-amber">{initial}</span>
        )}
      </div>
      <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-foreground">
        {item.name}
      </span>
    </Link>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 animate-pulse">
      <div className="h-5 w-32 rounded bg-brand-cream" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2">
            <div className="h-[52px] w-[52px] rounded-full bg-brand-cream" />
            <div className="h-3 w-12 rounded bg-brand-cream" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarContent({ categories, departmentLabel, departmentSlug, onNavigate }) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-brand-amber">
          <Sparkles size={20} />
        </span>
        <p className="text-sm font-semibold text-foreground">Coming soon</p>
        <p className="mt-1 text-xs text-brand-gray">
          New collections for {departmentLabel} are on the way.
        </p>
        <Link
          href={`/shop/${departmentSlug}`}
          onClick={onNavigate}
          className="mt-4 text-sm font-semibold text-brand-amber"
        >
          Browse {departmentLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-brand-amber/10 bg-brand-white/95 px-4 py-3 backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gray">
          {departmentLabel}
        </p>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-foreground">Shop by category</h3>
          <Link
            href={`/shop/${departmentSlug}`}
            onClick={onNavigate}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-amber"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="space-y-6 px-4 py-4">
        {categories.map((category) => {
          const tiles =
            category.subcategories?.length > 0
              ? category.subcategories
              : [category];

          return (
            <section key={category._id}>
              <Link
                href={`/shop/${category.slug}`}
                onClick={onNavigate}
                className="mb-3 flex items-center gap-2 border-l-[3px] border-brand-amber pl-2.5"
              >
                <h4 className="text-sm font-bold text-foreground">{category.name}</h4>
              </Link>

              <div className="grid grid-cols-3 gap-1">
                {tiles.map((item, index) => (
                  <CategoryTile
                    key={item._id}
                    item={item}
                    index={index}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function MobileCategorySidebar({
  navDepartments = [],
  selectedKey,
  onSelectDepartment,
  onNavigate,
  isLoading = false,
}) {
  const deptNav = getDepartmentNav(
    navDepartments,
    selectedKey,
    DEPARTMENT_LABELS[selectedKey]
  );

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[92px] shrink-0 flex-col border-r border-brand-amber/15 bg-brand-cream/40">
        <div className="flex-1 overflow-y-auto py-2">
          {DEPARTMENT_ORDER.map((key) => {
            const label = DEPARTMENT_LABELS[key];
            const Icon = DEPARTMENT_ICONS[key] || Sparkles;
            const isActive = selectedKey === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDepartment(key)}
                className={`relative flex w-full flex-col items-center gap-1.5 px-1 py-3 transition-colors ${
                  isActive
                    ? "bg-brand-white text-brand-amber"
                    : "text-brand-gray hover:bg-brand-white/60 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-brand-amber" />
                )}
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-brand-amber/20 text-brand-amber"
                      : "bg-brand-white/80 text-brand-gray"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span
                  className={`max-w-[72px] text-center text-[10px] leading-tight ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-brand-white">
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <SidebarContent
            categories={deptNav.categories}
            departmentLabel={deptNav.label}
            departmentSlug={deptNav.slug || selectedKey}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}
