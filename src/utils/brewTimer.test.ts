import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BREW_METHODS,
  calculateTotalSeconds,
  formatTime,
  getStepAtTime,
} from './brewTimer.ts';

test('calculateTotalSeconds sums all step durations accurately', () => {
  const pourOver = BREW_METHODS['pour-over'];
  const total = calculateTotalSeconds(pourOver.steps);
  assert.equal(total, 180);
});

test('formatTime formats minutes and seconds with leading zero', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(5), '0:05');
  assert.equal(formatTime(45), '0:45');
  assert.equal(formatTime(60), '1:00');
  assert.equal(formatTime(125), '2:05');
  assert.equal(formatTime(-10), '0:00');
});

test('getStepAtTime identifies initial step at 0s', () => {
  const pourOver = BREW_METHODS['pour-over'];
  const progress = getStepAtTime(pourOver.steps, 0);

  assert.equal(progress.stepIndex, 0);
  assert.equal(progress.currentStep.id, 'bloom');
  assert.equal(progress.stepElapsed, 0);
  assert.equal(progress.stepRemaining, 45);
  assert.equal(progress.isComplete, false);
  assert.equal(progress.totalRemaining, 180);
  assert.equal(progress.overallProgressPercent, 0);
});

test('getStepAtTime transitions between steps correctly', () => {
  const pourOver = BREW_METHODS['pour-over'];

  // Mid-way through step 1 (bloom: 0-45s)
  const midBloom = getStepAtTime(pourOver.steps, 20);
  assert.equal(midBloom.stepIndex, 0);
  assert.equal(midBloom.stepElapsed, 20);
  assert.equal(midBloom.stepRemaining, 25);

  // Exact start of step 2 (first-pour: 45-90s)
  const startFirstPour = getStepAtTime(pourOver.steps, 45);
  assert.equal(startFirstPour.stepIndex, 1);
  assert.equal(startFirstPour.currentStep.id, 'first-pour');
  assert.equal(startFirstPour.stepElapsed, 0);
  assert.equal(startFirstPour.stepRemaining, 45);

  // Third step (second-pour: 90-135s)
  const midSecondPour = getStepAtTime(pourOver.steps, 100);
  assert.equal(midSecondPour.stepIndex, 2);
  assert.equal(midSecondPour.currentStep.id, 'second-pour');
  assert.equal(midSecondPour.stepElapsed, 10);
});

test('getStepAtTime handles brew completion', () => {
  const pourOver = BREW_METHODS['pour-over'];

  // Exact completion (180s)
  const finished = getStepAtTime(pourOver.steps, 180);
  assert.equal(finished.isComplete, true);
  assert.equal(finished.totalRemaining, 0);
  assert.equal(finished.stepRemaining, 0);
  assert.equal(finished.overallProgressPercent, 100);

  // Past completion
  const past = getStepAtTime(pourOver.steps, 220);
  assert.equal(past.isComplete, true);
  assert.equal(past.totalRemaining, 0);
  assert.equal(past.overallProgressPercent, 100);
});

test('All preset brew methods have valid steps and nonzero duration', () => {
  for (const [key, method] of Object.entries(BREW_METHODS)) {
    assert.ok(method.steps.length >= 3, `${key} should have at least 3 steps`);
    const total = calculateTotalSeconds(method.steps);
    assert.ok(total > 0, `${key} should have positive duration`);
    assert.equal(total, method.totalSeconds, `${key} totalSeconds matches steps sum`);
  }
});
