<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string'
        ]);
        */
        $data = [];
        $role = Role::create($data);
        return response()->json($role, 201);
    }

    public function show($id)
    {
        return response()->json(Role::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|unique:roles,name,'.$id.',id_role',
            'description' => 'nullable|string'
        ]);
        $role->update($data);
        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(null, 204);
    }
}
