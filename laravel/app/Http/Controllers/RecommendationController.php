<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Models\SkillGap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    /**
     * Tampilkan Rekomendasi Pembelajaran.
     * Hanya materi yang berkaitan dengan Skill Gap pengguna!
     */
    public function index(Request $request)
    {
        $userId = Auth::id() ?? 1;

        $skillGaps = SkillGap::where('user_id', $userId)
            ->where('status', 'active')
            ->get();

        $skillGapTopics = $skillGaps->pluck('topic')->toArray();

        $query = Recommendation::whereIn('topic', $skillGapTopics);

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $recommendations = $query->get()->groupBy('topic');

        return view('recommendations.index', compact('recommendations', 'skillGaps'));
    }

    /**
     * Tampilkan Detail Pembelajaran Topik Tertentu.
     */
    public function show($topic)
    {
        $recommendations = Recommendation::where('topic', $topic)->get();
        return view('recommendations.show', compact('topic', 'recommendations'));
    }

    /**
     * Tandai materi telah selesai dipelajari.
     */
    public function toggleComplete(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $exists = $user->recommendations()->where('recommendation_id', $id)->first();

        if ($exists) {
            $current = $exists->pivot->is_completed;
            $user->recommendations()->updateExistingPivot($id, [
                'is_completed' => !$current,
                'completed_at' => !$current ? now() : null,
            ]);
        } else {
            $user->recommendations()->attach($id, [
                'is_completed' => true,
                'completed_at' => now(),
            ]);
        }

        return response()->json(['success' => true]);
    }
}
