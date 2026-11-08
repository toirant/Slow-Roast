/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROAST_PROFILES,
  COMPARISON_ROWS,
  getAllRoastProfiles,
  getRoastProfile,
  formatScoreMeter,
  suggestRoastByFlavorPreference,
} from './roastComparison.ts';

test('ROAST_PROFILES contains comprehensive data for light, medium, and dark profiles', () => {
  const profiles = getAllRoastProfiles();
  assert.equal(profiles.length, 3, 'Should have exactly 3 roast profiles');

  for (const profile of profiles) {
    assert.ok(profile.name.length > 0, 'Name must not be empty');
    assert.ok(profile.primaryNotes.length >= 3, 'Must have at least 3 flavor notes');
    assert.ok(profile.bestBrewMethods.length >= 2, 'Must have at least 2 brew methods');
    assert.ok(profile.acidityLevel >= 1 && profile.acidityLevel <= 5, 'Acidity must be between 1 and 5');
    assert.ok(profile.bodyLevel >= 1 && profile.bodyLevel <= 5, 'Body must be between 1 and 5');
    assert.ok(profile.sweetnessLevel >= 1 && profile.sweetnessLevel <= 5, 'Sweetness must be between 1 and 5');
    assert.ok(profile.beanColorHex.startsWith('#'), 'Must define valid hex color');
  }
});

test('Roast profiles have realistic relative sensory levels', () => {
  const light = ROAST_PROFILES.light;
  const medium = ROAST_PROFILES.medium;
  const dark = ROAST_PROFILES.dark;

  // Light roast should have highest acidity and lighter body
  assert.ok(light.acidityLevel > dark.acidityLevel, 'Light roast acidity should exceed dark roast');
  assert.ok(dark.bodyLevel > light.bodyLevel, 'Dark roast body should exceed light roast');
  // Medium should have peak balance/sweetness
  assert.ok(medium.sweetnessLevel >= dark.sweetnessLevel, 'Medium roast should have high sweetness');
});

test('COMPARISON_ROWS covers key sensory, technique, and flavor categories', () => {
  assert.ok(COMPARISON_ROWS.length >= 6, 'Must have at least 6 comparison attributes');
  const rowIds = COMPARISON_ROWS.map((r) => r.id);
  assert.ok(rowIds.includes('primaryNotes'), 'Must compare primary notes');
  assert.ok(rowIds.includes('acidityLevel'), 'Must compare acidity');
  assert.ok(rowIds.includes('bodyLevel'), 'Must compare body');
  assert.ok(rowIds.includes('bestBrewMethods'), 'Must compare brew methods');
});

test('getRoastProfile retrieves valid profile or falls back to medium', () => {
  assert.equal(getRoastProfile('light').key, 'light');
  assert.equal(getRoastProfile('dark').key, 'dark');
  assert.equal(getRoastProfile('invalid-key').key, 'medium');
});

test('formatScoreMeter calculates filled and unfilled dots accurately', () => {
  const meter3 = formatScoreMeter(3, 5);
  assert.equal(meter3.filled, 3);
  assert.equal(meter3.unfilled, 2);
  assert.equal(meter3.percentage, 60);

  const meter5 = formatScoreMeter(5, 5);
  assert.equal(meter5.filled, 5);
  assert.equal(meter5.unfilled, 0);
  assert.equal(meter5.percentage, 100);

  // Clamping test
  const clamped = formatScoreMeter(10, 5);
  assert.equal(clamped.filled, 5);
  assert.equal(clamped.unfilled, 0);
});

test('suggestRoastByFlavorPreference routes correctly based on user taste desires', () => {
  assert.equal(suggestRoastByFlavorPreference({ lovesFloralFruit: true }), 'light');
  assert.equal(suggestRoastByFlavorPreference({ wantsLowAcidity: true }), 'dark');
  assert.equal(suggestRoastByFlavorPreference({ prefersMilkDrinks: true }), 'dark');
  assert.equal(suggestRoastByFlavorPreference({}), 'medium');
});
