<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Retest;
use App\Models\Recommendation;
use App\Models\SkillGap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Tampilkan Dashboard Pembelajaran Adaptif.
     * PENTING: Dashboard TIDAK boleh muncul sebelum pengguna menyelesaikan assessment awal!
     */
    public function index()
    {
        $userId = Auth::id() ?? 1;

        $initialAssessment = Assessment::where('user_id', $userId)
            ->latest()
            ->first();

        // Guard: Jika belum ada assessment awal, paksa ke assessment
        if (!$initialAssessment) {
            return redirect()->route('assessment.index')
                ->with('warning', 'Harap selesaikan Assessment Awal terlebih dahulu.');
        }

        $latestRetest = Retest::where('user_id', $userId)
            ->latest()
            ->first();

        // Skill gaps aktif
        $skillGaps = SkillGap::where('user_id', $userId)
            ->where('status', 'active')
            ->get();

        $skillGapTopics = $skillGaps->pluck('topic')->toArray();

        // Rekomendasi materi terarah sesuai skill gaps
        $suggestedRecommendations = Recommendation::whereIn('topic', $skillGapTopics)
            ->take(6)
            ->get();

        // Hitung progress pembelajaran
        $totalRelevant = Recommendation::whereIn('topic', $skillGapTopics)->count();
        $completedCount = Auth::user()?->recommendations()
            ->wherePivot('is_completed', true)
            ->count() ?? 0;

        $progressPercentage = $latestRetest ? 100 : ($totalRelevant > 0 ? min(85, round(($completedCount / $totalRelevant) * 100) + 20) : 40);

        return view('dashboard', compact(
            'initialAssessment',
            'latestRetest',
            'skillGaps',
            'suggestedRecommendations',
            'progressPercentage'
        ));
    }
}
