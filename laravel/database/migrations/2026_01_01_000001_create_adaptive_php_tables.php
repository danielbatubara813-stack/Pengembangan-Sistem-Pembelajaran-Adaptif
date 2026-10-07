<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for Sistem Pembelajaran Adaptif AI - PHP.
     */
    public function up(): void
    {
        // 1. Tabel Soal (Questions)
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('code_snippet')->nullable();
            $table->json('options'); // ['A' => '...', 'B' => '...', 'C' => '...', 'D' => '...']
            $table->enum('correct_answer', ['A', 'B', 'C', 'D']);
            $table->string('category'); // 12 Topik PHP
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->enum('exam_type', ['initial', 'retest'])->default('initial');
            $table->text('explanation')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Assessment Awal
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('score'); // 0 - 100
            $table->integer('total_questions')->default(50);
            $table->integer('correct_count');
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced']);
            $table->json('topic_scores')->nullable(); // detail per-topik
            $table->text('ai_summary')->nullable();
            $table->text('ai_action_plan')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Jawaban Assessment (Answers)
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
            $table->integer('score'); // Persentase akurasi topik
            $table->enum('priority', ['Tinggi', 'Sedang', 'Rendah'])->default('Sedang');
            $table->string('status')->default('active'); // active, resolved
            $table->text('summary')->nullable();
            $table->timestamps();
        });

        // 5. Tabel Retest
        Schema::create('retests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('initial_assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->integer('score'); // 0 - 100
            $table->integer('correct_count');
            $table->integer('total_questions')->default(50);
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced']);
            $table->integer('score_difference'); // selisih skor (+/-)
            $table->json('topic_scores')->nullable();
            $table->text('ai_comparative_analysis')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 6. Tabel Jawaban Retest
        Schema::create('retest_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retest_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->enum('selected_answer', ['A', 'B', 'C', 'D'])->nullable();
            $table->boolean('is_correct')->default(false);
            $table->string('category');
            $table->timestamps();
        });

        // 7. Tabel Rekomendasi Materi
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

        // 8. Tabel Progress Materi Pengguna
        Schema::create('user_recommendation_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('recommendation_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_recommendation_progress');
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('retest_answers');
        Schema::dropIfExists('retests');
        Schema::dropIfExists('skill_gaps');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('questions');
    }
};
