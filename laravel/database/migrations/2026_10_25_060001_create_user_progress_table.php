<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('user_progress')) {
            Schema::create('user_progress', function (Blueprint $table): void {
                $table->foreignId('user_id')->primary()->constrained()->cascadeOnDelete();
                $table->json('payload');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('user_progress')) {
            Schema::drop('user_progress');
        }
    }
};
