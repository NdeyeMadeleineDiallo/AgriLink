<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {

            $table->id();

            $table->string('title');
            $table->string('slug')->unique();

            $table->text('description')->nullable();

            $table->string('level')->nullable();

            $table->integer('duration')->nullable();

            $table->integer('price')->default(0);

            $table->string('thumbnail')->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'archived'
            ])->default('draft');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};