"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";
import { hasActiveFilters, toggleFilterValue } from "@/lib/shopFilters.js";

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-amber/20 py-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-brand-gray transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function ShopFilters({
  facets,
  filters,
  onChange,
  onApplyPrice,
  priceDraft,
  onPriceDraftChange,
  className,
}) {
  const updateListFilter = (key, value) => {
    onChange({
      ...filters,
      [key]: toggleFilterValue(filters[key] || [], value),
      page: 1,
    });
  };

  return (
    <div className={cn("rounded-2xl border border-brand-amber/20 bg-brand-white p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        {hasActiveFilters(filters) && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                brand: [],
                size: [],
                color: [],
                minPrice: "",
                maxPrice: "",
                page: 1,
              })
            }
            className="text-sm font-semibold text-brand-amber hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Price">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-brand-gray">Min</label>
            <Input
              type="number"
              min={0}
              placeholder={String(facets?.priceRange?.min || 0)}
              value={priceDraft.minPrice}
              onChange={(e) => onPriceDraftChange({ ...priceDraft, minPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-brand-gray">Max</label>
            <Input
              type="number"
              min={0}
              placeholder={String(facets?.priceRange?.max || 0)}
              value={priceDraft.maxPrice}
              onChange={(e) => onPriceDraftChange({ ...priceDraft, maxPrice: e.target.value })}
            />
          </div>
        </div>
        <Button type="button" size="sm" className="mt-3 w-full" onClick={onApplyPrice}>
          Apply price
        </Button>
      </FilterSection>

      {facets?.brands?.length > 0 && (
        <FilterSection title="Brand">
          <div className="max-h-48 space-y-3 overflow-y-auto pr-1">
            {facets.brands.map((brand) => (
              <label
                key={brand._id}
                className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
              >
                <Checkbox
                  checked={filters.brand.includes(brand.slug)}
                  onCheckedChange={() => updateListFilter("brand", brand.slug)}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {facets?.sizes?.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => {
              const active = filters.size.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateListFilter("size", size)}
                  className={cn(
                    "min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition",
                    active
                      ? "border-brand-amber bg-brand-amber text-foreground"
                      : "border-brand-amber/20 bg-brand-cream text-foreground hover:border-brand-amber"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {facets?.colors?.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((color) => {
              const active = filters.color.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateListFilter("color", color)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
                    active
                      ? "border-brand-amber bg-brand-amber text-foreground"
                      : "border-brand-amber/20 bg-brand-cream text-foreground hover:border-brand-amber"
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}
    </div>
  );
}
