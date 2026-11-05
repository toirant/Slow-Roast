/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LAST_THREE_MONTHS_ORIGINS,
  MAP_DIMENSIONS,
  projectCoordinates,
  calculateDistanceKm,
  getCoffeeBeltYBounds,
  getOriginById,
  formatAltitude,
} from './coffeeOrigins.ts';

test('LAST_THREE_MONTHS_ORIGINS contains exactly 3 origins for the past 3 months', () => {
  assert.equal(LAST_THREE_MONTHS_ORIGINS.length, 3);
  const months = LAST_THREE_MONTHS_ORIGINS.map((o) => o.month);
  assert.deepEqual(months, ['November', 'October', 'September']);

  // Verify all essential metadata exists for each origin
  for (const origin of LAST_THREE_MONTHS_ORIGINS) {
    assert.ok(origin.id.length > 0);
    assert.ok(origin.country.length > 0);
    assert.ok(origin.region.length > 0);
    assert.ok(origin.elevationMeters > 1500, 'Specialty coffee elevations should be high-altitude');
    assert.ok(origin.tastingNotes.length >= 3);
    assert.ok(origin.varietal.length > 0);
    assert.ok(origin.terroirStory.length > 20);
  }
});

test('projectCoordinates maps latitude and longitude into valid SVG canvas bounds', () => {
  const center = projectCoordinates(0, 0);
  assert.ok(center.x > 0 && center.x < MAP_DIMENSIONS.width);
  assert.ok(center.y > 0 && center.y < MAP_DIMENSIONS.height);

  // Ethiopia (Horn of Africa, lat ~5.92, lng ~38.38)
  const ethiopia = projectCoordinates(5.92, 38.38);
  assert.ok(ethiopia.x > MAP_DIMENSIONS.width / 2, 'Ethiopia is East of Prime Meridian');
  assert.ok(ethiopia.y < MAP_DIMENSIONS.height / 2 + 30, 'Ethiopia is near the Equator');

  // Colombia (South America, lat ~1.88, lng ~ -76.27)
  const colombia = projectCoordinates(1.88, -76.27);
  assert.ok(colombia.x < MAP_DIMENSIONS.width / 2, 'Colombia is West of Prime Meridian');

  // Guatemala (Central America, lat ~14.56, lng ~ -90.73)
  const guatemala = projectCoordinates(14.56, -90.73);
  assert.ok(guatemala.x < colombia.x, 'Guatemala is further West than Colombia');
  assert.ok(guatemala.y < colombia.y, 'Guatemala is further North than Colombia');
});

test('getCoffeeBeltYBounds returns valid latitude boundaries for 23.5° N and 23.5° S', () => {
  const bounds = getCoffeeBeltYBounds();
  assert.ok(bounds.yTop > 0);
  assert.ok(bounds.yBottom > bounds.yTop);
  assert.ok(bounds.height > 80 && bounds.height < 180);

  // Check that all 3 coffee origins fall cleanly inside the Coffee Belt Y bounds
  for (const origin of LAST_THREE_MONTHS_ORIGINS) {
    const pt = projectCoordinates(origin.lat, origin.lng);
    assert.ok(
      pt.y >= bounds.yTop && pt.y <= bounds.yBottom,
      `${origin.country} at y=${pt.y} must fall within Coffee Belt range [${bounds.yTop}, ${bounds.yBottom}]`
    );
  }
});

test('calculateDistanceKm computes realistic distance between coffee regions', () => {
  // Distance between Colombia and Guatemala
  const dist = calculateDistanceKm(1.88, -76.27, 14.56, -90.73);
  assert.ok(dist > 2000 && dist < 2400, `Distance was ${dist}km, expected ~2150km`);

  // Distance to self should be 0
  assert.equal(calculateDistanceKm(5.92, 38.38, 5.92, 38.38), 0);
});

test('getOriginById retrieves existing origin or defaults safely', () => {
  const found = getOriginById('colombia-huila');
  assert.equal(found.country, 'Colombia');

  const fallback = getOriginById('non-existent-id');
  assert.equal(fallback.id, LAST_THREE_MONTHS_ORIGINS[0].id);
});

test('formatAltitude formats meter and feet strings accurately', () => {
  const str = formatAltitude(LAST_THREE_MONTHS_ORIGINS[0]);
  assert.equal(str, '2,150m (7,050ft)');
});
