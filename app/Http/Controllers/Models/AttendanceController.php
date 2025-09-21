<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use Illuminate\Http\Request;
use App\Models\Attendance;

class AttendanceController extends Controller
{
    public function index()
    {
        return response()->json(Attendance::with('employee')->get());
    }

    public function store(Request $request)
    {
        $data = [];
        $attendance = Attendance::create($data);
        return response()->json($attendance, 201);
    }

    public function show($id)
    {
        return response()->json(Attendance::with('employee')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $data = $request->validate([
            'check_in' => 'nullable|date',
            'check_out' => 'nullable|date|after_or_equal:check_in',
            'work_hours' => 'nullable|numeric',
            'status' => 'nullable|in:present,absent,late,leave',
            'description' => 'nullable|string'
        ]);

        $attendance->update($data);
        return response()->json($attendance);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(null, 204);
    }
}
