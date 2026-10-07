<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'score',
        'total_questions',
        'correct_count',
        'level',
        'topic_scores',
        'ai_summary',
        'ai_action_plan',
        'completed_at',
    ];

    protected $casts = [
        'topic_scores' => 'array',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function skillGaps()
    {
        return $this->hasMany(SkillGap::class);
    }

    public function retest()
    {
        return $this->hasOne(Retest::class, 'initial_assessment_id');
    }
}
