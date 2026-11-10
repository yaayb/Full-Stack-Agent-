import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface ShippingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

interface StepShippingProps {
  data: ShippingFormData;
  onUpdate: (data: ShippingFormData) => void;
  onNext: () => void;
}

export const StepShipping: React.FC<StepShippingProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ShippingFormData, string>> = {};
    if (data.customerName.trim().length < 2) {
      nextErrors.customerName = 'Please enter recipient full name';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail.trim())) {
      nextErrors.customerEmail = 'Please enter a valid email address';
    }
    if (data.customerPhone.trim().length < 6) {
      nextErrors.customerPhone = 'Please enter a valid contact phone number';
    }
    if (data.shippingAddress.trim().length < 5) {
      nextErrors.shippingAddress = 'Street address must be at least 5 characters';
    }
    if (data.shippingCity.trim().length < 2) {
      nextErrors.shippingCity = 'City is required';
    }
    if (data.shippingPostalCode.trim().length < 3) {
      nextErrors.shippingPostalCode = 'Postal code is required';
    }
    if (data.shippingCountry.trim().length < 2) {
      nextErrors.shippingCountry = 'Country is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleFieldChange = (field: keyof ShippingFormData, value: string) => {
    onUpdate({ ...data, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <p className="text-[11px] uppercase tracking-editorial text-gold mb-1">
          Step 01 / 03
        </p>
        <h2 className="font-serif text-2xl">Private Courier Dispatch Details</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            Recipient Full Name *
          </label>
          <input
            type="text"
            value={data.customerName}
            onChange={(e) => handleFieldChange('customerName', e.target.value)}
            placeholder="Clara Vance"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.customerName && (
            <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            Electronic Mail *
          </label>
          <input
            type="email"
            value={data.customerEmail}
            onChange={(e) => handleFieldChange('customerEmail', e.target.value)}
            placeholder="client@ateliervanguard.com"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.customerEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            Telephone (For Courier Dispatch) *
          </label>
          <input
            type="tel"
            value={data.customerPhone}
            onChange={(e) => handleFieldChange('customerPhone', e.target.value)}
            placeholder="+33 1 42 68 55 00"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.customerPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.customerPhone}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            Street Address & Suite *
          </label>
          <input
            type="text"
            value={data.shippingAddress}
            onChange={(e) => handleFieldChange('shippingAddress', e.target.value)}
            placeholder="24 Rue du Faubourg Saint-Honoré"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.shippingAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.shippingAddress}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            City *
          </label>
          <input
            type="text"
            value={data.shippingCity}
            onChange={(e) => handleFieldChange('shippingCity', e.target.value)}
            placeholder="Paris"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.shippingCity && (
            <p className="text-xs text-red-500 mt-1">{errors.shippingCity}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            Postal / ZIP Code *
          </label>
          <input
            type="text"
            value={data.shippingPostalCode}
            onChange={(e) => handleFieldChange('shippingPostalCode', e.target.value)}
            placeholder="75008"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.shippingPostalCode && (
            <p className="text-xs text-red-500 mt-1">{errors.shippingPostalCode}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
            Country / Region *
          </label>
          <input
            type="text"
            value={data.shippingCountry}
            onChange={(e) => handleFieldChange('shippingCountry', e.target.value)}
            placeholder="France"
            className="w-full px-4 py-3 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
          />
          {errors.shippingCountry && (
            <p className="text-xs text-red-500 mt-1">{errors.shippingCountry}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium inline-flex items-center gap-2 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors"
        >
          <span>Continue to Billing & Privilege</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
