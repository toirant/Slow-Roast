/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrewingSchoolMethodId = 'pour-over' | 'french-press' | 'aeropress';

export interface SchoolStep {
  stepNumber: number;
  title: string;
  timeRange: string;
  action: string;
  targetWaterFraction: number; // fraction of total brew water (e.g. 0.20 for bloom)
  proTip: string;
  sensoryCue: string;
}

export interface ServingPreset {
  label: string;
  coffeeGrams: number;
  yieldDesc: string;
}

export interface TroubleshootingItem {
  problem: string;
  diagnosis: string;
  fix: string;
}

export interface BrewingMethodGuide {
  id: BrewingSchoolMethodId;
  name: string;
  subtitle: string;
  tagline: string;
  idealRoast: string;
  cupProfile: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  ratioMultiplier: number; // e.g. 15 for 1:15 ratio
  ratioDisplay: string;
  grindSize: string;
  grindTexture: string;
  waterTemp: string;
  totalTime: string;
  servings: ServingPreset[];
  equipment: string[];
  steps: SchoolStep[];
  troubleshooting: TroubleshootingItem[];
}

export const BREWING_SCHOOL_GUIDES: Record<BrewingSchoolMethodId, BrewingMethodGuide> = {
  'pour-over': {
    id: 'pour-over',
    name: 'Pour Over',
    subtitle: 'V60 / Kalita / Chemex',
    tagline: 'Precision extraction highlighting floral nuance, fruit clarity & sparkling brightness.',
    idealRoast: 'Light to Medium Roast',
    cupProfile: 'Clean, tea-like delicacy, crisp citrus acidity, crystalline origin clarity.',
    difficulty: 'Intermediate',
    ratioMultiplier: 15,
    ratioDisplay: '1:15',
    grindSize: 'Medium-Fine',
    grindTexture: 'Similar to table sea salt or sand crystals',
    waterTemp: '92°C – 94°C (198°F – 201°F)',
    totalTime: '3:00 – 3:30',
    servings: [
      { label: 'Single Cup (250ml)', coffeeGrams: 16.5, yieldDesc: 'One generous 8oz mug' },
      { label: 'Standard Mug (300ml)', coffeeGrams: 20, yieldDesc: 'One 10oz artisanal mug' },
      { label: 'Two Cups (500ml)', coffeeGrams: 33, yieldDesc: 'Shared morning carafe (16oz)' },
    ],
    equipment: [
      'Cone dripper (Hario V60 02 or Kalita Wave)',
      'Pre-folded paper filter (rinsed)',
      'Gooseneck kettle with narrow spout',
      'Digital gram scale with built-in timer',
      'Ceramic server or insulated carafe',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Filter Rinse & Thermal Pre-Heat',
        timeRange: 'Prep',
        action: 'Seat filter in cone and rinse thoroughly with hot water. Discard rinse water before adding freshly ground coffee.',
        targetWaterFraction: 0,
        proTip: 'Rinsing washes away papery woody taste and pre-heats ceramic brewer walls for stable extraction temps.',
        sensoryCue: 'Smooth paper adhering tightly to dripper flutes with no air pockets.',
      },
      {
        stepNumber: 2,
        title: 'The Bloom & Degassing',
        timeRange: '0:00 – 0:45',
        action: 'Start timer. Pour triple the coffee weight in outward spirals (e.g. 60g water for 20g coffee). Give dripper one gentle swirl.',
        targetWaterFraction: 0.20,
        proTip: 'Fresh beans contain trapped carbon dioxide from roasting. The bloom releases CO2 so water can extract sweet sugars.',
        sensoryCue: 'Puffing, bubbling dome bed with fragrant honeyed floral aromas.',
      },
      {
        stepNumber: 3,
        title: 'First Concentric Pour',
        timeRange: '0:45 – 1:30',
        action: 'Pour steadily in concentric circles from center outward, stopping 5mm before filter walls. Pour up to 60% of total target weight.',
        targetWaterFraction: 0.60,
        proTip: 'Keep kettle spout low (2–3cm above coffee bed) to prevent surface splashing and preserve laminar water flow.',
        sensoryCue: 'Gentle golden crema ring floating evenly on coffee slurry.',
      },
      {
        stepNumber: 4,
        title: 'Second Gentle Pour',
        timeRange: '1:30 – 2:15',
        action: 'Pour remainder of brew water gently in smooth circles up to final scale weight. Wash down any high clinging grounds.',
        targetWaterFraction: 1.0,
        proTip: 'Avoid pouring directly onto the paper filter ribs, which causes water to bypass the coffee bed.',
        sensoryCue: 'Uniform amber slurry level slowly beginning smooth descent.',
      },
      {
        stepNumber: 5,
        title: 'Drawdown & Flat Bed Finish',
        timeRange: '2:15 – 3:00',
        action: 'Give dripper one single gentle clockwise swirl. Let gravity pull water completely through until bed stops dripping.',
        targetWaterFraction: 1.0,
        proTip: 'A perfectly flat bed indicates uniform water distribution without channeling channels or uneven extraction holes.',
        sensoryCue: 'Flat, uniform coffee bed resembling moist sand; sweet steam rising.',
      },
    ],
    troubleshooting: [
      {
        problem: 'Cup tastes astringent, bitter, or dry on finish',
        diagnosis: 'Over-extraction caused by grinding too fine or brewing too long (> 3:45).',
        fix: 'Adjust grinder 1–2 clicks coarser and lower kettle water temperature by 2°C.',
      },
      {
        problem: 'Cup tastes sour, grassy, or thin like lemon water',
        diagnosis: 'Under-extraction caused by channeling or coarse grind passing water too quickly (< 2:15).',
        fix: 'Grind finer to increase resistance, and ensure all dry grounds are saturated during the bloom.',
      },
      {
        problem: 'Water pools and drawdown stalls indefinitely',
        diagnosis: 'Excess coffee fines clogging filter pores or excessive agitation.',
        fix: 'Minimize aggressive kettle pouring; swirl only once gently instead of stirring vigorously.',
      },
    ],
  },
  'french-press': {
    id: 'french-press',
    name: 'French Press',
    subtitle: 'Classic Immersion',
    tagline: 'Full-bodied immersion brewing producing velvety texture and deep caramelized sweetness.',
    idealRoast: 'Medium to Dark Roast',
    cupProfile: 'Heavy syrupy body, toasted hazelnut, melted baker’s chocolate, round low acidity.',
    difficulty: 'Beginner',
    ratioMultiplier: 15,
    ratioDisplay: '1:15',
    grindSize: 'Coarse',
    grindTexture: 'Rough like coarse sea salt or breadcrumbs',
    waterTemp: '94°C – 96°C (201°F – 205°F)',
    totalTime: '4:00 – 5:00',
    servings: [
      { label: 'Single Mug (300ml)', coffeeGrams: 20, yieldDesc: 'One deep 10oz morning mug' },
      { label: 'Two Mugs (400ml)', coffeeGrams: 26.5, yieldDesc: 'Standard French press (14oz)' },
      { label: 'Large Press (750ml)', coffeeGrams: 50, yieldDesc: 'Generous weekend brunch batch' },
    ],
    equipment: [
      'Standard 8-cup or 3-cup French Press carafe',
      'Metal mesh filter screen assembly',
      'Standard kitchen kettle',
      'Two soup spoons (for crust breaking & skimming)',
      'Digital scale or level tablespoon scoop',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Thermal Glass Pre-Heat',
        timeRange: 'Prep',
        action: 'Fill glass press with hot water for 30 seconds to pre-heat. Empty water completely, then add coarse ground coffee.',
        targetWaterFraction: 0,
        proTip: 'Pre-heating prevents glass from leeching thermal energy away from your immersion brew slurry.',
        sensoryCue: 'Warm glass exterior and fragrant roasted coffee aroma settling inside.',
      },
      {
        stepNumber: 2,
        title: 'Rapid Saturation Pour',
        timeRange: '0:00 – 0:30',
        action: 'Pour all target water vigorously onto grounds in continuous stream. Ensure complete turbulence so every ground is wet.',
        targetWaterFraction: 1.0,
        proTip: 'Vigorous pouring replaces the need for aggressive spoon stirring and naturally activates extraction.',
        sensoryCue: 'Rapid rising foam crust forming across entire liquid surface.',
      },
      {
        stepNumber: 3,
        title: 'Undisturbed 4-Minute Steep',
        timeRange: '0:30 – 4:00',
        action: 'Place lid gently on top of press to keep heat locked in. Do NOT press plunger down. Let sit completely undisturbed.',
        targetWaterFraction: 1.0,
        proTip: 'Immersion brewing is self-limiting: sitting quietly allows rich lipids and caramelized sweetness to dissolve without agitation bitterness.',
        sensoryCue: 'A dense floating crust of coffee grounds settling into place.',
      },
      {
        stepNumber: 4,
        title: 'Break Crust & Skim Floating Foam',
        timeRange: '4:00 – 4:30',
        action: 'Remove lid. Use two spoons to gently break the crust (grounds will sink). Skim off remaining brown foam and pale oils from top.',
        targetWaterFraction: 1.0,
        proTip: 'Skimming off the white floating foam removes bitter astringent fines and results in an astonishingly clean, silt-free cup.',
        sensoryCue: 'Clear, glistening dark amber liquid surface with grounds resting at bottom.',
      },
      {
        stepNumber: 5,
        title: 'Gentle Partial Plunge & Immediate Pour',
        timeRange: '4:30 – 5:00',
        action: 'Replace lid. Press plunger down just beneath the surface to act as a sieve. Pour immediately into mugs without sloshing.',
        targetWaterFraction: 1.0,
        proTip: 'Never plunge all the way to the bottom—it churns up muddy silt. And never leave brewed coffee sitting in the press!',
        sensoryCue: 'Silky, aromatic pour into cup with zero grit or muddy residue.',
      },
    ],
    troubleshooting: [
      {
        problem: 'Excessive sludge, grit, or mud in the bottom of your mug',
        diagnosis: 'Grind was too fine, or plunger was forced down too fast and forcefully.',
        fix: 'Coarsen grind size, skim surface foam thoroughly at 4:00, and plunge only 2–3 inches into liquid.',
      },
      {
        problem: 'Coffee tastes sour and watery despite dark beans',
        diagnosis: 'Water was not hot enough or brew did not steep long enough.',
        fix: 'Use water right off the boil (96°C) and do not rush: give it a full 4–5 minutes undisturbed steep.',
      },
      {
        problem: 'Second cup poured from press tastes bitter and harsh',
        diagnosis: 'Coffee continued extracting while sitting on submerged grounds inside the press.',
        fix: 'Always decant the entire French Press into a thermal server or mugs right away.',
      },
    ],
  },
  aeropress: {
    id: 'aeropress',
    name: 'AeroPress',
    subtitle: 'Smooth & Versatile',
    tagline: 'Air-pressure extraction combining immersion richness with paper-filter clarity and zero grit.',
    idealRoast: 'Light to Dark Roast (universal)',
    cupProfile: 'Smooth, sweet, concentrated body, low bitterness, vibrant espresso-like intensity.',
    difficulty: 'Beginner',
    ratioMultiplier: 13,
    ratioDisplay: '1:13',
    grindSize: 'Medium',
    grindTexture: 'Like fine table salt or granulated caster sugar',
    waterTemp: '85°C – 88°C (185°F – 190°F)',
    totalTime: '1:30 – 2:00',
    servings: [
      { label: 'Concentrate Shot (100ml)', coffeeGrams: 15, yieldDesc: 'Dense base for Americano or Latte' },
      { label: 'Single Brew (200ml)', coffeeGrams: 15.5, yieldDesc: 'One rich 7oz specialty cup' },
      { label: 'Double Brew (250ml)', coffeeGrams: 19, yieldDesc: 'One full 9oz morning mug' },
    ],
    equipment: [
      'AeroPress chamber, plunger, and cap',
      'Micro-paper filter disc (or stainless steel mesh)',
      'AeroPress paddle or dessert spoon',
      'Sturdy ceramic mug (never press into glass!)',
      'Water kettle and timer',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Filter Setup & Cup Warm',
        timeRange: 'Prep',
        action: 'Insert paper filter into perforated cap. Rinse with hot water into your mug to preheat, then dump rinse water. Twist cap onto chamber.',
        targetWaterFraction: 0,
        proTip: 'Rinsing helps paper seal against the plastic cap so no bypass leaks occur during brewing.',
        sensoryCue: 'Paper filter laid flat against cap with no folded creases.',
      },
      {
        stepNumber: 2,
        title: 'Dose & Quick Water Pour',
        timeRange: '0:00 – 0:20',
        action: 'Place chamber onto sturdy mug. Add medium ground coffee. Pour all hot water (85°C–88°C) briskly up to chosen weight/number.',
        targetWaterFraction: 1.0,
        proTip: 'A lower water temp (around 85°C) prevents heat astringency and emphasizes natural fruit sweetness in the AeroPress.',
        sensoryCue: 'Coffee slurry rising smoothly with light crema froth.',
      },
      {
        stepNumber: 3,
        title: 'Gentle Back-and-Forth Paddle Stir',
        timeRange: '0:20 – 0:35',
        action: 'Stir coffee slurry gently in a straight line back and forth 4–5 times. Do not whip violently.',
        targetWaterFraction: 1.0,
        proTip: 'Back-and-forth stirring prevents grounds from spinning against the chamber walls and promotes even extraction.',
        sensoryCue: 'Homogenous coffee slurry with all dry clumps dissolved.',
      },
      {
        stepNumber: 4,
        title: 'Vacuum Seal & 45-Second Steep',
        timeRange: '0:35 – 1:15',
        action: 'Insert plunger 1cm into chamber and pull back upward a tiny millimeter to create a vacuum seal. Let steep quietly.',
        targetWaterFraction: 1.0,
        proTip: 'The vacuum stops coffee from dripping through into your cup prematurely while it steeps.',
        sensoryCue: 'Drip stops completely; coffee steeps evenly under air pressure.',
      },
      {
        stepNumber: 5,
        title: 'Smooth 30-Second Press',
        timeRange: '1:15 – 1:45',
        action: 'Gently place both hands on plunger and let relaxed arm weight press down smoothly for 30 seconds. Stop pressing at first hiss.',
        targetWaterFraction: 1.0,
        proTip: 'Stop plunging immediately once you hear the escaping air hiss! Pushing through the spent puck squeezes out bitter tannins.',
        sensoryCue: 'Gentle soft hiss sound from chamber bottom; dense sweet brew in cup.',
      },
    ],
    troubleshooting: [
      {
        problem: 'Plunger is extremely difficult to press down and requires excessive force',
        diagnosis: 'Coffee is ground too fine (powdery), compacting into an impermeable barrier.',
        fix: 'Coarsen grind size towards medium drip. Never force plunger onto fragile mugs!',
      },
      {
        problem: 'Coffee drips completely into mug before you can even insert the plunger',
        diagnosis: 'Grind is too coarse, or plunger was not inserted promptly to form a vacuum seal.',
        fix: 'Grind slightly finer and insert plunger top immediately after stirring.',
      },
      {
        problem: 'Cup tastes dull and lacks origin acidity',
        diagnosis: 'Water was too hot (boiled at 100°C) which burns light/medium delicate notes.',
        fix: 'Let boiled kettle rest for 60 seconds to reach 85°C–88°C before pouring.',
      },
    ],
  },
};

/**
 * Calculates dynamically scaled recipe values based on serving selection.
 */
export function calculateCustomBrewRecipe(
  methodId: BrewingSchoolMethodId,
  coffeeGrams: number
): {
  coffeeGrams: number;
  waterGrams: number;
  ratioDisplay: string;
  bloomWaterGrams: number;
  mainPourWaterGrams: number;
} {
  const guide = BREWING_SCHOOL_GUIDES[methodId] || BREWING_SCHOOL_GUIDES['pour-over'];
  const safeCoffee = Math.max(10, Math.min(60, Number(coffeeGrams) || 20));
  const waterGrams = Math.round(safeCoffee * guide.ratioMultiplier);
  const bloomWaterGrams = Math.round(safeCoffee * 3); // standard 3x bloom
  const mainPourWaterGrams = Math.round(waterGrams * 0.6);

  return {
    coffeeGrams: safeCoffee,
    waterGrams,
    ratioDisplay: guide.ratioDisplay,
    bloomWaterGrams,
    mainPourWaterGrams,
  };
}

/**
 * Returns a specific brewing school guide by method ID.
 */
export function getBrewingSchoolGuide(methodId: string): BrewingMethodGuide {
  if (methodId === 'pour-over' || methodId === 'french-press' || methodId === 'aeropress') {
    return BREWING_SCHOOL_GUIDES[methodId];
  }
  return BREWING_SCHOOL_GUIDES['pour-over'];
}

/**
 * Returns list of all method guides.
 */
export function getAllBrewingSchoolGuides(): BrewingMethodGuide[] {
  return [
    BREWING_SCHOOL_GUIDES['pour-over'],
    BREWING_SCHOOL_GUIDES['french-press'],
    BREWING_SCHOOL_GUIDES['aeropress'],
  ];
}
