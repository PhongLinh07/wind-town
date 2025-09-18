<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    protected $table = 'leaves';
    protected $primaryKey = 'id_leave';
    public $timestamps = true;

    protected $fillable = [
        'id_employee',
        'approved_by',
        'start_date',
        'end_date',
        'type',
        'reason',
        'status',
        'description'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee');
    }

    public function approver()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    // Ràng buộc: không tự duyệt
    public static function validateApprover($employeeId, $approverId)
    {
        return $employeeId !== $approverId;
    }
}
