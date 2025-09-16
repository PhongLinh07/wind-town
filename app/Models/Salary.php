<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;

    protected $table = 'salaries';
    protected $primaryKey = 'id_salary';
    protected $fillable = ['id_employee', 'month', 'base_salary', 'bonus', 'allowance', 'deduction', 'net_salary', 'status', 'description'];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee', 'id_employee');
    }
}
