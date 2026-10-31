<?php

namespace App\Services;

class AdaptiveAiService
{
    public function __construct(private readonly AiGateway $aiGateway)
    {
    }

    /**
     * Tentukan level berdasarkan skor keseluruhan dan batas minimum setiap topik terukur.
     */
    public function determineLevel(int $score, array $topicScores = []): string
    {
        $measuredScores = [];
        foreach ($topicScores as $topic) {
            if (($topic['total'] ?? 0) > 0) {
                $measuredScores[] = (int) round(($topic['correct'] / $topic['total']) * 100);
            }
        }

        $meetsIntermediateTopicTarget = count($measuredScores) > 0 &&
            !in_array(false, array_map(static fn ($topicScore) => $topicScore >= 60, $measuredScores), true);
        $meetsAdvancedTopicTarget = count($measuredScores) > 0 &&
            !in_array(false, array_map(static fn ($topicScore) => $topicScore >= 80, $measuredScores), true);

        if ($score < 70 || !$meetsIntermediateTopicTarget) {
            return 'Beginner';
        }

        if ($score >= 85 && $meetsAdvancedTopicTarget) {
            return 'Advanced';
        }
        return 'Intermediate';
    }

    /**
     * Analisis diagnostik topik dan identifikasi skill gap.
     */
    public function analyzeTopicPerformance(array $topicScores, string $level = 'Beginner'): array
    {
        $skillGaps = [];
        $target = $level === 'Beginner' ? 60 : 80;

        foreach ($topicScores as $topic => $data) {
            $percentage = $data['total'] > 0 ? round(($data['correct'] / $data['total']) * 100) : 0;

            if ($percentage < $target) {
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
    public function generateAssessmentSummary(string $userName, int $score, string $level, array $skillGaps, array $topicScores = []): array
    {
        $gapNames = array_column($skillGaps, 'topic');
        $gapList = $gapNames !== [] ? implode(', ', array_slice($gapNames, 0, 3)) : 'konsep lanjutan';
        $prompt = 'Kembalikan objek JSON valid dengan properti string summary dan action_plan. '
            .'Tuliskan dalam Bahasa Indonesia, hubungkan analisis dengan skor total, level, seluruh skor per topik, dan skill gap berikut. '
            .'Jangan mengubah nilai, jawaban, atau kunci assessment. Data: '
            .json_encode(['name' => $userName, 'score' => $score, 'level' => $level, 'topicScores' => $topicScores, 'skillGaps' => $skillGaps], JSON_UNESCAPED_UNICODE).'.';
        $ai = $this->aiGateway->generateStructuredAssessment($prompt);
        if (($ai['source'] ?? null) === 'configured_ai') return $ai;

        $gapNames = array_column($skillGaps, 'topic');
        $gapList = !empty($gapNames) ? implode(', ', array_slice($gapNames, 0, 3)) : 'konsep lanjutan';

        $summary = match ($level) {
            'Advanced' => "Kemampuan PHP Anda berada pada level Advanced ({$score}/100). Anda menguasai sintaksis, logika alur, dan arsitektur PHP dengan sangat solid. Penguatan minor disarankan pada {$gapList}.",
            'Intermediate' => "Kemampuan PHP Anda berada pada level Intermediate ({$score}/100). Anda sudah memahami konsep dasar dan struktur kontrol, namun perlu memperdalam pemahaman pada topik {$gapList}.",
            default => "Kemampuan PHP Anda berada pada level Beginner ({$score}/100). Fondasi dasar pemrograman PHP Anda sedang terbentuk. Sangat disarankan mempelajari kembali materi {$gapList} melalui modul terkurasi."
        };

        return [
            'summary' => $summary,
            'action_plan' => "Pelajari materi rekomendasi pada topik {$gapList}, lalu validasi peningkatan melalui retest maksimal 30 soal.",
            'source' => $ai['source'] ?? 'local_engine',
            'status' => $ai['status'] ?? 'not_configured',
            'provider' => $ai['provider'] ?? null,
            'provider_configured' => $ai['provider_configured'] ?? false,
        ];
    }

    /**
     * Analisis komparatif antara assessment awal dan retest.
     */
    public function generateComparativeAnalysis(int $initialScore, int $retestScore, array $topicComparisons): string
    {
        return $this->generateComparativeAnalysisWithMetadata($initialScore, $retestScore, $topicComparisons)['summary'];
    }

    public function generateComparativeAnalysisWithMetadata(int $initialScore, int $retestScore, array $topicComparisons, array $progressContext = []): array
    {
        $diff = $retestScore - $initialScore;
        $sign = $diff >= 0 ? "+{$diff}%" : "{$diff}%";
        $prompt = 'Kembalikan objek JSON valid dengan satu properti string analysis. '
            .'Tulis satu paragraf dalam Bahasa Indonesia berdasarkan perubahan skor dan skor tiap topik. '
            .'Jangan mengubah nilai assessment. Data: '
            .json_encode(['initialScore' => $initialScore, 'retestScore' => $retestScore, 'difference' => $diff, 'topicComparisons' => $topicComparisons, 'progressContext' => $progressContext], JSON_UNESCAPED_UNICODE).'.';
        $ai = $this->aiGateway->generateStructuredComparison($prompt);
        if (($ai['source'] ?? null) === 'configured_ai') return $ai;

        if ($diff > 0) {
            $summary = "Evaluasi komparatif mencatat peningkatan sebesar {$sign} dari assessment awal ({$initialScore}%) ke retest ({$retestScore}%). Periksa skor tiap topik untuk melihat materi yang paling berdampak.";
        } elseif ($diff === 0) {
            $summary = "Skor retest Anda konsisten stabil di angka {$retestScore}%. Perbanyak latihan pada topik yang masih berada di bawah target.";
        } else {
            $summary = "Skor retest Anda tercatat {$retestScore}% ({$sign} dibandingkan tes awal). Tinjau kembali topik dengan skor terendah sebelum retest berikutnya.";
        }

        return [
            'summary' => $summary,
            'source' => $ai['source'] ?? 'local_engine',
            'status' => $ai['status'] ?? 'not_configured',
            'provider' => $ai['provider'] ?? null,
            'provider_configured' => $ai['provider_configured'] ?? false,
        ];
    }
}
