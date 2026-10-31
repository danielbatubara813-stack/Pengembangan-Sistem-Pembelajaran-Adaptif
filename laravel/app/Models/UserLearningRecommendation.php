<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLearningRecommendation extends Model
{
    protected $fillable = [
        'user_id', 'recommendation_id', 'assessment_id', 'retest_id',
        'competency_result_id', 'status', 'recommended_at',
    ];

    protected $casts = ['recommended_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recommendation()
    {
        return $this->belongsTo(Recommendation::class);
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function retest()
    {
        return $this->belongsTo(Retest::class);
    }

    public function competencyResult()
    {
        return $this->belongsTo(AssessmentCompetencyResult::class);
    }
}
