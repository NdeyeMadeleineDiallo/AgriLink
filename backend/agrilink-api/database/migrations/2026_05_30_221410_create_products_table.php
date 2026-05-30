<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('category_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();

            $table->text('description')->nullable();

            $table->integer('price')->nullable();

            $table->string('quantity')->nullable();
            $table->string('unit')->nullable();

            $table->string('region')->nullable();
            $table->string('city')->nullable();

            $table->string('phone')->nullable();
            $table->string('whatsapp_number')->nullable();

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'sold'
            ])->default('pending');

            $table->boolean('is_featured')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};