import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { FreeShippingBar } from './FreeShippingBar';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    discountAmount,
    finalTotal,
    appliedPromo,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-alabaster dark:bg-[#111111] text-obsidian dark:text-alabaster shadow-2xl border-l border-stone-light/60 dark:border-white/10 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-stone-light/60 dark:border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-editorial text-gold">
                Atelier Selection
              </p>
              <h2 className="font-serif text-xl tracking-wide">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close bag"
              className="p-2 text-stone-muted hover:text-obsidian dark:hover:text-alabaster transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Animated Free Shipping Threshold Bar */}
          <FreeShippingBar subtotal={subtotal} />

          {/* Items or Curated Empty State */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <div className="w-14 h-14 border border-stone-light dark:border-white/15 flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6 text-stone-muted" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Your Atelier Bag is Empty</h3>
              <p className="text-xs text-stone-muted leading-relaxed mb-6 max-w-xs">
                Explore our current serie of monolithic cashmere outerwear, fine merino knitwear,
                and structured Italian calfskin objects.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/catalog');
                }}
                className="px-6 py-3 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial hover:bg-gold hover:text-obsidian transition-colors"
              >
                Explore Archive
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto divide-y divide-stone-light/50 dark:divide-white/10 px-6">
                {items.map((item) => (
                  <div key={item.variantId} className="py-5 flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-20 h-28 object-cover bg-stone-light/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-base leading-snug truncate">
                            {item.productName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            aria-label="Remove item"
                            className="text-stone-muted hover:text-red-500 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-xs text-stone-muted">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-muted/40"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.color}</span>
                          <span>•</span>
                          <span className="font-mono">Size {item.size}</span>
                        </div>
                        <p className="mt-0.5 font-mono text-[10px] text-stone-muted">
                          SKU: {item.sku}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-stone-light dark:border-white/15">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 hover:text-gold transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="p-1.5 hover:text-gold transition-colors disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="font-mono text-sm font-medium">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Summary */}
              <div className="p-6 border-t border-stone-light/60 dark:border-white/10 bg-alabaster dark:bg-[#141414] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-muted">
                    <span>Subtotal</span>
                    <span className="font-mono text-obsidian dark:text-alabaster">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  {appliedPromo && discountAmount > 0 && (
                    <div className="flex justify-between text-gold">
                      <span>Privilege ({appliedPromo.code})</span>
                      <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-muted">
                    <span>Express Courier</span>
                    <span className="font-mono">
                      {shippingFee === 0 ? 'COMPLIMENTARY' : `$${shippingFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-light/50 dark:border-white/10 flex justify-between text-sm font-medium">
                    <span>Estimated Total</span>
                    <span className="font-mono text-base">${finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium flex items-center justify-center gap-2 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
