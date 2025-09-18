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
        $validated = $request->validate([
            'id_contract' => 'required|exists:contracts,id_contract',
            'approved_by' => 'required|exists:employees,id_employee',
            'salary_month' => 'required|date',
            'overtime' => 'nullable|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'attendance_bonus' => 'nullable|numeric|min:0',
            'deduction' => 'nullable|numeric|min:0',
            'net_salary' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,paid',
            'description' => 'nullable|string',
        ]);

        $contractOwnerId = \App\Models\Contract::findOrFail($validated['id_contract'])->id_employee;

        if (!SalaryDetail::validateApprover($contractOwnerId, $validated['approved_by'])) {
            return response()->json([
                'success' => false,
                'message' => 'Người duyệt không được là chính nhân viên.'
            ], 400);
        }

        $validated['status'] = $validated['status'] ?? 'pending';
        $salary = SalaryDetail::create($validated);

        return response()->json($salary, 201);
    }

    public function update(Request $request, $id)
    {
        $salary = SalaryDetail::findOrFail($id);

        $validated = $request->validate([
            'overtime' => 'sometimes|numeric|min:0',
            'bonus' => 'sometimes|numeric|min:0',
            'attendance_bonus' => 'sometimes|numeric|min:0',
            'deduction' => 'sometimes|numeric|min:0',
            'net_salary' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,paid',
            'description' => 'sometimes|string',
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
