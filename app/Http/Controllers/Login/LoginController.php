<?php

namespace App\Http\Controllers\Login;
use App\Http\Controllers\Controller;  // <- thêm dòng này
use Illuminate\Http\Request;

class LoginController extends Controller
{
    // Hiển thị form đăng nhập
    public function showForm() 
    {
        return view('fornt.login.login'); // Trả về view Blade: resources/views/backend/login.blade.php
    }

    // Xử lý form đăng nhập
    public function login(Request $request) 
    {
        // Lấy dữ liệu email và password từ form
        $credentials = $request->only('email', 'password');

        // Kiểm tra tạm thời (demo): nếu email và password đúng
        if($credentials['email'] === 'phong@gmail.com' && $credentials['password'] === '0000') {
            return redirect()->route('dashboard'); // Chuyển tới trang dashboard
        }

        // Nếu sai → quay lại form login, kèm thông báo lỗi
        return back()->withErrors(['login_error' => 'Thông tin đăng nhập sai']);
    }
}
