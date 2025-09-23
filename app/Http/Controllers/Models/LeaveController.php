<?php

namespace App\Http\Controllers\Models;

use App\Http\Controllers\Controller;  // <- thêm dòng này

use App\Models\Leave;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function index()
    {
        return Leave::with(['employee', 'approver'])->get();
    }

    public function show($id)
    {
        return Leave::with(['employee', 'approver'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'approved_by' => 'required|exists:employees,id_employee',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|in:annual,sick,unpaid,other',
            'reason' => 'nullable|string',
            'status' => 'nullable|in:pending,approved,rejected',
            'description' => 'nullable|string',
        ]);

        if (!Leave::validateApprover($validated['id_employee'], $validated['approved_by'])) {
            return response()->json([
                'success' => false,
                'message' => 'Người duyệt không được là chính nhân viên.'
            ], 400);
        }

        $validated['status'] = $validated['status'] ?? 'pending';
        $leave = Leave::create($validated);

        return response()->json($leave, 201);
    }

    public function update(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);

        $validated = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'type' => 'sometimes|in:paid,unpaid',
            'reason' => 'sometimes|string',
            'status' => 'sometimes|in:pending,approved,rejected',
            'description' => 'sometimes|string',
        ]);

        $leave->update($validated);

        return response()->json($leave);
    }

    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
