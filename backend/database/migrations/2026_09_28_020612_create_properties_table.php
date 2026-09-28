<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            $table->foreignId('owner_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('reference')->unique();

            $table->string('title');
            $table->text('description')->nullable();

            $table->decimal('area', 12, 2);
            $table->decimal('price', 15, 2);
            $table->decimal('price_per_sqm', 15, 2)->nullable();

            $table->string('relief')->nullable();
            $table->string('access')->nullable();

            $table->string('water')->nullable();
            $table->string('electricity')->nullable();

            $table->string('region')->nullable();
            $table->string('district')->nullable();
            $table->string('commune')->nullable();
            $table->string('fokontany')->nullable();

            $table->text('address')->nullable();

            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->string('payment')->nullable();
            $table->string('duration')->nullable();

            $table->string('deposit')->nullable();
            $table->decimal('custom_deposit', 5, 2)->nullable();

            $table->boolean('verified')->default(false);
            $table->boolean('available')->default(true);

            $table->enum('status', [
                'draft',
                'pending_verification',
                'published',
                'reserved',
                'sold',
                'rejected',
                'disabled'
            ])->default('draft');

            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('published_at')->nullable();

            $table->timestamps();

            $table->index('region');
            $table->index('district');
            $table->index('commune');
            $table->index('price');
            $table->index('area');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
