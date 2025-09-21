<?php

namespace App\Http\Controllers\Models;
use App\Http\Controllers\Controller;  // <- thêm dòng này

use App\Models\Contract;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ContractController extends Controller
{
    public function index()
    {
        return Contract::with('employee')->get();
    }

    public function show($id)
    {
        return Contract::with('employee', 'salaryDetails')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_employee' => 'required|exists:employees,id_employee',
            'contract_type' => 'required|in:fixed_term,indefinite,seasonal',
            'base_salary' => 'required|numeric|min:0',
            'effective_date' => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date',
            'status' => 'nullable|in:active,expired,terminated',
            'description' => 'nullable|string',
        ]);

        // Kiểm tra hợp đồng active hiện tại
        if (Contract::hasActiveContract($validated['id_employee'])) {
            return response()->json([
                'success' => false,
                'message' => 'Nhân viên này vẫn còn hợp đồng hiệu lực.'
            ], 400);
        }

        $validated['status'] = $validated['status'] ?? 'active';
        $contract = Contract::create($validated);

        return response()->json($contract, 201);
    }

    public function update(Request $request, $id)
    {
        $contract = Contract::findOrFail($id);

        $validated = $request->validate([
            'contract_type' => 'sometimes|in:fixed_term,indefinite,seasonal',
            'base_salary' => 'sometimes|numeric|min:0',
            'effective_date' => 'sometimes|date',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date',
            'status' => 'sometimes|in:active,expired,terminated',
            'description' => 'sometimes|string',
        ]);

        // Nếu update status thành active thì check ràng buộc
        if (isset($validated['status']) && $validated['status'] === 'active') {
            if (Contract::hasActiveContract($contract->id_employee)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nhân viên này đã có hợp đồng active khác.'
                ], 400);
            }
        }

        $contract->update($validated);

        return response()->json($contract);
    }

    public function destroy($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function activeCheck($idEmployee)
    {
   
        $activeContract = Contract::where('id_employee', $idEmployee)
            ->where('status', 'active')
            ->where(function ($q) 
            {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            })
            ->first(); // lấy hợp đồng đầu tiên (nếu có)

            return response()->json([
            'hasActive' => $activeContract ? true : false,
            'data'  => $activeContract // null nếu không có
            ]);
    
    }

}
