/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  evaluateCoupon,
  calculateOrderPricing,
  validateCheckoutForm,
  formatCurrency,
  generateDemoOrderId,
  getNextMondayRoastDate,
  transitionSubscriptionStatus,
  CartItem,
} from './commerceLogic.ts';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

test('calculateItemUnitPrice applies bag weight multiplier and subscription frequency savings', () => {
  const sampleProduct = ROASTER_CONFIG.products[0]; // basePrice: 36.0 (sub-roasters-choice)

  // Standard 12oz, no frequency
  const standardPrice = calculateItemUnitPrice(sampleProduct, '12oz', false);
  assert.equal(standardPrice, 36.0);

  // 2lb bulk bag (multiplier 2.3)
  const bulkPrice = calculateItemUnitPrice(sampleProduct, '2lb', false);
  assert.equal(bulkPrice, Number((36.0 * 2.3).toFixed(2)));

  // Subscription with 4-weeks frequency (10% savings)
  const subMonthlyPrice = calculateItemUnitPrice(sampleProduct, '12oz', true, '4-weeks');
  assert.equal(subMonthlyPrice, Number((36.0 * 0.9).toFixed(2)));
});

test('evaluateCoupon validates valid and invalid coupon codes', () => {
  // Empty or missing
  const empty = evaluateCoupon('', 50);
  assert.equal(empty.isValid, false);
  assert.equal(empty.discountAmount, 0);

  // Valid FIRSTBOX coupon ($5 fixed)
  const firstBox = evaluateCoupon('FIRSTBOX', 40);
  assert.equal(firstBox.isValid, true);
  assert.equal(firstBox.discountAmount, 5.0);

  // Valid ROAST10 coupon (10% off $50 = $5.00)
  const roast10 = evaluateCoupon('ROAST10', 50);
  assert.equal(roast10.isValid, true);
  assert.equal(roast10.discountAmount, 5.0);

  // Invalid coupon
  const invalid = evaluateCoupon('UNKNOWN999', 50);
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.discountAmount, 0);
});

test('calculateOrderPricing grants free shipping for subscriptions and orders over threshold', () => {
  const singleBag: CartItem = {
    id: 'item-1',
    productId: 'single-ethiopia-banko',
    title: 'Ethiopia Banko',
    subtitle: 'Single Bag',
    image: '',
    isSubscription: false,
    grind: 'Whole Bean',
    bagWeight: '12oz',
    unitPrice: 19.5,
    quantity: 1,
  };

  // Under $35 threshold without subscription -> $5 shipping
  const underThreshold = calculateOrderPricing([singleBag]);
  assert.equal(underThreshold.subtotal, 19.5);
  assert.equal(underThreshold.shipping, 5.0);
  assert.equal(underThreshold.isFreeShipping, false);
  assert.equal(underThreshold.amountNeededForFreeShipping, 15.5);

  // 2 bags ($39.00) -> Over $35 threshold -> Free shipping
  const overThreshold = calculateOrderPricing([{ ...singleBag, quantity: 2 }]);
  assert.equal(overThreshold.subtotal, 39.0);
  assert.equal(overThreshold.shipping, 0);
  assert.equal(overThreshold.isFreeShipping, true);
  assert.equal(overThreshold.amountNeededForFreeShipping, 0);

  // Subscription item ($32.40) under $35 threshold -> Always Free shipping
  const subItem: CartItem = {
    id: 'sub-item-1',
    productId: 'sub-roasters-choice',
    title: "Roaster's Choice",
    subtitle: 'Subscription',
    image: '',
    isSubscription: true,
    grind: 'Whole Bean',
    bagWeight: '12oz',
    frequency: '4-weeks',
    unitPrice: 32.4,
    quantity: 1,
  };
  const subOrder = calculateOrderPricing([subItem]);
  assert.equal(subOrder.shipping, 0);
  assert.equal(subOrder.isFreeShipping, true);
  assert.equal(subOrder.qualifiesForFreeShippingDueToSubscription, true);
});

test('validateCheckoutForm correctly validates required fields and email/postal formats', () => {
  const invalidForm = {
    fullName: '',
    email: 'bad-email',
    streetAddress: ' ',
    city: '',
    stateProvince: '',
    postalCode: 'invalid!#@',
    country: 'United States',
    paymentMethod: 'card-simulated' as const,
  };

  const validationResult = validateCheckoutForm(invalidForm);
  assert.equal(validationResult.isValid, false);
  assert.ok(validationResult.errors.fullName);
  assert.ok(validationResult.errors.email);
  assert.ok(validationResult.errors.streetAddress);
  assert.ok(validationResult.errors.city);
  assert.ok(validationResult.errors.stateProvince);
  assert.ok(validationResult.errors.postalCode);

  const validForm = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    streetAddress: '123 Artisan Way',
    city: 'Seattle',
    stateProvince: 'WA',
    postalCode: '98101',
    country: 'United States',
    paymentMethod: 'card-simulated' as const,
  };

  const validResult = validateCheckoutForm(validForm);
  assert.equal(validResult.isValid, true);
  assert.deepEqual(validResult.errors, {});
});

test('transitionSubscriptionStatus accurately transitions state and returns clear feedback', () => {
  const skipped = transitionSubscriptionStatus('active', 'skip');
  assert.equal(skipped.newStatus, 'skipped_next');

  const paused = transitionSubscriptionStatus('active', 'pause');
  assert.equal(paused.newStatus, 'paused');

  const resumed = transitionSubscriptionStatus('paused', 'resume');
  assert.equal(resumed.newStatus, 'active');

  const cancelled = transitionSubscriptionStatus('active', 'cancel');
  assert.equal(cancelled.newStatus, 'cancelled');
});

test('generateDemoOrderId and getNextMondayRoastDate return valid strings', () => {
  const orderId = generateDemoOrderId();
  assert.match(orderId, /^SR-\d{6}-\d{4}$/);

  const nextRoast = getNextMondayRoastDate();
  assert.ok(typeof nextRoast === 'string' && nextRoast.length > 0);
  assert.equal(formatCurrency(36.5), '$36.50');
});
