<?php

namespace App\Http\Controllers\Models;
use App\Http\Controllers\Controller;

use App\Models\SalaryDetail;
use Illuminate\Http\Request;

class SalaryDetailController extends Controller
{
    public function index()
    {
        return SalaryDetail::with(['contract', 'approvedBy'])->get();
    }

    public function show($id)
    {
        return SalaryDetail::with(['contract', 'approvedBy'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_contract' => 'nullable|exists:contracts,id_contract',
            'approved_by' => 'nullable|exists:employees,id_employee',
            'salary_month' => 'nullable|date_format:Y-m-d',
            'base_salary' => 'nullable|numeric|min:0',
            'salary_multiplier' => 'nullable|numeric|min:0',
            'office_hours' => 'nullable|numeric|min:0',
            'over_time' => 'nullable|numeric|min:0',
            'late_time' => 'nullable|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'attendance_bonus' => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
            'net_salary' => 'nullable|numeric|min:0',
            'status' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        // check unique (id_contract, salary_month)
        $exists = SalaryDetail::where('id_contract', $data['id_contract'])
            ->where('salary_month', $data['salary_month'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Bản ghi lương cho hợp đồng này đã tồn tại trong tháng'], 422);
        }
        
        $salaryDetail = SalaryDetail::create($data);

        return response()->json($salaryDetail, 201);
    }

    public function update(Request $request, $id)
    {
        $salary = SalaryDetail::findOrFail($id);

        $validated = $request->validate([
            'description' => 'sometimes|string',
            'bonus' => 'sometimes|numeric|min:0',
            'attendance_bonus' => 'sometimes|numeric|min:0',
            'deduction' => 'sometimes|numeric|min:0',
            'net_salary' => 'sometimes|numeric|min:0',
        ]);

        $salary->update($validated);

        return response()->json($salary);
    }

    public function destroy($id)
    {
        $salary = SalaryDetail::findOrFail($id);
        $salary->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
