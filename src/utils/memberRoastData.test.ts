import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_MEMBER_MONTHLY_HISTORY,
  calculateLifetimeRoastStats,
} from './memberRoastData.ts';

test('calculateLifetimeRoastStats computes total bags and proportions across 12 months', () => {
  const stats = calculateLifetimeRoastStats(DEFAULT_MEMBER_MONTHLY_HISTORY);

  assert.equal(stats.totalMonths, 12);
  assert.equal(stats.totalBags, 24); // 2 bags per month

  const light = stats.distribution.find((d) => d.roastKey === 'light');
  const medium = stats.distribution.find((d) => d.roastKey === 'medium');
  const dark = stats.distribution.find((d) => d.roastKey === 'dark');

  assert.ok(light && light.bags > 0);
  assert.ok(medium && medium.bags > 0);
  assert.ok(dark && dark.bags > 0);

  // Sum of bags should equal totalBags
  assert.equal((light?.bags || 0) + (medium?.bags || 0) + (dark?.bags || 0), 24);

  // Medium roast should be dominant in default history
  assert.equal(stats.dominantRoast.roastKey, 'medium');
});

test('calculateLifetimeRoastStats handles custom or empty records gracefully', () => {
  const emptyStats = calculateLifetimeRoastStats([]);
  assert.equal(emptyStats.totalBags, 0);
  assert.equal(emptyStats.totalMonths, 0);
  assert.equal(emptyStats.distribution.every((d) => d.percentage === 0), true);
});
