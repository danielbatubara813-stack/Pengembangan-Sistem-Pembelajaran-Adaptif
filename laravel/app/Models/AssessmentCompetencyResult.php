<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentCompetencyResult extends Model
{
    protected $fillable = [
        'user_id', 'assessment_id', 'retest_id', 'competency_id', 'score', 'correct_count',
        'total_questions', 'target_score', 'status', 'difficulty_scores', 'evidence', 'diagnosis',
        'evaluated_at',
    ];

    protected $casts = [
        'difficulty_scores' => 'array',
        'evidence' => 'array',
        'evaluated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function retest()
    {
        return $this->belongsTo(Retest::class);
    }

    public function competency()
    {
        return $this->belongsTo(LearningCompetency::class, 'competency_id');
    }
}
