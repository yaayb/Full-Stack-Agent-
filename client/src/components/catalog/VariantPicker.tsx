import React, { useMemo } from 'react';
import { ProductVariant, VariantSize } from '../../services/api';

interface VariantPickerProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

const SIZE_ORDER: VariantSize[] = ['XS', 'S', 'M', 'L', 'XL'];

export const VariantPicker: React.FC<VariantPickerProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  // Unique color options with representative hex swatch
  const colorOptions = useMemo(() => {
    const map = new Map<string, { color: string; colorHex: string; firstVariant: ProductVariant }>();
    for (const v of variants) {
      if (!map.has(v.color)) {
        map.set(v.color, { color: v.color, colorHex: v.colorHex, firstVariant: v });
      }
    }
    return Array.from(map.values());
  }, [variants]);

  // Sizes available for the currently active color
  const sizesForActiveColor = useMemo(() => {
    const matching = variants.filter((v) => v.color === selectedVariant.color);
    return matching.sort(
      (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
    );
  }, [variants, selectedVariant.color]);

  const handleColorSwitch = (targetColor: string) => {
    // Prefer keeping the same size in the new color if available
    const sameSizeVariant = variants.find(
      (v) => v.color === targetColor && v.size === selectedVariant.size
    );
    const fallbackVariant =
      variants.find((v) => v.color === targetColor && v.stock > 0) ||
      variants.find((v) => v.color === targetColor);

    if (sameSizeVariant) {
      onSelectVariant(sameSizeVariant);
    } else if (fallbackVariant) {
      onSelectVariant(fallbackVariant);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Swatch Selector */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="uppercase tracking-luxury text-stone-muted">
            Colorway:{' '}
            <strong className="text-obsidian dark:text-alabaster font-medium">
              {selectedVariant.color}
            </strong>
          </span>
          <span className="font-mono text-[11px] text-stone-muted">
            SKU: {selectedVariant.sku}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {colorOptions.map((option) => {
            const isSelected = option.color === selectedVariant.color;
            return (
              <button
                key={option.color}
                type="button"
                onClick={() => handleColorSwitch(option.color)}
                title={option.color}
                aria-label={`Select color ${option.color}`}
                className={`w-8 h-8 rounded-full p-0.5 transition-transform ${
                  isSelected
                    ? 'ring-2 ring-gold scale-110'
                    : 'ring-1 ring-stone-light dark:ring-white/20 hover:scale-105'
                }`}
              >
                <span
                  className="block w-full h-full rounded-full border border-black/15"
                  style={{ backgroundColor: option.colorHex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Pill Selector */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="uppercase tracking-luxury text-stone-muted">
            Select Size
          </span>
          <StockBadge stock={selectedVariant.stock} />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {sizesForActiveColor.map((variant) => {
            const isSelected = variant.id === selectedVariant.id;
            const isOut = variant.stock <= 0;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelectVariant(variant)}
                className={`py-2.5 text-xs font-mono uppercase border transition-all relative ${
                  isSelected
                    ? 'border-obsidian bg-obsidian text-alabaster dark:border-alabaster dark:bg-alabaster dark:text-obsidian font-semibold'
                    : isOut
                    ? 'border-stone-light/50 dark:border-white/10 text-stone-muted/40 line-through'
                    : 'border-stone-light dark:border-white/20 hover:border-gold'
                }`}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-red-500">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Out of Stock
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gold">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        Low Stock — {stock} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      In Stock ({stock} available)
    </span>
  );
};
