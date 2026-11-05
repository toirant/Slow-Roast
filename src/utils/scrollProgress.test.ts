import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScrollProgress } from './scrollProgress.ts';

test('calculateScrollProgress returns 0 when at top of document', () => {
  assert.equal(calculateScrollProgress(0, 3000, 1000), 0);
});

test('calculateScrollProgress returns 50 halfway down document', () => {
  assert.equal(calculateScrollProgress(1000, 3000, 1000), 50);
});

test('calculateScrollProgress returns 100 when scrolled to bottom', () => {
  assert.equal(calculateScrollProgress(2000, 3000, 1000), 100);
});

test('calculateScrollProgress handles rubber-banding or over-scrolling past bottom', () => {
  assert.equal(calculateScrollProgress(2500, 3000, 1000), 100);
});

test('calculateScrollProgress handles negative scroll offsets (iOS bounce)', () => {
  assert.equal(calculateScrollProgress(-50, 3000, 1000), 0);
});

test('calculateScrollProgress returns 0 when content does not exceed viewport', () => {
  assert.equal(calculateScrollProgress(0, 800, 1000), 0);
});
