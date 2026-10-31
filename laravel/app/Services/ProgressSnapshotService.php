<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\Retest;
use App\Models\User;
use Illuminate\Support\Collection;

class ProgressSnapshotService
{
    /**
     * Assessment attempts are the source of truth. The JSON progress row stores
     * page state, learned-resource markers, and the last evaluated competency state.
     */
    public function forUser(User $user): array
    {
        $meta = $user->progress()->first()?->payload ?? [];
        $initial = $user->assessments()->orderBy('completed_at')->orderBy('id')->first();
        $retests = $initial
            ? $user->retests()->where('initial_assessment_id', $initial->id)
                ->orderBy('completed_at')->orderBy('id')->get()
            : collect();
        $latestRetest = $retests->last();

        $initialResult = $initial ? $this->assessmentResult($initial) : null;
        $retestResult = $latestRetest ? $this->retestResult($latestRetest) : null;
        $competencyStatus = $initial ? $this->competencyStatuses($initial, $latestRetest) : [];

        return [
            'currentPage' => $this->currentPage($meta['currentPage'] ?? null, $initialResult !== null, $retestResult !== null),
            'initialResult' => $initialResult,
            'retestResult' => $retestResult,
            'retestComparison' => $latestRetest && $initial
                ? $this->retestComparison($initial, $latestRetest)
                : null,
            'history' => $this->history($user),
            'competencyStatus' => $competencyStatus,
            'completedMaterials' => is_array($meta['completedMaterials'] ?? null)
                ? array_values(array_unique(array_filter($meta['completedMaterials'], 'is_string')))
                : [],
            'completedMaterialDetails' => is_array($meta['completedMaterialDetails'] ?? null)
                ? $meta['completedMaterialDetails']
                : [],
            'retestAttempt' => max((int) ($meta['retestAttempt'] ?? 1), $retests->count() + 1, 1),
        ];
    }

    public function assessmentResult(Assessment $assessment): array
    {
        $assessment->loadMissing(['answers', 'skillGaps', 'competencyResults.competency']);
        $topicScores = $this->assessmentTopicScores($assessment);
        $gaps = $assessment->competencyResults->where('status', 'needs_review')->map(fn ($result) => $this->competencyGap($result))
            ->filter(fn ($gap) => $gap !== null)->values()->all();
        if ($gaps === []) {
            $gaps = $assessment->skillGaps->where('status', 'active')->map(fn ($gap) => [
                'topic' => TopicCatalog::normalize($gap->topic),
                'score' => (int) $gap->score,
                'priority' => $gap->priority,
                'summary' => $gap->summary ?: "Pemahaman pada materi {$gap->topic} membutuhkan penguatan ({$gap->score}% benar).",
                'recommendationFocus' => TopicCatalog::focus(TopicCatalog::normalize($gap->topic)),
                'competencyName' => TopicCatalog::normalize($gap->topic),
            ])->values()->all();
        }
        if ($gaps === []) $gaps = $this->gapsFromTopicScores($topicScores, $assessment->level);

        return [
            'id' => 'assess-'.$assessment->getKey(),
            'user_id' => (string) $assessment->user_id,
            'type' => 'initial',
            'score' => (int) $assessment->score,
            'totalQuestions' => (int) $assessment->total_questions,
            'correctCount' => (int) $assessment->correct_count,
            'level' => $assessment->level,
            'date' => $this->dateLabel($assessment->completed_at),
            'answers' => $assessment->answers->mapWithKeys(fn ($answer) => [
                (int) $answer->question_id => $answer->selected_answer,
            ])->all(),
            'topicScores' => $topicScores,
            'skillGaps' => $gaps,
            'aiAnalysis' => [
                'summary' => $assessment->ai_summary ?: 'Analisis belum tersedia.',
                'strengths' => $this->strengths($topicScores),
                'weaknesses' => $this->weaknesses($gaps),
                'actionPlan' => $assessment->ai_action_plan ?: 'Pelajari topik prioritas dan lakukan retest setelah berlatih.',
                ...$this->aiMetadata($assessment->ai_source ?? null, $assessment->ai_provider ?? null),
            ],
        ];
    }

    public function retestResult(Retest $retest): array
    {
        $retest->loadMissing(['answers', 'competencyResults.competency']);
        $topicScores = $this->answerTopicScores($retest->answers);
        $gaps = $retest->competencyResults->where('status', 'needs_review')->map(fn ($result) => $this->competencyGap($result))
            ->filter(fn ($gap) => $gap !== null)->values()->all();
        if ($gaps === []) $gaps = $this->gapsFromTopicScores($topicScores, $retest->level);
        $summary = $retest->ai_comparative_analysis ?: 'Analisis perbandingan belum tersedia.';

        return [
            'id' => 'retest-'.$retest->getKey(),
            'user_id' => (string) $retest->user_id,
            'type' => 'retest',
            'score' => (int) $retest->score,
            'totalQuestions' => (int) $retest->total_questions,
            'correctCount' => (int) $retest->correct_count,
            'level' => $retest->level,
            'date' => $this->dateLabel($retest->completed_at),
            'answers' => $retest->answers->mapWithKeys(fn ($answer) => [
                (int) $answer->question_id => $answer->selected_answer,
            ])->all(),
            'topicScores' => $topicScores,
            'skillGaps' => $gaps,
            'aiAnalysis' => [
                'summary' => $summary,
                'strengths' => $this->strengths($topicScores),
                'weaknesses' => $this->weaknesses($gaps),
                'actionPlan' => 'Pelajari kembali topik yang masih menjadi prioritas sebelum retest berikutnya.',
                ...$this->aiMetadata($retest->ai_source ?? null, $retest->ai_provider ?? null),
            ],
        ];
    }

    /** @return array<string, array{status: string, score: int, targetScore: int, evaluatedAt: ?string}> */
    public function competencyStatuses(Assessment $initial, ?Retest $latestRetest = null): array
    {
        $target = $initial->level === 'Beginner' ? 60 : 80;
        $scores = $this->assessmentTopicScores($initial);
        $retestMeasuredTopics = [];
        if ($latestRetest) {
            foreach ($this->answerTopicScores($latestRetest->answers()->get()) as $topic => $score) {
                if ((int) ($score['total'] ?? 0) > 0) {
                    $scores[$topic] = $score;
                    $retestMeasuredTopics[] = $topic;
                }
            }
        }

        $statuses = [];
        foreach (TopicCatalog::TOPICS as $topic) {
            $item = $scores[$topic] ?? ['total' => 0, 'percentage' => 0];
            $measured = (int) ($item['total'] ?? 0) > 0;
            $percentage = (int) ($item['percentage'] ?? 0);
            $statuses[$topic] = [
                'status' => ! $measured ? 'not_assessed' : ($percentage >= $target ? 'mastered' : 'needs_review'),
                'score' => $percentage,
                'targetScore' => $target,
                'evaluatedAt' => ! $measured
                    ? null
                    : (in_array($topic, $retestMeasuredTopics, true) ? $latestRetest?->completed_at : $initial->completed_at)?->toIso8601String(),
            ];
        }

        return $statuses;
    }

    /** @return list<array<string, mixed>> */
    public function currentSkillGaps(Assessment $initial, ?Retest $latestRetest = null): array
    {
        $gaps = collect($this->assessmentResult($initial)['skillGaps'])->keyBy('topic');
        if (! $latestRetest) return $gaps->sortBy('score')->values()->all();

        $target = $initial->level === 'Beginner' ? 60 : 80;
        foreach ($this->answerTopicScores($latestRetest->answers()->get()) as $topic => $score) {
            if ((int) ($score['total'] ?? 0) < 1) continue;
            $percentage = (int) $score['percentage'];
            if ($percentage >= $target) {
                $gaps->forget($topic);
                continue;
            }

            $gaps->put($topic, [
                'topic' => $topic,
                'score' => $percentage,
                'priority' => $percentage < 50 ? 'Tinggi' : 'Sedang',
                'summary' => "Pemahaman pada materi {$topic} membutuhkan penguatan ({$percentage}% benar).",
                'recommendationFocus' => TopicCatalog::focus($topic),
            ]);
        }

        return $gaps->sortBy('score')->values()->all();
    }

    public function retestComparison(Assessment $initial, Retest $retest): array
    {
        $initialScores = $this->assessmentTopicScores($initial);
        $retestScores = $this->answerTopicScores($retest->answers()->get());
        $comparisons = [];
        foreach (TopicCatalog::TOPICS as $topic) {
            $before = (int) ($initialScores[$topic]['percentage'] ?? 0);
            $wasMeasured = (int) ($retestScores[$topic]['total'] ?? 0) > 0;
            $after = $wasMeasured ? (int) $retestScores[$topic]['percentage'] : $before;
            $difference = $after - $before;
            $comparisons[] = [
                'topic' => $topic,
                'initialPercentage' => $before,
                'retestPercentage' => $after,
                'difference' => $difference,
                'status' => ! $wasMeasured ? 'Belum diuji' : ($difference > 0 ? 'Meningkat' : ($difference < 0 ? 'Menurun' : 'Stabil')),
            ];
        }

        $resolved = [];
        $currentGaps = $this->currentSkillGaps($initial, $retest);
        $remaining = array_map(fn ($gap) => $gap['score'] > 0 ? "{$gap['topic']} ({$gap['score']}%)" : $gap['topic'].' (belum diuji)', $currentGaps);
        $remainingTopics = array_column($currentGaps, 'topic');
        $target = $initial->level === 'Beginner' ? 60 : 80;
        foreach ($initial->skillGaps()->get() as $gap) {
            $topicData = $retestScores[$gap->topic] ?? ['total' => 0, 'percentage' => 0];
            $score = (int) ($topicData['percentage'] ?? 0);
            if (! in_array($gap->topic, $remainingTopics, true) && (int) ($topicData['total'] ?? 0) > 0 && $score >= $target) {
                $resolved[] = "{$gap->topic} (dari {$gap->score}% naik menjadi {$score}%)";
            }
        }

        return [
            'initialScore' => (int) $initial->score,
            'retestScore' => (int) $retest->score,
            'scoreDifference' => (int) $retest->score - (int) $initial->score,
            'initialLevel' => $initial->level,
            'currentLevel' => $retest->level,
            'initialDate' => $this->dateLabel($initial->completed_at),
            'retestDate' => $this->dateLabel($retest->completed_at),
            'topicComparisons' => $comparisons,
            'aiComparativeAnalysis' => $retest->ai_comparative_analysis ?: 'Analisis perbandingan belum tersedia.',
            'aiSource' => $retest->ai_source ?? 'legacy_unknown',
            'resolvedSkillGaps' => $resolved,
            'remainingSkillGaps' => $remaining,
        ];
    }

    private function history(User $user): array
    {
        $assessments = $user->assessments()->orderBy('completed_at')->orderBy('id')->get()->map(fn ($item) => [
            'id' => 'hist-assess-'.$item->getKey(),
            '_sort' => $item->completed_at?->getTimestamp() ?? $item->getKey(),
            'date' => $this->dateLabel($item->completed_at),
            'type' => 'Assessment Awal',
            'score' => (int) $item->score,
            'level' => $item->level,
            'status' => $this->aiStatusLabel($item->ai_source ?? null),
        ]);
        $retests = $user->retests()->orderBy('completed_at')->orderBy('id')->get()->map(fn ($item) => [
            'id' => 'hist-retest-'.$item->getKey(),
            '_sort' => $item->completed_at?->getTimestamp() ?? $item->getKey(),
            'date' => $this->dateLabel($item->completed_at),
            'type' => 'Retest',
            'score' => (int) $item->score,
            'level' => $item->level,
            'status' => 'Selesai',
        ]);

        return $assessments->concat($retests)->sortBy('_sort')->map(function (array $item): array {
            unset($item['_sort']);
            return $item;
        })->values()->all();
    }

    private function assessmentTopicScores(Assessment $assessment): array
    {
        $stored = is_array($assessment->topic_scores) ? $assessment->topic_scores : [];
        if ($stored !== [] && ! array_is_list($stored)) {
            $normalized = [];
            foreach ($stored as $topic => $score) {
                if (! is_array($score)) continue;
                $name = TopicCatalog::normalize((string) ($score['topic'] ?? $topic));
                $normalized[$name] = [
                    'topic' => $name,
                    'total' => (int) ($score['total'] ?? 0),
                    'correct' => (int) ($score['correct'] ?? 0),
                    'percentage' => (int) ($score['percentage'] ?? 0),
                    'status' => $score['status'] ?? 'Perlu Peningkatan',
                ];
            }
            if ($normalized !== []) return $normalized;
        }

        return $this->answerTopicScores($assessment->answers);
    }

    private function answerTopicScores(Collection $answers): array
    {
        $counts = [];
        foreach ($answers as $answer) {
            $topic = TopicCatalog::normalize($answer->category);
            $counts[$topic] ??= ['total' => 0, 'correct' => 0];
            $counts[$topic]['total']++;
            if ($answer->is_correct) $counts[$topic]['correct']++;
        }

        $scores = [];
        foreach (TopicCatalog::TOPICS as $topic) {
            $data = $counts[$topic] ?? ['total' => 0, 'correct' => 0];
            $percentage = $data['total'] > 0 ? (int) round(($data['correct'] / $data['total']) * 100) : 0;
            $scores[$topic] = [
                'topic' => $topic,
                'total' => $data['total'],
                'correct' => $data['correct'],
                'percentage' => $percentage,
                'status' => $percentage >= 80 ? 'Mahir' : ($percentage >= 60 ? 'Cukup' : 'Perlu Peningkatan'),
            ];
        }

        return $scores;
    }

    private function gapsFromTopicScores(array $topicScores, string $level): array
    {
        $target = $level === 'Beginner' ? 60 : 80;
        $gaps = [];
        foreach ($topicScores as $topic => $score) {
            if (($score['total'] ?? 0) < 1 || ($score['percentage'] ?? 0) >= $target) continue;
            $percentage = (int) $score['percentage'];
            $gaps[] = [
                'topic' => TopicCatalog::normalize((string) $topic),
                'score' => $percentage,
                'priority' => $percentage < 50 ? 'Tinggi' : 'Sedang',
                'summary' => "Pemahaman pada materi {$topic} membutuhkan penguatan ({$percentage}% benar).",
                'recommendationFocus' => TopicCatalog::focus(TopicCatalog::normalize((string) $topic)),
            ];
        }
        usort($gaps, fn ($a, $b) => $a['score'] <=> $b['score']);
        return $gaps;
    }

    private function strengths(array $topicScores): array
    {
        return collect($topicScores)->filter(fn ($item) => $item['total'] > 0 && $item['percentage'] >= 75)
            ->map(fn ($item) => $item['topic'].' ('.$item['percentage'].'%)')->values()->all()
            ?: ['Belum ada kekuatan topik terukur'];
    }

    private function weaknesses(array $gaps): array
    {
        return collect($gaps)->map(fn ($gap) => $gap['topic'].' ('.$gap['score'].'%)')->values()->all()
            ?: ['Tidak ada gap kritis terdeteksi'];
    }

    private function aiMetadata(?string $source, ?string $provider): array
    {
        $source ??= 'legacy_unknown';
        return [
            'source' => $source,
            'status' => match ($source) {
                'configured_ai' => 'succeeded',
                'local_engine' => 'not_configured',
                'provider_failure_fallback' => 'provider_failed',
                'invalid_response_fallback' => 'invalid_response',
                default => 'unknown',
            },
            'providerConfigured' => in_array($source, ['configured_ai', 'provider_failure_fallback', 'invalid_response_fallback'], true),
            'provider' => $provider,
        ];
    }

    private function aiStatusLabel(?string $source): string
    {
        return match ($source) {
            'configured_ai' => 'Dianalisis AI',
            'local_engine' => 'Analisis aturan',
            'provider_failure_fallback' => 'Fallback: provider gagal',
            'invalid_response_fallback' => 'Fallback: respons AI tidak valid',
            default => 'Status AI tidak tercatat',
        };
    }

    private function competencyGap($result): ?array
    {
        $competency = $result->competency;
        if (! $competency) return null;
        $topic = TopicCatalog::normalize($competency->topic);
        $score = (int) $result->score;
        return [
            'topic' => $topic,
            'score' => $score,
            'priority' => $score < 40 ? 'Tinggi' : ($score < (int) $result->target_score ? 'Sedang' : 'Rendah'),
            'summary' => $result->diagnosis ?: "Skor kompetensi {$score}/100; target {$result->target_score}/100.",
            'recommendationFocus' => $competency->learning_objective ?: TopicCatalog::focus($topic),
            'competencyKey' => $competency->competency_key,
            'competencyName' => $competency->name,
            'learningObjective' => $competency->learning_objective,
            'exampleCode' => $competency->example_code,
            'practicePrompt' => $competency->practice_prompt,
            'difficultyScores' => $result->difficulty_scores ?? [],
            'evidence' => $result->evidence ?? [],
            'evidenceQuestionIds' => array_column($result->evidence ?? [], 'questionId'),
            'targetScore' => (int) $result->target_score,
            'resultId' => $result->getKey(),
        ];
    }

    private function currentPage(?string $page, bool $hasInitial, bool $hasRetest): string
    {
        $allowed = ['assessment_result', 'dashboard', 'analysis', 'classification', 'skill_gap', 'recommendations', 'learning_detail', 'retest', 'retest_result', 'progress', 'history', 'profile'];
        if (! $hasInitial) return 'assessment';
        if ($page === 'retest_result' && ! $hasRetest) return 'dashboard';
        return in_array($page, $allowed, true) ? $page : 'dashboard';
    }

    private function dateLabel($date): string
    {
        return $date ? $date->locale('id')->translatedFormat('j F Y') : now()->locale('id')->translatedFormat('j F Y');
    }
}
