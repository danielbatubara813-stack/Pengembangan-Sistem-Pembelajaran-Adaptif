<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AdaptiveAiService
{
    /**
     * Hitung level kemampuan berdasarkan skor.
     * Score < 60  -> Beginner
     * 60 <= Score < 80 -> Intermediate
     * Score >= 80 -> Advanced
     */
    public function determineLevel(int $score): string
    {
        if ($score >= 80) {
            return 'Advanced';
        } elseif ($score >= 60) {
            return 'Intermediate';
        }
        return 'Beginner';
    }

    /**
     * Analisis diagnostik topik dan identifikasi skill gap.
     */
    public function analyzeTopicPerformance(array $topicScores): array
    {
        $skillGaps = [];

        foreach ($topicScores as $topic => $data) {
            $percentage = $data['total'] > 0 ? round(($data['correct'] / $data['total']) * 100) : 0;

            if ($percentage < 70) {
                $priority = $percentage < 50 ? 'Tinggi' : 'Sedang';
                $skillGaps[] = [
                    'topic' => $topic,
                    'score' => $percentage,
                    'priority' => $priority,
                    'summary' => "Pemahaman pada materi {$topic} membutuhkan penguatan ({$percentage}% benar).",
                ];
            }
        }

        // Urutkan skill gap dari skor terendah
        usort($skillGaps, fn($a, $b) => $a['score'] <=> $b['score']);

        return $skillGaps;
    }

    /**
     * Generate narasi analisis menggunakan Gemini API atau fallback engine lokal.
     */
    public function generateAssessmentSummary(string $userName, int $score, string $level, array $skillGaps): array
    {
        $apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY'));

        if ($apiKey) {
            try {
                $prompt = "Anda adalah AI evaluator sistem pembelajaran adaptif PHP. " .
                          "Pengguna: {$userName}, Skor: {$score}/100, Level: {$level}. " .
                          "Skill gap terdeteksi: " . json_encode($skillGaps) . ". " .
                          "Berikan evaluasi kemampuan ringkas (2-3 kalimat) dan saran tindakan pembelajaran adaptif.";

                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

                if ($response->successful()) {
                    $aiText = $response->json('candidates.0.content.parts.0.text');
                    return [
                        'summary' => $aiText,
                        'action_plan' => "Fokuskan waktu belajar pada materi skill gap prioritas sebelum melakukan retest."
                    ];
                }
            } catch (\Exception $e) {
                Log::warning('Gemini API request failed: ' . $e->getMessage());
            }
        }

        // Fallback cerdas lokal
        $gapNames = array_column($skillGaps, 'topic');
        $gapList = !empty($gapNames) ? implode(', ', array_slice($gapNames, 0, 3)) : 'konsep lanjutan';

        $summary = match ($level) {
            'Advanced' => "Kemampuan PHP Anda berada pada level Advanced ({$score}/100). Anda menguasai sintaksis, logika alur, dan arsitektur PHP dengan sangat solid. Penguatan minor disarankan pada {$gapList}.",
            'Intermediate' => "Kemampuan PHP Anda berada pada level Intermediate ({$score}/100). Anda sudah memahami konsep dasar dan struktur kontrol, namun perlu memperdalam pemahaman pada topik {$gapList}.",
            default => "Kemampuan PHP Anda berada pada level Beginner ({$score}/100). Fondasi dasar pemrograman PHP Anda sedang terbentuk. Sangat disarankan mempelajari kembali materi {$gapList} melalui modul terkurasi."
        };

        return [
            'summary' => $summary,
            'action_plan' => "Pelajari materi rekomendasi pada topik {$gapList}, tonton video pembelajaran terintegrasi, lalu validasi peningkatan melalui Retest 50 Soal."
        ];
    }

    /**
     * Analisis komparatif antara assessment awal dan retest.
     */
    public function generateComparativeAnalysis(int $initialScore, int $retestScore, array $topicComparisons): string
    {
        $diff = $retestScore - $initialScore;
        $sign = $diff >= 0 ? "+{$diff}%" : "{$diff}%";

        if ($diff > 0) {
            return "Evaluasi komparatif mencatat peningkatan sebesar {$sign} dari assessment awal ({$initialScore}%) ke retest ({$retestScore}%). Hasil ini membuktikan efektivitas pemahaman konsep yang telah dipelajari dari materi rekomendasi.";
        } elseif ($diff === 0) {
            return "Skor retest Anda konsisten stabil di angka {$retestScore}%. Penguasaan dasar telah kokoh, namun dianjurkan memperbanyak latihan studi kasus pada topik-topik berbobot tinggi.";
        }

        return "Skor retest Anda tercatat {$retestScore}% ({$sign} dibandingkan tes awal). Variasi tingkat kesulitan pada soal retest menguji pemahaman lebih dalam. Pelajari kembali materi modul yang belum tuntas.";
    }
}
