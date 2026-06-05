<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpertProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'speciality',
        'bio',
        'experience_years',
        'education_level',
        'certification_file',
        'region',
        'city',
        'intervention_zone',
        'whatsapp_number',
        'email_contact',
        'is_verified',
        'is_premium',
        'status',
        'photo',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_premium' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class);
    }
}