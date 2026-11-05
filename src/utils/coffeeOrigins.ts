/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoffeeOrigin {
  id: string;
  month: string;
  issueNumber: string;
  country: string;
  region: string;
  flagEmoji: string;
  farmOrCoop: string;
  farmer: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  elevationFeet: number;
  varietal: string;
  process: string;
  roastProfile: 'Light' | 'Medium' | 'Medium-Dark';
  harvestWindow: string;
  tastingNotes: string[];
  terroirStory: string;
  flavorAccentColor: string; // Hex color matching brand
  accentBadgeColor: string;
}

export const LAST_THREE_MONTHS_ORIGINS: CoffeeOrigin[] = [
  {
    id: 'ethiopia-yirgacheffe',
    month: 'November',
    issueNumber: 'Issue 04',
    country: 'Ethiopia',
    region: 'Yirgacheffe (Gedeb District)',
    flagEmoji: '🇪🇹',
    farmOrCoop: 'Banko Gotiti Washing Station',
    farmer: '650 smallholder heirloom growers',
    lat: 5.92,
    lng: 38.38,
    elevationMeters: 2150,
    elevationFeet: 7050,
    varietal: 'Dega & Kudhume (Wild Heirloom)',
    process: 'Washed & African Bed Sun-Dried (18 days)',
    roastProfile: 'Light',
    harvestWindow: 'Nov – Jan',
    tastingNotes: ['Jasmine Blossom', 'Bergamot Citrus', 'Wild White Peach'],
    terroirStory:
      'High-altitude red clay soil in the misty highlands of Yirgacheffe yields tea-like delicacy, floral brightness, and crystalline clarity in the cup.',
    flavorAccentColor: '#E69A3B', // Amber
    accentBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'colombia-huila',
    month: 'October',
    issueNumber: 'Issue 03',
    country: 'Colombia',
    region: 'Huila (San Agustín)',
    flagEmoji: '🇨🇴',
    farmOrCoop: 'Finca El Mirador',
    farmer: 'Rodrigo Sanchez & Family',
    lat: 1.88,
    lng: -76.27,
    elevationMeters: 1850,
    elevationFeet: 6070,
    varietal: 'Pink Bourbon (Rare Mutation)',
    process: '36-Hour Anaerobic Honey Fermentation',
    roastProfile: 'Medium',
    harvestWindow: 'Apr – Jul',
    tastingNotes: ['Cane Panela', 'Honey Crisp Apple', 'Velvety Milk Chocolate'],
    terroirStory:
      'Nestled in the Colombian Andes where the Magdalena river originates. Micro-climates and volcanic mineral reserves bring dense sweetness and silky body.',
    flavorAccentColor: '#D9633B', // Terracotta
    accentBadgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'guatemala-antigua',
    month: 'September',
    issueNumber: 'Issue 02',
    country: 'Guatemala',
    region: 'Antigua Valley (Sacatepéquez)',
    flagEmoji: '🇬🇹',
    farmOrCoop: 'Finca Medina Estate',
    farmer: 'Third-generation agronomist Eduardo Cabrera',
    lat: 14.56,
    lng: -90.73,
    elevationMeters: 1720,
    elevationFeet: 5640,
    varietal: 'Bourbon & Caturra (Shade Grown)',
    process: 'Fully Washed with Volcanic Spring Water',
    roastProfile: 'Medium-Dark',
    harvestWindow: 'Dec – Feb',
    tastingNotes: ['Spiced Cocoa', 'Candied Clementine', 'Roasted Hazelnut'],
    terroirStory:
      'Framed by three volcanoes (Agua, Fuego, and Acatenango). The rich pumice soil retains moisture and delivers a balanced, comforting, chocolate-forward cup.',
    flavorAccentColor: '#24493A', // Forest Green
    accentBadgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
];

/**
 * World Map SVG ViewBox Configuration
 * Using standard 760 x 380 coordinate projection
 */
export const MAP_DIMENSIONS = {
  width: 760,
  height: 380,
  minLng: -175,
  maxLng: 185,
  minLat: -60,
  maxLat: 80,
};

/**
 * Maps latitude and longitude to SVG X/Y coordinates using Equirectangular projection
 */
export function projectCoordinates(
  lat: number,
  lng: number,
  width: number = MAP_DIMENSIONS.width,
  height: number = MAP_DIMENSIONS.height
): { x: number; y: number } {
  // Clamping
  const clampedLng = Math.max(MAP_DIMENSIONS.minLng, Math.min(MAP_DIMENSIONS.maxLng, lng));
  const clampedLat = Math.max(MAP_DIMENSIONS.minLat, Math.min(MAP_DIMENSIONS.maxLat, lat));

  // Normalized (0 to 1)
  const normX = (clampedLng - MAP_DIMENSIONS.minLng) / (MAP_DIMENSIONS.maxLng - MAP_DIMENSIONS.minLng);
  // Latitude goes from +maxLat (top, y=0) to minLat (bottom, y=height)
  const normY = (MAP_DIMENSIONS.maxLat - clampedLat) / (MAP_DIMENSIONS.maxLat - MAP_DIMENSIONS.minLat);

  return {
    x: Math.round(normX * width * 10) / 10,
    y: Math.round(normY * height * 10) / 10,
  };
}

/**
 * Calculates geographic distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Returns the Coffee Belt latitude bounds in SVG Y coordinates.
 * The "Bean Belt" is strictly bounded between 23.5° N (Tropic of Cancer)
 * and 23.5° S (Tropic of Capricorn).
 */
export function getCoffeeBeltYBounds(
  height: number = MAP_DIMENSIONS.height
): { yTop: number; yBottom: number; height: number } {
  const topPoint = projectCoordinates(23.5, 0, MAP_DIMENSIONS.width, height);
  const bottomPoint = projectCoordinates(-23.5, 0, MAP_DIMENSIONS.width, height);
  return {
    yTop: topPoint.y,
    yBottom: bottomPoint.y,
    height: Math.round((bottomPoint.y - topPoint.y) * 10) / 10,
  };
}

/**
 * Finds an origin by ID or returns the first one as default
 */
export function getOriginById(id: string, origins = LAST_THREE_MONTHS_ORIGINS): CoffeeOrigin {
  return origins.find((o) => o.id === id) || origins[0];
}

/**
 * Returns formatted altitude badge string
 */
export function formatAltitude(origin: CoffeeOrigin): string {
  return `${origin.elevationMeters.toLocaleString()}m (${origin.elevationFeet.toLocaleString()}ft)`;
}
