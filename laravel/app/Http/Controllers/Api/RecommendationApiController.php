<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserLearningRecommendation;
use App\Services\AdaptiveRecommendationService;
use App\Services\CompetencyAssessmentService;
use App\Services\ProgressSnapshotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationApiController extends Controller
{
    public function __construct(
        private readonly AdaptiveRecommendationService $recommendations,
        private readonly ProgressSnapshotService $progressSnapshots,
        private readonly CompetencyAssessmentService $competencyAssessments,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $initial = $request->user()->assessments()->orderBy('completed_at')->orderBy('id')->first();
        if (! $initial) {
            return response()->json($this->recommendations->build([]));
        }

        $latestRetest = $request->user()->retests()
            ->where('initial_assessment_id', $initial->id)
            ->latest('completed_at')->latest('id')->first();
        $result = $latestRetest
            ? $this->progressSnapshots->retestResult($latestRetest)
            : $this->progressSnapshots->assessmentResult($initial);
        $skillGaps = $this->competencyAssessments->currentSkillGaps($initial, $latestRetest);
        $competencyStatus = $this->progressSnapshots->competencyStatuses($initial, $latestRetest);
        if ($latestRetest) {
            $masteredCompetencyIds = $latestRetest->competencyResults()
                ->where('status', 'mastered')
                ->pluck('competency_id');
            if ($masteredCompetencyIds->isNotEmpty()) {
                UserLearningRecommendation::query()
                    ->where('user_id', $request->user()->getKey())
                    ->where('status', 'active')
                    ->whereHas('recommendation', fn ($query) => $query->whereIn('competency_id', $masteredCompetencyIds))
                    ->update(['status' => 'mastered']);
            }
        }

        $storedProgress = $request->user()->progress()->first()?->payload ?? [];
        $built = $this->recommendations->build(
            $skillGaps,
            is_array($storedProgress['completedMaterials'] ?? null) ? $storedProgress['completedMaterials'] : [],
            $request->user(),
            $initial,
            $latestRetest,
        );

        return response()->json([
            ...$built,
            'assessment' => [
                'id' => $result['id'],
                'type' => $result['type'],
                'score' => $result['score'],
                'level' => $result['level'],
            ],
            'competencyStatus' => $competencyStatus,
        ]);
    }
}
