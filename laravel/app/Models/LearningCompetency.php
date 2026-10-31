<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningCompetency extends Model
{
    protected $fillable = [
        'competency_key', 'topic', 'name', 'description', 'learning_objective',
        'example_code', 'practice_prompt',
    ];

    public function assessmentResults()
    {
        return $this->hasMany(AssessmentCompetencyResult::class, 'competency_id');
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class, 'competency_id');
    }
}
