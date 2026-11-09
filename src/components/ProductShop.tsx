/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Coffee, Sparkles, Filter, Check } from 'lucide-react';
import { ROASTER_CONFIG, CoffeeProduct } from '../config/roasterConfig.ts';
import { useCart } from '../context/CartContext.tsx';
import { formatCurrency, calculateItemUnitPrice } from '../utils/commerceLogic.ts';

export function ProductShop() {
  const { addItem, openCart } = useCart();
  const [filter, setFilter] = useState<'all' | 'single-origin' | 'subscriptions'>('all');
  const [selectedGrinds, setSelectedGrinds] = useState<Record<string, string>>({});
  const [selectedWeights, setSelectedWeights] = useState<Record<string, '12oz' | '2lb'>>({});

  const products = ROASTER_CONFIG.products.filter((p) => {
    if (filter === 'single-origin') return !p.isSubscription;
    if (filter === 'subscriptions') return p.isSubscription;
    return true;
  });

  const getGrind = (productId: string) => selectedGrinds[productId] || 'Whole Bean';
  const getWeight = (productId: string) => selectedWeights[productId] || '12oz';

  const handleAddToCart = (product: CoffeeProduct) => {
    const grind = getGrind(product.id);
    const bagWeight = getWeight(product.id);
    addItem(product, {
      grind,
      bagWeight,
      quantity: 1,
      isSubscription: product.isSubscription,
      frequency: product.isSubscription ? '4-weeks' : undefined,
    });
    openCart();
  };

  return (
    <section
      id="shop-section"
      aria-labelledby="shop-heading"
      className="py-16 sm:py-24 bg-[#EFE7DA]/50 border-t border-[#DDD2BF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D9633B] mb-2">
              <Coffee className="w-3.5 h-3.5" />
              <span>Direct Micro-Lot Catalog</span>
            </div>
            <h2
              id="shop-heading"
              className="text-3xl sm:text-4xl font-semibold text-[#2B2B28] tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Order single bags or <span className="italic text-[#24493A]">reserve a batch</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6F6A60] mt-1">
              Sample roaster lineup. All coffees are roasted to order and nitrogen-flushed for peak aromatics.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#DDD2BF]/40 border border-[#DDD2BF]/80 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-[#24493A] shadow-xs'
                  : 'text-[#6F6A60] hover:text-[#2B2B28]'
              }`}
            >
              All Coffees ({ROASTER_CONFIG.products.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('single-origin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'single-origin'
                  ? 'bg-white text-[#24493A] shadow-xs'
                  : 'text-[#6F6A60] hover:text-[#2B2B28]'
              }`}
            >
              Single Bags
            </button>
            <button
              type="button"
              onClick={() => setFilter('subscriptions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'subscriptions'
                  ? 'bg-white text-[#24493A] shadow-xs'
                  : 'text-[#6F6A60] hover:text-[#2B2B28]'
              }`}
            >
              Club Subscriptions
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const currentGrind = getGrind(product.id);
            const currentWeight = getWeight(product.id);
            const price = calculateItemUnitPrice(
              product,
              currentWeight,
              product.isSubscription,
              product.isSubscription ? '4-weeks' : undefined
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#DDD2BF] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Card Header & Badge */}
                  <div className="p-6 pb-4 border-b border-[#DDD2BF]/40">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9633B]">
                        {product.isSubscription ? 'Monthly Subscription' : 'Single Bag Micro-Lot'}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#24493A]/10 text-[#24493A]">
                        {product.roastLevel.replace('-', ' ')}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-bold text-[#2B2B28]"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {product.title}
                    </h3>
                    <p className="text-xs text-[#6F6A60] mt-0.5">{product.subtitle}</p>
                  </div>

                  {/* Body & Tasting Notes */}
                  <div className="p-6 pt-4 space-y-4">
                    <p className="text-xs sm:text-sm text-[#6F6A60] leading-relaxed">
                      {product.description}
                    </p>

                    {/* Tasting Notes */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="text-[11px] font-medium text-[#2B2B28] bg-[#F1E8D8] px-2 py-0.5 rounded"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Origin & Altitude metadata if single origin */}
                    {product.origin && (
                      <div className="text-[11px] text-[#6F6A60] pt-2 border-t border-[#DDD2BF]/40 flex justify-between">
                        <span><strong>Origin:</strong> {product.origin}</span>
                        <span><strong>Process:</strong> {product.process}</span>
                      </div>
                    )}

                    {/* Weight & Grind Selectors */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <span className="block text-[11px] font-bold uppercase text-[#6F6A60] mb-1">
                          Bag Weight
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedWeights((prev) => ({ ...prev, [product.id]: '12oz' }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                              currentWeight === '12oz'
                                ? 'border-[#24493A] bg-[#24493A] text-white'
                                : 'border-[#DDD2BF] bg-[#FBF7F0] text-[#2B2B28]'
                            }`}
                          >
                            12 oz (340g)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedWeights((prev) => ({ ...prev, [product.id]: '2lb' }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                              currentWeight === '2lb'
                                ? 'border-[#24493A] bg-[#24493A] text-white'
                                : 'border-[#DDD2BF] bg-[#FBF7F0] text-[#2B2B28]'
                            }`}
                          >
                            2 lb Bulk
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[11px] font-bold uppercase text-[#6F6A60] mb-1">
                          Grind
                        </span>
                        <select
                          value={currentGrind}
                          onChange={(e) =>
                            setSelectedGrinds((prev) => ({ ...prev, [product.id]: e.target.value }))
                          }
                          aria-label={`Grind selection for ${product.title}`}
                          className="w-full text-xs py-2 px-3 rounded-lg border border-[#DDD2BF] bg-white text-[#2B2B28] focus:outline-none focus:ring-1 focus:ring-[#24493A]"
                        >
                          {ROASTER_CONFIG.commerce.grindOptions.map((g) => (
                            <option key={g.id} value={g.label}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Add to Cart */}
                <div className="p-6 pt-3 border-t border-[#DDD2BF]/40 bg-[#FBF7F0]/60 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xl font-bold text-[#24493A]">
                      {formatCurrency(price)}
                    </span>
                    <span className="block text-[10px] text-[#6F6A60]">(Sample Price)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="py-2.5 px-4 rounded-xl bg-[#24493A] hover:bg-[#1B372C] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#24493A]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E69A3B]" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
