import React, { useState } from 'react';
import {
  FolderArchive,
  FileCode,
  Copy,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  Terminal
} from 'lucide-react';

interface FileEntry {
  category: string;
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const LaravelCodeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const files: FileEntry[] = [
    {
      category: 'Database Migration',
      name: 'create_adaptive_php_tables.php',
      path: 'database/migrations/2026_01_01_000001_create_adaptive_php_tables.php',
      language: 'php',
      description: 'Migrasi 8 tabel relasional: questions, assessments, answers, skill_gaps, retests, retest_answers, recommendations, progress.',
      content: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Soal
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('code_snippet')->nullable();
            $table->json('options'); // ['A' => '...', 'B' => '...', 'C' => '...', 'D' => '...']
            $table->enum('correct_answer', ['A', 'B', 'C', 'D']);
            $table->string('category');
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->enum('exam_type', ['initial', 'retest'])->default('initial');
            $table->text('explanation')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Assessment Awal
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('score');
            $table->integer('total_questions')->default(50);
            $table->integer('correct_count');
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced']);
            $table->json('topic_scores')->nullable();
            $table->text('ai_summary')->nullable();
            $table->text('ai_action_plan')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Jawaban
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->enum('selected_answer', ['A', 'B', 'C', 'D'])->nullable();
            $table->boolean('is_correct')->default(false);
            $table->string('category');
            $table->timestamps();
        });

        // 4. Tabel Skill Gap
        Schema::create('skill_gaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assessment_id')->nullable()->constrained()->nullOnDelete();
            $table->string('topic');
            $table->integer('score');
            $table->enum('priority', ['Tinggi', 'Sedang', 'Rendah'])->default('Sedang');
            $table->string('status')->default('active');
            $table->text('summary')->nullable();
            $table->timestamps();
        });

        // 5. Tabel Retest
        Schema::create('retests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('initial_assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->integer('score');
            $table->integer('correct_count');
            $table->integer('total_questions')->default(50);
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced']);
            $table->integer('score_difference');
            $table->json('topic_scores')->nullable();
            $table->text('ai_comparative_analysis')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 6. Tabel Rekomendasi
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('topic');
            $table->enum('type', ['video', 'artikel', 'dokumentasi', 'jurnal', 'website', 'latihan']);
            $table->string('title');
            $table->text('description');
            $table->string('url');
            $table->string('embed_video_url')->nullable();
            $table->string('publisher')->nullable();
            $table->integer('estimated_minutes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('retests');
        Schema::dropIfExists('skill_gaps');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('questions');
    }
};`
    },
    {
      category: 'Models',
      name: 'Assessment.php',
      path: 'app/Models/Assessment.php',
      language: 'php',
      description: 'Model Eloquent untuk assessment awal dengan relasi ke user, answers, dan skill gaps.',
      content: `<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'score',
        'total_questions',
        'correct_count',
        'level',
        'topic_scores',
        'ai_summary',
        'ai_action_plan',
        'completed_at',
    ];

    protected $casts = [
        'topic_scores' => 'array',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function skillGaps()
    {
        return $this->hasMany(SkillGap::class);
    }

    public function retest()
    {
        return $this->hasOne(Retest::class, 'initial_assessment_id');
    }
}`
    },
    {
      category: 'Controllers',
      name: 'AssessmentController.php',
      path: 'app/Http/Controllers/AssessmentController.php',
      language: 'php',
      description: 'Logika penanganan submit 50 soal, penilaian adaptif, identifikasi skill gap, dan redirect ke hasil.',
      content: `<?php

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

    public function index()
    {
        $questions = Question::where('exam_type', 'initial')
            ->orderBy('id', 'asc')
            ->take(50)
            ->get();

        return view('assessment.index', compact('questions'));
    }

    public function submit(Request $request)
    {
        $request->validate(['answers' => 'required|array']);
        $submittedAnswers = $request->input('answers', []);
        $questions = Question::where('exam_type', 'initial')->take(50)->get();

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
            $level = $this->aiService->determineLevel($score);
            $skillGapsData = $this->aiService->analyzeTopicPerformance($topicMap);
            $aiAnalysis = $this->aiService->generateAssessmentSummary(Auth::user()?->name ?? 'Mahasiswa', $score, $level, $skillGapsData);

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

            foreach ($questions as $q) {
                Answer::create([
                    'assessment_id' => $assessment->id,
                    'question_id' => $q->id,
                    'selected_answer' => $submittedAnswers[$q->id] ?? null,
                    'is_correct' => (($submittedAnswers[$q->id] ?? null) === $q->correct_answer),
                    'category' => $q->category,
                ]);
            }

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
            return redirect()->route('assessment.result', $assessment->id);
        } catch (\\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function result($id)
    {
        $assessment = Assessment::with(['skillGaps', 'answers.question'])->findOrFail($id);
        return view('assessment.result', compact('assessment'));
    }
}`
    },
    {
      category: 'Services',
      name: 'AdaptiveAiService.php',
      path: 'app/Services/AdaptiveAiService.php',
      language: 'php',
      description: 'Service penentu level (<60 Beginner, 60-79 Intermediate, >=80 Advanced), diagnostik skill gap, dan integrasi Gemini LLM.',
      content: `<?php

namespace App\Services;

class AdaptiveAiService
{
    public function determineLevel(int $score): string
    {
        if ($score >= 80) return 'Advanced';
        if ($score >= 60) return 'Intermediate';
        return 'Beginner';
    }

    public function analyzeTopicPerformance(array $topicScores): array
    {
        $skillGaps = [];
        foreach ($topicScores as $topic => $data) {
            $percentage = $data['total'] > 0 ? round(($data['correct'] / $data['total']) * 100) : 0;
            if ($percentage < 70) {
                $skillGaps[] = [
                    'topic' => $topic,
                    'score' => $percentage,
                    'priority' => $percentage < 50 ? 'Tinggi' : 'Sedang',
                    'summary' => "Pemahaman pada {$topic} membutuhkan penguatan ({$percentage}% benar)."
                ];
            }
        }
        usort($skillGaps, fn($a, $b) => $a['score'] <=> $b['score']);
        return $skillGaps;
    }

    public function generateAssessmentSummary(string $userName, int $score, string $level, array $skillGaps): array
    {
        $gapNames = array_column($skillGaps, 'topic');
        $gapList = !empty($gapNames) ? implode(', ', array_slice($gapNames, 0, 3)) : 'materi lanjutan';

        $summary = match ($level) {
            'Advanced' => "Kemampuan PHP Anda berada pada level Advanced ({$score}/100). Kuasai penguatan minor pada {$gapList}.",
            'Intermediate' => "Kemampuan PHP Anda berada pada level Intermediate ({$score}/100). Perlu memperdalam materi {$gapList}.",
            default => "Kemampuan PHP Anda berada pada level Beginner ({$score}/100). Disarankan mempelajari kembali modul {$gapList}."
        };

        return [
            'summary' => $summary,
            'action_plan' => "Pelajari materi rekomendasi pada topik {$gapList} sebelum mengikuti Retest 50 Soal."
        ];
    }

    public function generateComparativeAnalysis(int $initialScore, int $retestScore, array $topicComparisons): string
    {
        $diff = $retestScore - $initialScore;
        $sign = $diff >= 0 ? "+{$diff}%" : "{$diff}%";
        return "Evaluasi komparatif mencatat perkembangan {$sign} dari assessment awal ({$initialScore}%) ke retest ({$retestScore}%).";
    }
}`
    },
    {
      category: 'Routes',
      name: 'web.php',
      path: 'routes/web.php',
      language: 'php',
      description: 'Definisi rute web Laravel untuk assessment awal, dashboard, rekomendasi, dan retest.',
      content: `<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\RetestController;

Route::get('/', function () { return view('welcome'); })->name('home');

// 1. Assessment Awal
Route::prefix('assessment')->name('assessment.')->group(function () {
    Route::get('/', [AssessmentController::class, 'index'])->name('index');
    Route::post('/submit', [AssessmentController::class, 'submit'])->name('submit');
    Route::get('/result/{id}', [AssessmentController::class, 'result'])->name('result');
});

// 2. Dashboard Adaptif (Hanya setelah assessment awal selesai)
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// 3. Rekomendasi
Route::prefix('recommendations')->name('recommendations.')->group(function () {
    Route::get('/', [RecommendationController::class, 'index'])->name('index');
    Route::get('/topic/{topic}', [RecommendationController::class, 'show'])->name('show');
    Route::post('/toggle-complete/{id}', [RecommendationController::class, 'toggleComplete'])->name('toggle');
});

// 4. Retest 50 Soal
Route::prefix('retest')->name('retest.')->group(function () {
    Route::get('/', [RetestController::class, 'index'])->name('index');
    Route::post('/submit', [RetestController::class, 'submit'])->name('submit');
    Route::get('/result/{id}', [RetestController::class, 'result'])->name('result');
});`
    }
  ];

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile = files[activeFileIndex];

  if (!isOpen) return null;

  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs">
              PHP
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Struktur File Laravel (Tinggal Salin & Tempel)</span>
                <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  Folder /laravel Siap Pakai
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Semua file sudah dibuat otomatis di direktori <code className="font-mono text-slate-700 bg-slate-200 px-1 rounded">/laravel/</code>. Anda dapat menyalin langsung kodenya di bawah ini.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sidebar File List + Code Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 overflow-y-auto p-3 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Daftar File Laravel Siap Copas
            </div>
            {files.map((file, idx) => {
              const isActive = idx === activeFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-start justify-between ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className={`text-[10px] font-semibold block uppercase tracking-wider ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {file.category}
                    </span>
                    <span className="font-mono font-bold truncate block mt-0.5">
                      {file.name}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}

            {/* Quick artisan command box */}
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] text-indigo-950">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Setelah Copas ke Laravel:</span>
              </span>
              <pre className="p-2 bg-indigo-950 text-indigo-200 rounded text-[10px] font-mono overflow-x-auto leading-relaxed mt-1">
                <code>php artisan migrate{"\n"}php artisan db:seed --class=QuestionSeeder</code>
              </pre>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-8 flex flex-col h-full bg-slate-950 overflow-hidden">
            {/* Code Bar Header */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-300 truncate">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">{activeFile.path}</span>
              </div>

              <button
                onClick={() => handleCopy(activeFile.content, activeFile.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  copiedPath === activeFile.path
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copiedPath === activeFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode File Ini</span>
                  </>
                )}
              </button>
            </div>

            {/* Description bar */}
            <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-400">
              {activeFile.description}
            </div>

            {/* Actual Code content */}
            <div className="flex-1 overflow-auto p-4 text-xs font-mono text-indigo-100 leading-relaxed">
              <pre>
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
