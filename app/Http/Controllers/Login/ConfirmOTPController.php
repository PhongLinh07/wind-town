<?php

namespace App\Http\Controllers\Login;
use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Http\Request;

class ConfirmOTPController extends Controller
{
    // Hiển thị form đăng nhập
    public function showForm() 
    {
        return view('fornt.login.confirmOTP'); // Trả về view Blade: resources/views/backend/login.blade.php
    }

    // Xử lý form đăng nhập
    public function checkOTP(Request $request) 
    {
        // Lấy dữ liệu email và password từ form
        $credentials = $request->only('OTP');

        // Kiểm tra tạm thời (demo): nếu email và password đúng
        if($credentials['OTP'] === '0000')
        {
            return redirect()->route('passwordRecovery'); // Chuyển tới trang dashboard
        }

        // Nếu sai → quay lại form login, kèm thông báo lỗi
        return back()->withErrors(['confirmOTP_error' => 'Invalid or incorrect information']);
    }
}
