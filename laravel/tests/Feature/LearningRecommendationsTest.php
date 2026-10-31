<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\AssessmentCompetencyResult;
use App\Models\LearningCompetency;
use App\Models\Recommendation;
use App\Models\Retest;
use App\Models\User;
use App\Models\UserLearningRecommendation;
use App\Services\LearningResourceSearchService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LearningRecommendationsTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        config()->set('services.gemini.api_key', 'test-gemini-key');
        config()->set('services.gemini.search_model', 'test-search-model');
        config()->set('services.openrouter.api_key', 'test-openrouter-key');
        config()->set('learning.search_cache_store', 'array');
        config()->set('learning.search_min_match_score', 25);
        Cache::store('array')->flush();
    }

    public function test_recommendations_are_personalized_by_microcompetency_and_duplicate_or_bad_pages_are_rejected(): void
    {
        $arrayUrl = 'https://example.com/lesson/associative-array-keys';
        $arrayUrl2 = 'https://www.w3schools.com/php/php_arrays_associative.asp';
        $functionUrl = 'https://developer.mozilla.org/en-US/docs/Web/PHP/Function_Return_Values';
        $categoryUrl = 'https://example.com/category/arrays';
        $unreachableUrl = 'https://example.com/lesson/unreachable';
        $invalidUrl = 'http://example.com/lesson/plain-http';

        Http::fake(function (Request $request) use ($arrayUrl, $arrayUrl2, $functionUrl, $categoryUrl, $unreachableUrl, $invalidUrl) {
            if (str_contains($request->url(), 'generativelanguage.googleapis.com/v1beta/interactions')) {
                $input = (string) $request->data()['input'];
                $urls = str_contains(mb_strtolower($input), 'associative array')
                    ? [$arrayUrl, $arrayUrl, $arrayUrl2, $categoryUrl, $unreachableUrl, $invalidUrl]
                    : [$functionUrl];
                return Http::response($this->groundedSearchResponse($urls), 200);
            }

            if (str_contains($request->url(), 'openrouter.ai/api/v1/chat/completions')) {
                return Http::response(['choices' => [['message' => ['content' => json_encode([
                    'resources' => [['id' => 'r1', 'score' => 92, 'reason' => 'Halaman ini menjelaskan kompetensi secara langsung.']],
                ])]]]], 200);
            }

            if ($request->url() === $unreachableUrl) return Http::response('not found', 404);
            if ($request->url() === $categoryUrl) return Http::response($this->page('Array category', 'Kumpulan materi umum tentang array dan pemrograman.'), 200, ['Content-Type' => 'text/html']);
            if ($request->url() === $arrayUrl) return Http::response($this->page(
                'Accessing PHP associative array values by key',
                'Learn how associative arrays store values by named keys, then read a value by selecting its key. This page includes PHP examples and exercises.',
            ), 200, ['Content-Type' => 'text/html']);
            if ($request->url() === $arrayUrl2) return Http::response($this->page(
                'PHP associative arrays: access values by key',
                'A practical PHP guide to named array keys, selecting the right key, and reading the value stored there with code examples and exercises.',
            ), 200, ['Content-Type' => 'text/html']);
            if ($request->url() === $functionUrl) return Http::response($this->page(
                'Mengembalikan nilai fungsi menggunakan return',
                'Contoh PHP ini mengembalikan nilai fungsi dengan return. Pelajari parameter, nilai hasil, dan cara pemanggil menggunakan return value.',
            ), 200, ['Content-Type' => 'text/html']);

            return Http::response('', 500);
        });

        [$arrayUser, $arrayAssessment] = $this->learnerWithGap(
            'Learner Arrays', 'array-gap', 'Array', 'Mengakses elemen associative array berdasarkan key', 20,
        );
        [$functionUser] = $this->learnerWithGap(
            'Learner Functions', 'function-gap', 'Function', 'Mengembalikan nilai fungsi menggunakan return', 10,
        );

        $arrayResponse = $this->actingAs($arrayUser)->getJson('/api/recommendations')->assertOk();
        $arrayResponse->assertJsonPath('learningPath.0.competencyName', 'Mengakses elemen associative array berdasarkan key')
            ->assertJsonPath('learningPath.0.searchStatus.candidateCount', 5)
            ->assertJsonPath('learningPath.0.searchStatus.acceptedCount', 2)
            ->assertJsonPath('learningPath.0.searchStatus.rejected.irrelevant', 1)
            ->assertJsonPath('learningPath.0.searchStatus.rejected.unreachable', 1)
            ->assertJsonPath('learningPath.0.searchStatus.rejected.invalid_url', 1);
        $this->assertEqualsCanonicalizing([$arrayUrl, $arrayUrl2], array_column($arrayResponse->json('recommendations'), 'url'));
        $this->assertCount(2, array_unique(array_column($arrayResponse->json('recommendations'), 'sourceDomain')));
        $this->assertSame($arrayAssessment->id, UserLearningRecommendation::query()->where('user_id', $arrayUser->id)->value('assessment_id'));
        $this->assertSame('verified', Recommendation::query()->where('url', $arrayUrl)->value('validation_status'));
        $this->assertSame('irrelevant', Recommendation::query()->where('url', $categoryUrl)->value('validation_status'));
        $this->assertSame('unreachable', Recommendation::query()->where('url', $unreachableUrl)->value('validation_status'));
        $this->assertSame('invalid_url', Recommendation::query()->where('url', $invalidUrl)->value('validation_status'));
        $materialId = $arrayResponse->json('recommendations.0.id');
        $this->putJson('/api/progress/materials', ['id' => $materialId, 'completed' => true])
            ->assertOk()->assertJsonPath('completedMaterials.0', $materialId);
        $this->getJson('/api/progress')->assertOk()
            ->assertJsonPath('progress.completedMaterials.0', $materialId);

        auth()->forgetGuards();
        $functionResponse = $this->actingAs($functionUser)->getJson('/api/recommendations')->assertOk();
        $functionResponse->assertJsonPath('learningPath.0.competencyName', 'Mengembalikan nilai fungsi menggunakan return');
        $this->assertSame([$functionUrl], array_column($functionResponse->json('recommendations'), 'url'));
        $this->assertNotSame($arrayResponse->json('recommendations.0.url'), $functionResponse->json('recommendations.0.url'));
    }

    public function test_unplayable_videos_and_empty_search_results_are_not_returned(): void
    {
        $videoId = 'AbCdEfGh123';
        $videoUrl = 'https://www.youtube.com/watch?v='.$videoId;
        Http::fake(function (Request $request) use ($videoUrl) {
            if (str_contains($request->url(), 'generativelanguage.googleapis.com/v1beta/interactions')) {
                $input = (string) $request->data()['input'];
                return Http::response($this->groundedSearchResponse(str_contains($input, 'associative array') ? [$videoUrl] : []), 200);
            }
            if (str_contains($request->url(), 'youtube.com/oembed')) return Http::response(['title' => 'Associative arrays in PHP', 'author_name' => 'Example Channel'], 200);
            if (str_contains($request->url(), 'youtube.com/embed/')) return Http::response('{"playabilityStatus":{"status":"LOGIN_REQUIRED"}}', 200, ['Content-Type' => 'text/html']);
            if ($request->url() === $videoUrl) return Http::response($this->page(
                'Associative arrays in PHP',
                'A lesson on associative arrays, how to access each named key, and how the returned array value is used in PHP code.',
            ), 200, ['Content-Type' => 'text/html']);
            return Http::response('', 500);
        });

        $service = app(LearningResourceSearchService::class);
        $videoResult = $service->resourcesFor([
            'topic' => 'Array',
            'competencyKey' => 'array-associative-array-key',
            'competencyName' => 'Mengakses elemen associative array berdasarkan key',
            'learningObjective' => 'Memilih key array dan membaca nilai yang sesuai.',
        ]);
        $this->assertSame([], $videoResult['resources']);
        $this->assertSame('not_playable', Recommendation::query()->where('url', $videoUrl)->value('validation_status'));
        $this->assertSame(1, $videoResult['validationSummary']['rejected']['not_playable']);

        $emptyResult = $service->resourcesFor([
            'topic' => 'Function',
            'competencyKey' => 'function-empty-result',
            'competencyName' => 'Mengembalikan nilai fungsi dengan return',
            'learningObjective' => 'Menggunakan return untuk memberi hasil kepada pemanggil.',
        ]);
        $this->assertSame([], $emptyResult['resources']);
        $this->assertSame('no_results', $emptyResult['validationSummary']['status']);
    }

    public function test_retest_finds_an_alternative_and_marks_previous_recommendation_as_superseded(): void
    {
        $oldUrl = 'https://example.com/lesson/old-associative-array';
        $newUrl = 'https://example.com/tutorial/alternative-array-keys';
        Http::fake(function (Request $request) use ($oldUrl, $newUrl) {
            if (str_contains($request->url(), 'generativelanguage.googleapis.com/v1beta/interactions')) {
                $input = (string) $request->data()['input'];
                $urls = str_contains($input, $oldUrl) ? [$oldUrl, $newUrl] : [$oldUrl];
                return Http::response($this->groundedSearchResponse($urls), 200);
            }
            if (str_contains($request->url(), 'openrouter.ai/api/v1/chat/completions')) {
                return Http::response(['choices' => [['message' => ['content' => json_encode([
                    'resources' => [['id' => 'r1', 'score' => 90, 'reason' => 'Materi ini langsung melatih akses associative array berdasarkan key.']],
                ])]]]], 200);
            }
            if ($request->url() === $oldUrl) return Http::response($this->page('Associative array keys in PHP', 'Learn to access a value in an associative array using its key. This page has example code and practice tasks.'), 200, ['Content-Type' => 'text/html']);
            if ($request->url() === $newUrl) return Http::response($this->page('Practice: PHP associative array key access', 'Practice selecting a key from a PHP associative array, reading the matching value, and applying it in a code example.'), 200, ['Content-Type' => 'text/html']);
            return Http::response('', 500);
        });

        [$user, $assessment, $competency] = $this->learnerWithGap(
            'Learner Retest', 'retest-gap', 'Array', 'Mengakses elemen associative array berdasarkan key', 20,
        );
        $this->actingAs($user)->getJson('/api/recommendations')->assertOk()
            ->assertJsonPath('recommendations.0.url', $oldUrl);

        $retest = Retest::query()->create([
            'user_id' => $user->id,
            'initial_assessment_id' => $assessment->id,
            'score' => 30,
            'correct_count' => 9,
            'total_questions' => 30,
            'level' => 'Beginner',
            'score_difference' => 10,
            'topic_scores' => [],
            'completed_at' => now(),
        ]);
        AssessmentCompetencyResult::query()->create([
            'user_id' => $user->id,
            'retest_id' => $retest->id,
            'competency_id' => $competency->id,
            'score' => 30,
            'correct_count' => 3,
            'total_questions' => 10,
            'target_score' => 60,
            'status' => 'needs_review',
            'difficulty_scores' => ['Beginner' => ['total' => 4, 'correct' => 2, 'score' => 50]],
            'evidence' => [],
            'diagnosis' => 'Masih perlu melatih akses key array.',
            'evaluated_at' => now(),
        ]);

        auth()->forgetGuards();
        $response = $this->actingAs($user)->getJson('/api/recommendations')->assertOk();
        $this->assertSame([$newUrl], array_column($response->json('recommendations'), 'url'));
        $this->assertSame('superseded', UserLearningRecommendation::query()->where('user_id', $user->id)->where('retest_id', null)->value('status'));
        $this->assertSame('active', UserLearningRecommendation::query()->where('user_id', $user->id)->where('retest_id', $retest->id)->value('status'));
    }

    private function learnerWithGap(string $label, string $suffix, string $topic, string $name, int $score): array
    {
        $user = User::query()->create([
            'name' => $label,
            'email' => $suffix.'-'.bin2hex(random_bytes(5)).'@example.test',
            'password' => 'Passw0rd!_test',
        ]);
        $assessment = Assessment::query()->create([
            'user_id' => $user->id,
            'score' => 40,
            'total_questions' => 30,
            'correct_count' => 12,
            'level' => 'Beginner',
            'topic_scores' => [],
            'completed_at' => now(),
        ]);
        $competency = LearningCompetency::query()->create([
            'competency_key' => $suffix.'-'.bin2hex(random_bytes(4)),
            'topic' => $topic,
            'name' => $name,
            'learning_objective' => 'Menerapkan '.$name.' pada program PHP.',
            'example_code' => null,
            'practice_prompt' => 'Buat latihan kecil untuk '.$name.'.',
        ]);
        AssessmentCompetencyResult::query()->create([
            'user_id' => $user->id,
            'assessment_id' => $assessment->id,
            'competency_id' => $competency->id,
            'score' => $score,
            'correct_count' => 2,
            'total_questions' => 10,
            'target_score' => 60,
            'status' => 'needs_review',
            'difficulty_scores' => ['Beginner' => ['total' => 5, 'correct' => 1, 'score' => 20], 'Intermediate' => ['total' => 5, 'correct' => 1, 'score' => 20]],
            'evidence' => [['questionId' => 1, 'difficulty' => 'Beginner', 'isCorrect' => false, 'question' => 'Evidence']],
            'diagnosis' => 'Skor rendah pada '.$name.'.',
            'evaluated_at' => now(),
        ]);

        return [$user, $assessment, $competency];
    }

    private function groundedSearchResponse(array $urls): array
    {
        return [
            'steps' => [
                ['type' => 'google_search_call', 'arguments' => ['queries' => ['specific PHP skill tutorial']]],
                ['type' => 'model_output', 'content' => [[
                    'type' => 'text',
                    'text' => 'Found pages for the specific competency.',
                    'annotations' => array_map(fn (string $url) => ['type' => 'url_citation', 'url' => $url, 'title' => 'Search title'], $urls),
                ]]],
            ],
        ];
    }

    private function page(string $title, string $description): string
    {
        return '<!doctype html><html><head><title>'.$title.'</title><meta name="description" content="'.$description.'"></head><body><main>'.$description.' PHP examples and exercises help learners practice the specific skill using code.</main></body></html>';
    }
}
