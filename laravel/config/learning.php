<?php

return [
    'search_cache_store' => env('LEARNING_SEARCH_CACHE_STORE', 'file'),
    'search_cache_hours' => (int) env('LEARNING_SEARCH_CACHE_HOURS', 24),
    'search_validation_hours' => (int) env('LEARNING_SEARCH_VALIDATION_HOURS', 24),
    'search_max_candidates' => (int) env('LEARNING_SEARCH_MAX_CANDIDATES', 12),
    'search_max_resources_per_competency' => (int) env('LEARNING_SEARCH_MAX_RESOURCES_PER_COMPETENCY', 4),
    'search_min_match_score' => (int) env('LEARNING_SEARCH_MIN_MATCH_SCORE', 35),
    'search_http_timeout' => (int) env('LEARNING_SEARCH_HTTP_TIMEOUT', 8),
];
