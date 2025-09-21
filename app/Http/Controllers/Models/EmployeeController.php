<?php


namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Models\Hierarchy;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return response()->json(Employee::with('hierarchy')->get());
    }

    public function show($id)
    {
        return Employee::with(['hierarchy', 'attendances', 'contracts', 'leaves'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',  // có thể null và rỗng
            'gender' => 'nullable|integer|in:0,1,3', // có thể null và rỗng
            'cccd' => 'required|string|max:20|unique:employees,cccd', // bắt buộc
            'date_of_birth' => 'nullable|date', // có thể null và rỗng
            'address' => 'nullable|string|max:300', // có thể null và rỗng
            'email' => 'nullable|email', // có thể null và rỗng
            'phone' => 'nullable|string|max:15', // có thể null và rỗng
            'bank_infor' => 'nullable|string|max:20', // có thể null và rỗng
            'hire_date' => 'nullable|date', // có thể null và rỗng
            'id_hierarchy' => 'required|exists:hierarchys,id_hierarchy', // có thể null và rỗng
            'description' => 'nullable|string', // có thể null và rỗng
        ]);

        $employee = Employee::create($validated);

        return response()->json($employee, 201);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'gender' => 'sometimes|integer|in:0,1,3',
            'cccd' => 'sometimes|string|max:20|unique:employees,cccd,' . $id . ',id_employee',
            'date_of_birth' => 'sometimes|date',
            'address' => 'sometimes|string|max:300',
            'email' => 'sometimes|email|unique:employees,email,' . $id . ',id_employee',
            'phone' => 'sometimes|string|max:15',
            'bank_infor' => 'sometimes|string|max:20',
            'hire_date' => 'sometimes|date',
            'id_hierarchy' => 'sometimes|exists:hierarchys,id_hierarchy',
            'status' => 'sometimes|in:active,inactive,resigned',
            'description' => 'sometimes|string',
        ]);

        $employee->update($validated);

        return response()->json( Employee::with('hierarchy')->findOrFail($employee->id_employee), 200);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }


    public function getEnumColumn(string $column)
    {
        $table = Employee::tableName(); // Lấy tên bảng từ model
        $columnType = DB::table($table)->pluck($column);

        return response()->json($columnType);
    }

    
}
