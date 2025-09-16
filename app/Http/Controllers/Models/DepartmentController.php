<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Department;
use Carbon\Carbon;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::all());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate
        ([
            'name' => 'required|unique:departments,name',
            'description' => 'nullable|string'
        ]);
        */
        $data = [];
        $department = Department::create($data);
        return response()->json($department, 201);
    }

    public function show($id)
    {
        return response()->json(Department::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|unique:departments,name,'.$id.',id_department',
            'description' => 'nullable|string'
        ]);
        $department->update($data);
        return response()->json($department);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return response()->json(null, 204);
    }
}
