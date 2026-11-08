/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrewMethodType = 'pour-over' | 'aeropress' | 'french-press';
export type BrewMethodFilter = 'all' | BrewMethodType;

export interface RecentBrew {
  id: string;
  name: string;
  origin: string;
  flagEmoji: string;
  roastLevel: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  receivedMonth: string;
  rating: number; // 1 to 5 (0 = unrated)
  tastingNotes: string[];
  brewMethod: BrewMethodType;
  brewMethodLabel: string;
  brewRecommendation: string;
  roastBadgeColor: string; // Tailwind class
}

export const DEFAULT_RECENT_BREWS: RecentBrew[] = [
  {
    id: 'brew-nov-ethiopia',
    name: 'Banko Gotiti Heirloom',
    origin: 'Yirgacheffe, Ethiopia',
    flagEmoji: '🇪🇹',
    roastLevel: 'Light',
    receivedMonth: 'November (Issue 04)',
    rating: 5,
    tastingNotes: ['Jasmine Blossom', 'Bergamot', 'White Peach'],
    brewMethod: 'pour-over',
    brewMethodLabel: 'Pour Over',
    brewRecommendation: 'Pour Over • 1:16 ratio',
    roastBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'brew-oct-colombia',
    name: 'Finca El Mirador Pink Bourbon',
    origin: 'Huila, Colombia',
    flagEmoji: '🇨🇴',
    roastLevel: 'Medium',
    receivedMonth: 'October (Issue 03)',
    rating: 4,
    tastingNotes: ['Cane Panela', 'Red Apple', 'Milk Chocolate'],
    brewMethod: 'aeropress',
    brewMethodLabel: 'AeroPress',
    brewRecommendation: 'AeroPress / Chemex • 1:15 ratio',
    roastBadgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'brew-sep-guatemala',
    name: 'Finca Medina Volcanic Bourbon',
    origin: 'Antigua Valley, Guatemala',
    flagEmoji: '🇬🇹',
    roastLevel: 'Medium-Dark',
    receivedMonth: 'September (Issue 02)',
    rating: 5,
    tastingNotes: ['Spiced Cocoa', 'Clementine', 'Toasted Hazelnut'],
    brewMethod: 'french-press',
    brewMethodLabel: 'French Press',
    brewRecommendation: 'French Press / Moka Pot • 1:14 ratio',
    roastBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
];

/**
 * Validates rating values between 1 and 5
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Pure function to update a coffee's rating immutably
 */
export function updateBrewRating(
  brews: RecentBrew[],
  brewId: string,
  newRating: number
): RecentBrew[] {
  if (!isValidRating(newRating)) {
    return brews;
  }
  return brews.map((brew) => {
    if (brew.id === brewId) {
      return { ...brew, rating: newRating };
    }
    return brew;
  });
}

/**
 * Pure filter function to filter brews by method
 */
export function filterBrewsByMethod(
  brews: RecentBrew[],
  filter: BrewMethodFilter
): RecentBrew[] {
  if (filter === 'all') {
    return brews;
  }
  return brews.filter((brew) => brew.brewMethod === filter);
}

export interface BrewMethodOption {
  id: BrewMethodFilter;
  label: string;
  count: number;
}

/**
 * Generates options for the method filter with counts
 */
export function getBrewMethodOptions(brews: RecentBrew[]): BrewMethodOption[] {
  return [
    {
      id: 'all',
      label: 'All Methods',
      count: brews.length,
    },
    {
      id: 'pour-over',
      label: 'Pour Over',
      count: brews.filter((b) => b.brewMethod === 'pour-over').length,
    },
    {
      id: 'aeropress',
      label: 'AeroPress',
      count: brews.filter((b) => b.brewMethod === 'aeropress').length,
    },
    {
      id: 'french-press',
      label: 'French Press',
      count: brews.filter((b) => b.brewMethod === 'french-press').length,
    },
  ];
}

/**
 * Generates personalized roaster feedback based on the star rating
 */
export function getRatingFeedback(rating: number, coffeeName: string): string {
  switch (rating) {
    case 5:
      return `Loved ${coffeeName}! We'll prioritize similar bright, sweet micro-lots for your next box.`;
    case 4:
      return `Great feedback! We've tuned your profile toward this balance for upcoming deliveries.`;
    case 3:
      return `Noted on ${coffeeName}. We'll adjust acidity and roast depth for your next selection.`;
    case 2:
    case 1:
      return `Thanks for the honest take on ${coffeeName}! We'll steer future batches away from this style.`;
    default:
      return `Rating recorded for ${coffeeName}.`;
  }
}

/**
 * Calculates average rating across rated coffees
 */
export function calculateAverageRating(brews: RecentBrew[]): number {
  const rated = brews.filter((b) => b.rating > 0);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((acc, b) => acc + b.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}
