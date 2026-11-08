/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTestimonialCardAnimationClasses,
  getQuoteIconAnimationClasses,
} from './testimonialAnimation.ts';

test('getTestimonialCardAnimationClasses returns inactive slide-down classes when not in view', () => {
  const classes = getTestimonialCardAnimationClasses(false);
  assert.ok(classes.includes('opacity-0'));
  assert.ok(classes.includes('translate-y-8'));
  assert.ok(classes.includes('scale-[0.98]'));
  assert.ok(!classes.includes('opacity-100'));
});

test('getTestimonialCardAnimationClasses returns active entrance classes when in view', () => {
  const classes = getTestimonialCardAnimationClasses(true);
  assert.ok(classes.includes('opacity-100'));
  assert.ok(classes.includes('translate-y-0'));
  assert.ok(classes.includes('scale-100'));
  assert.ok(classes.includes('duration-700'));
});

test('getTestimonialCardAnimationClasses respects prefersReducedMotion flag', () => {
  const classes = getTestimonialCardAnimationClasses(false, true);
  assert.equal(classes, 'opacity-100 translate-y-0 scale-100');
});

test('getQuoteIconAnimationClasses returns staggered entrance classes', () => {
  const inactive = getQuoteIconAnimationClasses(false);
  assert.ok(inactive.includes('opacity-0'));
  assert.ok(inactive.includes('scale-75'));

  const active = getQuoteIconAnimationClasses(true);
  assert.ok(active.includes('opacity-90'));
  assert.ok(active.includes('scale-100'));
  assert.ok(active.includes('delay-150'));

  const reduced = getQuoteIconAnimationClasses(false, true);
  assert.equal(reduced, 'opacity-90 scale-100 translate-y-0');
});
