<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeManager extends Model
{
    use HasFactory;

    protected $table = 'employee_manager';
    protected $primaryKey = 'id_employee_manager';
    protected $fillable = ['id_employee','id_manager'];

    // Quan hệ tới Employee
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee', 'id_employee');
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'id_manager', 'id_employee');
    }
}
