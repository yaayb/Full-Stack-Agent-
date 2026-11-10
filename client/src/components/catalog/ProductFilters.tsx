import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { VariantSize } from '../../services/api';

export interface CatalogFilterState {
  category: string;
  size: string;
  priceMax: number;
  sort: 'newest' | 'price_asc' | 'price_desc';
  onlyWishlist: boolean;
}

interface ProductFiltersProps {
  filters: CatalogFilterState;
  onChange: (updated: Partial<CatalogFilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

const CATEGORIES = [
  'ALL',
  'Outerwear',
  'Tailored Knitwear',
  'Structured Leather',
  'Footwear',
];

const SIZES: Array<'ALL' | VariantSize> = ['ALL', 'XS', 'S', 'M', 'L', 'XL'];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  return (
    <div className="border-y border-stone-light/70 dark:border-white/10 py-5 mb-10 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ category: cat })}
                className={`px-3.5 py-2 text-xs uppercase tracking-luxury transition-colors ${
                  active
                    ? 'bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian font-medium'
                    : 'border border-stone-light dark:border-white/15 text-stone-muted hover:border-gold hover:text-obsidian dark:hover:text-alabaster'
                }`}
              >
                {cat === 'ALL' ? 'All Pieces' : cat}
              </button>
            );
          })}
        </div>

        {/* Right Sort & Reset */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
            <span className="uppercase tracking-luxury text-stone-muted">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) =>
                onChange({
                  sort: e.target.value as CatalogFilterState['sort'],
                })
              }
              className="bg-transparent border border-stone-light dark:border-white/20 px-3 py-1.5 text-xs font-mono focus:border-gold outline-none dark:bg-obsidian"
            >
              <option value="newest">Newest Editions</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-stone-muted hover:text-gold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Secondary Row: Size Pills, Max Price Slider, Wishlist Toggle */}
      <div className="pt-3 border-t border-stone-light/40 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-luxury text-stone-muted">Size:</span>
            <div className="flex items-center gap-1">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onChange({ size: sz })}
                  className={`px-2.5 py-1 font-mono text-[11px] border transition-colors ${
                    filters.size === sz
                      ? 'border-gold bg-gold text-obsidian font-semibold'
                      : 'border-stone-light dark:border-white/15 text-stone-muted hover:border-gold'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="uppercase tracking-luxury text-stone-muted">
              Max Price:{' '}
              <strong className="font-mono text-obsidian dark:text-alabaster">
                ${filters.priceMax.toLocaleString()}
              </strong>
            </span>
            <input
              type="range"
              min={500}
              max={2500}
              step={50}
              value={filters.priceMax}
              onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
              className="w-28 accent-[#C5A46D] cursor-pointer"
            />
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyWishlist}
              onChange={(e) => onChange({ onlyWishlist: e.target.checked })}
              className="accent-[#C5A46D]"
            />
            <span className="uppercase tracking-luxury text-stone-muted">
              Saved Wishlist Only
            </span>
          </label>
        </div>

        <p className="font-mono text-xs text-stone-muted">
          Showing {totalResults} {totalResults === 1 ? 'piece' : 'pieces'}
        </p>
      </div>
    </div>
  );
};
