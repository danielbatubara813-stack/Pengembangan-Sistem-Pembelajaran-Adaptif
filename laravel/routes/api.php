<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AssessmentApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\RecommendationApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/auth/profile', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/progress', [ProgressController::class, 'show']);
    Route::put('/progress', [ProgressController::class, 'update']);
    Route::put('/progress/materials', [ProgressController::class, 'setMaterial']);

    Route::get('/assessment/questions', [AssessmentApiController::class, 'initialQuestions']);
    Route::post('/assessment/submit-initial', [AssessmentApiController::class, 'submitInitial']);
    Route::post('/retest/questions', [AssessmentApiController::class, 'retestQuestions']);
    Route::post('/retest/submit', [AssessmentApiController::class, 'submitRetest']);

    Route::get('/recommendations', [RecommendationApiController::class, 'index']);
    Route::get('/ai/status', [AiController::class, 'status']);

    Route::post('/ai/analyze-assessment', [AiController::class, 'analyzeAssessment']);
    Route::post('/ai/compare-retest', [AiController::class, 'compareRetest']);
    Route::post('/ai/generate-retest-questions', [AiController::class, 'generateRetestQuestions']);
    Route::post('/ai/recommend-youtube', [AiController::class, 'recommendYoutube']);
    Route::post('/ai/companion-tip', [AiController::class, 'companionTip']);
});
