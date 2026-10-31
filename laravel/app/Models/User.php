<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'nim',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }

    public function skillGaps(): HasMany
    {
        return $this->hasMany(SkillGap::class);
    }

    public function retests(): HasMany
    {
        return $this->hasMany(Retest::class);
    }

    public function recommendations(): BelongsToMany
    {
        return $this->belongsToMany(Recommendation::class, 'user_recommendation_progress')
            ->withPivot('is_completed', 'completed_at')
            ->withTimestamps();
    }

    public function progress()
    {
        return $this->hasOne(UserProgress::class);
    }

    public function competencyResults()
    {
        return $this->hasMany(AssessmentCompetencyResult::class);
    }

    public function learningRecommendationHistory()
    {
        return $this->hasMany(UserLearningRecommendation::class);
    }
}
