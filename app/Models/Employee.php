<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';
    protected $primaryKey = 'id_employee';
    protected $fillable = [
        'name', 'gender', 'cccd', 'date_of_birth', 'address', 
        'email', 'phone', 'hire_date', 'id_department', 
        'id_position', 'status', 'description'
    ];

    // Quan hệ
    public function department()
    {
        return $this->belongsTo(Department::class, 'id_department', 'id_department');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'id_position', 'id_position');
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'id_employee_manager', 'id_employee');
    }

    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'id_employee_manager', 'id_employee');
    }

    public function users()
    {
        return $this->hasOne(User::class, 'id_employee', 'id_employee');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'id_employee', 'id_employee');
    }

    public function salaries()
    {
        return $this->hasMany(Salary::class, 'id_employee', 'id_employee');
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class, 'id_employee', 'id_employee');
    }

    public function performanceReviews()
    {
        return $this->hasMany(PerformanceReview::class, 'id_employee', 'id_employee');
    }

    public function assignedProjects()
    {
        return $this->belongsToMany(Project::class, 'assignments', 'id_employee', 'id_project')
                    ->withPivot('role', 'assigned_date', 'description', 'created_at', 'updated_at');
    }
}
