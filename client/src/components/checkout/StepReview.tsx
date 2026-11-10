import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { CartItem } from '../../context/CartContext';
import { PromoValidationResult } from '../../services/api';
import { ShippingFormData } from './StepShipping';
import { BillingFormData } from './StepBilling';

interface StepReviewProps {
  shipping: ShippingFormData;
  billing: BillingFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  appliedPromo: PromoValidationResult | null;
  isSubmitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onPlaceOrder: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  shipping,
  billing,
  items,
  subtotal,
  shippingFee,
  discountAmount,
  finalTotal,
  appliedPromo,
  isSubmitting,
  submitError,
  onBack,
  onPlaceOrder,
}) => {
  const maskedLast4 = billing.cardNumber.replace(/\D/g, '').slice(-4) || '4242';

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-editorial text-gold mb-1">
          Step 03 / 03
        </p>
        <h2 className="font-serif text-2xl">Final Order Dossier & Authorization</h2>
      </div>

      {submitError && (
        <div className="p-4 text-xs border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400">
          {submitError}
        </div>
      )}

      {/* Dispatch & Settlement Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 border border-stone-light/70 dark:border-white/10 bg-stone-light/15 dark:bg-white/5 text-xs">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-editorial text-gold font-medium">
            Courier Destination
          </p>
          <p className="font-medium text-sm">{shipping.customerName}</p>
          <p className="text-stone-muted">{shipping.shippingAddress}</p>
          <p className="text-stone-muted">
            {shipping.shippingCity}, {shipping.shippingPostalCode} — {shipping.shippingCountry}
          </p>
          <p className="text-stone-muted font-mono pt-1">
            {shipping.customerEmail} • {shipping.customerPhone}
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-editorial text-gold font-medium">
            Settlement Method
          </p>
          <p className="font-medium text-sm">{billing.cardHolder}</p>
          <p className="font-mono text-stone-muted">CARD ENDING IN •••• {maskedLast4}</p>
          {appliedPromo && (
            <p className="text-gold font-mono pt-1">
              Privilege Applied: {appliedPromo.code} (-${discountAmount.toLocaleString()})
            </p>
          )}
        </div>
      </div>

      {/* Line Items Review */}
      <div className="border border-stone-light/70 dark:border-white/10 divide-y divide-stone-light/50 dark:divide-white/10">
        {items.map((item) => (
          <div key={item.variantId} className="p-4 flex items-center gap-4">
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-16 h-20 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-base truncate">{item.productName}</h4>
              <p className="text-xs text-stone-muted">
                {item.color} • Size {item.size} • Qty {item.quantity}
              </p>
              <p className="font-mono text-[10px] text-stone-muted">SKU: {item.sku}</p>
            </div>
            <p className="font-mono text-sm font-medium">
              ${(item.unitPrice * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Financial Totals */}
      <div className="p-5 border border-stone-light/70 dark:border-white/10 space-y-2 text-xs">
        <div className="flex justify-between text-stone-muted">
          <span>Bag Subtotal</span>
          <span className="font-mono text-obsidian dark:text-alabaster">
            ${subtotal.toLocaleString()}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-gold">
            <span>Privilege Discount ({appliedPromo?.code})</span>
            <span className="font-mono">-${discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-stone-muted">
          <span>Insured Express Courier</span>
          <span className="font-mono">
            {shippingFee === 0 ? 'COMPLIMENTARY' : `$${shippingFee.toLocaleString()}`}
          </span>
        </div>
        <div className="pt-3 border-t border-stone-light/60 dark:border-white/10 flex justify-between text-base font-medium">
          <span>Total Authorization</span>
          <span className="font-mono text-lg">${finalTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-stone-light dark:border-white/20 text-xs uppercase tracking-luxury inline-flex items-center gap-2 hover:border-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onPlaceOrder}
          className="px-8 py-4 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium inline-flex items-center gap-2 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {isSubmitting
              ? 'Authorizing Atelier Order...'
              : `Authorize & Place Order ($${finalTotal.toLocaleString()})`}
          </span>
        </button>
      </div>
    </div>
  );
};
