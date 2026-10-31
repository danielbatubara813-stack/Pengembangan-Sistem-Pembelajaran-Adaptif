<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('retests', function (Blueprint $table): void {
            $table->integer('total_questions')->default(30)->change();
        });
    }

    public function down(): void
    {   
        Schema::table('retests', function (Blueprint $table): void {                                                                                                                                                                                                                                                                                            
            $table->integer('total_questions')->default(50)->change();
        });
    }
};
