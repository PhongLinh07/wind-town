<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryDetail extends Model
{
    protected $table = 'salary_details';
    protected $primaryKey = 'id_salary_details';
    public $timestamps = true;

    protected $fillable = [
        'id_contract',
    'approved_by',
    'salary_month',
    'base_salary',
    'salary_multiplier',
    'office_hours',
    'over_time',
    'late_time',
    'bonus',
    'attendance_bonus',
    'deduction',
    'net_salary',
    'status',
    'description',
    ];

    /**
     * Liên kết đến hợp đồng
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'id_contract');
    }

    /**
     * Liên kết đến người duyệt lương
     */
    public function approvedBy()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }
}
