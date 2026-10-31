<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Assessment;
use App\Models\Question;
use App\Models\Retest;
use App\Models\RetestAnswer;
use App\Models\SkillGap;
use App\Models\User;
use App\Services\AdaptiveAiService;
use App\Services\CompetencyAssessmentService;
use App\Services\ProgressSnapshotService;
use App\Services\RetestQuestionGenerator;
use App\Services\TopicCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class AssessmentApiController extends Controller
{
    public function __construct(
        private readonly AdaptiveAiService $aiService,
        private readonly RetestQuestionGenerator $retestQuestionGenerator,
        private readonly ProgressSnapshotService $progressSnapshots,
        private readonly CompetencyAssessmentService $competencyAssessments,
    ) {
    }

    public function initialQuestions(): JsonResponse
    {
        $questionIds = session('initial_assessment_question_ids');
        $selected = collect();

        if (is_array($questionIds) && count($questionIds) === 30) {
            $questionsById = Question::query()
                ->where('exam_type', 'initial')
                ->whereIn('id', $questionIds)
                ->get()
                ->keyBy('id');

            if ($questionsById->count() === 30) {
                $selected = collect($questionIds)
                    ->map(fn ($id) => $questionsById->get($id))
                    ->values();
            }
        }

        if ($selected->count() !== 30) {
            $selected = collect();
            foreach (['Beginner', 'Intermediate', 'Advanced'] as $level) {
                $selected = $selected->concat(
                    Question::query()->where('exam_type', 'initial')->where('difficulty', $level)->inRandomOrder()->limit(10)->get()
                );
            }
        }

        if ($selected->count() < 30) {
            return response()->json(['message' => 'Bank soal assessment harus memiliki 10 soal untuk setiap level.'], 503);
        }

        $questions = $selected->take(30)->values();
        session(['initial_assessment_question_ids' => $questions->pluck('id')->all()]);

        return response()->json([
            'questions' => $questions->map(fn (Question $question) => $this->publicQuestion($question)),
        ]);
    }

    public function submitInitial(Request $request): JsonResponse
    {
        $data = $request->validate([
            'answers' => ['present', 'array', 'max:30'],
            'answers.*' => ['nullable', 'in:A,B,C,D'],
        ]);

        $existing = $request->user()->assessments()->orderBy('completed_at')->orderBy('id')->first();
        if ($existing) {
            session()->forget('initial_assessment_question_ids');
            return response()->json(['result' => $this->progressSnapshots->assessmentResult($existing)]);
        }

        $questionIds = session('initial_assessment_question_ids');

        if (! is_array($questionIds) || count($questionIds) !== 30) {
            return response()->json(['message' => 'Paket soal assessment tidak ditemukan. Silakan mulai assessment kembali.'], 409);
        }
        if ($this->hasUnexpectedAnswers($data['answers'], $questionIds)) {
            return response()->json(['message' => 'Jawaban memuat soal di luar paket assessment ini.'], 422);
        }

        $questions = Question::query()->where('exam_type', 'initial')->whereIn('id', $questionIds)->get();
        if ($questions->count() !== 30) {
            return response()->json(['message' => 'Bank soal berubah selama assessment berlangsung. Silakan mulai kembali.'], 409);
        }

        $calculation = $this->calculate($questions, $data['answers']);
        $aiAnalysis = $this->aiService->generateAssessmentSummary(
            $request->user()->name,
            $calculation['score'],
            $calculation['level'],
            $calculation['skillGaps'],
            $calculation['topicScores'],
        );

        $assessment = DB::transaction(function () use ($request, $questions, $data, $calculation, $aiAnalysis): Assessment {
            $assessment = Assessment::create([
                'user_id' => $request->user()->getKey(),
                'score' => $calculation['score'],
                'total_questions' => $questions->count(),
                'correct_count' => $calculation['correctCount'],
                'level' => $calculation['level'],
                'topic_scores' => $calculation['topicScores'],
                'ai_summary' => $aiAnalysis['summary'],
                'ai_action_plan' => $aiAnalysis['action_plan'],
                'ai_source' => $aiAnalysis['source'] ?? 'local_engine',
                'ai_provider' => $aiAnalysis['provider'] ?? null,
                'completed_at' => now(),
            ]);

            foreach ($questions as $question) {
                $selectedAnswer = $data['answers'][$question->id] ?? $data['answers'][(string) $question->id] ?? null;
                Answer::create([
                    'assessment_id' => $assessment->id,
                    'question_id' => $question->id,
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $selectedAnswer === $question->correct_answer,
                    'category' => TopicCatalog::normalize($question->category),
                ]);
            }

            foreach ($calculation['skillGaps'] as $gap) {
                SkillGap::create([
                    'user_id' => $request->user()->getKey(),
                    'assessment_id' => $assessment->id,
                    'topic' => $gap['topic'],
                    'score' => $gap['score'],
                    'priority' => $gap['priority'],
                    'summary' => $gap['summary'],
                    'status' => 'active',
                ]);
            }

            return $assessment;
        });

        $this->competencyAssessments->record(
            $request->user(), $assessment, null, $questions, $data['answers'], $calculation['level'],
        );

        $competencyStatus = $this->persistCompetencyStatuses($request->user(), $assessment, null);

        session()->forget('initial_assessment_question_ids');

        return response()->json([
            'result' => $this->progressSnapshots->assessmentResult($assessment),
            'competencyStatus' => $competencyStatus,
        ]);
    }

    public function retestQuestions(Request $request): JsonResponse
    {
        $attempt = max(1, (int) $request->input('attempt', 1));
        $initial = Assessment::query()->where('user_id', $request->user()->getKey())->orderBy('completed_at')->orderBy('id')->first();
        if (! $initial) {
            return response()->json(['message' => 'Selesaikan assessment awal sebelum memulai retest.'], 409);
        }

        $latestRetest = $request->user()->retests()
            ->where('initial_assessment_id', $initial->id)
            ->latest('completed_at')->latest('id')->first();
        $gaps = $this->progressSnapshots->currentSkillGaps($initial, $latestRetest);
        $skillGaps = array_values(array_unique(array_column($gaps, 'topic')));

        $usedIds = $initial->answers()->pluck('question_id')
            ->merge(RetestAnswer::query()
                ->whereHas('retest', fn ($query) => $query->where('user_id', $request->user()->getKey()))
                ->pluck('question_id'))
            ->unique()
            ->values()
            ->all();
        $usedStems = Question::query()->whereIn('id', $usedIds)->pluck('question')->all();
        $normalizeStem = static fn (string $stem): string => mb_strtolower((string) preg_replace('/\s+/u', ' ', trim($stem)));
        $usedStemKeys = array_map($normalizeStem, $usedStems);
        $pool = Question::query()->where('exam_type', 'initial')->whereNotIn('id', $usedIds)->inRandomOrder()->get()
            ->reject(fn (Question $question) => in_array($normalizeStem($question->question), $usedStemKeys, true))
            ->unique(fn (Question $question) => $normalizeStem($question->question))
            ->values();
        $focused = $pool->filter(fn (Question $question) => in_array(TopicCatalog::normalize($question->category), $skillGaps, true));
        // Retest only active gap topics when they exist; use unused bank questions first.
        $selected = ($skillGaps === [] ? $pool : $focused)->take(30)->values();
        if ($selected->count() < 30) {
            $generated = $this->retestQuestionGenerator->create($skillGaps ?: TopicCatalog::TOPICS, $initial->level, $attempt, $usedStems);
            $selected = $selected->concat($generated)
                ->unique(fn (Question $question) => $normalizeStem($question->question))
                ->take(30)->values();
        }
        if ($selected->isEmpty()) {
            return response()->json(['message' => 'Bank soal retest belum tersedia.'], 503);
        }

        $selected = $selected->shuffle()->values();
        session(['retest_question_ids' => $selected->pluck('id')->all()]);

        return response()->json([
            'questions' => $selected->map(fn (Question $question) => $this->publicQuestion($question)),
            'attempt' => $attempt,
            'focusTopics' => $skillGaps,
            'message' => 'Paket retest berhasil disiapkan dari bank soal PHP.',
        ]);
    }

    public function submitRetest(Request $request): JsonResponse
    {
        $data = $request->validate([
            'answers' => ['present', 'array', 'max:30'],
            'answers.*' => ['nullable', 'in:A,B,C,D'],
        ]);
        $questionIds = session('retest_question_ids');
        if (! is_array($questionIds) || count($questionIds) < 1 || count($questionIds) > 30) {
            return response()->json(['message' => 'Paket soal retest tidak ditemukan. Silakan mulai retest kembali.'], 409);
        }
        if ($this->hasUnexpectedAnswers($data['answers'], $questionIds)) {
            return response()->json(['message' => 'Jawaban memuat soal di luar paket retest ini.'], 422);
        }

        $userId = $request->user()->getKey();
        $initial = Assessment::query()->where('user_id', $userId)->orderBy('completed_at')->orderBy('id')->first();
        if (! $initial) return response()->json(['message' => 'Selesaikan assessment awal sebelum memulai retest.'], 409);

        $questionsById = Question::query()->whereIn('id', $questionIds)->get()->keyBy('id');
        if ($questionsById->count() !== count($questionIds)) {
            return response()->json(['message' => 'Bank soal berubah selama retest berlangsung. Silakan mulai kembali.'], 409);
        }
        $questions = collect($questionIds)->map(fn ($id) => $questionsById->get($id))->values();
        $calculation = $this->calculate($questions, $data['answers']);
        $initialScores = $initial->topic_scores ?? [];
        $comparisons = $this->compareTopicScores($initialScores, $calculation['topicScores']);
        $scoreDifference = $calculation['score'] - $initial->score;
        $resolved = $this->resolvedGaps($userId, $initial->id, $calculation['topicScores'], $initial->level);
        $progressPayload = $request->user()->progress()->first()?->payload ?? [];
        $previousRetests = $request->user()->retests()
            ->where('initial_assessment_id', $initial->id)
            ->orderBy('completed_at')->get(['score', 'level', 'topic_scores', 'completed_at'])
            ->map(fn ($item) => [
                'score' => (int) $item->score,
                'level' => $item->level,
                'topicScores' => $item->topic_scores,
                'completedAt' => $item->completed_at?->toIso8601String(),
            ])->all();
        $aiComparison = $this->aiService->generateComparativeAnalysisWithMetadata(
            (int) $initial->score,
            $calculation['score'],
            $comparisons,
            [
                'previousRetests' => $previousRetests,
                'completedMaterials' => $progressPayload['completedMaterials'] ?? [],
            ],
        );
        $comparativeAnalysis = $aiComparison['summary'];

        $retest = DB::transaction(function () use ($userId, $initial, $questions, $data, $calculation, $comparisons, $scoreDifference, $comparativeAnalysis, $aiComparison): Retest {
            $retest = Retest::create([
                'user_id' => $userId,
                'initial_assessment_id' => $initial->id,
                'score' => $calculation['score'],
                'correct_count' => $calculation['correctCount'],
                'total_questions' => $questions->count(),
                'level' => $calculation['level'],
                'score_difference' => $scoreDifference,
                'topic_scores' => $calculation['topicScores'],
                'ai_comparative_analysis' => $comparativeAnalysis,
                'ai_source' => $aiComparison['source'] ?? 'local_engine',
                'ai_provider' => $aiComparison['provider'] ?? null,
                'completed_at' => now(),
            ]);

            foreach ($questions as $question) {
                $selectedAnswer = $data['answers'][$question->id] ?? $data['answers'][(string) $question->id] ?? null;
                RetestAnswer::create([
                    'retest_id' => $retest->id,
                    'question_id' => $question->id,
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $selectedAnswer === $question->correct_answer,
                    'category' => TopicCatalog::normalize($question->category),
                ]);
            }

            return $retest;
        });

        $this->competencyAssessments->record(
            $request->user(), $initial, $retest, $questions, $data['answers'], $initial->level,
        );

        $competencyStatus = $this->persistCompetencyStatuses($request->user(), $initial, $retest);

        $result = $this->resultPayload(
            $retest,
            'retest',
            $calculation,
            $data['answers'],
            [
                'summary' => $comparativeAnalysis,
                'action_plan' => 'Pelajari kembali topik yang masih menjadi prioritas.',
                'source' => $aiComparison['source'] ?? 'local_engine',
                'status' => $aiComparison['status'] ?? 'not_configured',
                'provider' => $aiComparison['provider'] ?? null,
                'provider_configured' => $aiComparison['provider_configured'] ?? false,
            ],
            (string) $userId,
        );
        $comparison = [
            'initialScore' => (int) $initial->score,
            'retestScore' => $calculation['score'],
            'scoreDifference' => $scoreDifference,
            'initialLevel' => $initial->level,
            'currentLevel' => $calculation['level'],
            'initialDate' => $this->dateLabel($initial->completed_at),
            'retestDate' => $this->dateLabel($retest->completed_at),
            'topicComparisons' => $comparisons,
            'aiComparativeAnalysis' => $comparativeAnalysis,
            'aiSource' => $aiComparison['source'] ?? 'local_engine',
            'resolvedSkillGaps' => $resolved['resolved'],
            'remainingSkillGaps' => $resolved['remaining'],
        ];

        session()->forget('retest_question_ids');

        return response()->json([
            'retestRes' => $result,
            'comparison' => $comparison,
            'competencyStatus' => $competencyStatus,
        ]);
    }

    private function calculate(Collection $questions, array $answers): array
    {
        $counts = [];
        $correctCount = 0;
        foreach ($questions as $question) {
            $topic = TopicCatalog::normalize($question->category);
            $counts[$topic] ??= ['total' => 0, 'correct' => 0];
            $counts[$topic]['total']++;
            $selected = $answers[$question->id] ?? $answers[(string) $question->id] ?? null;
            if ($selected !== null && $selected === $question->correct_answer) {
                $correctCount++;
                $counts[$topic]['correct']++;
            }
        }

        $total = $questions->count();
        $score = $total > 0 ? (int) round(($correctCount / $total) * 100) : 0;
        $level = $this->aiService->determineLevel($score, $counts);
        $topicScores = [];
        foreach (TopicCatalog::TOPICS as $topic) {
            $data = $counts[$topic] ?? ['total' => 0, 'correct' => 0];
            $percentage = $data['total'] > 0 ? (int) round(($data['correct'] / $data['total']) * 100) : 0;
            $topicScores[$topic] = [
                'topic' => $topic,
                'total' => $data['total'],
                'correct' => $data['correct'],
                'percentage' => $percentage,
                'status' => $percentage >= 80 ? 'Mahir' : ($percentage >= 60 ? 'Cukup' : 'Perlu Peningkatan'),
            ];
        }

        $threshold = $level === 'Beginner' ? 60 : 80;
        $skillGaps = [];
        foreach ($topicScores as $topic => $data) {
            if ($data['total'] === 0 || $data['percentage'] >= $threshold) continue;
            $skillGaps[] = $this->makeGap($topic, $data['percentage'], $data['percentage'] < 50 ? 'Tinggi' : 'Sedang');
        }
        usort($skillGaps, fn ($a, $b) => $a['score'] <=> $b['score']);

        return compact('score', 'correctCount', 'level', 'topicScores', 'skillGaps');
    }

    private function persistCompetencyStatuses(User $user, Assessment $initial, ?Retest $latestRetest): array
    {
        $progress = $user->progress()->first();
        $payload = $progress?->payload ?? [];
        $payload['competencyStatus'] = $this->progressSnapshots->competencyStatuses($initial, $latestRetest);
        $user->progress()->updateOrCreate(
            ['user_id' => $user->getKey()],
            ['payload' => $payload],
        );

        return $payload['competencyStatus'];
    }

    private function makeGap(string $topic, int $score, string $priority): array
    {
        return [
            'topic' => $topic,
            'score' => $score,
            'priority' => $priority,
            'summary' => "Pemahaman pada materi {$topic} membutuhkan penguatan ({$score}% benar).",
            'recommendationFocus' => TopicCatalog::focus($topic),
        ];
    }

    private function resultPayload($record, string $type, array $calculation, array $answers, array $aiAnalysis, string $userId): array
    {
        $strengths = collect($calculation['topicScores'])->filter(fn ($item) => $item['total'] > 0 && $item['percentage'] >= 75)
            ->map(fn ($item) => $item['topic'].' ('.$item['percentage'].'%)')->values()->all();
        $weaknesses = collect($calculation['skillGaps'])->map(fn ($gap) => $gap['topic'].' ('.$gap['score'].'%)')->values()->all();

        return [
            'id' => ($type === 'initial' ? 'assess-' : 'retest-').$record->getKey(),
            'user_id' => $userId,
            'type' => $type,
            'score' => $calculation['score'],
            'totalQuestions' => $record->total_questions,
            'correctCount' => $calculation['correctCount'],
            'level' => $calculation['level'],
            'date' => $this->dateLabel($record->completed_at),
            'answers' => $answers,
            'topicScores' => $calculation['topicScores'],
            'skillGaps' => $calculation['skillGaps'],
            'aiAnalysis' => [
                'summary' => $aiAnalysis['summary'],
                'strengths' => $strengths ?: ['Fondasi Dasar Pemrograman'],
                'weaknesses' => $weaknesses ?: ['Tidak ada gap kritis terdeteksi'],
                'actionPlan' => $aiAnalysis['action_plan'],
                'source' => $aiAnalysis['source'] ?? 'legacy_unknown',
                'status' => $aiAnalysis['status'] ?? 'unknown',
                'provider' => $aiAnalysis['provider'] ?? null,
                'providerConfigured' => $aiAnalysis['provider_configured'] ?? false,
            ],
        ];
    }

    private function compareTopicScores(array $initialScores, array $retestScores): array
    {
        $comparisons = [];
        foreach (TopicCatalog::TOPICS as $topic) {
            $initial = (int) ($initialScores[$topic]['percentage'] ?? 0);
            $wasMeasured = (int) ($retestScores[$topic]['total'] ?? 0) > 0;
            $retest = $wasMeasured ? (int) $retestScores[$topic]['percentage'] : $initial;
            $difference = $retest - $initial;
            $comparisons[] = [
                'topic' => $topic,
                'initialPercentage' => $initial,
                'retestPercentage' => $retest,
                'difference' => $difference,
                'status' => ! $wasMeasured ? 'Belum diuji' : ($difference > 0 ? 'Meningkat' : ($difference < 0 ? 'Menurun' : 'Stabil')),
            ];
        }
        return $comparisons;
    }

    private function resolvedGaps(int|string $userId, int|string $assessmentId, array $topicScores, string $initialLevel): array
    {
        $resolved = [];
        $remaining = [];
        $target = $initialLevel === 'Beginner' ? 60 : 80;
        $gaps = SkillGap::query()->where('user_id', $userId)->where('assessment_id', $assessmentId)->where('status', 'active')->get();
        $baselineTopics = [];

        foreach ($gaps as $gap) {
            $baselineTopics[] = $gap->topic;
            $topicData = $topicScores[$gap->topic] ?? ['total' => 0, 'percentage' => 0];
            if ((int) ($topicData['total'] ?? 0) < 1) {
                $remaining[] = "{$gap->topic} (belum diuji; skor terakhir {$gap->score}%)";
                continue;
            }
            $topicScore = (int) ($topicData['percentage'] ?? 0);
            if ($topicScore >= $target) {
                $resolved[] = "{$gap->topic} (dari {$gap->score}% naik menjadi {$topicScore}%)";
            } else {
                $remaining[] = "{$gap->topic} ({$topicScore}%)";
            }
        }

        foreach ($topicScores as $topic => $topicData) {
            if ((int) ($topicData['total'] ?? 0) < 1 || (int) ($topicData['percentage'] ?? 0) >= $target) continue;
            if (in_array($topic, $baselineTopics, true)) continue;
            $remaining[] = "{$topic} (".(int) $topicData['percentage']."%)";
        }

        return compact('resolved', 'remaining');
    }

    private function publicQuestion(Question $question): array
    {
        $options = $question->options ?? [];
        if (array_is_list($options)) {
            $options = collect($options)->mapWithKeys(fn ($item) => [$item['key'] ?? '' => $item['text'] ?? ''])->all();
        }

        return [
            'id' => (int) $question->id,
            'question' => $question->question,
            'codeSnippet' => $question->code_snippet,
            'options' => collect(['A', 'B', 'C', 'D'])->map(fn ($key) => ['key' => $key, 'text' => $options[$key] ?? ''])->all(),
            'category' => TopicCatalog::normalize($question->category),
            'difficulty' => $question->difficulty,
            'type' => 'multiple_choice',
            'explanation' => $question->explanation,
        ];
    }

    private function hasUnexpectedAnswers(array $answers, array $questionIds): bool
    {
        $allowed = array_map('intval', $questionIds);
        return count(array_diff(array_map('intval', array_keys($answers)), $allowed)) > 0;
    }

    private function dateLabel($date): string
    {
        return $date ? $date->locale('id')->translatedFormat('j F Y') : now()->locale('id')->translatedFormat('j F Y');
    }
}
