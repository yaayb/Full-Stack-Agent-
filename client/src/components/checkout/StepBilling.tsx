import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  CreditCard,
} from 'lucide-react';
import { api, PromoValidationResult } from '../../services/api';

export interface BillingFormData {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface StepBillingProps {
  billing: BillingFormData;
  onUpdateBilling: (data: BillingFormData) => void;
  subtotal: number;
  appliedPromo: PromoValidationResult | null;
  onApplyPromo: (promo: PromoValidationResult | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepBilling: React.FC<StepBillingProps> = ({
  billing,
  onUpdateBilling,
  subtotal,
  appliedPromo,
  onApplyPromo,
  onBack,
  onNext,
}) => {
  const [promoInput, setPromoInput] = useState(appliedPromo?.code || '');
  const [promoStatus, setPromoStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(
    appliedPromo
      ? {
          type: 'success',
          message: `Code ${appliedPromo.code} active (-$${appliedPromo.discountAmount.toLocaleString()})`,
        }
      : null
  );
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  const handleValidatePromo = async (codeOverride?: string) => {
    const codeToTest = (codeOverride ?? promoInput).trim().toUpperCase();
    if (!codeToTest) return;

    setPromoInput(codeToTest);
    setValidatingPromo(true);
    setPromoStatus(null);

    try {
      const res = await api.checkout.validatePromo(codeToTest, subtotal);
      onApplyPromo(res.promo);
      setPromoStatus({
        type: 'success',
        message: `Privilege "${res.promo.code}" applied: -$${res.promo.discountAmount.toLocaleString()} off your order.`,
      });
    } catch (err) {
      onApplyPromo(null);
      setPromoStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unable to apply promo code',
      });
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (billing.cardHolder.trim().length < 2 || billing.cardNumber.replace(/\s+/g, '').length < 12) {
      setBillingError('Please provide cardholder name and a valid card number.');
      return;
    }
    setBillingError(null);
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-editorial text-gold mb-1">
          Step 02 / 03
        </p>
        <h2 className="font-serif text-2xl">Payment & Atelier Privilege Code</h2>
      </div>

      {/* Interactive Promo Code Validation Box */}
      <div className="p-5 border border-stone-light dark:border-white/15 bg-stone-light/20 dark:bg-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-luxury font-medium">
            <Tag className="w-4 h-4 text-gold" />
            <span>Private Client Promo Code</span>
          </div>
          {appliedPromo && (
            <button
              type="button"
              onClick={() => {
                onApplyPromo(null);
                setPromoInput('');
                setPromoStatus(null);
              }}
              className="text-[11px] text-stone-muted hover:text-red-500 underline"
            >
              Remove Code
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            placeholder="Enter VANGUARD10 or ATELIER50"
            className="flex-1 px-4 py-2.5 text-xs font-mono uppercase bg-alabaster dark:bg-obsidian border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          <button
            type="button"
            disabled={validatingPromo || !promoInput.trim()}
            onClick={() => void handleValidatePromo()}
            className="px-6 py-2.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-luxury font-medium hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors disabled:opacity-40"
          >
            {validatingPromo ? 'Checking...' : 'Apply'}
          </button>
        </div>

        {/* Quick-Apply Seeded Promo Chips */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-stone-muted">Available Codes:</span>
          <button
            type="button"
            onClick={() => void handleValidatePromo('VANGUARD10')}
            className="px-2 py-0.5 font-mono border border-gold/40 text-gold hover:bg-gold hover:text-obsidian transition-colors"
          >
            VANGUARD10 (10% off $150+)
          </button>
          <button
            type="button"
            onClick={() => void handleValidatePromo('ATELIER50')}
            className="px-2 py-0.5 font-mono border border-gold/40 text-gold hover:bg-gold hover:text-obsidian transition-colors"
          >
            ATELIER50 ($50 off $350+)
          </button>
          <button
            type="button"
            onClick={() => void handleValidatePromo('EXPIRED25')}
            className="px-2 py-0.5 font-mono border border-stone-light dark:border-white/15 text-stone-muted hover:border-red-400 transition-colors"
          >
            EXPIRED25 (Test Expired)
          </button>
        </div>

        {promoStatus && (
          <div
            className={`flex items-center gap-2 text-xs p-3 border ${
              promoStatus.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400'
            }`}
          >
            {promoStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{promoStatus.message}</span>
          </div>
        )}
      </div>

      {/* Payment Method Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-stone-muted">
          <CreditCard className="w-4 h-4 text-gold" />
          <span>Encrypted Card Settlement</span>
        </div>

        {billingError && (
          <div className="p-3 text-xs border border-red-500/40 bg-red-500/10 text-red-500">
            {billingError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
              Name on Card *
            </label>
            <input
              type="text"
              value={billing.cardHolder}
              onChange={(e) => onUpdateBilling({ ...billing, cardHolder: e.target.value })}
              placeholder="CLARA VANCE"
              className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
              Card Number *
            </label>
            <input
              type="text"
              value={billing.cardNumber}
              onChange={(e) => onUpdateBilling({ ...billing, cardNumber: e.target.value })}
              placeholder="4242 •••• •••• 4242"
              className="w-full px-4 py-3 text-sm font-mono bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
              Expiration (MM/YY) *
            </label>
            <input
              type="text"
              value={billing.expiry}
              onChange={(e) => onUpdateBilling({ ...billing, expiry: e.target.value })}
              placeholder="09/28"
              className="w-full px-4 py-3 text-sm font-mono bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
              Security Code (CVC) *
            </label>
            <input
              type="text"
              value={billing.cvc}
              onChange={(e) => onUpdateBilling({ ...billing, cvc: e.target.value })}
              placeholder="888"
              className="w-full px-4 py-3 text-sm font-mono bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-stone-light dark:border-white/20 text-xs uppercase tracking-luxury inline-flex items-center gap-2 hover:border-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipping</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium inline-flex items-center gap-2 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors"
        >
          <span>Review Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
