<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('assessments') && ! Schema::hasColumn('assessments', 'ai_source')) {
            Schema::table('assessments', function (Blueprint $table): void {
                $table->string('ai_source', 40)->nullable()->after('ai_action_plan');
            });
        }
        if (Schema::hasTable('assessments') && ! Schema::hasColumn('assessments', 'ai_provider')) {
            Schema::table('assessments', function (Blueprint $table): void {
                $table->string('ai_provider', 20)->nullable()->after('ai_source');
            });
        }

        if (Schema::hasTable('retests') && ! Schema::hasColumn('retests', 'ai_source')) {
            Schema::table('retests', function (Blueprint $table): void {
                $table->string('ai_source', 40)->nullable()->after('ai_comparative_analysis');
            });
        }
        if (Schema::hasTable('retests') && ! Schema::hasColumn('retests', 'ai_provider')) {
            Schema::table('retests', function (Blueprint $table): void {
                $table->string('ai_provider', 20)->nullable()->after('ai_source');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('assessments', 'ai_source')) {
            Schema::table('assessments', fn (Blueprint $table) => $table->dropColumn('ai_source'));
        }
        if (Schema::hasColumn('assessments', 'ai_provider')) {
            Schema::table('assessments', fn (Blueprint $table) => $table->dropColumn('ai_provider'));
        }

        if (Schema::hasColumn('retests', 'ai_source')) {
            Schema::table('retests', fn (Blueprint $table) => $table->dropColumn('ai_source'));
        }
        if (Schema::hasColumn('retests', 'ai_provider')) {
            Schema::table('retests', fn (Blueprint $table) => $table->dropColumn('ai_provider'));
        }
    }
};
