<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendances';
    protected $primaryKey = 'id_attendance';
    protected $fillable = ['id_employee', 'check_in', 'check_out', 'work_hours', 'status', 'description'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee', 'id_employee');
    }
}
