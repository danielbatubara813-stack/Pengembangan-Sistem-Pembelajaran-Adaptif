<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AiGateway
{
    public function isConfigured(): bool
    {
        return $this->provider() !== null;
    }

    public function provider(): ?string
    {
        if (config('services.openrouter.api_key')) return 'openrouter';
        if (config('services.gemini.api_key')) return 'gemini';
        return null;
    }

    public function diagnostic(): array
    {
        $provider = $this->provider();

        return [
            'configured' => $provider !== null,
            'provider' => $provider,
            'model' => $provider === 'openrouter'
                ? config('services.openrouter.model')
                : ($provider === 'gemini' ? config('services.gemini.model') : null),
            'status' => $provider === null ? 'not_configured' : 'configured_not_checked',
        ];
    }

    /** Search the public web and return grounded citations from Gemini. */
    public function googleSearch(string $input): array
    {
        $apiKey = config('services.gemini.api_key');
        if (! $apiKey) throw new RuntimeException('Gemini search is not configured.');

        $response = Http::withHeaders([
            'x-goog-api-key' => $apiKey,
            'Accept' => 'application/json',
        ])->timeout(30)->post('https://generativelanguage.googleapis.com/v1beta/interactions', [
            'model' => config('services.gemini.search_model', config('services.gemini.model')),
            'input' => $input,
            'tools' => [['type' => 'google_search']],
        ]);
        $response->throw();

        $queries = [];
        $sources = [];
        $answer = '';
        foreach ($response->json('steps', []) as $step) {
            if (($step['type'] ?? null) === 'google_search_call') {
                $arguments = $step['arguments'] ?? [];
                $queries = array_merge($queries, $arguments['queries'] ?? []);
                if (is_string($arguments['query'] ?? null)) $queries[] = $arguments['query'];
            }
            if (($step['type'] ?? null) === 'google_search_result') {
                foreach ($step['result'] ?? [] as $result) {
                    $url = trim((string) ($result['url'] ?? ''));
                    if ($url === '') continue;
                    $sources[$url] = [
                        'url' => $url,
                        'title' => trim((string) ($result['title'] ?? '')),
                        'provider' => 'gemini_google_search',
                    ];
                }
            }
            if (($step['type'] ?? null) !== 'model_output') continue;

            foreach ($step['content'] ?? [] as $content) {
                if (($content['type'] ?? null) !== 'text') continue;
                $answer .= (string) ($content['text'] ?? '');
                foreach ($content['annotations'] ?? [] as $annotation) {
                    if (($annotation['type'] ?? null) !== 'url_citation') continue;
                    $url = trim((string) ($annotation['url'] ?? ''));
                    if ($url === '') continue;
                    $sources[$url] = [
                        'url' => $url,
                        'title' => trim((string) ($annotation['title'] ?? '')),
                        'provider' => 'gemini_google_search',
                    ];
                }
            }
        }

        return [
            'answer' => trim($answer),
            'queries' => array_values(array_unique(array_filter($queries, 'is_string'))),
            'sources' => array_values($sources),
        ];
    }

    /** @return array{summary:string,action_plan:string,source:string,status:string,provider:?string,provider_configured:bool} */
    public function generateStructuredAssessment(string $prompt, int $maxTokens = 1200): array
    {
        $provider = $this->provider();
        if ($provider === null) {
            return ['source' => 'local_engine', 'status' => 'not_configured', 'provider' => null, 'provider_configured' => false];
        }

        try {
            $raw = $this->generateText($prompt, true, $maxTokens);
        } catch (\Throwable) {
            return ['source' => 'provider_failure_fallback', 'status' => 'provider_failed', 'provider' => $provider, 'provider_configured' => true];
        }

        $clean = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim((string) $raw));
        $decoded = json_decode($clean ?: '', true);
        if (! is_array($decoded)
            || ! is_string($decoded['summary'] ?? null)
            || trim($decoded['summary']) === ''
            || ! is_string($decoded['action_plan'] ?? null)
            || trim($decoded['action_plan']) === '') {
            return ['source' => 'invalid_response_fallback', 'status' => 'invalid_response', 'provider' => $provider, 'provider_configured' => true];
        }

        return [
            'summary' => trim(mb_substr($decoded['summary'], 0, 3000)),
            'action_plan' => trim(mb_substr($decoded['action_plan'], 0, 2000)),
            'source' => 'configured_ai',
            'status' => 'succeeded',
            'provider' => $provider,
            'provider_configured' => true,
        ];
    }

    /** @return array{summary:string,source:string,status:string,provider:?string,provider_configured:bool} */
    public function generateStructuredComparison(string $prompt, int $maxTokens = 800): array
    {
        $provider = $this->provider();
        if ($provider === null) {
            return ['source' => 'local_engine', 'status' => 'not_configured', 'provider' => null, 'provider_configured' => false];
        }

        try {
            $raw = $this->generateText($prompt, true, $maxTokens);
        } catch (\Throwable) {
            return ['source' => 'provider_failure_fallback', 'status' => 'provider_failed', 'provider' => $provider, 'provider_configured' => true];
        }

        $clean = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim((string) $raw));
        $decoded = json_decode($clean ?: '', true);
        if (! is_array($decoded) || ! is_string($decoded['analysis'] ?? null) || trim($decoded['analysis']) === '') {
            return ['source' => 'invalid_response_fallback', 'status' => 'invalid_response', 'provider' => $provider, 'provider_configured' => true];
        }

        return [
            'summary' => trim(mb_substr($decoded['analysis'], 0, 3000)),
            'source' => 'configured_ai',
            'status' => 'succeeded',
            'provider' => $provider,
            'provider_configured' => true,
        ];
    }

    public function searchLearningResources(string $name, string $topic, string $objective): array
    {
        $prompt = "Berikan maksimal 4 referensi sumber belajar online asli dan nyata (video YouTube dan website/dokumentasi) untuk mempelajari sub-kompetensi pemrograman PHP: {$name} (Topik: {$topic}). Tujuan pembelajaran: {$objective}.
Format JSON:
{
  \"sources\": [
    {
      \"url\": \"https://www.youtube.com/watch?v=...\",
      \"title\": \"Judul video atau panduan\",
      \"publisher\": \"Nama kreator atau situs\",
      \"type\": \"video\",
      \"description\": \"Ringkasan materi\"
    }
  ]
}
Hanya sertakan URL publik nyata.";

        try {
            $raw = $this->generateText($prompt, true, 800);
            if (! $raw) return [];
            $clean = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim((string) $raw));
            $decoded = json_decode($clean, true);
            if (! is_array($decoded) || ! is_array($decoded['sources'] ?? null)) return [];
            return collect($decoded['sources'])
                ->filter(fn ($s) => is_array($s) && ! empty($s['url']) && is_string($s['url']))
                ->map(fn ($s) => [
                    'url' => trim((string) $s['url']),
                    'title' => trim((string) ($s['title'] ?? '')),
                    'publisher' => trim((string) ($s['publisher'] ?? '')),
                    'type' => ($s['type'] ?? '') === 'video' ? 'video' : 'website',
                    'description' => trim((string) ($s['description'] ?? '')),
                    'provider' => 'ai_suggested_web',
                ])
                ->all();
        } catch (\Throwable $e) {
            Log::notice('AI learning resource generation unavailable.', ['error_class' => $e::class]);
            return [];
        }
    }

    public function generateText(string $prompt, bool $json = false, int $maxTokens = 1200): ?string
    {
        $openRouterKey = config('services.openrouter.api_key');
        $geminiKey = config('services.gemini.api_key');

        try {
            if ($openRouterKey) {
                $response = Http::withToken($openRouterKey)
                    ->acceptJson()
                    ->timeout(20)
                    ->post('https://openrouter.ai/api/v1/chat/completions', [
                        'model' => config('services.openrouter.model'),
                        'messages' => [['role' => 'user', 'content' => $prompt]],
                        'temperature' => 0.4,
                        'max_tokens' => $maxTokens,
                        ...($json ? ['response_format' => ['type' => 'json_object']] : []),
                    ]);

                $response->throw();
                $content = $response->json('choices.0.message.content');
                if (is_array($content)) {
                    $content = collect($content)->map(fn ($part) => is_array($part) ? ($part['text'] ?? '') : $part)->implode('');
                }

                return is_string($content) && trim($content) !== '' ? trim($content) : null;
            }

            if ($geminiKey) {
                $model = config('services.gemini.model');
                $response = Http::acceptJson()
                    ->timeout(20)
                    ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$geminiKey}", [
                        'contents' => [['parts' => [['text' => $prompt]]]],
                        ...($json ? ['generationConfig' => ['responseMimeType' => 'application/json']] : []),
                    ]);

                $response->throw();
                $content = $response->json('candidates.0.content.parts.0.text');

                return is_string($content) && trim($content) !== '' ? trim($content) : null;
            }
        } catch (\Throwable $error) {
            Log::warning('AI provider request failed.', [
                'provider' => $openRouterKey ? 'openrouter' : 'gemini',
                'error_class' => $error::class,
            ]);
            throw new RuntimeException('AI provider request failed.', previous: $error);
        }

        return null;
    }
}
