<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Leave;

class LeaveController extends Controller
{
    public function index()
    {
        return response()->json(Leave::with('employee')->get());
    }

    public function store(Request $request)
    {
        /*
        $data = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:annual,sick,unpaid,other',
            'reason' => 'nullable|string',
            'status' => 'nullable|in:pending,approved,rejected',
            'description' => 'nullable|string'
        ]);
        */
        $data = [];
        $leave = Leave::create($data);
        return response()->json($leave, 201);
    }

    public function show($id)
    {
        return response()->json(Leave::with('employee')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);
        $data = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'nullable|in:annual,sick,unpaid,other',
            'reason' => 'nullable|string',
            'status' => 'nullable|in:pending,approved,rejected',
            'description' => 'nullable|string'
        ]);

        $leave->update($data);
        return response()->json($leave);
    }

    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();
        return response()->json(null, 204);
    }
}
