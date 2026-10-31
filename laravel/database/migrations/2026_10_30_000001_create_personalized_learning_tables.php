<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('learning_competencies')) {
            Schema::create('learning_competencies', function (Blueprint $table): void {
                $table->id();
                $table->string('competency_key', 160)->unique();
                $table->string('topic', 120)->index();
                $table->string('name', 180);
                $table->text('description')->nullable();
                $table->text('learning_objective')->nullable();
                $table->mediumText('example_code')->nullable();
                $table->text('practice_prompt')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('assessment_competency_results')) {
            Schema::create('assessment_competency_results', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('assessment_id')->nullable()->constrained()->cascadeOnDelete();
                $table->foreignId('retest_id')->nullable()->constrained()->cascadeOnDelete();
                $table->foreignId('competency_id')->constrained('learning_competencies')->cascadeOnDelete();
                $table->unsignedTinyInteger('score');
                $table->unsignedTinyInteger('correct_count');
                $table->unsignedTinyInteger('total_questions');
                $table->unsignedTinyInteger('target_score')->default(80);
                $table->string('status', 24)->default('needs_review')->index();
                $table->json('difficulty_scores')->nullable();
                $table->json('evidence')->nullable();
                $table->text('diagnosis')->nullable();
                $table->timestamp('evaluated_at')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'competency_id', 'evaluated_at'], 'assessment_competency_history_idx');
            });
        }

        if (Schema::hasTable('recommendations')) {
            Schema::table('recommendations', function (Blueprint $table): void {
                if (Schema::hasColumn('recommendations', 'url')) $table->string('url', 2048)->change();
                if (! Schema::hasColumn('recommendations', 'competency_id')) $table->foreignId('competency_id')->nullable()->constrained('learning_competencies')->nullOnDelete();
                if (! Schema::hasColumn('recommendations', 'source_domain')) $table->string('source_domain', 255)->nullable()->index();
                if (! Schema::hasColumn('recommendations', 'search_provider')) $table->string('search_provider', 40)->nullable();
                if (! Schema::hasColumn('recommendations', 'search_query')) $table->text('search_query')->nullable();
                if (! Schema::hasColumn('recommendations', 'url_hash')) $table->string('url_hash', 64)->nullable()->index();
                if (! Schema::hasColumn('recommendations', 'validation_status')) $table->string('validation_status', 24)->default('pending')->index();
                if (! Schema::hasColumn('recommendations', 'content_status')) $table->string('content_status', 24)->default('pending');
                if (! Schema::hasColumn('recommendations', 'embedding_status')) $table->string('embedding_status', 24)->default('not_applicable');
                if (! Schema::hasColumn('recommendations', 'match_score')) $table->unsignedTinyInteger('match_score')->default(0);
                if (! Schema::hasColumn('recommendations', 'match_reason')) $table->text('match_reason')->nullable();
                if (! Schema::hasColumn('recommendations', 'resource_metadata')) $table->json('resource_metadata')->nullable();
                if (! Schema::hasColumn('recommendations', 'validated_at')) $table->timestamp('validated_at')->nullable();
                if (! Schema::hasColumn('recommendations', 'last_checked_at')) $table->timestamp('last_checked_at')->nullable();
            });
        }

        if (! Schema::hasTable('user_learning_recommendations')) {
            Schema::create('user_learning_recommendations', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('recommendation_id')->constrained()->cascadeOnDelete();
                $table->foreignId('assessment_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('retest_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('competency_result_id')->nullable()->constrained('assessment_competency_results')->nullOnDelete();
                $table->string('status', 24)->default('active')->index();
                $table->timestamp('recommended_at')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'assessment_id', 'retest_id'], 'user_learning_recommendation_attempt_idx');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_learning_recommendations');
        Schema::dropIfExists('assessment_competency_results');

        if (Schema::hasTable('recommendations')) {
            Schema::table('recommendations', function (Blueprint $table): void {
                foreach ([
                    'competency_id', 'source_domain', 'search_provider', 'search_query', 'url_hash',
                    'validation_status', 'content_status', 'embedding_status', 'match_score',
                    'match_reason', 'resource_metadata', 'validated_at', 'last_checked_at',
                ] as $column) {
                    if (Schema::hasColumn('recommendations', $column)) $table->dropColumn($column);
                }
            });
        }

        Schema::dropIfExists('learning_competencies');
    }
};
