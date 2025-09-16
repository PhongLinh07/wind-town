<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\EmployeeManager;

class EmployeeManagerController extends Controller
{
    // Lấy tất cả quan hệ nhân viên - quản lý
    public function index()
    {
        return response()->json(EmployeeManager::with(['employee','manager'])->get());
    }

    // Thêm quan hệ nhân viên - quản lý mới
    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'id_manager' => 'required|exists:employees,id_employee'
        ]);
        */
        $data = [];
        // Kiểm tra đã tồn tại quan hệ chưa
        $exists = EmployeeManager::where('id_employee', $data['id_employee'])
            ->where('id_manager', $data['id_manager'])
            ->exists();

        if($exists){
            return response()->json(['error'=>'Relationship already exists'], 400);
        }

        $relation = EmployeeManager::create($data);
        return response()->json($relation, 201);
    }

    // Lấy quan hệ theo id_employee_manager
    public function show($id)
    {
        return response()->json(EmployeeManager::with(['employee','manager'])->findOrFail($id));
    }

    // Cập nhật quản lý của nhân viên
    public function update(Request $request, $id)
    {
        $relation = EmployeeManager::findOrFail($id);

        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'id_manager' => 'required|exists:employees,id_employee'
        ]);

        // Kiểm tra trùng lặp
        $exists = EmployeeManager::where('id_employee', $data['id_employee'])
            ->where('id_manager', $data['id_manager'])
            ->where('id_employee_manager', '!=', $id)
            ->exists();

        if($exists){
            return response()->json(['error'=>'Relationship already exists'], 400);
        }

        $relation->update($data);
        return response()->json($relation);
    }

    // Xóa quan hệ
    public function destroy($id)
    {
        $relation = EmployeeManager::findOrFail($id);
        $relation->delete();
        return response()->json(null, 204);
    }
}
