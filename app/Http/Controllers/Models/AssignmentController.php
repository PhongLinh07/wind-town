<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\Employee;
use App\Models\Project;

class AssignmentController extends Controller
{
    // Lấy tất cả phân công
    public function index()
    {
        return response()->json(Assignment::with(['employee','project'])->get());
    }

    // Tạo phân công mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'id_project' => 'required|exists:projects,id_project',
            'role' => 'required|string',
            'assigned_date' => 'nullable|date',
            'description' => 'nullable|string'
        ]);

        $assignment = Assignment::create($data);
        return response()->json($assignment, 201);
    }

    // Lấy phân công theo id_employee + id_project
    public function show($id_employee, $id_project)
    {
        return response()->json(Assignment::with(['employee','project'])
            ->where('id_employee', $id_employee)
            ->where('id_project', $id_project)
            ->firstOrFail());
    }

    // Cập nhật phân công
    public function update(Request $request, $id_employee, $id_project)
    {
        $assignment = Assignment::where('id_employee', $id_employee)
            ->where('id_project', $id_project)
            ->firstOrFail();

        $data = $request->validate([
            'role' => 'sometimes|required|string',
            'assigned_date' => 'nullable|date',
            'description' => 'nullable|string'
        ]);

        $assignment->update($data);
        return response()->json($assignment);
    }

    // Xóa phân công
    public function destroy($id_employee, $id_project)
    {
        $assignment = Assignment::where('id_employee', $id_employee)
            ->where('id_project', $id_project)
            ->firstOrFail();

        $assignment->delete();
        return response()->json(null, 204);
    }
}
