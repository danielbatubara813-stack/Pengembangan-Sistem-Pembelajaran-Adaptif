<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\Assessment;
use App\Models\AssessmentCompetencyResult;
use App\Models\Retest;
use App\Models\User;

class AdaptiveRecommendationService
{
    public function __construct(private readonly LearningResourceSearchService $resourceSearch)
    {
    }

    public function build(
        array $skillGaps,
        array $completedMaterials = [],
        ?User $user = null,
        ?Assessment $assessment = null,
        ?Retest $retest = null,
    ): array {
        $gaps = collect($skillGaps)
            ->filter(fn ($gap) => is_array($gap) && isset($gap['topic']))
            ->map(function (array $gap): array {
                $topic = TopicCatalog::normalize((string) $gap['topic']);
                $name = trim((string) ($gap['competencyName'] ?? $gap['name'] ?? $topic));
                $score = max(0, min(100, (int) ($gap['score'] ?? 0)));
                $target = max(1, min(100, (int) ($gap['targetScore'] ?? 80)));
                return [
                    ...$gap,
                    'topic' => $topic,
                    'competencyKey' => (string) ($gap['competencyKey'] ?? Str::slug($topic.'-'.$name)),
                    'competencyName' => $name,
                    'score' => $score,
                    'priority' => $score < 40 ? 'Tinggi' : ($score < $target ? 'Sedang' : 'Rendah'),
                    'summary' => (string) ($gap['summary'] ?? "Skor kompetensi {$name} adalah {$score}/100; targetnya {$target}/100."),
                    'recommendationFocus' => (string) ($gap['recommendationFocus'] ?? $gap['learningObjective'] ?? TopicCatalog::focus($topic)),
                    'learningObjective' => (string) ($gap['learningObjective'] ?? $gap['recommendationFocus'] ?? TopicCatalog::focus($topic)),
                    'targetScore' => $target,
                    'exampleCode' => $gap['exampleCode'] ?? null,
                    'practicePrompt' => $gap['practicePrompt'] ?? null,
                    'difficultyScores' => $gap['difficultyScores'] ?? [],
                    'evidence' => $gap['evidence'] ?? [],
                ];
            })
            ->filter(fn ($gap) => ! (($gap['status'] ?? null) === 'mastered' || $gap['score'] >= $gap['targetScore']))
            ->unique('competencyKey')
            ->sortBy('score')
            ->values();

        $learningPath = [];
        $recommendations = [];
        foreach ($gaps as $index => $gap) {
            $attemptResult = ! empty($gap['resultId'])
                ? AssessmentCompetencyResult::query()->find($gap['resultId'])
                : null;
            $search = $this->resourceSearch->resourcesFor(
                $gap,
                [],
                $user,
                $assessment?->getKey(),
                $retest?->getKey(),
                $attemptResult,
            );
            $resources = $search['resources'];
            foreach ($resources as &$resource) {
                $resource['gap'] = $gap;
                $resource['sequence'] = $index + 1;
                $resource['completed'] = in_array($resource['id'], $completedMaterials, true);
                $resource['priority'] = $gap['priority'];
                $resource['targetScore'] = $gap['targetScore'];
                $recommendations[] = $resource;
            }
            unset($resource);

            $learningPath[] = [
                ...$gap,
                'sequence' => $index + 1,
                'reason' => $gap['summary'],
                'resources' => $resources,
                'searchStatus' => $search['validationSummary'],
            ];
        }

        return [
            'source' => 'live_web_search',
            'skillGaps' => $learningPath,
            'topics' => $gaps->pluck('topic')->unique()->values()->all(),
            'learningPath' => $learningPath,
            'recommendations' => $recommendations,
            'emptyMessage' => $gaps->isEmpty()
                ? 'Belum ada skill gap aktif. Kompetensi yang sudah mencapai target tidak ditampilkan sebagai prioritas.'
                : ($recommendations === [] ? 'Belum ditemukan sumber yang lolos validasi untuk kompetensi ini. Coba lagi setelah beberapa saat.' : null),
        ];
    }

}
