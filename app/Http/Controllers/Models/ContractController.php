<?php

namespace App\Http\Controllers\Models;
use App\Http\Controllers\Controller;

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
            'contract_type' => 'required|in:1,2,3',
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
            'contract_type' => 'sometimes|in:1,2,3',
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
        
        // Kiểm tra hợp đồng đã hết hạn ít nhất 3 tháng chưa
        if (!$contract->expiry_date) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa hợp đồng không có ngày hết hạn.'
            ], 400);
        }
        
        $expiryDate = Carbon::parse($contract->expiry_date);
        $threeMonthsAgo = Carbon::now()->subMonths(3);
        
        if ($expiryDate->gt($threeMonthsAgo)) {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể xóa hợp đồng đã hết hạn ít nhất 3 tháng.'
            ], 400);
        }
        
        // Kiểm tra hợp đồng có đang được sử dụng trong bảng salary_details không
        if ($contract->salaryDetails()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa hợp đồng đang được sử dụng trong bảng lương (salary_details).'
            ], 400);
        }

        $contract->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }

    public function checkUsage($id)
    {
        $contract = Contract::findOrFail($id);
        
        $usageLocation = [];
        
        // Kiểm tra sử dụng trong bảng salary_details
        if ($contract->salaryDetails()->exists()) {
            $usageLocation[] = 'salary_details';
        }
        
        return response()->json([
            'isUsed' => !empty($usageLocation),
            'usageLocation' => !empty($usageLocation) ? implode(', ', $usageLocation) : 'none'
        ]);
    }

    public function activeCheck($idEmployee)
    {
        $activeContract = Contract::where('id_employee', $idEmployee)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            })
            ->first();

        return response()->json([
            'hasActive' => $activeContract ? true : false,
            'data' => $activeContract
        ]);
    }



    public function getContractsByCycle($idEmployee, Request $request)
{
    $startDate = $request->query('start');
    $endDate = $request->query('end');

    // 1️⃣ Kiểm tra contract active trước
    $activeContract = Contract::where('id_employee', $idEmployee)
        ->where('status', 'active')
        ->first();

    if ($activeContract) {
        return response()->json(['data' => $activeContract]);
    }

    // 2️⃣ Nếu không có active, lấy contract đã hết hạn trong khoảng
    $expiredContract = Contract::where('id_employee', $idEmployee)
        ->where('status', '!=', 'active')
        ->whereBetween('expiry_date', [$startDate, $endDate])
        ->orderBy('expiry_date', 'desc')
        ->first();

    return response()->json(['data' => $expiredContract]);
}


}