<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
        'passing_score',
    ];

    protected $casts = [
        'passing_score' => 'integer',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class)
            ->orderBy('position');
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
}