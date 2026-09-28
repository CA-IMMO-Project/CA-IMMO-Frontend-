<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('search_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('request_number')->unique();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email');

            $table->date('birth_date')->nullable();
            $table->string('profession')->nullable();
            $table->string('country')->default('Madagascar');
            $table->boolean('has_bank_account')->default(false);

            $table->string('zone')->nullable();
            $table->text('other_zones')->nullable();
            $table->boolean('flexible')->default(true);

            $table->string('budget')->nullable();
            $table->decimal('custom_budget', 15, 2)->nullable();

            $table->string('area')->nullable();
            $table->decimal('custom_area', 12, 2)->nullable();

            $table->string('relief')->nullable();
            $table->string('usage')->nullable();

            $table->string('payment')->nullable();
            $table->string('duration')->nullable();

            $table->decimal('contribution', 15, 2)->nullable();

            $table->text('info')->nullable();

            $table->enum('status', [
                'pending',
                'processing',
                'property_proposed',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_requests');
    }
};
