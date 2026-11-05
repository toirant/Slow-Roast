/**
 * Pure business logic for Slow Roast Coffee Club subscription calculation,
 * roast profile pairing, and sample box details.
 */

export type RoastLevel = 'light' | 'medium' | 'dark';
export type BrewMethod = 'pour over' | 'french press' | 'espresso';

export interface PlanConfig {
  bagsPerMonth: number;
  basePricePerBag: number;
  freeShippingFirstMonth: boolean;
  shippingRate: number;
}

export const DEFAULT_PLAN_CONFIG: PlanConfig = {
  bagsPerMonth: 2,
  basePricePerBag: 18,
  freeShippingFirstMonth: true,
  shippingRate: 5,
};

export interface PriceBreakdown {
  coffeeSubtotal: number;
  shippingFee: number;
  totalFirstMonth: number;
  regularMonthlyTotal: number;
  savings: number;
}

export function calculateSubscriptionPrice(
  config: PlanConfig = DEFAULT_PLAN_CONFIG,
  isFirstMonth = true
): PriceBreakdown {
  const coffeeSubtotal = config.bagsPerMonth * config.basePricePerBag;
  const shippingFee = isFirstMonth && config.freeShippingFirstMonth ? 0 : config.shippingRate;
  const totalFirstMonth = coffeeSubtotal;
  const regularMonthlyTotal = coffeeSubtotal + config.shippingRate;
  const savings = config.shippingRate;

  return {
    coffeeSubtotal,
    shippingFee,
    totalFirstMonth,
    regularMonthlyTotal,
    savings,
  };
}

export interface Recommendation {
  grindRecommendation: string;
  waterRatio: string;
  brewGuideTitle: string;
  suggestedRoast: RoastLevel;
}

export function getBrewRecommendation(method: BrewMethod): Recommendation {
  switch (method) {
    case 'pour over':
      return {
        grindRecommendation: 'Medium-fine (table salt consistency)',
        waterRatio: '1:16 (15g coffee to 240g water)',
        brewGuideTitle: 'Mastering the Spiral Pour & Bloom',
        suggestedRoast: 'light',
      };
    case 'french press':
      return {
        grindRecommendation: 'Coarse (sea salt crystals)',
        waterRatio: '1:15 (30g coffee to 450g water)',
        brewGuideTitle: 'The 4-Minute Immersion & Gentle Plunge',
        suggestedRoast: 'medium',
      };
    case 'espresso':
      return {
        grindRecommendation: 'Fine (powdered sugar feel with slight grit)',
        waterRatio: '1:2 ratio (18g dry in, 36g liquid out in 28-32s)',
        brewGuideTitle: 'Dialing Pressure, Flow & Puck Prep',
        suggestedRoast: 'dark',
      };
  }
}

export interface SampleBoxCoffee {
  name: string;
  origin: string;
  altitude: string;
  notes: string[];
  process: string;
}

export function getSampleBoxDetails() {
  const coffees: SampleBoxCoffee[] = [
    {
      name: 'Girma Eshetu Lot #4',
      origin: 'Yirgacheffe, Ethiopia',
      altitude: '2,150m',
      notes: ['Bergamot', 'Peach Blossom', 'Meyer Lemon'],
      process: 'Washed, raised bed dried',
    },
    {
      name: 'Finca Las Nubes',
      origin: 'Huila, Colombia',
      altitude: '1,850m',
      notes: ['Dulce de Leche', 'Red Apple', 'Toasted Hazelnut'],
      process: 'Double anaerobic fermentation',
    },
  ];

  return {
    edition: 'Issue 04, November',
    theme: 'Clarity & Altitude',
    coffees,
    includedGuide: 'Guide #12: Unlocking Sweetness with Temperature Profiling',
    storyCard: 'Direct trade relationship with independent grower Girma Eshetu',
  };
}
