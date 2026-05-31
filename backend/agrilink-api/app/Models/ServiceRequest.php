<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'expert_profile_id',
        'user_id',
        'subject',
        'message',
        'status',
        'requested_at',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
    ];

    public function expertProfile()
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}