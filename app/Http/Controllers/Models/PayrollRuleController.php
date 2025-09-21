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

    // Tạo mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'nullable|string',
            'value_type' => ['nullable', Rule::in(['money','multiplier'])],
            'value' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'effective_date' => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date',
        ]);

      
        $rule = PayrollRule::create($data);
        return response()->json($rule, 201);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $rule = PayrollRule::findOrFail($id);

        $data = $request->validate([
            'type' => 'nullable|string',
            'value_type' => ['nullable', Rule::in(['money','multiplier'])],
            'value' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'effective_date' => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date',
        ]);

        if (!isset($data['value_type'])) {
            $data['value_type'] = 'money';
        }

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
}
