<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpertProfile extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'speciality',
    'region',
    'city',
    'experience_years',
    'bio',
    'photo',
    'email_contact',
    'phone',
    'whatsapp_number',
    'status',
    'is_verified',
    'average_rating',
    'reviews_count',
];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class);
    }

    public function ratings(): HasMany
{
    return $this->hasMany(ExpertRating::class);
}

public function getAverageRatingAttribute(): float
{
    return round((float) $this->ratings()->avg('rating'), 1);
}

public function getReviewsCountAttribute(): int
{
    return $this->ratings()->count();
}
}