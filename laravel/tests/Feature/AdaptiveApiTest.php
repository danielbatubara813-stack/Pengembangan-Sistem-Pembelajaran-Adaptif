<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\Answer;
use App\Models\Assessment;
use App\Models\AssessmentCompetencyResult;
use App\Models\LearningCompetency;
use App\Models\SkillGap;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdaptiveApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_sanctum_session_progress_assessment_and_retest_api(): void
    {
        $email = $this->testEmail('learner');
        $this->assertSame('mysql', config('database.default'));
        $this->assertSame('pengembangan_pembelajaran_adaptif', config('database.connections.mysql.database'));
        $this->withHeaders([
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
        ]);

        $this->postJson('/api/auth/register', [
            'name' => 'Test Learner',
            'email' => $email,
            'nim' => (string) random_int(100000, 999999),
            'password' => 'Passw0rd!_test',
        ])->assertCreated()
            ->assertJsonPath('user.email', $email)
            ->assertJsonPath('progress', null);

        $this->getJson('/api/auth/me')->assertOk()
            ->assertJsonPath('progress.initialResult', null)
            ->assertJsonPath('progress.currentPage', 'assessment');

        $user = User::query()->where('email', $email)->firstOrFail();
        $this->assertTrue(Hash::check('Passw0rd!_test', $user->password));
        $this->assertArrayNotHasKey('password', $this->getJson('/api/auth/profile')->assertOk()->json('user'));

        $this->putJson('/api/progress', [
            'currentPage' => 'profile',
            'history' => [],
            'completedMaterials' => [],
            'retestAttempt' => 1,
        ])->assertOk()->assertJsonPath('success', true);
        $this->getJson('/api/progress')->assertOk()->assertJsonPath('progress.currentPage', 'assessment');

        $levels = ['Beginner', 'Intermediate', 'Advanced'];
        $answerKeys = ['A', 'B', 'C', 'D'];
        $questionNumber = 0;
        foreach ($levels as $level) {
            for ($index = 0; $index < 20; $index++) {
                $questionNumber++;
                Question::create([
                    'question' => "Soal tes {$questionNumber}",
                    'code_snippet' => null,
                    'options' => ['A' => 'Pilihan A', 'B' => 'Pilihan B', 'C' => 'Pilihan C', 'D' => 'Pilihan D'],
                    'correct_answer' => $answerKeys[$index % count($answerKeys)],
                    'category' => 'Dasar PHP',
                    'difficulty' => $level,
                    'exam_type' => 'initial',
                    'source' => 'feature_test',
                    'bank_key' => "feature-test:{$questionNumber}",
                ]);
            }
        }

        $initialQuestions = $this->getJson('/api/assessment/questions')
            ->assertOk()
            ->json('questions');
        $this->assertCount(30, $initialQuestions);
        $this->assertArrayNotHasKey('correct_answer', $initialQuestions[0]);

        $initialAnswers = [];
        foreach ($initialQuestions as $question) {
            $initialAnswers[$question['id']] = Question::query()->findOrFail($question['id'])->correct_answer;
        }

        config()->set('services.openrouter.api_key', null);
        config()->set('services.gemini.api_key', 'test-only-gemini-secret');
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [['content' => ['parts' => [['text' => json_encode([
                    'summary' => 'Analisis assessment berdasarkan skor per topik.',
                    'action_plan' => 'Pelajari topik dengan skor terendah sebelum retest.',
                ])]]]]],
            ], 200),
        ]);
        $initialResult = $this->postJson('/api/assessment/submit-initial', ['answers' => $initialAnswers])
            ->assertOk()
            ->assertJsonPath('result.aiAnalysis.source', 'configured_ai')
            ->assertJsonPath('result.aiAnalysis.status', 'succeeded')
            ->assertJsonPath('result.aiAnalysis.provider', 'gemini')
            ->json('result');
        $this->assertSame(100, $initialResult['score']);
        $this->assertSame(1, $user->assessments()->count());
        $this->assertSame(30, $user->assessments()->firstOrFail()->answers()->count());
        $this->assertSame('configured_ai', $user->assessments()->firstOrFail()->ai_source);
        $this->assertSame('gemini', $user->assessments()->firstOrFail()->ai_provider);
        Http::assertSent(fn ($request) => str_contains(
            $request['contents'][0]['parts'][0]['text'] ?? '',
            'topicScores',
        ) && str_contains($request['contents'][0]['parts'][0]['text'] ?? '', 'skillGaps'));
        $this->getJson('/api/auth/me')->assertOk()
            ->assertJsonPath('progress.initialResult.id', $initialResult['id'])
            ->assertJsonPath('progress.initialResult.score', 100)
            ->assertJsonPath('progress.initialResult.aiAnalysis.source', 'configured_ai');
        $this->postJson('/api/assessment/submit-initial', ['answers' => $initialAnswers])
            ->assertOk()->assertJsonPath('result.id', $initialResult['id']);
        $this->assertSame(1, $user->assessments()->count(), 'Submitting the initial assessment twice must be idempotent.');
        config()->set('services.gemini.api_key', null);

        $retestQuestions = $this->postJson('/api/retest/questions', ['attempt' => 1])
            ->assertOk()
            ->json('questions');
        $this->assertCount(30, $retestQuestions);
        $this->assertArrayNotHasKey('correct_answer', $retestQuestions[0]);

        $retestAnswers = [];
        foreach ($retestQuestions as $question) {
            $retestAnswers[$question['id']] = Question::query()->findOrFail($question['id'])->correct_answer;
        }

        $this->postJson('/api/retest/submit', ['answers' => $retestAnswers])
            ->assertOk()
            ->assertJsonPath('retestRes.score', 100);
        $this->assertSame(1, $user->retests()->count());
        $this->assertSame(30, $user->retests()->firstOrFail()->answers()->count());
        $this->putJson('/api/progress', [
            'currentPage' => 'profile',
            'retestAttempt' => 2,
        ])->assertOk();
        $this->putJson('/api/progress/materials', [
            'id' => 'resource:array:manual',
            'completed' => true,
        ])->assertOk()->assertJsonPath('completedMaterials.0', 'resource:array:manual');
        $this->getJson('/api/auth/me')->assertOk()
            ->assertJsonPath('progress.initialResult.id', $initialResult['id'])
            ->assertJsonPath('progress.retestResult.id', 'retest-'.$user->retests()->firstOrFail()->id)
            ->assertJsonPath('progress.retestComparison.initialScore', 100)
            ->assertJsonPath('progress.completedMaterials.0', 'resource:array:manual');

        $this->postJson('/api/ai/analyze-assessment', [
            'score' => 100,
            'level' => 'Advanced',
            'topicScores' => [],
            'skillGaps' => [],
            'type' => 'initial',
            'userName' => 'Test Learner',
        ])->assertOk()->assertJsonPath('success', true)->assertJsonPath('source', 'local_engine');
        $this->postJson('/api/ai/compare-retest', [
            'initialScore' => 100,
            'retestScore' => 100,
            'initialLevel' => 'Advanced',
            'retestLevel' => 'Advanced',
            'topicComparisons' => [],
            'resolvedGaps' => [],
        ])->assertOk()->assertJsonPath('success', true);
        $this->postJson('/api/ai/generate-retest-questions', [
            'skillGaps' => ['Dasar PHP'],
            'level' => 'Intermediate',
            'attempt' => 2,
        ])->assertOk()->assertJsonPath('source', 'missing_ai_key');
        $this->postJson('/api/ai/recommend-youtube', ['skillGaps' => ['Dasar PHP']])
            ->assertOk()->assertJsonPath('recommendations', []);
        $this->postJson('/api/ai/companion-tip', ['currentRoute' => 'profile'])
            ->assertOk()->assertJsonPath('success', true);
        $this->getJson('/api/recommendations')->assertOk();

        $this->postJson('/api/auth/logout')->assertOk()->assertJsonPath('success', true);
        Auth::forgetGuards();
        $this->getJson('/api/auth/me')->assertUnauthorized();

        $this->postJson('/api/auth/login', [
            'email' => $email,
            'password' => 'Passw0rd!_test',
        ])->assertOk()->assertJsonPath('user.email', $email)
            ->assertJsonPath('progress.initialResult.id', $initialResult['id'])
            ->assertJsonPath('progress.initialResult.aiAnalysis.provider', 'gemini')
            ->assertJsonPath('progress.retestResult.id', 'retest-'.$user->retests()->firstOrFail()->id)
            ->assertJsonPath('progress.completedMaterials.0', 'resource:array:manual');
        $this->getJson('/api/auth/me')->assertOk();
    }

    public function test_recommendations_do_not_fabricate_urls_when_search_is_unavailable(): void
    {
        $arrayEmail = $this->testEmail('array');
        $functionEmail = $this->testEmail('function');
        $arrayLearner = User::create([
            'name' => 'Array Learner', 'email' => $arrayEmail, 'password' => 'Passw0rd!_test',
        ]);
        $functionLearner = User::create([
            'name' => 'Function Learner', 'email' => $functionEmail, 'password' => 'Passw0rd!_test',
        ]);

        foreach ([[$arrayLearner, 'Array', 18], [$functionLearner, 'Function', 54]] as [$learner, $topic, $score]) {
            $assessment = Assessment::create([
                'user_id' => $learner->id,
                'score' => $score,
                'total_questions' => 30,
                'correct_count' => (int) round($score * 0.3),
                'level' => 'Beginner',
                'topic_scores' => [$topic => [
                    'topic' => $topic, 'total' => 10, 'correct' => (int) round($score / 10),
                    'percentage' => $score, 'status' => 'Perlu Peningkatan',
                ]],
                'ai_summary' => 'Fallback test',
                'ai_action_plan' => 'Belajar lagi',
                'ai_source' => 'local_engine',
                'completed_at' => now(),
            ]);
            SkillGap::create([
                'user_id' => $learner->id,
                'assessment_id' => $assessment->id,
                'topic' => $topic,
                'score' => $score,
                'priority' => $score < 50 ? 'Tinggi' : 'Sedang',
                'summary' => "Skor {$topic} {$score}%.",
                'status' => 'active',
            ]);
        }

        $arrayPath = $this->actingAs($arrayLearner)->getJson('/api/recommendations')->assertOk();
        $functionPath = $this->actingAs($functionLearner)->getJson('/api/recommendations')->assertOk();
        $this->assertSame('Array', $arrayPath->json('learningPath.0.topic'));
        $this->assertSame('Function', $functionPath->json('learningPath.0.topic'));
        $this->assertNotSame($arrayPath->json('topics'), $functionPath->json('topics'));
        $this->assertSame(60, $arrayPath->json('learningPath.0.targetScore'));
        $this->assertSame([], $arrayPath->json('recommendations'));
        $this->assertSame('search_unavailable', $arrayPath->json('learningPath.0.searchStatus.status'));

        $arrayId = (string) $arrayLearner->id;
        $functionId = (string) $functionLearner->id;
        Auth::forgetGuards();
        $this->actingAs($arrayLearner)->getJson('/api/auth/me')->assertOk()
            ->assertJsonPath('progress.initialResult.user_id', $arrayId);
        Auth::forgetGuards();
        $this->actingAs($functionLearner)->getJson('/api/auth/me')->assertOk()
            ->assertJsonPath('progress.initialResult.user_id', $functionId)
            ->assertJsonPath('progress.initialResult.id', 'assess-'.$functionLearner->assessments()->firstOrFail()->id);
        $this->assertNotSame($arrayId, $functionId);
    }

    public function test_partial_learning_does_not_start_retest_and_gap_retest_updates_saved_mastery_and_recommendations(): void
    {
        $this->withHeaders([
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
        ]);
        $user = User::create([
            'name' => 'Skill Gap Learner',
            'email' => $this->testEmail('skill-gap'),
            'password' => Hash::make('Passw0rd!_test'),
        ]);
        $assessment = Assessment::create([
            'user_id' => $user->id,
            'score' => 20,
            'total_questions' => 2,
            'correct_count' => 0,
            'level' => 'Beginner',
            'topic_scores' => ['Array' => [
                'topic' => 'Array', 'total' => 2, 'correct' => 0, 'percentage' => 0, 'status' => 'Perlu Peningkatan',
            ]],
            'ai_summary' => 'Perlu penguatan Array.',
            'ai_action_plan' => 'Pilih materi Array yang diperlukan.',
            'ai_source' => 'local_engine',
            'completed_at' => now(),
        ]);
        SkillGap::create([
            'user_id' => $user->id,
            'assessment_id' => $assessment->id,
            'topic' => 'Array',
            'score' => 0,
            'priority' => 'Tinggi',
            'summary' => 'Array perlu penguatan.',
            'status' => 'active',
        ]);

        $usedQuestionIds = [];
        foreach (range(1, 2) as $index) {
            $question = Question::create([
                'question' => "Soal awal Array {$index}",
                'options' => ['A' => 'A', 'B' => 'B', 'C' => 'C', 'D' => 'D'],
                'correct_answer' => 'A',
                'category' => 'Array',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'source' => 'feature_test',
                'bank_key' => "skill-gap-used-{$index}",
            ]);
            $usedQuestionIds[] = $question->id;
            Answer::create([
                'assessment_id' => $assessment->id,
                'question_id' => $question->id,
                'selected_answer' => 'B',
                'is_correct' => false,
                'category' => 'Array',
            ]);
        }

        foreach (range(1, 60) as $index) {
            Question::create([
                'question' => "Soal retest Array {$index}",
                'options' => ['A' => 'A', 'B' => 'B', 'C' => 'C', 'D' => 'D'],
                'correct_answer' => 'A',
                'category' => 'Array',
                'difficulty' => 'Beginner',
                'exam_type' => 'initial',
                'source' => 'feature_test',
                'bank_key' => "skill-gap-alternative-{$index}",
            ]);
        }

        $this->actingAs($user)->getJson('/api/recommendations')->assertOk()
            ->assertJsonPath('learningPath.0.topic', 'Array');
        $this->putJson('/api/progress/materials', [
            'id' => 'resource:array:manual', 'completed' => true,
        ])->assertOk();
        $this->getJson('/api/progress')->assertOk()
            ->assertJsonPath('progress.completedMaterials.0', 'resource:array:manual');
        $this->assertSame(0, $user->retests()->count(), 'Opening recommendations and studying one material must not create a retest.');

        $questions = $this->postJson('/api/retest/questions', ['attempt' => 1])
            ->assertOk()->assertJsonPath('focusTopics.0', 'Array')->json('questions');
        $this->assertCount(30, $questions);
        $this->assertSame(['Array'], array_values(array_unique(array_column($questions, 'category'))));
        $this->assertSame([], array_values(array_intersect($usedQuestionIds, array_column($questions, 'id'))));
        $this->assertSame(0, $user->retests()->count(), 'Preparing questions is not a completed retest.');

        $incorrectAnswers = [];
        foreach ($questions as $question) {
            $correctAnswer = Question::query()->findOrFail($question['id'])->correct_answer;
            $incorrectAnswers[$question['id']] = $correctAnswer === 'A' ? 'B' : 'A';
        }
        $this->postJson('/api/retest/submit', ['answers' => $incorrectAnswers])->assertOk()
            ->assertJsonPath('retestRes.score', 0)
            ->assertJsonPath('comparison.remainingSkillGaps.0', 'Array (0%)')
            ->assertJsonPath('competencyStatus.Array.status', 'needs_review');
        $this->getJson('/api/recommendations')->assertOk()
            ->assertJsonPath('learningPath.0.topic', 'Array');

        $secondQuestions = $this->postJson('/api/retest/questions', ['attempt' => 2])
            ->assertOk()->assertJsonPath('focusTopics.0', 'Array')->json('questions');
        $this->assertCount(30, $secondQuestions);
        $this->assertSame([], array_values(array_intersect(array_column($questions, 'id'), array_column($secondQuestions, 'id'))));
        $this->assertSame([], array_values(array_intersect($usedQuestionIds, array_column($secondQuestions, 'id'))));

        $answers = [];
        foreach ($secondQuestions as $question) {
            $answers[$question['id']] = Question::query()->findOrFail($question['id'])->correct_answer;
        }
        $this->postJson('/api/retest/submit', ['answers' => $answers])->assertOk()
            ->assertJsonPath('retestRes.score', 100)
            ->assertJsonPath('comparison.resolvedSkillGaps.0', 'Array (dari 0% naik menjadi 100%)')
            ->assertJsonPath('competencyStatus.Array.status', 'mastered');

        $this->assertSame(2, $user->retests()->count());
        $this->getJson('/api/recommendations')->assertOk()
            ->assertJsonPath('learningPath', []);
        $this->postJson('/api/auth/logout')->assertOk();
        Auth::forgetGuards();
        $this->postJson('/api/auth/login', [
            'email' => $user->email, 'password' => 'Passw0rd!_test',
        ])->assertOk()
            ->assertJsonPath('progress.retestResult.score', 100)
            ->assertJsonPath('progress.competencyStatus.Array.status', 'mastered')
            ->assertJsonPath('progress.completedMaterials.0', 'resource:array:manual');
    }

    public function test_ai_provider_success_invalid_response_and_failure_are_reported_without_secrets(): void
    {
        $user = User::create([
            'name' => 'AI Learner', 'email' => $this->testEmail('ai'), 'password' => 'Passw0rd!_test',
        ]);
        $this->actingAs($user);
        config()->set('services.openrouter.api_key', null);
        config()->set('services.gemini.api_key', 'test-only-gemini-secret');

        $this->getJson('/api/ai/status')->assertOk()
            ->assertJsonPath('configured', true)
            ->assertJsonPath('provider', 'gemini')
            ->assertJsonMissing(['api_key' => 'test-only-gemini-secret']);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::sequence()
                ->push([
                'candidates' => [['content' => ['parts' => [['text' => json_encode([
                    'summary' => 'Analisis berbasis skor Array 20%.',
                    'action_plan' => 'Pelajari array numerik lalu associative.',
                ])]]]]],
                ], 200)
                ->push([
                    'candidates' => [['content' => ['parts' => [['text' => 'bukan JSON valid']]]]],
                ], 200)
                ->push(['error' => ['message' => 'provider unavailable']], 503),
        ]);
        $this->postJson('/api/ai/analyze-assessment', [
            'score' => 40,
            'level' => 'Beginner',
            'topicScores' => ['Array' => ['percentage' => 20]],
            'skillGaps' => [['topic' => 'Array', 'score' => 20]],
        ])->assertOk()
            ->assertJsonPath('source', 'configured_ai')
            ->assertJsonPath('status', 'succeeded')
            ->assertJsonPath('provider', 'gemini')
            ->assertJsonPath('summary', 'Analisis berbasis skor Array 20%.')
            ->assertDontSee('test-only-gemini-secret');

        $this->postJson('/api/ai/analyze-assessment', [
            'score' => 40, 'level' => 'Beginner', 'skillGaps' => [['topic' => 'Array', 'score' => 20]],
        ])->assertOk()->assertJsonPath('source', 'invalid_response_fallback')->assertJsonPath('status', 'invalid_response');

        $this->postJson('/api/ai/analyze-assessment', [
            'score' => 40, 'level' => 'Beginner', 'skillGaps' => [['topic' => 'Array', 'score' => 20]],
        ])->assertOk()->assertJsonPath('source', 'provider_failure_fallback')->assertJsonPath('status', 'provider_failed');
    }

    private function testEmail(string $prefix): string
    {
        return $prefix.'-'.bin2hex(random_bytes(6)).'@example.test';
    }
}
