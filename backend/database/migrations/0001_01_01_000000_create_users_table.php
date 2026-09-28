<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('first_name');
            $table->string('last_name');

            $table->string('email')->unique();
            $table->string('phone')->nullable();

            $table->date('birth_date')->nullable();
            $table->string('profession')->nullable();
            $table->string('country')->default('Madagascar');

            $table->boolean('has_bank_account')->default(false);

            $table->string('password');

            $table->enum('role', [
                'user',
                'admin'
            ])->default('user');

            $table->enum('status', [
                'active',
                'inactive',
                'blocked'
            ])->default('active');

            $table->boolean('identity_verified')->default(false);

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
