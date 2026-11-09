/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Sparkles, RefreshCw, Truck, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { ROASTER_CONFIG, CoffeeProduct } from '../config/roasterConfig.ts';
import { useCart } from '../context/CartContext.tsx';
import { calculateItemUnitPrice, formatCurrency, getNextMondayRoastDate } from '../utils/commerceLogic.ts';

export function SubscriptionOffer() {
  const { addItem, openCheckout } = useCart();

  const subscriptionProducts = ROASTER_CONFIG.products.filter((p) => p.isSubscription);

  const [selectedProductId, setSelectedProductId] = useState<string>(
    subscriptionProducts[0]?.id || 'sub-roasters-choice'
  );
  const [selectedWeight, setSelectedWeight] = useState<'12oz' | '2lb'>('12oz');
  const [selectedGrind, setSelectedGrind] = useState<string>('Whole Bean');
  const [selectedFrequency, setSelectedFrequency] = useState<'2-weeks' | '4-weeks' | '6-weeks'>('4-weeks');

  const selectedProduct =
    subscriptionProducts.find((p) => p.id === selectedProductId) || subscriptionProducts[0];

  const unitPrice = calculateItemUnitPrice(
    selectedProduct,
    selectedWeight,
    true,
    selectedFrequency
  );

  const basePriceWithoutDiscount = calculateItemUnitPrice(
    selectedProduct,
    selectedWeight,
    false
  );

  const nextRoastDate = getNextMondayRoastDate();

  const handleSubscribeNow = () => {
    addItem(selectedProduct, {
      bagWeight: selectedWeight,
      grind: selectedGrind,
      frequency: selectedFrequency,
      quantity: 1,
      isSubscription: true,
    });
    // Open checkout directly for a streamlined buying experience
    openCheckout();
  };

  return (
    <section
      id="subscriptions-section"
      aria-labelledby="subscriptions-heading"
      className="py-16 sm:py-24 bg-[#FBF7F0] border-t border-[#DDD2BF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9633B]" />
            <span>Monthly Roaster Subscription</span>
          </div>
          <h2
            id="subscriptions-heading"
            className="text-3xl sm:text-5xl font-semibold text-[#2B2B28] tracking-tight mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Fresh beans delivered <span className="italic text-[#D9633B]">at peak flavor</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6F6A60] leading-relaxed">
            Roasted to order on Monday mornings, packaged in breathable degassing bags, and shipped
            straight to your door with technique guides.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Plans on Left, Customizer on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Choose Plan (Cards) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#6F6A60] mb-2">
              Step 1: Choose Your Coffee Profile
            </h3>

            <div className="space-y-4">
              {subscriptionProducts.map((product) => {
                const isSelected = product.id === selectedProductId;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`relative p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#24493A] bg-white shadow-md'
                        : 'border-[#DDD2BF] bg-[#FBF7F0] hover:border-[#24493A]/50'
                    }`}
                  >
                    {product.isPopular && (
                      <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#D9633B] text-white text-xs font-bold shadow-xs">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className="text-xl font-bold text-[#2B2B28]"
                            style={{ fontFamily: "'Fraunces', serif" }}
                          >
                            {product.title}
                          </h4>
                        </div>
                        <p className="text-xs font-semibold text-[#D9633B] uppercase tracking-wider mb-2">
                          {product.subtitle}
                        </p>
                        <p className="text-sm text-[#6F6A60] leading-relaxed mb-4">
                          {product.description}
                        </p>

                        {/* Tasting Notes */}
                        <div className="flex flex-wrap gap-2">
                          {product.tastingNotes.map((note) => (
                            <span
                              key={note}
                              className="text-xs font-medium text-[#24493A] bg-[#24493A]/8 px-2.5 py-1 rounded-md"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="text-2xl font-bold text-[#24493A]">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <span className="text-[11px] text-[#6F6A60]">(Sample Price)</span>
                        <div
                          className={`w-6 h-6 rounded-full mt-3 border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#24493A] border-[#24493A] text-white'
                              : 'border-[#DDD2BF]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zero-Commitment Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DDD2BF]/80">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#DDD2BF]/60">
                <Truck className="w-5 h-5 text-[#24493A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B28]">Free Shipping</h4>
                  <p className="text-[11px] text-[#6F6A60]">Always included with every subscription box.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#DDD2BF]/60">
                <RefreshCw className="w-5 h-5 text-[#24493A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B28]">1-Click Skip / Pause</h4>
                  <p className="text-[11px] text-[#6F6A60]">Easily pause or skip before weekly roast cut-off.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#DDD2BF]/60">
                <ShieldCheck className="w-5 h-5 text-[#24493A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B28]">Cancel Anytime</h4>
                  <p className="text-[11px] text-[#6F6A60]">No contracts, minimum commitments, or fees.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Box Customizer & Checkout Trigger */}
          <div className="lg:col-span-5 sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD2BF] shadow-lg">
            <div className="border-b border-[#DDD2BF]/60 pb-5 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9633B]">
                Configure Your Shipment
              </span>
              <h3
                className="text-2xl font-bold text-[#2B2B28] mt-1"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {selectedProduct.title}
              </h3>
              <p className="text-xs text-[#6F6A60] mt-0.5">
                Next roast batch dispatch: <strong className="text-[#24493A]">{nextRoastDate}</strong>
              </p>
            </div>

            {/* Bag Weight Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-2">
                Bag Weight
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROASTER_CONFIG.commerce.bagWeights.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWeight(w.id as '12oz' | '2lb')}
                    className={`py-2.5 px-3 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                      selectedWeight === w.id
                        ? 'border-[#24493A] bg-[#24493A] text-white shadow-xs'
                        : 'border-[#DDD2BF] bg-[#FBF7F0] text-[#2B2B28] hover:border-[#24493A]'
                    }`}
                  >
                    <div>{w.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grind Option Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-2">
                Grind Selection
              </label>
              <div className="space-y-1.5">
                {ROASTER_CONFIG.commerce.grindOptions.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGrind(g.label)}
                    className={`w-full py-2 px-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedGrind === g.label
                        ? 'border-[#24493A] bg-[#24493A]/10 text-[#24493A] font-bold'
                        : 'border-[#DDD2BF] bg-white text-[#2B2B28] hover:bg-[#FBF7F0]'
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGrind === g.label && <Check className="w-3.5 h-3.5 text-[#24493A]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Frequency */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-2">
                Delivery Cadence
              </label>
              <div className="space-y-2">
                {ROASTER_CONFIG.commerce.subscriptionFrequencies.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFrequency(f.id)}
                    className={`w-full p-3 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      selectedFrequency === f.id
                        ? 'border-[#24493A] bg-[#24493A] text-white'
                        : 'border-[#DDD2BF] bg-[#FBF7F0] text-[#2B2B28] hover:border-[#24493A]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{f.label}</div>
                      <div className={selectedFrequency === f.id ? 'text-white/80' : 'text-[#6F6A60]'}>
                        {f.description}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedFrequency === f.id
                          ? 'bg-[#E69A3B] text-[#1F2A24]'
                          : 'bg-[#24493A]/10 text-[#24493A]'
                      }`}
                    >
                      Save {f.savingsPercent}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary & Primary CTA */}
            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#DDD2BF] mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-bold uppercase text-[#6F6A60]">Subscription Total</span>
                <div className="text-right">
                  {unitPrice < basePriceWithoutDiscount && (
                    <span className="text-sm line-through text-[#6F6A60] mr-2">
                      {formatCurrency(basePriceWithoutDiscount)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-[#24493A]">
                    {formatCurrency(unitPrice)}
                  </span>
                  <span className="text-xs text-[#6F6A60]"> / shipment</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#24493A]">
                <span className="flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5" /> Tracked expedited shipping
                </span>
                <span className="font-bold uppercase text-emerald-700">FREE ($5 Value)</span>
              </div>
              <p className="text-[11px] text-[#6F6A60] mt-2 border-t border-[#DDD2BF]/50 pt-2">
                {ROASTER_CONFIG.commerce.samplePriceDisclaimer}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubscribeNow}
              className="w-full py-4 px-6 rounded-2xl bg-[#24493A] hover:bg-[#1B372C] text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#24493A]"
            >
              <Calendar className="w-5 h-5 text-[#E69A3B]" />
              <span>Start My Subscription</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
