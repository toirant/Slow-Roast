/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  PricingBreakdown,
  calculateOrderPricing,
  OrderRecord,
} from '../utils/commerceLogic.ts';
import { ROASTER_CONFIG, CoffeeProduct } from '../config/roasterConfig.ts';

export type PolicyType =
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms';

interface CartContextType {
  items: CartItem[];
  pricing: PricingBreakdown;
  couponCode: string;
  couponMessage: string;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isOwnerPortalOpen: boolean;
  activePolicy: PolicyType | null;
  mode: 'demo' | 'live';
  isStripeLiveConfigured: boolean;
  confirmedOrder: OrderRecord | null;
  addItem: (
    product: CoffeeProduct,
    options?: {
      bagWeight?: '12oz' | '2lb';
      grind?: string;
      frequency?: '2-weeks' | '4-weeks' | '6-weeks';
      quantity?: number;
      isSubscription?: boolean;
    }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openOwnerPortal: () => void;
  closeOwnerPortal: () => void;
  openPolicy: (policy: PolicyType) => void;
  closePolicy: () => void;
  setMode: (mode: 'demo' | 'live') => void;
  setConfirmedOrder: (order: OrderRecord | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Default initial sample item in cart so demo visitors immediately see cart state
    const defaultProduct = ROASTER_CONFIG.products[0];
    return [
      {
        id: 'initial-sub-roasters-choice',
        productId: defaultProduct.id,
        title: defaultProduct.title,
        subtitle: defaultProduct.subtitle,
        image: defaultProduct.image,
        isSubscription: true,
        grind: 'Whole Bean',
        bagWeight: '12oz',
        frequency: '4-weeks',
        unitPrice: 32.4, // 10% off $36
        quantity: 1,
      },
    ];
  });

  const [couponCode, setCouponCode] = useState<string>('FIRSTBOX');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [mode, setMode] = useState<'demo' | 'live'>('demo');
  const [isStripeLiveConfigured, setIsStripeLiveConfigured] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((cfg) => {
        if (cfg) {
          setIsStripeLiveConfigured(Boolean(cfg.isStripeLiveConfigured));
          // If server reports live stripe is not configured, default to demo mode
          if (!cfg.isStripeLiveConfigured) {
            setMode('demo');
          }
        }
      })
      .catch((err) => {
        console.warn('[CartContext] Could not load server config:', err);
      });
  }, []);

  const pricing = calculateOrderPricing(items, couponCode);

  const addItem = (
    product: CoffeeProduct,
    options?: {
      bagWeight?: '12oz' | '2lb';
      grind?: string;
      frequency?: '2-weeks' | '4-weeks' | '6-weeks';
      quantity?: number;
      isSubscription?: boolean;
    }
  ) => {
    const bagWeight = options?.bagWeight || '12oz';
    const grind = options?.grind || 'Whole Bean';
    const isSubscription =
      options?.isSubscription !== undefined
        ? options.isSubscription
        : product.isSubscription;
    const frequency = isSubscription ? options?.frequency || '4-weeks' : undefined;
    const quantity = options?.quantity || 1;

    // Calculate unit price
    const weightConfig =
      ROASTER_CONFIG.commerce.bagWeights.find((w) => w.id === bagWeight) ||
      ROASTER_CONFIG.commerce.bagWeights[0];

    let unitPrice = product.basePrice * weightConfig.priceMultiplier;
    if (isSubscription && frequency) {
      const freqConfig = ROASTER_CONFIG.commerce.subscriptionFrequencies.find(
        (f) => f.id === frequency
      );
      if (freqConfig) {
        unitPrice = unitPrice * (1 - freqConfig.savingsPercent / 100);
      }
    }
    unitPrice = Number(unitPrice.toFixed(2));

    const itemKey = `${product.id}-${bagWeight}-${grind}-${frequency || 'onetime'}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          title: product.title,
          subtitle: product.subtitle,
          image: product.image,
          isSubscription,
          grind,
          bagWeight,
          frequency,
          unitPrice,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const applyCoupon = (code: string) => {
    setCouponCode(code);
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        pricing,
        couponCode,
        couponMessage: couponCode ? 'Sample promo coupon applied' : '',
        isCartOpen,
        isCheckoutOpen,
        isOwnerPortalOpen,
        activePolicy,
        mode,
        isStripeLiveConfigured,
        confirmedOrder,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        openOwnerPortal: () => setIsOwnerPortalOpen(true),
        closeOwnerPortal: () => setIsOwnerPortalOpen(false),
        openPolicy: (policy: PolicyType) => setActivePolicy(policy),
        closePolicy: () => setActivePolicy(null),
        setMode,
        setConfirmedOrder,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
