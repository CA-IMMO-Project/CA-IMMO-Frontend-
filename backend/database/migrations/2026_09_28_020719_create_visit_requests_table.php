<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('request_number')->unique();

            $table->date('visit_date');
            $table->time('visit_time');

            $table->string('full_name');
            $table->string('phone');

            $table->text('comment')->nullable();

            $table->enum('status', [
                'pending',
                'scheduled',
                'completed',
                'rescheduled',
                'cancelled'
            ])->default('pending');

            $table->foreignId('advisor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_requests');
    }
};
