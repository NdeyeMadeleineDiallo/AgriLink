<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {

            $table->id();

            $table->foreignId('course_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');

            $table->longText('content')->nullable();

            $table->string('video_url')->nullable();

            $table->string('pdf_file')->nullable();

            $table->integer('order')->default(1);

            $table->integer('duration')->nullable();

            $table->boolean('is_free')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};