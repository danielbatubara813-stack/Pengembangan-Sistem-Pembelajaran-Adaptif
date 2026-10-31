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
        'competency_id',
        'source_domain',
        'search_provider',
        'search_query',
        'url_hash',
        'validation_status',
        'content_status',
        'embedding_status',
        'match_score',
        'match_reason',
        'resource_metadata',
        'validated_at',
        'last_checked_at',
    ];

    protected $casts = [
        'resource_metadata' => 'array',
        'validated_at' => 'datetime',
        'last_checked_at' => 'datetime',
    ];

    public function competency()
    {
        return $this->belongsTo(LearningCompetency::class, 'competency_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_recommendation_progress')
                    ->withPivot('is_completed', 'completed_at')
                    ->withTimestamps();
    }

    public function userRecommendationHistory()
    {
        return $this->hasMany(UserLearningRecommendation::class);
    }
}
