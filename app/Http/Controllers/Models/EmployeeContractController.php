<?php

namespace App\Http\Controllers\Models;
use App\Http\Controllers\Controller;  // <- thêm dòng này

use App\Models\Employee;
use App\Models\Contract;
use Illuminate\Http\Request;

class EmployeeContractController extends Controller
{
    public function index(Employee $employee)
    {
        return response()->json($employee->contracts);
    }

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'contract_type' => 'required|string|max:255',
            'effective_date'    => 'required|date',
            'expiry_date'      => 'nullable|date',
        ]);

        $contract = $employee->contracts()->create($validated);
        return response()->json($contract, 201);
    }

    public function show(Employee $employee, Contract $contract)
    {
        return response()->json($contract);
    }

    public function update(Request $request, Employee $employee, Contract $contract)
    {
        $validated = $request->validate([
            'contract_type' => 'sometimes|in:fixed_term,indefinite,seasonal',
            'base_salary' => 'sometimes|numeric|min:0',
            'effective_date' => 'sometimes|date',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date'
        ]);
        

        $contract->update($validated);
        return response()->json($contract);
    }

    public function destroy(Employee $employee, Contract $contract)
    {
        $contract->delete();
        return response()->json(['message' => 'Contract deleted']);
    }
}
