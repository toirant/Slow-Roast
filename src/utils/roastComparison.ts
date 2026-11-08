/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoastType = 'light' | 'medium' | 'dark';

export interface RoastProfileDetail {
  key: RoastType;
  name: string;
  tagline: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  beanColorHex: string;
  acidityLevel: number; // 1-5 scale
  bodyLevel: number; // 1-5 scale
  sweetnessLevel: number; // 1-5 scale
  roastTemp: string;
  developmentTime: string;
  primaryNotes: string[];
  aromaProfile: string;
  bestBrewMethods: string[];
  milkPairing: string;
  roasterRecommendation: string;
  idealFor: string;
}

export interface ComparisonRow {
  id: string;
  label: string;
  category: 'flavor' | 'sensory' | 'technique';
  description?: string;
}

export const ROAST_PROFILES: Record<RoastType, RoastProfileDetail> = {
  light: {
    key: 'light',
    name: 'Light Roast',
    tagline: 'Floral, crisp & origin-forward',
    color: '#E69A3B',
    badgeBg: 'bg-[#E69A3B]/10 text-[#C47820]',
    badgeBorder: 'border-[#E69A3B]/30',
    beanColorHex: '#B27845',
    acidityLevel: 5,
    bodyLevel: 2,
    sweetnessLevel: 4,
    roastTemp: '196°C – 205°C',
    developmentTime: 'Dropped right at the end of 1st crack',
    primaryNotes: ['Jasmine Blossom', 'Meyer Lemon', 'White Peach', 'Bergamot'],
    aromaProfile: 'Bright, perfumed, citrus zest & crisp green tea aromatics',
    bestBrewMethods: ['Pour Over (V60)', 'Chemex', 'Kalita Wave'],
    milkPairing: 'Best enjoyed black to preserve delicate floral subtleties',
    roasterRecommendation: 'Highlighting wild micro-lot terroirs of Ethiopia & Kenya highlands.',
    idealFor: 'Home brewers who prize sparkling fruit clarity, origin terroir, and tea-like elegance.',
  },
  medium: {
    key: 'medium',
    name: 'Medium Roast',
    tagline: 'Sweet, caramelized & harmonious',
    color: '#D9633B',
    badgeBg: 'bg-[#D9633B]/10 text-[#D9633B]',
    badgeBorder: 'border-[#D9633B]/30',
    beanColorHex: '#7C4828',
    acidityLevel: 3,
    bodyLevel: 3,
    sweetnessLevel: 5,
    roastTemp: '210°C – 219°C',
    developmentTime: 'Extended caramelization between cracks',
    primaryNotes: ['Caramel Panela', 'Milk Chocolate', 'Crisp Red Apple', 'Toasted Hazelnut'],
    aromaProfile: 'Rich warm baking spice, browned butter, and melted cacao',
    bestBrewMethods: ['AeroPress', 'Auto-Drip', 'Clever Dripper', 'French Press'],
    milkPairing: 'Superb both neat and with a splash of oat or dairy milk',
    roasterRecommendation: 'Our daily signature sweet spot for Colombian & Central American lots.',
    idealFor: 'Anyone looking for round sweetness, rich velvety body, and comforting daily balance.',
  },
  dark: {
    key: 'dark',
    name: 'Dark Roast',
    tagline: 'Bold, smoky-sweet & syrupy',
    color: '#24493A',
    badgeBg: 'bg-[#24493A]/10 text-[#24493A]',
    badgeBorder: 'border-[#24493A]/30',
    beanColorHex: '#3D2619',
    acidityLevel: 1,
    bodyLevel: 5,
    sweetnessLevel: 3,
    roastTemp: '225°C – 230°C',
    developmentTime: 'Pushed into 2nd crack for deep aromatic oils',
    primaryNotes: ['Dark Cacao Nibs', 'Toasted Walnut', 'Molasses', 'Syrupy Crema'],
    aromaProfile: 'Toasty campfire, dark baker’s chocolate, and smoky cedar',
    bestBrewMethods: ['Espresso', 'Stovetop Moka Pot', 'Cold Brew', 'French Press'],
    milkPairing: 'Cuts through steamed milk and cream for dense, velvety lattes and cappuccinos',
    roasterRecommendation: 'Artisan slow-roasted volcanic soils of Guatemala and Sumatra.',
    idealFor: 'Lover of bold morning strength, low acid, thick syrupy crema, and milk-based drinks.',
  },
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  { id: 'primaryNotes', label: 'Primary Flavor Notes', category: 'flavor', description: 'Dominant tasting notes unlocked in the cup' },
  { id: 'acidityLevel', label: 'Acidity & Brightness', category: 'sensory', description: 'Sparkling fruit-forward tang vs. smooth mellow finish' },
  { id: 'bodyLevel', label: 'Body & Mouthfeel', category: 'sensory', description: 'Tea-like delicacy vs. syrupy heavy coating' },
  { id: 'sweetnessLevel', label: 'Natural Sweetness', category: 'sensory', description: 'Raw sugarcane & honey vs. deep caramelized sugars' },
  { id: 'developmentTime', label: 'Roast Development', category: 'technique', description: 'Time and heat curve during drum development' },
  { id: 'bestBrewMethods', label: 'Recommended Gear', category: 'technique', description: 'Brew methods that best flatter this roast profile' },
  { id: 'milkPairing', label: 'Milk & Dairy Pairing', category: 'flavor', description: 'How this roast interacts with oat milk, dairy, or cream' },
  { id: 'idealFor', label: 'Best Suited For', category: 'flavor', description: 'The kind of morning ritual this profile is crafted for' },
];

/**
 * Returns all roast profile details in order: Light, Medium, Dark.
 */
export function getAllRoastProfiles(): RoastProfileDetail[] {
  return [ROAST_PROFILES.light, ROAST_PROFILES.medium, ROAST_PROFILES.dark];
}

/**
 * Returns a specific roast profile by key or falls back to medium.
 */
export function getRoastProfile(key: string): RoastProfileDetail {
  if (key === 'light' || key === 'medium' || key === 'dark') {
    return ROAST_PROFILES[key];
  }
  return ROAST_PROFILES.medium;
}

/**
 * Formats a rating score (1-5) into filled vs unfilled count descriptor.
 */
export function formatScoreMeter(score: number, maxScore = 5): { filled: number; unfilled: number; percentage: number } {
  const clamped = Math.max(0, Math.min(maxScore, score));
  return {
    filled: clamped,
    unfilled: maxScore - clamped,
    percentage: Math.round((clamped / maxScore) * 100),
  };
}

/**
 * Recommends a roast profile based on user's preference criteria.
 */
export function suggestRoastByFlavorPreference(criteria: {
  wantsLowAcidity?: boolean;
  prefersMilkDrinks?: boolean;
  lovesFloralFruit?: boolean;
}): RoastType {
  if (criteria.lovesFloralFruit) {
    return 'light';
  }
  if (criteria.prefersMilkDrinks || criteria.wantsLowAcidity) {
    return 'dark';
  }
  return 'medium';
}
