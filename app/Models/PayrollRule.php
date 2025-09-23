<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PayrollRule extends Model
{
    protected $table = 'payroll_rules';
    protected $primaryKey = 'id_rule';

    protected $fillable = [
        'type', 'value_type', 'value',
        'effective_date', 'expiry_date', 'description'
    ];

    // Hàm lấy rule theo type, auto tạo nếu chưa có
    public static function getRule($type, $defaultValue = 0, $defaultValueType = 'fixed_amount')
    {
        $today = Carbon::today();

        $rule = self::where('type', $type)
            ->where('effective_date', '<=', $today)
            ->where(function($q) use ($today) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', $today);
            })
            ->first();

        if (!$rule) {
            $rule = self::create([
                'type' => $type,
                'value_type' => $defaultValueType,
                'value' => $defaultValue,
                'effective_date' => $today,
                'description' => "Default auto-generated rule for {$type}"
            ]);
        }

        return $rule;
    }
}
