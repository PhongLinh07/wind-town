<?php


namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use App\Models\PayrollRule;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PayrollRuleController extends Controller
{
    // Lấy tất cả quy định lương
    public function index()
    {
        $rules = PayrollRule::all();
        return response()->json($rules);
    }

    // Lấy 1 bản ghi theo ID
    public function show($id)
    {
        $rule = PayrollRule::findOrFail($id);
        return response()->json($rule);
    }

    // ===================
// Tạo mới
// ===================
public function store(Request $request)
{
    $data = $request->validate([
        'type' => [
            'required',
            'string',
            Rule::unique('payroll_rules', 'type') // type duy nhất
        ],
        'value_type' => [
            'required',
            Rule::in(['percentage','fixed_amount'])
        ],
        'value' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'effective_date' => 'required|date',
        'expiry_date' => 'nullable|date|after_or_equal:effective_date',
    ]);

    $rule = PayrollRule::create($data);
    return response()->json($rule, 201);
}

// ===================
// Cập nhật
// ===================
public function update(Request $request, $id)
{
    $rule = PayrollRule::findOrFail($id);

    $data = $request->validate([
        'type' => [
            'required',
            'string',
            Rule::unique('payroll_rules', 'type')->ignore($rule->id_rule, 'id_rule')
        ],
        'value_type' => [
            'required',
            Rule::in(['percentage','fixed_amount'])
        ],
        'value' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'effective_date' => 'required|date',
        'expiry_date' => 'nullable|date|after_or_equal:effective_date',
    ]);

    $rule->update($data);
    return response()->json($rule);
}

    // Xóa
    public function destroy($id)
    {
        $rule = PayrollRule::findOrFail($id);
        $rule->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }


    // API: lấy rule theo type, auto tạo mặc định nếu chưa có
    public function getRule(Request $request, $type)
    {
        $defaultValue = $request->query('defaultValue', 0);
        $defaultValueType = $request->query('defaultValueType', 'fixed_amount');

        $rule = PayrollRule::getRule($type, $defaultValue, $defaultValueType);

        return response()->json($rule);
    }
}
