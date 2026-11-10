/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import {
  validateCheckoutForm,
  CheckoutFormData,
  CheckoutFormErrors,
  formatCurrency,
  OrderRecord,
} from '../utils/commerceLogic.ts';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

export function CheckoutModal() {
  const {
    items,
    pricing,
    isCheckoutOpen,
    closeCheckout,
    couponCode,
    mode,
    isStripeLiveConfigured,
    setMode,
    setConfirmedOrder,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<OrderRecord | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    streetAddress: '',
    apartment: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'United States',
    deliveryNotes: '',
    paymentMethod: 'card-simulated',
  });

  const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof CheckoutFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const fillTestPreset = (scenario: 'success' | 'decline') => {
    if (scenario === 'success') {
      setFormData({
        fullName: 'Alex Chen',
        email: 'alex.chen@homebrewer.io',
        streetAddress: '1088 Highland Park Way',
        apartment: 'Suite 200',
        city: 'Portland',
        stateProvince: 'OR',
        postalCode: '97201',
        country: 'United States',
        deliveryNotes: 'Fragile craft coffee shipment. Ring doorbell.',
        paymentMethod: 'card-simulated',
      });
      setFormErrors({});
      setApiError('');
    } else {
      setApiError('Simulated Card Decline: Insufficient test balance (Code 402_card_declined). Try successful test card.');
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validation = validateCheckoutForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: formData,
          couponCode,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed.');
      }

      // If live mode returned Stripe hosted URL, redirect to Stripe
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // In demo mode: success screen
      if (data.order) {
        setCreatedOrder(data.order);
        setConfirmedOrder(data.order);
        clearCart();
        setStep('success');
      }
    } catch (err: any) {
      setApiError(err.message || 'Unable to connect to checkout service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-[#FBF7F0] rounded-3xl border border-[#DDD2BF] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD2BF] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#24493A] text-[#FBF7F0] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#E69A3B]" />
            </div>
            <div>
              <h2
                id="checkout-modal-title"
                className="text-lg font-bold text-[#2B2B28]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {step === 'details' ? 'Secure Checkout & Delivery' : 'Order Confirmed!'}
              </h2>
              <span className="text-xs text-[#6F6A60]">
                {step === 'details'
                  ? mode === 'demo'
                    ? 'Demo Mode • Simulated payment authorization'
                    : 'Hosted Payment Processing'
                  : `Order ID: ${createdOrder?.orderId}`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Close checkout modal"
            className="p-2 rounded-xl text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitCheckout} className="p-6 sm:p-8 space-y-6">
            {/* Demo Mode Notice: Explicitly simulated with no Stripe credentials required */}
            {mode === 'demo' ? (
              <div className="p-4 rounded-2xl bg-[#E69A3B]/10 border border-[#E69A3B]/30 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#D9633B] flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Demo Mode: Simulated Checkout
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fillTestPreset('success')}
                      className="text-[11px] font-semibold text-[#24493A] underline hover:text-[#1B372C] cursor-pointer"
                    >
                      Fill sample data
                    </button>
                    <span className="text-black/20">|</span>
                    <button
                      type="button"
                      onClick={() => fillTestPreset('decline')}
                      className="text-[11px] font-semibold text-red-700 underline hover:text-red-900 cursor-pointer"
                    >
                      Test Card Decline
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#6F6A60]">
                  No Stripe credentials required. No real card details are collected or charged. This simulated checkout verifies
                  server order creation, shipping rules, idempotency, and automated customer portal setup safely.
                </p>
              </div>
            ) : (
              /* Live Mode Warning if Stripe is not configured on server */
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Live Mode Payment Processing
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('demo');
                      setApiError('');
                    }}
                    className="text-xs font-bold text-[#24493A] underline hover:text-[#1B372C] cursor-pointer"
                  >
                    Switch to Demo Mode
                  </button>
                </div>
                <p className="text-xs text-amber-800">
                  {isStripeLiveConfigured
                    ? 'Stripe keys are configured. Submitting will redirect to a secure Stripe-hosted checkout.'
                    : 'Live payments require the business owner to configure STRIPE_SECRET_KEY in the server environment. To complete a test order right now without credentials, switch to Demo Mode.'}
                </p>
              </div>
            )}

            {apiError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{apiError}</span>
                </div>
                {mode === 'live' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('demo');
                      setApiError('');
                    }}
                    className="text-xs font-bold text-[#24493A] underline hover:text-[#1B372C] cursor-pointer whitespace-nowrap self-end sm:self-auto"
                  >
                    Switch to Demo Mode
                  </button>
                )}
              </div>
            )}

            {/* Step 1: Customer Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-3">
                1. Customer & Notification Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-fullName" className="block text-xs font-medium text-[#6F6A60] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="checkout-fullName"
                    type="text"
                    placeholder="e.g. Jordan Miller"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full py-2 px-3 text-xs border rounded-xl bg-white ${
                      formErrors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#DDD2BF]'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-medium text-[#6F6A60] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    placeholder="e.g. jordan@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full py-2 px-3 text-xs border rounded-xl bg-white ${
                      formErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[#DDD2BF]'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-3">
                2. Shipping Destination
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-street" className="block text-xs font-medium text-[#6F6A60] mb-1">
                      Street Address *
                    </label>
                    <input
                      id="checkout-street"
                      type="text"
                      placeholder="e.g. 450 Craft Roaster Blvd"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      className={`w-full py-2 px-3 text-xs border rounded-xl bg-white ${
                        formErrors.streetAddress
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-[#DDD2BF]'
                      }`}
                    />
                    {formErrors.streetAddress && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.streetAddress}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="checkout-apt" className="block text-xs font-medium text-[#6F6A60] mb-1">
                      Apt / Suite
                    </label>
                    <input
                      id="checkout-apt"
                      type="text"
                      placeholder="e.g. Apt 4B (optional)"
                      value={formData.apartment || ''}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      className="w-full py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="checkout-city" className="block text-xs font-medium text-[#6F6A60] mb-1">
                      City *
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      placeholder="e.g. Seattle"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full py-2 px-3 text-xs border rounded-xl bg-white ${
                        formErrors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-[#DDD2BF]'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="checkout-state" className="block text-xs font-medium text-[#6F6A60] mb-1">
                      State / Province *
                    </label>
                    <input
                      id="checkout-state"
                      type="text"
                      placeholder="e.g. WA"
                      value={formData.stateProvince}
                      onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                      className={`w-full py-2 px-3 text-xs border rounded-xl bg-white ${
                        formErrors.stateProvince
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-[#DDD2BF]'
                      }`}
                    />
                    {formErrors.stateProvince && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.stateProvince}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="checkout-zip" className="block text-xs font-medium text-[#6F6A60] mb-1">
                      Postal / ZIP *
                    </label>
                    <input
                      id="checkout-zip"
                      type="text"
                      placeholder="e.g. 98101"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`w-full py-2 px-3 text-xs border rounded-xl bg-white ${
                        formErrors.postalCode
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-[#DDD2BF]'
                      }`}
                    />
                    {formErrors.postalCode && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-3">
                3. Payment Security & Processing
              </h3>
              <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#24493A]/10 text-[#24493A] flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#24493A]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2B2B28] block">
                      {mode === 'demo' ? 'Simulated Card Authorization' : 'Stripe Hosted Checkout'}
                    </span>
                    <span className="text-[11px] text-[#6F6A60]">
                      256-bit SSL encrypted • Zero raw card storage on this site
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-4 border-t border-[#DDD2BF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#6F6A60]">Order Total:</span>
                <span className="text-2xl font-bold text-[#24493A] block">
                  {formatCurrency(pricing.total)}
                </span>
                <span className="text-[10px] text-[#6F6A60]">
                  (Includes {pricing.shipping === 0 ? 'Free Shipping' : formatCurrency(pricing.shipping)} and estimated tax)
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3.5 px-6 rounded-2xl bg-[#24493A] hover:bg-[#1B372C] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Authorization...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'demo'
                        ? 'Authorize Simulated Order (No Charge)'
                        : 'Proceed to Secure Stripe Checkout'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#E69A3B]" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 space-y-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  {createdOrder?.mode === 'demo' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E69A3B]/20 text-[#D9633B] border border-[#E69A3B]/40">
                      Simulated Demo Order • No Charge
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-emerald-950">
                  Thank You, {createdOrder?.customerName}!
                </h3>
                <p className="text-xs text-emerald-800">
                  Your order <strong>{createdOrder?.orderId}</strong> is confirmed. A receipt and
                  fresh roast tracking email have been dispatched to{' '}
                  <strong>{createdOrder?.customerEmail}</strong>.
                </p>
              </div>
            </div>

            {/* Shipment schedule card */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#D9633B]">
                <Calendar className="w-4 h-4" />
                <span>Roastery Production Schedule</span>
              </div>
              <p className="text-xs text-[#2B2B28]">
                Your micro-lot beans will be roasted on{' '}
                <strong>{createdOrder?.nextRoastDate}</strong> at our dedicated roastery. Hand-packed
                in degassing barrier bags and dispatched Tuesday morning.
              </p>
            </div>

            {/* Order Items summary */}
            <div className="border border-[#DDD2BF] rounded-2xl p-4 bg-white space-y-2">
              <span className="text-xs font-bold uppercase text-[#6F6A60] block">
                Ordered Items
              </span>
              {createdOrder?.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs py-1 border-b border-[#DDD2BF]/40 last:border-0">
                  <span>
                    {item.quantity}x {item.title} ({item.bagWeight}, {item.grind})
                  </span>
                  <span className="font-bold text-[#24493A]">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-bold pt-2 text-[#24493A]">
                <span>{createdOrder?.mode === 'demo' ? 'Total Simulated (No Charge)' : 'Total Paid'}</span>
                <span>{formatCurrency(createdOrder?.pricing.total || 0)}</span>
              </div>
            </div>

            {/* Customer Portal Link if Subscription */}
            {createdOrder?.isSubscription && (
              <div className="p-4 rounded-2xl bg-[#F1E8D8] border border-[#DDD2BF] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#24493A]">
                  <RefreshCw className="w-4 h-4 text-[#D9633B]" />
                  <span>Subscription Active • Status: {createdOrder.subscriptionStatus}</span>
                </div>
                <p className="text-xs text-[#6F6A60]">
                  Need to pause while traveling or skip a month? You have full control in your
                  self-service Customer Portal anytime.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD2BF]">
              <button
                type="button"
                onClick={closeCheckout}
                className="px-6 py-2.5 rounded-xl bg-[#24493A] text-white text-xs font-bold hover:bg-[#1B372C] transition-colors cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
