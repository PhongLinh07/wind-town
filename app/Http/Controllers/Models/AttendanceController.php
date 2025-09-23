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

    public function getByCycle($idEmployee, $startDate, $endDate)
    {
        $attendances = Attendance::where('id_employee', $idEmployee)
            ->whereBetween('of_date', [$startDate, $endDate])
            ->orderBy('of_date', 'asc')
            ->get();

        return response()->json(['datas' => $attendances ]);
    }

}
