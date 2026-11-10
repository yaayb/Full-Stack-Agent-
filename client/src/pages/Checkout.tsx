import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api, OrderRecord } from '../services/api';
import {
  StepShipping,
  ShippingFormData,
} from '../components/checkout/StepShipping';
import {
  StepBilling,
  BillingFormData,
} from '../components/checkout/StepBilling';
import { StepReview } from '../components/checkout/StepReview';

export const Checkout: React.FC = () => {
  const {
    items,
    subtotal,
    shippingFee,
    discountAmount,
    finalTotal,
    appliedPromo,
    setAppliedPromo,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '+33 1 42 68 55 00',
    shippingAddress: '24 Rue du Faubourg Saint-Honoré',
    shippingCity: 'Paris',
    shippingPostalCode: '75008',
    shippingCountry: 'France',
  });

  const [billingData, setBillingData] = useState<BillingFormData>({
    cardHolder: user?.name?.toUpperCase() || 'CLARA VANCE',
    cardNumber: '4242 4242 4242 4242',
    expiry: '09/28',
    cvc: '888',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name,
        customerEmail: prev.customerEmail || user.email,
      }));
      setBillingData((prev) => ({
        ...prev,
        cardHolder: prev.cardHolder || user.name.toUpperCase(),
      }));
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const last4 = billingData.cardNumber.replace(/\D/g, '').slice(-4) || '4242';
      const res = await api.checkout.createOrder({
        ...shippingData,
        paymentMethod: `CARD •••• ${last4}`,
        promoCode: appliedPromo?.code,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      setConfirmedOrder(res.order);
      clearCart();
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['product'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to complete order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <div className="p-8 sm:p-12 border border-gold/40 bg-alabaster dark:bg-[#121212] space-y-8">
          <div className="flex items-center gap-3 text-gold">
            <CheckCircle2 className="w-7 h-7" />
            <span className="text-xs uppercase tracking-editorial font-mono">
              Atelier Dispatch Confirmed
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl">
              Thank You, {confirmedOrder.customerName}
            </h1>
            <p className="text-xs text-stone-muted leading-relaxed">
              Your order dossier has been registered with our Paris atelier. Inventory has been
              reserved and your archival parcel is being prepared for insured courier dispatch.
            </p>
          </div>

          <div className="p-5 bg-stone-light/25 dark:bg-white/5 border border-stone-light/60 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-editorial text-stone-muted mb-1">
                Order Reference ID
              </p>
              <p className="font-mono font-semibold text-gold break-all">{confirmedOrder.id}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-editorial text-stone-muted mb-1">
                Fulfillment Status
              </p>
              <p className="font-mono uppercase">{confirmedOrder.status}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-editorial text-stone-muted mb-1">
                Total Settled
              </p>
              <p className="font-mono font-semibold">
                ${confirmedOrder.finalTotal.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-luxury text-stone-muted">
              Reserved Archive Pieces
            </p>
            <div className="divide-y divide-stone-light/50 dark:divide-white/10 border-y border-stone-light/50 dark:border-white/10">
              {confirmedOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-serif text-base">{item.productName}</p>
                    <p className="text-stone-muted font-mono">
                      {item.sku} • {item.color} • Size {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-mono">${(item.unitPrice * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/catalog"
              className="px-8 py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial inline-flex items-center gap-2 hover:bg-gold hover:text-obsidian transition-colors"
            >
              <span>Return to Archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Guard
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <ShoppingBag className="w-10 h-10 text-stone-muted mx-auto" />
        <h1 className="font-serif text-3xl">Your Atelier Bag is Empty</h1>
        <p className="text-xs text-stone-muted">
          Select one or more pieces from our archive before proceeding to private courier checkout.
        </p>
        <Link
          to="/catalog"
          className="inline-block px-8 py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
      {/* Stepper Header */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-editorial text-gold mb-2">
          Atelier Vanguard Private Checkout
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl mb-6">Acquisition Dossier</h1>

        <div className="grid grid-cols-3 border border-stone-light/70 dark:border-white/10">
          {[
            { num: 1, label: '01. Courier Dispatch' },
            { num: 2, label: '02. Billing & Privilege' },
            { num: 3, label: '03. Final Review' },
          ].map((s) => {
            const active = step === s.num;
            const completed = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                disabled={s.num > step}
                onClick={() => {
                  if (s.num < step) setStep(s.num as 1 | 2 | 3);
                }}
                className={`py-3.5 px-4 text-left text-xs uppercase tracking-luxury font-mono transition-colors border-r last:border-r-0 border-stone-light/70 dark:border-white/10 ${
                  active
                    ? 'bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian font-semibold'
                    : completed
                    ? 'bg-gold/15 text-gold cursor-pointer'
                    : 'text-stone-muted opacity-60'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Active Step Form (8 cols) */}
        <div className="lg:col-span-8">
          {step === 1 && (
            <StepShipping
              data={shippingData}
              onUpdate={setShippingData}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepBilling
              billing={billingData}
              onUpdateBilling={setBillingData}
              subtotal={subtotal}
              appliedPromo={appliedPromo}
              onApplyPromo={setAppliedPromo}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepReview
              shipping={shippingData}
              billing={billingData}
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              appliedPromo={appliedPromo}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onBack={() => setStep(2)}
              onPlaceOrder={() => void handlePlaceOrder()}
            />
          )}
        </div>

        {/* Right Persistent Bag Summary Sidebar (4 cols) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 p-6 border border-stone-light/70 dark:border-white/10 bg-stone-light/15 dark:bg-white/5 space-y-5">
            <h3 className="font-serif text-xl border-b border-stone-light/60 dark:border-white/10 pb-3">
              Bag Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-16 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate">{item.productName}</p>
                    <p className="text-stone-muted">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-mono">${(item.unitPrice * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-light/60 dark:border-white/10 space-y-2 text-xs">
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
              <div className="pt-2 border-t border-stone-light/60 dark:border-white/10 flex justify-between text-sm font-medium">
                <span>Total</span>
                <span className="font-mono text-base">${finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
