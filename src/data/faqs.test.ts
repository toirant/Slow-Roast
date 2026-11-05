import test from 'node:test';
import assert from 'node:assert/strict';
import { FAQS, filterFaqs } from './faqs.ts';

test('FAQS list contains core questions requested by user', () => {
  const ids = FAQS.map((f) => f.id);
  assert.ok(ids.includes('shipping-speed'), 'should include shipping speed FAQ');
  assert.ok(ids.includes('subscription-cancel'), 'should include subscription cancellation FAQ');
  assert.ok(ids.includes('whole-bean-or-ground'), 'should include whole bean vs ground FAQ');
  assert.ok(FAQS.length >= 5, 'should have at least 5 informative FAQs');
});

test('filterFaqs correctly filters by search term', () => {
  const shippingResults = filterFaqs('shipping');
  assert.ok(shippingResults.length >= 1);
  assert.ok(shippingResults.some((f) => f.id === 'shipping-speed'));

  const cancelResults = filterFaqs('cancel');
  assert.ok(cancelResults.length >= 1);
  assert.ok(cancelResults.some((f) => f.id === 'subscription-cancel'));
});

test('filterFaqs correctly filters by category', () => {
  const gearItems = filterFaqs('', 'gear');
  assert.ok(gearItems.length >= 1);
  assert.ok(gearItems.every((f) => f.category === 'gear'));
});
