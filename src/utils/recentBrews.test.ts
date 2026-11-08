/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_RECENT_BREWS,
  isValidRating,
  updateBrewRating,
  filterBrewsByMethod,
  getBrewMethodOptions,
  getRatingFeedback,
  calculateAverageRating,
} from './recentBrews.ts';

test('DEFAULT_RECENT_BREWS contains exactly 3 recent coffees with origin, roast level, and brew method', () => {
  assert.equal(DEFAULT_RECENT_BREWS.length, 3);
  for (const brew of DEFAULT_RECENT_BREWS) {
    assert.ok(brew.id.length > 0);
    assert.ok(brew.name.length > 0);
    assert.ok(brew.origin.length > 0, 'Origin must be defined');
    assert.ok(brew.roastLevel.length > 0, 'Roast level must be defined');
    assert.ok(brew.brewMethod.length > 0, 'Brew method must be defined');
    assert.ok(brew.brewMethodLabel.length > 0, 'Brew method label must be defined');
    assert.ok(brew.rating >= 1 && brew.rating <= 5, 'Rating must be between 1 and 5');
    assert.ok(brew.tastingNotes.length >= 2);
  }
});

test('filterBrewsByMethod correctly filters by brew method', () => {
  // 'all' returns everything
  const allBrews = filterBrewsByMethod(DEFAULT_RECENT_BREWS, 'all');
  assert.equal(allBrews.length, 3);

  // 'pour-over' returns only Ethiopian Banko Gotiti
  const pourOverBrews = filterBrewsByMethod(DEFAULT_RECENT_BREWS, 'pour-over');
  assert.equal(pourOverBrews.length, 1);
  assert.equal(pourOverBrews[0].id, 'brew-nov-ethiopia');
  assert.equal(pourOverBrews[0].brewMethod, 'pour-over');

  // 'aeropress' returns only Colombian Finca El Mirador
  const aeropressBrews = filterBrewsByMethod(DEFAULT_RECENT_BREWS, 'aeropress');
  assert.equal(aeropressBrews.length, 1);
  assert.equal(aeropressBrews[0].id, 'brew-oct-colombia');
  assert.equal(aeropressBrews[0].brewMethod, 'aeropress');

  // 'french-press' returns only Guatemalan Finca Medina
  const frenchPressBrews = filterBrewsByMethod(DEFAULT_RECENT_BREWS, 'french-press');
  assert.equal(frenchPressBrews.length, 1);
  assert.equal(frenchPressBrews[0].id, 'brew-sep-guatemala');
  assert.equal(frenchPressBrews[0].brewMethod, 'french-press');
});

test('getBrewMethodOptions computes accurate counts per method', () => {
  const options = getBrewMethodOptions(DEFAULT_RECENT_BREWS);
  assert.equal(options.length, 4);

  const allOpt = options.find((o) => o.id === 'all');
  assert.equal(allOpt?.count, 3);

  const pourOpt = options.find((o) => o.id === 'pour-over');
  assert.equal(pourOpt?.count, 1);
  assert.equal(pourOpt?.label, 'Pour Over');

  const aeroOpt = options.find((o) => o.id === 'aeropress');
  assert.equal(aeroOpt?.count, 1);
  assert.equal(aeroOpt?.label, 'AeroPress');

  const frenchOpt = options.find((o) => o.id === 'french-press');
  assert.equal(frenchOpt?.count, 1);
  assert.equal(frenchOpt?.label, 'French Press');
});

test('isValidRating validates integer values between 1 and 5 strictly', () => {
  assert.equal(isValidRating(1), true);
  assert.equal(isValidRating(3), true);
  assert.equal(isValidRating(5), true);
  assert.equal(isValidRating(0), false);
  assert.equal(isValidRating(6), false);
  assert.equal(isValidRating(3.5), false);
  assert.equal(isValidRating(-1), false);
});

test('updateBrewRating updates the rating of target coffee immutably', () => {
  const original = DEFAULT_RECENT_BREWS;
  const updated = updateBrewRating(original, 'brew-nov-ethiopia', 4);

  // Assert target coffee updated
  const updatedEthiopia = updated.find((b) => b.id === 'brew-nov-ethiopia');
  assert.equal(updatedEthiopia?.rating, 4);

  // Assert other coffees unmodified
  const colombia = updated.find((b) => b.id === 'brew-oct-colombia');
  assert.equal(colombia?.rating, 4);

  // Assert original array was not mutated
  assert.notEqual(original, updated);
  assert.equal(original[0].rating, 5);
});

test('updateBrewRating ignores invalid ratings without throwing', () => {
  const original = DEFAULT_RECENT_BREWS;
  const unchanged = updateBrewRating(original, 'brew-nov-ethiopia', 10);
  assert.deepEqual(unchanged, original);
});

test('getRatingFeedback returns constructive feedback messages per score', () => {
  const fb5 = getRatingFeedback(5, 'Ethiopia');
  assert.ok(fb5.includes('Loved'));

  const fb4 = getRatingFeedback(4, 'Colombia');
  assert.ok(fb4.includes('tuned your profile'));

  const fb3 = getRatingFeedback(3, 'Guatemala');
  assert.ok(fb3.includes('adjust acidity'));

  const fb1 = getRatingFeedback(1, 'Sample');
  assert.ok(fb1.includes('steer future batches away'));
});

test('calculateAverageRating accurately computes mean of ratings', () => {
  const avg = calculateAverageRating(DEFAULT_RECENT_BREWS);
  // (5 + 4 + 5) / 3 = 14 / 3 = 4.666 -> 4.7
  assert.equal(avg, 4.7);

  const emptyAvg = calculateAverageRating([]);
  assert.equal(emptyAvg, 0);
});
