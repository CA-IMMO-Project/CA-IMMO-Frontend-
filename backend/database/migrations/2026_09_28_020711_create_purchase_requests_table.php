<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('request_number')->unique();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email');

            $table->date('birth_date')->nullable();
            $table->string('profession')->nullable();
            $table->string('country')->default('Madagascar');
            $table->boolean('has_bank_account')->default(false);

            $table->string('payment_method');
            $table->string('duration')->nullable();

            $table->decimal('initial_payment', 15, 2)->nullable();

            $table->text('message')->nullable();

            $table->enum('status', [
                'pending',
                'processing',
                'property_proposed',
                'visit',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
