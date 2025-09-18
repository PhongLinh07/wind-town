<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Contract extends Model
{
    protected $table = 'contracts';
    protected $primaryKey = 'id_contract';
    public $timestamps = true;

    protected $fillable = [
        'id_employee',
        'contract_type',
        'base_salary',
        'effective_date',
        'expiry_date',
        'status',
        'description'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee');
    }

    public function salaryDetails()
    {
        return $this->hasMany(SalaryDetail::class, 'id_contract');
    }

    // Kiểm tra hợp đồng active còn tồn tại
    public static function hasActiveContract($employeeId)
    {
        return self::where('id_employee', $employeeId)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            })
            ->exists();
    }
}
