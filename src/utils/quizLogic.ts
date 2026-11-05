import { RoastLevel, BrewMethod } from './coffeePlan.ts';

export interface QuizAnswers {
  brewingSetup?: 'pour_over' | 'french_press' | 'espresso' | 'drip';
  flavorPreference?: 'bright_floral' | 'sweet_balanced' | 'deep_chocolaty';
  milkPreference?: 'black' | 'splash_milk' | 'latte';
  goal?: 'palate_training' | 'everyday_sweet' | 'bold_punch';
}

export interface QuizResult {
  roastLevel: RoastLevel;
  matchedBrewMethod: BrewMethod;
  profileName: string;
  tagline: string;
  description: string;
  tastingNotes: string[];
  recommendedRatio: string;
  waterTemp: string;
  grindSize: string;
  featuredOrigins: string;
  guideTitle: string;
}

export function calculateRoastRecommendation(answers: QuizAnswers): QuizResult {
  let lightScore = 0;
  let mediumScore = 0;
  let darkScore = 0;

  // Brew setup weights
  if (answers.brewingSetup === 'pour_over') {
    lightScore += 3;
    mediumScore += 1;
  } else if (answers.brewingSetup === 'french_press' || answers.brewingSetup === 'drip') {
    mediumScore += 3;
    lightScore += 1;
  } else if (answers.brewingSetup === 'espresso') {
    darkScore += 3;
    mediumScore += 1;
  }

  // Flavor preference weights
  if (answers.flavorPreference === 'bright_floral') {
    lightScore += 4;
  } else if (answers.flavorPreference === 'sweet_balanced') {
    mediumScore += 4;
  } else if (answers.flavorPreference === 'deep_chocolaty') {
    darkScore += 4;
  }

  // Milk preference weights
  if (answers.milkPreference === 'black') {
    lightScore += 2;
    mediumScore += 1;
  } else if (answers.milkPreference === 'splash_milk') {
    mediumScore += 2;
    darkScore += 1;
  } else if (answers.milkPreference === 'latte') {
    darkScore += 3;
    mediumScore += 1;
  }

  // Goal weights
  if (answers.goal === 'palate_training') {
    lightScore += 3;
  } else if (answers.goal === 'everyday_sweet') {
    mediumScore += 3;
  } else if (answers.goal === 'bold_punch') {
    darkScore += 3;
  }

  // Determine winner
  let roastLevel: RoastLevel = 'medium';
  if (lightScore > mediumScore && lightScore > darkScore) {
    roastLevel = 'light';
  } else if (darkScore > mediumScore && darkScore >= lightScore) {
    roastLevel = 'dark';
  } else {
    roastLevel = 'medium';
  }

  // Map to brew method
  let matchedBrewMethod: BrewMethod = 'pour over';
  if (answers.brewingSetup === 'espresso') {
    matchedBrewMethod = 'espresso';
  } else if (answers.brewingSetup === 'french_press') {
    matchedBrewMethod = 'french press';
  } else {
    matchedBrewMethod = 'pour over';
  }

  if (roastLevel === 'light') {
    return {
      roastLevel: 'light',
      matchedBrewMethod,
      profileName: 'Sunlit Bloom (Light Roast)',
      tagline: 'High-Altitude Clarity & Delicate Botanicals',
      description:
        'Showcases terroir and delicate origin notes without smoky roast masking. Clean, tea-like body with sparkling citrus and honeyed sweetness.',
      tastingNotes: ['Bergamot', 'Jasmine Flower', 'White Peach', 'Meyer Lemon'],
      recommendedRatio: '1:16 (15g coffee : 240g water)',
      waterTemp: '94°C - 96°C (201°F - 205°F)',
      grindSize: 'Medium-fine (coarse sand feel)',
      featuredOrigins: 'Yirgacheffe, Ethiopia & Huila, Colombia',
      guideTitle: 'Guide #04: Maximizing Bloom & Fruit Acidity',
    };
  }

  if (roastLevel === 'dark') {
    return {
      roastLevel: 'dark',
      matchedBrewMethod,
      profileName: 'Midnight Velvet (Dark Roast)',
      tagline: 'Deep Caramelization & Rich Crema',
      description:
        'Crafted for dense body, low acidity, and syrupy cocoa depth. Slow-roasted to preserve natural bean sweetness while developing decadent chocolate tones.',
      tastingNotes: ['Dark Cocoa 85%', 'Molasses', 'Toasted Hazelnut', 'Warm Spice'],
      recommendedRatio: '1:2 for espresso (18g in : 36g out) or 1:14 for moka',
      waterTemp: '89°C - 91°C (192°F - 196°F)',
      grindSize: 'Fine (uniform powdered grit)',
      featuredOrigins: 'Minas Gerais, Brazil & Mandheling, Sumatra',
      guideTitle: 'Guide #11: Dialing Pressure & Milk Steaming Microfoam',
    };
  }

  // Default medium roast
  return {
    roastLevel: 'medium',
    matchedBrewMethod,
    profileName: 'Golden Orchard (Medium Roast)',
    tagline: 'Harmonious Sweetness & Velvety Balance',
    description:
      'The sweet spot of specialty coffee: round caramel sweetness balanced by crisp red apple acidity and a buttery, satisfying finish.',
    tastingNotes: ['Dulce de Leche', 'Fuji Apple', 'Milk Chocolate', 'Pecan'],
    recommendedRatio: '1:15 (20g coffee : 300g water)',
    waterTemp: '91°C - 93°C (195°F - 199°F)',
    grindSize: 'Medium (kosher salt consistency)',
    featuredOrigins: 'Antigua, Guatemala & Tarrazú, Costa Rica',
    guideTitle: 'Guide #08: Sweet Spot Extraction & Agitation',
  };
}
