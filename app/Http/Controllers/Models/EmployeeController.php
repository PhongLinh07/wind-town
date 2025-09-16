<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Employee;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function index()
    {
        return response()->json(Employee::with(['department','position','manager'])->get());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'name' => 'required|string',
            'gender' => 'required|integer',
            'cccd' => 'required|unique:employees,cccd',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string',
            'hire_date' => 'nullable|date',
            'id_department' => 'required|exists:departments,id_department',
            'id_position' => 'required|exists:positions,id_position',
            'status' => 'required|in:active,inactive,resigned',
            'description' => 'nullable|string'
        ]);*/

        $data = [];

        $employee = Employee::create($data);
        return response()->json($employee, 201);
    }

    public function show($id)
    {
        return response()->json(Employee::with(['department','position','manager','subordinates'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string',
            'gender' => 'required|integer',
            'cccd' => 'required|unique:employees,cccd,'.$id.',id_employee',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'email' => 'required|email|unique:employees,email,'.$id.',id_employee',
            'phone' => 'nullable|string',
            'hire_date' => 'nullable|date',
            'id_department' => 'required|exists:departments,id_department',
            'id_position' => 'required|exists:positions,id_position',
            'status' => 'required|in:active,inactive,resigned',
            'description' => 'nullable|string'
        ]);
        $employee->update($data);
        return response()->json($employee);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        return response()->json(null, 204);
    }
}
