/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrewStep {
  id: string;
  title: string;
  instruction: string;
  durationSeconds: number;
  targetGrams?: string;
  tip?: string;
}

export interface BrewMethodConfig {
  id: string;
  name: string;
  subtitle: string;
  ratio: string;
  grind: string;
  temp: string;
  coffeeGrams: number;
  waterGrams: number;
  steps: BrewStep[];
  totalSeconds: number;
}

export const BREW_METHODS: Record<string, BrewMethodConfig> = {
  'pour-over': {
    id: 'pour-over',
    name: 'Pour Over',
    subtitle: 'V60 / Kalita / Chemex',
    ratio: '1:15 (20g coffee / 300g water)',
    grind: 'Medium-Fine (like kosher salt)',
    temp: '93°C / 200°F',
    coffeeGrams: 20,
    waterGrams: 300,
    totalSeconds: 180,
    steps: [
      {
        id: 'bloom',
        title: 'The Bloom',
        instruction: 'Pour 60g water in gentle outward spirals. Ensure all dry grounds are saturated.',
        durationSeconds: 45,
        targetGrams: '60g',
        tip: 'Watch the bed bubble—this releases trapped CO2 for sweeter extraction.',
      },
      {
        id: 'first-pour',
        title: 'First Main Pour',
        instruction: 'Pour steadily in concentric circles from center out to edges until scale reads 180g.',
        durationSeconds: 45,
        targetGrams: '180g',
        tip: 'Keep the kettle spout close to the coffee bed to minimize turbulence.',
      },
      {
        id: 'second-pour',
        title: 'Second Gentle Pour',
        instruction: 'Pour remaining water smoothly up to 300g. Keep stream gentle and consistent.',
        durationSeconds: 45,
        targetGrams: '300g',
        tip: 'Rinse grounds off the filter paper sides as you complete the pour.',
      },
      {
        id: 'drawdown',
        title: 'Drawdown & Flat Bed',
        instruction: 'Give the dripper one gentle swirl. Let the water filter down through the bed.',
        durationSeconds: 45,
        targetGrams: '300g final',
        tip: 'A flat, even bed at the finish indicates an even, balanced extraction.',
      },
    ],
  },
  'french-press': {
    id: 'french-press',
    name: 'French Press',
    subtitle: 'Classic Immersion',
    ratio: '1:15 (26g coffee / 400g water)',
    grind: 'Coarse (like sea salt crystals)',
    temp: '95°C / 203°F',
    coffeeGrams: 26,
    waterGrams: 400,
    totalSeconds: 240,
    steps: [
      {
        id: 'saturate',
        title: 'Saturate Grounds',
        instruction: 'Pour 400g near-boiling water vigorously over the grounds. Stir 3 times.',
        durationSeconds: 45,
        targetGrams: '400g',
        tip: 'Vigorous pouring helps submerge coarse particles immediately.',
      },
      {
        id: 'steep',
        title: 'Undisturbed Steep',
        instruction: 'Rest the lid on the press to retain thermal heat. Do not push the plunger yet.',
        durationSeconds: 135,
        tip: 'Letting it sit allows rich chocolate and caramel sweetness to dissolve.',
      },
      {
        id: 'break-crust',
        title: 'Break Crust & Skim',
        instruction: 'Gently break the top coffee crust with a spoon. Skim off excess foam and floating bits.',
        durationSeconds: 45,
        tip: 'Skimming the foam removes astringency and produces a remarkably clean cup.',
      },
      {
        id: 'press-pour',
        title: 'Gentle Press & Decant',
        instruction: 'Press the plunger down slowly halfway. Immediately decant into cups or a carafe.',
        durationSeconds: 15,
        targetGrams: '400g decanted',
        tip: 'Never leave remaining coffee inside the press or it will over-extract.',
      },
    ],
  },
  aeropress: {
    id: 'aeropress',
    name: 'AeroPress',
    subtitle: 'Smooth & Versatile',
    ratio: '1:13 (15g coffee / 200g water)',
    grind: 'Medium (table salt)',
    temp: '88°C / 190°F',
    coffeeGrams: 15,
    waterGrams: 200,
    totalSeconds: 105,
    steps: [
      {
        id: 'pour-stir',
        title: 'Pour & Quick Agitation',
        instruction: 'Pour 200g water over coffee. Stir gently back and forth for 10 seconds.',
        durationSeconds: 30,
        targetGrams: '200g',
        tip: 'A slightly lower temperature (88°C) highlights delicate floral acidity.',
      },
      {
        id: 'steep-seal',
        title: 'Steep Under Seal',
        instruction: 'Insert the plunger 1cm to create a vacuum seal. Let steep quietly.',
        durationSeconds: 45,
        tip: 'The vacuum stops coffee from dripping through early.',
      },
      {
        id: 'gentle-press',
        title: 'Slow Steady Press',
        instruction: 'Press down with gentle arm weight for 30 seconds until you hear a soft hiss.',
        durationSeconds: 30,
        targetGrams: '200g pressed',
        tip: 'Stop plunging as soon as the hissing begins to avoid bitter oils.',
      },
    ],
  },
  'moka-pot': {
    id: 'moka-pot',
    name: 'Moka Pot',
    subtitle: 'Stovetop Espresso-Style',
    ratio: '1:10 (18g coffee / 180g water)',
    grind: 'Fine (finer than drip, coarser than espresso)',
    temp: 'Pre-boiled water in base',
    coffeeGrams: 18,
    waterGrams: 180,
    totalSeconds: 150,
    steps: [
      {
        id: 'preheat-heat',
        title: 'Boiler Fill & Low Heat',
        instruction: 'Fill base with hot water to valve. Place funnel with coffee bed on medium-low heat.',
        durationSeconds: 60,
        targetGrams: '180g in base',
        tip: 'Using hot water in the boiler prevents roasting the dry coffee on the stove.',
      },
      {
        id: 'extraction',
        title: 'Rich Crema Flow',
        instruction: 'Leave lid open. Watch for a rich, golden-brown stream rising into the chimney.',
        durationSeconds: 60,
        tip: 'If it sputters violently, reduce flame immediately to maintain a gentle stream.',
      },
      {
        id: 'cool-stop',
        title: 'Cut Heat & Quench Base',
        instruction: 'When the stream turns pale and begins gurgling, remove and run cold water on bottom.',
        durationSeconds: 30,
        tip: 'Quenching stops extraction instantly, preserving sweet crema.',
      },
    ],
  },
};

export function calculateTotalSeconds(steps: BrewStep[]): number {
  return steps.reduce((sum, step) => sum + step.durationSeconds, 0);
}

export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export interface StepProgress {
  currentStep: BrewStep;
  stepIndex: number;
  stepElapsed: number;
  stepRemaining: number;
  isComplete: boolean;
  totalElapsed: number;
  totalRemaining: number;
  overallProgressPercent: number;
}

export function getStepAtTime(steps: BrewStep[], elapsedSeconds: number): StepProgress {
  const totalSeconds = calculateTotalSeconds(steps);
  const safeElapsed = Math.min(Math.max(0, elapsedSeconds), totalSeconds);

  if (steps.length === 0) {
    throw new Error('Steps list cannot be empty');
  }

  if (safeElapsed >= totalSeconds) {
    const lastStep = steps[steps.length - 1];
    return {
      currentStep: lastStep,
      stepIndex: steps.length - 1,
      stepElapsed: lastStep.durationSeconds,
      stepRemaining: 0,
      isComplete: true,
      totalElapsed: totalSeconds,
      totalRemaining: 0,
      overallProgressPercent: 100,
    };
  }

  let accumulated = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepStart = accumulated;
    const stepEnd = accumulated + step.durationSeconds;

    if (safeElapsed >= stepStart && safeElapsed < stepEnd) {
      const stepElapsed = safeElapsed - stepStart;
      const stepRemaining = step.durationSeconds - stepElapsed;

      return {
        currentStep: step,
        stepIndex: i,
        stepElapsed,
        stepRemaining,
        isComplete: false,
        totalElapsed: safeElapsed,
        totalRemaining: Math.max(0, totalSeconds - safeElapsed),
        overallProgressPercent: totalSeconds > 0 ? (safeElapsed / totalSeconds) * 100 : 0,
      };
    }
    accumulated = stepEnd;
  }

  // Fallback to last step
  const lastStep = steps[steps.length - 1];
  return {
    currentStep: lastStep,
    stepIndex: steps.length - 1,
    stepElapsed: lastStep.durationSeconds,
    stepRemaining: 0,
    isComplete: true,
    totalElapsed: totalSeconds,
    totalRemaining: 0,
    overallProgressPercent: 100,
  };
}
