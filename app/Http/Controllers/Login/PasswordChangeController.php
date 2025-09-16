<?php

namespace App\Http\Controllers\Login;
use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Http\Request;

class PasswordChangeController extends Controller
{
    // Hiển thị form đăng nhập
    public function showForm() 
    {
        return view('fornt.login.passwordChange'); // Trả về view Blade: resources/views/backend/login.blade.php
    }

    // Xử lý form đăng nhập
    public function login(Request $request) 
    {
        // Lấy dữ liệu email và password từ form
        $credentials = $request->only('email', 'password');

        // Kiểm tra tạm thời (demo): nếu email và password đúng
        if($credentials['email'] === 'admin@laravel.test' && $credentials['password'] === '123456') {
            return redirect('backend/welcome/backend'); // Chuyển tới trang welcome
        }

        // Nếu sai → quay lại form login, kèm thông báo lỗi
        return back()->withErrors(['email' => 'Thông tin đăng nhập sai']);
    }
}
