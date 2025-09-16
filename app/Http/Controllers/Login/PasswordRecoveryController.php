<?php

namespace App\Http\Controllers\Login;
use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Http\Request;

class PasswordRecoveryController extends Controller
{
    // Hiển thị form đăng nhập
    public function showForm() 
    {
        return view('fornt.login.passwordRecovery'); // Trả về view Blade: resources/views/backend/login.blade.php
    }

    // Xử lý form đăng nhập
    public function login(Request $request) 
    {
        // Lấy dữ liệu email và password từ form
        $credentials = $request->only('newPassword', 'confirmNewPassword');

        if (empty($credentials['newPassword']) || empty($credentials['confirmNewPassword'])) 
        {
            return back()->withErrors(['passwordRecovery_error' => 'Password not empty']);
        }

        // Kiểm tra tạm thời (demo): nếu email và password đúng
        if($credentials['newPassword'] != $credentials['confirmNewPassword']) 
        {
            return back()->withErrors(['passwordRecovery_error' => 'newPassword different confirmNewPassword']);
        }

        // Nếu sai → quay lại form login, kèm thông báo lỗi
        return redirect()->route('login')->with('passwordRecovery_success', 'Recovery Password successed ');;
    }
}
