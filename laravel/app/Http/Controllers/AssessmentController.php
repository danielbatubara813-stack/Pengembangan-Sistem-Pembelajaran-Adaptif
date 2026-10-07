<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Assessment;
use App\Models\Answer;
use App\Models\SkillGap;
use App\Services\AdaptiveAiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AssessmentController extends Controller
{
    protected AdaptiveAiService $aiService;

    public function __construct(AdaptiveAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Tampilkan halaman Assessment Awal (Tepat 50 Soal PHP).
     */
    public function index()
    {
        $questions = Question::where('exam_type', 'initial')
            ->orderBy('id', 'asc')
            ->take(50)
            ->get();

        return view('assessment.index', compact('questions'));
    }

    /**
     * Proses submit 50 soal assessment awal.
     */
    public function submit(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
        ]);

        $submittedAnswers = $request->input('answers', []);
        $questions = Question::where('exam_type', 'initial')->take(50)->get();

        $correctCount = 0;
        $totalQuestions = $questions->count();

        $topicMap = [];

        DB::beginTransaction();
        try {
            // Inisialisasi peta topik
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

            // Hitung skor 0-100 & level
            $score = $totalQuestions > 0 ? (int) round(($correctCount / $totalQuestions) * 100) : 0;
            $level = $this->aiService->determineLevel($score);

            // Identifikasi skill gaps
            $skillGapsData = $this->aiService->analyzeTopicPerformance($topicMap);

            // Analisis naratif AI
            $userName = Auth::user()?->name ?? 'Mahasiswa';
            $aiAnalysis = $this->aiService->generateAssessmentSummary($userName, $score, $level, $skillGapsData);

            // Simpan Assessment
            $assessment = Assessment::create([
                'user_id' => Auth::id() ?? 1,
                'score' => $score,
                'total_questions' => $totalQuestions,
                'correct_count' => $correctCount,
                'level' => $level,
                'topic_scores' => $topicMap,
                'ai_summary' => $aiAnalysis['summary'],
                'ai_action_plan' => $aiAnalysis['action_plan'],
                'completed_at' => now(),
            ]);

            // Simpan rincian jawaban
            foreach ($questions as $q) {
                $userAns = $submittedAnswers[$q->id] ?? null;
                Answer::create([
                    'assessment_id' => $assessment->id,
                    'question_id' => $q->id,
                    'selected_answer' => $userAns,
                    'is_correct' => ($userAns === $q->correct_answer),
                    'category' => $q->category,
                ]);
            }

            // Simpan Skill Gaps
            foreach ($skillGapsData as $gap) {
                SkillGap::create([
                    'user_id' => Auth::id() ?? 1,
                    'assessment_id' => $assessment->id,
                    'topic' => $gap['topic'],
                    'score' => $gap['score'],
                    'priority' => $gap['priority'],
                    'summary' => $gap['summary'],
                    'status' => 'active',
                ]);
            }

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'assessment_id' => $assessment->id,
                    'score' => $score,
                    'level' => $level,
                    'skill_gaps' => $skillGapsData,
                    'redirect_url' => route('assessment.result', $assessment->id),
                ]);
            }

            return redirect()->route('assessment.result', $assessment->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan hasil assessment: ' . $e->getMessage()]);
        }
    }

    /**
     * Tampilkan Hasil Assessment.
     */
    public function result($id)
    {
        $assessment = Assessment::with(['skillGaps', 'answers.question'])->findOrFail($id);
        return view('assessment.result', compact('assessment'));
    }
}
