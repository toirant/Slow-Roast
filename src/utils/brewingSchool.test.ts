/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BREWING_SCHOOL_GUIDES,
  calculateCustomBrewRecipe,
  getBrewingSchoolGuide,
  getAllBrewingSchoolGuides,
  BrewingSchoolMethodId,
} from './brewingSchool.ts';

test('BREWING_SCHOOL_GUIDES contains comprehensive guides for Pour Over, French Press, and AeroPress', () => {
  const methods: BrewingSchoolMethodId[] = ['pour-over', 'french-press', 'aeropress'];

  for (const methodId of methods) {
    const guide = BREWING_SCHOOL_GUIDES[methodId];
    assert.ok(guide, `Guide must exist for ${methodId}`);
    assert.ok(guide.name.length > 0, 'Name must be specified');
    assert.ok(guide.steps.length >= 4, `Method ${methodId} should have at least 4 detailed steps`);
    assert.ok(guide.equipment.length >= 3, `Method ${methodId} should have at least 3 equipment items`);
    assert.ok(guide.servings.length >= 2, `Method ${methodId} should have at least 2 serving presets`);
    assert.ok(guide.troubleshooting.length >= 2, `Method ${methodId} should have troubleshooting items`);

    // Verify step properties
    for (const step of guide.steps) {
      assert.ok(step.title.length > 0, 'Step title must not be empty');
      assert.ok(step.action.length > 0, 'Step action must not be empty');
      assert.ok(step.proTip.length > 0, 'Each step must contain a pro tip');
      assert.ok(step.sensoryCue.length > 0, 'Each step must contain a sensory cue');
    }
  }
});

test('calculateCustomBrewRecipe scales water accurately based on ratio and coffee dose', () => {
  // Pour Over ratio is 1:15
  const pourOverRecipe = calculateCustomBrewRecipe('pour-over', 20);
  assert.equal(pourOverRecipe.coffeeGrams, 20);
  assert.equal(pourOverRecipe.waterGrams, 300);
  assert.equal(pourOverRecipe.bloomWaterGrams, 60);

  // AeroPress ratio is 1:13
  const aeropressRecipe = calculateCustomBrewRecipe('aeropress', 15);
  assert.equal(aeropressRecipe.coffeeGrams, 15);
  assert.equal(aeropressRecipe.waterGrams, 195);

  // French Press ratio is 1:15
  const frenchPressRecipe = calculateCustomBrewRecipe('french-press', 26);
  assert.equal(frenchPressRecipe.coffeeGrams, 26);
  assert.equal(frenchPressRecipe.waterGrams, 390);
});

test('calculateCustomBrewRecipe clamps extreme coffee inputs safely', () => {
  const lowClamp = calculateCustomBrewRecipe('pour-over', 2);
  assert.equal(lowClamp.coffeeGrams, 10);

  const highClamp = calculateCustomBrewRecipe('pour-over', 100);
  assert.equal(highClamp.coffeeGrams, 60);
});

test('getBrewingSchoolGuide safely retrieves valid guide or falls back to pour-over', () => {
  assert.equal(getBrewingSchoolGuide('french-press').id, 'french-press');
  assert.equal(getBrewingSchoolGuide('aeropress').id, 'aeropress');
  assert.equal(getBrewingSchoolGuide('unknown-method').id, 'pour-over');
});

test('getAllBrewingSchoolGuides returns all 3 primary guides', () => {
  const allGuides = getAllBrewingSchoolGuides();
  assert.equal(allGuides.length, 3);
  assert.deepEqual(
    allGuides.map((g) => g.id),
    ['pour-over', 'french-press', 'aeropress']
  );
});
