import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoastRecommendation, QuizAnswers } from './quizLogic.ts';

test('calculateRoastRecommendation gives light roast for pour over and floral fruit preference', () => {
  const answers: QuizAnswers = {
    brewingSetup: 'pour_over',
    flavorPreference: 'bright_floral',
    milkPreference: 'black',
    goal: 'palate_training',
  };
  const result = calculateRoastRecommendation(answers);
  assert.equal(result.roastLevel, 'light');
  assert.equal(result.matchedBrewMethod, 'pour over');
  assert.match(result.profileName, /Light Roast/);
  assert.ok(result.tastingNotes.includes('Bergamot'));
});

test('calculateRoastRecommendation gives dark roast for espresso and deep chocolate preference', () => {
  const answers: QuizAnswers = {
    brewingSetup: 'espresso',
    flavorPreference: 'deep_chocolaty',
    milkPreference: 'latte',
    goal: 'bold_punch',
  };
  const result = calculateRoastRecommendation(answers);
  assert.equal(result.roastLevel, 'dark');
  assert.equal(result.matchedBrewMethod, 'espresso');
  assert.match(result.profileName, /Dark Roast/);
  assert.ok(result.tastingNotes.includes('Dark Cocoa 85%'));
});

test('calculateRoastRecommendation gives balanced medium roast for everyday sweet preference', () => {
  const answers: QuizAnswers = {
    brewingSetup: 'drip',
    flavorPreference: 'sweet_balanced',
    milkPreference: 'splash_milk',
    goal: 'everyday_sweet',
  };
  const result = calculateRoastRecommendation(answers);
  assert.equal(result.roastLevel, 'medium');
  assert.match(result.profileName, /Medium Roast/);
  assert.ok(result.tastingNotes.includes('Dulce de Leche'));
});
