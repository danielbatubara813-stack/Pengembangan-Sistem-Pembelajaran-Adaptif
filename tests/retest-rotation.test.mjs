import test from 'node:test';
import assert from 'node:assert/strict';
import { getRetestQuestionsForAttempt } from '../src/data/retestPools.ts';

test('retest fallback rotates question order when the skill gap focus changes', () => {
  const attemptOne = getRetestQuestionsForAttempt(1, ['Object Oriented Programming / OOP']);
  const attemptTwo = getRetestQuestionsForAttempt(1, ['Database & PDO']);

  assert.notStrictEqual(
    attemptOne[0].question,
    attemptTwo[0].question,
    'Questions should rotate when the skill gap focus changes even without Gemini.'
  );
});
