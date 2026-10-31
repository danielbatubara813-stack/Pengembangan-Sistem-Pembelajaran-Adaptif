<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Assessment;
use App\Models\Retest;
use App\Models\RetestAnswer;
use App\Models\SkillGap;
use App\Services\AdaptiveAiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RetestController extends Controller
{
    private const MAX_QUESTIONS = 30;

    protected AdaptiveAiService $aiService;

    public function __construct(AdaptiveAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Tampilkan paket retest dengan maksimal 30 soal.
     */
    public function index()
    {
        $userId = Auth::id() ?? 1;
        $initial = Assessment::where('user_id', $userId)->latest()->first();

        if (!$initial) {
            return redirect()->route('assessment.index')
                ->with('warning', 'Harap selesaikan Assessment Awal terlebih dahulu.');
        }

        $questions = Question::where('exam_type', 'retest')
            ->inRandomOrder()
            ->take(self::MAX_QUESTIONS)
            ->get();

        if ($questions->isEmpty()) {
            abort(503, 'Bank soal retest belum tersedia.');
        }

        session(['retest_question_ids' => $questions->pluck('id')->all()]);

        return view('retest.index', compact('questions', 'initial'));
    }

    /**
     * Nilai jawaban hanya untuk soal yang ditampilkan pada paket retest.
     */
    public function submit(Request $request)
    {
        $request->validate([
            'answers' => 'required|array|max:'.self::MAX_QUESTIONS,
            'answers.*' => 'nullable|in:A,B,C,D',
        ]);

        $userId = Auth::id() ?? 1;
        $initial = Assessment::where('user_id', $userId)->latest()->firstOrFail();
        $submittedAnswers = $request->input('answers', []);
        $questionIds = session('retest_question_ids');

        if (! is_array($questionIds) || count($questionIds) < 1 || count($questionIds) > self::MAX_QUESTIONS) {
            abort(409, 'Paket soal retest tidak ditemukan. Silakan mulai retest kembali.');
        }

        $questionsById = Question::where('exam_type', 'retest')
            ->whereIn('id', $questionIds)
            ->get()
            ->keyBy('id');

        if ($questionsById->count() !== count($questionIds)) {
            abort(409, 'Bank soal berubah selama retest berlangsung. Silakan mulai retest kembali.');
        }

        $questions = collect($questionIds)
            ->map(static fn ($id) => $questionsById->get($id))
            ->values();

        $correctCount = 0;
        $totalQuestions = $questions->count();
        $topicMap = [];

        DB::beginTransaction();
        try {
            foreach ($questions as $q) {
                if (!isset($topicMap[$q->category])) {
                    $topicMap[$q->category] = ['total' => 0, 'correct' => 0];
                }
                $topicMap[$q->category]['total']++;

                $userAns = $submittedAnswers[$q->id] ?? null;
                $isCorrect = ($userAns === $q->correct_answer);

                if ($isCorrect) {
                    $correctCount++;
                    $topicMap[$q->category]['correct']++;
                }
            }

            $score = $totalQuestions > 0 ? (int) round(($correctCount / $totalQuestions) * 100) : 0;
            $level = $this->aiService->determineLevel($score, $topicMap);
            $scoreDiff = $score - $initial->score;

            // Buat komparasi per topik
            $topicComparisons = [];
            $initialTopics = $initial->topic_scores ?? [];

            foreach ($topicMap as $topic => $data) {
                $retestPerc = $data['total'] > 0 ? round(($data['correct'] / $data['total']) * 100) : 0;
                $initPerc = isset($initialTopics[$topic]) && $initialTopics[$topic]['total'] > 0
                    ? round(($initialTopics[$topic]['correct'] / $initialTopics[$topic]['total']) * 100)
                    : 0;

                $topicComparisons[$topic] = [
                    'initial' => $initPerc,
                    'retest' => $retestPerc,
                    'diff' => $retestPerc - $initPerc,
                ];

                // Jika topik skill gap naik >= 70%, tandai resolved
                $targetScore = $initial->level === 'Beginner' ? 60 : 80;
                if ($retestPerc >= $targetScore) {
                    SkillGap::where('user_id', $userId)
                        ->where('topic', $topic)
                        ->update(['status' => 'resolved']);
                }
            }

            // AI Comparative text
            $aiAnalysis = $this->aiService->generateComparativeAnalysis($initial->score, $score, $topicComparisons);

            // Simpan Retest
            $retest = Retest::create([
                'user_id' => $userId,
                'initial_assessment_id' => $initial->id,
                'score' => $score,
                'correct_count' => $correctCount,
                'total_questions' => $totalQuestions,
                'level' => $level,
                'score_difference' => $scoreDiff,
                'topic_scores' => $topicComparisons,
                'ai_comparative_analysis' => $aiAnalysis,
                'completed_at' => now(),
            ]);

            // Simpan rincian jawaban retest
            foreach ($questions as $q) {
                $userAns = $submittedAnswers[$q->id] ?? null;
                RetestAnswer::create([
                    'retest_id' => $retest->id,
                    'question_id' => $q->id,
                    'selected_answer' => $userAns,
                    'is_correct' => ($userAns === $q->correct_answer),
                    'category' => $q->category,
                ]);
            }

            DB::commit();
            session()->forget('retest_question_ids');

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'retest_id' => $retest->id,
                    'score' => $score,
                    'score_difference' => $scoreDiff,
                    'redirect_url' => route('retest.result', $retest->id),
                ]);
            }

            return redirect()->route('retest.result', $retest->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan retest: ' . $e->getMessage()]);
        }
    }

    /**
     * Tampilkan Hasil Retest & Komparasi.
     */
    public function result($id)
    {
        $retest = Retest::with(['initialAssessment', 'answers.question'])->findOrFail($id);
        return view('retest.result', compact('retest'));
    }
}
