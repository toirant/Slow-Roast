/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { formatCurrency } from '../utils/commerceLogic.ts';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

export function CartDrawer() {
  const {
    items,
    pricing,
    isCartOpen,
    closeCart,
    openCheckout,
    removeItem,
    updateQuantity,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const clean = inputCoupon.trim().toUpperCase();
    const valid = ROASTER_CONFIG.commerce.coupons.some((c) => c.code === clean);
    if (!valid) {
      setCouponError(`Code "${clean}" is not recognized.`);
      return;
    }
    setCouponError('');
    applyCoupon(clean);
    setInputCoupon('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your Shopping Cart"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF7F0] border-l border-[#DDD2BF] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#DDD2BF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#24493A]" />
              <h2
                className="text-xl font-bold text-[#2B2B28]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Your Coffee Cart
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#24493A]/10 text-[#24493A]">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 rounded-xl text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Alert */}
          <div className="px-6 py-3 bg-[#F1E8D8] border-b border-[#DDD2BF]/80 flex items-center gap-2.5 text-xs text-[#24493A]">
            <Truck className="w-4 h-4 text-[#D9633B] shrink-0" />
            {pricing.isFreeShipping ? (
              <span className="font-semibold text-emerald-800">
                You unlocked Free Tracked Expedited Shipping!
              </span>
            ) : (
              <span>
                Add <strong>{formatCurrency(pricing.amountNeededForFreeShipping)}</strong> more for
                free shipping (or add any subscription).
              </span>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#DDD2BF]/40 mx-auto flex items-center justify-center text-[#6F6A60]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-bold text-[#2B2B28]">Your cart is empty</h3>
                <p className="text-xs text-[#6F6A60] max-w-xs mx-auto">
                  Browse our freshly roasted single-origins or build your monthly coffee club subscription box.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#24493A] text-white text-xs font-bold hover:bg-[#1B372C] transition-colors cursor-pointer"
                >
                  Explore Coffees
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#DDD2BF] shadow-xs flex gap-3.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-bold text-[#2B2B28] truncate">{item.title}</h4>
                      <span className="text-sm font-bold text-[#24493A]">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-1.5 text-[11px] text-[#6F6A60]">
                      <span className="bg-[#F1E8D8] px-2 py-0.5 rounded font-medium">
                        {item.bagWeight}
                      </span>
                      <span className="bg-[#F1E8D8] px-2 py-0.5 rounded font-medium truncate max-w-[150px]">
                        {item.grind}
                      </span>
                      {item.isSubscription && item.frequency && (
                        <span className="bg-[#24493A]/10 text-[#24493A] px-2 py-0.5 rounded font-bold">
                          {item.frequency}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DDD2BF]/40">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-[#DDD2BF] rounded-lg bg-[#FBF7F0]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.title}`}
                          className="p-1 hover:bg-[#DDD2BF]/40 text-[#2B2B28] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#2B2B28]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.title}`}
                          className="p-1 hover:bg-[#DDD2BF]/40 text-[#2B2B28] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="text-xs text-[#6F6A60] hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#DDD2BF] bg-white space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-[#6F6A60] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Promo code (e.g. FIRSTBOX)"
                      aria-label="Discount coupon code"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#DDD2BF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#24493A] uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#24493A] text-white text-xs font-bold hover:bg-[#1B372C] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                {couponCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" /> Code &quot;{couponCode}&quot; active
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-emerald-900 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6F6A60] pt-2 border-t border-[#DDD2BF]/40">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2B2B28]">
                    {formatCurrency(pricing.subtotal)}
                  </span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#2B2B28]">
                    {pricing.shipping === 0 ? 'FREE' : formatCurrency(pricing.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-[#2B2B28]">
                    {formatCurrency(pricing.tax)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#24493A] pt-2 border-t border-[#DDD2BF]/60">
                  <span>Total</span>
                  <span>{formatCurrency(pricing.total)}</span>
                </div>
                <p className="text-[10px] text-[#6F6A60] italic">
                  {ROASTER_CONFIG.commerce.samplePriceDisclaimer}
                </p>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={openCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#24493A] hover:bg-[#1B372C] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#24493A]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#E69A3B]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
