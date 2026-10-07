<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic',
        'type',
        'title',
        'description',
        'url',
        'embed_video_url',
        'publisher',
        'estimated_minutes',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_recommendation_progress')
                    ->withPivot('is_completed', 'completed_at')
                    ->withTimestamps();
    }
}
