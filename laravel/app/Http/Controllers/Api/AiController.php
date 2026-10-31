<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiGateway;
use App\Services\AdaptiveRecommendationService;
use App\Services\CompetencyAssessmentService;
use App\Services\ProgressSnapshotService;
use App\Services\RetestQuestionGenerator;
use App\Services\TopicCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function __construct(
        private readonly AiGateway $aiGateway,
        private readonly RetestQuestionGenerator $retestQuestionGenerator,
        private readonly AdaptiveRecommendationService $recommendations,
        private readonly CompetencyAssessmentService $competencyAssessments,
        private readonly ProgressSnapshotService $progressSnapshots,
    ) {
    }

    public function status(): JsonResponse
    {
        return response()->json($this->aiGateway->diagnostic());
    }

    public function analyzeAssessment(Request $request): JsonResponse
    {
        $data = $request->validate([
            'score' => ['required', 'integer', 'between:0,100'],
            'level' => ['required', 'in:Beginner,Intermediate,Advanced'],
            'topicScores' => ['nullable', 'array'],
            'skillGaps' => ['nullable', 'array', 'max:12'],
            'type' => ['nullable', 'in:initial,retest'],
            'userName' => ['nullable', 'string', 'max:120'],
        ]);
        $gaps = $data['skillGaps'] ?? [];
        $gapTopics = collect($gaps)->map(fn ($gap) => is_array($gap) ? ($gap['topic'] ?? '') : (string) $gap)->filter()->implode(', ');
        $fallback = "Kemampuan PHP Anda (".($data['userName'] ?? 'Pengguna').") berada pada level {$data['level']} dengan skor {$data['score']}/100. Analisis diagnostik menunjukkan perlunya penguatan pada topik: ".($gapTopics ?: 'topik PHP yang telah terukur').'.';
        $prompt = "Anda adalah sistem AI pakar evaluasi pembelajaran adaptif PHP. Tulis analisis singkat dalam Bahasa Indonesia untuk mahasiswa. "
            .'Nilai: '.$data['score'].'/100. Level: '.$data['level'].'. Hasil topik: '.json_encode($data['topicScores'] ?? [], JSON_UNESCAPED_UNICODE)
            .'. Skill gap: '.json_encode($gaps, JSON_UNESCAPED_UNICODE).'. Jelaskan penyebab gap dan rencana aksi tanpa mengubah skor atau jawaban. '
            .'Kembalikan JSON valid dengan properti summary dan action_plan.';
        $ai = $this->aiGateway->generateStructuredAssessment($prompt);
        if (($ai['source'] ?? null) === 'configured_ai') {
            return response()->json([
                'success' => true,
                'source' => $ai['source'],
                'status' => $ai['status'],
                'provider' => $ai['provider'],
                'providerConfigured' => true,
                'analysis' => $ai['summary'],
                'summary' => $ai['summary'],
                'actionPlan' => $ai['action_plan'],
            ]);
        }

        return response()->json([
            'success' => true,
            'source' => $ai['source'],
            'status' => $ai['status'],
            'provider' => $ai['provider'],
            'providerConfigured' => $ai['provider_configured'],
            'summary' => $fallback,
            'actionPlan' => 'Fokuskan pembelajaran adaptif pada topik yang nilainya di bawah standar, lalu lakukan retest.',
        ]);
    }

    public function compareRetest(Request $request): JsonResponse
    {
        $data = $request->validate([
            'initialScore' => ['required', 'integer', 'between:0,100'],
            'retestScore' => ['required', 'integer', 'between:0,100'],
            'initialLevel' => ['required', 'in:Beginner,Intermediate,Advanced'],
            'retestLevel' => ['required', 'in:Beginner,Intermediate,Advanced'],
            'topicComparisons' => ['nullable', 'array'],
            'resolvedGaps' => ['nullable', 'array'],
        ]);
        $difference = $data['retestScore'] - $data['initialScore'];
        $fallback = "Evaluasi komparatif mencatat perkembangan ".($difference >= 0 ? "+{$difference}" : (string) $difference)
            ."% dari assessment awal ({$data['initialScore']}%, Level {$data['initialLevel']}) ke retest ({$data['retestScore']}%, Level {$data['retestLevel']}). Topik yang meningkat menunjukkan efektivitas materi rekomendasi yang telah dipelajari.";
        $prompt = 'Kembalikan JSON valid dengan properti analysis string. Tuliskan satu paragraf komparatif yang objektif '
            .'dalam Bahasa Indonesia berdasarkan data berikut, tanpa mengubah skor: '.json_encode($data, JSON_UNESCAPED_UNICODE).'.';
        $ai = $this->aiGateway->generateStructuredComparison($prompt);
        if (($ai['source'] ?? null) === 'configured_ai') {
            return response()->json([
                'success' => true,
                'source' => $ai['source'],
                'status' => $ai['status'],
                'provider' => $ai['provider'],
                'providerConfigured' => true,
                'comparativeAnalysis' => $ai['summary'],
            ]);
        }

        return response()->json([
            'success' => true,
            'source' => $ai['source'],
            'status' => $ai['status'],
            'provider' => $ai['provider'],
            'providerConfigured' => $ai['provider_configured'],
            'comparativeAnalysis' => $fallback,
        ]);
    }

    public function generateRetestQuestions(Request $request): JsonResponse
    {
        $data = $request->validate([
            'skillGaps' => ['nullable', 'array', 'max:12'],
            'skillGaps.*' => ['string', 'max:120'],
            'level' => ['nullable', 'in:Beginner,Intermediate,Advanced'],
            'attempt' => ['nullable', 'integer', 'min:1', 'max:10000'],
        ]);

        if (! $this->aiGateway->isConfigured()) {
            return response()->json([
                'success' => false,
                'source' => 'missing_ai_key',
                'attempt' => $data['attempt'] ?? 1,
                'customAiQuestions' => [],
                'message' => 'API key AI belum diatur. Isi GEMINI_API_KEY atau OPENROUTER_API_KEY pada laravel/.env.',
            ]);
        }

        $generated = $this->retestQuestionGenerator->create(
            $data['skillGaps'] ?? [],
            $data['level'] ?? 'Intermediate',
            $data['attempt'] ?? 1,
        );
        $questions = collect($generated);
        $source = $this->retestQuestionGenerator->lastSource();

        return response()->json([
            'success' => count($questions) > 0,
            'source' => $source,
            'status' => $source === 'configured_ai' ? 'succeeded' : $source,
            'attempt' => $data['attempt'] ?? 1,
            'customAiQuestions' => $questions->map(fn ($question) => [
                'id' => $question->id,
                'question' => $question->question,
                'codeSnippet' => $question->code_snippet,
                'options' => collect($question->options)->map(fn ($text, $key) => ['key' => $key, 'text' => $text])->values(),
                'category' => TopicCatalog::normalize($question->category),
                'difficulty' => $question->difficulty,
                'explanation' => $question->explanation,
            ])->values(),
            'message' => count($questions) > 0
                ? 'Soal tambahan dari AI lolos validasi.'
                : 'Respons AI tidak menghasilkan soal valid; gunakan paket soal dari bank PHP.',
        ]);
    }

    public function recommendYoutube(Request $request): JsonResponse
    {
        $initial = $request->user()->assessments()->orderBy('completed_at')->orderBy('id')->first();
        $latestRetest = $initial
            ? $request->user()->retests()->where('initial_assessment_id', $initial->id)->latest('completed_at')->latest('id')->first()
            : null;
        $gaps = $initial ? $this->competencyAssessments->currentSkillGaps($initial, $latestRetest) : [];
        $storedProgress = $request->user()->progress()->first()?->payload ?? [];
        $built = $this->recommendations->build(
            $gaps,
            is_array($storedProgress['completedMaterials'] ?? null) ? $storedProgress['completedMaterials'] : [],
            $request->user(),
            $initial,
            $latestRetest,
        );
        $recommendations = collect($built['recommendations'])
            ->where('type', 'video')->values();

        return response()->json([
            'success' => true,
            'source' => $built['source'],
            'recommendations' => $recommendations,
            'emptyMessage' => $built['emptyMessage'],
        ]);
    }

    public function companionTip(Request $request): JsonResponse
    {
        $data = $request->validate([
            'currentRoute' => ['nullable', 'string', 'max:60'],
            'score' => ['nullable', 'integer', 'between:0,100'],
            'level' => ['nullable', 'string', 'max:30'],
            'skillGaps' => ['nullable', 'array', 'max:12'],
        ]);

        $tips = [
            'landing' => 'Selamat datang! Sistem adaptif ini akan memetakan kemampuan PHP melalui assessment dari bank soal.',
            'assessment' => 'Jawablah setiap soal dengan teliti. Soal mencakup konsep dasar hingga database dan error handling.',
            'assessment_result' => 'Hasil assessment Anda adalah '.($data['score'] ?? 0).'% ('.($data['level'] ?? 'Evaluasi').'). Sistem telah menyiapkan rekomendasi sesuai kebutuhan belajar.',
            'dashboard' => 'Dashboard ini memuat peta kompetensi Anda. Gunakan rekomendasi untuk memperkuat topik prioritas sebelum retest.',
            'recommendations' => 'Sumber belajar dipilih berdasarkan topik yang perlu Anda perkuat.',
            'learning_detail' => 'Pelajari konsep utama, cermati contoh kode, dan perhatikan kesalahan umum pada PHP.',
            'retest' => 'Retest mengukur pemahaman Anda setelah mempelajari materi yang direkomendasikan.',
            'retest_result' => 'Retest selesai. Cermati perbandingan hasil untuk melihat perkembangan kemampuan Anda.',
            'progress' => 'Grafik ini menampilkan perkembangan hasil assessment dan retest Anda.',
            'history' => 'Riwayat assessment dan retest disimpan pada akun Anda.',
            'profile' => 'Profil Anda aktif. Tinjau capaian dan progress pembelajaran di akun ini.',
        ];

        return response()->json([
            'success' => true,
            'tip' => $tips[$data['currentRoute'] ?? ''] ?? 'Terus tingkatkan pemahaman sintaksis dan arsitektur PHP Anda langkah demi langkah!',
        ]);
    }

}
