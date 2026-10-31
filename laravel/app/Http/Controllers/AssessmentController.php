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
    private const INITIAL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
    private const QUESTIONS_PER_LEVEL = 10;

    protected AdaptiveAiService $aiService;

    public function __construct(AdaptiveAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Tampilkan assessment awal dengan 10 soal acak dari setiap level.
     */
    public function index()
    {
        $questions = collect();

        foreach (self::INITIAL_LEVELS as $difficulty) {
            $levelQuestions = Question::where('exam_type', 'initial')
                ->where('source', 'csv_bank')
                ->where('difficulty', $difficulty)
                ->inRandomOrder()
                ->take(self::QUESTIONS_PER_LEVEL)
                ->get();

            if ($levelQuestions->count() !== self::QUESTIONS_PER_LEVEL) {
                abort(503, "Bank soal {$difficulty} harus memiliki minimal 10 soal.");
            }

            $questions = $questions->concat($levelQuestions);
        }

        $questions = $questions->shuffle()->values();
        session(['initial_assessment_question_ids' => $questions->pluck('id')->all()]);

        return view('assessment.index', compact('questions'));
    }

    /**
     * Nilai jawaban menggunakan paket soal yang sama dengan halaman assessment.
     */
    public function submit(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
        ]);

        $submittedAnswers = $request->input('answers', []);
        $questionIds = session('initial_assessment_question_ids');

        if (! is_array($questionIds) || count($questionIds) !== self::QUESTIONS_PER_LEVEL * count(self::INITIAL_LEVELS)) {
            abort(409, 'Paket soal assessment tidak ditemukan. Silakan mulai tes awal kembali.');
        }

        $questionsById = Question::where('exam_type', 'initial')
            ->where('source', 'csv_bank')
            ->whereIn('id', $questionIds)
            ->get()
            ->keyBy('id');

        if ($questionsById->count() !== count($questionIds)) {
            abort(409, 'Bank soal berubah selama assessment berlangsung. Silakan mulai tes awal kembali.');
        }

        $questions = collect($questionIds)
            ->map(static fn ($id) => $questionsById->get($id))
            ->values();

        foreach (self::INITIAL_LEVELS as $difficulty) {
            if ($questions->where('difficulty', $difficulty)->count() !== self::QUESTIONS_PER_LEVEL) {
                abort(409, 'Paket soal assessment tidak memenuhi komposisi level. Silakan mulai tes awal kembali.');
            }
        }

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
            $level = $this->aiService->determineLevel($score, $topicMap);

            // Identifikasi skill gaps
            $skillGapsData = $this->aiService->analyzeTopicPerformance($topicMap, $level);

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
            session()->forget('initial_assessment_question_ids');

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
