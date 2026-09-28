<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertRating extends Model
{
    protected $fillable = [
        'expert_profile_id',
        'user_id',
        'rating',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function expertProfile(): BelongsTo
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}