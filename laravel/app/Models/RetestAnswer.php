<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetestAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'retest_id',
        'question_id',
        'selected_answer',
        'is_correct',
        'category',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function retest()
    {
        return $this->belongsTo(Retest::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
