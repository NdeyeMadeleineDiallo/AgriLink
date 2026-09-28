<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_ratings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('expert_profile_id')
                ->constrained('expert_profiles')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('rating');

            $table->timestamps();

            /*
             * Un utilisateur ne peut avoir qu’une seule note
             * pour un même expert.
             */
            $table->unique([
                'expert_profile_id',
                'user_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_ratings');
    }
};