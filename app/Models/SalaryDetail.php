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
        'overtime',
        'bonus',
        'attendance_bonus',
        'deduction',
        'net_salary',
        'status',
        'description'
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'id_contract');
    }

    public function approvedBy()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    // Ràng buộc: không tự duyệt
    public static function validateApprover($contractOwnerId, $approverId)
    {
        return $contractOwnerId !== $approverId;
    }
}
