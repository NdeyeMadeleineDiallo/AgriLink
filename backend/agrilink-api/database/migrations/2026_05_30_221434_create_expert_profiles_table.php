<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('speciality');
            $table->text('bio')->nullable();

            $table->integer('experience_years')->default(0);
            $table->string('education_level')->nullable();

            $table->string('certification_file')->nullable();

            $table->string('region')->nullable();
            $table->string('city')->nullable();
            $table->string('intervention_zone')->nullable();

            $table->string('whatsapp_number')->nullable();
            $table->string('email_contact')->nullable();

            $table->boolean('is_verified')->default(false);
            $table->boolean('is_premium')->default(false);

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'suspended'
            ])->default('pending');

            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_profiles');
    }
};