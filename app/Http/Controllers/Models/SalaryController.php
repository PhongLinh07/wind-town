<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Salary;

class SalaryController extends Controller
{
    public function index()
    {
        return response()->json(Salary::with('employee')->get());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'month' => 'required|date_format:Y-m',
            'base_salary' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'allowance' => 'nullable|numeric',
            'deduction' => 'nullable|numeric',
            'net_salary' => 'nullable|numeric',
            'status' => 'nullable|in:pending,paid',
            'description' => 'nullable|string'
        ]);
        */

        $data  = [];
        $salary = Salary::create($data);
        return response()->json($salary, 201);
    }

    public function show($id)
    {
        return response()->json(Salary::with('employee')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $salary = Salary::findOrFail($id);
        $data = $request->validate([
            'base_salary' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'allowance' => 'nullable|numeric',
            'deduction' => 'nullable|numeric',
            'net_salary' => 'nullable|numeric',
            'status' => 'nullable|in:pending,paid',
            'description' => 'nullable|string'
        ]);

        $salary->update($data);
        return response()->json($salary);
    }

    public function destroy($id)
    {
        $salary = Salary::findOrFail($id);
        $salary->delete();
        return response()->json(null, 204);
    }
}
