<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    
    protected $table = 'employees';
    protected $primaryKey = 'id_employee';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'gender',
        'cccd',
        'date_of_birth',
        'address',
        'email',
        'phone',
        'bank_infor',
        'hire_date',
        'id_hierarchy',
        'status',
        'description'
    ];

    public static function tableName()
    {
        return (new static)->getTable(); // getTable() là method của Eloquent Model
    }

    public function hierarchy()
    {
        return $this->belongsTo(Hierarchy::class, 'id_hierarchy');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'id_employee');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'id_employee');
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class, 'id_employee');
    }

    public function approvedLeaves()
    {
        return $this->hasMany(Leave::class, 'approved_by');
    }

    public function approvedSalaryDetails()
    {
        return $this->hasMany(SalaryDetail::class, 'approved_by');
    }
}
