<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with(['employee','role'])->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_employee' => 'required|unique:users,id_employee|exists:employees,id_employee',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'id_role' => 'required|exists:roles,id_role',
            'description' => 'nullable|string'
        ]);

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function show($id)
    {
        return response()->json(User::with(['employee','role'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee|unique:users,id_employee,'.$id.',id_user',
            'email' => 'required|email|unique:users,email,'.$id.',id_user',
            'password' => 'nullable|string|min:6',
            'id_role' => 'required|exists:roles,id_role',
            'description' => 'nullable|string'
        ]);

        if(!empty($data['password'])){
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
}
