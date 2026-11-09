/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ROASTER_CONFIG, type CoffeeProduct } from '../config/roasterConfig.ts';

export interface CartItem {
  id: string; // unique item uuid (product + grind + weight + frequency)
  productId: string;
  title: string;
  subtitle: string;
  image: string;
  isSubscription: boolean;
  grind: string;
  bagWeight: '12oz' | '2lb';
  frequency?: '2-weeks' | '4-weeks' | '6-weeks';
  unitPrice: number;
  quantity: number;
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  isFreeShipping: boolean;
  qualifiesForFreeShippingDueToSubscription: boolean;
  amountNeededForFreeShipping: number;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
  paymentMethod: 'card-simulated' | 'stripe-hosted';
}

export interface CheckoutFormErrors {
  fullName?: string;
  email?: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  pricing: PricingBreakdown;
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: 'confirmed' | 'processing' | 'shipped' | 'failed' | 'cancelled';
  mode: 'demo' | 'live';
  isSubscription: boolean;
  subscriptionStatus?: 'active' | 'paused' | 'skipped_next' | 'cancelled';
  nextRoastDate?: string;
}

/**
 * Calculates item unit price based on product base price, bag weight multiplier, and subscription savings
 */
export function calculateItemUnitPrice(
  product: CoffeeProduct,
  bagWeight: '12oz' | '2lb',
  isSubscription: boolean,
  frequency?: '2-weeks' | '4-weeks' | '6-weeks'
): number {
  const weightConfig =
    ROASTER_CONFIG.commerce.bagWeights.find((w) => w.id === bagWeight) ||
    ROASTER_CONFIG.commerce.bagWeights[0];

  let price = product.basePrice * weightConfig.priceMultiplier;

  if (isSubscription && frequency) {
    const freqConfig = ROASTER_CONFIG.commerce.subscriptionFrequencies.find(
      (f) => f.id === frequency
    );
    if (freqConfig) {
      price = price * (1 - freqConfig.savingsPercent / 100);
    }
  }

  return Number(price.toFixed(2));
}

/**
 * Validates a coupon code and returns discount amount or 0
 */
export function evaluateCoupon(
  code: string | undefined,
  subtotal: number
): { isValid: boolean; discountAmount: number; message: string } {
  if (!code || !code.trim()) {
    return { isValid: false, discountAmount: 0, message: '' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = ROASTER_CONFIG.commerce.coupons.find((c) => c.code === cleanCode);

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Coupon code "${cleanCode}" is invalid or expired.`,
    };
  }

  let discount = coupon.discountAmount;
  // If it's a percentage code (e.g., ROAST10):
  if (coupon.code === 'ROAST10') {
    discount = (subtotal * 10) / 100;
  }

  // Discount cannot exceed subtotal
  discount = Math.min(discount, subtotal);

  return {
    isValid: true,
    discountAmount: Number(discount.toFixed(2)),
    message: `${coupon.code} applied (${coupon.description})`,
  };
}

/**
 * Computes full order pricing breakdown including subtotal, discount, shipping, tax, and total.
 * Subscription orders always get free shipping as a member benefit.
 */
export function calculateOrderPricing(
  items: CartItem[],
  couponCode?: string
): PricingBreakdown {
  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * Math.max(1, item.quantity),
    0
  );
  const subtotal = Number(rawSubtotal.toFixed(2));

  const couponResult = evaluateCoupon(couponCode, subtotal);
  const discount = couponResult.discountAmount;

  const hasSubscription = items.some((item) => item.isSubscription);
  const threshold = ROASTER_CONFIG.commerce.freeShippingThreshold;

  let isFreeShipping = false;
  let shipping = 0;

  if (items.length === 0) {
    isFreeShipping = false;
    shipping = 0;
  } else if (hasSubscription) {
    isFreeShipping = true;
    shipping = 0;
  } else if (subtotal - discount >= threshold) {
    isFreeShipping = true;
    shipping = 0;
  } else {
    isFreeShipping = false;
    shipping = ROASTER_CONFIG.commerce.standardShippingFee;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  // Estimated sample sales tax: 8.5%
  const tax = Number((taxableAmount * 0.085).toFixed(2));
  const total = Number((taxableAmount + shipping + tax).toFixed(2));

  const amountNeededForFreeShipping =
    !hasSubscription && !isFreeShipping
      ? Number(Math.max(0, threshold - (subtotal - discount)).toFixed(2))
      : 0;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
    isFreeShipping,
    qualifiesForFreeShippingDueToSubscription: hasSubscription,
    amountNeededForFreeShipping,
  };
}

/**
 * Validates checkout form data
 */
export function validateCheckoutForm(data: CheckoutFormData): {
  isValid: boolean;
  errors: CheckoutFormErrors;
} {
  const errors: CheckoutFormErrors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address for roast notifications.';
  }

  if (!data.streetAddress || data.streetAddress.trim().length < 4) {
    errors.streetAddress = 'Please enter a complete street address.';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Please enter your city.';
  }

  if (!data.stateProvince || data.stateProvince.trim().length < 2) {
    errors.stateProvince = 'Please provide your state or province.';
  }

  const zipRegex = /^[0-9A-Za-z -]{3,10}$/;
  if (!data.postalCode || !zipRegex.test(data.postalCode.trim())) {
    errors.postalCode = 'Please enter a valid postal or ZIP code.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats a monetary amount into standard display string
 */
export function formatCurrency(amount: number, currencySymbol: string = '$'): string {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

/**
 * Generates deterministic or unique simulated Order ID
 */
export function generateDemoOrderId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SR-${dateStr}-${randomSuffix}`;
}

/**
 * Calculates next upcoming Monday roast date
 */
export function getNextMondayRoastDate(from: Date = new Date()): string {
  const date = new Date(from);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7;
  date.setDate(date.getDate() + daysUntilMonday);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Handles customer portal subscription state updates (skip, pause, resume, cancel)
 */
export function transitionSubscriptionStatus(
  currentStatus: 'active' | 'paused' | 'skipped_next' | 'cancelled',
  action: 'skip' | 'pause' | 'resume' | 'cancel'
): {
  newStatus: 'active' | 'paused' | 'skipped_next' | 'cancelled';
  message: string;
} {
  switch (action) {
    case 'skip':
      return {
        newStatus: 'skipped_next',
        message: 'Next month’s shipment skipped. Your subscription will resume automatically after that.',
      };
    case 'pause':
      return {
        newStatus: 'paused',
        message: 'Subscription paused. No charges or shipments will occur until you resume.',
      };
    case 'resume':
      return {
        newStatus: 'active',
        message: 'Subscription reactivated! Next batch will roast this coming Monday.',
      };
    case 'cancel':
      return {
        newStatus: 'cancelled',
        message: 'Subscription cancelled. You will not be billed again.',
      };
    default:
      return {
        newStatus: currentStatus,
        message: 'No status change applied.',
      };
  }
}
