<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Support\Facades\DB;
use App\Models\Hierarchy;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HierarchyController extends Controller
{
    // Lấy tất cả dữ liệu (có thể dùng cho Tabulator ajaxURL)
    public function index()
    {
        $hierarchies = Hierarchy::all();
        return response()->json($hierarchies);
    }

    // Lấy 1 bản ghi theo ID
    public function show($id)
    {
        $hierarchy = Hierarchy::findOrFail($id);
        return response()->json($hierarchy);
    }

    // Tạo mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_position' => 'required|string|max:100|unique:hierarchys,name_position,NULL,id_hierarchy,name_level,' . ($request->name_level ?? ''),
            'name_level' => 'required|string|max:50',
            'salary_multiplier' => 'nullable|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $hierarchy = Hierarchy::create($data);
        return response()->json($hierarchy, 201);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $hierarchy = Hierarchy::findOrFail($id);

        $data = $request->validate([
            'name_position' => [
                'required',
                'string',
                'max:100',
                Rule::unique('hierarchy')->ignore($hierarchy->id_hierarchy)->where(function ($query) use ($request) {
                    return $query->where('name_level', $request->name_level);
                }),
            ],
            'name_level' => 'required|string|max:50',
            'salary_multiplier' => 'nullable|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $hierarchy->update($data);
        return response()->json($hierarchy);
    }

    // Xóa
    public function destroy($id)
    {
        $hierarchy = Hierarchy::findOrFail($id);
        $hierarchy->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

   
    public function getEnumColumn(string $column)
{
    $table = Hierarchy::tableName(); // Lấy tên bảng từ model

    // Lấy các giá trị duy nhất trong cột
    $values = DB::table($table)->select($column)->distinct()->pluck($column);

    // Chuyển thành associative array { value: value }
    $json = [];
    foreach ($values as $value) { $json[$value] = $value; }

    return response()->json($json);
}

    
}