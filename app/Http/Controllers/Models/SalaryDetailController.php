<?php

namespace App\Http\Controllers\Models;
use App\Http\Controllers\Controller;  // <- thêm dòng này

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
        'id_contract' => 'required|exists:contracts,id_contract',
        'approved_by' => 'nullable|exists:employees,id_employee',
        'salary_month' => 'required|date_format:Y-m-d',
        
        'overtime' => 'nullable|numeric|min:0',
        'bonus' => 'nullable|numeric|min:0',
        'attendance_bonus' => 'nullable|numeric|min:0',
        'deduction' => 'nullable|numeric|min:0',
        'net_salary' => 'required|numeric|min:0',
        
        'status' => ['nullable', Rule::in(['pending','paid'])],
        'description' => 'nullable|string',
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
            'description' => 'sometimes|string'
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
