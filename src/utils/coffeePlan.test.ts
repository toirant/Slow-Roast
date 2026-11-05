import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubscriptionPrice,
  getBrewRecommendation,
  getSampleBoxDetails,
  DEFAULT_PLAN_CONFIG,
} from './coffeePlan.ts';

test('calculateSubscriptionPrice computes free shipping for first month', () => {
  const result = calculateSubscriptionPrice(DEFAULT_PLAN_CONFIG, true);
  assert.equal(result.coffeeSubtotal, 36);
  assert.equal(result.shippingFee, 0);
  assert.equal(result.totalFirstMonth, 36);
  assert.equal(result.regularMonthlyTotal, 41);
  assert.equal(result.savings, 5);
});

test('calculateSubscriptionPrice computes standard shipping for subsequent months', () => {
  const result = calculateSubscriptionPrice(DEFAULT_PLAN_CONFIG, false);
  assert.equal(result.coffeeSubtotal, 36);
  assert.equal(result.shippingFee, 5);
});

test('getBrewRecommendation provides tailored guide and roast for pour over', () => {
  const pourOver = getBrewRecommendation('pour over');
  assert.equal(pourOver.suggestedRoast, 'light');
  assert.match(pourOver.brewGuideTitle, /Spiral Pour/);
});

test('getBrewRecommendation provides tailored guide and roast for french press and espresso', () => {
  const fp = getBrewRecommendation('french press');
  assert.equal(fp.suggestedRoast, 'medium');

  const esp = getBrewRecommendation('espresso');
  assert.equal(esp.suggestedRoast, 'dark');
});

test('getSampleBoxDetails returns two fresh coffees and guide details', () => {
  const sample = getSampleBoxDetails();
  assert.equal(sample.coffees.length, 2);
  assert.equal(sample.edition, 'Issue 04, November');
  assert.ok(sample.coffees[0].origin.includes('Ethiopia'));
});
