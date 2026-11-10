import React from 'react';
import { Truck, Sparkles } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../context/CartContext';

interface FreeShippingBarProps {
  subtotal: number;
}

export const FreeShippingBar: React.FC<FreeShippingBarProps> = ({ subtotal }) => {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const isUnlocked = remaining === 0 && subtotal > 0;

  return (
    <div className="px-6 py-3.5 bg-stone-light/30 dark:bg-white/5 border-b border-stone-light/60 dark:border-white/10">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
          ) : (
            <Truck className="w-3.5 h-3.5 text-stone-muted shrink-0" />
          )}
          {isUnlocked ? (
            <span className="tracking-wide font-medium text-obsidian dark:text-alabaster">
              Complimentary Express Courier <span className="text-gold">Unlocked</span>
            </span>
          ) : (
            <span className="text-stone-muted">
              Add{' '}
              <span className="font-mono font-medium text-obsidian dark:text-alabaster">
                ${remaining.toFixed(0)}
              </span>{' '}
              more for complimentary Express Courier
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-gold">{progressPercent}%</span>
      </div>

      <div className="w-full h-1 bg-stone-light dark:bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
