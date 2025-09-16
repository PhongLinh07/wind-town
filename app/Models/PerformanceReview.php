<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
    use HasFactory;

    protected $table = 'performance_reviews';
    protected $primaryKey = 'id_review';
    protected $fillable = ['id_employee', 'id_reviewer', 'review_date', 'score', 'comments', 'description'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee', 'id_employee');
    }

    public function reviewer()
    {
        return $this->belongsTo(Employee::class, 'id_reviewer', 'id_employee');
    }
}
