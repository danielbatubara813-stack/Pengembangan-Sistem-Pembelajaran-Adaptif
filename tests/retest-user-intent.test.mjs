import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('opening the retest page or viewing a retest result does not prepare another package', async () => {
  const [retestPage, context, resultPage] = await Promise.all([
    readSource('../src/pages/RetestPage.tsx'),
    readSource('../src/context/AppContext.tsx'),
    readSource('../src/pages/RetestResultPage.tsx'),
  ]);

  assert.doesNotMatch(retestPage, /useEffect\s*\(/);
  assert.match(retestPage, /Saya Siap Retest/);
  assert.match(retestPage, /onClick=\{\(\) => void handleRegenerate\(\)\}/);
  assert.doesNotMatch(retestPage, /handleQuickFillRetest|Isi Contoh Jawaban/);
  assert.doesNotMatch(resultPage, /regenerateRetestQuestions/);
  assert.doesNotMatch(context, /simulateCompleteRetest|simulateCompleteInitial/);

  const submitStart = context.indexOf('const submitRetestAssessment');
  const submitEnd = context.indexOf('const markMaterialCompleted', submitStart);
  assert.notEqual(submitStart, -1);
  assert.notEqual(submitEnd, -1);
  assert.doesNotMatch(context.slice(submitStart, submitEnd), /regenerateRetestQuestions/);
});

test('video and material actions do not call the retest question endpoint', async () => {
  const [learningPage, context, assessmentPage] = await Promise.all([
    readSource('../src/pages/LearningDetailPage.tsx'),
    readSource('../src/context/AppContext.tsx'),
    readSource('../src/pages/AssessmentPage.tsx'),
  ]);

  assert.match(learningPage, /openVideoModal\(/);
  assert.match(learningPage, /markMaterialCompleted\(/);
  assert.doesNotMatch(learningPage, /regenerateRetestQuestions/);
  assert.match(context, /bisa belajar lagi atau membuka retest berikutnya/);
  assert.doesNotMatch(assessmentPage, /handleQuickFill|Isi Contoh Jawaban/);
});
