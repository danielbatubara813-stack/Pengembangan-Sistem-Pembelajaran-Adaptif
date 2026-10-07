<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\RetestController;

/*
|--------------------------------------------------------------------------
| Web Routes - Sistem Pembelajaran Adaptif AI PHP
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');

// 1. Assessment Awal 50 Soal
Route::prefix('assessment')->name('assessment.')->group(function () {
    Route::get('/', [AssessmentController::class, 'index'])->name('index');
    Route::post('/submit', [AssessmentController::class, 'submit'])->name('submit');
    Route::get('/result/{id}', [AssessmentController::class, 'result'])->name('result');
});

// 2. Dashboard Adaptif (Hanya setelah assessment awal selesai)
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// 3. Rekomendasi & Detail Pembelajaran
Route::prefix('recommendations')->name('recommendations.')->group(function () {
    Route::get('/', [RecommendationController::class, 'index'])->name('index');
    Route::get('/topic/{topic}', [RecommendationController::class, 'show'])->name('show');
    Route::post('/toggle-complete/{id}', [RecommendationController::class, 'toggleComplete'])->name('toggle');
});

// 4. Retest 50 Soal PHP
Route::prefix('retest')->name('retest.')->group(function () {
    Route::get('/', [RetestController::class, 'index'])->name('index');
    Route::post('/submit', [RetestController::class, 'submit'])->name('submit');
    Route::get('/result/{id}', [RetestController::class, 'result'])->name('result');
});
