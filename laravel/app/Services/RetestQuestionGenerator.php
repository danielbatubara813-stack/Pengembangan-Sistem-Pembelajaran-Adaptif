<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Facades\Log;

class RetestQuestionGenerator
{
    private string $lastGenerationSource = 'not_configured';

    public function __construct(private readonly AiGateway $aiGateway)
    {
    }

    public function lastSource(): string
    {
        return $this->lastGenerationSource;
    }

    /** @return list<Question> */
    public function create(string|array $skillGaps, string $level = 'Intermediate', int $attempt = 1, array $excludedQuestionStems = []): array
    {
        if (! $this->aiGateway->isConfigured()) {
            $this->lastGenerationSource = 'missing_ai_key';
            return [];
        }

        $topics = is_array($skillGaps) ? $skillGaps : [$skillGaps];
        $prompt = "Buat 4 soal pilihan ganda studi kasus pemrograman PHP dalam Bahasa Indonesia. "
            .'Utamakan topik: '.json_encode(array_values($topics), JSON_UNESCAPED_UNICODE).". Level: {$level}. Percobaan: {$attempt}. "
            .'Jangan ulangi pertanyaan sebelumnya berikut: '.json_encode(array_slice($excludedQuestionStems, -80), JSON_UNESCAPED_UNICODE).'. '
            .'Kembalikan JSON array saja. Tiap item wajib memiliki question, codeSnippet (boleh null), options dengan A/B/C/D, '
            .'correct_answer, category, difficulty, dan explanation.';

        try {
            $raw = $this->aiGateway->generateText($prompt, true, 2200);
            $questions = $this->decode($raw ?? '');
            $created = [];

            foreach (array_slice($questions, 0, 4) as $item) {
                $validated = $this->validateItem($item, $topics, $level, $excludedQuestionStems);
                if ($validated === null) continue;

                $created[] = Question::create([
                    ...$validated,
                    'exam_type' => 'retest',
                    'source' => 'ai_generated',
                    'bank_key' => null,
                ]);
            }

            $this->lastGenerationSource = $created === [] ? 'invalid_response_fallback' : 'configured_ai';
            return $created;
        } catch (\Throwable $error) {
            Log::warning('AI retest question generation failed.', ['error_class' => $error::class]);
            $this->lastGenerationSource = 'provider_failure_fallback';
            return [];
        }
    }

    private function decode(string $raw): array
    {
        $clean = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($raw));
        $decoded = json_decode($clean ?: '', true);

        if (is_array($decoded) && array_is_list($decoded)) return $decoded;
        if (is_array($decoded) && isset($decoded['questions']) && is_array($decoded['questions'])) return $decoded['questions'];

        return [];
    }

    private function validateItem(mixed $item, array $topics, string $level, array $excludedQuestionStems = []): ?array
    {
        if (! is_array($item) || ! is_string($item['question'] ?? null)) return null;

        $rawOptions = $item['options'] ?? null;
        if (! is_array($rawOptions)) return null;
        $correctAnswer = strtoupper((string) ($item['correct_answer'] ?? ''));
        if (! in_array($correctAnswer, ['A', 'B', 'C', 'D'], true)) return null;

        if (array_is_list($rawOptions)) {
            $optionsList = collect($rawOptions)->mapWithKeys(fn ($option) => [
                strtoupper((string) ($option['key'] ?? '')) => (string) ($option['text'] ?? ''),
            ])->all();
        } else {
            $optionsList = [];
            foreach (['A', 'B', 'C', 'D'] as $key) {
                $value = is_array($rawOptions[$key] ?? null) ? ($rawOptions[$key]['text'] ?? null) : ($rawOptions[$key] ?? null);
                if (is_string($value) && trim($value) !== '') $optionsList[$key] = trim($value);
            }
        }

        if (count($optionsList) !== 4 || array_diff(['A', 'B', 'C', 'D'], array_keys($optionsList))) return null;

        $category = TopicCatalog::normalize((string) ($item['category'] ?? ($topics[0] ?? 'Dasar PHP')));
        $allowedTopics = array_map(static fn ($topic) => TopicCatalog::normalize((string) $topic), $topics);
        if ($allowedTopics !== [] && ! in_array($category, $allowedTopics, true)) return null;
        $questionText = mb_substr(trim($item['question']), 0, 2000);
        $normalizeStem = static fn (string $stem): string => mb_strtolower((string) preg_replace('/\s+/u', ' ', trim($stem)));
        if (in_array($normalizeStem($questionText), array_map($normalizeStem, $excludedQuestionStems), true)) return null;

        return [
            'question' => $questionText,
            'code_snippet' => isset($item['codeSnippet']) && is_string($item['codeSnippet']) ? mb_substr($item['codeSnippet'], 0, 10000) : null,
            'options' => $optionsList,
            'correct_answer' => $correctAnswer,
            'category' => $category,
            'difficulty' => in_array($item['difficulty'] ?? null, ['Beginner', 'Intermediate', 'Advanced'], true) ? $item['difficulty'] : $level,
            'explanation' => isset($item['explanation']) && is_string($item['explanation']) ? mb_substr($item['explanation'], 0, 2000) : null,
        ];
    }
}
