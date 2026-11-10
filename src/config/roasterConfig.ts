/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductOption {
  id: string;
  name: string;
  priceModifier: number; // in dollars
}

export interface CoffeeProduct {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  roastLevel: 'light' | 'medium' | 'dark' | 'roasters-choice';
  isSubscription: boolean;
  basePrice: number; // In dollars (Sample Price in demo mode)
  image: string;
  tastingNotes: string[];
  origin?: string;
  altitude?: string;
  process?: string;
  recommendedFor: string;
  isPopular?: boolean;
}

/**
 * Single configurable support email for the roastery.
 * In Demo Mode, shown with an explicit placeholder note ("hello@yourroastery.com (example)").
 */
export const SUPPORT_EMAIL = 'hello@yourroastery.com';

export function getDisplaySupportEmail(mode: 'demo' | 'live' = 'demo'): string {
  return mode === 'demo' ? `${SUPPORT_EMAIL} (example)` : SUPPORT_EMAIL;
}

export function getSupportEmailHref(): string {
  return `mailto:${SUPPORT_EMAIL}`;
}

export interface RoasterConfig {
  business: {
    name: string;
    tagline: string;
    badgeText: string;
    description: string;
    roastDays: string;
    shippingDays: string;
    contactEmail: string;
    supportHours: string;
    sampleNotice: string;
    locationNote: string;
  };
  commerce: {
    currency: string;
    currencySymbol: string;
    freeShippingThreshold: number; // e.g. $35
    standardShippingFee: number; // e.g. $5
    shippingRegion: string;
    socialLinks: {
      instagram: string;
      twitter: string;
      youtube: string;
    };
    samplePriceDisclaimer: string;
    subscriptionFrequencies: {
      id: '2-weeks' | '4-weeks' | '6-weeks';
      label: string;
      description: string;
      savingsPercent: number;
    }[];
    bagWeights: {
      id: '12oz' | '2lb';
      label: string;
      weightGrams: number;
      priceMultiplier: number;
    }[];
    grindOptions: {
      id: 'whole-bean' | 'pour-over' | 'drip' | 'french-press' | 'aeropress';
      label: string;
      recommendation: string;
    }[];
    coupons: {
      code: string;
      discountAmount: number;
      description: string;
    }[];
  };
  products: CoffeeProduct[];
}

export const ROASTER_CONFIG: RoasterConfig = {
  business: {
    name: 'Slow Roast Coffee Club',
    tagline: 'Craft Single-Origin & Mindful Home Brewing',
    badgeText: 'Independent Roaster Demo',
    description:
      'A customizable craft coffee club platform built for independent micro-roasters. Combines fresh subscription management, interactive origin discovery, and guided home brewing technique.',
    roastDays: 'Roasted every Monday morning',
    shippingDays: 'Hand-packed & dispatched every Tuesday',
    contactEmail: SUPPORT_EMAIL,
    supportHours: 'Monday–Friday, 9am–5pm PT (1 business day response)',
    sampleNotice: 'DEMO MODE: Sample products, pricing and simulated checkout. No real cards charged.',
    locationNote: 'Direct-Trade Sourcing • Roasted locally in small batches',
  },
  commerce: {
    currency: 'USD',
    currencySymbol: '$',
    freeShippingThreshold: 35.0,
    standardShippingFee: 5.0,
    shippingRegion: 'United States (All 50 States, Territories & APO/FPO addresses)',
    socialLinks: {
      instagram: 'https://instagram.com',
      twitter: 'https://x.com',
      youtube: 'https://youtube.com',
    },
    samplePriceDisclaimer: 'All prices shown are example rates for demonstration purposes.',
    subscriptionFrequencies: [
      {
        id: '4-weeks',
        label: 'Every 4 Weeks (Monthly)',
        description: 'Most popular for 1–2 cup daily drinkers (2 bags delivered post-roast).',
        savingsPercent: 10,
      },
      {
        id: '2-weeks',
        label: 'Every 2 Weeks',
        description: 'Ideal for multi-drinker households and serious espresso lovers.',
        savingsPercent: 12,
      },
      {
        id: '6-weeks',
        label: 'Every 6 Weeks',
        description: 'Gentle cadence for weekend pour-over enthusiasts.',
        savingsPercent: 8,
      },
    ],
    bagWeights: [
      {
        id: '12oz',
        label: '12 oz (340g) Standard Bag',
        weightGrams: 340,
        priceMultiplier: 1.0,
      },
      {
        id: '2lb',
        label: '2 lb (907g) Roaster Bulk Bag',
        weightGrams: 907,
        priceMultiplier: 2.3,
      },
    ],
    grindOptions: [
      {
        id: 'whole-bean',
        label: 'Whole Bean',
        recommendation: 'Recommended: Grinding fresh preserves fragile aromatics & sweetness',
      },
      {
        id: 'pour-over',
        label: 'Pour Over / V60 / Chemex',
        recommendation: 'Medium-Fine grind calibrated for 2:45–3:30 drawdown clarity',
      },
      {
        id: 'drip',
        label: 'Auto Drip / Batch Maker',
        recommendation: 'Medium grind for reliable daily balance without bitterness',
      },
      {
        id: 'french-press',
        label: 'French Press / Immersion / Cold Brew',
        recommendation: 'Coarse grind for clean metal filter extraction with zero silt',
      },
      {
        id: 'aeropress',
        label: 'AeroPress / Moka Pot',
        recommendation: 'Fine-Medium grind for rich, velvety crema and body',
      },
    ],
    coupons: [
      {
        code: 'FIRSTBOX',
        discountAmount: 5.0,
        description: '$5 off your initial sample box or order',
      },
      {
        code: 'ROAST10',
        discountAmount: 10.0,
        description: '10% sample roaster partner welcome code',
      },
    ],
  },
  products: [
    {
      id: 'sub-roasters-choice',
      title: "The Roaster's Choice Club",
      subtitle: 'Curated 2-Bag Monthly Rotation',
      description:
        'Our signature subscription: two fresh 12oz bags delivered days after Monday roasting, accompanied by our monthly printed technique masterclass card.',
      roastLevel: 'roasters-choice',
      isSubscription: true,
      basePrice: 36.0,
      image: '/Hero.jpg',
      tastingNotes: ['Monthly Curated Rotation', 'Seasonal Micro-Lots', 'Technique Print Guide'],
      recommendedFor: 'Home brewers wanting an effortless, rotating tour of fresh micro-lots.',
      isPopular: true,
    },
    {
      id: 'sub-single-origin',
      title: 'Single-Origin Terroir Explorer',
      subtitle: '100% Traceable High-Altitude Lots',
      description:
        'Direct-trade washed and natural micro-lots selected for sparkling acidity, floral aromatics, and distinct origin terroir.',
      roastLevel: 'light',
      isSubscription: true,
      basePrice: 38.0,
      image: '/public/assets/aistudio/Thumbnail_for_slowroast_5cb48c09.png',
      tastingNotes: ['Jasmine Floral', 'Meyer Lemon', 'Stone Fruit Brightness'],
      recommendedFor: 'V60, Kalita, and manual pour-over lovers seeking origin clarity.',
    },
    {
      id: 'sub-comfort-espresso',
      title: 'Comfort & Crema Reserve',
      subtitle: 'Velvety Medium-Dark Roast',
      description:
        'Caramelized brown sugar, melted baker’s cacao, and toasted hazelnuts designed to produce thick crema neat or cut through silky steamed milk.',
      roastLevel: 'medium',
      isSubscription: true,
      basePrice: 34.0,
      image: '/Bag.jpg',
      tastingNotes: ['Brown Sugar Panela', 'Milk Chocolate', 'Toasted Hazelnut'],
      recommendedFor: 'Espresso machines, Moka pot, French press, and daily morning mugs.',
    },
    {
      id: 'single-ethiopia-banko',
      title: 'Ethiopia Banko Gotiti Heirloom',
      subtitle: 'Single Bag • Gedeb District, Yirgacheffe',
      description:
        'Heirloom varietals grown at 2,150m. Washed and raised on sun-drying African beds for crystalline bergamot and delicate white peach notes.',
      roastLevel: 'light',
      isSubscription: false,
      basePrice: 19.5,
      image: '/public/assets/aistudio/Thumbnail_for_slowroast_5cb48c09.png',
      origin: 'Yirgacheffe, Ethiopia (2,150m)',
      altitude: '2,150m',
      process: 'Washed & Sun-Dried',
      tastingNotes: ['Jasmine Blossom', 'Bergamot Citrus', 'White Peach'],
      recommendedFor: 'Pour Over, AeroPress, Chemex',
    },
    {
      id: 'single-colombia-huila',
      title: 'Colombia Huila San Agustín',
      subtitle: 'Single Bag • Caturra & Colombia Varietals',
      description:
        'Volcanic Andean terroir delivering round apple crispness, panela sweetness, and creamy milk chocolate body.',
      roastLevel: 'medium',
      isSubscription: false,
      basePrice: 18.5,
      image: '/Hero.jpg',
      origin: 'Huila, Colombia (1,750m)',
      altitude: '1,750m',
      process: 'Fully Washed',
      tastingNotes: ['Red Apple', 'Warm Panela', 'Milk Chocolate'],
      recommendedFor: 'French Press, Auto-Drip, Pour Over',
    },
    {
      id: 'single-guatemala-antigua',
      title: 'Guatemala Antigua Volcanic Bourbon',
      subtitle: 'Single Bag • Mineral-Rich Volcanic Ash',
      description:
        'Classic shade-grown Bourbon from Antigua Valley with spiced cocoa, sweet clementine, and toasted almond depth.',
      roastLevel: 'dark',
      isSubscription: false,
      basePrice: 19.0,
      image: '/Bag.jpg',
      origin: 'Antigua Valley, Guatemala (1,600m)',
      altitude: '1,600m',
      process: 'Washed & Patio Dried',
      tastingNotes: ['Spiced Cacao', 'Clementine', 'Toasted Almond'],
      recommendedFor: 'Espresso, French Press, Moka Pot',
    },
  ],
};
