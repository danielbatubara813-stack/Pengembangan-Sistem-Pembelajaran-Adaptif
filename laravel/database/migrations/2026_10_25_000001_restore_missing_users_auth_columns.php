<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const AUTH_COLUMNS = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'remember_token',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            throw new RuntimeException('The users table must exist before restoring its authentication columns.');
        }

        foreach (['id', 'created_at', 'updated_at'] as $column) {
            if (! Schema::hasColumn('users', $column)) {
                throw new RuntimeException("The users table is missing its expected {$column} column.");
            }
        }

        foreach (self::AUTH_COLUMNS as $column) {
            if (Schema::hasColumn('users', $column)) {
                throw new RuntimeException("The users.{$column} column already exists; inspect the schema before applying this migration.");
            }
        }

        if (DB::table('users')->count() > 0) {
            throw new RuntimeException('The users table is not empty. Add and backfill authentication columns using a reviewed data migration.');
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('users')) {
            throw new RuntimeException('Cannot roll back users authentication columns because the users table does not exist.');
        }

        foreach (self::AUTH_COLUMNS as $column) {
            if (! Schema::hasColumn('users', $column)) {
                throw new RuntimeException("Cannot roll back users authentication columns because users.{$column} does not exist.");
            }
        }

        $schema = DB::connection()->getSchemaBuilder();
        if (! $schema->hasIndex('users', 'users_email_unique', 'unique')) {
            throw new RuntimeException('Cannot roll back users authentication columns because unique index users_email_unique does not exist.');
        }

        if (DB::table('users')->count() > 0) {
            throw new RuntimeException('Cannot roll back users authentication columns while user records exist.');
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique('users_email_unique');
            $table->dropColumn([
                'name',
                'email',
                'email_verified_at',
                'password',
                'remember_token',
            ]);
        });
    }
};
