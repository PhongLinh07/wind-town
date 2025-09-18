<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';
    protected $primaryKey = 'id_attendance';
    public $timestamps = true;

    protected $fillable = [
        'id_employee',
        'of_date',
        'office_hours',
        'over_time',
        'late_time',
        'is_night_shift',
        'description'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee');
    }
}
