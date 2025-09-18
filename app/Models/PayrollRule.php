<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollRule extends Model
{
    protected $table = 'payroll_rules';
    protected $primaryKey = 'id_rule';
    public $timestamps = true;

    protected $fillable = [
        'type',
        'value_type',
        'value',
        'description',
        'effective_date',
        'expiry_date'
    ];
}
