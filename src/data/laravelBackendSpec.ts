export interface LaravelFileSpec {
  filename: string;
  path: string;
  category: 'Migration' | 'Controller' | 'Route' | 'Model' | 'Service';
  description: string;
  code: string;
}

export const LARAVEL_BACKEND_SPECS: LaravelFileSpec[] = [
  {
    filename: 'routes/api.php',
    path: 'routes/api.php',
    category: 'Route',
    description: 'Definisi REST API Endpoints untuk menghubungkan React Frontend dengan Backend Laravel',
    code: `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\AssessmentController;
use App\\Http\\Controllers\\Api\\RecommendationController;
use App\\Http\\Controllers\\Api\\RetestController;
use App\\Http\\Controllers\\Api\\ProgressController;

/*
|--------------------------------------------------------------------------
| REST API Routes - Sistem Pembelajaran Adaptif AI (PHP)
| Frontend: React + Tailwind CSS | Backend: Laravel 11
|--------------------------------------------------------------------------
*/

// Autentikasi Mahasiswa
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Endpoint Terproteksi (Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 1. Assessment Awal 50 Soal
    Route::get('/assessment/initial-questions', [AssessmentController::class, 'getInitialQuestions']);
    Route::post('/assessment/submit-initial', [AssessmentController::class, 'submitInitial']);
    Route::get('/assessment/initial-result/{id}', [AssessmentController::class, 'getInitialResult']);

    // 2. Rekomendasi & Detail Belajar
    Route::get('/recommendations', [RecommendationController::class, 'getUserRecommendations']);
    Route::get('/recommendations/topic/{topic}', [RecommendationController::class, 'getTopicDetail']);
    Route::post('/recommendations/mark-completed', [RecommendationController::class, 'toggleCompleted']);

    // 3. Retest 50 Soal
    Route::get('/retest/questions', [RetestController::class, 'getRetestQuestions']);
    Route::post('/retest/submit', [RetestController::class, 'submitRetest']);
    Route::get('/retest/result/{id}', [RetestController::class, 'getRetestResult']);

    // 4. Progress & Riwayat
    Route::get('/progress/summary', [ProgressController::class, 'getSummary']);
    Route::get('/history', [ProgressController::class, 'getHistory']);
});`
  },
  {
    filename: '2026_10_01_000001_create_adaptive_learning_tables.php',
    path: 'database/migrations/2026_10_01_000001_create_adaptive_learning_tables.php',
    category: 'Migration',
    description: 'Skema Database MySQL untuk 7 Entitas Utama: users, questions, assessments, answers, skill_gaps, recommendations, retests',
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Users / Mahasiswa
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('nim')->nullable();
            $table->string('institution')->nullable()->default('Teknik Informatika');
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Tabel Bank Soal (50 Assessment Awal + 50 Retest)
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['initial', 'retest']);
            $table->enum('category', [
                'Dasar PHP', 'Variabel dan Tipe Data', 'Operator', 'Conditional',
                'Looping', 'Array', 'Function', 'String',
                'Object Oriented Programming / OOP', 'Database / MySQL', 'CRUD', 'Error Handling'
            ]);
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced']);
            $table->text('question');
            $table->text('code_snippet')->nullable();
            $table->json('options'); // ['A' => '...', 'B' => '...', 'C' => '...', 'D' => '...']
            $table->char('correct_answer', 1);
            $table->text('explanation')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Assessments (Assessment Awal)
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('score'); // 0 - 100
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced']);
            $table->integer('total_questions')->default(50);
            $table->integer('correct_count');
            $table->json('topic_scores'); // detail skor per 12 topik
            $table->text('ai_summary')->nullable();
            $table->json('ai_analysis_payload')->nullable();
            $table->timestamps();
        });

        // 4. Tabel Answers (Rekam Jawaban Tiap Butir Soal)
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('retest_id')->nullable()->constrained('retests')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained();
            $table->char('answer', 1)->nullable();
            $table->boolean('is_correct');
            $table->string('category');
            $table->timestamps();
        });

        // 5. Tabel Skill Gaps (Hasil Diagnostik AI)
        Schema::create('skill_gaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assessment_id')->constrained()->cascadeOnDelete();
            $table->string('topic');
            $table->integer('score');
            $table->enum('priority', ['Tinggi', 'Sedang', 'Rendah']);
            $table->string('summary');
            $table->string('recommendation_focus');
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });

        // 6. Tabel Recommendations (Materi Pembelajaran 6 Sumber)
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('topic');
            $table->enum('type', ['video', 'artikel', 'dokumentasi', 'jurnal', 'website', 'latihan']);
            $table->string('title');
            $table->string('url');
            $table->string('embed_video_url')->nullable();
            $table->text('description');
            $table->string('publisher')->nullable();
            $table->integer('estimated_minutes')->default(15);
            $table->timestamps();
        });

        // 7. Tabel Retests (Pengujian Ulang 50 Soal)
        Schema::create('retests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('initial_assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->integer('score');
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced']);
            $table->integer('correct_count');
            $table->integer('score_difference'); // selisih kenaikan skor (+X)
            $table->json('topic_scores');
            $table->text('ai_comparative_analysis')->nullable();
            $table->json('resolved_skill_gaps')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retests');
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('skill_gaps');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('users');
    }
};`
  },
  {
    filename: 'AssessmentController.php',
    path: 'app/Http/Controllers/Api/AssessmentController.php',
    category: 'Controller',
    description: 'Controller Laravel untuk Menghitung Skor, Diagnostik Skill Gap, & Integrasi AI',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Question;
use App\\Models\\Assessment;
use App\\Models\\Answer;
use App\\Models\\SkillGap;
use App\\Services\\GeminiAdaptiveService;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class AssessmentController extends Controller
{
    protected GeminiAdaptiveService $aiService;

    public function __construct(GeminiAdaptiveService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Mengambil tepat 50 soal assessment awal
     */
    public function getInitialQuestions()
    {
        $questions = Question::where('type', 'initial')
            ->select('id', 'question', 'code_snippet', 'options', 'category', 'difficulty')
            ->take(50)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $questions
        ]);
    }

    /**
     * Submit 50 Jawaban, kalkulasi nilai, tentukan level & skill gap via AI
     */
    public function submitInitial(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array'
        ]);

        $user = $request->user();
        $answers = $validated['answers'];

        // Ambil kunci jawaban dari DB
        $questions = Question::where('type', 'initial')->get()->keyBy('id');
        
        $correctCount = 0;
        $topicStats = [];

        DB::beginTransaction();
        try {
            foreach ($questions as $qId => $q) {
                $userAns = $answers[$qId] ?? null;
                $isCorrect = ($userAns === $q->correct_answer);
                if ($isCorrect) $correctCount++;

                if (!isset($topicStats[$q->category])) {
                    $topicStats[$q->category] = ['total' => 0, 'correct' => 0];
                }
                $topicStats[$q->category]['total']++;
                if ($isCorrect) {
                    $topicStats[$q->category]['correct']++;
                }
            }

            $score = round(($correctCount / 50) * 100);

            // Aturan Level:
            // Score < 60 -> Beginner | 60 <= Score < 80 -> Intermediate | Score >= 80 -> Advanced
            $level = match (true) {
                $score >= 80 => 'Advanced',
                $score >= 60 => 'Intermediate',
                default => 'Beginner'
            };

            // Hitung persentase per topik & deteksi Skill Gap (< 70%)
            $topicScores = [];
            $skillGapsData = [];

            foreach ($topicStats as $topic => $stat) {
                $pct = $stat['total'] > 0 ? round(($stat['correct'] / $stat['total']) * 100) : 0;
                $topicScores[$topic] = [
                    'topic' => $topic,
                    'total' => $stat['total'],
                    'correct' => $stat['correct'],
                    'percentage' => $pct
                ];

                if ($pct < 70) {
                    $skillGapsData[] = [
                        'topic' => $topic,
                        'score' => $pct,
                        'priority' => $pct < 50 ? 'Tinggi' : 'Sedang',
                        'summary' => "Pemahaman pada materi $topic perlu penguatan ($pct%).",
                        'recommendation_focus' => "Pahami konsep inti dan latihan kasus $topic."
                    ];
                }
            }

            // Panggil AI Service untuk Analisis Naratif
            $aiAnalysis = $this->aiService->generateDiagnosticReport(
                $user->name,
                $score,
                $level,
                $topicScores,
                $skillGapsData
            );

            // Simpan Assessment ke Database
            $assessment = Assessment::create([
                'user_id' => $user->id,
                'score' => $score,
                'level' => $level,
                'total_questions' => 50,
                'correct_count' => $correctCount,
                'topic_scores' => $topicScores,
                'ai_summary' => $aiAnalysis['summary'] ?? null,
                'ai_analysis_payload' => $aiAnalysis
            ]);

            // Simpan Butir Jawaban
            foreach ($questions as $qId => $q) {
                Answer::create([
                    'assessment_id' => $assessment->id,
                    'question_id' => $qId,
                    'answer' => $answers[$qId] ?? null,
                    'is_correct' => ($answers[$qId] ?? null) === $q->correct_answer,
                    'category' => $q->category
                ]);
            }

            // Simpan Skill Gaps
            foreach ($skillGapsData as $sg) {
                SkillGap::create([
                    'user_id' => $user->id,
                    'assessment_id' => $assessment->id,
                    'topic' => $sg['topic'],
                    'score' => $sg['score'],
                    'priority' => $sg['priority'],
                    'summary' => $sg['summary'],
                    'recommendation_focus' => $sg['recommendation_focus']
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Assessment berhasil dievaluasi oleh AI',
                'data' => [
                    'assessment_id' => $assessment->id,
                    'score' => $score,
                    'level' => $level,
                    'correct_count' => $correctCount,
                    'skill_gaps' => $skillGapsData,
                    'ai_analysis' => $aiAnalysis
                ]
            ]);
        } catch (\\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses assessment: ' . $e->getMessage()
            ], 500);
        }
    }
}`
  },
  {
    filename: 'GeminiAdaptiveService.php',
    path: 'app/Services/GeminiAdaptiveService.php',
    category: 'Service',
    description: 'Service Laravel untuk Berkomunikasi dengan Gemini AI API (Server-Side)',
    code: `<?php

namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Log;

class GeminiAdaptiveService
{
    protected string $apiKey;
    protected string $model = 'gemini-3.8-flash';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', env('GEMINI_API_KEY', ''));
    }

    /**
     * Menganalisis hasil tes mahasiswa & merumuskan diagnosis skill gap
     */
    public function generateDiagnosticReport(string $userName, int $score, string $level, array $topicScores, array $skillGaps): array
    {
        if (empty($this->apiKey)) {
            return $this->fallbackDiagnostic($score, $level, $skillGaps);
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

            $prompt = "Anda adalah AI evaluator sistem pembelajaran adaptif PHP.
Nama Mahasiswa: $userName
Skor: $score/100
Level: $level (Beginner: <60, Intermediate: 60-79, Advanced: >=80)
Skor Per Topik: " . json_encode($topicScores) . "
Skill Gap Terdeteksi: " . json_encode($skillGaps) . "

Berikan analisis akademik yang ringkas dan profesional:
1. Evaluasi singkat kemampuan pengguna (2 kalimat).
2. Analisis akar penyebab pada skill gap (1-2 kalimat).
3. Rencana aksi pembelajaran adaptif konkret sebelum retest.
Format teks santun Bahasa Indonesia.";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'User-Agent' => 'laravel-adaptive-php'
            ])->post($url, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);

            if ($response->successful()) {
                $text = $response->json('candidates.0.content.parts.0.text') ?? '';
                return [
                    'summary' => $text,
                    'source' => 'gemini_api'
                ];
            }
        } catch (\\Exception $e) {
            Log::warning('Gemini API call error in Laravel: ' . $e->getMessage());
        }

        return $this->fallbackDiagnostic($score, $level, $skillGaps);
    }

    protected function fallbackDiagnostic(int $score, string $level, array $skillGaps): array
    {
        $gaps = collect($skillGaps)->pluck('topic')->implode(', ');
        return [
            'summary' => "Kemampuan PHP Anda berada pada level $level ($score/100). Berdasarkan analisis, Anda sudah memahami konsep dasar dengan baik, namun perlu meningkatkan pemahaman pada topik: " . ($gaps ?: 'OOP dan Database') . ".",
            'source' => 'laravel_rule_engine'
        ];
    }
}`
  },
  {
    filename: 'apiClient.ts (React Frontend)',
    path: 'src/services/apiClient.ts',
    category: 'Service',
    description: 'Klien HTTP React (Axios / Fetch) yang siap menghubungkan React Frontend ke Backend Laravel',
    code: `/**
 * React Frontend HTTP Client untuk Laravel Backend
 * Base URL: config dari VITE_LARAVEL_API_URL atau http://localhost:8000/api
 */

const API_BASE_URL = import.meta.env.VITE_LARAVEL_API_URL || '/api';

export const apiClient = {
  // Mendapatkan token Bearer Laravel Sanctum dari localStorage
  getHeaders() {
    const token = localStorage.getItem('laravel_auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
    };
  },

  // 1. Submit Assessment Awal ke Laravel Backend
  async submitInitialAssessment(answers: Record<number, string>) {
    const res = await fetch(\`\${API_BASE_URL}/assessment/submit-initial\`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers })
    });
    return res.json();
  },

  // 2. Submit Retest ke Laravel Backend
  async submitRetest(answers: Record<number, string>) {
    const res = await fetch(\`\${API_BASE_URL}/retest/submit\`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers })
    });
    return res.json();
  },

  // 3. Mengambil Rekomendasi Materi Berdasarkan Skill Gap
  async getRecommendations() {
    const res = await fetch(\`\${API_BASE_URL}/recommendations\`, {
      headers: this.getHeaders()
    });
    return res.json();
  }
};`
  }
];
