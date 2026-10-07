<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'initial_assessment_id',
        'score',
        'correct_count',
        'total_questions',
        'level',
        'score_difference',
        'topic_scores',
        'ai_comparative_analysis',
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

    public function initialAssessment()
    {
        return $this->belongsTo(Assessment::class, 'initial_assessment_id');
    }

    public function answers()
    {
        return $this->hasMany(RetestAnswer::class);
    }
}
